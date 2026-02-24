<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\DB;

echo "--- Categories Table ---\n";
$categories = DB::table('categories')->limit(5)->get();
foreach ($categories as $c) {
    echo "ID: {$c->id}, Name: {$c->name}, Image: {$c->image}\n";
}

echo "\n--- Products Table ---\n";
$products = DB::table('products')->limit(5)->get();
foreach ($products as $p) {
    echo "ID: {$p->id}, SKU: {$p->sku}, Images: {$p->images}\n";
}

echo "\n--- Product Images Table ---\n";
$p_images = DB::table('product_images')->limit(5)->get();
foreach ($p_images as $pi) {
    echo "ID: {$pi->id}, Product ID: {$pi->product_id}, Image: {$pi->image}\n";
}
