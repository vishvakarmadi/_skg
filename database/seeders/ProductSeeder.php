<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        // Removed truncate to keep existing user data
        
        $fragrances = [
            ['en' => 'Kesar', 'hi' => 'केसर'],
            ['en' => 'Rose', 'hi' => 'गुलाब'],
            ['en' => 'Lavender', 'hi' => 'लैवेंडर'],
            ['en' => 'Sandalwood', 'hi' => 'चंदन'],
            ['en' => 'Mogra', 'hi' => 'मोगरा'],
            ['en' => 'Mix Fragrance', 'hi' => 'मिश्रित सुगंध'],
        ];

        $sizes = [
            ['en' => '30 Pieces', 'hi' => '30 पीस', 'price' => 49],
            ['en' => '50 Pieces', 'hi' => '50 पीस', 'price' => 79],
            ['en' => '100 Pieces', 'hi' => '100 पीस', 'price' => 149],
        ];

        foreach ($fragrances as $fragrance) {
            $categorySlug = Str::slug($fragrance['en']);
            $category = Category::where('slug', $categorySlug)->first();

            // Fallback to ghee-jyot-batti if somehow category doesn't exist
            if (!$category) {
                $category = Category::where('slug', 'ghee-jyot-batti')->first();
            }

            foreach ($sizes as $size) {
                $sizeNum = explode(' ', $size['en'])[0];
                $sku = strtoupper(Str::slug($fragrance['en'])) . '-' . $sizeNum;

                // Make only 50 Pieces featured so 'Selection' section shows different fragrances
                $isFeatured = $size['en'] === '50 Pieces';
                // Make 100 Pieces bestsellers
                $isBestseller = $size['en'] === '100 Pieces';

                Product::updateOrCreate(
                    ['sku' => $sku],
                    [
                        'name' => "{$fragrance['en']} Ghee Jyot Batti - {$size['en']}",
                        'name_hi' => "{$fragrance['hi']} घी ज्योत बत्ती - {$size['hi']}",

                        'description' => "Premium {$fragrance['en']} fragrance ghee jyot batti made from pure cow ghee. Ideal for daily पूजा and temple rituals.",
                        'description_hi' => "शुद्ध देसी घी से बनी {$fragrance['hi']} सुगंध वाली घी ज्योत बत्ती। दैनिक पूजा और मंदिर उपयोग के लिए उत्तम।",

                        'price' => $size['price'],
                        'compare_price' => $size['price'] + 20,

                        'images' => [
                            '/uploads/products/default1.jpg',
                            '/uploads/products/default2.jpg'
                        ],

                        'category_id' => $category ? $category->id : null,

                        'tags' => [
                            strtolower($fragrance['en']),
                            'ghee',
                            'pooja',
                            'worship',
                            strtolower($size['en']), // e.g., '30 pieces'
                            $sizeNum . ' piece',      // e.g., '30 piece'
                            $sizeNum . ' pieces'      // e.g., '30 pieces'
                        ],

                        'stock' => 100,

                        'type' => 'worship',

                        'purity_features' => [
                            '100% Pure Ghee',
                            'No Chemicals',
                            'Long Burning Time'
                        ],

                        'devotional_use' => 'Daily Puja & Temple Rituals',
                        'batch_number' => 'BATCH-' . rand(1000, 9999),
                        'made_on' => now(),

                        'card_style' => 'featured',

                        'is_featured' => $isFeatured,
                        'is_new' => true,
                        'is_bestseller' => $isBestseller,
                        'purity_certified' => true,

                        'meta_title' => "{$fragrance['en']} Ghee Jyot Batti - Buy Online",
                        'meta_description' => "Buy premium {$fragrance['en']} ghee jyot batti for daily worship and temple rituals."
                    ]
                );
            }
        }

        $this->command->info('Products seeded/updated successfully.');
    }
}