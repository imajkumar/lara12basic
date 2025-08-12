import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Package, Filter, Search } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { columns, type Product } from '@/components/products/columns';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useState, useMemo } from 'react';

interface Props {
    products: {
        data: Product[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    filters: {
        search?: string;
        category?: string;
        status?: string;
        brand?: string;
        price_min?: string;
        price_max?: string;
        stock_min?: string;
        stock_max?: string;
    };
    categories: string[];
    brands: string[];
}

export default function ProductsIndex({ products, filters, categories, brands }: Props) {

    const [localFilters, setLocalFilters] = useState({
        search: filters.search || '',
        category: filters.category || 'all',
        status: filters.status || 'all',
        brand: filters.brand || 'all',
        price_min: filters.price_min || '',
        price_max: filters.price_max || '',
        stock_min: filters.stock_min || '',
        stock_max: filters.stock_max || '',
    });

            // Filter products locally for better UX
        const filteredProducts = useMemo(() => {
            if (!products.data || products.data.length === 0) {
                return [];
            }
            
            // Fallback: if no filters are active, show all products
            const hasActiveFilters = localFilters.search || 
                localFilters.category !== 'all' || 
                localFilters.status !== 'all' || 
                localFilters.brand !== 'all' ||
                localFilters.price_min || 
                localFilters.price_max || 
                localFilters.stock_min || 
                localFilters.stock_max;
            
            if (!hasActiveFilters) {
                return products.data;
            }
            
            const filtered = products.data.filter(product => {
                const matchesSearch = !localFilters.search || 
                    product.name.toLowerCase().includes(localFilters.search.toLowerCase()) ||
                    product.sku.toLowerCase().includes(localFilters.search.toLowerCase()) ||
                    (product.description && product.description.toLowerCase().includes(localFilters.search.toLowerCase()));
                
                // Fix category filtering - 'all' means show all categories
                const matchesCategory = localFilters.category === 'all' || !localFilters.category || product.category === localFilters.category;
                
                // Fix status filtering - 'all' means show all statuses
                const matchesStatus = localFilters.status === 'all' || !localFilters.status || 
                    (localFilters.status === 'active' && product.is_active) ||
                    (localFilters.status === 'inactive' && !product.is_active);
                
                // Fix brand filtering - 'all' means show all brands
                const matchesBrand = localFilters.brand === 'all' || !localFilters.brand || product.brand === localFilters.brand;
                
                const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
                const matchesPriceMin = !localFilters.price_min || price >= parseFloat(localFilters.price_min || '0');
                const matchesPriceMax = !localFilters.price_max || price <= parseFloat(localFilters.price_max || '999999');
                
                const stock = typeof product.stock === 'string' ? parseInt(product.stock) : product.stock;
                const matchesStockMin = !localFilters.stock_min || stock >= parseInt(localFilters.stock_min || '0');
                const matchesStockMax = !localFilters.stock_max || stock <= parseInt(localFilters.stock_max || '999999');
                
                return matchesSearch && matchesCategory && matchesStatus && matchesBrand && 
                       matchesPriceMin && matchesPriceMax && matchesStockMin && matchesStockMax;
            });
            
            return filtered;
        }, [products.data, localFilters]);

    const handleFilterChange = (key: string, value: string) => {
        setLocalFilters(prev => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setLocalFilters({
            search: '',
            category: 'all',
            status: 'all',
            brand: 'all',
            price_min: '',
            price_max: '',
            stock_min: '',
            stock_max: '',
        });
    };

    const activeFiltersCount = Object.values(localFilters).filter(v => v !== '').length;

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

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Filter className="mr-2 h-5 w-5" />
                            Filters
                            {activeFiltersCount > 0 && (
                                <Badge variant="secondary" className="ml-2">
                                    {activeFiltersCount} active
                                </Badge>
                            )}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Search */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Search</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Name, SKU, description..."
                                        value={localFilters.search}
                                        onChange={(e) => handleFilterChange('search', e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            {/* Category */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Category</label>
                                <Select value={localFilters.category || "all"} onValueChange={(value) => handleFilterChange('category', value === "all" ? "" : value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="All categories" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All categories</SelectItem>
                                        {categories.map((category) => (
                                            <SelectItem key={category} value={category}>
                                                {category}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Brand */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Brand</label>
                                <Select value={localFilters.brand || "all"} onValueChange={(value) => handleFilterChange('brand', value === "all" ? "" : value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="All brands" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All brands</SelectItem>
                                        {brands.map((brand) => (
                                            <SelectItem key={brand} value={brand}>
                                                {brand}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Status */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Status</label>
                                <Select value={localFilters.status || "all"} onValueChange={(value) => handleFilterChange('status', value === "all" ? "" : value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="All statuses" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All statuses</SelectItem>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="inactive">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Price Range */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Price Range</label>
                                <div className="flex space-x-2">
                                    <Input
                                        placeholder="Min"
                                        type="number"
                                        step="0.01"
                                        value={localFilters.price_min}
                                        onChange={(e) => handleFilterChange('price_min', e.target.value)}
                                    />
                                    <Input
                                        placeholder="Max"
                                        type="number"
                                        step="0.01"
                                        value={localFilters.price_max}
                                        onChange={(e) => handleFilterChange('price_max', e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Stock Range */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Stock Range</label>
                                <div className="flex space-x-2">
                                    <Input
                                        placeholder="Min"
                                        type="number"
                                        value={localFilters.stock_min}
                                        onChange={(e) => handleFilterChange('stock_min', e.target.value)}
                                    />
                                    <Input
                                        placeholder="Max"
                                        type="number"
                                        value={localFilters.stock_max}
                                        onChange={(e) => handleFilterChange('stock_max', e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Clear Filters */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">&nbsp;</label>
                                <Button 
                                    variant="outline" 
                                    onClick={clearFilters}
                                    className="w-full"
                                    disabled={activeFiltersCount === 0}
                                >
                                    Clear Filters
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Products Table */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Package className="mr-2 h-5 w-5" />
                            Products ({filteredProducts.length} of {products.total})
                        </CardTitle>
                        <CardDescription>
                            All products in your catalog with inventory and pricing information
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <DataTable 
                            columns={columns} 
                            data={filteredProducts} 
                            searchKey="name"
                            searchPlaceholder="Search products by name, SKU, or category..."
                            showColumnVisibility={true}
                            showPagination={false} // We're handling pagination with filters
                            pageSize={filteredProducts.length}
                        />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
