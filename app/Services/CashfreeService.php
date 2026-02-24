<?php

namespace App\Services;

use App\Models\Order;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class CashfreeService
{
    protected string $appId;
    protected string $secretKey;
    protected string $baseUrl;
    protected bool $isProduction;

    public function __construct()
    {
        $this->appId = config('services.cashfree.app_id');
        $this->secretKey = config('services.cashfree.secret_key');
        $this->isProduction = config('services.cashfree.production', false);
        $this->baseUrl = $this->isProduction
            ? 'https://api.cashfree.com/pg'
            : 'https://sandbox.cashfree.com/pg';
    }

    /**
     * Create a new order with Cashfree
     *
     * @param Order $order
     * @param array $customerData
     * @return array|null
     */
    public function createOrder(Order $order, array $customerData): ?array
    {
        try {
            // Generate idempotency key
            $idempotencyKey = Str::uuid()->toString();
            
            // Store idempotency key
            $order->update(['idempotency_key' => $idempotencyKey]);

            $payload = [
                'order_id' => $order->order_number,
                'order_amount' => (float) $order->total,
                'order_currency' => 'INR',
                'customer_details' => [
                    'customer_id' => (string) $order->user_id,
                    'customer_name' => $customerData['name'],
                    'customer_email' => $customerData['email'],
                    'customer_phone' => $customerData['phone'],
                ],
                'order_meta' => [
                    'return_url' => route('payment.callback', ['order' => $order->order_number]),
                    'notify_url' => route('payment.webhook'),
                ],
            ];

            $response = Http::withHeaders([
                'x-client-id' => $this->appId,
                'x-client-secret' => $this->secretKey,
                'x-api-version' => '2022-09-01',
                'x-idempotency-key' => $idempotencyKey,
                'Content-Type' => 'application/json',
            ])->post("{$this->baseUrl}/orders", $payload);

            if ($response->successful()) {
                $data = $response->json();
                
                // Update order with payment session ID
                $order->update([
                    'payment_session_id' => $data['payment_session_id'],
                ]);

                return [
                    'payment_session_id' => $data['payment_session_id'],
                    'order_id' => $data['order_id'],
                    'cf_order_id' => $data['cf_order_id'],
                ];
            }

            Log::error('Cashfree order creation failed', [
                'order_id' => $order->id,
                'response' => $response->json(),
            ]);

            return null;

        } catch (\Exception $e) {
            Log::error('Cashfree order creation exception', [
                'order_id' => $order->id,
                'error' => $e->getMessage(),
            ]);
            return null;
        }
    }

    /**
     * Get order status from Cashfree
     *
     * @param string $orderId
     * @return array|null
     */
    public function getOrderStatus(string $orderId): ?array
    {
        try {
            $response = Http::withHeaders([
                'x-client-id' => $this->appId,
                'x-client-secret' => $this->secretKey,
                'x-api-version' => '2022-09-01',
                'Content-Type' => 'application/json',
            ])->get("{$this->baseUrl}/orders/{$orderId}");

            if ($response->successful()) {
                return $response->json();
            }

            return null;

        } catch (\Exception $e) {
            Log::error('Cashfree get order status exception', [
                'order_id' => $orderId,
                'error' => $e->getMessage(),
            ]);
            return null;
        }
    }

    /**
     * Verify payment signature
     *
     * @param \Illuminate\Http\Request $request
     * @return bool
     */
    public function verifySignature(\Illuminate\Http\Request $request): bool
    {
        try {
            // Method 1: Header-based verification (Newer API)
            $signature = $request->header('x-webhook-signature');
            $timestamp = $request->header('x-webhook-timestamp');
            
            if ($signature && $timestamp) {
                $rawBody = $request->getContent();
                $dataToVerify = $timestamp . $rawBody;
                $generatedSignature = base64_encode(hash_hmac('sha256', $dataToVerify, $this->secretKey, true));
                
                return $signature === $generatedSignature;
            }

            // Method 2: Payload-based verification (Older/Standard Checkout)
            $data = $request->all();
            if (isset($data['signature']) && isset($data['orderId'])) {
                $orderId = $data['orderId'];
                $orderAmount = $data['orderAmount'];
                $referenceId = $data['referenceId'];
                $txStatus = $data['txStatus'];
                $paymentMode = $data['paymentMode'];
                $txMsg = $data['txMsg'];
                $txTime = $data['txTime'];
                $signature = $data['signature'];

                $dataToVerify = $orderId . $orderAmount . $referenceId . $txStatus . $paymentMode . $txMsg . $txTime;
                $generatedSignature = hash_hmac('sha256', $dataToVerify, $this->secretKey);

                return hash_equals($generatedSignature, $signature);
            }

            return false;

        } catch (\Exception $e) {
            Log::error('Cashfree signature verification exception', [
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }

    /**
     * Process webhook
     *
     * @param array $payload
     * @return bool
     */
    public function processWebhook(array $payload): bool
    {
        try {
            $orderId = $payload['orderId'] ?? null;
            $txStatus = $payload['txStatus'] ?? null;

            if (!$orderId || !$txStatus) {
                return false;
            }

            $order = Order::where('order_number', $orderId)->first();

            if (!$order) {
                Log::error('Order not found for webhook', ['order_id' => $orderId]);
                return false;
            }

            // Idempotency check - already processed
            if ($order->payment_status === 'completed' && $txStatus === 'SUCCESS') {
                return true;
            }

            if ($txStatus === 'SUCCESS') {
                $order->markPaymentAsCompleted(
                    $payload['referenceId'],
                    $payload
                );
                $order->markAsConfirmed();
            } elseif (in_array($txStatus, ['FAILED', 'CANCELLED', 'FLAGGED'])) {
                $order->markPaymentAsFailed();
            }

            return true;

        } catch (\Exception $e) {
            Log::error('Cashfree webhook processing exception', [
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }

    /**
     * Initiate refund
     *
     * @param Order $order
     * @param float $amount
     * @param string $reason
     * @return array|null
     */
    public function initiateRefund(Order $order, float $amount, string $reason): ?array
    {
        try {
            $refundId = 'REF' . $order->order_number . time();

            $payload = [
                'refund_id' => $refundId,
                'refund_amount' => $amount,
                'refund_note' => $reason,
            ];

            $response = Http::withHeaders([
                'x-client-id' => $this->appId,
                'x-client-secret' => $this->secretKey,
                'x-api-version' => '2022-09-01',
                'Content-Type' => 'application/json',
            ])->post("{$this->baseUrl}/orders/{$order->order_number}/refunds", $payload);

            if ($response->successful()) {
                return $response->json();
            }

            Log::error('Cashfree refund initiation failed', [
                'order_id' => $order->id,
                'response' => $response->json(),
            ]);

            return null;

        } catch (\Exception $e) {
            Log::error('Cashfree refund initiation exception', [
                'order_id' => $order->id,
                'error' => $e->getMessage(),
            ]);
            return null;
        }
    }
}
