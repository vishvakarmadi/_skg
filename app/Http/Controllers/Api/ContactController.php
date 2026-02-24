<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    /**
     * Display a listing of the resource (Admin).
     */
    public function index()
    {
        $page = request()->get('page', 1);
        
        $messages = \Illuminate\Support\Facades\Cache::remember('admin_contacts_page_' . $page, 300, function () {
            return ContactMessage::orderBy('created_at', 'desc')->paginate(20);
        });

        return response()->json([
            'success' => true,
            'data' => $messages
        ]);
    }

    /**
     * Store a newly created resource in storage (Public).
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255',
            'phone' => 'nullable|string|max:20',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
            'type' => 'required|in:general,order,bulk,partnership',
            'metadata' => 'nullable|array', // For machinery details
        ]);

        $contact = ContactMessage::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'subject' => $request->subject,
            'message' => $request->message,
            'type' => $request->type,
            'status' => 'new',
            'metadata' => $request->metadata,
        ]);

        return response()->json([
            'message' => 'Message sent successfully',
            'data' => $contact
        ], 201);
    }

    /**
     * Display the specified resource (Admin).
     */
    public function show($id)
    {
        $contact = ContactMessage::findOrFail($id);
        
        if ($contact->status === 'new') {
            $contact->update(['status' => 'read']);
        }

        return response()->json($contact);
    }

    /**
     * Update status.
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:new,read,replied,closed',
        ]);

        $contact = ContactMessage::findOrFail($id);
        $contact->update(['status' => $request->status]);

        return response()->json($contact);
    }

    /**
     * Reply to message (Admin).
     */
    public function reply(Request $request, $id)
    {
        $request->validate([
            'message' => 'required|string',
        ]);

        $contact = ContactMessage::findOrFail($id);
        
        // Logic to send email would go here
        
        $contact->update([
            'status' => 'replied',
            'replied_by' => $request->user()->id,
            'replied_at' => now(),
        ]);

        return response()->json(['message' => 'Reply sent successfully']);
    }
}
