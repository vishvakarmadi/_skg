<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('testimonials', function (Blueprint $table) {
            $table->id();

            $table->string('name');
            $table->string('name_hi')->nullable();
            $table->string('location');
            $table->string('avatar')->nullable();

            $table->integer('rating')->default(5);

            $table->text('text');
            $table->text('text_hi')->nullable();

            $table->foreignId('product_id')
                  ->nullable()
                  ->constrained('products')
                  ->nullOnDelete();

            $table->boolean('is_verified')->default(false);
            $table->boolean('is_active')->default(true);

            $table->integer('sort_order')->default(0);

            $table->timestamps();

            // Indexes
            $table->index('product_id');
            $table->index('rating');
            $table->index('is_verified');
            $table->index('is_active');
            $table->index('sort_order');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('testimonials');
    }
};