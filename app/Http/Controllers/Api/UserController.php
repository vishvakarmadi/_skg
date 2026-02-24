<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Address;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /**
     * Display a listing of the resource (Admin).
     */
    public function index()
    {
        // Removed cache to ensure status updates are reflected immediately
        $users = User::orderBy('created_at', 'desc')->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $users
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        // Admin can see anyone, user can only see themselves
        if (request()->user()->role !== 'admin' && request()->user()->id != $id) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $user = User::with('addresses')->findOrFail($id);
        return response()->json([
            'success' => true,
            'data' => $user
        ]);
    }

    /**
     * Update the specified resource.
     */
    public function update(Request $request, $id)
    {
        // Admin can update anyone, user can only update themselves
        if (request()->user()->role !== 'admin' && request()->user()->id != $id) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $user = User::findOrFail($id);

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => ['sometimes', 'email', Rule::unique('users')->ignore($user->id)],
            'phone' => ['nullable', 'string', Rule::unique('users')->ignore($user->id)],
            'role' => 'sometimes|in:customer,admin', // Only admin should be able to change role really
            'is_active' => 'boolean',
        ]);

        // Prevent users from changing their own role unless they are admin (and even then, cautious)
        if ($request->has('role') && request()->user()->role !== 'admin') {
            return response()->json(['success' => false, 'message' => 'Unauthorized to change role'], 403);
        }

        $user->update($request->all());

        return response()->json([
            'success' => true,
            'data' => $user
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        if (request()->user()->role !== 'admin') {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $user = User::findOrFail($id);
        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'User deleted successfully'
        ]);
    }

    // Address Management methods

    public function addresses(Request $request) {
        return response()->json($request->user()->addresses);
    }

    public function storeAddress(Request $request) {
        $request->validate([
            'type' => 'required|in:home,work,other',
            'name' => 'required|string',
            'phone' => 'required|string',
            'address_line1' => 'required|string',
            'city' => 'required|string',
            'state' => 'required|string',
            'pincode' => 'required|string',
            'is_default' => 'boolean',
        ]);

        if ($request->is_default) {
            $request->user()->addresses()->update(['is_default' => false]);
        }

        $address = $request->user()->addresses()->create($request->all());
        return response()->json($address, 201);
    }

    public function updateAddress(Request $request, $id) {
        $address = $request->user()->addresses()->findOrFail($id);

        $request->validate([
            'type' => 'sometimes|in:home,work,other',
            'name' => 'sometimes|string',
            'phone' => 'sometimes|string',
            'address_line1' => 'sometimes|string',
            'city' => 'sometimes|string',
            'state' => 'sometimes|string',
            'pincode' => 'sometimes|string',
            'is_default' => 'boolean',
        ]);

        if ($request->is_default) {
            $request->user()->addresses()->where('id', '!=', $id)->update(['is_default' => false]);
        }

        $address->update($request->all());
        return response()->json($address);
    }

    public function deleteAddress(Request $request, $id) {
        $address = $request->user()->addresses()->findOrFail($id);
        $address->delete();
        return response()->json(['message' => 'Address deleted successfully']);
    }

    public function setDefaultAddress(Request $request, $id) {
        $request->user()->addresses()->update(['is_default' => false]);
        $address = $request->user()->addresses()->findOrFail($id);
        $address->update(['is_default' => true]);
        return response()->json($address);
    }
}
