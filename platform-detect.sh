#!/bin/bash

# Cross-Platform Detection Script for Laravel Database Management
# This script detects the operating system and available commands
# Source this script in other scripts: source ./platform-detect.sh

# Detect operating system
detect_os() {
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        OS="linux"
        if [ -f /etc/os-release ]; then
            . /etc/os-release
            OS_NAME="$NAME"
            OS_VERSION="$VERSION"
        else
            OS_NAME="Linux"
            OS_VERSION="Unknown"
        fi
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        OS="macos"
        OS_NAME="macOS"
        OS_VERSION=$(sw_vers -productVersion 2>/dev/null || echo "Unknown")
    elif [[ "$OSTYPE" == "cygwin" ]] || [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
        OS="windows"
        OS_NAME="Windows"
        OS_VERSION="Unknown"
    else
        OS="unknown"
        OS_NAME="Unknown"
        OS_VERSION="Unknown"
    fi
    
    echo "Detected OS: $OS_NAME $OS_VERSION ($OS)"
}

# Check if command exists and is available
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Detect available commands
detect_commands() {
    echo "Available commands:"
    
    # File size commands
    if command_exists du; then
        echo "  ✅ du - Available for file size detection"
        SIZE_CMD="du"
    else
        echo "  ❌ du - Not available, will use ls fallback"
        SIZE_CMD="ls"
    fi
    
    # Date commands
    if command_exists stat; then
        if stat --help 2>/dev/null | grep -q "GNU coreutils"; then
            echo "  ✅ stat (GNU) - Available for file date detection"
            DATE_CMD="stat_gnu"
        else
            echo "  ✅ stat (BSD) - Available for file date detection"
            DATE_CMD="stat_bsd"
        fi
    else
        echo "  ❌ stat - Not available, will use ls fallback"
        DATE_CMD="ls"
    fi
    
    # Package managers
    if command_exists brew; then
        echo "  ✅ brew - Homebrew package manager available"
        PKG_MANAGER="brew"
    elif command_exists apt; then
        echo "  ✅ apt - APT package manager available"
        PKG_MANAGER="apt"
    elif command_exists yum; then
        echo "  ✅ yum - YUM package manager available"
        PKG_MANAGER="yum"
    elif command_exists dnf; then
        echo "  ✅ dnf - DNF package manager available"
        PKG_MANAGER="dnf"
    else
        echo "  ❌ No known package manager detected"
        PKG_MANAGER="unknown"
    fi
    
    # Service management
    if command_exists systemctl; then
        echo "  ✅ systemctl - Systemd service manager available"
        SERVICE_MANAGER="systemctl"
    elif command_exists service; then
        echo "  ✅ service - SysV init service manager available"
        SERVICE_MANAGER="service"
    elif command_exists brew; then
        echo "  ✅ brew services - Homebrew service manager available"
        SERVICE_MANAGER="brew"
    else
        echo "  ❌ No known service manager detected"
        SERVICE_MANAGER="unknown"
    fi
}

# Get file size (cross-platform)
get_file_size() {
    local file="$1"
    
    if [ "$SIZE_CMD" = "du" ]; then
        du -h "$file" | cut -f1
    else
        ls -lh "$file" | awk '{print $5}'
    fi
}

# Get directory size (cross-platform)
get_dir_size() {
    local dir="$1"
    
    if [ "$SIZE_CMD" = "du" ]; then
        du -sh "$dir" | cut -f1
    else
        ls -lah "$dir" | head -1 | awk '{print $2}'
    fi
}

# Get file date (cross-platform)
get_file_date() {
    local file="$1"
    
    case "$DATE_CMD" in
        "stat_gnu")
            stat -c "%y" "$file" 2>/dev/null | cut -d' ' -f1,2 | sed 's/\([0-9]\{4\}-[0-9]\{2\}-[0-9]\{2\}\) \([0-9]\{2\}:[0-9]\{2\}:[0-9]\{2\}\)/\1 \2/'
            ;;
        "stat_bsd")
            stat -f "%Sm" -t "%Y-%m-%d %H:%M:%S" "$file" 2>/dev/null
            ;;
        "ls")
            ls -l "$file" | awk '{print $6, $7, $8}'
            ;;
        *)
            date -r "$file" 2>/dev/null || echo "Unknown"
            ;;
    esac
}

# Check PostgreSQL status (cross-platform)
check_postgres_status() {
    case "$SERVICE_MANAGER" in
        "systemctl")
            systemctl is-active --quiet postgresql
            return $?
            ;;
        "service")
            service postgresql status | grep -q "running"
            return $?
            ;;
        "brew")
            brew services list | grep -q "postgresql.*started"
            return $?
            ;;
        *)
            echo "Cannot determine PostgreSQL status - unknown service manager"
            return 1
            ;;
    esac
}

# Start PostgreSQL (cross-platform)
start_postgresql() {
    case "$SERVICE_MANAGER" in
        "systemctl")
            sudo systemctl start postgresql
            ;;
        "service")
            sudo service postgresql start
            ;;
        "brew")
            brew services start postgresql
            ;;
        *)
            echo "Cannot start PostgreSQL - unknown service manager"
            return 1
            ;;
    esac
}

# Get installation instructions for PostgreSQL client
get_postgres_install_instructions() {
    case "$PKG_MANAGER" in
        "brew")
            echo "On macOS: brew install postgresql"
            ;;
        "apt")
            echo "On Ubuntu/Debian: sudo apt-get install postgresql-client postgresql-client-common"
            ;;
        "yum")
            echo "On CentOS/RHEL: sudo yum install postgresql"
            ;;
        "dnf")
            echo "On Fedora: sudo dnf install postgresql"
            ;;
        *)
            echo "Please install PostgreSQL client tools for your system"
            ;;
    esac
}

# Main detection function
detect_platform() {
    echo "🔍 Detecting platform and available tools..."
    echo ""
    
    detect_os
    echo ""
    detect_commands
    echo ""
    
    echo "Platform detection complete!"
    echo "Use the functions: get_file_size, get_dir_size, get_file_date, check_postgres_status, start_postgresql"
}

# Export functions for use in other scripts
export -f detect_os
export -f detect_commands
export -f command_exists
export -f get_file_size
export -f get_dir_size
export -f get_file_date
export -f check_postgres_status
export -f start_postgresql
export -f get_postgres_install_instructions
export -f detect_platform

# If script is run directly, show detection
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    detect_platform
fi
