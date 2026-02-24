<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Banner;

class BannerSeeder extends Seeder
{
    public function run(): void
    {
        $banners = [
            [
                'title' => 'Pure Puja Essentials',
                'title_hi' => 'शुद्ध पूजा सामग्री',
                'subtitle' => 'Experience divine worship with our certified pure products',
                'subtitle_hi' => 'प्रमाणित शुद्ध उत्पादों के साथ दिव्य पूजा का अनुभव करें',
                'image' => '/images/banners/hero-puja-essentials.jpg',
                'mobile_image' => '/images/banners/hero-puja-essentials-mobile.jpg',
                'cta_text' => 'Shop Now',
                'cta_text_hi' => 'अभी खरीदें',
                'cta_link' => '/products?type=worship',
                'type' => 'hero',
                'start_date' => '2024-01-01',
                'end_date' => null,
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'title' => 'Start Your Agarbatti Business',
                'title_hi' => 'अपना अगरबत्ती व्यवसाय शुरू करें',
                'subtitle' => 'Complete machinery solutions with training and support',
                'subtitle_hi' => 'प्रशिक्षण और सहायता के साथ पूर्ण मशीनरी समाधान',
                'image' => '/images/banners/hero-machinery.jpg',
                'mobile_image' => '/images/banners/hero-machinery-mobile.jpg',
                'cta_text' => 'Explore Machines',
                'cta_text_hi' => 'मशीनें देखें',
                'cta_link' => '/products?type=machinery',
                'type' => 'hero',
                'start_date' => '2024-01-01',
                'end_date' => null,
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'title' => 'Navratri Special Collection',
                'title_hi' => 'नवरात्रि विशेष संग्रह',
                'subtitle' => 'Get 25% off on all puja samagri during Navratri',
                'subtitle_hi' => 'नवरात्रि के दौरान सभी पूजा सामग्री पर 25% की छूट',
                'image' => '/images/banners/festival-navratri.jpg',
                'mobile_image' => '/images/banners/festival-navratri-mobile.jpg',
                'cta_text' => 'Shop Festival Offers',
                'cta_text_hi' => 'त्योहारी ऑफर देखें',
                'cta_link' => '/products?category=puja-samagri',
                'type' => 'festival',
                'start_date' => '2024-10-03',
                'end_date' => '2024-10-12',
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'title' => 'Diwali Mega Sale',
                'title_hi' => 'दिवाली मेगा सेल',
                'subtitle' => 'Upto 40% off on idols, diyas, and puja accessories',
                'subtitle_hi' => 'मूर्तियों, दीयों और पूजा सामान पर 40% तक की छूट',
                'image' => '/images/banners/festival-diwali.jpg',
                'mobile_image' => '/images/banners/festival-diwali-mobile.jpg',
                'cta_text' => 'Shop Diwali Collection',
                'cta_text_hi' => 'दिवाली संग्रह देखें',
                'cta_link' => '/products?tag=diwali',
                'type' => 'festival',
                'start_date' => '2024-10-25',
                'end_date' => '2024-11-05',
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'title' => 'Free Shipping Above ₹999',
                'title_hi' => '₹999 से ऊपर मुफ्त शिपिंग',
                'subtitle' => 'Deliver to your doorstep across India',
                'subtitle_hi' => 'पूरे भारत में आपके दरवाजे तक डिलीवरी',
                'image' => '/images/banners/promo-free-shipping.jpg',
                'mobile_image' => null,
                'cta_text' => 'Order Now',
                'cta_text_hi' => 'अभी ऑर्डर करें',
                'cta_link' => '/products',
                'type' => 'promo',
                'start_date' => '2024-01-01',
                'end_date' => null,
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'title' => 'Bulk Order Discount',
                'title_hi' => 'थोक ऑर्डर पर छूट',
                'subtitle' => 'Special pricing for temples and wholesale buyers',
                'subtitle_hi' => 'मंदिरों और थोक खरीदारों के लिए विशेष मूल्य',
                'image' => '/images/banners/promo-bulk-order.jpg',
                'mobile_image' => null,
                'cta_text' => 'Contact Us',
                'cta_text_hi' => 'संपर्क करें',
                'cta_link' => '/contact?type=bulk',
                'type' => 'promo',
                'start_date' => '2024-01-01',
                'end_date' => null,
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'title' => 'New Machinery Range 2024',
                'title_hi' => 'नई मशीनरी रेंज 2024',
                'subtitle' => 'Latest technology machines at factory-direct prices',
                'subtitle_hi' => 'फैक्ट्री-डायरेक्ट कीमतों पर नवीनतम तकनीक की मशीनें',
                'image' => '/images/banners/machinery-new-range.jpg',
                'mobile_image' => null,
                'cta_text' => 'View Catalogue',
                'cta_text_hi' => 'कैटलॉग देखें',
                'cta_link' => '/products?type=machinery',
                'type' => 'machinery',
                'start_date' => '2024-01-01',
                'end_date' => null,
                'is_active' => true,
                'sort_order' => 1,
            ],
        ];

        foreach ($banners as $banner) {
            Banner::create($banner);
        }

        $this->command->info(count($banners) . ' banners seeded successfully.');
    }
}
