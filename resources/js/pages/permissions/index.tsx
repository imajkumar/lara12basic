import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Key, Shield, Users, Settings, MoreHorizontal, CheckCircle, XCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

export default function PermissionsIndex() {
    // Mock data - replace with actual data from your backend
    const permissions = [
        {
            id: 1,
            name: 'user.create',
            display_name: 'Create Users',
            description: 'Allow creating new user accounts',
            module: 'User Management',
            roles: ['Super Admin', 'Admin'],
            status: 'active',
            created_at: '2024-01-01'
        },
        {
            id: 2,
            name: 'user.read',
            display_name: 'View Users',
            description: 'Allow viewing user information and lists',
            module: 'User Management',
            roles: ['Super Admin', 'Admin', 'Manager'],
            status: 'active',
            created_at: '2024-01-01'
        },
        {
            id: 3,
            name: 'user.update',
            display_name: 'Edit Users',
            description: 'Allow editing user information and settings',
            module: 'User Management',
            roles: ['Super Admin', 'Admin'],
            status: 'active',
            created_at: '2024-01-01'
        },
        {
            id: 4,
            name: 'user.delete',
            display_name: 'Delete Users',
            description: 'Allow deleting user accounts',
            module: 'User Management',
            roles: ['Super Admin'],
            status: 'active',
            created_at: '2024-01-01'
        },
        {
            id: 5,
            name: 'role.manage',
            display_name: 'Manage Roles',
            description: 'Allow creating, editing, and deleting roles',
            module: 'Role Management',
            roles: ['Super Admin', 'Admin'],
            status: 'active',
            created_at: '2024-01-01'
        },
        {
            id: 6,
            name: 'permission.manage',
            display_name: 'Manage Permissions',
            description: 'Allow managing system permissions',
            module: 'Permission Management',
            roles: ['Super Admin'],
            status: 'active',
            created_at: '2024-01-01'
        },
        {
            id: 7,
            name: 'system.settings',
            display_name: 'System Settings',
            description: 'Allow access to system configuration',
            module: 'System',
            roles: ['Super Admin', 'Admin'],
            status: 'active',
            created_at: '2024-01-01'
        },
        {
            id: 8,
            name: 'reports.view',
            display_name: 'View Reports',
            description: 'Allow viewing system reports and analytics',
            module: 'Reports',
            roles: ['Super Admin', 'Admin', 'Manager'],
            status: 'active',
            created_at: '2024-01-01'
        }
    ];

    const modules = ['User Management', 'Role Management', 'Permission Management', 'System', 'Reports'];
    const roleOptions = ['Super Admin', 'Admin', 'Manager', 'User', 'Guest'];

    const getModuleColor = (module: string) => {
        const colors = {
            'User Management': 'bg-blue-100 text-blue-800',
            'Role Management': 'bg-green-100 text-green-800',
            'Permission Management': 'bg-purple-100 text-purple-800',
            'System': 'bg-red-100 text-red-800',
            'Reports': 'bg-orange-100 text-orange-800'
        };
        return colors[module as keyof typeof colors] || 'bg-gray-100 text-gray-800';
    };

    const getStatusBadgeVariant = (status: string) => {
        return status === 'active' ? 'default' : 'secondary';
    };

    return (
        <AppLayout>
            <Head title="Permissions Management" />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <Heading title="Permissions Management" />
                        <p className="text-muted-foreground">
                            Define and manage system permissions and access controls
                        </p>
                    </div>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Permission
                    </Button>
                </div>

                {/* Filters and Search */}
                <Card>
                    <CardHeader>
                        <CardTitle>Search & Filters</CardTitle>
                        <CardDescription>
                            Find permissions by name, module, or assigned roles
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="relative">
                                <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search permissions..."
                                    className="pl-10"
                                />
                            </div>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="All Modules" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Modules</SelectItem>
                                    {modules.map(module => (
                                        <SelectItem key={module} value={module.toLowerCase()}>
                                            {module}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="All Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button variant="outline" className="w-full">
                                <Settings className="mr-2 h-4 w-4" />
                                Apply Filters
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Permissions List */}
                <Card>
                    <CardHeader>
                        <CardTitle>Permissions ({permissions.length})</CardTitle>
                        <CardDescription>
                            All system permissions with their assigned roles and modules
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {permissions.map((permission) => (
                                <div
                                    key={permission.id}
                                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="p-3 rounded-full bg-primary/10 text-primary">
                                            <Key className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2 mb-1">
                                                <h3 className="font-medium">{permission.display_name}</h3>
                                                <Badge variant="outline" className="text-xs font-mono">
                                                    {permission.name}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground mb-2">
                                                {permission.description}
                                            </p>
                                            <div className="flex items-center space-x-2">
                                                <Badge 
                                                    variant="outline" 
                                                    className={`text-xs ${getModuleColor(permission.module)}`}
                                                >
                                                    {permission.module}
                                                </Badge>
                                                <Badge variant={getStatusBadgeVariant(permission.status)}>
                                                    {permission.status}
                                                </Badge>
                                                <div className="flex items-center space-x-1">
                                                    <Shield className="h-3 w-3 text-muted-foreground" />
                                                    <span className="text-xs text-muted-foreground">
                                                        {permission.roles.length} roles
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right text-sm text-muted-foreground">
                                        <div>Created: {permission.created_at}</div>
                                        <div className="mt-2">
                                            <Button variant="ghost" size="sm" className="mr-2">
                                                Edit
                                            </Button>
                                            <Button variant="ghost" size="sm">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Permission Matrix */}
                <Card>
                    <CardHeader>
                        <CardTitle>Permission Matrix</CardTitle>
                        <CardDescription>
                            Overview of which roles have access to which permissions
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left p-2 font-medium">Permission</th>
                                        {roleOptions.map(role => (
                                            <th key={role} className="text-center p-2 font-medium">
                                                {role}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {permissions.slice(0, 6).map((permission) => (
                                        <tr key={permission.id} className="border-b">
                                            <td className="p-2">
                                                <div className="text-sm font-medium">{permission.display_name}</div>
                                                <div className="text-xs text-muted-foreground">{permission.module}</div>
                                            </td>
                                            {roleOptions.map(role => (
                                                <td key={role} className="text-center p-2">
                                                    {permission.roles.includes(role) ? (
                                                        <CheckCircle className="h-4 w-4 text-green-600 mx-auto" />
                                                    ) : (
                                                        <XCircle className="h-4 w-4 text-gray-400 mx-auto" />
                                                    )}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Permission Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Permissions</CardTitle>
                            <Key className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{permissions.length}</div>
                            <p className="text-xs text-muted-foreground">
                                System permissions
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Permissions</CardTitle>
                            <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {permissions.filter(p => p.status === 'active').length}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Currently active
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Modules</CardTitle>
                            <Settings className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{modules.length}</div>
                            <p className="text-xs text-muted-foreground">
                                Permission modules
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Roles</CardTitle>
                            <Shield className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{roleOptions.length}</div>
                            <p className="text-xs text-muted-foreground">
                                User roles
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
