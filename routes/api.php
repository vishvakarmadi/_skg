<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\{
    AuthController,
    ProductController,
    CategoryController,
    CartController,
    WishlistController,
    OrderController,
    PaymentController,
    BannerController,
    TestimonialController,
    ContactController,
    GalleryController,
    UserController,
    BlogController
};

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Part of SKG Enterprise Backend API
|
*/

// Public Routes
Route::prefix('v1')->group(function () {
    
    // Blogs - Public (Stories)
    Route::get('/blogs', [BlogController::class, 'index']);
    Route::get('/blogs/{identifier}', [BlogController::class, 'show']);
    
    // Auth Routes
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);
    Route::post('/auth/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/auth/reset-password', [AuthController::class, 'resetPassword']);
    
    // Products - Public
    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/featured', [ProductController::class, 'featured']);
    Route::get('/products/new', [ProductController::class, 'newArrivals']);
    Route::get('/products/bestsellers', [ProductController::class, 'bestsellers']);
    Route::get('/products/search', [ProductController::class, 'search']);
    Route::get('/products/{slug}', [ProductController::class, 'show']);
    
    // Categories - Public
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/categories/{slug}', [CategoryController::class, 'show']);
    Route::get('/categories/{slug}/products', [CategoryController::class, 'products']);
    
    // Banners - Public
    Route::get('/banners', [BannerController::class, 'index']);
    Route::get('/banners/{type}', [BannerController::class, 'byType']);
    
    // Testimonials - Public
    Route::get('/testimonials', [TestimonialController::class, 'index']);
    
    // Gallery - Public
    Route::get('/gallery', [GalleryController::class, 'index']);
    
    // Contact - Public
    Route::post('/contact', [ContactController::class, 'store']);
    
    // Payment Callbacks - Public (for Cashfree)
    Route::post('/payment/callback/{order}', [PaymentController::class, 'callback'])->name('payment.callback');
    Route::post('/payment/webhook', [PaymentController::class, 'webhook'])->name('payment.webhook');
});

// Protected Routes (Require Authentication)
Route::prefix('v1')->middleware('auth:sanctum')->group(function () {
    
    // Auth
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::put('/auth/profile', [AuthController::class, 'updateProfile']);
    Route::put('/auth/password', [AuthController::class, 'changePassword']);
    
    // User
    Route::get('/user', [UserController::class, 'show']);
    Route::put('/user', [UserController::class, 'update']);
    
    // Addresses
    Route::get('/addresses', [UserController::class, 'addresses']);
    Route::post('/addresses', [UserController::class, 'storeAddress']);
    Route::put('/addresses/{id}', [UserController::class, 'updateAddress']);
    Route::delete('/addresses/{id}', [UserController::class, 'deleteAddress']);
    Route::put('/addresses/{id}/default', [UserController::class, 'setDefaultAddress']);
    
    // Cart
    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart', [CartController::class, 'store']);
    Route::put('/cart/{id}', [CartController::class, 'update']);
    Route::delete('/cart/{id}', [CartController::class, 'destroy']);
    Route::delete('/cart', [CartController::class, 'clear']);
    
    // Wishlist
    Route::get('/wishlist', [WishlistController::class, 'index']);
    Route::post('/wishlist', [WishlistController::class, 'store']);
    Route::delete('/wishlist/{id}', [WishlistController::class, 'destroy']);
    Route::get('/wishlist/check/{productId}', [WishlistController::class, 'check']);
    
    // Orders
    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders/{orderNumber}', [OrderController::class, 'show']);
    Route::post('/orders', [OrderController::class, 'store']);
    Route::post('/orders/{orderNumber}/cancel', [OrderController::class, 'cancel']);
    Route::get('/orders/{orderNumber}/track', [OrderController::class, 'track']);
    
    // Payment
    Route::post('/payment/initiate/{order}', [PaymentController::class, 'initiate']);
    Route::get('/payment/status/{order}', [PaymentController::class, 'status']);

    // Reviews
    Route::post('/products/{id}/reviews', [ProductController::class, 'addReview']);
});

// Admin Routes (Require Admin Role)
Route::prefix('v1/admin')->middleware(['auth:sanctum', 'admin'])->group(function () {
    
    // Dashboard
    Route::get('/dashboard', [\App\Http\Controllers\Api\Admin\DashboardController::class, 'index']);
    Route::get('/dashboard/stats', [\App\Http\Controllers\Api\Admin\DashboardController::class, 'stats']);
    Route::post('/dashboard/clear-cache', [\App\Http\Controllers\Api\Admin\DashboardController::class, 'clearCache']);
    
    // Products Management
    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{id}', [ProductController::class, 'update']);
    Route::delete('/products/{id}', [ProductController::class, 'destroy']);
    Route::post('/products/{id}/image', [ProductController::class, 'uploadImage']);
    
    // Categories Management
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::put('/categories/{id}', [CategoryController::class, 'update']);
    Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);
    
    // Orders Management
    Route::get('/orders', [OrderController::class, 'adminIndex']);
    Route::put('/orders/{orderNumber}/status', [OrderController::class, 'updateStatus']);
    Route::put('/orders/{orderNumber}/tracking', [OrderController::class, 'updateTracking']);
    
    // Banners Management
    Route::post('/banners', [BannerController::class, 'store']);
    Route::put('/banners/{id}', [BannerController::class, 'update']);
    Route::delete('/banners/{id}', [BannerController::class, 'destroy']);
    
    // Testimonials Management
    Route::post('/testimonials', [TestimonialController::class, 'store']);
    Route::put('/testimonials/{id}', [TestimonialController::class, 'update']);
    Route::delete('/testimonials/{id}', [TestimonialController::class, 'destroy']);
    
    // Gallery Management
    Route::post('/gallery', [GalleryController::class, 'store']);
    Route::put('/gallery/{id}', [GalleryController::class, 'update']);
    Route::delete('/gallery/{id}', [GalleryController::class, 'destroy']);
    
    // Contact Messages Management
    Route::get('/contacts', [ContactController::class, 'index']);
    Route::get('/contacts/{id}', [ContactController::class, 'show']);
    Route::put('/contacts/{id}/status', [ContactController::class, 'updateStatus']);
    Route::post('/contacts/{id}/reply', [ContactController::class, 'reply']);
    
    // Users Management
    Route::get('/users', [UserController::class, 'index']);
    Route::get('/users/{id}', [UserController::class, 'show']);
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);

    // Blogs Management
    Route::post('/blogs', [BlogController::class, 'store']);
    Route::post('/blogs/{id}', [BlogController::class, 'update']); // Using POST for file/multipart compatibility
    Route::delete('/blogs/{id}', [BlogController::class, 'destroy']);
});
