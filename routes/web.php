<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // User Management Routes
    Route::prefix('users')->group(function () {
        Route::get('/', [App\Http\Controllers\UserController::class, 'index'])->name('users.index');
        Route::get('/create', [App\Http\Controllers\UserController::class, 'create'])->name('users.create');
        Route::post('/', [App\Http\Controllers\UserController::class, 'store'])->name('users.store');
        Route::get('/{id}', [App\Http\Controllers\UserController::class, 'show'])->name('users.show');
        Route::get('/{id}/edit', [App\Http\Controllers\UserController::class, 'edit'])->name('users.edit');
        Route::put('/{id}', [App\Http\Controllers\UserController::class, 'update'])->name('users.update');
        Route::delete('/{id}', [App\Http\Controllers\UserController::class, 'destroy'])->name('users.destroy');
        Route::put('/{id}/permissions', [App\Http\Controllers\UserController::class, 'updatePermissions'])->name('users.permissions');
    });

    // Roles & Permissions Management
    Route::prefix('admin')->group(function () {
        Route::get('/roles-permissions', [App\Http\Controllers\RolePermissionController::class, 'index'])->name('admin.roles-permissions');
        Route::post('/roles', [App\Http\Controllers\RolePermissionController::class, 'storeRole'])->name('admin.roles.store');
        Route::put('/roles/{role}', [App\Http\Controllers\RolePermissionController::class, 'updateRole'])->name('admin.roles.update');
        Route::delete('/roles/{role}', [App\Http\Controllers\RolePermissionController::class, 'destroyRole'])->name('admin.roles.destroy');
        Route::post('/permissions', [App\Http\Controllers\RolePermissionController::class, 'storePermission'])->name('admin.permissions.store');
        Route::put('/permissions/{permission}', [App\Http\Controllers\RolePermissionController::class, 'updatePermission'])->name('admin.permissions.update');
        Route::delete('/permissions/{permission}', [App\Http\Controllers\RolePermissionController::class, 'destroyPermission'])->name('admin.permissions.destroy');
    });

    Route::prefix('roles')->group(function () {
        Route::get('/', function () {
            return Inertia::render('roles/index');
        })->name('roles.index');
    });

    Route::prefix('permissions')->group(function () {
        Route::get('/', function () {
            return Inertia::render('permissions/index');
        })->name('permissions.index');
    });

    // Product Management Routes
    Route::prefix('products')->group(function () {
        Route::get('/', [App\Http\Controllers\ProductController::class, 'index'])->name('products.index');
        Route::get('/create', [App\Http\Controllers\ProductController::class, 'create'])->name('products.create');
        Route::post('/', [App\Http\Controllers\ProductController::class, 'store'])->name('products.store');
        Route::get('/{id}', [App\Http\Controllers\ProductController::class, 'show'])->name('products.show');
        Route::get('/{id}/edit', [App\Http\Controllers\ProductController::class, 'edit'])->name('products.edit');
        Route::put('/{id}', [App\Http\Controllers\ProductController::class, 'update'])->name('products.update');
        Route::delete('/{id}', [App\Http\Controllers\ProductController::class, 'destroy'])->name('products.destroy');
    });

    // Email Template Management Routes
    Route::prefix('email-templates')->group(function () {
        Route::get('/', [App\Http\Controllers\EmailTemplateController::class, 'index'])->name('email-templates.index');
        Route::get('/create', [App\Http\Controllers\EmailTemplateController::class, 'create'])->name('email-templates.create');
        Route::post('/', [App\Http\Controllers\EmailTemplateController::class, 'store'])->name('email-templates.store');
        Route::get('/{id}', [App\Http\Controllers\EmailTemplateController::class, 'show'])->name('email-templates.show');
        Route::get('/{id}/edit', [App\Http\Controllers\EmailTemplateController::class, 'edit'])->name('email-templates.edit');
        Route::put('/{id}', [App\Http\Controllers\EmailTemplateController::class, 'update'])->name('email-templates.update');
        Route::delete('/{id}', [App\Http\Controllers\EmailTemplateController::class, 'destroy'])->name('email-templates.destroy');
        Route::post('/{id}/test', [App\Http\Controllers\EmailTemplateController::class, 'sendTest'])->name('email-templates.test');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
