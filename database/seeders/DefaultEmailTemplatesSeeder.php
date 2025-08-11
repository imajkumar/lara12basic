<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\EmailTemplate;

class DefaultEmailTemplatesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $templates = [
            [
                'name' => 'Welcome Email',
                'subject' => 'Welcome to {{company_name}}!',
                'template_type' => 'widgets',
                'content' => "@include('beautymail::templates.widgets.articleStart')

    <h4 class=\"secondary\"><strong>Welcome to {{company_name}}!</strong></h4>
    <p>Hello {{user_name}},</p>
    <p>We're thrilled to have you on board! Your account has been successfully created and you can now access all the features of our ERP system.</p>
    <p>Here are some quick links to get you started:</p>
    <ul>
        <li><strong>Dashboard:</strong> <a href=\"{{login_url}}\">Access your dashboard</a></li>
        <li><strong>Profile:</strong> Complete your profile information</li>
        <li><strong>Support:</strong> Contact our support team if you need help</li>
    </ul>
    <p>If you have any questions, feel free to reach out to our support team.</p>
    <p>Best regards,<br>The {{company_name}} Team</p>

@include('beautymail::templates.widgets.articleEnd')",
                'variables' => ['user_name', 'company_name', 'login_url'],
                'category' => 'welcome',
                'is_active' => true,
                'from_email' => 'noreply@company.com',
                'from_name' => 'Company Name',
                'settings' => ['color' => '#3B82F6'],
            ],
            [
                'name' => 'Password Reset Request',
                'subject' => 'Password Reset Request - {{company_name}}',
                'template_type' => 'minty',
                'content' => "@include('beautymail::templates.minty.contentStart')
    <tr>
        <td class=\"title\">Password Reset Request</td>
    </tr>
    <tr>
        <td width=\"100%\" height=\"10\"></td>
    </tr>
    <tr>
        <td class=\"paragraph\">
            Hello {{user_name}},
        </td>
    </tr>
    <tr>
        <td width=\"100%\" height=\"10\"></td>
    </tr>
    <tr>
        <td class=\"paragraph\">
            We received a request to reset your password for your {{company_name}} account.
        </td>
    </tr>
    <tr>
        <td width=\"100%\" height=\"25\"></td>
    </tr>
    <tr>
        <td>
            @include('beautymail::templates.minty.button', ['text' => 'Reset Password', 'link' => '{{reset_url}}'])
        </td>
    </tr>
    <tr>
        <td width=\"100%\" height=\"25\"></td>
    </tr>
    <tr>
        <td class=\"paragraph\">
            This link will expire in {{expires_in}} minutes. If you didn't request this password reset, please ignore this email.
        </td>
    </tr>
    <tr>
        <td width=\"100%\" height=\"25\"></td>
    </tr>
    <tr>
        <td class=\"paragraph\">
            Best regards,<br>The {{company_name}} Team
        </td>
    </tr>
@include('beautymail::templates.minty.contentEnd')",
                'variables' => ['user_name', 'company_name', 'reset_url', 'expires_in'],
                'category' => 'password',
                'is_active' => true,
                'from_email' => 'noreply@company.com',
                'from_name' => 'Company Name',
                'settings' => ['color' => '#EF4444'],
            ],
            [
                'name' => 'Email Verification',
                'subject' => 'Verify Your Email - {{company_name}}',
                'template_type' => 'sunny',
                'content' => "@include('beautymail::templates.sunny.heading', [
    'heading' => 'Verify Your Email Address',
    'level' => 'h1',
])

@include('beautymail::templates.sunny.contentStart')
    <p>Hello {{user_name}},</p>
    <p>Thank you for signing up with {{company_name}}! To complete your registration, please verify your email address by clicking the button below:</p>
@include('beautymail::templates.sunny.contentEnd')

@include('beautymail::templates.sunny.button', [
    'title' => 'Verify Email Address',
    'link' => '{{verification_url}}'
])

@include('beautymail::templates.sunny.contentStart')
    <p>If you didn't create an account, no further action is required.</p>
    <p>Best regards,<br>The {{company_name}} Team</p>
@include('beautymail::templates.sunny.contentEnd')",
                'variables' => ['user_name', 'company_name', 'verification_url'],
                'category' => 'verification',
                'is_active' => true,
                'from_email' => 'noreply@company.com',
                'from_name' => 'Company Name',
                'settings' => ['color' => '#10B981'],
            ],
            [
                'name' => 'System Notification',
                'subject' => '{{notification_title}} - {{company_name}}',
                'template_type' => 'ark',
                'content' => "@include('beautymail::templates.ark.heading', [
    'heading' => '{{notification_title}}',
    'level' => 'h1'
])

@include('beautymail::templates.ark.contentStart')
    <h4 class=\"secondary\"><strong>Hello {{user_name}}</strong></h4>
    <p>{{notification_message}}</p>
    
    <div class=\"info-box\">
        <h5>Additional Information:</h5>
        <p>{{additional_info}}</p>
    </div>
@include('beautymail::templates.ark.contentEnd')

@include('beautymail::templates.ark.heading', [
    'heading' => 'Need Help?',
    'level' => 'h2'
])

@include('beautymail::templates.ark.contentStart')
    <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
    <p>Best regards,<br>The {{company_name}} Team</p>
@include('beautymail::templates.ark.contentEnd')",
                'variables' => ['user_name', 'company_name', 'notification_title', 'notification_message', 'additional_info'],
                'category' => 'notification',
                'is_active' => true,
                'from_email' => 'noreply@company.com',
                'from_name' => 'Company Name',
                'settings' => ['color' => '#8B5CF6'],
            ],
            [
                'name' => 'Invoice Email',
                'subject' => 'Invoice #{{invoice_number}} - {{company_name}}',
                'template_type' => 'widgets',
                'content' => "@include('beautymail::templates.widgets.articleStart')

    <h4 class=\"secondary\"><strong>Invoice #{{invoice_number}}</strong></h4>
    <p>Hello {{user_name}},</p>
    <p>Your invoice has been generated and is ready for payment.</p>
    
    <div class=\"invoice-details\">
        <h5>Invoice Details:</h5>
        <ul>
            <li><strong>Invoice Number:</strong> {{invoice_number}}</li>
            <li><strong>Amount:</strong> {{amount}}</li>
            <li><strong>Due Date:</strong> {{due_date}}</li>
            <li><strong>Status:</strong> {{status}}</li>
        </ul>
    </div>
    
    <p>Please review the attached invoice and process your payment by the due date.</p>
    
    <p>If you have any questions about this invoice, please contact our billing department.</p>
    
    <p>Best regards,<br>The {{company_name}} Team</p>

@include('beautymail::templates.widgets.articleEnd')",
                'variables' => ['user_name', 'company_name', 'invoice_number', 'amount', 'due_date', 'status'],
                'category' => 'invoice',
                'is_active' => true,
                'from_email' => 'billing@company.com',
                'from_name' => 'Company Billing',
                'settings' => ['color' => '#059669'],
            ],
            [
                'name' => 'Account Update',
                'subject' => 'Account Information Updated - {{company_name}}',
                'template_type' => 'minty',
                'content' => "@include('beautymail::templates.minty.contentStart')
    <tr>
        <td class=\"title\">Account Information Updated</td>
    </tr>
    <tr>
        <td width=\"100%\" height=\"10\"></td>
    </tr>
    <tr>
        <td class=\"paragraph\">
            Hello {{user_name}},
        </td>
    </tr>
    <tr>
        <td width=\"100%\" height=\"10\"></td>
    </tr>
    <tr>
        <td class=\"paragraph\">
            Your account information has been successfully updated. Here are the details of the changes:
        </td>
    </tr>
    <tr>
        <td width=\"100%\" height=\"25\"></td>
    </tr>
    <tr>
        <td class=\"paragraph\">
            <strong>Updated Fields:</strong><br>
            {{updated_fields}}
        </td>
    </tr>
    <tr>
        <td width=\"100%\" height=\"25\"></td>
    </tr>
    <tr>
        <td class=\"paragraph\">
            If you didn't make these changes, please contact our support team immediately.
        </td>
    </tr>
    <tr>
        <td width=\"100%\" height=\"25\"></td>
    </tr>
    <tr>
        <td>
            @include('beautymail::templates.minty.button', ['text' => 'View Account', 'link' => '{{account_url}}'])
        </td>
    </tr>
@include('beautymail::templates.minty.contentEnd')",
                'variables' => ['user_name', 'company_name', 'updated_fields', 'account_url'],
                'category' => 'notification',
                'is_active' => true,
                'from_email' => 'noreply@company.com',
                'from_name' => 'Company Name',
                'settings' => ['color' => '#F59E0B'],
            ],
            [
                'name' => 'Welcome Back',
                'subject' => 'Welcome Back to {{company_name}}!',
                'template_type' => 'sunny',
                'content' => "@include('beautymail::templates.sunny.heading', [
    'heading' => 'Welcome Back!',
    'level' => 'h1',
])

@include('beautymail::templates.sunny.contentStart')
    <p>Hello {{user_name}},</p>
    <p>Welcome back to {{company_name}}! We're glad to see you again.</p>
    <p>Here's what's new since your last visit:</p>
    <ul>
        <li>{{new_features}}</li>
        <li>{{system_updates}}</li>
        <li>{{announcements}}</li>
    </ul>
@include('beautymail::templates.sunny.contentEnd')

@include('beautymail::templates.sunny.button', [
    'title' => 'Access Your Dashboard',
    'link' => '{{dashboard_url}}'
])

@include('beautymail::templates.sunny.contentStart')
    <p>If you have any questions or need assistance, our support team is here to help.</p>
    <p>Best regards,<br>The {{company_name}} Team</p>
@include('beautymail::templates.sunny.contentEnd')",
                'variables' => ['user_name', 'company_name', 'new_features', 'system_updates', 'announcements', 'dashboard_url'],
                'category' => 'welcome',
                'is_active' => true,
                'from_email' => 'noreply@company.com',
                'from_name' => 'Company Name',
                'settings' => ['color' => '#06B6D4'],
            ],
        ];

        foreach ($templates as $template) {
            EmailTemplate::create($template);
        }

        $this->command->info('Default email templates created successfully!');
    }
}
