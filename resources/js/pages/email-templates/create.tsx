import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
    Mail, 
    Save, 
    ArrowLeft,
    Eye,
    Code,
    Palette
} from 'lucide-react';
import { useState } from 'react';

interface TemplateType {
    [key: string]: string;
}

interface Category {
    [key: string]: string;
}

interface Props {
    templateTypes: TemplateType;
    categories: Category;
}

export default function CreateEmailTemplate({ templateTypes, categories }: Props) {
    const [selectedTemplateType, setSelectedTemplateType] = useState('widgets');
    const [previewMode, setPreviewMode] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        subject: '',
        template_type: 'widgets',
        content: '',
        variables: [] as string[],
        category: 'general',
        is_active: true,
        from_email: '',
        from_name: '',
        settings: {} as Record<string, any>,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/email-templates', {
            onSuccess: () => {
                reset();
            }
        });
    };

    const getTemplatePreview = () => {
        const baseTemplate = `@extends('beautymail::templates.${selectedTemplateType}')

@section('content')
${data.content}
@stop`;

        return baseTemplate;
    };

    const getVariablesList = () => {
        const commonVariables = [
            'user_name', 'user_email', 'company_name', 'login_url', 'reset_url',
            'notification_title', 'notification_message', 'invoice_number', 'amount',
            'expires_in', 'verification_url', 'current_date', 'current_time'
        ];
        return commonVariables;
    };

    const addVariable = (variable: string) => {
        const currentVariables = data.variables || [];
        if (!currentVariables.includes(variable)) {
            setData('variables', [...currentVariables, variable]);
        }
    };

    return (
        <AppLayout>
            <Head title="Create Email Template" />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="sm" asChild>
                            <a href="/email-templates">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Templates
                            </a>
                        </Button>
                        <div>
                            <Heading title="Create Email Template" />
                            <p className="text-muted-foreground">
                                Design beautiful email templates with dynamic content
                            </p>
                        </div>
                    </div>
                    <div className="flex space-x-3">
                        <Button
                            variant="outline"
                            onClick={() => setPreviewMode(!previewMode)}
                        >
                            {previewMode ? <Code className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
                            {previewMode ? 'Edit Mode' : 'Preview Mode'}
                        </Button>
                        <Button onClick={handleSubmit} disabled={processing}>
                            <Save className="mr-2 h-4 w-4" />
                            {processing ? 'Creating...' : 'Create Template'}
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Template Form */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Mail className="mr-2 h-5 w-5" />
                                    Template Information
                                </CardTitle>
                                <CardDescription>
                                    Basic template details and configuration
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="name">Template Name *</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="e.g., Welcome Email, Password Reset"
                                        className={errors.name ? 'border-red-500' : ''}
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="subject">Email Subject *</Label>
                                    <Input
                                        id="subject"
                                        value={data.subject}
                                        onChange={(e) => setData('subject', e.target.value)}
                                        placeholder="e.g., Welcome to {{company_name}}"
                                        className={errors.subject ? 'border-red-500' : ''}
                                    />
                                    {errors.subject && (
                                        <p className="text-sm text-red-500 mt-1">{errors.subject}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="template_type">Template Type *</Label>
                                        <Select
                                            value={data.template_type}
                                            onValueChange={(value) => {
                                                setData('template_type', value);
                                                setSelectedTemplateType(value);
                                            }}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Object.entries(templateTypes).map(([key, value]) => (
                                                    <SelectItem key={key} value={key}>
                                                        {value}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label htmlFor="category">Category *</Label>
                                        <Select
                                            value={data.category}
                                            onValueChange={(value) => setData('category', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Object.entries(categories).map(([key, value]) => (
                                                    <SelectItem key={key} value={key}>
                                                        {value}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="from_email">From Email</Label>
                                        <Input
                                            id="from_email"
                                            value={data.from_email}
                                            onChange={(e) => setData('from_email', e.target.value)}
                                            placeholder="noreply@company.com"
                                            type="email"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="from_name">From Name</Label>
                                        <Input
                                            id="from_name"
                                            value={data.from_name}
                                            onChange={(e) => setData('from_name', e.target.value)}
                                            placeholder="Company Name"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="is_active"
                                        checked={data.is_active}
                                        onCheckedChange={(checked) => setData('is_active', checked as boolean)}
                                    />
                                    <Label htmlFor="is_active">Template is active</Label>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Variables Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Code className="mr-2 h-5 w-5" />
                                    Available Variables
                                </CardTitle>
                                <CardDescription>
                                    Click to add variables to your template content
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {getVariablesList().map((variable) => (
                                        <Badge
                                            key={variable}
                                            variant="outline"
                                            className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                                            onClick={() => addVariable(variable)}
                                        >
                                            {`{{${variable}}}`}
                                        </Badge>
                                    ))}
                                </div>
                                <div className="mt-3">
                                    <Label>Selected Variables:</Label>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {(data.variables && data.variables.length > 0) && data.variables.map((variable, index) => (
                                            <Badge
                                                key={index}
                                                variant="secondary"
                                                className="cursor-pointer"
                                                onClick={() => {
                                                    const currentVariables = data.variables || [];
                                                    setData('variables', currentVariables.filter((_, i) => i !== index));
                                                }}
                                            >
                                                {`{{${variable}}}`} ×
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Template Content */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Palette className="mr-2 h-5 w-5" />
                                    Template Content
                                </CardTitle>
                                <CardDescription>
                                    {previewMode ? 'Preview of your template' : 'Write your email template content'}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {previewMode ? (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                                            {getTemplatePreview()}
                                        </pre>
                                    </div>
                                ) : (
                                    <div>
                                        <Label htmlFor="content">Template Content *</Label>
                                        <Textarea
                                            id="content"
                                            value={data.content}
                                            onChange={(e) => setData('content', e.target.value)}
                                            placeholder={`@include('beautymail::templates.${selectedTemplateType}.articleStart')

    <h4 class="secondary"><strong>Hello {{user_name}}</strong></h4>
    <p>Welcome to {{company_name}}!</p>

@include('beautymail::templates.${selectedTemplateType}.articleEnd')`}
                                            rows={15}
                                            className={errors.content ? 'border-red-500' : ''}
                                        />
                                        {errors.content && (
                                            <p className="text-sm text-red-500 mt-1">{errors.content}</p>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Template Examples */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Template Examples</CardTitle>
                                <CardDescription>
                                    Examples for different template types
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div>
                                        <Label className="text-sm font-medium">Widgets Template:</Label>
                                        <div className="bg-gray-50 p-3 rounded text-sm mt-1">
                                            <code>
                                                @include('beautymail::templates.widgets.articleStart')<br/>
                                                &nbsp;&nbsp;&lt;h4&gt;Hello {{user_name}}&lt;/h4&gt;<br/>
                                                &nbsp;&nbsp;&lt;p&gt;Welcome!&lt;/p&gt;<br/>
                                                @include('beautymail::templates.widgets.articleEnd')
                                            </code>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <Label className="text-sm font-medium">Minty Template:</Label>
                                        <div className="bg-gray-50 p-3 rounded text-sm mt-1">
                                            <code>
                                                @include('beautymail::templates.minty.contentStart')<br/>
                                                &nbsp;&nbsp;&lt;td class="title"&gt;Hello {{user_name}}&lt;/td&gt;<br/>
                                                @include('beautymail::templates.minty.contentEnd')
                                            </code>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
