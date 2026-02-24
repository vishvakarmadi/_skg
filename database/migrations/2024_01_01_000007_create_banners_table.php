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
        Schema::create('banners', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('title_hi')->nullable();
            $table->string('subtitle')->nullable();
            $table->string('subtitle_hi')->nullable();
            $table->string('image');
            $table->string('mobile_image')->nullable();
            $table->string('cta_text');
            $table->string('cta_text_hi')->nullable();
            $table->string('cta_link');
            $table->enum('type', ['hero', 'festival', 'promo', 'machinery'])->default('promo');
            $table->timestamp('start_date');
            $table->timestamp('end_date')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
            
            // Indexes
            $table->index('type');
            $table->index('is_active');
            $table->index('sort_order');
            $table->index(['start_date', 'end_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('banners');
    }
};
