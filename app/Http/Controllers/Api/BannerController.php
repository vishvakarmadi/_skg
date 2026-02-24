<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class BannerController extends Controller
{
    const CACHE_TTL = 3600; // 1 hour

    /**
     * Display a listing of the resource.
     */
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $cacheKey = 'banners:all';
        if ($request->has('all')) {
            $cacheKey .= ':admin';
        }

        $banners = Cache::remember($cacheKey, self::CACHE_TTL, function () use ($request) {
            $query = Banner::orderBy('sort_order');
            
            if (!$request->has('all')) {
                $query->where('is_active', true);
            }

            return $query->get();
        });

        return response()->json([
            'success' => true,
            'data' => $banners
        ]);
    }

    /**
     * Get banners by type.
     */
    public function byType($type)
    {
        $banners = Cache::remember("banners:type:{$type}", self::CACHE_TTL, function () use ($type) {
            return Banner::where('is_active', true)
                ->where('type', $type)
                ->orderBy('sort_order')
                ->get();
        });

        return response()->json([
            'success' => true,
            'data' => $banners
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'image' => 'required', // string or file
            'mobile_image' => 'nullable', // string or file
            'title' => 'nullable|string',
            'link' => 'nullable|string',
            'type' => 'required|string',
            'sort_order' => 'integer',
            'is_active' => 'boolean',
        ]);

        $data = $request->all();

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('uploads/banners'), $filename);
            $data['image'] = '/uploads/banners/' . $filename;
        }

        if ($request->hasFile('mobile_image')) {
            $file = $request->file('mobile_image');
            $filename = 'mobile_' . time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('uploads/banners'), $filename);
            $data['mobile_image'] = '/uploads/banners/' . $filename;
        }

        $banner = Banner::create($data);
        $this->clearBannerCaches();

        return response()->json([
            'success' => true,
            'data' => $banner
        ], 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $banner = Banner::findOrFail($id);
        
        $request->validate([
            'image' => 'sometimes', // string or file
            'mobile_image' => 'nullable', // string or file
            'title' => 'nullable|string',
            'link' => 'nullable|string',
            'type' => 'sometimes|string',
            'sort_order' => 'integer',
            'is_active' => 'boolean',
        ]);

        $data = $request->except(['image']);

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('uploads/banners'), $filename);
            $data['image'] = '/uploads/banners/' . $filename;
        } elseif ($request->has('image') && is_string($request->input('image'))) {
             $data['image'] = $request->input('image');
        }

        if ($request->hasFile('mobile_image')) {
            $file = $request->file('mobile_image');
            $filename = 'mobile_' . time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('uploads/banners'), $filename);
            $data['mobile_image'] = '/uploads/banners/' . $filename;
        } elseif ($request->has('mobile_image') && is_string($request->input('mobile_image'))) {
             $data['mobile_image'] = $request->input('mobile_image');
        }

        $banner->update($data);
        $this->clearBannerCaches();

        return response()->json([
            'success' => true,
            'data' => $banner
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $banner = Banner::findOrFail($id);
        $banner->delete();
        $this->clearBannerCaches();

        return response()->json([
            'success' => true,
            'message' => 'Banner deleted successfully'
        ]);
    }

    /**
     * Clear all banner-related caches.
     */
    private function clearBannerCaches()
    {
        Cache::forget('banners:all');
        Cache::forget('banners:all:admin');
        Cache::forget('banners:type:hero');
        Cache::forget('banners:type:promotional');
        Cache::forget('banners:type:sidebar');
    }
}
