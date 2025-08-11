import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
    ArrowLeft, 
    Edit, 
    Package, 
    DollarSign, 
    Package2, 
    Calendar,
    Tag,
    Building,
    Eye,
    CheckCircle,
    XCircle
} from 'lucide-react';
import { Link } from '@inertiajs/react';

export default function ProductShow({ product }: any) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(price);
    };

    const getStockStatus = (stock: number) => {
        if (stock === 0) return { variant: 'destructive' as const, text: 'Out of Stock' };
        if (stock < 10) return { variant: 'secondary' as const, text: 'Low Stock' };
        return { variant: 'default' as const, text: 'In Stock' };
    };

    const stockStatus = getStockStatus(product.stock);

    return (
        <AppLayout>
            <Head title={`${product.name} - Product Details`} />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/products">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Products
                            </Link>
                        </Button>
                        <div>
                            <Heading title={product.name} />
                            <p className="text-muted-foreground">
                                Product details and information
                            </p>
                        </div>
                    </div>
                    <Button asChild>
                        <Link href={`/products/${product.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Product
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Product Information */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Product Image and Basic Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Package className="mr-2 h-5 w-5" />
                                    Product Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-start space-x-6">
                                    {/* Product Image */}
                                    <div className="flex-shrink-0">
                                        {product.image ? (
                                            <img 
                                                src={`/storage/${product.image}`} 
                                                alt={product.name}
                                                className="w-32 h-32 object-cover rounded-lg border"
                                            />
                                        ) : (
                                            <div className="w-32 h-32 bg-muted rounded-lg border flex items-center justify-center">
                                                <Package className="h-12 w-12 text-muted-foreground" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Basic Details */}
                                    <div className="flex-1 space-y-4">
                                        <div>
                                            <h3 className="text-2xl font-bold">{product.name}</h3>
                                            <p className="text-muted-foreground">SKU: {product.sku}</p>
                                        </div>

                                        <div className="flex items-center space-x-4">
                                            <div className="flex items-center space-x-2">
                                                <DollarSign className="h-4 w-4 text-green-600" />
                                                <span className="text-2xl font-bold text-green-600">
                                                    {formatPrice(product.price)}
                                                </span>
                                            </div>
                                            <Separator orientation="vertical" className="h-8" />
                                            <div className="flex items-center space-x-2">
                                                <Package2 className="h-4 w-4 text-blue-600" />
                                                <Badge variant={stockStatus.variant}>
                                                    {stockStatus.text} ({product.stock} units)
                                                </Badge>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-4">
                                            <div className="flex items-center space-x-2">
                                                <Tag className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm text-muted-foreground">Category:</span>
                                                {product.category ? (
                                                    <Badge variant="outline">{product.category}</Badge>
                                                ) : (
                                                    <span className="text-sm text-muted-foreground">-</span>
                                                )}
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Building className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm text-muted-foreground">Brand:</span>
                                                <span className="text-sm font-medium">
                                                    {product.brand || '-'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm text-muted-foreground">Status:</span>
                                            <Badge variant={product.is_active ? 'default' : 'secondary'}>
                                                {product.is_active ? (
                                                    <>
                                                        <CheckCircle className="mr-1 h-3 w-3" />
                                                        Active
                                                    </>
                                                ) : (
                                                    <>
                                                        <XCircle className="mr-1 h-3 w-3" />
                                                        Inactive
                                                    </>
                                                )}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                {product.description && (
                                    <div>
                                        <h4 className="font-semibold mb-2">Description</h4>
                                        <p className="text-muted-foreground leading-relaxed">
                                            {product.description}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Additional Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Additional Details</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center space-x-3">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm font-medium">Created</p>
                                            <p className="text-sm text-muted-foreground">
                                                {new Date(product.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Eye className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm font-medium">Last Updated</p>
                                            <p className="text-sm text-muted-foreground">
                                                {new Date(product.updated_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button className="w-full" asChild>
                                    <Link href={`/products/${product.id}/edit`}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit Product
                                    </Link>
                                </Button>
                                <Button variant="outline" className="w-full" asChild>
                                    <Link href="/products">
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Back to List
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Product Stats */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Product Statistics</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Price</span>
                                    <span className="font-semibold">{formatPrice(product.price)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Stock Level</span>
                                    <Badge variant={stockStatus.variant}>
                                        {product.stock} units
                                    </Badge>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Status</span>
                                    <Badge variant={product.is_active ? 'default' : 'secondary'}>
                                        {product.is_active ? 'Active' : 'Inactive'}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
