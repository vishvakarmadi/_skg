<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Testimonial;
use App\Models\Product;
use Illuminate\Support\Facades\DB;

class TestimonialSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        Testimonial::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // Get any existing worship product for linking
        $sampleProduct = Product::where('type', 'worship')->first();

        $testimonials = [
            [
                'name' => 'Pandit Ramesh Shastri',
                'name_hi' => 'पंडित रमेश शास्त्री',
                'location' => 'Varanasi, UP',
                'rating' => 5,
                'text' => 'The quality of SKG ghee jyot batti is divine. Perfect for temple rituals.',
                'text_hi' => 'SKG की घी ज्योत बत्ती मंदिर अनुष्ठानों के लिए उत्तम है।',
            ],
            [
                'name' => 'Smt. Kavita Agarwal',
                'name_hi' => 'श्रीमती कविता अग्रवाल',
                'location' => 'Jaipur, Rajasthan',
                'rating' => 5,
                'text' => 'Beautiful fragrance and long burning time. My daily puja feels more peaceful.',
                'text_hi' => 'सुगंध और जलने की अवधि बहुत अच्छी है।',
            ],
            [
                'name' => 'Mohd. Irfan Khan',
                'name_hi' => 'मोहम्मद इरफान खान',
                'location' => 'Ahmedabad, Gujarat',
                'rating' => 5,
                'text' => 'Excellent product quality and packaging. Highly satisfied.',
                'text_hi' => 'उत्पाद की गुणवत्ता उत्कृष्ट है।',
            ],
            [
                'name' => 'Dr. Anita Verma',
                'name_hi' => 'डॉ. अनिता वर्मा',
                'location' => 'Lucknow, UP',
                'rating' => 4,
                'text' => 'Pure and authentic. Would recommend to everyone.',
                'text_hi' => 'शुद्ध और प्रामाणिक उत्पाद।',
            ],
            [
                'name' => 'Swami Yogananda',
                'name_hi' => 'स्वामी योगानंद',
                'location' => 'Rishikesh, Uttarakhand',
                'rating' => 5,
                'text' => 'Very sattvic and spiritually uplifting products.',
                'text_hi' => 'आध्यात्मिक दृष्टि से अत्यंत पवित्र उत्पाद।',
            ],
        ];

        foreach ($testimonials as $index => $data) {

            Testimonial::create([
                'name' => $data['name'],
                'name_hi' => $data['name_hi'],
                'location' => $data['location'],
                'avatar' => null,
                'rating' => $data['rating'],
                'text' => $data['text'],
                'text_hi' => $data['text_hi'],
                'product_id' => $sampleProduct?->id, // Safe dynamic linking
                'is_verified' => true,
                'is_active' => true,
                'sort_order' => $index + 1,
            ]);
        }

        $this->command->info('Testimonials seeded successfully.');
    }
}