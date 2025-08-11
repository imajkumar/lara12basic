import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { columns, type User } from '@/components/users/columns';

export default function UsersIndex() {
    // Mock data - replace with actual data from your backend
    const users: User[] = [
        {
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
            position: 'Senior Developer'
        },
        {
            id: 2,
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            role: 'Manager',
            status: 'active',
            avatar: null,
            created_at: '2024-01-10',
            last_login: '2024-01-19 02:15 PM',
            phone: '+1 (555) 234-5678',
            department: 'Marketing',
            position: 'Marketing Manager'
        },
        {
            id: 3,
            name: 'Bob Johnson',
            email: 'bob.johnson@example.com',
            role: 'User',
            status: 'inactive',
            avatar: null,
            created_at: '2024-01-05',
            last_login: '2024-01-15 09:45 AM',
            phone: '+1 (555) 345-6789',
            department: 'Sales',
            position: 'Sales Representative'
        },
        {
            id: 4,
            name: 'Alice Brown',
            email: 'alice.brown@example.com',
            role: 'Manager',
            status: 'active',
            avatar: null,
            created_at: '2024-01-12',
            last_login: '2024-01-20 11:20 AM',
            phone: '+1 (555) 456-7890',
            department: 'HR',
            position: 'HR Manager'
        },
        {
            id: 5,
            name: 'Charlie Wilson',
            email: 'charlie.wilson@example.com',
            role: 'User',
            status: 'active',
            avatar: null,
            created_at: '2024-01-08',
            last_login: '2024-01-18 03:30 PM',
            phone: '+1 (555) 567-8901',
            department: 'Finance',
            position: 'Financial Analyst'
        },
        {
            id: 6,
            name: 'Diana Prince',
            email: 'diana.prince@example.com',
            role: 'Super Admin',
            status: 'active',
            avatar: null,
            created_at: '2024-01-01',
            last_login: '2024-01-20 12:00 PM',
            phone: '+1 (555) 678-9012',
            department: 'Executive',
            position: 'CEO'
        },
        {
            id: 7,
            name: 'Eve Adams',
            email: 'eve.adams@example.com',
            role: 'User',
            status: 'suspended',
            avatar: null,
            created_at: '2024-01-03',
            last_login: '2024-01-10 08:30 AM',
            phone: '+1 (555) 789-0123',
            department: 'Operations',
            position: 'Operations Specialist'
        },
        {
            id: 8,
            name: 'Frank Miller',
            email: 'frank.miller@example.com',
            role: 'Manager',
            status: 'active',
            avatar: null,
            created_at: '2024-01-07',
            last_login: '2024-01-19 04:45 PM',
            phone: '+1 (555) 890-1234',
            department: 'Engineering',
            position: 'Engineering Manager'
        }
    ];

    return (
        <AppLayout>
            <Head title="Users List" />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <Heading title="Users Management" />
                        <p className="text-muted-foreground">
                            Manage your system users, roles, and permissions
                        </p>
                    </div>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add New User
                    </Button>
                </div>

                {/* Users Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Users ({users.length})</CardTitle>
                        <CardDescription>
                            All registered users in the system with their roles and status
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <DataTable 
                            columns={columns} 
                            data={users} 
                            searchKey="name"
                            searchPlaceholder="Search users by name..."
                            showColumnVisibility={true}
                            showPagination={true}
                            pageSize={10}
                        />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
