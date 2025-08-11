import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Shield, Users, Settings, MoreHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function RolesIndex() {
    // Mock data - replace with actual data from your backend
    const roles = [
        {
            id: 1,
            name: 'Super Admin',
            description: 'Full system access with all permissions',
            permissions: 25,
            users: 2,
            status: 'active',
            created_at: '2024-01-01',
            color: 'destructive'
        },
        {
            id: 2,
            name: 'Admin',
            description: 'Administrative access to most system features',
            permissions: 20,
            users: 5,
            status: 'active',
            created_at: '2024-01-05',
            color: 'default'
        },
        {
            id: 3,
            name: 'Manager',
            description: 'Management access to team and project features',
            permissions: 15,
            users: 12,
            status: 'active',
            created_at: '2024-01-10',
            color: 'default'
        },
        {
            id: 4,
            name: 'User',
            description: 'Standard user access to basic features',
            permissions: 8,
            users: 45,
            status: 'active',
            created_at: '2024-01-15',
            color: 'secondary'
        },
        {
            id: 5,
            name: 'Guest',
            description: 'Limited access for external users',
            permissions: 3,
            users: 8,
            status: 'inactive',
            created_at: '2024-01-20',
            color: 'outline'
        }
    ];

    const getStatusBadgeVariant = (status: string) => {
        return status === 'active' ? 'default' : 'secondary';
    };

    const getRoleColor = (color: string) => {
        switch (color) {
            case 'destructive':
                return 'bg-destructive text-destructive-foreground';
            case 'default':
                return 'bg-primary text-primary-foreground';
            case 'secondary':
                return 'bg-secondary text-secondary-foreground';
            case 'outline':
                return 'border border-input bg-background text-foreground';
            default:
                return 'bg-secondary text-secondary-foreground';
        }
    };

    return (
        <AppLayout>
            <Head title="Roles Management" />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <Heading title="Roles Management" />
                        <p className="text-muted-foreground">
                            Define and manage user roles and their permissions
                        </p>
                    </div>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Create New Role
                    </Button>
                </div>

                {/* Filters and Search */}
                <Card>
                    <CardHeader>
                        <CardTitle>Search & Filters</CardTitle>
                        <CardDescription>
                            Find roles by name, status, or permission count
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="relative">
                                <Shield className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search roles..."
                                    className="pl-10"
                                />
                            </div>
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
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Sort By" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="name">Name</SelectItem>
                                    <SelectItem value="users">Users Count</SelectItem>
                                    <SelectItem value="permissions">Permissions</SelectItem>
                                    <SelectItem value="created">Created Date</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button variant="outline" className="w-full">
                                <Settings className="mr-2 h-4 w-4" />
                                Apply Filters
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Roles List */}
                <Card>
                    <CardHeader>
                        <CardTitle>Roles ({roles.length})</CardTitle>
                        <CardDescription>
                            All defined roles in the system with their permissions and user counts
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {roles.map((role) => (
                                <div
                                    key={role.id}
                                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className={`p-3 rounded-full ${getRoleColor(role.color)}`}>
                                            <Shield className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium">{role.name}</h3>
                                            <p className="text-sm text-muted-foreground">{role.description}</p>
                                            <div className="flex items-center space-x-2 mt-2">
                                                <Badge variant={getStatusBadgeVariant(role.status)}>
                                                    {role.status}
                                                </Badge>
                                                <Badge variant="outline" className="flex items-center space-x-1">
                                                    <Users className="h-3 w-3" />
                                                    <span>{role.users} users</span>
                                                </Badge>
                                                <Badge variant="outline" className="flex items-center space-x-1">
                                                    <Settings className="h-3 w-3" />
                                                    <span>{role.permissions} permissions</span>
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right text-sm text-muted-foreground">
                                        <div>Created: {role.created_at}</div>
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

                {/* Role Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Roles</CardTitle>
                            <Shield className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{roles.length}</div>
                            <p className="text-xs text-muted-foreground">
                                Active roles in the system
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {roles.reduce((sum, role) => sum + role.users, 0)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Users across all roles
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Roles</CardTitle>
                            <Settings className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {roles.filter(role => role.status === 'active').length}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Currently active roles
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
