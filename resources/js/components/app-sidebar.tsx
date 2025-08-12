import { type NavItem } from '@/types';
import { Link, router } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, Users, Shield, Key, Package, Mail, ChevronDown, ChevronRight, Settings, User, LogOut } from 'lucide-react';
import AppLogo from './app-logo';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'User Management',
        href: '/users',
        icon: Users,
        children: [
            {
                title: 'Users List',
                href: '/users',
                icon: Users,
            },
            {
                title: 'Roles & Permissions',
                href: '/admin/roles-permissions',
                icon: Shield,
            },
        ],
    },
    {
        title: 'Product Management',
        href: '/products',
        icon: Package,
        children: [
            {
                title: 'Products List',
                href: '/products',
                icon: Package,
            },
            {
                title: 'Add Product',
                href: '/products/create',
                icon: Package,
            },
        ],
    },
    {
        title: 'Email Management',
        href: '/email-templates',
        icon: Mail,
        children: [
            {
                title: 'Email Templates',
                href: '/email-templates',
                icon: Mail,
            },
            {
                title: 'Create Template',
                href: '/email-templates/create',
                icon: Mail,
            },
        ],
    },
    {
        title: 'Settings',
        href: '/settings',
        icon: Settings,
        children: [
            {
                title: 'Profile',
                href: '/settings/profile',
                icon: User,
            },
            {
                title: 'Password',
                href: '/settings/password',
                icon: Key,
            },
            {
                title: 'Appearance',
                href: '/settings/appearance',
                icon: BookOpen,
            },
        ],
    },
];

export function AppSidebar() {
    const [expandedItems, setExpandedItems] = useState<string[]>(['User Management', 'Product Management', 'Email Management', 'Settings']);

    const toggleExpanded = (title: string) => {
        setExpandedItems(prev => 
            prev.includes(title) 
                ? prev.filter(item => item !== title)
                : [...prev, title]
        );
    };

    const isExpanded = (title: string) => expandedItems.includes(title);

    const handleLogout = () => {
        router.post('/logout');
    };

    const renderNavItem = (item: NavItem, level: number = 0) => {
        const hasChildren = item.children && item.children.length > 0;
        const expanded = isExpanded(item.title);

        return (
            <div key={item.title} className="space-y-1">
                {hasChildren ? (
                    <div>
                        <button
                            onClick={() => toggleExpanded(item.title)}
                            className={cn(
                                "group flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-slate-800/50 hover:text-white",
                                level === 0 ? "text-slate-300" : "text-slate-400",
                                level > 0 && "pl-6"
                            )}
                        >
                            <div className="flex items-center space-x-3">
                                {item.icon && <item.icon className="h-4 w-4" />}
                                <span>{item.title}</span>
                            </div>
                            <ChevronDown 
                                className={cn(
                                    "h-4 w-4 transition-transform duration-200",
                                    expanded ? "rotate-180" : "rotate-0"
                                )} 
                            />
                        </button>
                        
                        {expanded && item.children && (
                            <div className="mt-1 space-y-1 pl-4">
                                {item.children.map((child) => (
                                    <Link
                                        key={child.title}
                                        href={child.href}
                                        className={cn(
                                            "group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-slate-800/50 hover:text-white",
                                            "text-slate-400"
                                        )}
                                    >
                                        {child.icon && <child.icon className="mr-3 h-4 w-4" />}
                                        {child.title}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <Link
                        href={item.href}
                        className={cn(
                            "group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-slate-800/50 hover:text-white",
                            level === 0 ? "text-slate-300" : "text-slate-400",
                            level > 0 && "pl-6"
                        )}
                    >
                        {item.icon && <item.icon className="mr-3 h-4 w-4" />}
                        {item.title}
                    </Link>
                )}
            </div>
        );
    };

    return (
        <div className="fixed left-0 top-0 h-screen w-64 flex flex-col bg-slate-900 border-r border-slate-800 z-50">
            {/* Header */}
            <div className="flex h-16 items-center border-b border-slate-800 px-6 bg-slate-900">
                <AppLogo />
            </div>
            
            {/* Main Navigation */}
            <nav className="flex-1 space-y-2 p-4 overflow-y-auto">
                {mainNavItems.map((item) => renderNavItem(item))}
            </nav>

            {/* User Profile Section */}
            <div className="border-t border-slate-800 p-4 bg-slate-900">
                <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-800/50 transition-colors duration-200">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">A</span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">Admin User</p>
                        <p className="text-xs text-slate-400 truncate">admin@goerp.com</p>
                    </div>
                    <div className="flex items-center space-x-1">
                        <Link
                            href="/settings/profile"
                            className="p-1 rounded hover:bg-slate-700/50 transition-colors duration-200"
                        >
                            <User className="h-4 w-4 text-slate-400 hover:text-white" />
                        </Link>
                        <button className="p-1 rounded hover:bg-slate-700/50 transition-colors duration-200">
                            <LogOut className="h-4 w-4 text-slate-400 hover:text-red-400" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
