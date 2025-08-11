import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
    ArrowLeft, 
    Edit, 
    Mail, 
    Phone, 
    MapPin, 
    Calendar, 
    Clock, 
    Shield, 
    Key, 
    Users, 
    Building,
    User,
    CheckCircle,
    XCircle
} from 'lucide-react';
import { Link } from '@inertiajs/react';

export default function UserShow() {
    // Mock data - replace with actual data from your backend
    const user = {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
        role: 'Admin',
        status: 'active',
        avatar: null,
        created_at: '2024-01-15',
        last_login: '2024-01-20 10:30 AM',
        phone: '+1 (555) 123-4567',
        department: 'IT',
        position: 'Senior Developer',
        bio: 'Experienced software developer with expertise in Laravel, React, and modern web technologies. Passionate about creating scalable and maintainable code.',
        location: 'San Francisco, CA',
        timezone: 'PST (UTC-8)',
        permissions: [
            'user.create',
            'user.read',
            'user.update',
            'user.delete',
            'role.manage',
            'system.settings',
            'reports.view'
        ],
        roleDetails: {
            name: 'Admin',
            description: 'Administrative access to most system features',
            permissions: 20,
            users: 5,
            color: 'default'
        },
        activity: [
            { action: 'Login', timestamp: '2024-01-20 10:30 AM', ip: '192.168.1.100' },
            { action: 'Updated profile', timestamp: '2024-01-19 02:15 PM', ip: '192.168.1.100' },
            { action: 'Created user', timestamp: '2024-01-18 11:20 AM', ip: '192.168.1.100' },
            { action: 'Login', timestamp: '2024-01-17 09:45 AM', ip: '192.168.1.100' },
            { action: 'Modified role', timestamp: '2024-01-16 03:30 PM', ip: '192.168.1.100' }
        ]
    };

    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case 'active':
                return 'default';
            case 'inactive':
                return 'secondary';
            case 'suspended':
                return 'destructive';
            default:
                return 'outline';
        }
    };

    const getRoleBadgeVariant = (role: string) => {
        switch (role) {
            case 'Super Admin':
                return 'destructive';
            case 'Admin':
                return 'default';
            case 'Manager':
                return 'default';
            case 'User':
                return 'secondary';
            default:
                return 'outline';
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <AppLayout>
            <Head title={`${user.name} - User Profile`} />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/users">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Users
                            </Link>
                        </Button>
                        <div>
                            <Heading title={user.name} />
                            <p className="text-muted-foreground">
                                User Profile & Details
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button variant="outline">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Profile
                        </Button>
                        <Button>
                            <Shield className="mr-2 h-4 w-4" />
                            Manage Permissions
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* User Profile Card */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardHeader className="text-center">
                                <div className="flex justify-center mb-4">
                                    <Avatar className="h-24 w-24">
                                        <AvatarImage src={user.avatar || undefined} />
                                        <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                                            {user.name.split(' ').map(n => n[0]).join('')}
                                        </AvatarFallback>
                                    </Avatar>
                                </div>
                                <CardTitle className="text-xl">{user.name}</CardTitle>
                                <CardDescription>{user.position}</CardDescription>
                                <div className="flex justify-center space-x-2 mt-2">
                                    <Badge variant={getRoleBadgeVariant(user.role)}>
                                        {user.role}
                                    </Badge>
                                    <Badge variant={getStatusBadgeVariant(user.status)}>
                                        {user.status}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-3">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">{user.email}</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">{user.phone}</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Building className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">{user.department}</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">{user.location}</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">Joined {formatDate(user.created_at)}</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">Last login: {formatDateTime(user.last_login)}</span>
                                    </div>
                                </div>
                                
                                <Separator />
                                
                                <div>
                                    <h4 className="font-medium mb-2">Bio</h4>
                                    <p className="text-sm text-muted-foreground">{user.bio}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* User Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Role & Permissions */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Shield className="mr-2 h-5 w-5" />
                                    Role & Permissions
                                </CardTitle>
                                <CardDescription>
                                    Current role and assigned permissions
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 border rounded-lg">
                                        <h4 className="font-medium mb-2">Current Role</h4>
                                        <Badge variant={getRoleBadgeVariant(user.roleDetails.name)} className="mb-2">
                                            {user.roleDetails.name}
                                        </Badge>
                                        <p className="text-sm text-muted-foreground">{user.roleDetails.description}</p>
                                        <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                                            <span>{user.roleDetails.permissions} permissions</span>
                                            <span>{user.roleDetails.users} users</span>
                                        </div>
                                    </div>
                                    
                                    <div className="p-4 border rounded-lg">
                                        <h4 className="font-medium mb-2">Account Status</h4>
                                        <Badge variant={getStatusBadgeVariant(user.status)} className="mb-2">
                                            {user.status}
                                        </Badge>
                                        <p className="text-sm text-muted-foreground">
                                            Account is {user.status === 'active' ? 'active and accessible' : 'restricted'}
                                        </p>
                                    </div>
                                </div>

                                <Separator />

                                <div>
                                    <h4 className="font-medium mb-3">Assigned Permissions</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        {user.permissions.map((permission, index) => (
                                            <div key={index} className="flex items-center space-x-2 p-2 bg-muted/50 rounded">
                                                <CheckCircle className="h-4 w-4 text-green-600" />
                                                <span className="text-sm font-mono">{permission}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Activity */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Clock className="mr-2 h-5 w-5" />
                                    Recent Activity
                                </CardTitle>
                                <CardDescription>
                                    Latest user actions and system interactions
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {user.activity.map((activity, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                            <div className="flex items-center space-x-3">
                                                <div className="p-2 bg-primary/10 rounded-full">
                                                    <User className="h-4 w-4 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">{activity.action}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        IP: {activity.ip}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="text-sm text-muted-foreground">
                                                {formatDateTime(activity.timestamp)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                                <CardDescription>
                                    Common actions for this user
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    <Button variant="outline" size="sm" className="h-auto p-3 flex-col">
                                        <Edit className="h-4 w-4 mb-1" />
                                        <span className="text-xs">Edit Profile</span>
                                    </Button>
                                    <Button variant="outline" size="sm" className="h-auto p-3 flex-col">
                                        <Shield className="h-4 w-4 mb-1" />
                                        <span className="text-xs">Change Role</span>
                                    </Button>
                                    <Button variant="outline" size="sm" className="h-auto p-3 flex-col">
                                        <Key className="h-4 w-4 mb-1" />
                                        <span className="text-xs">Permissions</span>
                                    </Button>
                                    <Button variant="outline" size="sm" className="h-auto p-3 flex-col">
                                        <Users className="h-4 w-4 mb-1" />
                                        <span className="text-xs">Team</span>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
