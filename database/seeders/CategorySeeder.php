<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        // Removed truncate to keep existing categories created by user
        
        /*
        |--------------------------------------------------------------------------
        | MAIN CATEGORIES
        |--------------------------------------------------------------------------
        */

        $mainCategories = [
            ['name' => 'Ghee Jyot Batti', 'name_hi' => 'घी ज्योत बत्ती', 'icon' => 'Flame', 'image' => '/uploads/categories/ghee_jyot_batti.png'],
            ['name' => 'Kesar', 'name_hi' => 'केसर', 'icon' => 'Flower2', 'image' => '/uploads/categories/kesar.png'],
            ['name' => 'Rose', 'name_hi' => 'गुलाब', 'icon' => 'Flower', 'image' => '/uploads/categories/rose.png'],
            ['name' => 'Lavender', 'name_hi' => 'लैवेंडर', 'icon' => 'Wind', 'image' => '/uploads/categories/lavender.png'],
            ['name' => 'Sandalwood', 'name_hi' => 'चंदन', 'icon' => 'Trees', 'image' => '/uploads/categories/sandalwood.png'],
            ['name' => 'Mogra', 'name_hi' => 'मोगरा', 'icon' => 'Sparkles', 'image' => '/uploads/categories/mogra.png'],
            ['name' => 'Mix Fragrance', 'name_hi' => 'मिश्रित सुगंध', 'icon' => 'Dna', 'image' => '/uploads/categories/mix_fragrance.png'],
            ['name' => 'Machinery', 'name_hi' => 'मशीनरी', 'icon' => 'Cog', 'image' => '/uploads/categories/machinery.png'],
        ];

        $piecesOptions = [
            ['name' => '30 Pieces', 'name_hi' => '30 पीस'],
            ['name' => '50 Pieces', 'name_hi' => '50 पीस'],
            ['name' => '100 Pieces', 'name_hi' => '100 पीस'],
        ];

        foreach ($mainCategories as $main) {
            $mainSlug = Str::slug($main['name']);
            // Create Main Category
            $parent = Category::updateOrCreate(
                ['slug' => $mainSlug],
                [
                    'name' => $main['name'],
                    'name_hi' => $main['name_hi'],
                    'icon' => $main['icon'] ?? null,
                    'image' => $main['image'] ?? null,
                    'parent_id' => null,
                    'is_active' => true,
                ]
            );

            // Create Subcategories (30, 50, 100 pieces)
            foreach ($piecesOptions as $piece) {
                Category::updateOrCreate(
                    ['slug' => Str::slug($main['name'] . '-' . $piece['name'])],
                    [
                        'name' => $piece['name'],
                        'name_hi' => $piece['name_hi'],
                        'parent_id' => $parent->id,
                        'is_active' => true,
                    ]
                );
            }
        }

        $this->command->info('Main categories and piece subcategories seeded/updated successfully.');
    }
}