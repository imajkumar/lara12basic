<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\EmailTemplate;
use App\Models\User;

class TestEmailTemplates extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'email:test {template? : The template name to test} {email? : Email address to send test to}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test email templates by sending test emails';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $templateName = $this->argument('template');
        $testEmail = $this->argument('email') ?? 'test@example.com';

        if ($templateName) {
            $this->testSpecificTemplate($templateName, $testEmail);
        } else {
            $this->testAllTemplates($testEmail);
        }
    }

    private function testSpecificTemplate($templateName, $testEmail)
    {
        $template = EmailTemplate::where('name', 'like', "%{$templateName}%")->first();

        if (!$template) {
            $this->error("Template not found: {$templateName}");
            return;
        }

        $this->info("Testing template: {$template->name}");
        $this->sendTestEmail($template, $testEmail);
    }

    private function testAllTemplates($testEmail)
    {
        $templates = EmailTemplate::where('is_active', true)->get();

        if ($templates->isEmpty()) {
            $this->error('No active email templates found.');
            return;
        }

        $this->info("Found {$templates->count()} active templates. Testing...");

        foreach ($templates as $template) {
            $this->info("Testing: {$template->name}");
            $this->sendTestEmail($template, $testEmail);
            $this->newLine();
        }
    }

    private function sendTestEmail($template, $testEmail)
    {
        try {
            // Generate test data based on template variables
            $testData = $this->generateTestData($template);
            $testData['test_email'] = $testEmail;

            // Use the email service to send the test email
            app('email.service')->sendTemplate($template->id, $testData, $testEmail);

            $this->info("✅ Test email sent successfully to: {$testEmail}");
            $this->info("   Subject: {$template->subject}");
            $this->info("   Template Type: {$template->template_type}");
            $this->info("   Category: {$template->category}");

        } catch (\Exception $e) {
            $this->error("❌ Failed to send test email: " . $e->getMessage());
        }
    }

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
        ];

        // Only return variables that are actually used in the template
        $usedVariables = $template->variables ?? [];
        $filteredData = [];

        foreach ($usedVariables as $variable) {
            if (isset($testData[$variable])) {
                $filteredData[$variable] = $testData[$variable];
            }
        }

        return $filteredData;
    }
}
