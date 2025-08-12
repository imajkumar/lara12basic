import { SidebarInset } from '@/components/ui/sidebar';
import * as React from 'react';

interface AppContentProps extends React.ComponentProps<'main'> {
    variant?: 'header' | 'sidebar';
}

export function AppContent({ variant = 'header', children, ...props }: AppContentProps) {
    if (variant === 'sidebar') {
        return (
            <div className="ml-64 min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
                <div className="p-6">
                    {children}
                </div>
            </div>
        );
    }

    return (
        <main className="mx-auto flex h-full w-full max-w-7xl flex-1 flex-col gap-4 rounded-xl bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6" {...props}>
            {children}
        </main>
    );
}
