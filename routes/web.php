<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Artisan;

Route::get('/', function () {
    return view('welcome');
});

// Helper route to create storage link natively (bypassing artisan sometimes helps on shared hosting)
Route::get('/create-symlink', function () {
    $target = storage_path('app/public');
    $link = public_path('storage');
    
    if (file_exists($link)) {
        return 'The public/storage link already exists.';
    }

    try {
        symlink($target, $link);
        return 'Storage symlink created successfully.';
    } catch (\Exception $e) {
        return 'Failed to create symlink: ' . $e->getMessage();
    }
});

// Fallback fallback: Run artisan command from route
Route::get('/artisan-storage-link', function () {
    try {
        Artisan::call('storage:link');
        return 'Artisan storage:link executed successfully.';
    } catch (\Exception $e) {
        return 'Error: ' . $e->getMessage();
    }
});

// Direct storage server fallback
// If sumlink completely fails on Hostinger, Apache will forward missed requests to index.php
// This route will catch them and serve the files directly out of storage directory securely.
Route::get('/storage/{path}', function ($path) {
    if (strpos($path, '..') !== false) {
        abort(403);
    }
    
    $fullPath = storage_path('app/public/' . ltrim($path, '/'));
    
    if (!File::exists($fullPath)) {
        abort(404);
    }
    
    $file = File::get($fullPath);
    $type = File::mimeType($fullPath);
    
    $response = Response::make($file, 200);
    $response->header("Content-Type", $type);
    
    // Cache for a year to simulate CDN / Static file server behavior
    $response->setMaxAge(31536000);
    $response->setPublic();
    
    return $response;
})->where('path', '.*');
