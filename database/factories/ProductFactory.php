<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->words(3, true),
            'description' => fake()->paragraph(),
            'price' => fake()->randomFloat(2, 10, 1000),
            'stock' => fake()->numberBetween(0, 100),
            'sku' => fake()->unique()->regexify('[A-Z]{2}[0-9]{6}'),
            'category' => fake()->randomElement(['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Automotive']),
            'brand' => fake()->company(),
            'image' => null,
            'is_active' => fake()->boolean(80),
        ];
    }
}
