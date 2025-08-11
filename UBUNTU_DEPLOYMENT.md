# Ubuntu Deployment Guide for Laravel Database Management Scripts

This guide explains how to deploy and use the database management scripts on Ubuntu servers.

## 🚀 **Prerequisites**

### **System Requirements**
- Ubuntu 18.04 LTS or higher
- PostgreSQL 12 or higher
- Bash shell
- Sudo privileges

### **Install PostgreSQL Client Tools**
```bash
# Update package list
sudo apt update

# Install PostgreSQL client tools
sudo apt install -y postgresql-client postgresql-client-common

# Install additional utilities
sudo apt install -y gzip wget curl
```

### **Verify Installation**
```bash
# Check PostgreSQL client version
psql --version

# Check if gzip is available
gzip --version
```

## 📁 **Script Deployment**

### **1. Upload Scripts to Server**
```bash
# Create scripts directory
mkdir -p ~/laravel-scripts
cd ~/laravel-scripts

# Upload all .sh files from your local machine
# Use scp, rsync, or your preferred method
```

### **2. Set Proper Permissions**
```bash
# Make all scripts executable
chmod +x *.sh

# Verify permissions
ls -la *.sh
```

### **3. Test Platform Detection**
```bash
# Run platform detection
./platform-detect.sh
```

**Expected Output on Ubuntu:**
```
🔍 Detecting platform and available tools...

Detected OS: Ubuntu 22.04.3 LTS (linux)

Available commands:
  ✅ du - Available for file size detection
  ✅ stat (GNU) - Available for file date detection
  ✅ apt - APT package manager available
  ✅ systemctl - Systemd service manager available

Platform detection complete!
```

## 🗄️ **PostgreSQL Configuration**

### **1. Database Connection**
Ensure your `.env` file has the correct PostgreSQL credentials:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=goerp
DB_USERNAME=postgres
DB_PASSWORD=Ajay@9711
```

### **2. Test Database Connection**
```bash
# Test connection
psql -h 127.0.0.1 -U postgres -d goerp -c "SELECT 1;"
```

### **3. Create Database (if needed)**
```bash
# Create database
sudo -u postgres createdb goerp

# Verify database exists
sudo -u postgres psql -l | grep goerp
```

## 🔧 **Script Usage on Ubuntu**

### **1. Database Backup**
```bash
# Create a backup
./backup-db.sh
```

**Ubuntu-specific behavior:**
- Uses `systemctl` to check PostgreSQL status
- Creates `dbbackup/` directory
- Compresses backups with `gzip`
- Uses GNU `stat` for file dates

### **2. Database Restore**
```bash
# Restore from backup
./restore-db.sh
```

**Features:**
- Interactive backup selection
- Safe restore with confirmation
- Handles compressed backups
- Runs migrations after restore

### **3. Database Management**
```bash
# Interactive database manager
./db-manager.sh
```

**Menu Options:**
1. 📊 Show Database Information
2. 💾 Create Database Backup
3. 🔄 Restore Database from Backup
4. 🔧 Run Database Maintenance
5. 🧹 Clear Old Backups
6. 📋 Show Backup Directory
7. 🚀 Run Cache Optimization
0. 🚪 Exit

### **4. Cache Optimization**
```bash
# Run cache optimization
./cache.sh

# Or without sudo
./cache-no-sudo.sh
```

## 🚨 **Ubuntu-Specific Considerations**

### **1. Service Management**
The scripts automatically detect and use:
- **systemctl** (Ubuntu 16.04+)
- **service** (Ubuntu 14.04 fallback)

### **2. File Permissions**
```bash
# Ensure proper ownership
sudo chown -R www-data:www-data storage/
sudo chown -R www-data:www-data bootstrap/cache/

# Set proper permissions
sudo chmod -R 775 storage/
sudo chmod -R 775 bootstrap/cache/
```

### **3. PostgreSQL Service**
```bash
# Check service status
sudo systemctl status postgresql

# Start service if needed
sudo systemctl start postgresql

# Enable auto-start
sudo systemctl enable postgresql
```

## 📋 **Automated Backups**

### **1. Cron Job Setup**
```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * cd /path/to/laravel && ./backup-db.sh >> /var/log/laravel-backup.log 2>&1

# Add weekly backup cleanup
0 3 * * 0 cd /path/to/laravel && ./db-manager.sh --cleanup >> /var/log/laravel-cleanup.log 2>&1
```

### **2. Log Rotation**
```bash
# Create logrotate configuration
sudo nano /etc/logrotate.d/laravel-backup

# Add configuration
/var/log/laravel-backup.log {
    daily
    missingok
    rotate 7
    compress
    notifempty
    create 644 www-data www-data
}
```

## 🔍 **Troubleshooting**

### **1. Permission Issues**
```bash
# Check current permissions
ls -la storage/ bootstrap/cache/

# Fix permissions
sudo chown -R www-data:www-data storage/ bootstrap/cache/
sudo chmod -R 775 storage/ bootstrap/cache/
```

### **2. PostgreSQL Connection Issues**
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Check connection
sudo -u postgres psql -c "\l"

# Check pg_hba.conf
sudo nano /etc/postgresql/*/main/pg_hba.conf
```

### **3. Script Execution Issues**
```bash
# Check script permissions
ls -la *.sh

# Check bash availability
which bash

# Test script execution
bash -x ./backup-db.sh
```

### **4. Disk Space Issues**
```bash
# Check disk space
df -h

# Check backup directory size
du -sh dbbackup/

# Clean old backups
./db-manager.sh
# Select option 5: Clear Old Backups
```

## 📊 **Monitoring & Maintenance**

### **1. Backup Monitoring**
```bash
# Check backup status
ls -la dbbackup/

# View backup summary
cat dbbackup/backup_summary.txt

# Monitor backup directory size
du -sh dbbackup/
```

### **2. Database Health**
```bash
# Run database maintenance
./db-manager.sh
# Select option 4: Run Database Maintenance

# Check database size
psql -h 127.0.0.1 -U postgres -d goerp -c "SELECT pg_size_pretty(pg_database_size('goerp'));"
```

### **3. Performance Monitoring**
```bash
# Check cache status
php artisan config:show cache

# Run performance optimization
./cache.sh
```

## 🚀 **Production Deployment**

### **1. Security Considerations**
```bash
# Restrict script access
chmod 750 *.sh

# Use dedicated user
sudo useradd -r -s /bin/bash laravel-db

# Set ownership
sudo chown laravel-db:laravel-db *.sh
```

### **2. Backup Storage**
```bash
# Mount external storage
sudo mount /dev/sdb1 /mnt/backups

# Create symbolic link
ln -s /mnt/backups dbbackup

# Verify mount
df -h /mnt/backups
```

### **3. Monitoring & Alerts**
```bash
# Install monitoring tools
sudo apt install -y htop iotop nethogs

# Set up log monitoring
sudo apt install -y logwatch
```

## 📚 **Additional Resources**

### **Useful Commands**
```bash
# Database size monitoring
psql -h 127.0.0.1 -U postgres -d goerp -c "
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_stat_user_tables 
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
"

# Backup verification
pg_restore --list dbbackup/backup_file.sql.gz | head -20
```

### **Log Locations**
- **PostgreSQL logs**: `/var/log/postgresql/`
- **System logs**: `/var/log/syslog`
- **Cron logs**: `/var/log/cron.log`

### **Configuration Files**
- **PostgreSQL config**: `/etc/postgresql/*/main/postgresql.conf`
- **Access control**: `/etc/postgresql/*/main/pg_hba.conf`

---

## 🎯 **Quick Start Checklist**

- [ ] Install PostgreSQL client tools
- [ ] Upload scripts to server
- [ ] Set proper permissions
- [ ] Test platform detection
- [ ] Verify database connection
- [ ] Test backup script
- [ ] Set up cron jobs
- [ ] Configure monitoring
- [ ] Test restore process
- [ ] Document procedures

**💡 Pro Tip**: Test all scripts in a staging environment before deploying to production!
