<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Address;
use App\Models\Cart;
use App\Models\Wishlist;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        OrderItem::truncate();
        Order::truncate();
        Cart::truncate();
        Wishlist::truncate();
        Address::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // Get existing products
        $products = Product::all();

        if ($products->count() < 3) {
            $this->command->error('Not enough products found. Seed products first.');
            return;
        }

        /*
        |--------------------------------------------------------------------------
        | ADDRESSES
        |--------------------------------------------------------------------------
        */

        $address = Address::create([
            'user_id' => 2,
            'type' => 'shipping',
            'name' => 'Demo User',
            'phone' => '9876543210',
            'address_line_1' => 'MG Road',
            'city' => 'Delhi',
            'state' => 'Delhi',
            'pincode' => '110001',
            'country' => 'India',
            'is_default' => true,
        ]);

        /*
        |--------------------------------------------------------------------------
        | CREATE ORDER
        |--------------------------------------------------------------------------
        */

        $selectedProducts = $products->take(3);

        $subtotal = 0;

        foreach ($selectedProducts as $product) {
            $subtotal += $product->price;
        }

        $tax = $subtotal * 0.18;
        $total = $subtotal + $tax;

        $order = Order::create([
            'order_number' => 'SKG-' . now()->format('Y') . '-' . rand(10000,99999),
            'user_id' => 2,
            'subtotal' => $subtotal,
            'tax' => $tax,
            'shipping' => 0,
            'discount' => 0,
            'total' => $total,
            'status' => 'delivered',
            'payment_status' => 'completed',
            'payment_method' => 'online',
            'payment_id' => 'pay_test_' . Str::random(8),
            'shipping_address_id' => $address->id,
            'billing_address_id' => $address->id,
            'confirmed_at' => now()->subDays(3),
            'shipped_at' => now()->subDays(2),
            'delivered_at' => now()->subDay(),
        ]);

        /*
        |--------------------------------------------------------------------------
        | ORDER ITEMS
        |--------------------------------------------------------------------------
        */

        foreach ($selectedProducts as $product) {
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $product->id,
                'name' => $product->name,
                'name_hi' => $product->name_hi,
                'price' => $product->price,
                'quantity' => 1,
                'image' => $product->images[0] ?? null,
                'category' => optional($product->category)->name ?? 'General',
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | CART
        |--------------------------------------------------------------------------
        */

        Cart::create([
            'user_id' => 2,
            'product_id' => $products->random()->id,
            'quantity' => 2,
        ]);

        /*
        |--------------------------------------------------------------------------
        | WISHLIST
        |--------------------------------------------------------------------------
        */

        Wishlist::create([
            'user_id' => 2,
            'product_id' => $products->random()->id,
        ]);

        $this->command->info('Orders, cart, wishlist seeded successfully.');
    }
}