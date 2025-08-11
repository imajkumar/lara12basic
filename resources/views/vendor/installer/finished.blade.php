@extends('vendor.installer.layouts.master')

@section('title', '🎉 GoERP Installation Complete!')
@section('container')
    <div class="finished-content">
        <div class="success-icon">
            <span style="font-size: 4em;">✅</span>
        </div>
        
        <h2>Installation Successful!</h2>
        <p class="success-message">{{ session('message')['message'] }}</p>
        
        <div class="next-steps">
            <h3>🚀 Next Steps</h3>
            <ul>
                <li>🔐 <strong>Login:</strong> Use the default admin credentials</li>
                <li>⚙️ <strong>Configure:</strong> Set up your company settings</li>
                <li>👥 <strong>Users:</strong> Add your team members</li>
                <li>📊 <strong>Data:</strong> Import your business data</li>
            </ul>
        </div>
        
        <div class="admin-info">
            <h3>👑 Default Admin Account</h3>
            <p><strong>Email:</strong> admin@goerp.com</p>
            <p><strong>Password:</strong> password</p>
            <p class="warning">⚠️ Please change these credentials after first login!</p>
        </div>
        
        <div class="buttons">
            <a href="{{ url('/') }}" class="button button-success">
                🚀 Launch GoERP
            </a>
        </div>
        
        <div class="support-info">
            <p>Need help? Check our <a href="#" target="_blank">documentation</a> or contact support.</p>
        </div>
    </div>
@stop

@section('style')
<style>
.finished-content {
    text-align: center;
    padding: 20px;
}

.success-icon {
    margin: 20px 0;
}

.finished-content h2 {
    color: #27ae60;
    margin-bottom: 20px;
    font-size: 2em;
}

.success-message {
    color: #2c3e50;
    font-size: 1.1em;
    margin-bottom: 30px;
    padding: 15px;
    background: #d5f4e6;
    border-radius: 5px;
}

.next-steps {
    background: #f8f9fa;
    padding: 20px;
    border-radius: 8px;
    margin: 30px 0;
    text-align: left;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
}

.next-steps h3 {
    color: #2c3e50;
    margin-bottom: 15px;
    text-align: center;
}

.next-steps ul {
    list-style: none;
    padding: 0;
}

.next-steps li {
    padding: 8px 0;
    border-bottom: 1px solid #ecf0f1;
}

.admin-info {
    background: #fff3cd;
    padding: 20px;
    border-radius: 8px;
    margin: 30px 0;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
}

.admin-info h3 {
    color: #856404;
    margin-bottom: 15px;
}

.warning {
    color: #dc3545;
    font-weight: bold;
    margin-top: 15px;
}

.button-success {
    background: #27ae60;
    color: white;
    padding: 15px 30px;
    font-size: 1.1em;
    border-radius: 5px;
    text-decoration: none;
    display: inline-block;
    margin-top: 20px;
    transition: background 0.3s;
}

.button-success:hover {
    background: #229954;
}

.support-info {
    margin-top: 30px;
    color: #7f8c8d;
}

.support-info a {
    color: #3498db;
    text-decoration: none;
}
</style>
@stop
