<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    const CACHE_TTL = 3600; // 1 hour

    /*
    |--------------------------------------------------------------------------
    | GET ALL CATEGORIES
    |--------------------------------------------------------------------------
    */
    public function index(Request $request)
    {
        $isAdmin = $request->has('all');

        $cacheKey = $isAdmin 
            ? 'categories:admin' 
            : 'categories:tree';

        $categories = Cache::remember($cacheKey, self::CACHE_TTL, function () use ($isAdmin) {

            $query = Category::orderBy('sort_order');

            if (!$isAdmin) {
                $query->where('is_active', true)
                      ->whereNull('parent_id');
            }

            return $query
                ->withCount('products')
                ->with(['children' => function ($q) {
                    $q->orderBy('sort_order')
                      ->where('is_active', true)
                      ->withCount('products')
                      ->with('children'); // supports 3-level tree
                }])
                ->get();
        });

        return response()->json([
            'success' => true,
            'data' => $categories
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | STORE CATEGORY
    |--------------------------------------------------------------------------
    */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'name_hi' => 'nullable|string|max:255',
            'slug' => 'nullable|string|max:255|unique:categories',
            'description' => 'nullable|string',
            'image' => 'nullable',
            'icon' => 'nullable|string',
            'parent_id' => 'nullable|exists:categories,id',
            'sort_order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        $data = $request->except(['image']);

        $data['slug'] = $request->slug ?? Str::slug($request->name);
        $data['sort_order'] = $request->sort_order ?? 0;
        $data['is_active'] = $request->is_active ?? true;

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('uploads/categories'), $filename);
            $data['image'] = '/uploads/categories/' . $filename;
        } elseif ($request->has('image') && is_string($request->image)) {
            $data['image'] = $request->image;
        }

        $category = Category::create($data);

        $this->clearCategoryCaches();

        return response()->json([
            'success' => true,
            'data' => $category
        ], 201);
    }

    /*
    |--------------------------------------------------------------------------
    | SHOW CATEGORY
    |--------------------------------------------------------------------------
    */
    public function show($slug)
    {
        $cacheKey = "categories:show:{$slug}";

        $category = Cache::remember($cacheKey, self::CACHE_TTL, function () use ($slug) {
            return Category::where('slug', $slug)
                ->orWhere('id', $slug)
                ->with(['children.children', 'parent'])
                ->firstOrFail();
        });

        return response()->json([
            'success' => true,
            'data' => $category
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | UPDATE CATEGORY
    |--------------------------------------------------------------------------
    */
    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'name_hi' => 'nullable|string|max:255',
            'slug' => 'nullable|string|max:255|unique:categories,slug,' . $id,
            'description' => 'nullable|string',
            'image' => 'nullable',
            'icon' => 'nullable|string',
            'parent_id' => 'nullable|exists:categories,id',
            'sort_order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        $data = $request->except(['image']);

        if ($request->has('name') && !$request->has('slug')) {
            $data['slug'] = Str::slug($request->name);
        }

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('uploads/categories'), $filename);
            $data['image'] = '/uploads/categories/' . $filename;
        } elseif ($request->has('image') && is_string($request->image)) {
            $data['image'] = $request->image;
        }

        $category->update($data);

        $this->clearCategoryCaches();
        Cache::forget("categories:show:{$id}");
        Cache::forget("categories:show:{$category->slug}");

        return response()->json([
            'success' => true,
            'data' => $category
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | DELETE CATEGORY
    |--------------------------------------------------------------------------
    */
    public function destroy($id)
    {
        $category = Category::findOrFail($id);
        $slug = $category->slug;

        $category->delete();

        $this->clearCategoryCaches();
        Cache::forget("categories:show:{$id}");
        Cache::forget("categories:show:{$slug}");

        return response()->json([
            'success' => true,
            'message' => 'Category deleted successfully'
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | CATEGORY PRODUCTS
    |--------------------------------------------------------------------------
    */
    public function products(Request $request, $slug)
    {
        $page = $request->get('page', 1);
        $cacheKey = "categories:products:{$slug}:page:{$page}";

        $products = Cache::remember($cacheKey, 1800, function () use ($slug) {

            $category = Category::where('slug', $slug)
                ->orWhere('id', $slug)
                ->firstOrFail();

            return $category->products()
                ->where('is_active', true)
                ->paginate(12);
        });

        return response()->json([
            'success' => true,
            'data' => $products
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | CLEAR CACHE
    |--------------------------------------------------------------------------
    */
    private function clearCategoryCaches()
    {
        Cache::forget('categories:tree');
        Cache::forget('categories:admin');
    }
}