<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionController extends Controller
{
    /**
     * Display roles and permissions management page
     */
    public function index()
    {
        $this->authorize('viewAny', \App\Models\User::class);
        
        $roles = Role::with('permissions')->get();
        $permissions = Permission::all();
        
        return Inertia::render('users/roles-permissions', [
            'roles' => $roles,
            'permissions' => $permissions,
        ]);
    }

    /**
     * Store a new role
     */
    public function storeRole(Request $request)
    {
        $this->authorize('create', \App\Models\User::class);
        
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles,name',
            'description' => 'nullable|string',
            'permissions' => 'array',
            'permissions.*' => 'exists:permissions,name',
        ]);

        $role = Role::create([
            'name' => $validated['name'],
            'description' => $validated['description'],
        ]);

        if ($validated['permissions']) {
            $role->syncPermissions($validated['permissions']);
        }

        return back()->with('success', 'Role created successfully.');
    }

    /**
     * Update a role
     */
    public function updateRole(Request $request, Role $role)
    {
        $this->authorize('update', \App\Models\User::class);
        
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles,name,' . $role->id,
            'description' => 'nullable|string',
            'permissions' => 'array',
            'permissions.*' => 'exists:permissions,name',
        ]);

        $role->update([
            'name' => $validated['name'],
            'description' => $validated['description'],
        ]);

        $role->syncPermissions($validated['permissions'] ?? []);

        return back()->with('success', 'Role updated successfully.');
    }

    /**
     * Delete a role
     */
    public function destroyRole(Role $role)
    {
        $this->authorize('delete', \App\Models\User::class);
        
        // Prevent deleting system roles
        if (in_array($role->name, ['Super Admin', 'Admin'])) {
            return back()->with('error', 'Cannot delete system roles.');
        }
        
        $role->delete();

        return back()->with('success', 'Role deleted successfully.');
    }

    /**
     * Store a new permission
     */
    public function storePermission(Request $request)
    {
        $this->authorize('create', \App\Models\User::class);
        
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:permissions,name',
            'display_name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'module' => 'nullable|string|max:255',
        ]);

        $permission = Permission::create($validated);

        return back()->with('success', 'Permission created successfully.');
    }

    /**
     * Update a permission
     */
    public function updatePermission(Request $request, Permission $permission)
    {
        $this->authorize('update', \App\Models\User::class);
        
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:permissions,name,' . $permission->id,
            'display_name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'module' => 'nullable|string|max:255',
        ]);

        $permission->update($validated);

        return back()->with('success', 'Permission updated successfully.');
    }

    /**
     * Delete a permission
     */
    public function destroyPermission(Permission $permission)
    {
        $this->authorize('delete', \App\Models\User::class);
        
        $permission->delete();

        return back()->with('success', 'Permission deleted successfully.');
    }
}
