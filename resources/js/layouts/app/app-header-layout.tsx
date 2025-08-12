import { AppContent } from '@/components/app-content';
import { AppHeader } from '@/components/app-header';
import { type BreadcrumbItem } from '@/types';
import { type PropsWithChildren } from 'react';

export default function AppHeaderLayout({ children, breadcrumbs = [] }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    return (
        <div className="min-h-screen bg-background">
            {/* Fixed Header */}
            <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
                <AppHeader breadcrumbs={breadcrumbs} />
            </div>
            
            {/* Main Content with top margin for fixed header */}
            <div className="pt-32">
                <AppContent variant="header" className="overflow-x-hidden">
                    {children}
                </AppContent>
            </div>
        </div>
    );
}
