<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class BlogController extends Controller
{
    const CACHE_TTL = 3600;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $cacheKey = 'blogs:all';
        if ($request->has('all')) {
            $cacheKey .= ':admin';
        }
        if ($request->has('featured')) {
            $cacheKey .= ':featured';
        }
        if ($request->has('random')) {
            $cacheKey .= ':random:' . $request->get('limit', 4);
        }

        $blogs = Cache::remember($cacheKey, self::CACHE_TTL, function () use ($request) {
            $query = Blog::query();

            if (!$request->has('all')) {
                $query->where('is_published', true);
            }

            if ($request->has('featured')) {
                $query->where('is_featured', true);
            }

            if ($request->has('random')) {
                return $query->inRandomOrder()->take($request->get('limit', 4))->get();
            }

            if ($request->has('q')) {
                $q = $request->get('q');
                $query->where(function($query) use ($q) {
                    $query->where('title', 'like', "%{$q}%")
                          ->orWhere('content', 'like', "%{$q}%");
                });
            }

            return $query->orderBy('created_at', 'desc')->paginate($request->get('per_page', 12));
        });

        return response()->json([
            'success' => true,
            'data' => $blogs
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'excerpt' => 'nullable|string',
            'image' => 'nullable', // string or file
            'is_published' => 'boolean',
            'is_featured' => 'boolean',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'meta_keywords' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $request->except(['image']);
        $data['slug'] = Str::slug($request->title) . '-' . Str::random(5);
        if ($request->isActive === true) {
             $data['published_at'] = now();
        }

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('uploads/blogs'), $filename);
            $data['image'] = '/uploads/blogs/' . $filename;
        } elseif ($request->has('image') && is_string($request->image)) {
            $data['image'] = $request->image;
        }

        $blog = Blog::create($data);
        $this->clearBlogCaches();

        return response()->json([
            'success' => true,
            'data' => $blog,
            'message' => 'Story created successfully'
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($identifier)
    {
        $blog = Cache::remember("blogs:show:{$identifier}", self::CACHE_TTL, function () use ($identifier) {
            return Blog::where('id', $identifier)
                ->orWhere('slug', $identifier)
                ->first();
        });

        if (!$blog) {
            return response()->json([
                'success' => false,
                'message' => 'Story not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $blog
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $blog = Blog::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|string|max:255',
            'content' => 'sometimes|string',
            'excerpt' => 'nullable|string',
            'image' => 'nullable',
            'is_published' => 'boolean',
            'is_featured' => 'boolean',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'meta_keywords' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $request->except(['image']);
        
        if ($request->has('title') && !$blog->slug) {
            $data['slug'] = Str::slug($request->title) . '-' . Str::random(5);
        }

        if ($request->has('is_published') && $request->is_published && !$blog->published_at) {
            $data['published_at'] = now();
        }

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('uploads/blogs'), $filename);
            $data['image'] = '/uploads/blogs/' . $filename;
        } elseif ($request->has('image') && is_string($request->image)) {
            $data['image'] = $request->image;
        }

        $blog->update($data);
        $this->clearBlogCaches();

        return response()->json([
            'success' => true,
            'data' => $blog,
            'message' => 'Story updated successfully'
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $blog = Blog::findOrFail($id);
        $blog->delete();
        $this->clearBlogCaches();

        return response()->json([
            'success' => true,
            'message' => 'Story deleted successfully'
        ]);
    }

    private function clearBlogCaches()
    {
        Cache::flush(); // Simple for now, or target specific ones
    }
}
