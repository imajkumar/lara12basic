<?php

namespace App\Http\Controllers;

use App\Models\EmailTemplate;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Snowfire\Beautymail\Beautymail;

class EmailTemplateController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $templates = EmailTemplate::orderBy('created_at', 'desc')->get();
        
        return Inertia::render('email-templates/index', [
            'templates' => $templates,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $templateTypes = [
            'widgets' => 'Widgets (Campaign Monitor)',
            'minty' => 'Minty (Stamplia)',
            'sunny' => 'Sunny',
            'ark' => 'Ark',
        ];

        $categories = [
            'general' => 'General',
            'welcome' => 'Welcome',
            'notification' => 'Notification',
            'invoice' => 'Invoice',
            'password' => 'Password Reset',
            'verification' => 'Email Verification',
        ];

        return Inertia::render('email-templates/create', [
            'templateTypes' => $templateTypes,
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'subject' => 'required|string|max:255',
            'template_type' => 'required|string|in:widgets,minty,sunny,ark',
            'content' => 'required|string',
            'variables' => 'nullable|array',
            'category' => 'required|string|max:255',
            'is_active' => 'boolean',
            'from_email' => 'nullable|email',
            'from_name' => 'nullable|string|max:255',
            'settings' => 'nullable|array',
        ]);

        $template = EmailTemplate::create($validated);

        return redirect()->route('email-templates.index')
            ->with('success', 'Email template created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $template = EmailTemplate::findOrFail($id);
        
        return Inertia::render('email-templates/show', [
            'template' => $template,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $template = EmailTemplate::findOrFail($id);
        
        $templateTypes = [
            'widgets' => 'Widgets (Campaign Monitor)',
            'minty' => 'Minty (Stamplia)',
            'sunny' => 'Sunny',
            'ark' => 'Ark',
        ];

        $categories = [
            'general' => 'General',
            'welcome' => 'Welcome',
            'notification' => 'Notification',
            'invoice' => 'Invoice',
            'password' => 'Password Reset',
            'verification' => 'Email Verification',
        ];

        return Inertia::render('email-templates/edit', [
            'template' => $template,
            'templateTypes' => $templateTypes,
            'categories' => $categories,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $template = EmailTemplate::findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'subject' => 'required|string|max:255',
            'template_type' => 'required|string|in:widgets,minty,sunny,ark',
            'content' => 'required|string',
            'variables' => 'nullable|array',
            'category' => 'required|string|max:255',
            'is_active' => 'boolean',
            'from_email' => 'nullable|email',
            'from_name' => 'nullable|string|max:255',
            'settings' => 'nullable|array',
        ]);

        $template->update($validated);

        return redirect()->route('email-templates.index')
            ->with('success', 'Email template updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $template = EmailTemplate::findOrFail($id);
        $template->delete();

        return redirect()->route('email-templates.index')
            ->with('success', 'Email template deleted successfully.');
    }

    /**
     * Send test email
     */
    public function sendTest(Request $request, string $id)
    {
        $template = EmailTemplate::findOrFail($id);
        $testData = $request->input('test_data', []);
        
        try {
            // Generate test data based on template variables
            $testData = $this->generateTestData($template);
            
            // Create a temporary view with the template content
            $viewContent = $this->createTemporaryView($template, $testData);
            
            $beautymail = app()->make(Beautymail::class);
            $beautymail->send('emails.dynamic', $testData, function($message) use ($template, $testData) {
                $message
                    ->from($template->from_email ?? config('mail.from.address'), $template->from_name ?? config('mail.from.name'))
                    ->to($testData['test_email'] ?? 'test@example.com')
                    ->subject($this->replaceVariables($template->subject, $testData));
            });

            return response()->json(['success' => true, 'message' => 'Test email sent successfully']);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Failed to send test email: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Generate test data for email templates
     */
    private function generateTestData($template)
    {
        $testData = [
            'user_name' => 'John Doe',
            'user_email' => 'john.doe@example.com',
            'company_name' => 'GoERP',
            'login_url' => 'http://localhost/login',
            'reset_url' => 'http://localhost/reset-password?token=test123',
            'verification_url' => 'http://localhost/verify-email?token=test123',
            'expires_in' => 60,
            'notification_title' => 'System Maintenance',
            'notification_message' => 'Scheduled maintenance will occur on Sunday at 2 AM.',
            'additional_info' => 'This maintenance is expected to last 2 hours.',
            'invoice_number' => 'INV-2024-001',
            'amount' => '$299.99',
            'due_date' => '2024-12-31',
            'status' => 'Pending',
            'updated_fields' => 'Email address, Phone number',
            'account_url' => 'http://localhost/profile',
            'new_features' => 'Enhanced dashboard with analytics',
            'system_updates' => 'Performance improvements and bug fixes',
            'announcements' => 'New mobile app coming soon!',
            'dashboard_url' => 'http://localhost/dashboard',
            'test_email' => 'test@example.com',
        ];

        // Only return variables that are actually used in the template
        $usedVariables = $template->variables ?? [];
        $filteredData = [];

        foreach ($usedVariables as $variable) {
            if (isset($testData[$variable])) {
                $filteredData[$variable] = $testData[$variable];
            }
        }

        // Always include test_email
        $filteredData['test_email'] = $testData['test_email'];

        return $filteredData;
    }

    /**
     * Create a temporary view for the email template
     */
    private function createTemporaryView($template, $data)
    {
        // Replace variables in the content
        $processedContent = $this->replaceVariables($template->content, $data);
        
        // Create a temporary view file
        $viewPath = storage_path('app/temp_email_' . $template->id . '.blade.php');
        file_put_contents($viewPath, $processedContent);
        
        return $viewPath;
    }

    /**
     * Replace variables in content
     */
    private function replaceVariables($content, $data)
    {
        foreach ($data as $key => $value) {
            $content = str_replace('{{' . $key . '}}', $value, $content);
        }
        return $content;
    }
}
