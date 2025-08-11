@extends('vendor.installer.layouts.master')

@section('title', 'Welcome to GoERP Installation')
@section('container')
    <div class="welcome-content">
        <div class="welcome-header">
            <h2>🚀 Welcome to GoERP</h2>
            <p class="subtitle">Enterprise Resource Planning System</p>
        </div>
        
        <div class="welcome-description">
            <p>This installer will help you set up GoERP on your server. It will:</p>
            <ul class="feature-list">
                <li>✅ Check server requirements</li>
                <li>🔒 Set proper file permissions</li>
                <li>🗄️ Configure database connection</li>
                <li>🚀 Run database migrations</li>
                <li>🌱 Seed initial data</li>
            </ul>
        </div>
        
        <div class="system-info">
            <h3>System Requirements</h3>
            <ul>
                <li><strong>PHP:</strong> 8.2.0 or higher</li>
                <li><strong>Database:</strong> PostgreSQL 12+</li>
                <li><strong>Extensions:</strong> PDO, OpenSSL, cURL, GD, XML</li>
                <li><strong>Memory:</strong> 128MB minimum</li>
            </ul>
        </div>
        
        <div class="buttons">
            <a href="{{ route('LaravelInstaller::environment') }}" class="button button-primary">
                🚀 Start Installation
            </a>
        </div>
    </div>
@stop

@section('style')
<style>
.welcome-content {
    text-align: center;
    padding: 20px;
}

.welcome-header h2 {
    color: #2c3e50;
    margin-bottom: 10px;
    font-size: 2.5em;
}

.subtitle {
    color: #7f8c8d;
    font-size: 1.2em;
    margin-bottom: 30px;
}

.welcome-description {
    margin: 30px 0;
    text-align: left;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
}

.feature-list {
    list-style: none;
    padding: 0;
}

.feature-list li {
    padding: 8px 0;
    border-bottom: 1px solid #ecf0f1;
}

.system-info {
    background: #f8f9fa;
    padding: 20px;
    border-radius: 8px;
    margin: 30px 0;
    text-align: left;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
}

.system-info h3 {
    color: #2c3e50;
    margin-bottom: 15px;
}

.system-info ul {
    list-style: none;
    padding: 0;
}

.system-info li {
    padding: 5px 0;
    color: #34495e;
}

.button-primary {
    background: #3498db;
    color: white;
    padding: 15px 30px;
    font-size: 1.1em;
    border-radius: 5px;
    text-decoration: none;
    display: inline-block;
    margin-top: 20px;
    transition: background 0.3s;
}

.button-primary:hover {
    background: #2980b9;
}
</style>
@stop
