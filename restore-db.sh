#!/bin/bash

# Laravel PostgreSQL Database Restore Script
# This script restores PostgreSQL database from backup files

echo "🔄 Starting PostgreSQL Database Restore..."

# Check if backup directory exists
BACKUP_DIR="dbbackup"
if [ ! -d "$BACKUP_DIR" ]; then
    echo "❌ Backup directory '$BACKUP_DIR' not found!"
    echo "   Please run backup-db.sh first to create backups."
    exit 1
fi

# Check if pg_restore/psql is available
if ! command -v psql &> /dev/null; then
    echo "❌ psql not found. Please install PostgreSQL client tools."
    echo "   On macOS: brew install postgresql"
    echo "   On Ubuntu: sudo apt-get install postgresql-client postgresql-client-common"
    exit 1
fi

# List available backups
echo "📋 Available backups in $BACKUP_DIR/:"
echo ""

# Show backups with numbers for selection
BACKUP_FILES=()
COUNTER=1

for file in "$BACKUP_DIR"/*.sql*; do
    if [ -f "$file" ]; then
        BACKUP_FILES+=("$file")
        # Cross-platform size and date detection
        if command -v du &> /dev/null; then
            SIZE=$(du -h "$file" | cut -f1)
        else
            SIZE=$(ls -lh "$file" | awk '{print $5}')
        fi
        
        # Cross-platform date detection
        if command -v stat &> /dev/null; then
            if stat --help 2>/dev/null | grep -q "GNU coreutils"; then
                # Linux stat
                DATE=$(stat -c "%y" "$file" 2>/dev/null | cut -d' ' -f1,2 | sed 's/\([0-9]\{4\}-[0-9]\{2\}-[0-9]\{2\}\) \([0-9]\{2\}:[0-9]\{2\}:[0-9]\{2\}\)/\1 \2/')
            else
                # macOS stat
                DATE=$(stat -f "%Sm" -t "%Y-%m-%d %H:%M:%S" "$file" 2>/dev/null)
            fi
        else
            # Fallback to ls
            DATE=$(ls -l "$file" | awk '{print $6, $7, $8}')
        fi
        echo "  $COUNTER. $(basename "$file") - $SIZE - $DATE"
        COUNTER=$((COUNTER + 1))
    fi
done

if [ ${#BACKUP_FILES[@]} -eq 0 ]; then
    echo "❌ No backup files found in $BACKUP_DIR/"
    echo "   Please run backup-db.sh first to create backups."
    exit 1
fi

echo ""
echo "⚠️  WARNING: This will OVERWRITE the current database!"
echo "   Make sure you have a current backup before proceeding."
echo ""

# Get user selection
read -p "Select backup to restore (1-${#BACKUP_FILES[@]}): " SELECTION

# Validate selection
if ! [[ "$SELECTION" =~ ^[0-9]+$ ]] || [ "$SELECTION" -lt 1 ] || [ "$SELECTION" -gt ${#BACKUP_FILES[@]} ]; then
    echo "❌ Invalid selection. Please choose a number between 1 and ${#BACKUP_FILES[@]}."
    exit 1
fi

SELECTED_BACKUP="${BACKUP_FILES[$((SELECTION - 1))]}"
BACKUP_NAME=$(basename "$SELECTED_BACKUP")

echo ""
echo "🎯 Selected backup: $BACKUP_NAME"
echo "📁 Full path: $SELECTED_BACKUP"

# Final confirmation
read -p "Are you sure you want to restore from this backup? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo "❌ Restore cancelled."
    exit 0
fi

echo ""
echo "🔄 Starting database restore..."

# Check if database exists, if not create it
echo "🔍 Checking if database 'goerp' exists..."
if ! psql -h 127.0.0.1 -U postgres -lqt | cut -d \| -f 1 | grep -qw goerp; then
    echo "📝 Database 'goerp' does not exist. Creating it..."
    createdb -U postgres goerp
    echo "✅ Database 'goerp' created successfully."
fi

# Drop all tables if database exists and has data
echo "🧹 Dropping existing tables..."
psql -h 127.0.0.1 -U postgres -d goerp -c "
DO \$\$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = current_schema()) LOOP
        EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;
END \$\$;
" 2>/dev/null

echo "✅ Existing tables dropped."

# Restore from backup
echo "💾 Restoring from backup: $BACKUP_NAME"

# Check if backup is compressed
if [[ "$SELECTED_BACKUP" == *.gz ]]; then
    echo "🗜️  Detected compressed backup, decompressing..."
    gunzip -c "$SELECTED_BACKUP" | psql -h 127.0.0.1 -U postgres -d goerp
else
    psql -h 127.0.0.1 -U postgres -d goerp < "$SELECTED_BACKUP"
fi

if [ $? -eq 0 ]; then
    echo "✅ Database restore completed successfully!"
    
    # Show restored database info
    echo ""
    echo "📊 Restored database information:"
    echo "Database: goerp"
    echo "Tables:"
    psql -h 127.0.0.1 -U postgres -d goerp -c "\dt" 2>/dev/null
    
    # Show table counts
    echo ""
    echo "📈 Table record counts:"
    psql -h 127.0.0.1 -U postgres -d goerp -c "
    SELECT 
        schemaname,
        tablename,
        n_tup_ins as inserts,
        n_tup_upd as updates,
        n_tup_del as deletes
    FROM pg_stat_user_tables 
    ORDER BY tablename;
    " 2>/dev/null
    
    # Run Laravel migrations to ensure schema is up to date
    echo ""
    echo "🔄 Running Laravel migrations to ensure schema consistency..."
    php artisan migrate --force
    
    echo ""
    echo "🎉 Database restore completed successfully!"
    echo "📁 Restored from: $BACKUP_NAME"
    echo "🗄️  Database: goerp"
    echo ""
    echo "💡 Next steps:"
    echo "   1. Verify your application is working correctly"
    echo "   2. Check that all data is present"
    echo "   3. Run ./cache.sh to optimize performance"
    echo "   4. Test critical functionality"
    
else
    echo "❌ Database restore failed!"
    echo ""
    echo "🔧 Troubleshooting tips:"
    echo "   1. Check if PostgreSQL is running"
    echo "   2. Verify backup file is not corrupted"
    echo "   3. Check PostgreSQL logs for errors"
    echo "   4. Ensure you have sufficient disk space"
    exit 1
fi
