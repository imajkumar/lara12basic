@extends('beautymail::templates.widgets')

@section('content')
    @include('beautymail::templates.widgets.articleStart')

        <h4 class="secondary"><strong>Welcome to {{$company_name}}!</strong></h4>
        <p>Hello {{$user_name}},</p>
        <p>We're thrilled to have you on board! Your account has been successfully created and you can now access all the features of our ERP system.</p>
        <p>Here are some quick links to get you started:</p>
        <ul>
            <li><strong>Dashboard:</strong> <a href="{{$login_url}}">Access your dashboard</a></li>
            <li><strong>Profile:</strong> Complete your profile information</li>
            <li><strong>Support:</strong> Contact our support team if you need help</li>
        </ul>
        <p>If you have any questions, feel free to reach out to our support team.</p>
        <p>Best regards,<br>The {{$company_name}} Team</p>

    @include('beautymail::templates.widgets.articleEnd')
@stop
