#!/bin/bash

# Laravel Cache & Performance Optimization Script
# This script optimizes Laravel application performance and clears various caches

echo "🚀 Starting Laravel Cache & Performance Optimization..."

# Set proper permissions for storage and bootstrap/cache directories
echo "📁 Setting proper permissions..."
chmod -R 775 storage/
chmod -R 775 bootstrap/cache/
chmod -R 775 public/

# Set ownership (adjust www-data to your web server user if different)
echo "👤 Setting ownership..."
sudo chown -R $(whoami) storage/
sudo chown -R $(whoami) bootstrap/cache/
sudo chown -R $(whoami) public/

# Clear all Laravel caches
echo "🧹 Clearing Laravel caches..."
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan event:clear
php artisan queue:clear

# Clear compiled class files
echo "🗑️  Clearing compiled classes..."
php artisan clear-compiled

# Clear and cache configuration
echo "⚙️  Optimizing configuration..."
php artisan config:cache

# Clear and cache routes
echo "🛣️  Optimizing routes..."
php artisan route:cache

# Clear and cache views
echo "👁️  Optimizing views..."
php artisan view:cache

# Optimize autoloader
echo "📦 Optimizing Composer autoloader..."
composer dump-autoload --optimize

# Clear OPcache if available
echo "💾 Clearing OPcache..."
if php -m | grep -q "opcache"; then
    php -r "opcache_reset();"
    echo "✅ OPcache cleared"
else
    echo "ℹ️  OPcache not available"
fi

# Clear Redis cache if available
echo "🔴 Clearing Redis cache..."
if command -v redis-cli &> /dev/null; then
    redis-cli flushall
    echo "✅ Redis cache cleared"
else
    echo "ℹ️  Redis not available"
fi

# Clear Memcached if available
echo "🔵 Clearing Memcached..."
if command -v memcached &> /dev/null; then
    echo "flush_all" | nc localhost 11211
    echo "✅ Memcached cleared"
else
    echo "ℹ️  Memcached not available"
fi

# Optimize database queries (if using database cache)
echo "🗄️  Optimizing database..."
php artisan migrate:status

# Clear browser cache headers (Laravel 12+)
echo "🌐 Clearing browser cache headers..."
if php artisan list | grep -q "response:cache"; then
    php artisan response:cache
    echo "✅ Response cache cleared"
else
    echo "ℹ️  Response cache command not available in this Laravel version"
fi

# Clear telescope data if installed
echo "🔍 Clearing Telescope data..."
if php artisan list | grep -q "telescope:clear"; then
    php artisan telescope:clear
    echo "✅ Telescope data cleared"
else
    echo "ℹ️  Telescope not installed"
fi

# Clear horizon data if installed
echo "📊 Clearing Horizon data..."
if php artisan list | grep -q "horizon:clear"; then
    php artisan horizon:clear
    echo "✅ Horizon data cleared"
else
    echo "ℹ️  Horizon not installed"
fi

# Clear scout data if installed
echo "🔍 Clearing Scout data..."
if php artisan list | grep -q "scout:flush"; then
    php artisan scout:flush
    echo "✅ Scout data cleared"
else
    echo "ℹ️  Scout not installed"
fi

# Clear backup data if using spatie/laravel-backup
echo "💾 Clearing backup data..."
if php artisan list | grep -q "backup:clean"; then
    php artisan backup:clean
    echo "✅ Backup data cleaned"
else
    echo "ℹ️  Backup package not installed"
fi

# Optimize file permissions again
echo "🔒 Final permission optimization..."
find storage/ -type f -exec chmod 664 {} \;
find storage/ -type d -exec chmod 775 {} \;
find bootstrap/cache/ -type f -exec chmod 664 {} \;
find bootstrap/cache/ -type d -exec chmod 775 {} \;

# Show current status
echo "📊 Current application status:"
php artisan about

echo "🎉 Cache & Performance Optimization Complete!"
echo "✨ Your Laravel application is now optimized and ready!"
echo ""
echo "💡 Tip: Run this script whenever you:"
echo "   - Deploy new code"
echo "   - Update dependencies"
echo "   - Experience performance issues"
echo "   - Want to clear all caches"
