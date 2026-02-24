<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_number',
        'user_id',
        'subtotal',
        'tax',
        'shipping',
        'discount',
        'total',
        'status',
        'payment_status',
        'payment_method',
        'payment_id',
        'payment_session_id',
        'payment_response',
        'idempotency_key',
        'shipping_address_id',
        'billing_address_id',
        'tracking_number',
        'tracking_url',
        'confirmed_at',
        'shipped_at',
        'delivered_at',
        'cancelled_at',
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'tax' => 'decimal:2',
        'shipping' => 'decimal:2',
        'discount' => 'decimal:2',
        'total' => 'decimal:2',
        'payment_response' => 'array',
        'confirmed_at' => 'datetime',
        'shipped_at' => 'datetime',
        'delivered_at' => 'datetime',
        'cancelled_at' => 'datetime',
    ];

    // Boot method for auto-generating order number
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($order) {
            if (empty($order->order_number)) {
                $order->order_number = 'SKG' . date('Ymd') . strtoupper(substr(uniqid(), -6));
            }
        });
    }

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function shippingAddress()
    {
        return $this->belongsTo(Address::class, 'shipping_address_id');
    }

    public function billingAddress()
    {
        return $this->belongsTo(Address::class, 'billing_address_id');
    }

    // Scopes
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeConfirmed($query)
    {
        return $query->where('status', 'confirmed');
    }

    public function scopeProcessing($query)
    {
        return $query->where('status', 'processing');
    }

    public function scopeShipped($query)
    {
        return $query->where('status', 'shipped');
    }

    public function scopeDelivered($query)
    {
        return $query->where('status', 'delivered');
    }

    public function scopeCancelled($query)
    {
        return $query->where('status', 'cancelled');
    }

    public function scopePaymentPending($query)
    {
        return $query->where('payment_status', 'pending');
    }

    public function scopePaymentCompleted($query)
    {
        return $query->where('payment_status', 'completed');
    }

    // Status helpers
    public function canCancel(): bool
    {
        return in_array($this->status, ['pending', 'confirmed']);
    }

    public function canTrack(): bool
    {
        return in_array($this->status, ['shipped', 'out_for_delivery', 'delivered']);
    }

    public function isDelivered(): bool
    {
        return $this->status === 'delivered';
    }

    // Status update methods
    public function markAsConfirmed()
    {
        $this->update([
            'status' => 'confirmed',
            'confirmed_at' => now(),
        ]);
    }

    public function markAsProcessing()
    {
        $this->update(['status' => 'processing']);
    }

    public function markAsShipped($trackingNumber = null, $trackingUrl = null)
    {
        $this->update([
            'status' => 'shipped',
            'tracking_number' => $trackingNumber,
            'tracking_url' => $trackingUrl,
            'shipped_at' => now(),
        ]);
    }

    public function markAsDelivered()
    {
        $this->update([
            'status' => 'delivered',
            'delivered_at' => now(),
        ]);
    }

    public function markAsCancelled()
    {
        $this->update([
            'status' => 'cancelled',
            'cancelled_at' => now(),
        ]);
        
        // Restore stock
        foreach ($this->items as $item) {
            $item->product->increment('stock', $item->quantity);
        }
    }

    public function markPaymentAsCompleted($paymentId, $response = null)
    {
        $this->update([
            'payment_status' => 'completed',
            'payment_id' => $paymentId,
            'payment_response' => $response,
        ]);
    }

    public function markPaymentAsFailed()
    {
        $this->update(['payment_status' => 'failed']);
    }
}
