#!/bin/bash

# Laravel PostgreSQL Database Backup Script
# This script creates a backup folder and takes PostgreSQL database backups with timestamp

echo "🗄️  Starting PostgreSQL Database Backup..."

# Get current timestamp for backup filename
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="dbbackup"
BACKUP_FILE="goerp_backup_${TIMESTAMP}.sql"

# Create backup directory if it doesn't exist
echo "📁 Creating backup directory..."
if [ ! -d "$BACKUP_DIR" ]; then
    mkdir -p "$BACKUP_DIR"
    echo "✅ Created backup directory: $BACKUP_DIR"
else
    echo "✅ Backup directory already exists: $BACKUP_DIR"
fi

# Set proper permissions for backup directory
echo "🔒 Setting backup directory permissions..."
chmod 755 "$BACKUP_DIR"

# Check if PostgreSQL is running (cross-platform)
echo "🔍 Checking PostgreSQL status..."
if command -v brew &> /dev/null; then
    # macOS with Homebrew
    if ! brew services list | grep -q "postgresql.*started"; then
        echo "❌ PostgreSQL is not running. Starting PostgreSQL..."
        brew services start postgresql
        sleep 3
    fi
else
    # Ubuntu/Linux
    if command -v systemctl &> /dev/null; then
        if ! systemctl is-active --quiet postgresql; then
            echo "❌ PostgreSQL is not running. Starting PostgreSQL..."
            sudo systemctl start postgresql
            sleep 3
        fi
    elif command -v service &> /dev/null; then
        if ! service postgresql status | grep -q "running"; then
            echo "❌ PostgreSQL is not running. Starting PostgreSQL..."
            sudo service postgresql start
            sleep 3
        fi
    fi
fi

# Check if pg_dump is available
if ! command -v pg_dump &> /dev/null; then
    echo "❌ pg_dump not found. Please install PostgreSQL client tools."
    echo "   On macOS: brew install postgresql"
echo "   On Ubuntu: sudo apt-get install postgresql-client postgresql-client-common"
    exit 1
fi

# Take database backup
echo "💾 Taking PostgreSQL backup..."
echo "   Database: goerp"
echo "   Backup file: $BACKUP_FILE"
echo "   Location: $BACKUP_DIR/$BACKUP_FILE"

# Perform the backup
if pg_dump -h 127.0.0.1 -U postgres -d goerp > "$BACKUP_DIR/$BACKUP_FILE" 2>/tmp/backup_error.log; then
    echo "✅ Database backup completed successfully!"
    
    # Get backup file size (cross-platform)
if command -v du &> /dev/null; then
    BACKUP_SIZE=$(du -h "$BACKUP_DIR/$BACKUP_FILE" | cut -f1)
else
    BACKUP_SIZE=$(ls -lh "$BACKUP_DIR/$BACKUP_FILE" | awk '{print $5}')
fi
echo "📊 Backup size: $BACKUP_SIZE"
    
    # Compress the backup to save space
echo "🗜️  Compressing backup file..."
if command -v gzip &> /dev/null; then
    gzip "$BACKUP_DIR/$BACKUP_FILE"
    COMPRESSED_FILE="$BACKUP_DIR/$BACKUP_FILE.gz"
    # Cross-platform size detection
    if command -v du &> /dev/null; then
        COMPRESSED_SIZE=$(du -h "$COMPRESSED_FILE" | cut -f1)
    else
        COMPRESSED_SIZE=$(ls -lh "$COMPRESSED_FILE" | awk '{print $5}')
    fi
    echo "✅ Backup compressed: $COMPRESSED_FILE"
    echo "📊 Compressed size: $COMPRESSED_SIZE"
    echo "💾 Space saved: $BACKUP_SIZE → $COMPRESSED_SIZE"
else
    echo "ℹ️  gzip not available, keeping uncompressed backup"
fi
    
    # List all backups
    echo ""
    echo "📋 Available backups in $BACKUP_DIR/:"
    ls -lh "$BACKUP_DIR/" | grep -E "\.(sql|gz)$" | sort -k9 -r
    
    # Show backup directory info (cross-platform)
echo ""
echo "📊 Backup directory information:"
if command -v du &> /dev/null; then
    du -sh "$BACKUP_DIR"
else
    echo "Directory size: $(ls -lah "$BACKUP_DIR" | head -1 | awk '{print $2}')"
fi
echo "Total backup files: $(ls "$BACKUP_DIR"/*.sql* 2>/dev/null | wc -l)"
    
else
    echo "❌ Database backup failed!"
    echo "Error details:"
    cat /tmp/backup_error.log
    echo ""
    echo "🔧 Troubleshooting tips:"
    echo "   1. Check if PostgreSQL is running: brew services list | grep postgresql"
    echo "   2. Verify database exists: psql -U postgres -l | grep goerp"
    echo "   3. Check connection: psql -h 127.0.0.1 -U postgres -d goerp"
    echo "   4. Verify credentials in .env file"
    exit 1
fi

# Clean up old backups (keep last 10 backups)
echo ""
echo "🧹 Cleaning up old backups (keeping last 10)..."
cd "$BACKUP_DIR"
BACKUP_COUNT=$(ls -1 *.sql* 2>/dev/null | wc -l)
if [ "$BACKUP_COUNT" -gt 10 ]; then
    echo "Found $BACKUP_COUNT backups, removing oldest ones..."
    ls -t *.sql* | tail -n +11 | xargs rm -f
    echo "✅ Cleaned up old backups"
else
    echo "ℹ️  Only $BACKUP_COUNT backups found, no cleanup needed"
fi
cd ..

# Create backup summary
echo ""
echo "📝 Creating backup summary..."
SUMMARY_FILE="$BACKUP_DIR/backup_summary.txt"
{
    echo "Database Backup Summary"
    echo "======================="
    echo "Date: $(date)"
    echo "Database: goerp"
    echo "Backup file: $BACKUP_FILE"
    echo "Status: SUCCESS"
    echo "Size: $BACKUP_SIZE"
    echo "Location: $BACKUP_DIR/$BACKUP_FILE"
    echo ""
    echo "Available backups:"
    ls -lh "$BACKUP_DIR"/*.sql* 2>/dev/null | sort -k9 -r
} > "$SUMMARY_FILE"

echo "✅ Backup summary created: $SUMMARY_FILE"

# Final success message
echo ""
echo "🎉 Database backup completed successfully!"
echo "📁 Backup location: $BACKUP_DIR/"
echo "📅 Backup timestamp: $TIMESTAMP"
echo "💾 Backup file: $BACKUP_FILE"
echo ""
echo "💡 Tips:"
echo "   - Run this script regularly for data safety"
echo "   - Keep backups in a secure location"
echo "   - Test restore process periodically"
echo "   - Monitor backup directory size"
echo ""
echo "🔄 To restore from backup:"
echo "   psql -h 127.0.0.1 -U postgres -d goerp < $BACKUP_DIR/$BACKUP_FILE"
