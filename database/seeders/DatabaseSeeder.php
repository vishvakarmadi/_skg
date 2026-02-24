<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            CategorySeeder::class,
            ProductSeeder::class,
            BannerSeeder::class,
            GallerySeeder::class,
            TestimonialSeeder::class,
            ContactMessageSeeder::class,
            OrderSeeder::class,
            BlogSeeder::class,
        ]);
    }
}
