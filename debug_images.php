<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$products = \App\Models\Product::take(5)->get();
foreach ($products as $p) {
    echo "Product: {$p->name}\n";
    echo "Images: " . json_encode($p->images) . "\n";
    echo "-------------------\n";
}

$banners = \App\Models\Banner::all();
foreach ($banners as $b) {
    echo "Banner: {$b->title}\n";
    echo "Image: {$b->image}\n";
    echo "-------------------\n";
}
