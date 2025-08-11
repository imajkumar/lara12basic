# Git Management Guide for Laravel + Database Scripts

This guide explains what should and shouldn't be committed to version control in your Laravel project with database management scripts.

## ✅ **What TO Commit (Tracked Files)**

### **Source Code & Configuration**
- `app/` - Laravel application code
- `config/` - Configuration files
- `database/migrations/` - Database migrations
- `database/seeders/` - Database seeders
- `resources/` - Frontend resources
- `routes/` - Route definitions
- `tests/` - Test files

### **Scripts & Documentation**
- `*.sh` - All shell scripts (backup, restore, cache, etc.)
- `*.md` - Documentation files
- `.gitignore` - Git ignore rules
- `composer.json` - PHP dependencies
- `package.json` - Node.js dependencies

### **Project Files**
- `artisan` - Laravel command line tool
- `phpunit.xml` - PHPUnit configuration
- `tsconfig.json` - TypeScript configuration
- `vite.config.ts` - Vite configuration

## ❌ **What NOT to Commit (Ignored Files)**

### **Environment & Secrets**
- `.env` - Environment variables (contains passwords)
- `.env.backup` - Environment backup files
- `.env.production` - Production environment

### **Database Files**
- `dbbackup/` - Database backup directory
- `*.sql` - SQL dump files
- `*.sql.gz` - Compressed SQL files
- `backup_summary.txt` - Backup summaries
- `database/database.sqlite` - SQLite database (if using)

### **Generated Files**
- `vendor/` - Composer dependencies
- `node_modules/` - Node.js dependencies
- `public/build/` - Compiled assets
- `storage/framework/cache/*` - Laravel cache files
- `storage/framework/views/*` - Compiled Blade views
- `storage/framework/sessions/*` - Session files
- `storage/logs/*.log` - Log files

### **Temporary Files**
- `*.log` - Any log files
- `*.tmp` - Temporary files
- `*.cache` - Cache files
- `bootstrap/cache/*.php` - Bootstrap cache

## 🔧 **Git Commands for This Project**

### **Initial Setup**
```bash
# Initialize git repository (already done)
git init

# Add all source files (excluding ignored files)
git add .

# Make initial commit
git commit -m "Initial commit: Laravel project with database management scripts"
```

### **Regular Development Workflow**
```bash
# Check what files are staged/unstaged
git status

# Add specific files
git add app/Http/Controllers/NewController.php
git add database/migrations/new_migration.php

# Add all changes (excluding ignored files)
git add .

# Commit changes
git commit -m "Add new feature: user management"

# Push to remote
git push origin main
```

### **Checking Ignored Files**
```bash
# See what files are being ignored
git status --ignored

# Check if a specific file is ignored
git check-ignore dbbackup/backup_file.sql
```

## 📁 **File Organization**

### **Scripts Directory Structure**
```
scripts/
├── .gitignore          # Script-specific ignore rules
├── backup-db.sh        # Database backup script
├── restore-db.sh       # Database restore script
├── db-manager.sh       # Database management interface
├── cache.sh            # Cache optimization script
├── cache-no-sudo.sh    # Cache script without sudo
├── optimize.sh          # Quick optimization alias
└── platform-detect.sh  # Cross-platform detection
```

### **Backup Directory Structure**
```
dbbackup/                           # IGNORED by git
├── goerp_backup_20250811_195820.sql.gz
├── goerp_backup_20250811_200000.sql.gz
└── backup_summary.txt
```

## 🚨 **Important Notes**

### **Never Commit These Files**
- **Database backups** - They contain sensitive data and are large
- **Environment files** - They contain passwords and API keys
- **Generated cache files** - They're automatically created
- **Log files** - They contain runtime information
- **Dependencies** - Use package managers instead

### **Always Commit These Files**
- **Source code** - Your application logic
- **Configuration templates** - `.env.example` (without secrets)
- **Scripts** - Database management and optimization scripts
- **Documentation** - README files and guides
- **Migration files** - Database schema changes

## 🔍 **Troubleshooting**

### **If You Accidentally Committed Ignored Files**
```bash
# Remove from git tracking (but keep local file)
git rm --cached dbbackup/backup_file.sql

# Commit the removal
git commit -m "Remove accidentally committed backup file"

# Push changes
git push origin main
```

### **If .gitignore Isn't Working**
```bash
# Clear git cache
git rm -r --cached .

# Re-add all files (respecting new .gitignore)
git add .

# Commit changes
git commit -m "Update .gitignore and clear cache"
```

### **Check What's Being Tracked**
```bash
# List all tracked files
git ls-files

# Check if specific file is tracked
git ls-files | grep "filename"
```

## 📋 **Quick Checklist**

Before committing, ensure:
- [ ] No `.env` files are included
- [ ] No `dbbackup/` directory is included
- [ ] No `*.sql` or `*.sql.gz` files are included
- [ ] No log files are included
- [ ] All source code changes are included
- [ ] All script changes are included
- [ ] All documentation changes are included

## 💡 **Pro Tips**

1. **Use `git status`** before every commit to review changes
2. **Use `git add -p`** to selectively add parts of files
3. **Use `git diff --cached`** to review staged changes
4. **Set up pre-commit hooks** to automatically check for sensitive files
5. **Regular backups** of your git repository (separate from database backups)

---

**Remember**: When in doubt, use `git status` to see what will be committed!
