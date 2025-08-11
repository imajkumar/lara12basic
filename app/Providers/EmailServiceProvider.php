<?php

namespace App\Providers;

use App\Models\EmailTemplate;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\View;
use Illuminate\Support\Facades\Blade;
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
                    $template = EmailTemplate::find($templateId);
                    if (!$template || !$template->is_active) {
                        throw new \Exception('Template not found or inactive');
                    }

                    $to = $to ?? $data['test_email'] ?? 'test@example.com';
                    $subject = $subject ?? $this->replaceVariables($template->subject, $data);

                    // Create a temporary view with the processed content
                    $processedContent = $this->processTemplateContent($template, $data);
                    
                    // Create a unique view name
                    $viewName = 'temp_email_' . uniqid();
                    
                    // Register the temporary view
                    View::addNamespace('temp', storage_path('app'));
                    
                    // Write the processed content to a temporary file
                    $tempFile = storage_path('app/' . $viewName . '.blade.php');
                    file_put_contents($tempFile, $processedContent);

                    try {
                        $beautymail = app()->make(Beautymail::class);
                        $beautymail->send('temp::' . $viewName, $data, function($message) use ($template, $to, $subject) {
                            $message
                                ->from($template->from_email ?? config('mail.from.address'), $template->from_name ?? config('mail.from.name'))
                                ->to($to)
                                ->subject($subject);
                        });

                        // Clean up temporary file
                        if (file_exists($tempFile)) {
                            unlink($tempFile);
                        }

                        return true;
                    } catch (\Exception $e) {
                        // Clean up temporary file on error
                        if (file_exists($tempFile)) {
                            unlink($tempFile);
                        }
                        throw $e;
                    }
                }

                public function sendWelcomeEmail($user, $data = [])
                {
                    $template = EmailTemplate::where('category', 'welcome')->where('is_active', true)->first();
                    
                    if ($template) {
                        $data = array_merge([
                            'user_name' => $user->name,
                            'user_email' => $user->email,
                            'company_name' => config('app.name'),
                            'login_url' => route('login'),
                        ], $data);
                        
                        return $this->sendTemplate($template->id, $data, $user->email);
                    }
                    
                    // Fallback to default welcome email
                    return $this->sendDefaultWelcomeEmail($user, $data);
                }

                public function sendPasswordResetEmail($user, $resetUrl, $data = [])
                {
                    $template = EmailTemplate::where('category', 'password')->where('is_active', true)->first();
                    
                    if ($template) {
                        $data = array_merge([
                            'user_name' => $user->name,
                            'user_email' => $user->email,
                            'company_name' => config('app.name'),
                            'reset_url' => $resetUrl,
                            'expires_in' => config('auth.passwords.users.expire', 60),
                        ], $data);
                        
                        return $this->sendTemplate($template->id, $data, $user->email);
                    }
                    
                    // Fallback to default password reset email
                    return $this->sendDefaultPasswordResetEmail($user, $resetUrl, $data);
                }

                public function sendNotificationEmail($user, $notification, $data = [])
                {
                    $template = EmailTemplate::where('category', 'notification')->where('is_active', true)->first();
                    
                    if ($template) {
                        $data = array_merge([
                            'user_name' => $user->name,
                            'user_email' => $user->email,
                            'company_name' => config('app.name'),
                            'notification_title' => $notification->title ?? 'Notification',
                            'notification_message' => $notification->message ?? '',
                            'additional_info' => $notification->additional_info ?? '',
                        ], $data);
                        
                        return $this->sendTemplate($template->id, $data, $user->email);
                    }
                    
                    // Fallback to default notification email
                    return $this->sendDefaultNotificationEmail($user, $notification, $data);
                }

                private function processTemplateContent($template, $data)
                {
                    // First replace variables in the content
                    $content = $this->replaceVariables($template->content, $data);
                    
                    // Then process any remaining Blade directives
                    $content = $this->processBladeDirectives($content, $data);
                    
                    return $content;
                }

                private function processBladeDirectives($content, $data)
                {
                    // Process @include directives
                    $content = preg_replace_callback(
                        '/@include\s*\(\s*[\'"]([^\'"]+)[\'"](?:\s*,\s*(\[[^\]]+\]))?\s*\)/',
                        function($matches) use ($data) {
                            $view = $matches[1];
                            $viewData = isset($matches[2]) ? eval('return ' . $matches[2] . ';') : [];
                            
                            // Merge data
                            $viewData = array_merge($data, $viewData);
                            
                            try {
                                return view($view, $viewData)->render();
                            } catch (\Exception $e) {
                                return '<!-- Error rendering view: ' . $e->getMessage() . ' -->';
                            }
                        },
                        $content
                    );
                    
                    return $content;
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
                    $beautymail->send('emails.welcome', [
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
                    $beautymail->send('emails.password-reset', [
                        'user_name' => $user->name,
                        'company_name' => config('app.name'),
                        'reset_url' => $resetUrl,
                        'expires_in' => config('auth.passwords.users.expire', 60),
                    ], function($message) use ($user) {
                        $message
                            ->from(config('mail.from.address'), config('mail.from.name'))
                            ->to($user->email)
                            ->subject('Password Reset Request - ' . config('app.name'));
                    });
                }

                private function sendDefaultNotificationEmail($user, $notification, $data)
                {
                    $beautymail = app()->make(Beautymail::class);
                    $beautymail->send('emails.notification', [
                        'user_name' => $user->name,
                        'company_name' => config('app.name'),
                        'notification_title' => $notification->title ?? 'Notification',
                        'notification_message' => $notification->message ?? '',
                        'additional_info' => $notification->additional_info ?? '',
                    ], function($message) use ($user) {
                        $message
                            ->from(config('mail.from.address'), config('mail.from.name'))
                            ->to($user->email)
                            ->subject('Notification - ' . config('app.name'));
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
