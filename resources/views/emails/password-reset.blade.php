@extends('beautymail::templates.minty')

@section('content')
    @include('beautymail::templates.minty.contentStart')
        <tr>
            <td class="title">Password Reset Request</td>
        </tr>
        <tr>
            <td width="100%" height="10"></td>
        </tr>
        <tr>
            <td class="paragraph">
                Hello {{$user_name}},
            </td>
        </tr>
        <tr>
            <td width="100%" height="10"></td>
        </tr>
        <tr>
            <td class="paragraph">
                We received a request to reset your password for your {{$company_name}} account.
            </td>
        </tr>
        <tr>
            <td width="100%" height="25"></td>
        </tr>
        <tr>
            <td>
                @include('beautymail::templates.minty.button', ['text' => 'Reset Password', 'link' => $reset_url])
            </td>
        </tr>
        <tr>
            <td width="100%" height="25"></td>
        </tr>
        <tr>
            <td class="paragraph">
                This link will expire in {{$expires_in}} minutes. If you didn't request this password reset, please ignore this email.
            </td>
        </tr>
        <tr>
            <td width="100%" height="25"></td>
        </tr>
        <tr>
            <td class="paragraph">
                Best regards,<br>The {{$company_name}} Team
            </td>
        </tr>
    @include('beautymail::templates.minty.contentEnd')
@stop
