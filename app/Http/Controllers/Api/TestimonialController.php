<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class TestimonialController extends Controller
{
    const CACHE_TTL = 3600; // 1 hour

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $limit = $request->get('limit', 0);
        $random = $request->boolean('random');
        $productType = $request->get('product_type');

        // Use a more dynamic cache key
        $cacheKey = "testimonials:index:{$limit}:" . ($random ? 'rand' : 'sort') . ":{$productType}";

        $testimonials = Cache::remember($cacheKey, self::CACHE_TTL, function () use ($limit, $random, $productType) {
            $query = Testimonial::where('is_active', true);

            if ($productType) {
                $query->whereHas('product', function($q) use ($productType) {
                    $q->where('type', $productType);
                });
            }

            if ($random) {
                $query->inRandomOrder();
            } else {
                $query->orderBy('sort_order');
            }

            if ($limit > 0) {
                $query->limit($limit);
            }

            return $query->get();
        });

        return response()->json($testimonials);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'name_hi' => 'nullable|string',
            'location' => 'required|string',
            'text' => 'required|string',
            'text_hi' => 'nullable|string',
            'avatar' => 'nullable', // file or string
            'rating' => 'required|integer|min:1|max:5',
            'product_id' => 'nullable|exists:products,id',
            'sort_order' => 'integer',
            'is_active' => 'boolean',
        ]);

        $data = $request->all();

        if ($request->hasFile('avatar')) {
            $file = $request->file('avatar');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('uploads/testimonials'), $filename);
            $data['avatar'] = '/uploads/testimonials/' . $filename;
        }

        $testimonial = Testimonial::create($data);
        Cache::forget('testimonials:all');

        return response()->json($testimonial, 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $testimonial = Testimonial::findOrFail($id);

        $request->validate([
            'name' => 'sometimes|string',
            'name_hi' => 'nullable|string',
            'location' => 'sometimes|string',
            'text' => 'sometimes|string',
            'text_hi' => 'nullable|string',
            'avatar' => 'nullable', // file or string
            'rating' => 'sometimes|integer|min:1|max:5',
            'product_id' => 'nullable|exists:products,id',
            'sort_order' => 'integer',
            'is_active' => 'boolean',
        ]);

        $data = $request->except(['avatar']);

        if ($request->hasFile('avatar')) {
            $file = $request->file('avatar');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('uploads/testimonials'), $filename);
            $data['avatar'] = '/uploads/testimonials/' . $filename;
        } elseif ($request->has('avatar') && is_string($request->avatar)) {
            $data['avatar'] = $request->avatar;
        }

        $testimonial->update($data);
        Cache::forget('testimonials:all');

        return response()->json($testimonial);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $testimonial = Testimonial::findOrFail($id);
        $testimonial->delete();
        Cache::forget('testimonials:all');

        return response()->json(['message' => 'Testimonial deleted successfully']);
    }
}
