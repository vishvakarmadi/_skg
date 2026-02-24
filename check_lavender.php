<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Category;

$c = Category::where('slug', 'lavender')->first();
if ($c) {
    echo "Lavender Image Path in DB: " . $c->image . "\n";
} else {
    echo "Lavender category not found.\n";
    $first = Category::first();
    if ($first) {
        echo "First Category ({$first->slug}) Image Path: " . $first->image . "\n";
    }
}
