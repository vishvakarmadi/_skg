<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Gallery;
use Illuminate\Http\Request;

class GalleryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $gallery = Gallery::where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        return response()->json($gallery);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'image' => 'required', // file or string
            'title' => 'nullable|string',
            'description' => 'nullable|string',
            'category' => 'nullable|string',
            'sort_order' => 'integer',
            'is_active' => 'boolean',
        ]);

        $data = $request->all();

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('uploads/gallery'), $filename);
            $data['image'] = '/uploads/gallery/' . $filename;
        }

        $gallery = Gallery::create($data);

        return response()->json($gallery, 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $gallery = Gallery::findOrFail($id);

        $request->validate([
            'image' => 'sometimes', // file or string
            'title' => 'nullable|string',
            'description' => 'nullable|string',
            'category' => 'nullable|string',
            'sort_order' => 'integer',
            'is_active' => 'boolean',
        ]);

        $data = $request->except(['image']);

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('uploads/gallery'), $filename);
            $data['image'] = '/uploads/gallery/' . $filename;
        } elseif ($request->has('image') && is_string($request->image)) {
            $data['image'] = $request->image;
        }

        $gallery->update($data);

        return response()->json($gallery);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $gallery = Gallery::findOrFail($id);
        $gallery->delete();

        return response()->json(['message' => 'Gallery item deleted successfully']);
    }
}
