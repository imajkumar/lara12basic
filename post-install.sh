#!/bin/bash

# GoERP Post-Installation Script
# This script runs after the web installer completes to set up additional configurations

echo "🚀 GoERP Post-Installation Setup Starting..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Laravel is installed
if [ ! -f "artisan" ]; then
    echo -e "${RED}❌ Laravel not found. Please run the web installer first.${NC}"
    exit 1
fi

echo -e "${BLUE}🔍 Checking Laravel installation...${NC}"

# Check if .env exists
if [ ! -f ".env" ]; then
    echo -e "${RED}❌ .env file not found. Please complete the web installer first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Laravel installation found${NC}"

# Run additional Laravel setup
echo -e "${BLUE}⚙️  Running additional Laravel setup...${NC}"

# Clear all caches
echo -e "${YELLOW}🧹 Clearing Laravel caches...${NC}"
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Optimize for production
echo -e "${YELLOW}🚀 Optimizing for production...${NC}"
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Create storage link
echo -e "${YELLOW}🔗 Creating storage link...${NC}"
php artisan storage:link

# Set proper permissions
echo -e "${YELLOW}🔒 Setting proper permissions...${NC}"
chmod -R 775 storage/
chmod -R 775 bootstrap/cache/
chmod -R 775 public/

# Create backup directory
echo -e "${YELLOW}📁 Creating backup directory...${NC}"
mkdir -p dbbackup
chmod 755 dbbackup

# Make scripts executable
echo -e "${YELLOW}🔧 Making scripts executable...${NC}"
chmod +x *.sh

# Check database connection
echo -e "${BLUE}🔍 Testing database connection...${NC}"
if php artisan tinker --execute="try { DB::connection()->getPdo(); echo 'Database connection successful!'; } catch (Exception \$e) { echo 'Database connection failed: ' . \$e->getMessage(); exit(1); }"; then
    echo -e "${GREEN}✅ Database connection verified${NC}"
else
    echo -e "${RED}❌ Database connection failed${NC}"
    exit 1
fi

# Run database migrations
echo -e "${BLUE}🗄️  Running database migrations...${NC}"
php artisan migrate --force

# Seed database if seeders exist
echo -e "${BLUE}🌱 Seeding database...${NC}"
php artisan db:seed --force

# Create default admin user
echo -e "${BLUE}👑 Creating default admin user...${NC}"
php artisan tinker --execute="
try {
    \$user = App\Models\User::where('email', 'admin@goerp.com')->first();
    if (!\$user) {
        \$user = new App\Models\User();
        \$user->name = 'Admin User';
        \$user->email = 'admin@goerp.com';
        \$user->password = Hash::make('password');
        \$user->email_verified_at = now();
        \$user->save();
        echo 'Default admin user created successfully!';
    } else {
        echo 'Admin user already exists.';
    }
} catch (Exception \$e) {
    echo 'Error creating admin user: ' . \$e->getMessage();
}
"

# Install and build frontend assets
echo -e "${BLUE}📦 Installing frontend dependencies...${NC}"
if [ -f "package.json" ]; then
    npm install
    echo -e "${BLUE}🏗️  Building frontend assets...${NC}"
    npm run build
else
    echo -e "${YELLOW}⚠️  No package.json found, skipping frontend build${NC}"
fi

# Create post-installation summary
echo -e "${BLUE}📝 Creating installation summary...${NC}"
cat > INSTALLATION_SUMMARY.md << EOF
# GoERP Installation Summary

## ✅ Installation Completed Successfully

**Date:** $(date)
**Laravel Version:** $(php artisan --version | cut -d' ' -f3)
**PHP Version:** $(php -v | head -n1 | cut -d' ' -f2)

## 🔧 What Was Configured

- ✅ Laravel application installed
- ✅ Database connected and migrated
- ✅ Default admin user created
- ✅ Storage permissions set
- ✅ Cache optimized
- ✅ Frontend assets built
- ✅ Backup directory created
- ✅ Scripts made executable

## 👑 Default Admin Account

- **Email:** admin@goerp.com
- **Password:** password
- **⚠️ IMPORTANT:** Change these credentials after first login!

## 🚀 Next Steps

1. **Login to GoERP** at: http://your-domain.com
2. **Change admin password** immediately
3. **Configure company settings**
4. **Add team members**
5. **Import business data**

## 📁 Important Directories

- **Backups:** \`dbbackup/\`
- **Scripts:** \`*.sh\` files
- **Storage:** \`storage/\`
- **Logs:** \`storage/logs/\`

## 🔧 Management Scripts

- **Cache Optimization:** \`./cache.sh\`
- **Database Backup:** \`./backup-db.sh\`
- **Database Manager:** \`./db-manager.sh\`
- **Platform Detection:** \`./platform-detect.sh\`

## 📞 Support

For support, check the documentation or contact the development team.

---
*Generated on $(date)*
EOF

echo -e "${GREEN}✅ Installation summary created: INSTALLATION_SUMMARY.md${NC}"

# Final success message
echo ""
echo -e "${GREEN}🎉 GoERP Post-Installation Setup Complete!${NC}"
echo ""
echo -e "${BLUE}📋 What's Next:${NC}"
echo -e "   1. 🌐 Visit your GoERP application"
echo -e "   2. 🔐 Login with admin@goerp.com / password"
echo -e "   3. ⚙️  Configure your company settings"
echo -e "   4. 👥 Add your team members"
echo -e "   5. 📊 Import your business data"
echo ""
echo -e "${BLUE}📁 Files Created:${NC}"
echo -e "   - INSTALLATION_SUMMARY.md (installation details)"
echo -e "   - dbbackup/ (backup directory)"
echo ""
echo -e "${BLUE}🔧 Available Scripts:${NC}"
echo -e "   - ./cache.sh (cache optimization)"
echo -e "   - ./backup-db.sh (database backup)"
echo -e "   - ./db-manager.sh (database management)"
echo ""
echo -e "${GREEN}✨ Your GoERP system is ready to use!${NC}"
