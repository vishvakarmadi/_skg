<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Gallery;

class GallerySeeder extends Seeder
{
    public function run(): void
    {
        $galleries = [
            [
                'title' => 'Grand Havan at Varanasi Temple',
                'title_hi' => 'वाराणसी मंदिर में भव्य हवन',
                'description' => 'Our premium havan samagri and copper havan kund used in a grand havan ceremony at the famous Kashi Vishwanath temple complex.',
                'image' => '/images/gallery/varanasi-havan.jpg',
                'category' => 'events',
                'temple_name' => 'Kashi Vishwanath Temple',
                'location' => 'Varanasi, UP',
                'products_used' => json_encode(['Premium Havan Samagri Mix', 'Copper Havan Kund', 'Pure Desi Cow Ghee']),
            ],
            [
                'title' => 'Diwali Celebration Setup',
                'title_hi' => 'दिवाली उत्सव की सजावट',
                'description' => 'Beautiful Diwali puja setup using our brass puja thali set, marble Lakshmi murti, and premium agarbatti collection.',
                'image' => '/images/gallery/diwali-setup.jpg',
                'category' => 'festivals',
                'temple_name' => null,
                'location' => 'Delhi',
                'products_used' => json_encode(['Complete Puja Thali Set', 'Marble Lakshmi Ji Murti', 'Chandan Agarbatti']),
            ],
            [
                'title' => 'Manufacturing Unit Tour',
                'title_hi' => 'विनिर्माण इकाई का दौरा',
                'description' => 'Our state-of-the-art agarbatti manufacturing facility with automatic machines producing thousands of sticks daily.',
                'image' => '/images/gallery/factory-tour.jpg',
                'category' => 'manufacturing',
                'temple_name' => null,
                'location' => 'Ahmedabad, Gujarat',
                'products_used' => json_encode(['Automatic Agarbatti Making Machine', 'Agarbatti Counting & Packing Machine']),
            ],
            [
                'title' => 'Morning Aarti at Home Mandir',
                'title_hi' => 'गृह मंदिर में प्रातः आरती',
                'description' => 'A customer shares their beautiful home mandir setup using our brass Ganesh murti, puja bell, and Bhimseni kapoor.',
                'image' => '/images/gallery/home-mandir.jpg',
                'category' => 'customer_showcase',
                'temple_name' => null,
                'location' => 'Jaipur, Rajasthan',
                'products_used' => json_encode(['Brass Ganesh Ji Murti', 'Brass Puja Bell', 'Bhimseni Kapoor']),
            ],
            [
                'title' => 'Navratri Havan Ceremony',
                'title_hi' => 'नवरात्रि हवन समारोह',
                'description' => 'Special Navratri havan ceremony performed using our 36-herb havan samagri and pure cow ghee at a community center.',
                'image' => '/images/gallery/navratri-havan.jpg',
                'category' => 'festivals',
                'temple_name' => 'Community Temple',
                'location' => 'Lucknow, UP',
                'products_used' => json_encode(['Premium Havan Samagri Mix', 'Pure Desi Cow Ghee', 'Camphor Tablets']),
            ],
            [
                'title' => 'New Machine Installation',
                'title_hi' => 'नई मशीन स्थापना',
                'description' => 'Successful installation of our automatic agarbatti machine at a client facility in Karnataka. Full training and setup provided.',
                'image' => '/images/gallery/machine-installation.jpg',
                'category' => 'manufacturing',
                'temple_name' => null,
                'location' => 'Bengaluru, Karnataka',
                'products_used' => json_encode(['Automatic Agarbatti Making Machine', 'Bamboo Sticks', 'Jigat Powder']),
            ],
            [
                'title' => 'Temple Decoration with Our Products',
                'title_hi' => 'हमारे उत्पादों से मंदिर सजावट',
                'description' => 'A local temple decorated for Janmashtami using our puja accessories, flowers, and divine ambiance with our premium dhoop.',
                'image' => '/images/gallery/temple-decoration.jpg',
                'category' => 'events',
                'temple_name' => 'Shri Krishna Mandir',
                'location' => 'Mathura, UP',
                'products_used' => json_encode(['Premium Guggul Dhoop Batti', 'Chandan Agarbatti', 'Complete Puja Thali Set']),
            ],
            [
                'title' => 'Dhoop Making Workshop',
                'title_hi' => 'धूप बनाने की कार्यशाला',
                'description' => 'Hands-on training workshop for entrepreneurs learning to make premium dhoop using our machines and raw materials.',
                'image' => '/images/gallery/dhoop-workshop.jpg',
                'category' => 'manufacturing',
                'temple_name' => null,
                'location' => 'Indore, MP',
                'products_used' => json_encode(['Dhoop Batti Making Machine', 'Charcoal Powder', 'Jigat Powder']),
            ],
        ];

        foreach ($galleries as $gallery) {
            Gallery::create($gallery);
        }

        $this->command->info(count($galleries) . ' gallery items seeded successfully.');
    }
}
