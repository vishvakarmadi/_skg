<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ContactMessage;

class ContactMessageSeeder extends Seeder
{
    public function run(): void
    {
        $messages = [
            [
                'name' => 'Arun Yadav',
                'email' => 'arun.yadav@example.com',
                'phone' => '9988776655',
                'subject' => 'Bulk order inquiry for temple',
                'message' => 'We run a temple in Haridwar and need regular supply of ghee, dhoop, agarbatti, and camphor. Can you share bulk pricing for monthly orders of approximately ₹50,000?',
                'type' => 'bulk',
                'status' => 'new',
                'replied_by' => null,
                'replied_at' => null,
            ],
            [
                'name' => 'Pooja Sharma',
                'email' => 'pooja.sharma@example.com',
                'phone' => '9876512345',
                'subject' => 'Order tracking query',
                'message' => 'I placed an order #SKG-2024-00345 for brass idols 5 days ago but haven\'t received any shipping update. Can you please check the status?',
                'type' => 'order',
                'status' => 'read',
                'replied_by' => null,
                'replied_at' => null,
            ],
            [
                'name' => 'Raj Industries',
                'email' => 'raj.industries@example.com',
                'phone' => '9876500001',
                'subject' => 'Partnership for machinery distribution',
                'message' => 'We are interested in becoming a regional distributor for your agarbatti and dhoop making machines in Karnataka. We have experience in industrial machinery sales. Please share your dealer program details.',
                'type' => 'partnership',
                'status' => 'replied',
                'replied_by' => 1, // Admin
                'replied_at' => now()->subDays(2),
            ],
            [
                'name' => 'Sunita Jain',
                'email' => 'sunita.jain@example.com',
                'phone' => null,
                'subject' => 'Product quality question',
                'message' => 'I want to know if your Bhimseni Kapoor is genuine or synthetic. Also, do you have any lab test certificates that I can see before placing a large order?',
                'type' => 'general',
                'status' => 'replied',
                'replied_by' => 1,
                'replied_at' => now()->subDays(5),
            ],
            [
                'name' => 'Krishna Temple Trust',
                'email' => 'krishna.temple@example.com',
                'phone' => '9876500002',
                'subject' => 'Custom havan samagri request',
                'message' => 'We perform specific types of havans that require a customized mix of herbs. Can you prepare havan samagri with specific herbs that we will specify? Quantity needed: 50 kg monthly.',
                'type' => 'bulk',
                'status' => 'new',
                'replied_by' => null,
                'replied_at' => null,
            ],
        ];

        foreach ($messages as $message) {
            ContactMessage::create($message);
        }

        $this->command->info(count($messages) . ' contact messages seeded successfully.');
    }
}
