<?php

namespace App\Providers;

use App\Models\EmailTemplate;
use Illuminate\Support\ServiceProvider;
use Snowfire\Beautymail\Beautymail;

class EmailServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->singleton('email.service', function ($app) {
            return new class {
                public function sendTemplate($templateId, $data = [], $to = null, $subject = null)
                {
                    $template = EmailTemplate::findOrFail($templateId);
                    
                    if (!$template->is_active) {
                        throw new \Exception('Template is not active');
                    }

                    $beautymail = app()->make(Beautymail::class);
                    
                    // Replace variables in subject and content
                    $finalSubject = $this->replaceVariables($subject ?? $template->subject, $data);
                    $finalContent = $this->replaceVariables($template->content, $data);
                    
                    // Create dynamic email view
                    $viewData = [
                        'content' => $finalContent,
                        'template_type' => $template->template_type,
                        'settings' => $template->settings ?? [],
                    ];

                    return $beautymail->send('emails.dynamic', $viewData, function($message) use ($template, $to, $finalSubject) {
                        $message
                            ->from($template->from_email ?? config('mail.from.address'), $template->from_name ?? config('mail.from.name'))
                            ->to($to)
                            ->subject($finalSubject);
                    });
                }

                public function sendWelcomeEmail($user, $data = [])
                {
                    $template = EmailTemplate::where('category', 'welcome')->where('is_active', true)->first();
                    
                    if (!$template) {
                        // Fallback to default welcome email
                        return $this->sendDefaultWelcomeEmail($user, $data);
                    }

                    $emailData = array_merge([
                        'user_name' => $user->name,
                        'user_email' => $user->email,
                        'company_name' => config('app.name'),
                        'login_url' => route('login'),
                    ], $data);

                    return $this->sendTemplate($template->id, $emailData, $user->email);
                }

                public function sendPasswordResetEmail($user, $resetUrl, $data = [])
                {
                    $template = EmailTemplate::where('category', 'password')->where('is_active', true)->first();
                    
                    if (!$template) {
                        // Fallback to default password reset email
                        return $this->sendDefaultPasswordResetEmail($user, $resetUrl, $data);
                    }

                    $emailData = array_merge([
                        'user_name' => $user->name,
                        'reset_url' => $resetUrl,
                        'company_name' => config('app.name'),
                        'expires_in' => config('auth.passwords.users.expire', 60),
                    ], $data);

                    return $this->sendTemplate($template->id, $emailData, $user->email);
                }

                public function sendNotificationEmail($user, $notification, $data = [])
                {
                    $template = EmailTemplate::where('category', 'notification')->where('is_active', true)->first();
                    
                    if (!$template) {
                        // Fallback to default notification email
                        return $this->sendDefaultNotificationEmail($user, $notification, $data);
                    }

                    $emailData = array_merge([
                        'user_name' => $user->name,
                        'notification_title' => $notification['title'] ?? 'Notification',
                        'notification_message' => $notification['message'] ?? '',
                        'company_name' => config('app.name'),
                    ], $data);

                    return $this->sendTemplate($template->id, $emailData, $user->email);
                }

                private function replaceVariables($content, $data)
                {
                    foreach ($data as $key => $value) {
                        $content = str_replace('{{' . $key . '}}', $value, $content);
                    }
                    return $content;
                }

                private function sendDefaultWelcomeEmail($user, $data)
                {
                    $beautymail = app()->make(Beautymail::class);
                    
                    return $beautymail->send('emails.welcome', [
                        'user_name' => $user->name,
                        'company_name' => config('app.name'),
                        'login_url' => route('login'),
                    ], function($message) use ($user) {
                        $message
                            ->from(config('mail.from.address'), config('mail.from.name'))
                            ->to($user->email)
                            ->subject('Welcome to ' . config('app.name'));
                    });
                }

                private function sendDefaultPasswordResetEmail($user, $resetUrl, $data)
                {
                    $beautymail = app()->make(Beautymail::class);
                    
                    return $beautymail->send('emails.password-reset', [
                        'user_name' => $user->name,
                        'reset_url' => $resetUrl,
                        'company_name' => config('app.name'),
                    ], function($message) use ($user) {
                        $message
                            ->from(config('mail.from.address'), config('mail.from.name'))
                            ->to($user->email)
                            ->subject('Password Reset Request');
                    });
                }

                private function sendDefaultNotificationEmail($user, $notification, $data)
                {
                    $beautymail = app()->make(Beautymail::class);
                    
                    return $beautymail->send('emails.notification', [
                        'user_name' => $user->name,
                        'notification_title' => $notification['title'] ?? 'Notification',
                        'notification_message' => $notification['message'] ?? '',
                        'company_name' => config('app.name'),
                    ], function($message) use ($user) {
                        $message
                            ->from(config('mail.from.address'), config('mail.from.name'))
                            ->to($user->email)
                            ->subject('Notification from ' . config('app.name'));
                    });
                }
            };
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
