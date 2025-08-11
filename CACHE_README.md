# Laravel Cache & Performance Optimization Scripts

This directory contains scripts to optimize your Laravel application performance and clear various caches.

## 📁 Available Scripts

### 1. `cache.sh` (Recommended)
- **Full optimization script** with permission fixes
- Includes `sudo` commands for ownership changes
- Best for production environments and permission issues

### 2. `cache-no-sudo.sh`
- **Alternative script** without sudo commands
- Good for development environments
- Won't change file ownership

## 🚀 How to Use

### Quick Start
```bash
# Run the main optimization script
./cache.sh

# Or run without sudo
./cache-no-sudo.sh
```

### What These Scripts Do

#### 🔧 **Permission Management**
- Sets proper permissions for `storage/`, `bootstrap/cache/`, and `public/` directories
- Fixes ownership issues (with `cache.sh`)
- Ensures web server can write to necessary directories

#### 🧹 **Cache Clearing**
- **Laravel Caches**: `cache:clear`, `config:clear`, `route:clear`, `view:clear`
- **Compiled Classes**: `clear-compiled`
- **Events & Queues**: `event:clear`, `queue:clear`

#### ⚡ **Performance Optimization**
- **Configuration Caching**: `config:cache`
- **Route Caching**: `route:cache`
- **View Caching**: `view:cache`
- **Autoloader Optimization**: `composer dump-autoload --optimize`

#### 💾 **External Cache Clearing**
- **OPcache**: PHP's built-in opcode cache
- **Redis**: If Redis is installed
- **Memcached**: If Memcached is installed

#### 🔍 **Package-Specific Clearing**
- **Telescope**: Debugging and monitoring data
- **Horizon**: Queue monitoring data
- **Scout**: Search index data
- **Backup**: Cleanup old backup files

## 📋 When to Run

Run these scripts whenever you:

- 🚀 **Deploy new code** to production
- 📦 **Update Composer dependencies**
- 🔧 **Change configuration files**
- 🐛 **Experience performance issues**
- 🧹 **Want to clear all caches**
- 🔄 **Switch between environments**

## ⚠️ Important Notes

### For Production
- Use `cache.sh` for full optimization
- Run during maintenance windows
- Monitor application performance after running

### For Development
- Use `cache-no-sudo.sh` to avoid permission issues
- Run frequently during development
- Helps catch cache-related bugs early

### Permission Issues
If you encounter permission errors:
```bash
# Check current permissions
ls -la storage/ bootstrap/cache/

# Run the main script (requires sudo)
./cache.sh

# Or manually fix permissions
chmod -R 775 storage/ bootstrap/cache/
```

## 🔍 Troubleshooting

### Common Issues

1. **Permission Denied**
   ```bash
   # Make script executable
   chmod +x cache.sh
   
   # Run with proper permissions
   ./cache.sh
   ```

2. **Command Not Found**
   ```bash
   # Ensure you're in the project root
   pwd
   ls -la *.sh
   ```

3. **Cache Still Not Working**
   ```bash
   # Check Laravel status
   php artisan about
   
   # Verify cache driver
   php artisan config:show cache
   ```

## 📊 Performance Impact

After running these scripts, you should see:

- ✅ **Faster page loads** (cached routes and views)
- ✅ **Reduced database queries** (cached config)
- ✅ **Better autoloading** (optimized Composer)
- ✅ **Cleaner storage** (removed old cache files)

## 🎯 Best Practices

1. **Run regularly** during development
2. **Schedule runs** in production (e.g., after deployments)
3. **Monitor performance** before and after
4. **Backup data** before major optimizations
5. **Test thoroughly** in staging environments

---

**💡 Pro Tip**: Add these scripts to your deployment pipeline for automatic optimization!
