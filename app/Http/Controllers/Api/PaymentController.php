<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\CashfreeService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    protected CashfreeService $cashfreeService;

    public function __construct(CashfreeService $cashfreeService)
    {
        $this->cashfreeService = $cashfreeService;
    }

    /**
     * Initiate payment for an order.
     */
    public function initiate(Request $request, Order $order)
    {
        // Check if order belongs to authenticated user
        if ($order->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 403);
        }

        // Check if payment already completed (idempotency)
        if ($order->payment_status === 'completed') {
            return response()->json([
                'success' => false,
                'message' => 'Payment already completed for this order',
            ], 400);
        }

        $user = $request->user();
        $defaultAddress = $user->defaultAddress;

        $customerData = [
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $defaultAddress ? $defaultAddress->phone : ($user->phone ?? '9999999999'),
        ];

        $paymentData = $this->cashfreeService->createOrder($order, $customerData);

        if (!$paymentData) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to initiate payment',
            ], 500);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'payment_session_id' => $paymentData['payment_session_id'],
                'order_id' => $paymentData['order_id'],
                'cf_order_id' => $paymentData['cf_order_id'],
            ],
        ]);
    }

    /**
     * Handle payment callback from Cashfree.
     */
    public function callback(Request $request, Order $order)
    {
        $data = $request->all();

        // Verify signature
        if (!$this->cashfreeService->verifySignature($request)) {
            Log::error('Payment callback signature verification failed', [
                'order_id' => $order->order_number,
            ]);
            return redirect()->away(config('app.frontend_url') . '/payment/failed?order=' . $order->order_number);
        }

        $txStatus = $data['txStatus'];

        if ($txStatus === 'SUCCESS') {
            // Idempotency check
            if ($order->payment_status !== 'completed') {
                $order->markPaymentAsCompleted($data['referenceId'], $data);
                $order->markAsConfirmed();
            }
            return redirect()->away(config('app.frontend_url') . '/payment/success?order=' . $order->order_number);
        } else {
            $order->markPaymentAsFailed();
            return redirect()->away(config('app.frontend_url') . '/payment/failed?order=' . $order->order_number);
        }
    }

    /**
     * Handle payment webhook from Cashfree.
     */
    public function webhook(Request $request)
    {
        $payload = $request->all();

        Log::info('Payment webhook received', $payload);

        // Verify signature
        if (!$this->cashfreeService->verifySignature($request)) {
            Log::error('Payment webhook signature verification failed');
            return response()->json([
                'success' => false,
                'message' => 'Invalid signature',
            ], 401);
        }

        $success = $this->cashfreeService->processWebhook($payload);

        if (!$success) {
            return response()->json([
                'success' => false,
            ], 400);
        }

        return response()->json([
            'success' => true,
        ]);
    }

    /**
     * Get payment status.
     */
    public function status(Request $request, Order $order)
    {
        // Check if order belongs to authenticated user
        if ($order->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 403);
        }

        $status = $this->cashfreeService->getOrderStatus($order->order_number);

        return response()->json([
            'success' => true,
            'data' => [
                'order_status' => $order->status,
                'payment_status' => $order->payment_status,
                'cashfree_status' => $status,
            ],
        ]);
    }
}
