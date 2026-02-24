<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
    /**
     * Display a listing of user's orders.
     */
    public function index(Request $request)
    {
        $orders = Order::with(['items', 'shippingAddress'])
            ->where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $orders,
        ]);
    }

    /**
     * Display the specified order.
     */
    public function show(Request $request, string $orderNumber)
    {
        $order = Order::with(['items.product', 'shippingAddress', 'billingAddress'])
            ->where('order_number', $orderNumber)
            ->first();

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found',
            ], 404);
        }

        // Check if order belongs to authenticated user
        if ($order->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 403);
        }

        return response()->json([
            'success' => true,
            'data' => $order,
        ]);
    }

    /**
     * Store a newly created order.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'shipping_address_id' => 'required|exists:addresses,id',
            'billing_address_id' => 'nullable|exists:addresses,id',
            'payment_method' => 'required|in:cashfree,cod,upi',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = $request->user();

        // Validate address belongs to user
        $shippingAddress = $user->addresses()->find($request->shipping_address_id);
        if (!$shippingAddress) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid shipping address',
            ], 422);
        }

        $billingAddressId = $request->billing_address_id ?? $request->shipping_address_id;

        DB::beginTransaction();

        try {
            $subtotal = 0;
            $orderItems = [];

            // Validate products and calculate totals
            foreach ($request->items as $item) {
                $product = Product::find($item['product_id']);

                if (!$product) {
                    throw new \Exception('Product not found: ' . $item['product_id']);
                }

                if ($product->stock < $item['quantity']) {
                    throw new \Exception('Insufficient stock for: ' . $product->name);
                }

                $itemTotal = $product->price * $item['quantity'];
                $subtotal += $itemTotal;

                $orderItems[] = [
                    'product_id' => $product->id,
                    'name' => $product->name,
                    'name_hi' => $product->name_hi,
                    'price' => $product->price,
                    'quantity' => $item['quantity'],
                    'image' => $product->first_image,
                    'category' => $product->category->name,
                ];

                // Reduce stock
                $product->decrement('stock', $item['quantity']);
            }

            // Calculate totals
            $tax = $subtotal * 0.18; // 18% GST
            $shipping = $subtotal > 500 ? 0 : 50; // Free shipping above 500
            $discount = 0;
            $total = $subtotal + $tax + $shipping - $discount;

            // Create order
            $order = Order::create([
                'user_id' => $user->id,
                'subtotal' => $subtotal,
                'tax' => $tax,
                'shipping' => $shipping,
                'discount' => $discount,
                'total' => $total,
                'status' => 'pending',
                'payment_status' => 'pending',
                'payment_method' => $request->payment_method,
                'shipping_address_id' => $request->shipping_address_id,
                'billing_address_id' => $billingAddressId,
            ]);

            // Create order items
            foreach ($orderItems as $item) {
                $item['order_id'] = $order->id;
                $order->items()->create($item);
            }

            // Clear cart if ordered from cart
            if ($request->has('from_cart') && $request->from_cart) {
                $user->cart()->delete();
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'data' => $order->load('items'),
                'message' => 'Order created successfully',
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Cancel an order.
     */
    public function cancel(Request $request, string $orderNumber)
    {
        $order = Order::where('order_number', $orderNumber)->first();

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found',
            ], 404);
        }

        // Check if order belongs to authenticated user
        if ($order->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 403);
        }

        if (!$order->canCancel()) {
            return response()->json([
                'success' => false,
                'message' => 'Order cannot be cancelled at this stage',
            ], 422);
        }

        $order->markAsCancelled();

        return response()->json([
            'success' => true,
            'message' => 'Order cancelled successfully',
        ]);
    }

    /**
     * Track an order.
     */
    public function track(Request $request, string $orderNumber)
    {
        $order = Order::where('order_number', $orderNumber)->first();

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found',
            ], 404);
        }

        // Check if order belongs to authenticated user
        if ($order->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 403);
        }

        if (!$order->canTrack()) {
            return response()->json([
                'success' => false,
                'message' => 'Tracking not available for this order yet',
            ], 422);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'order_number' => $order->order_number,
                'status' => $order->status,
                'tracking_number' => $order->tracking_number,
                'tracking_url' => $order->tracking_url,
                'shipped_at' => $order->shipped_at,
                'delivered_at' => $order->delivered_at,
            ],
        ]);
    }

    /**
     * Admin: List all orders.
     */
    public function adminIndex(Request $request)
    {
        $query = Order::with(['user', 'items']);

        // Filters
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('payment_status')) {
            $query->where('payment_status', $request->payment_status);
        }

        if ($request->has('from_date')) {
            $query->whereDate('created_at', '>=', $request->from_date);
        }

        if ($request->has('to_date')) {
            $query->whereDate('created_at', '<=', $request->to_date);
        }

        $cacheKey = 'admin_orders_' . md5(json_encode($request->all()));

        $orders = \Illuminate\Support\Facades\Cache::remember($cacheKey, 300, function () use ($query) {
            return $query->orderBy('created_at', 'desc')->paginate(20);
        });

        return response()->json([
            'success' => true,
            'data' => $orders,
        ]);
    }

    /**
     * Admin: Update order status.
     */
    public function updateStatus(Request $request, string $orderNumber)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:confirmed,processing,shipped,out_for_delivery,delivered,cancelled',
            'tracking_number' => 'nullable|string',
            'tracking_url' => 'nullable|url',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $order = Order::where('order_number', $orderNumber)->first();

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found',
            ], 404);
        }

        $status = $request->status;

        switch ($status) {
            case 'confirmed':
                $order->markAsConfirmed();
                break;
            case 'processing':
                $order->markAsProcessing();
                break;
            case 'shipped':
                $order->markAsShipped($request->tracking_number, $request->tracking_url);
                break;
            case 'delivered':
                $order->markAsDelivered();
                break;
            case 'cancelled':
                $order->markAsCancelled();
                break;
        }

        return response()->json([
            'success' => true,
            'data' => $order,
            'message' => 'Order status updated successfully',
        ]);
    }

    /**
     * Admin: Update tracking information.
     */
    public function updateTracking(Request $request, string $orderNumber)
    {
        $validator = Validator::make($request->all(), [
            'tracking_number' => 'required|string',
            'tracking_url' => 'nullable|url',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $order = Order::where('order_number', $orderNumber)->first();

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found',
            ], 404);
        }

        $order->update([
            'tracking_number' => $request->tracking_number,
            'tracking_url' => $request->tracking_url,
        ]);

        return response()->json([
            'success' => true,
            'data' => $order,
            'message' => 'Tracking information updated successfully',
        ]);
    }
}
