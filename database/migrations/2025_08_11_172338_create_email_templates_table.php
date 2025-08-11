<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('email_templates', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('subject');
            $table->string('template_type')->default('widgets'); // widgets, minty, sunny, ark
            $table->text('content');
            $table->json('variables')->nullable(); // Dynamic variables like {{user_name}}, {{company_name}}
            $table->string('category')->default('general'); // welcome, notification, invoice, etc.
            $table->boolean('is_active')->default(true);
            $table->string('from_email')->nullable();
            $table->string('from_name')->nullable();
            $table->json('settings')->nullable(); // Template-specific settings
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('email_templates');
    }
};
