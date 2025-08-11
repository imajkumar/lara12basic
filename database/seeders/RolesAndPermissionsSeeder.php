<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions
        $permissions = [
            // User management
            'user.view' => 'View users',
            'user.create' => 'Create users',
            'user.update' => 'Update users',
            'user.delete' => 'Delete users',
            
            // Product management
            'product.view' => 'View products',
            'product.create' => 'Create products',
            'product.update' => 'Update products',
            'product.delete' => 'Delete products',
            
            // Role management
            'role.view' => 'View roles',
            'role.create' => 'Create roles',
            'role.update' => 'Update roles',
            'role.delete' => 'Delete roles',
            
            // Permission management
            'permission.view' => 'View permissions',
            'permission.create' => 'Create permissions',
            'permission.update' => 'Update permissions',
            'permission.delete' => 'Delete permissions',
            
            // System management
            'system.settings' => 'Access system settings',
            'system.reports' => 'View system reports',
        ];

        foreach ($permissions as $permission => $description) {
            Permission::create([
                'name' => $permission,
                'display_name' => $description,
                'description' => $description,
                'module' => explode('.', $permission)[0],
            ]);
        }

        // Create roles and assign permissions
        $superAdmin = Role::create([
            'name' => 'Super Admin',
            'description' => 'Full system access with all permissions',
        ]);
        $superAdmin->givePermissionTo(Permission::all());

        $admin = Role::create([
            'name' => 'Admin',
            'description' => 'Administrative access to most system features',
        ]);
        $admin->givePermissionTo([
            'user.view', 'user.create', 'user.update', 'user.delete',
            'product.view', 'product.create', 'product.update', 'product.delete',
            'role.view', 'role.create', 'role.update',
            'permission.view', 'permission.create', 'permission.update',
            'system.reports',
        ]);

        $manager = Role::create([
            'name' => 'Manager',
            'description' => 'Management access to team and project features',
        ]);
        $manager->givePermissionTo([
            'user.view',
            'product.view', 'product.create', 'product.update',
            'system.reports',
        ]);

        $user = Role::create([
            'name' => 'User',
            'description' => 'Standard user access to basic features',
        ]);
        $user->givePermissionTo([
            'product.view',
        ]);

        // Create default super admin user
        $superAdminUser = User::create([
            'name' => 'Super Admin',
            'email' => 'admin@goerp.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);
        $superAdminUser->assignRole('Super Admin');

        $this->command->info('Roles and permissions seeded successfully!');
        $this->command->info('Default Super Admin user created: admin@goerp.com / password');
    }
}
