<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->authorize('viewAny', User::class);
        
        $users = User::with('roles')
            ->when(request('search'), function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
            })
            ->when(request('role'), function ($query, $role) {
                $query->whereHas('roles', function ($q) use ($role) {
                    $q->where('name', $role);
                });
            })
            ->when(request('status'), function ($query, $status) {
                if ($status === 'active') {
                    $query->whereNotNull('email_verified_at');
                } elseif ($status === 'inactive') {
                    $query->whereNull('email_verified_at');
                }
            })
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        $roles = Role::all();
        
        return Inertia::render('users/index', [
            'users' => $users,
            'roles' => $roles,
            'filters' => request()->only(['search', 'role', 'status']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorize('create', User::class);
        
        $roles = Role::all();
        
        return Inertia::render('users/create', [
            'roles' => $roles,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $this->authorize('create', User::class);
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|exists:roles,name',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'email_verified_at' => now(),
        ]);

        $user->assignRole($validated['role']);

        return redirect()->route('users.index')
            ->with('success', 'User created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $user = User::with('roles', 'permissions')->findOrFail($id);
        $this->authorize('view', $user);
        
        $roles = Role::all();
        $permissions = Permission::all();
        
        return Inertia::render('users/show', [
            'user' => $user,
            'roles' => $roles,
            'permissions' => $permissions,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $user = User::with('roles')->findOrFail($id);
        $this->authorize('update', $user);
        
        $roles = Role::all();
        
        return Inertia::render('users/edit', [
            'user' => $user,
            'roles' => $roles,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $user = User::findOrFail($id);
        $this->authorize('update', $user);
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($id)],
            'role' => 'required|exists:roles,name',
            'password' => 'nullable|string|min:8|confirmed',
        ]);

        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
        ]);

        if ($validated['password']) {
            $user->update(['password' => Hash::make($validated['password'])]);
        }

        $user->syncRoles([$validated['role']]);

        return redirect()->route('users.index')
            ->with('success', 'User updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = User::findOrFail($id);
        $this->authorize('delete', $user);
        
        // Prevent deleting the last admin user
        if ($user->hasRole('Super Admin') && User::role('Super Admin')->count() <= 1) {
            return back()->with('error', 'Cannot delete the last Super Admin user.');
        }
        
        $user->delete();

        return redirect()->route('users.index')
            ->with('success', 'User deleted successfully.');
    }

    /**
     * Update user permissions
     */
    public function updatePermissions(Request $request, string $id)
    {
        $user = User::findOrFail($id);
        $this->authorize('update', $user);
        
        $validated = $request->validate([
            'permissions' => 'array',
            'permissions.*' => 'exists:permissions,name',
        ]);

        $user->syncPermissions($validated['permissions'] ?? []);

        return back()->with('success', 'User permissions updated successfully.');
    }

    /**
     * Get all roles and permissions for management
     */
    public function rolesAndPermissions()
    {
        $this->authorize('viewAny', User::class);
        
        $roles = Role::with('permissions')->get();
        $permissions = Permission::all();
        
        return Inertia::render('users/roles-permissions', [
            'roles' => $roles,
            'permissions' => $permissions,
        ]);
    }
}
