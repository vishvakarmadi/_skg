<?php

namespace Database\Seeders;

use App\Models\Blog;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class BlogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clear existing blogs to avoid duplicates if re-run
        Blog::truncate();

        $blogs = [
            [
                'title' => 'Modernizing Agarbatti Production: The Ultimate Guide to Automatic Machines',
                'excerpt' => 'Learn how automatic agarbatti making machines are transforming small scale businesses into industrial powerhouses with high efficiency and lower costs.',
                'content' => '
                    <article>
                        <h2>The Industrial Revolution in Spiritual Products</h2>
                        <p>For decades, agarbatti (incense stick) making was a labor-intensive manual process. However, with the advent of <strong>High-Speed Automatic Agarbatti Making Machines</strong>, the landscape has shifted entirely.</p>
                        
                        <h3>Key Benefits of Automation</h3>
                        <ul>
                            <li><strong>Production Capacity:</strong> Modern machines can produce up to 15-20 kg of incense sticks per hour.</li>
                            <li><strong>Consistency:</strong> Automation ensures every stick has an identical diameter and thickness, which is crucial for uniform burning.</li>
                            <li><strong>Waste Reduction:</strong> Precision engineering minimizes raw material wastage, significantly boosting profit margins.</li>
                        </ul>

                        <blockquote>"Investing in the right machinery is not an expense; it is the foundation of a scalable enterprise." - Pawan Hridya Nahu, Founder of SKG Enterprise</blockquote>

                        <h3>Choosing the Right Machine</h3>
                        <p>When selecting a machine, consider the <i>motor power</i>, <i>counting speed</i>, and the <i>availability of spare parts</i>. At SKG Enterprise, we provide comprehensive training and 24/7 support for all our machinery to ensure your production never stops.</p>
                        
                        <p>By integrating SEO-friendly practices into your production and marketing—focusing on quality and reliability—your business can capture a significant share of the growing global incense market.</p>
                    </article>
                ',
                'image' => 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80',
                'is_published' => true,
                'is_featured' => true,
                'published_at' => now(),
                'meta_title' => 'Automatic Agarbatti Making Machine Guide | SKG Enterprise',
                'meta_description' => 'Discover how automatic agarbatti machines improve production efficiency. A complete guide for entrepreneurs in the spiritual products industry.',
                'meta_keywords' => 'agarbatti machine, automatic incense maker, industrial spiritual production, SKG machinery',
            ],
            [
                'title' => 'Why Your Business Needs a Fully Automatic Cotton Wicks Machine in 2026',
                'excerpt' => 'Discover the immense ROI and operational benefits of transitioning to fully automatic cotton wicks production for consistent quality and massive scale.',
                'content' => '
                    <article>
                        <h2>Efficiency Redefined: The Power of Automatic Wicks Making</h2>
                        <p>Cotton wicks are the soul of every ritual lamp. As demand grows for premium, uniform wicks, manual production is no longer sustainable for growing brands. A <strong>Fully Automatic Round Cotton Wicks Machine</strong> is the solution.</p>
                        
                        <h3>Technical Advantages</h3>
                        <p>Our machines are engineered to handle various grades of cotton, producing perfectly shaped round (Gol) battis at a rate that manual labor simply cannot match. With <i>PLC control systems</i> and <i>adjustable speed settings</i>, you have total control over your output.</p>
                        
                        <h3>Operational Excellence</h3>
                        <p>Transitioning to automation reduces your dependency on skilled labor, which is often a bottleneck in the spiritual products industry. Lower overheads and higher output mean you can offer competitive pricing in the market while maintaining healthy margins.</p>
                        
                        <p>For those looking to dominate the <strong>B2B spiritual products market</strong>, automation is the only path forward. SEO trends show a massive search increase for "machine-made premium wicks" as customers value clean-burning and long-lasting products.</p>
                    </article>
                ',
                'image' => 'https://images.unsplash.com/photo-1544006659-f0b21f04cb1d?w=800&q=80',
                'is_published' => true,
                'is_featured' => false,
                'published_at' => now(),
                'meta_title' => 'Benefits of Automatic Cotton Wicks Machinery | 2026 Business Guide',
                'meta_description' => 'Scalable business solutions for cotton wicks production. Learn why automatic machines are the future of temple supply manufacturing.',
                'meta_keywords' => 'cotton wicks machine, gol batti machine, spiritual business automation, temple supply manufacturing',
            ],
            [
                'title' => 'The Sacred Flame: Spiritual Significance of Different Types of Cotton Wicks',
                'excerpt' => 'Exploring the deep cultural and spiritual meanings behind the choice of cotton wick—Gol Batti vs Lambi Batti—in your daily puja and spiritual journey.',
                'content' => '
                    <article>
                        <h2>More Than Just a String: The Spirit of the Wick</h2>
                        <p>In Sanatana Dharma, the lighting of a lamp (Diya) is not merely a physical act but a spiritual invocation of "Agni" (the god of fire). The type of wick used—<strong>Gol Batti</strong> (Round Wick) or <strong>Lambi Batti</strong> (Long Wick)—carries distinct symbolic meanings.</p>
                        
                        <h3>Gol Batti (The Round Wick)</h3>
                        <p>The Round Wick is often associated with <i>Akhand Jyot</i> and represents the "Self" or the "Single Soul" focused toward the Divine. It is believed that lighting a Gol Batti brings peace, stability, and focuses the practitioner’s mind during meditation.</p>
                        
                        <h3>Lambi Batti (The Long Wick)</h3>
                        <p>The Long Wick is traditionally used for seeking prosperity and longevity. It is often lit in pairs or specific configurations to invite the blessings of Goddess Lakshmi and other deities associated with material and spiritual abundance.</p>
                        
                        <p><strong>Purity is Paramount:</strong> Cultural significance is lost if the material is impure. Using 100% natural, hand-picked cotton ensures that the flame burns cleanly, without soot, symbolizing a pure offering to the gods. At SKG, we respect this sanctity in every wick we produce.</p>
                    </article>
                ',
                'image' => 'https://images.unsplash.com/photo-1621360841013-c7683c659ec6?w=800&q=80',
                'is_published' => true,
                'is_featured' => true,
                'published_at' => now(),
                'meta_title' => 'Significance of Gol Batti vs Lambi Batti | Spiritual Guide',
                'meta_description' => 'Understand the profound cultural meanings of different cotton wicks used in Hindu rituals. Gol Batti vs Lambi Batti explained.',
                'meta_keywords' => 'spiritual significance of wicks, gol batti vs lambi batti, hindu rituals, cotton wicks meaning',
            ],
            [
                'title' => 'Cotton Wicks and the Five Elements: Ancient Wisdom for Modern Temples',
                'excerpt' => 'Understanding the sacred connection between pure cotton, oil, and the manifestation of divine energy in your home altar through the 5 elements.',
                'content' => '
                    <article>
                        <h2>The Alchemy of Light</h2>
                        <p>According to ancient scriptures, a lit lamp represents the synchronization of the <strong>Pancha Bhoota</strong> (Five Elements). The cotton wick represents "Earth," the oil/ghee represents "Water," the flame is "Fire," the smoke is "Air," and the light it spreads is "Ether" (Space).</p>
                        
                        <h3>The Role of Cotton (Earth Element)</h3>
                        <p>Cotton, being a product of the earth, is the vessel that holds the fuel. A pure cotton wick symbolizes the human body, which must be pure and dedicated to the truth to hold the "Fire of Knowledge."</p>
                        
                        <h3>Manifesting Divine Energy</h3>
                        <p>When you light a lamp at your home altar, you are creating a sacred field of energy. The cultural significance of lighting a lamp daily is to remind the household of the victory of light over darkness and knowledge over ignorance.</p>
                        
                        <p>Using premium, machine-perfected wicks allows for a steady, unwavering flame, which is said to lead to a steady, unwavering mind. This simple ritual remains the cornerstone of Indian heritage and spiritual wellness.</p>
                    </article>
                ',
                'image' => 'https://images.unsplash.com/photo-1605647540924-852290747df2?w=800&q=80',
                'is_published' => true,
                'is_featured' => false,
                'published_at' => now(),
                'meta_title' => 'Cotton Wicks and Five Elements | Ancient Heritage Guide',
                'meta_description' => 'Discover the ancient wisdom behind lighting cotton wicks and how they represent the five elements of nature in sacred rituals.',
                'meta_keywords' => 'pancha bhoota, cotton wicks spiritual, ancient wisdom rituals, skg enterprise blogs',
            ],
        ];

        foreach ($blogs as $blog) {
            $blog['slug'] = Str::slug($blog['title']);
            Blog::create($blog);
        }
    }
}
