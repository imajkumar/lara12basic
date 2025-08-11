import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Package } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { columns, type Product } from '@/components/products/columns';

export default function ProductsIndex({ products, filters, categories }: any) {
    return (
        <AppLayout>
            <Head title="Products Management" />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <Heading title="Products Management" />
                        <p className="text-muted-foreground">
                            Manage your product catalog, inventory, and pricing
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/products/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Add New Product
                        </Link>
                    </Button>
                </div>

                {/* Products Table */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Package className="mr-2 h-5 w-5" />
                            Products ({products.total})
                        </CardTitle>
                        <CardDescription>
                            All products in your catalog with inventory and pricing information
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <DataTable 
                            columns={columns} 
                            data={products.data} 
                            searchKey="name"
                            searchPlaceholder="Search products by name, SKU, or category..."
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
