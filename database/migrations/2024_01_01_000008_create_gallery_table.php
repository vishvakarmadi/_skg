<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('gallery', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('title_hi')->nullable();
            $table->text('description')->nullable();
            $table->string('image');
            $table->string('category')->default('general');
            $table->string('temple_name')->nullable();
            $table->string('location')->nullable();
            $table->json('products_used')->nullable();
            $table->timestamps();
            
            // Indexes
            $table->index('category');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('gallery');
    }
};
