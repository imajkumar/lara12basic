<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Product;

class SampleProductsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            [
                'name' => 'MacBook Pro 16"',
                'description' => 'Latest MacBook Pro with M3 Pro chip, 16GB RAM, 512GB SSD',
                'price' => 2499.99,
                'stock' => 25,
                'sku' => 'MBP-16-M3-001',
                'category' => 'Laptops',
                'brand' => 'Apple',
                'is_active' => true,
            ],
            [
                'name' => 'iPhone 15 Pro',
                'description' => 'iPhone 15 Pro with A17 Pro chip, 128GB storage',
                'price' => 999.99,
                'stock' => 50,
                'sku' => 'IPH-15-PRO-001',
                'category' => 'Smartphones',
                'brand' => 'Apple',
                'is_active' => true,
            ],
            [
                'name' => 'Samsung Galaxy S24',
                'description' => 'Samsung Galaxy S24 with Snapdragon 8 Gen 3, 256GB',
                'price' => 899.99,
                'stock' => 35,
                'sku' => 'SGS-24-001',
                'category' => 'Smartphones',
                'brand' => 'Samsung',
                'is_active' => true,
            ],
            [
                'name' => 'Dell XPS 13',
                'description' => 'Dell XPS 13 laptop with Intel i7, 16GB RAM, 512GB SSD',
                'price' => 1299.99,
                'stock' => 15,
                'sku' => 'DXP-13-001',
                'category' => 'Laptops',
                'brand' => 'Dell',
                'is_active' => true,
            ],
            [
                'name' => 'Sony WH-1000XM5',
                'description' => 'Sony WH-1000XM5 wireless noise-canceling headphones',
                'price' => 399.99,
                'stock' => 40,
                'sku' => 'SWH-1000XM5-001',
                'category' => 'Audio',
                'brand' => 'Sony',
                'is_active' => true,
            ],
            [
                'name' => 'iPad Air',
                'description' => 'iPad Air with M2 chip, 64GB storage, Wi-Fi',
                'price' => 599.99,
                'stock' => 30,
                'sku' => 'IPA-AIR-M2-001',
                'category' => 'Tablets',
                'brand' => 'Apple',
                'is_active' => true,
            ],
            [
                'name' => 'Microsoft Surface Pro 9',
                'description' => 'Surface Pro 9 with Intel i5, 8GB RAM, 256GB SSD',
                'price' => 1099.99,
                'stock' => 20,
                'sku' => 'MSP-9-001',
                'category' => 'Tablets',
                'brand' => 'Microsoft',
                'is_active' => true,
            ],
            [
                'name' => 'Canon EOS R6 Mark II',
                'description' => 'Canon EOS R6 Mark II mirrorless camera with 24MP sensor',
                'price' => 2499.99,
                'stock' => 8,
                'sku' => 'CER-R6-II-001',
                'category' => 'Cameras',
                'brand' => 'Canon',
                'is_active' => true,
            ],
            [
                'name' => 'Nike Air Max 270',
                'description' => 'Nike Air Max 270 running shoes, comfortable cushioning',
                'price' => 150.00,
                'stock' => 100,
                'sku' => 'NAM-270-001',
                'category' => 'Footwear',
                'brand' => 'Nike',
                'is_active' => true,
            ],
            [
                'name' => 'Adidas Ultraboost 22',
                'description' => 'Adidas Ultraboost 22 running shoes with Boost midsole',
                'price' => 190.00,
                'stock' => 75,
                'sku' => 'AU-22-001',
                'category' => 'Footwear',
                'brand' => 'Adidas',
                'is_active' => true,
            ],
            [
                'name' => 'LG OLED C3 65"',
                'description' => 'LG OLED C3 65" 4K Smart TV with AI ThinQ',
                'price' => 2499.99,
                'stock' => 12,
                'sku' => 'LGO-C3-65-001',
                'category' => 'TVs',
                'brand' => 'LG',
                'is_active' => true,
            ],
            [
                'name' => 'Samsung QLED Q80C 75"',
                'description' => 'Samsung QLED Q80C 75" 4K Smart TV with Quantum HDR',
                'price' => 1999.99,
                'stock' => 18,
                'sku' => 'SQS-Q80C-75-001',
                'category' => 'TVs',
                'brand' => 'Samsung',
                'is_active' => true,
            ],
            [
                'name' => 'PlayStation 5',
                'description' => 'PlayStation 5 gaming console with DualSense controller',
                'price' => 499.99,
                'stock' => 5,
                'sku' => 'PS5-001',
                'category' => 'Gaming',
                'brand' => 'Sony',
                'is_active' => true,
            ],
            [
                'name' => 'Xbox Series X',
                'description' => 'Xbox Series X gaming console with wireless controller',
                'price' => 499.99,
                'stock' => 7,
                'sku' => 'XBX-SX-001',
                'category' => 'Gaming',
                'brand' => 'Microsoft',
                'is_active' => true,
            ],
            [
                'name' => 'Discontinued Product',
                'description' => 'This product is no longer available',
                'price' => 99.99,
                'stock' => 0,
                'sku' => 'DIS-001',
                'category' => 'Other',
                'brand' => 'Generic',
                'is_active' => false,
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }

        $this->command->info('Sample products created successfully!');
    }
}
