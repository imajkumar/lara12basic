import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { 
    Shield, 
    Key, 
    Plus, 
    Edit, 
    Trash2, 
    Save, 
    X,
    Users,
    CheckCircle,
    XCircle
} from 'lucide-react';
import { useState } from 'react';

interface Permission {
    id: number;
    name: string;
    display_name: string;
    description: string | null;
    module: string | null;
}

interface Role {
    id: number;
    name: string;
    description: string | null;
    permissions: Permission[];
}

interface Props {
    roles: Role[];
    permissions: Permission[];
}

export default function RolesPermissions({ roles, permissions }: Props) {
    const [editingRole, setEditingRole] = useState<Role | null>(null);
    const [editingPermission, setEditingPermission] = useState<Permission | null>(null);
    const [showRoleForm, setShowRoleForm] = useState(false);
    const [showPermissionForm, setShowPermissionForm] = useState(false);

    const { data: roleData, setData: setRoleData, post: postRole, put: putRole, processing: roleProcessing, errors: roleErrors, reset: resetRole } = useForm({
        name: '',
        description: '',
        permissions: [] as string[],
    });

    const { data: permissionData, setData: setPermissionData, post: postPermission, put: putPermission, processing: permissionProcessing, errors: permissionErrors, reset: resetPermission } = useForm({
        name: '',
        display_name: '',
        description: '',
        module: '',
    });

    const { delete: deleteRole, processing: deleteRoleProcessing } = useForm();
    const { delete: deletePermission, processing: deletePermissionProcessing } = useForm();

    const handleCreateRole = () => {
        setShowRoleForm(true);
        setEditingRole(null);
        resetRole();
    };

    const handleEditRole = (role: Role) => {
        setEditingRole(role);
        setShowRoleForm(true);
        setRoleData({
            name: role.name,
            description: role.description || '',
            permissions: role.permissions.map(p => p.name),
        });
    };

    const handleSubmitRole = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingRole) {
            putRole(`/admin/roles/${editingRole.id}`, {
                onSuccess: () => {
                    setShowRoleForm(false);
                    setEditingRole(null);
                    resetRole();
                }
            });
        } else {
            postRole('/admin/roles', {
                onSuccess: () => {
                    setShowRoleForm(false);
                    resetRole();
                }
            });
        }
    };

    const handleCreatePermission = () => {
        setShowPermissionForm(true);
        setEditingPermission(null);
        resetPermission();
    };

    const handleEditPermission = (permission: Permission) => {
        setEditingPermission(permission);
        setShowPermissionForm(true);
        setPermissionData({
            name: permission.name,
            display_name: permission.display_name,
            description: permission.description || '',
            module: permission.module || '',
        });
    };

    const handleSubmitPermission = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingPermission) {
            putPermission(`/admin/permissions/${editingPermission.id}`, {
                onSuccess: () => {
                    setShowPermissionForm(false);
                    setEditingPermission(null);
                    resetPermission();
                }
            });
        } else {
            postPermission('/admin/permissions', {
                onSuccess: () => {
                    setShowPermissionForm(false);
                    resetPermission();
                }
            });
        }
    };

    const handleDeleteRole = (roleId: number) => {
        deleteRole(`/admin/roles/${roleId}`, {
            onSuccess: () => {
                // The page will refresh with updated data
            }
        });
    };

    const handleDeletePermission = (permissionId: number) => {
        deletePermission(`/admin/permissions/${permissionId}`, {
            onSuccess: () => {
                // The page will refresh with updated data
            }
        });
    };

    const getModuleColor = (module: string) => {
        const colors: { [key: string]: string } = {
            'user': 'bg-blue-100 text-blue-800',
            'product': 'bg-green-100 text-green-800',
            'role': 'bg-purple-100 text-purple-800',
            'permission': 'bg-orange-100 text-orange-800',
            'system': 'bg-red-100 text-red-800',
        };
        return colors[module] || 'bg-gray-100 text-gray-800';
    };

    return (
        <AppLayout>
            <Head title="Roles & Permissions Management" />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <Heading title="Roles & Permissions Management" />
                        <p className="text-muted-foreground">
                            Manage user roles and system permissions
                        </p>
                    </div>
                    <div className="flex space-x-3">
                        <Button onClick={handleCreateRole}>
                            <Shield className="mr-2 h-4 w-4" />
                            Add Role
                        </Button>
                        <Button onClick={handleCreatePermission}>
                            <Key className="mr-2 h-4 w-4" />
                            Add Permission
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Roles Management */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Shield className="mr-2 h-5 w-5" />
                                Roles ({roles.length})
                            </CardTitle>
                            <CardDescription>
                                Manage user roles and their permissions
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {roles.map((role) => (
                                <div key={role.id} className="border rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <div>
                                            <h3 className="font-semibold">{role.name}</h3>
                                            <p className="text-sm text-muted-foreground">
                                                {role.description || 'No description'}
                                            </p>
                                        </div>
                                        <div className="flex space-x-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleEditRole(role)}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            {!['Super Admin', 'Admin'].includes(role.name) && (
                                                <ConfirmDialog
                                                    title="Delete Role"
                                                    description={`Are you sure you want to delete the role "${role.name}"? This action cannot be undone.`}
                                                    confirmText="Delete Role"
                                                    onConfirm={() => handleDeleteRole(role.id)}
                                                >
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="text-destructive hover:text-destructive"
                                                        disabled={deleteRoleProcessing}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </ConfirmDialog>
                                            )}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Permissions ({role.permissions.length}):
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {role.permissions.map((permission) => (
                                                <Badge
                                                    key={permission.id}
                                                    variant="outline"
                                                    className="text-xs"
                                                >
                                                    {permission.display_name}
                                                </Badge>
                                            ))}
                                            {role.permissions.length === 0 && (
                                                <span className="text-sm text-muted-foreground">
                                                    No permissions assigned
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Permissions Management */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Key className="mr-2 h-5 w-5" />
                                Permissions ({permissions.length})
                            </CardTitle>
                            <CardDescription>
                                System permissions that can be assigned to roles
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {permissions.map((permission) => (
                                <div key={permission.id} className="border rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <div>
                                            <h3 className="font-semibold">{permission.display_name}</h3>
                                            <p className="text-sm text-muted-foreground">
                                                {permission.name}
                                            </p>
                                            {permission.description && (
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    {permission.description}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex space-x-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleEditPermission(permission)}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <ConfirmDialog
                                                title="Delete Permission"
                                                description={`Are you sure you want to delete the permission "${permission.display_name}"? This action cannot be undone.`}
                                                confirmText="Delete Permission"
                                                onConfirm={() => handleDeletePermission(permission.id)}
                                            >
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-destructive hover:text-destructive"
                                                    disabled={deletePermissionProcessing}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </ConfirmDialog>
                                        </div>
                                    </div>
                                    {permission.module && (
                                        <Badge className={getModuleColor(permission.module)}>
                                            {permission.module}
                                        </Badge>
                                    )}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* Role Form Modal */}
                {showRoleForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold">
                                    {editingRole ? 'Edit Role' : 'Create New Role'}
                                </h2>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowRoleForm(false)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                            
                            <form onSubmit={handleSubmitRole} className="space-y-4">
                                <div>
                                    <Label htmlFor="role-name">Role Name *</Label>
                                    <Input
                                        id="role-name"
                                        value={roleData.name}
                                        onChange={(e) => setRoleData('name', e.target.value)}
                                        placeholder="Enter role name"
                                        className={roleErrors.name ? 'border-red-500' : ''}
                                    />
                                    {roleErrors.name && (
                                        <p className="text-sm text-red-500 mt-1">{roleErrors.name}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="role-description">Description</Label>
                                    <Textarea
                                        id="role-description"
                                        value={roleData.description}
                                        onChange={(e) => setRoleData('description', e.target.value)}
                                        placeholder="Enter role description"
                                        rows={3}
                                    />
                                </div>

                                <div>
                                    <Label>Permissions</Label>
                                    <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                                        {permissions.map((permission) => (
                                            <label key={permission.id} className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    checked={roleData.permissions.includes(permission.name)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setRoleData('permissions', [...roleData.permissions, permission.name]);
                                                        } else {
                                                            setRoleData('permissions', roleData.permissions.filter(p => p !== permission.name));
                                                        }
                                                    }}
                                                    className="rounded border-gray-300"
                                                />
                                                <span className="text-sm">
                                                    {permission.display_name}
                                                    <span className="text-muted-foreground ml-1">
                                                        ({permission.module})
                                                    </span>
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-3 pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setShowRoleForm(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={roleProcessing}>
                                        <Save className="mr-2 h-4 w-4" />
                                        {roleProcessing ? 'Saving...' : (editingRole ? 'Update Role' : 'Create Role')}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Permission Form Modal */}
                {showPermissionForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold">
                                    {editingPermission ? 'Edit Permission' : 'Create New Permission'}
                                </h2>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowPermissionForm(false)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                            
                            <form onSubmit={handleSubmitPermission} className="space-y-4">
                                <div>
                                    <Label htmlFor="permission-name">Permission Name *</Label>
                                    <Input
                                        id="permission-name"
                                        value={permissionData.name}
                                        onChange={(e) => setPermissionData('name', e.target.value)}
                                        placeholder="e.g., user.create"
                                        className={permissionErrors.name ? 'border-red-500' : ''}
                                    />
                                    {permissionErrors.name && (
                                        <p className="text-sm text-red-500 mt-1">{permissionErrors.name}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="permission-display-name">Display Name *</Label>
                                    <Input
                                        id="permission-display-name"
                                        value={permissionData.display_name}
                                        onChange={(e) => setPermissionData('display_name', e.target.value)}
                                        placeholder="e.g., Create Users"
                                        className={permissionErrors.display_name ? 'border-red-500' : ''}
                                    />
                                    {permissionErrors.display_name && (
                                        <p className="text-sm text-red-500 mt-1">{permissionErrors.display_name}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="permission-module">Module</Label>
                                    <Input
                                        id="permission-module"
                                        value={permissionData.module}
                                        onChange={(e) => setPermissionData('module', e.target.value)}
                                        placeholder="e.g., user, product, system"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="permission-description">Description</Label>
                                    <Textarea
                                        id="permission-description"
                                        value={permissionData.description}
                                        onChange={(e) => setPermissionData('description', e.target.value)}
                                        placeholder="Enter permission description"
                                        rows={3}
                                    />
                                </div>

                                <div className="flex justify-end space-x-3 pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setShowPermissionForm(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={permissionProcessing}>
                                        <Save className="mr-2 h-4 w-4" />
                                        {permissionProcessing ? 'Saving...' : (editingPermission ? 'Update Permission' : 'Create Permission')}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
