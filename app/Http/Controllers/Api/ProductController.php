<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Validator;

class ProductController extends Controller
{
    /**
     * Cache TTL in seconds (30 minutes for listings, 1 hour for static)
     */
    const CACHE_TTL_LIST = 1800;   // 30 min
    const CACHE_TTL_STATIC = 3600; // 1 hour

    /**
     * Display a listing of products.
     */
    public function index(Request $request)
    {
        $version = Cache::get('products:cache_version', 1);
        // Build a unique cache key from all query params and the current global cache version
        $cacheKey = "products:index:v{$version}:" . md5(serialize($request->query()));

        $result = Cache::remember($cacheKey, self::CACHE_TTL_LIST, function () use ($request) {
            $query = Product::with('category');

            // Search — partial keyword match across name, name_hi, description, sku
            if ($request->filled('search')) {
                $query->search($request->search);
            }

            // Filters
            if ($request->filled('category')) {
                $query->whereHas('category', function ($q) use ($request) {
                    $q->where('slug', $request->category);
                });
            }

            if ($request->filled('type')) {
                $query->where('type', $request->type);
            }

            if ($request->filled('min_price')) {
                $query->where('price', '>=', $request->min_price);
            }

            if ($request->filled('max_price')) {
                $query->where('price', '<=', $request->max_price);
            }

            if ($request->has('purity_certified')) {
                $query->purityCertified();
            }

            if ($request->has('in_stock')) {
                $query->active();
            }

            if ($request->filled('tag')) {
                // Assuming tags is a JSON column
                $query->whereJsonContains('tags', $request->tag);
            }

            // Sorting — map frontend values to column + direction
            $sortBy = $request->get('sort_by', 'latest');
            switch ($sortBy) {
                case 'price_asc':
                    $query->orderBy('price', 'asc');
                    break;
                case 'price_desc':
                    $query->orderBy('price', 'desc');
                    break;
                case 'popular':
                    $query->orderBy('is_bestseller', 'desc')
                          ->orderBy('is_featured', 'desc')
                          ->orderBy('created_at', 'desc');
                    break;
                case 'latest':
                default:
                    $query->orderBy('created_at', 'desc');
                    break;
            }

            // Pagination
            $perPage = $request->get('per_page', 12);
            return $query->paginate($perPage);
        });

        return response()->json([
            'success' => true,
            'data' => $result,
        ]);
    }

    /**
     * Display featured products.
     */
    public function featured()
    {
        $products = Cache::remember('products:featured', self::CACHE_TTL_STATIC, function () {
            return Product::with('category')
                ->featured()
                ->active()
                ->take(8)
                ->get();
        });

        return response()->json([
            'success' => true,
            'data' => $products,
        ]);
    }

    /**
     * Display new arrivals.
     */
    public function newArrivals()
    {
        $products = Cache::remember('products:new_arrivals', self::CACHE_TTL_STATIC, function () {
            return Product::with('category')
                ->new()
                ->active()
                ->latest()
                ->take(8)
                ->get();
        });

        return response()->json([
            'success' => true,
            'data' => $products,
        ]);
    }

    /**
     * Display bestsellers.
     */
    public function bestsellers()
    {
        $products = Cache::remember('products:bestsellers', self::CACHE_TTL_STATIC, function () {
            return Product::with('category')
                ->bestseller()
                ->active()
                ->take(8)
                ->get();
        });

        return response()->json([
            'success' => true,
            'data' => $products,
        ]);
    }

    /**
     * Search products.
     */
    public function search(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'q' => 'required|string|min:2',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $query = $request->get('q');
        $cacheKey = 'products:search:' . md5($query);

        $products = Cache::remember($cacheKey, 600, function () use ($query) {
            return Product::with('category')
                ->search($query)
                ->active()
                ->paginate(12);
        });

        return response()->json([
            'success' => true,
            'data' => $products,
        ]);
    }

    /**
     * Display the specified product.
     */
    public function show(string $identifier)
    {
        $product = Cache::remember("products:show:{$identifier}", self::CACHE_TTL_STATIC, function () use ($identifier) {
            return Product::with(['category', 'testimonials' => function($q) {
                $q->where('is_active', true)->latest();
            }])
                ->where('id', $identifier)
                ->first();
        });

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $product,
        ]);
    }

    /**
     * Store a newly created product (Admin only).
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'name_hi' => 'nullable|string|max:255',
            'description' => 'required|string',
            'description_hi' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'compare_price' => 'nullable|numeric|min:0',
            'images' => 'required', // Can be array of files or strings
            'category_id' => 'required|exists:categories,id',
            'tags' => 'nullable|array',
            'stock' => 'required|integer|min:0',
            'sku' => 'required|string|unique:products',
            'type' => 'required|in:worship,machinery',
            'card_style' => 'required|in:bhakti,yantra,featured,compact',
            'is_featured' => 'boolean',
            'is_new' => 'boolean',
            'is_bestseller' => 'boolean',
            'purity_certified' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        // Process Images
        $allImages = [];
        
        // 1. Handle Files
        if ($request->hasFile('images')) {
            $files = $request->file('images');
            if (!is_array($files)) $files = [$files];
            
            foreach ($files as $file) {
                $filename = time() . '_' . $file->getClientOriginalName();
                $file->move(public_path('uploads/products'), $filename);
                $allImages[] = '/uploads/products/' . $filename;
            }
        }

        // 2. Handle URLs (strings)
        if ($request->has('images')) {
            $inputs = $request->input('images');
            if (is_array($inputs)) {
                foreach ($inputs as $img) {
                    if (is_string($img) && !empty($img)) {
                        $allImages[] = $img;
                    }
                }
            } elseif (is_string($inputs) && !empty($inputs)) {
                 $allImages[] = $inputs;
            }
        }

        if (empty($allImages)) {
             return response()->json([
                'success' => false,
                'errors' => ['images' => ['At least one image is required.']],
            ], 422);
        }

        $data = $request->except(['images']);
        $data['images'] = $allImages; // Backward compatibility

        $product = Product::create($data);

        // Save to product_images table
        foreach ($allImages as $index => $imgUrl) {
            \App\Models\ProductImage::create([
                'product_id' => $product->id,
                'image' => $imgUrl,
                'is_primary' => $index === 0,
                'sort_order' => $index
            ]);
        }

        // Invalidate product caches
        $this->clearProductCaches();

        return response()->json([
            'success' => true,
            'data' => $product,
            'message' => 'Product created successfully',
        ], 201);
    }

    /**
     * Update the specified product (Admin only).
     */
    public function update(Request $request, string $id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'name_hi' => 'nullable|string|max:255',
            'description' => 'sometimes|string',
            'description_hi' => 'nullable|string',
            'price' => 'sometimes|numeric|min:0',
            'compare_price' => 'nullable|numeric|min:0',
            'images' => 'sometimes',
            'category_id' => 'sometimes|exists:categories,id',
            'tags' => 'nullable|array',
            'stock' => 'sometimes|integer|min:0',
            'sku' => 'sometimes|string|unique:products,sku,' . $id,
            'type' => 'sometimes|in:worship,machinery',
            'card_style' => 'sometimes|in:bhakti,yantra,featured,compact',
            'is_featured' => 'boolean',
            'is_new' => 'boolean',
            'is_bestseller' => 'boolean',
            'purity_certified' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $request->except(['images']);
        
        // Handle Images Update if provided
        if ($request->has('images') || $request->hasFile('images')) {
            $allImages = [];
            
            // 1. Handle Files
            if ($request->hasFile('images')) {
                $files = $request->file('images');
                if (!is_array($files)) $files = [$files];
                
                foreach ($files as $file) {
                    $filename = time() . '_' . $file->getClientOriginalName();
                    $file->move(public_path('uploads/products'), $filename);
                    $allImages[] = '/uploads/products/' . $filename;
                }
            }

            // 2. Handle URLs (strings) - these are existing images kept by user
            if ($request->has('images')) {
                $inputs = $request->input('images');
                if (is_array($inputs)) {
                    foreach ($inputs as $img) {
                        if (is_string($img) && !empty($img)) {
                            $allImages[] = $img;
                        }
                    }
                } elseif (is_string($inputs) && !empty($inputs)) {
                     $allImages[] = $inputs;
                }
            }
            
            if (!empty($allImages)) {
                $data['images'] = $allImages;
                
                // Sync product_images table
                // Delete old
                \App\Models\ProductImage::where('product_id', $product->id)->delete();
                
                // Create new
                foreach ($allImages as $index => $imgUrl) {
                    \App\Models\ProductImage::create([
                        'product_id' => $product->id,
                        'image' => $imgUrl,
                        'is_primary' => $index === 0,
                        'sort_order' => $index
                    ]);
                }
            }
        }

        $product->update($data);

        // Invalidate product caches
        $this->clearProductCaches();
        Cache::forget("products:show:{$product->slug}");
        Cache::forget("products:show:{$product->id}");

        return response()->json([
            'success' => true,
            'data' => $product,
            'message' => 'Product updated successfully',
        ]);
    }

    /**
     * Remove the specified product (Admin only).
     */
    public function destroy(string $id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found',
            ], 404);
        }

        $slug = $product->slug;
        $product->delete();

        // Invalidate product caches
        $this->clearProductCaches();
        Cache::forget("products:show:{$slug}");
        Cache::forget("products:show:{$id}");

        return response()->json([
            'success' => true,
            'message' => 'Product deleted successfully',
        ]);
    }



    /**
     * Add a review/testimonial for a product
     */
    public function addReview(Request $request, string $id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'rating' => 'required|integer|min:1|max:5',
            'text' => 'required|string|min:10',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = $request->user();

        // Verify if user bought the product
        $hasBought = \App\Models\Order::where('user_id', $user->id)
            ->whereHas('items', function ($query) use ($product) {
                $query->where('product_id', $product->id);
            })
            ->where('payment_status', 'completed')
            ->exists();

        if (!$hasBought) {
            return response()->json([
                'success' => false,
                'message' => 'You must purchase this product before reviewing it.',
            ], 403);
        }

        // Check if user already reviewed
        $existingReview = \App\Models\Testimonial::where('product_id', $product->id)
            ->where('name', $user->name) // basic check if we don't have user_id on Testimonial
            ->first();

        // Let's just create the review
        $testimonial = \App\Models\Testimonial::create([
            'name' => $user->name,
            'name_hi' => null,
            'location' => 'Verified Buyer',
            'rating' => $request->rating,
            'text' => $request->text,
            'text_hi' => null,
            'product_id' => $product->id,
            'is_verified' => true,
            'is_active' => true,
        ]);

        Cache::forget("products:show:{$product->slug}");
        Cache::forget("products:show:{$product->id}");

        return response()->json([
            'success' => true,
            'message' => 'Review added successfully',
            'data' => $testimonial
        ]);
    }

    /**
     * Upload product image.
     */
    public function uploadImage(Request $request, string $id)
    {
        $request->validate([
            'image' => 'required|image|max:2048', // Max 2MB
        ]);

        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found',
            ], 404);
        }

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('uploads/products'), $filename);
            $fullPath = '/uploads/products/' . $filename;
            
            // Get current images
            $images = $product->images ?? [];
            if (!is_array($images)) {
                $images = [];
            }
            
            // Add new image path
            $images[] = $fullPath;
            
            $product->update(['images' => $images]);

            // Invalidate product caches
            $this->clearProductCaches();
            Cache::forget("products:show:{$product->slug}");
            Cache::forget("products:show:{$product->id}");

            return response()->json([
                'success' => true,
                'message' => 'Image uploaded successfully',
                'data' => [
                    'url' => $fullPath,
                    'images' => $images
                ]
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'No image file provided',
        ], 400);
    }

    /**
     * Clear all product-related caches.
     */
    private function clearProductCaches()
    {
        Cache::forget('products:featured');
        Cache::forget('products:new_arrivals');
        Cache::forget('products:bestsellers');

        // Clear all index/search caches using pattern
        // Since database driver doesn't support tags, we use a version key
        Cache::increment('products:cache_version');
    }
}
