@extends('beautymail::templates.ark')

@section('content')
    @include('beautymail::templates.ark.heading', [
        'heading' => $notification_title,
        'level' => 'h1'
    ])

    @include('beautymail::templates.ark.contentStart')
        <h4 class="secondary"><strong>Hello {{$user_name}}</strong></h4>
        <p>{{$notification_message}}</p>
        
        @if(isset($additional_info))
            <div class="info-box">
                <h5>Additional Information:</h5>
                <p>{{$additional_info}}</p>
            </div>
        @endif
    @include('beautymail::templates.ark.contentEnd')

    @include('beautymail::templates.ark.heading', [
        'heading' => 'Need Help?',
        'level' => 'h2'
    ])

    @include('beautymail::templates.ark.contentStart')
        <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
        <p>Best regards,<br>The {{$company_name}} Team</p>
    @include('beautymail::templates.ark.contentEnd')
@stop
