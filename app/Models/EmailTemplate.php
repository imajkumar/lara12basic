<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmailTemplate extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'subject',
        'template_type',
        'content',
        'variables',
        'category',
        'is_active',
        'from_email',
        'from_name',
        'settings',
    ];

    protected $casts = [
        'variables' => 'array',
        'settings' => 'array',
        'is_active' => 'boolean',
    ];

    public function getVariablesListAttribute()
    {
        return $this->variables ?? [];
    }

    public function getSettingsListAttribute()
    {
        return $this->settings ?? [];
    }
}
