import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import { useState } from 'react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

    const toggleExpanded = (title: string) => {
        const newExpanded = new Set(expandedItems);
        if (newExpanded.has(title)) {
            newExpanded.delete(title);
        } else {
            newExpanded.add(title);
        }
        setExpandedItems(newExpanded);
    };

    const renderNavItem = (item: NavItem, level: number = 0) => {
        const hasChildren = item.children && item.children.length > 0;
        const isExpanded = expandedItems.has(item.title);
        const isActive = page.url.startsWith(item.href);

        if (hasChildren) {
            return (
                <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                        onClick={() => toggleExpanded(item.title)}
                        isActive={isActive}
                        tooltip={{ children: item.title }}
                    >
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        {hasChildren && (
                            <ChevronRight 
                                className={`ml-auto h-4 w-4 transition-transform ${
                                    isExpanded ? 'rotate-90' : ''
                                }`} 
                            />
                        )}
                    </SidebarMenuButton>
                    {hasChildren && (
                        <SidebarMenuSub>
                            {item.children!.map((child) => (
                                <SidebarMenuSubItem key={child.title}>
                                    <SidebarMenuSubButton 
                                        asChild 
                                        isActive={page.url.startsWith(child.href)}
                                        tooltip={{ children: child.title }}
                                    >
                                        <Link href={child.href} prefetch>
                                            {child.icon && <child.icon />}
                                            <span>{child.title}</span>
                                            {child.badge && (
                                                <span className={`ml-auto inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
                                                    child.badgeVariant === 'destructive' ? 'bg-destructive text-destructive-foreground' :
                                                    child.badgeVariant === 'secondary' ? 'bg-secondary text-secondary-foreground' :
                                                    child.badgeVariant === 'outline' ? 'border border-input bg-background text-foreground' :
                                                    'bg-primary text-primary-foreground'
                                                }`}>
                                                    {child.badge}
                                                </span>
                                            )}
                                        </Link>
                                    </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                            ))}
                        </SidebarMenuSub>
                    )}
                </SidebarMenuItem>
            );
        }

        return (
            <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={isActive} tooltip={{ children: item.title }}>
                    <Link href={item.href} prefetch>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        {item.badge && (
                            <span className={`ml-auto inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
                                item.badgeVariant === 'destructive' ? 'bg-destructive text-destructive-foreground' :
                                item.badgeVariant === 'secondary' ? 'bg-secondary text-secondary-foreground' :
                                item.badgeVariant === 'outline' ? 'border border-input bg-background text-foreground' :
                                'bg-primary text-primary-foreground'
                            }`}>
                                {item.badge}
                            </span>
                        )}
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        );
    };

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => renderNavItem(item))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
