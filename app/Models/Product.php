<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'name_hi',
        'description',
        'description_hi',
        'price',
        'compare_price',
        'images',
        'category_id',
        'tags',
        'stock',
        'sku',
        'type',
        'purity_features',
        'devotional_use',
        'batch_number',
        'made_on',
        'production_capacity',
        'technical_specs',
        'warranty',
        'card_style',
        'is_featured',
        'is_new',
        'is_bestseller',
        'purity_certified',
        'meta_title',
        'meta_description',
    ];

    protected $appends = [
        'avg_rating',
        'reviews_count'
    ];

    protected $casts = [
        'images' => 'array',
        'tags' => 'array',
        'purity_features' => 'array',
        'technical_specs' => 'array',
        'price' => 'decimal:2',
        'compare_price' => 'decimal:2',
        'made_on' => 'date',
        'is_featured' => 'boolean',
        'is_new' => 'boolean',
        'is_bestseller' => 'boolean',
        'purity_certified' => 'boolean',
    ];

    // Relationships
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function productImages()
    {
        return $this->hasMany(ProductImage::class)->orderBy('sort_order')->orderBy('is_primary', 'desc');
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function testimonials()
    {
        return $this->hasMany(Testimonial::class);
    }

    public function carts()
    {
        return $this->hasMany(Cart::class);
    }

    public function wishlists()
    {
        return $this->hasMany(Wishlist::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('stock', '>', 0);
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeNew($query)
    {
        return $query->where('is_new', true);
    }

    public function scopeBestseller($query)
    {
        return $query->where('is_bestseller', true);
    }

    public function scopePurityCertified($query)
    {
        return $query->where('purity_certified', true);
    }

    public function scopeWorship($query)
    {
        return $query->where('type', 'worship');
    }

    public function scopeMachinery($query)
    {
        return $query->where('type', 'machinery');
    }

    public function scopePriceRange($query, $min, $max)
    {
        return $query->whereBetween('price', [$min, $max]);
    }

    public function scopeSearch($query, $search)
    {
        // Split search into individual keywords for partial matching
        $keywords = array_filter(preg_split('/\s+/', trim($search)));

        if (empty($keywords)) {
            return $query;
        }

        // Each keyword must match at least one of the searchable fields
        foreach ($keywords as $keyword) {
            $query->where(function ($q) use ($keyword) {
                $q->where('name', 'like', "%{$keyword}%")
                  ->orWhere('name_hi', 'like', "%{$keyword}%")
                  ->orWhere('description', 'like', "%{$keyword}%")
                  ->orWhere('description_hi', 'like', "%{$keyword}%")
                  ->orWhere('sku', 'like', "%{$keyword}%")
                  ->orWhere('tags', 'like', "%{$keyword}%");
            });
        }

        return $query;
    }

    // Helpers
    public function getDiscountPercentageAttribute(): ?int
    {
        if ($this->compare_price && $this->compare_price > $this->price) {
            return round((($this->compare_price - $this->price) / $this->compare_price) * 100);
        }
        return null;
    }

    public function getFirstImageAttribute(): ?string
    {
        $images = $this->images;
        return is_array($images) && count($images) > 0 ? $images[0] : null;
    }

    public function isInStock(): bool
    {
        return $this->stock > 0;
    }

    public function isLowStock(): bool
    {
        return $this->stock > 0 && $this->stock <= 10;
    }

    public function getAvgRatingAttribute()
    {
        return round($this->testimonials()->where('is_active', true)->avg('rating'), 1) ?: 0;
    }

    public function getReviewsCountAttribute()
    {
        return $this->testimonials()->where('is_active', true)->count();
    }
}
