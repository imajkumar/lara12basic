import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Package, Save } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { useState } from 'react';

export default function ProductCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        price: '',
        stock: '',
        sku: '',
        category: '',
        brand: '',
        image: null as File | null,
        is_active: true,
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const categories = [
        'Electronics', 'Clothing', 'Books', 'Home & Garden', 
        'Sports', 'Automotive', 'Health & Beauty', 'Toys & Games'
    ];

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image', file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/products');
    };

    return (
        <AppLayout>
            <Head title="Create New Product" />
            
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
                            <Heading title="Create New Product" />
                            <p className="text-muted-foreground">
                                Add a new product to your catalog
                            </p>
                        </div>
                    </div>
                </div>

                {/* Product Form */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Package className="mr-2 h-5 w-5" />
                            Product Information
                        </CardTitle>
                        <CardDescription>
                            Fill in the details below to create a new product
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Basic Information */}
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="name">Product Name *</Label>
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="Enter product name"
                                            className={errors.name ? 'border-red-500' : ''}
                                        />
                                        {errors.name && (
                                            <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="sku">SKU *</Label>
                                        <Input
                                            id="sku"
                                            value={data.sku}
                                            onChange={(e) => setData('sku', e.target.value)}
                                            placeholder="Enter SKU (e.g., PRD-001)"
                                            className={errors.sku ? 'border-red-500' : ''}
                                        />
                                        {errors.sku && (
                                            <p className="text-sm text-red-500 mt-1">{errors.sku}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="category">Category</Label>
                                        <Select value={data.category} onValueChange={(value) => setData('category', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map((category) => (
                                                    <SelectItem key={category} value={category}>
                                                        {category}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.category && (
                                            <p className="text-sm text-red-500 mt-1">{errors.category}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="brand">Brand</Label>
                                        <Input
                                            id="brand"
                                            value={data.brand}
                                            onChange={(e) => setData('brand', e.target.value)}
                                            placeholder="Enter brand name"
                                            className={errors.brand ? 'border-red-500' : ''}
                                        />
                                        {errors.brand && (
                                            <p className="text-sm text-red-500 mt-1">{errors.brand}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Pricing & Inventory */}
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="price">Price *</Label>
                                        <Input
                                            id="price"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={data.price}
                                            onChange={(e) => setData('price', e.target.value)}
                                            placeholder="0.00"
                                            className={errors.price ? 'border-red-500' : ''}
                                        />
                                        {errors.price && (
                                            <p className="text-sm text-red-500 mt-1">{errors.price}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="stock">Stock Quantity *</Label>
                                        <Input
                                            id="stock"
                                            type="number"
                                            min="0"
                                            value={data.stock}
                                            onChange={(e) => setData('stock', e.target.value)}
                                            placeholder="0"
                                            className={errors.stock ? 'border-red-500' : ''}
                                        />
                                        {errors.stock && (
                                            <p className="text-sm text-red-500 mt-1">{errors.stock}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="image">Product Image</Label>
                                        <Input
                                            id="image"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className={errors.image ? 'border-red-500' : ''}
                                        />
                                        {errors.image && (
                                            <p className="text-sm text-red-500 mt-1">{errors.image}</p>
                                        )}
                                        {imagePreview && (
                                            <div className="mt-2">
                                                <img 
                                                    src={imagePreview} 
                                                    alt="Preview" 
                                                    className="w-20 h-20 object-cover rounded border"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="is_active"
                                            checked={data.is_active}
                                            onCheckedChange={(checked) => setData('is_active', checked as boolean)}
                                        />
                                        <Label htmlFor="is_active">Product is active</Label>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Enter product description..."
                                    rows={4}
                                    className={errors.description ? 'border-red-500' : ''}
                                />
                                {errors.description && (
                                    <p className="text-sm text-red-500 mt-1">{errors.description}</p>
                                )}
                            </div>

                            {/* Form Actions */}
                            <div className="flex justify-end space-x-3">
                                <Button variant="outline" asChild>
                                    <Link href="/products">Cancel</Link>
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    <Save className="mr-2 h-4 w-4" />
                                    {processing ? 'Creating...' : 'Create Product'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
