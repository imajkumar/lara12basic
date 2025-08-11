# 🚀 GoERP Installation Guide

This guide explains how to install GoERP using the web-based installer and post-installation setup.

## 📋 **Prerequisites**

### **Server Requirements**
- **PHP:** 8.2.0 or higher
- **Database:** PostgreSQL 12 or higher
- **Extensions:** PDO, OpenSSL, cURL, GD, XML, ctype, JSON, bcmath
- **Memory:** 128MB minimum
- **Web Server:** Apache/Nginx

### **Required Software**
- **Composer** - PHP package manager
- **Node.js & NPM** - Frontend build tools
- **PostgreSQL** - Database server
- **Git** - Version control

## 🎯 **Installation Methods**

### **Method 1: Web Installer (Recommended)**
Use the built-in web installer for easy setup.

### **Method 2: Manual Installation**
Use command-line scripts for advanced users.

## 🌐 **Web Installer Setup**

### **1. Access the Installer**
After uploading your project to the server, visit:
```
http://your-domain.com/install
```

### **2. Installation Steps**
The web installer will guide you through:

#### **Step 1: Welcome**
- System requirements overview
- Installation checklist
- Next steps information

#### **Step 2: Environment Configuration**
- Database connection settings
- Mail configuration
- Application settings

#### **Step 3: Requirements Check**
- PHP version verification
- Extension requirements
- Server compatibility

#### **Step 4: Permissions Check**
- Storage directory permissions
- Cache directory permissions
- Backup directory permissions

#### **Step 5: Database Setup**
- Connection testing
- Migration execution
- Data seeding

#### **Step 6: Installation Complete**
- Success confirmation
- Default credentials
- Next steps guide

## 🔧 **Post-Installation Setup**

After the web installer completes, run the post-installation script:

```bash
# Make script executable
chmod +x post-install.sh

# Run post-installation setup
./post-install.sh
```

### **What the Post-Install Script Does:**
- ✅ Clears and optimizes Laravel caches
- ✅ Sets proper file permissions
- ✅ Creates backup directory
- ✅ Makes management scripts executable
- ✅ Verifies database connection
- ✅ Runs additional migrations
- ✅ Creates default admin user
- ✅ Builds frontend assets
- ✅ Generates installation summary

## 🗄️ **Database Configuration**

### **PostgreSQL Setup**
```bash
# Install PostgreSQL (Ubuntu)
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres createdb goerp
sudo -u postgres createuser --interactive
```

### **Environment Variables**
Your `.env` file should contain:
```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=goerp
DB_USERNAME=postgres
DB_PASSWORD=your_password
```

## 🚀 **Quick Installation Commands**

### **For Ubuntu/Debian:**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y php8.2 php8.2-fpm php8.2-pgsql php8.2-mbstring php8.2-xml php8.2-curl php8.2-gd php8.2-bcmath php8.2-zip postgresql postgresql-contrib nginx composer git

# Clone repository
git clone https://github.com/imajkumar/lara12basic.git
cd lara12basic

# Install PHP dependencies
composer install --no-dev --optimize-autoloader

# Install Node.js dependencies
npm install
npm run build

# Set permissions
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache

# Run web installer
# Visit: http://your-domain.com/install

# Run post-installation
./post-install.sh
```

### **For CentOS/RHEL:**
```bash
# Install EPEL and REMI repositories
sudo yum install -y epel-release
sudo yum install -y https://rpms.remirepo.net/enterprise/remi-release-7.rpm

# Install PHP 8.2
sudo yum-config-manager --enable remi-php82
sudo yum install -y php php-fpm php-pgsql php-mbstring php-xml php-curl php-gd php-bcmath php-zip

# Install PostgreSQL
sudo yum install -y postgresql postgresql-server postgresql-contrib

# Initialize PostgreSQL
sudo postgresql-setup initdb
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Continue with installation steps...
```

## 🔍 **Troubleshooting**

### **Common Issues:**

#### **1. Permission Errors**
```bash
# Fix storage permissions
sudo chown -R www-data:www-data storage/
sudo chmod -R 775 storage/

# Fix cache permissions
sudo chown -R www-data:www-data bootstrap/cache/
sudo chmod -R 775 bootstrap/cache/
```

#### **2. Database Connection Issues**
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Test connection
psql -h 127.0.0.1 -U postgres -d goerp

# Check pg_hba.conf
sudo nano /etc/postgresql/*/main/pg_hba.conf
```

#### **3. PHP Extension Issues**
```bash
# Check installed extensions
php -m

# Install missing extensions
sudo apt install php8.2-pgsql php8.2-mbstring php8.2-xml php8.2-curl php8.2-gd php8.2-bcmath php8.2-zip
```

#### **4. Composer Issues**
```bash
# Clear Composer cache
composer clear-cache

# Update Composer
composer self-update

# Reinstall dependencies
rm -rf vendor composer.lock
composer install
```

## 📊 **Installation Verification**

### **Check Installation Status:**
```bash
# Verify Laravel installation
php artisan --version

# Check database connection
php artisan tinker --execute="DB::connection()->getPdo(); echo 'Database OK';"

# Verify routes
php artisan route:list

# Check cache status
php artisan config:show cache
```

### **Test Web Interface:**
1. Visit your domain: `http://your-domain.com`
2. Try to login with: `admin@goerp.com` / `password`
3. Check admin dashboard functionality

## 🔒 **Security Considerations**

### **Post-Installation Security:**
1. **Change default admin password** immediately
2. **Update .env file** with strong passwords
3. **Set proper file permissions** (755 for directories, 644 for files)
4. **Configure firewall** rules
5. **Enable HTTPS** with SSL certificate
6. **Regular backups** using provided scripts

### **File Permissions:**
```bash
# Secure file permissions
find . -type f -exec chmod 644 {} \;
find . -type d -exec chmod 755 {} \;

# Make scripts executable
chmod +x *.sh

# Secure storage
chmod -R 775 storage/
chmod -R 775 bootstrap/cache/
```

## 📈 **Performance Optimization**

### **After Installation:**
```bash
# Run cache optimization
./cache.sh

# Optimize autoloader
composer dump-autoload --optimize

# Clear and cache config
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

## 🆘 **Getting Help**

### **Support Resources:**
- **Documentation:** Check the project README files
- **Scripts:** Use the provided management scripts
- **Logs:** Check `storage/logs/laravel.log`
- **Issues:** Report problems on GitHub

### **Useful Commands:**
```bash
# Check Laravel status
php artisan about

# View all available commands
php artisan list

# Check system requirements
php artisan about --json

# Monitor logs
tail -f storage/logs/laravel.log
```

## 🎯 **Next Steps After Installation**

1. **🔐 Change Default Credentials**
   - Update admin password
   - Configure email settings

2. **⚙️ Company Setup**
   - Company information
   - Business settings
   - Tax configuration

3. **👥 User Management**
   - Add team members
   - Set user roles
   - Configure permissions

4. **📊 Data Import**
   - Import customers
   - Import products
   - Import initial data

5. **🔧 System Configuration**
   - Backup schedules
   - Email notifications
   - System preferences

---

## 📋 **Installation Checklist**

- [ ] Server requirements met
- [ ] PostgreSQL installed and running
- [ ] PHP extensions installed
- [ ] Project files uploaded
- [ ] Web installer completed
- [ ] Post-installation script run
- [ ] Database connection verified
- [ ] Default admin user created
- [ ] Frontend assets built
- [ ] Permissions set correctly
- [ ] Cache optimized
- [ ] Security configured
- [ ] Test login successful

**🎉 Congratulations! Your GoERP system is now ready for production use!**
