#!/bin/bash

# Laravel PostgreSQL Database Management Script
# This script provides a menu-driven interface for database operations

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to display header
show_header() {
    clear
    echo -e "${CYAN}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║                Laravel PostgreSQL DB Manager                ║${NC}"
    echo -e "${CYAN}║                    Database: goerp                          ║${NC}"
    echo -e "${CYAN}╚══════════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

# Function to check PostgreSQL status
check_postgres_status() {
    echo -e "${BLUE}🔍 Checking PostgreSQL status...${NC}"
    if command -v brew &> /dev/null; then
        # macOS with Homebrew
        if brew services list | grep -q "postgresql.*started"; then
            echo -e "${GREEN}✅ PostgreSQL is running${NC}"
            return 0
        else
            echo -e "${RED}❌ PostgreSQL is not running${NC}"
            return 1
        fi
    else
        # Ubuntu/Linux
        if command -v systemctl &> /dev/null; then
            if systemctl is-active --quiet postgresql; then
                echo -e "${GREEN}✅ PostgreSQL is running${NC}"
                return 0
            else
                echo -e "${RED}❌ PostgreSQL is not running${NC}"
                return 1
            fi
        elif command -v service &> /dev/null; then
            if service postgresql status | grep -q "running"; then
                echo -e "${GREEN}✅ PostgreSQL is running${NC}"
                return 0
            else
                echo -e "${RED}❌ PostgreSQL is not running${NC}"
                return 1
            fi
        else
            echo -e "${YELLOW}⚠️  Cannot determine PostgreSQL status${NC}"
            return 1
        fi
    fi
}

# Function to check database connection
check_db_connection() {
    echo -e "${BLUE}🔍 Testing database connection...${NC}"
    if psql -h 127.0.0.1 -U postgres -d goerp -c "SELECT 1;" >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Database connection successful${NC}"
        return 0
    else
        echo -e "${RED}❌ Database connection failed${NC}"
        return 1
    fi
}

# Function to show database info
show_db_info() {
    echo -e "${BLUE}📊 Database Information:${NC}"
    echo ""
    
    # Database size
    DB_SIZE=$(psql -h 127.0.0.1 -U postgres -d goerp -t -c "SELECT pg_size_pretty(pg_database_size('goerp'));" 2>/dev/null | xargs)
    echo -e "Database size: ${YELLOW}$DB_SIZE${NC}"
    
    # Table count
    TABLE_COUNT=$(psql -h 127.0.0.1 -U postgres -d goerp -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" 2>/dev/null | xargs)
    echo -e "Total tables: ${YELLOW}$TABLE_COUNT${NC}"
    
    # Record count for each table
    echo ""
    echo -e "${BLUE}📈 Table Details:${NC}"
    psql -h 127.0.0.1 -U postgres -d goerp -c "
    SELECT 
        schemaname as schema,
        tablename as table,
        n_tup_ins as inserts,
        n_tup_upd as updates,
        n_tup_del as deletes,
        pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
    FROM pg_stat_user_tables 
    ORDER BY tablename;
    " 2>/dev/null
    
    echo ""
}

# Function to show backup status
show_backup_status() {
    BACKUP_DIR="dbbackup"
    echo -e "${BLUE}💾 Backup Status:${NC}"
    echo ""
    
    if [ -d "$BACKUP_DIR" ]; then
        BACKUP_COUNT=$(ls "$BACKUP_DIR"/*.sql* 2>/dev/null | wc -l)
        # Cross-platform size detection
        if command -v du &> /dev/null; then
            BACKUP_SIZE=$(du -sh "$BACKUP_DIR" 2>/dev/null | cut -f1)
        else
            BACKUP_SIZE=$(ls -lah "$BACKUP_DIR" | head -1 | awk '{print $2}')
        fi
        
        echo -e "Backup directory: ${YELLOW}$BACKUP_DIR${NC}"
        echo -e "Total backups: ${YELLOW}$BACKUP_COUNT${NC}"
        echo -e "Directory size: ${YELLOW}$BACKUP_SIZE${NC}"
        
        if [ $BACKUP_COUNT -gt 0 ]; then
            echo ""
            echo -e "${BLUE}📋 Recent backups:${NC}"
            ls -lh "$BACKUP_DIR"/*.sql* 2>/dev/null | head -5 | sort -k9 -r
        fi
    else
        echo -e "${RED}❌ No backup directory found${NC}"
    fi
    echo ""
}

# Function to create backup
create_backup() {
    echo -e "${BLUE}🗄️  Creating database backup...${NC}"
    ./backup-db.sh
    echo ""
    read -p "Press Enter to continue..."
}

# Function to restore database
restore_database() {
    echo -e "${BLUE}🔄 Restoring database...${NC}"
    ./restore-db.sh
    echo ""
    read -p "Press Enter to continue..."
}

# Function to run maintenance
run_maintenance() {
    echo -e "${BLUE}🔧 Running database maintenance...${NC}"
    echo ""
    
    # Vacuum database
    echo -e "${YELLOW}🧹 Running VACUUM...${NC}"
    psql -h 127.0.0.1 -U postgres -d goerp -c "VACUUM ANALYZE;" 2>/dev/null
    echo -e "${GREEN}✅ VACUUM completed${NC}"
    
    # Update statistics
    echo -e "${YELLOW}📊 Updating statistics...${NC}"
    psql -h 127.0.0.1 -U postgres -d goerp -c "ANALYZE;" 2>/dev/null
    echo -e "${GREEN}✅ Statistics updated${NC}"
    
    # Check for dead tuples
    echo -e "${YELLOW}🔍 Checking for dead tuples...${NC}"
    DEAD_TUPLES=$(psql -h 127.0.0.1 -U postgres -d goerp -t -c "
    SELECT schemaname, tablename, n_dead_tup 
    FROM pg_stat_user_tables 
    WHERE n_dead_tup > 0 
    ORDER BY n_dead_tup DESC;" 2>/dev/null)
    
    if [ -n "$DEAD_TUPLES" ]; then
        echo -e "${YELLOW}Found dead tuples:${NC}"
        echo "$DEAD_TUPLES"
    else
        echo -e "${GREEN}✅ No dead tuples found${NC}"
    fi
    
    echo ""
    echo -e "${GREEN}✅ Database maintenance completed${NC}"
    echo ""
    read -p "Press Enter to continue..."
}

# Function to show main menu
show_menu() {
    show_header
    
    # Check system status
    check_postgres_status
    echo ""
    
    if check_db_connection; then
        show_db_info
        show_backup_status
    else
        echo -e "${RED}⚠️  Cannot connect to database. Some features may not work.${NC}"
        echo ""
    fi
    
    echo -e "${CYAN}Available Operations:${NC}"
    echo ""
    echo -e "  ${YELLOW}1.${NC} 📊 Show Database Information"
    echo -e "  ${YELLOW}2.${NC} 💾 Create Database Backup"
    echo -e "  ${YELLOW}3.${NC} 🔄 Restore Database from Backup"
    echo -e "  ${YELLOW}4.${NC} 🔧 Run Database Maintenance"
    echo -e "  ${YELLOW}5.${NC} 🧹 Clear Old Backups"
    echo -e "  ${YELLOW}6.${NC} 📋 Show Backup Directory"
    echo -e "  ${YELLOW}7.${NC} 🚀 Run Cache Optimization"
    echo -e "  ${YELLOW}0.${NC} 🚪 Exit"
    echo ""
}

# Function to clear old backups
clear_old_backups() {
    BACKUP_DIR="dbbackup"
    echo -e "${BLUE}🧹 Clearing old backups...${NC}"
    echo ""
    
    if [ ! -d "$BACKUP_DIR" ]; then
        echo -e "${RED}❌ Backup directory not found${NC}"
        return
    fi
    
    # Show current backups
    echo -e "${YELLOW}Current backups:${NC}"
    ls -lh "$BACKUP_DIR"/*.sql* 2>/dev/null | sort -k9 -r
    
    echo ""
    read -p "How many recent backups to keep? (default: 5): " KEEP_COUNT
    KEEP_COUNT=${KEEP_COUNT:-5}
    
    if [[ ! "$KEEP_COUNT" =~ ^[0-9]+$ ]] || [ "$KEEP_COUNT" -lt 1 ]; then
        echo -e "${RED}❌ Invalid number${NC}"
        return
    fi
    
    echo ""
    echo -e "${YELLOW}Keeping last $KEEP_COUNT backups...${NC}"
    
    cd "$BACKUP_DIR"
    BACKUP_COUNT=$(ls -1 *.sql* 2>/dev/null | wc -l)
    
    if [ "$BACKUP_COUNT" -gt "$KEEP_COUNT" ]; then
        REMOVE_COUNT=$((BACKUP_COUNT - KEEP_COUNT))
        echo -e "${YELLOW}Removing $REMOVE_COUNT old backups...${NC}"
        ls -t *.sql* | tail -n +$((KEEP_COUNT + 1)) | xargs rm -f
        echo -e "${GREEN}✅ Old backups removed${NC}"
    else
        echo -e "${GREEN}✅ Only $BACKUP_COUNT backups found, no cleanup needed${NC}"
    fi
    
    cd ..
    
    echo ""
    echo -e "${GREEN}✅ Backup cleanup completed${NC}"
    echo ""
    read -p "Press Enter to continue..."
}

# Function to show backup directory
show_backup_directory() {
    BACKUP_DIR="dbbackup"
    echo -e "${BLUE}📋 Backup Directory Contents:${NC}"
    echo ""
    
    if [ -d "$BACKUP_DIR" ]; then
        if [ "$(ls -A "$BACKUP_DIR" 2>/dev/null)" ]; then
            echo -e "${YELLOW}Backup files:${NC}"
            ls -lah "$BACKUP_DIR"/*.sql* 2>/dev/null | sort -k9 -r
            
            echo ""
            echo -e "${YELLOW}Directory information:${NC}"
            if command -v du &> /dev/null; then
                du -sh "$BACKUP_DIR"
            else
                echo "Directory size: $(ls -lah "$BACKUP_DIR" | head -1 | awk '{print $2}')"
            fi
            echo "Total files: $(ls "$BACKUP_DIR"/*.sql* 2>/dev/null | wc -l)"
        else
            echo -e "${YELLOW}Backup directory is empty${NC}"
        fi
    else
        echo -e "${RED}❌ Backup directory not found${NC}"
    fi
    
    echo ""
    read -p "Press Enter to continue..."
}

# Main program loop
while true; do
    show_menu
    
    read -p "Select an option (0-7): " choice
    
    case $choice in
        1)
            show_header
            show_db_info
            echo ""
            read -p "Press Enter to continue..."
            ;;
        2)
            create_backup
            ;;
        3)
            restore_database
            ;;
        4)
            run_maintenance
            ;;
        5)
            clear_old_backups
            ;;
        6)
            show_header
            show_backup_directory
            ;;
        7)
            echo -e "${BLUE}🚀 Running cache optimization...${NC}"
            ./cache.sh
            echo ""
            read -p "Press Enter to continue..."
            ;;
        0)
            echo ""
            echo -e "${GREEN}👋 Goodbye!${NC}"
            exit 0
            ;;
        *)
            echo ""
            echo -e "${RED}❌ Invalid option. Please select 0-7.${NC}"
            echo ""
            read -p "Press Enter to continue..."
            ;;
    esac
done
