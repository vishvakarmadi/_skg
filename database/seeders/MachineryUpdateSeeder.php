<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use Illuminate\Support\Str;

class MachineryUpdateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $machineryCategory = \App\Models\Category::where('slug', 'machinery')->first();
        $machineryCategoryId = $machineryCategory ? $machineryCategory->id : null;

        // 1. Fully Automatic Round Cotton Wicks Machine
        $desc1 = "<h4>Fully Automatic Round Cotton Wicks Machine</h4>
<p>पूरी तरह से स्वचालित गोल सूती बाती मशीन (Fully Automatic Round Cotton Wicks Machine) एक ऐसी मशीन है जो कपास को रोल करके, काटकर, और बाती (wick) बनाकर, बिना मानवीय हस्तक्षेप के गोल बत्तियां तैयार करती है। यह कम बिजली और रखरखाव पर अच्छी पैदावार देती है और शहरों व गांवों में एक लाभदायक व्यवसाय का अवसर है।</p>
<p><strong>व्यवसाय के लिए लाभ:</strong></p>
<ul>
<li><strong>स्वचालित प्रक्रिया:</strong> यह मशीन कपास को फीड करने से लेकर बत्ती बनाने तक का सारा काम खुद करती है।</li>
<li><strong>सरल और मजबूत:</strong> इसे चलाना और रखरखाव करना आसान होता है।</li>
<li><strong>उच्च उत्पादन:</strong> 2 किलोग्राम प्रति दिन बना सकती है।</li>
<li><strong>समान गुणवत्ता:</strong> एक जैसी और अच्छी गुणवत्ता वाली बत्तियां बनाती है।</li>
<li><strong>कम रखरखाव:</strong> ज्यादा सर्विसिंग की जरुरत नहीं पड़ती।</li>
</ul>";

        Product::updateOrCreate(['sku' => 'SKG-MAC-001'], [
            'name' => 'Fully Automatic Round Cotton Wicks Machine',
            'name_hi' => 'पूरी तरह से स्वचलित गोल सूती बाती मशीन',
            'description' => $desc1,
            'description_hi' => $desc1,
            'price' => 70800.00,
            'images' => json_encode(['/uploads/products/fully_auto_round.jpg']),
            'category_id' => $machineryCategoryId,
            'tags' => json_encode(['machinery', 'cotton wicks', 'automatic', 'round']),
            'stock' => 10,
            'type' => 'machinery',
            'production_capacity' => '2Kg approx. in 9-10hrs',
            'warranty' => 'Up to 5 years',  
            'technical_specs' => json_encode([
                'EMI Option' => 'Rs 70800 (50% downpayment = 35800, Rest 50% 10 emi = 3500 per month)',
                'Full Payment Deal' => 'Rs 70800, 30Kg Cotton free',
                'Cotton Price' => 'Rs 300/kg',
                'Buy Back' => 'Rs 550/kg (Profit = Rs 250/kg)',
                'Buyback Agreement' => 'Up to 5 years',
                'Free Items' => 'Packing material free, Weight machine free',
                'Electricity Consumption' => '2 units in 9-10hrs',
            ]),
            'card_style' => 'featured',
            'is_bestseller' => true,
        ]);

        // 2. Semi Automatic Round Wicks Machine
        $desc2 = "<h4>Semi Automatic Round Cotton Wicks Machine</h4>
<p>सेमी ऑटोमैटिक राउंड कॉटन विक मशीन एक ऐसी मशीन है जो दीयों के लिए गोल रुई की बत्ती बनाने के काम आती है, जिसमें आपको रुई फीड करनी होती है और मशीन उसे गोल आकार देकर तैयार करती है।</p>
<p><strong>यह कैसे काम करती है:</strong></p>
<ul>
<li><strong>रुई डालना:</strong> आपको मशीन में 3 इंच के रुई के टुकड़े डालने होते हैं।</li>
<li><strong>स्वचालित प्रक्रिया:</strong> मशीन रुई को सोखकर, रोल करके एक परफेक्ट गोल बत्ती (wick) बनाती है।</li>
</ul>
<p><strong>मुख्य विशेषताएँ:</strong> कम निवेश, उपयोग में आसान, और किफायती।</p>";

        Product::updateOrCreate(['sku' => 'SKG-MAC-002'], [
            'name' => 'Semi Automatic Round Wicks Machine',
            'name_hi' => 'अर्ध-स्वचालित गोल सूती बत्तियों की मशीन',
            'description' => $desc2,
            'description_hi' => $desc2,
            'price' => 29500.00,
            'images' => json_encode(['/uploads/products/semi_auto_round.jpg']),
            'category_id' => $machineryCategoryId,
            'tags' => json_encode(['machinery', 'cotton wicks', 'semi-automatic', 'round']),
            'stock' => 10,
            'type' => 'machinery',
            'production_capacity' => '1.5-2Kg in 8-9hrs',
            'warranty' => 'Up to 5 years',
            'technical_specs' => json_encode([
                'Cotton Price' => 'Rs 250/kg',
                'Buy Back' => 'Rs 500/kg (Profit = Rs 250/kg)',
                'Buyback Agreement' => 'Up to 5 years',
                'Free Items' => '20Kg Cotton free, Weight machine free, Packing material free',
                'Electricity Consumption' => '0.5 unit in 9-10hrs',
            ]),
        ]);

        // 3. Semi Automatic Long Cotton Wicks Machine
        $desc3 = "<h4>Semi Automatic Long Cotton Wicks Machine</h4>
<p>सेमी-ऑटोमैटिक लॉन्ग विक मशीन का उपयोग लंबी रुई की बत्तियां (जैसे दीयों या अगरबत्ती के लिए) बनाने के लिए किया जाता है, जिसमें कुछ कार्य मशीन द्वारा और कुछ मैन्युअल रूप से किए जाते हैं।</p>
<p><strong>मुख्य बातें:</strong></p>
<ul>
<li><strong>कार्य:</strong> यह लंबी रुई की बत्तियों के उत्पादन के लिए होती है।</li>
<li><strong>ऑपरेशन:</strong> मशीन स्वचालित रूप से बाती बनाती है जबकि मटेरियल डालना व निकालना मैन्युअल होता है।</li>
</ul>";

        Product::updateOrCreate(['sku' => 'SKG-MAC-003'], [
            'name' => 'Semi Automatic Long Cotton Wicks Machine',
            'name_hi' => 'अर्ध-स्वचालित लंबी बत्ती मशीन',
            'description' => $desc3,
            'description_hi' => $desc3,
            'price' => 41300.00,
            'images' => json_encode(['/uploads/products/semi_auto_long.jpg']),
            'category_id' => $machineryCategoryId,
            'tags' => json_encode(['machinery', 'cotton wicks', 'semi-automatic', 'long']),
            'stock' => 10,
            'type' => 'machinery',
            'production_capacity' => '2-2.5Kg in 8-9hrs',
            'warranty' => 'Up to 5 years',
            'technical_specs' => json_encode([
                'Cotton Price' => 'Rs 250/kg',
                'Buy Back' => 'Rs 500/kg (Profit = Rs 250/kg)',
                'Buyback Agreement' => 'Up to 5 years',
                'Free Items' => '20Kg Cotton free, Packing material free, Weight machine free',
                'Electricity Consumption' => '1 unit in 9-10hrs',
            ]),
        ]);

        // 4. Fully Automatic Long Cotton Wicks Machine
        $desc4 = "<h4>Fully Automatic Long Cotton Wicks Machine</h4>
<p>पूरी तरह से स्वचालित लंबी कपास बाती मशीन एक ऐसी मशीन है जो बिना मानवीय हस्तक्षेप के, रुई (कपास) से लंबी बत्तियां बनाती है, जिसका उपयोग मंदिरों और घरों में पूजा के लिए होता है।</p>
<p><strong>प्रमुख विशेषताएँ:</strong></p>
<ul>
<li><strong>स्वचालित (Automatic):</strong> पूरी प्रक्रिया मशीन द्वारा की जाती है।</li>
<li><strong>उच्च गुणवत्ता:</strong> बत्तियां एक समान बनती हैं।</li>
<li><strong>आसान संचालन:</strong> एक बार सेट करने के बाद, इसे चलाना सरल होता है।</li>
</ul>
<p><strong>Address:</strong> H.NO 12 MANGOLPUR KALAN MARBLE MARKET ROHINI SECTOR-2 DELHI-110085</p>";

        Product::updateOrCreate(['sku' => 'SKG-MAC-004'], [
            'name' => 'Fully Automatic Long Cotton Wicks Machine',
            'name_hi' => 'पूरी तरह से स्वचालित लंबी बाती बनाने वाली मशीन',
            'description' => $desc4,
            'description_hi' => $desc4,
            'price' => 80000.00,
            'compare_price' => 94400.00,
            'images' => json_encode(['/uploads/products/fully_auto_long.jpg']),
            'category_id' => $machineryCategoryId,
            'tags' => json_encode(['machinery', 'cotton wicks', 'automatic', 'long']),
            'stock' => 10,
            'type' => 'machinery',
            'production_capacity' => '3.5-4Kg in 9-10hrs',
            'warranty' => 'Up to 5 years',
            'technical_specs' => json_encode([
                'EMI Option' => 'Rs 94400 (50% downpayment = 47200, Rest 50% 10 emi = 4720 per month)',
                'Full Payment Deal' => 'Rs 80000, 30Kg Cotton free',
                'Cotton Price' => 'Rs 300/kg',
                'Buy Back' => 'Rs 550/kg (Profit = Rs 250/kg)',
                'Buyback Agreement' => 'Up to 5 years',
                'Free Items' => 'Packing material free, Weight machine free',
                'Electricity Consumption' => '1 unit in 9-10hrs',
            ]),
        ]);

    }
}
