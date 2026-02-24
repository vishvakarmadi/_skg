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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('name_hi')->nullable();
            $table->text('description');
            $table->text('description_hi')->nullable();
            $table->decimal('price', 12, 2);
            $table->decimal('compare_price', 12, 2)->nullable();
            $table->json('images');
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->json('tags')->nullable();
            
            // Inventory
            $table->integer('stock')->default(0);
            $table->string('sku')->unique();
            
            // Product Type
            $table->enum('type', ['worship', 'machinery'])->default('worship');
            
            // For worship products
            $table->json('purity_features')->nullable();
            $table->string('devotional_use')->nullable();
            $table->string('batch_number')->nullable();
            $table->date('made_on')->nullable();
            
            // For machinery products
            $table->string('production_capacity')->nullable();
            $table->json('technical_specs')->nullable();
            $table->string('warranty')->nullable();
            
            // Card Style
            $table->enum('card_style', ['bhakti', 'yantra', 'featured', 'compact'])->default('bhakti');
            
            // Flags
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_new')->default(false);
            $table->boolean('is_bestseller')->default(false);
            $table->boolean('purity_certified')->default(false);
            
            // SEO
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            
            $table->timestamps();
            
            // Indexes
            $table->index('sku');
            $table->index('type');
            $table->index('category_id');
            $table->index('price');
            $table->index('stock');
            $table->index('is_featured');
            $table->index('is_new');
            $table->index('is_bestseller');
            $table->index('purity_certified');
            $table->index('created_at');
            
            // Full-text search index
            $table->fullText(['name', 'name_hi', 'description', 'description_hi']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
