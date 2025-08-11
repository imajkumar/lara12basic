#!/bin/bash

# GoERP Pre-Installation Script
# This script checks and installs missing PHP packages and extensions before running the web installer

echo "🔍 GoERP Pre-Installation System Check Starting..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to detect OS
detect_os() {
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        if [ -f /etc/os-release ]; then
            . /etc/os-release
            OS_NAME="$NAME"
            OS_VERSION="$VERSION"
            OS_ID="$ID"
        else
            OS_NAME="Linux"
            OS_VERSION="Unknown"
            OS_ID="linux"
        fi
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        OS_NAME="macOS"
        OS_VERSION=$(sw_vers -productVersion 2>/dev/null || echo "Unknown")
        OS_ID="macos"
    else
        OS_NAME="Unknown"
        OS_VERSION="Unknown"
        OS_ID="unknown"
    fi
    
    echo -e "${CYAN}🖥️  Detected OS: $OS_NAME $OS_VERSION ($OS_ID)${NC}"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check PHP version
check_php_version() {
    echo -e "${BLUE}🔍 Checking PHP version...${NC}"
    
    if command_exists php; then
        PHP_VERSION=$(php -v | head -n1 | cut -d' ' -f2 | cut -d'.' -f1,2)
        PHP_MAJOR=$(echo $PHP_VERSION | cut -d'.' -f1)
        PHP_MINOR=$(echo $PHP_VERSION | cut -d'.' -f2)
        
        echo -e "Current PHP version: ${YELLOW}$PHP_VERSION${NC}"
        
        if [ "$PHP_MAJOR" -ge 8 ] && [ "$PHP_MINOR" -ge 2 ]; then
            echo -e "${GREEN}✅ PHP version meets requirements (8.2+)${NC}"
            return 0
        else
            echo -e "${RED}❌ PHP version too old. Required: 8.2+, Current: $PHP_VERSION${NC}"
            return 1
        fi
    else
        echo -e "${RED}❌ PHP not installed${NC}"
        return 1
    fi
}

# Function to check PHP extensions
check_php_extensions() {
    echo -e "${BLUE}🔍 Checking PHP extensions...${NC}"
    
    local missing_extensions=()
    local required_extensions=(
        "openssl"
        "pdo"
        "pdo_pgsql"
        "pgsql"
        "mbstring"
        "tokenizer"
        "fileinfo"
        "curl"
        "zip"
        "gd"
        "xml"
        "ctype"
        "json"
        "bcmath"
    )
    
    for ext in "${required_extensions[@]}"; do
        if php -m | grep -qi "^$ext$"; then
            echo -e "  ✅ $ext"
        else
            echo -e "  ❌ $ext (missing)"
            missing_extensions+=("$ext")
        fi
    done
    
    if [ ${#missing_extensions[@]} -eq 0 ]; then
        echo -e "${GREEN}✅ All required PHP extensions are installed${NC}"
        return 0
    else
        echo -e "${RED}❌ Missing extensions: ${missing_extensions[*]}${NC}"
        return 1
    fi
}

# Function to check PostgreSQL
check_postgresql() {
    echo -e "${BLUE}🔍 Checking PostgreSQL...${NC}"
    
    if command_exists psql; then
        PSQL_VERSION=$(psql --version | cut -d' ' -f3 | cut -d'.' -f1,2)
        echo -e "PostgreSQL version: ${YELLOW}$PSQL_VERSION${NC}"
        
        if command_exists systemctl; then
            if systemctl is-active --quiet postgresql; then
                echo -e "${GREEN}✅ PostgreSQL service is running${NC}"
                return 0
            else
                echo -e "${YELLOW}⚠️  PostgreSQL installed but not running${NC}"
                return 1
            fi
        else
            echo -e "${YELLOW}⚠️  PostgreSQL installed but service status unknown${NC}"
            return 0
        fi
    else
        echo -e "${RED}❌ PostgreSQL not installed${NC}"
        return 1
    fi
}

# Function to install packages on Ubuntu/Debian
install_packages_ubuntu() {
    echo -e "${BLUE}📦 Installing packages on Ubuntu/Debian...${NC}"
    
    # Update package list
    echo -e "${YELLOW}🔄 Updating package list...${NC}"
    sudo apt update
    
    # Install PHP and extensions
    echo -e "${YELLOW}📥 Installing PHP 8.2 and extensions...${NC}"
    sudo apt install -y \
        php8.2 \
        php8.2-fpm \
        php8.2-pgsql \
        php8.2-mbstring \
        php8.2-xml \
        php8.2-curl \
        php8.2-gd \
        php8.2-bcmath \
        php8.2-zip \
        php8.2-cli \
        php8.2-common
    
    # Install PostgreSQL
    echo -e "${YELLOW}📥 Installing PostgreSQL...${NC}"
    sudo apt install -y postgresql postgresql-contrib
    
    # Install other required packages
    echo -e "${YELLOW}📥 Installing other required packages...${NC}"
    sudo apt install -y \
        composer \
        git \
        nginx \
        unzip \
        wget \
        curl
    
    # Start and enable PostgreSQL
    echo -e "${YELLOW}🚀 Starting PostgreSQL service...${NC}"
    sudo systemctl start postgresql
    sudo systemctl enable postgresql
    
    # Start and enable PHP-FPM
    echo -e "${YELLOW}🚀 Starting PHP-FPM service...${NC}"
    sudo systemctl start php8.2-fpm
    sudo systemctl enable php8.2-fpm
    
    # Start and enable Nginx
    echo -e "${YELLOW}🚀 Starting Nginx service...${NC}"
    sudo systemctl start nginx
    sudo systemctl enable nginx
}

# Function to install packages on CentOS/RHEL
install_packages_centos() {
    echo -e "${BLUE}📦 Installing packages on CentOS/RHEL...${NC}"
    
    # Install EPEL and REMI repositories
    echo -e "${YELLOW}🔄 Installing EPEL and REMI repositories...${NC}"
    sudo yum install -y epel-release
    sudo yum install -y https://rpms.remirepo.net/enterprise/remi-release-7.rpm
    
    # Install PHP 8.2
    echo -e "${YELLOW}📥 Installing PHP 8.2 and extensions...${NC}"
    sudo yum-config-manager --enable remi-php82
    sudo yum install -y \
        php \
        php-fpm \
        php-pgsql \
        php-mbstring \
        php-xml \
        php-curl \
        php-gd \
        php-bcmath \
        php-zip \
        php-cli \
        php-common
    
    # Install PostgreSQL
    echo -e "${YELLOW}📥 Installing PostgreSQL...${NC}"
    sudo yum install -y postgresql postgresql-server postgresql-contrib
    
    # Initialize PostgreSQL
    echo -e "${YELLOW}🚀 Initializing PostgreSQL...${NC}"
    sudo postgresql-setup initdb
    sudo systemctl start postgresql
    sudo systemctl enable postgresql
    
    # Start PHP-FPM
    echo -e "${YELLOW}🚀 Starting PHP-FPM service...${NC}"
    sudo systemctl start php-fpm
    sudo systemctl enable php-fpm
}

# Function to install packages on macOS
install_packages_macos() {
    echo -e "${BLUE}📦 Installing packages on macOS...${NC}"
    
    if ! command_exists brew; then
        echo -e "${RED}❌ Homebrew not installed. Please install Homebrew first:${NC}"
        echo -e "${YELLOW}   /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\"${NC}"
        return 1
    fi
    
    # Install PHP 8.2
    echo -e "${YELLOW}📥 Installing PHP 8.2...${NC}"
    brew install php@8.2
    
    # Install PostgreSQL
    echo -e "${YELLOW}📥 Installing PostgreSQL...${NC}"
    brew install postgresql
    
    # Start PostgreSQL
    echo -e "${YELLOW}🚀 Starting PostgreSQL service...${NC}"
    brew services start postgresql
    
    # Install Composer
    if ! command_exists composer; then
        echo -e "${YELLOW}📥 Installing Composer...${NC}"
        brew install composer
    fi
}

# Function to create database and user
setup_database() {
    echo -e "${BLUE}🗄️  Setting up database...${NC}"
    
    # Create database
    echo -e "${YELLOW}📝 Creating database 'goerp'...${NC}"
    if command_exists createdb; then
        sudo -u postgres createdb goerp 2>/dev/null || echo "Database 'goerp' already exists or could not be created"
    else
        echo -e "${YELLOW}⚠️  createdb command not found, please create database manually${NC}"
    fi
    
    # Create user (optional)
    echo -e "${YELLOW}👤 You can create a PostgreSQL user manually if needed:${NC}"
    echo -e "${CYAN}   sudo -u postgres createuser --interactive${NC}"
}

# Function to set permissions
set_permissions() {
    echo -e "${BLUE}🔒 Setting file permissions...${NC}"
    
    # Create necessary directories
    mkdir -p storage/framework/cache
    mkdir -p storage/framework/sessions
    mkdir -p storage/framework/views
    mkdir -p storage/logs
    mkdir -p bootstrap/cache
    mkdir -p dbbackup
    
    # Set permissions
    echo -e "${YELLOW}📁 Setting directory permissions...${NC}"
    chmod -R 775 storage/
    chmod -R 775 bootstrap/cache/
    chmod -R 775 dbbackup/
    
    # Set ownership (if running as root or with sudo)
    if [ "$EUID" -eq 0 ]; then
        echo -e "${YELLOW}👤 Setting ownership to www-data...${NC}"
        chown -R www-data:www-data storage/
        chown -R www-data:www-data bootstrap/cache/
        chown -R www-data:www-data dbbackup/
    fi
}

# Function to check if web installer is accessible
check_web_installer() {
    echo -e "${BLUE}🌐 Checking web installer accessibility...${NC}"
    
    if [ -f "artisan" ]; then
        echo -e "${GREEN}✅ Laravel artisan found${NC}"
        
        # Check if installer routes are available
        if php artisan route:list | grep -q "install"; then
            echo -e "${GREEN}✅ Web installer routes available${NC}"
            echo -e "${CYAN}🌐 You can now access the web installer at: http://your-domain.com/install${NC}"
            return 0
        else
            echo -e "${RED}❌ Web installer routes not found${NC}"
            return 1
        fi
    else
        echo -e "${RED}❌ Laravel artisan not found. Please run this script from Laravel project root${NC}"
        return 1
    fi
}

# Main execution
main() {
    echo -e "${CYAN}🚀 GoERP Pre-Installation System Check${NC}"
    echo -e "${CYAN}=====================================${NC}"
    echo ""
    
    # Detect OS
    detect_os
    echo ""
    
    # Check PHP version
    PHP_OK=false
    if check_php_version; then
        PHP_OK=true
    fi
    echo ""
    
    # Check PHP extensions
    EXTENSIONS_OK=false
    if check_php_extensions; then
        EXTENSIONS_OK=true
    fi
    echo ""
    
    # Check PostgreSQL
    POSTGRES_OK=false
    if check_postgresql; then
        POSTGRES_OK=true
    fi
    echo ""
    
    # Summary
    echo -e "${CYAN}📊 System Check Summary:${NC}"
    echo -e "  PHP Version: $([ "$PHP_OK" = true ] && echo "✅" || echo "❌")"
    echo -e "  PHP Extensions: $([ "$EXTENSIONS_OK" = true ] && echo "✅" || echo "❌")"
    echo -e "  PostgreSQL: $([ "$POSTGRES_OK" = true ] && echo "✅" || echo "❌")"
    echo ""
    
    # If everything is OK, proceed
    if [ "$PHP_OK" = true ] && [ "$EXTENSIONS_OK" = true ] && [ "$POSTGRES_OK" = true ]; then
        echo -e "${GREEN}🎉 All requirements met! You can now run the web installer.${NC}"
        echo ""
        set_permissions
        echo ""
        check_web_installer
        echo ""
        echo -e "${GREEN}🚀 Ready to install! Visit: http://your-domain.com/install${NC}"
        return 0
    fi
    
    # Ask if user wants to install missing packages
    echo -e "${YELLOW}⚠️  Some requirements are missing.${NC}"
    echo ""
    
    if [ "$OS_ID" = "ubuntu" ] || [ "$OS_ID" = "debian" ]; then
        echo -e "${CYAN}🔄 Auto-installation available for Ubuntu/Debian${NC}"
        read -p "Do you want to automatically install missing packages? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            install_packages_ubuntu
            echo ""
            echo -e "${GREEN}✅ Package installation complete!${NC}"
            echo ""
            echo -e "${YELLOW}🔄 Re-running system check...${NC}"
            echo ""
            main  # Recursive call to re-check
            return 0
        fi
    elif [ "$OS_ID" = "centos" ] || [ "$OS_ID" = "rhel" ]; then
        echo -e "${CYAN}🔄 Auto-installation available for CentOS/RHEL${NC}"
        read -p "Do you want to automatically install missing packages? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            install_packages_centos
            echo ""
            echo -e "${GREEN}✅ Package installation complete!${NC}"
            echo ""
            echo -e "${YELLOW}🔄 Re-running system check...${NC}"
            echo ""
            main  # Recursive call to re-check
            return 0
        fi
    elif [ "$OS_ID" = "macos" ]; then
        echo -e "${CYAN}🔄 Auto-installation available for macOS${NC}"
        read -p "Do you want to automatically install missing packages? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            install_packages_macos
            echo ""
            echo -e "${GREEN}✅ Package installation complete!${NC}"
            echo ""
            echo -e "${YELLOW}🔄 Re-running system check...${NC}"
            echo ""
            main  # Recursive call to re-check
            return 0
        fi
    else
        echo -e "${YELLOW}⚠️  Auto-installation not available for $OS_NAME${NC}"
    fi
    
    echo ""
    echo -e "${RED}❌ Manual installation required. Please install missing packages manually:${NC}"
    echo ""
    
    if [ "$PHP_OK" = false ]; then
        echo -e "${YELLOW}📥 Install PHP 8.2+${NC}"
    fi
    
    if [ "$EXTENSIONS_OK" = false ]; then
        echo -e "${YELLOW}📥 Install PHP extensions: pdo, pdo_pgsql, pgsql, mbstring, xml, curl, gd, bcmath, zip${NC}"
    fi
    
    if [ "$POSTGRES_OK" = false ]; then
        echo -e "${YELLOW}📥 Install PostgreSQL 12+${NC}"
    fi
    
    echo ""
    echo -e "${CYAN}📚 Check INSTALLATION_GUIDE.md for detailed installation instructions${NC}"
    return 1
}

# Run main function
main "$@"
