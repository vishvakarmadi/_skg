<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Wishlist;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    /**
     * Get user's wishlist.
     */
    public function index(Request $request)
    {
        $wishlist = Wishlist::where('user_id', $request->user()->id)
            ->with(['product'])
            ->get();

        return response()->json($wishlist);
    }

    /**
     * Add item to wishlist.
     */
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
        ]);

        $user = $request->user();
        $productId = $request->product_id;

        $exists = Wishlist::where('user_id', $user->id)
            ->where('product_id', $productId)
            ->exists();

        if ($exists) {
            return response()->json(['message' => 'Item already in wishlist'], 409);
        }

        $wishlistItem = Wishlist::create([
            'user_id' => $user->id,
            'product_id' => $productId,
        ]);

        return response()->json($wishlistItem->load('product'), 201);
    }

    /**
     * Remove item from wishlist.
     */
    public function destroy(Request $request, $id)
    {
        $wishlistItem = Wishlist::where('user_id', $request->user()->id)
            ->where('id', $id)
            ->firstOrFail();

        $wishlistItem->delete();

        return response()->json(['message' => 'Item removed from wishlist']);
    }

    /**
     * Check if product is in wishlist.
     */
    public function check(Request $request, $productId)
    {
        $exists = Wishlist::where('user_id', $request->user()->id)
            ->where('product_id', $productId)
            ->exists();

        return response()->json(['exists' => $exists]);
    }
}
