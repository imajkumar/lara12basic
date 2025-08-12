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
import { useState, useEffect } from 'react';

interface TemplateType {
    [key: string]: string;
}

interface Category {
    [key: string]: string;
}

interface EmailTemplate {
    id: number;
    name: string;
    subject: string;
    template_type: string;
    content: string;
    variables: string[];
    category: string;
    is_active: boolean;
    from_email: string | null;
    from_name: string | null;
    settings: Record<string, any>;
}

interface Props {
    template: EmailTemplate;
    templateTypes: TemplateType;
    categories: Category;
}

export default function EditEmailTemplate({ template, templateTypes, categories }: Props) {
    const [selectedTemplateType, setSelectedTemplateType] = useState(template.template_type);
    const [previewMode, setPreviewMode] = useState(false);

    const { data, setData, put, processing, errors, reset } = useForm({
        name: template.name,
        subject: template.subject,
        template_type: template.template_type,
        content: template.content,
        variables: template.variables || [],
        category: template.category,
        is_active: template.is_active,
        from_email: template.from_email || '',
        from_name: template.from_name || '',
        settings: template.settings || {},
    });

    // Update form data when template changes
    useEffect(() => {
        setData({
            name: template.name,
            subject: template.subject,
            template_type: template.template_type,
            content: template.content,
            variables: template.variables || [],
            category: template.category,
            is_active: template.is_active,
            from_email: template.from_email || '',
            from_name: template.from_name || '',
            settings: template.settings || {},
        });
        setSelectedTemplateType(template.template_type);
    }, [template, setData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/email-templates/${template.id}`, {
            onSuccess: () => {
                // Don't reset the form on success for edit mode
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
            <Head title={`Edit Email Template - ${template.name}`} />
            
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
                            <Heading title={`Edit Template: ${template.name}`} />
                            <p className="text-muted-foreground">
                                Update your email template content and settings
                            </p>
                        </div>
                    </div>
                    <Button 
                        onClick={handleSubmit} 
                        disabled={processing}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                        <Save className="mr-2 h-4 w-4" />
                        {processing ? 'Updating...' : 'Update Template'}
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Template Information Card */}
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
                            {/* Template Name */}
                            <div className="space-y-2">
                                <Label htmlFor="name">Template Name *</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="e.g., Welcome Email, Password Reset"
                                    className={errors.name ? 'border-red-500' : ''}
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-500">{errors.name}</p>
                                )}
                            </div>

                            {/* Subject Line */}
                            <div className="space-y-2">
                                <Label htmlFor="subject">Subject Line *</Label>
                                <Input
                                    id="subject"
                                    value={data.subject}
                                    onChange={(e) => setData('subject', e.target.value)}
                                    placeholder="e.g., Welcome to GoERP!"
                                    className={errors.subject ? 'border-red-500' : ''}
                                />
                                {errors.subject && (
                                    <p className="text-sm text-red-500">{errors.subject}</p>
                                )}
                            </div>

                            {/* Template Type */}
                            <div className="space-y-2">
                                <Label htmlFor="template_type">Template Type *</Label>
                                <Select 
                                    value={data.template_type} 
                                    onValueChange={(value) => {
                                        setData('template_type', value);
                                        setSelectedTemplateType(value);
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select template type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(templateTypes).map(([key, label]) => (
                                            <SelectItem key={key} value={key}>
                                                {label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.template_type && (
                                    <p className="text-sm text-red-500">{errors.template_type}</p>
                                )}
                            </div>

                            {/* Category */}
                            <div className="space-y-2">
                                <Label htmlFor="category">Category *</Label>
                                <Select 
                                    value={data.category} 
                                    onValueChange={(value) => setData('category', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(categories).map(([key, label]) => (
                                            <SelectItem key={key} value={key}>
                                                {label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.category && (
                                    <p className="text-sm text-red-500">{errors.category}</p>
                                )}
                            </div>

                            {/* From Email */}
                            <div className="space-y-2">
                                <Label htmlFor="from_email">From Email</Label>
                                <Input
                                    id="from_email"
                                    type="email"
                                    value={data.from_email}
                                    onChange={(e) => setData('from_email', e.target.value)}
                                    placeholder="noreply@goerp.com"
                                />
                            </div>

                            {/* From Name */}
                            <div className="space-y-2">
                                <Label htmlFor="from_name">From Name</Label>
                                <Input
                                    id="from_name"
                                    value={data.from_name}
                                    onChange={(e) => setData('from_name', e.target.value)}
                                    placeholder="GoERP Team"
                                />
                            </div>

                            {/* Active Status */}
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

                    {/* Variables Section Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Code className="mr-2 h-5 w-4" />
                                Available Variables
                            </CardTitle>
                            <CardDescription>
                                Click on variables to add them to your template
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="text-sm text-muted-foreground mb-3">
                                    Use these variables in your content with {{variable_name}} syntax
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {getVariablesList().map((variable) => (
                                        <Badge
                                            key={variable}
                                            variant="outline"
                                            className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                                            onClick={() => addVariable(variable)}
                                        >
                                            {variable}
                                        </Badge>
                                    ))}
                                </div>
                                
                                {(data.variables && data.variables.length > 0) && (
                                    <div className="mt-4">
                                        <Label className="text-sm font-medium">Selected Variables:</Label>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {data.variables.map((variable) => (
                                                <Badge
                                                    key={variable}
                                                    variant="secondary"
                                                    className="bg-blue-100 text-blue-800"
                                                >
                                                    {variable}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Template Content Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <div className="flex items-center">
                                <Palette className="mr-2 h-5 w-5" />
                                Template Content
                            </div>
                            <div className="flex items-center space-x-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPreviewMode(!previewMode)}
                                >
                                    {previewMode ? <Code className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
                                    {previewMode ? 'Edit Mode' : 'Preview Mode'}
                                </Button>
                            </div>
                        </CardTitle>
                        <CardDescription>
                            Write your email content using HTML and variables
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {previewMode ? (
                            <div className="space-y-4">
                                <div className="p-4 bg-gray-50 rounded-lg border">
                                    <h4 className="font-medium mb-2">Template Preview:</h4>
                                    <pre className="text-sm text-gray-600 whitespace-pre-wrap">{getTemplatePreview()}</pre>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg border">
                                    <h4 className="font-medium mb-2">Content Preview:</h4>
                                    <div 
                                        className="prose max-w-none"
                                        dangerouslySetInnerHTML={{ __html: data.content }}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <Textarea
                                    value={data.content}
                                    onChange={(e) => setData('content', e.target.value)}
                                    placeholder="<h1>Welcome to GoERP!</h1><p>Hello {{user_name}},</p><p>Thank you for joining us...</p>"
                                    rows={15}
                                    className={errors.content ? 'border-red-500' : ''}
                                />
                                {errors.content && (
                                    <p className="text-sm text-red-500">{errors.content}</p>
                                )}
                                
                                <div className="text-sm text-muted-foreground">
                                    <p><strong>Tips:</strong></p>
                                    <ul className="list-disc list-inside space-y-1 mt-2">
                                        <li>Use HTML tags for formatting</li>
                                        <li>Insert variables with {{variable_name}} syntax</li>
                                        <li>Test your template before sending</li>
                                        <li>Keep content concise and engaging</li>
                                    </ul>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Template Examples Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Mail className="mr-2 h-5 w-4" />
                            Template Examples
                        </CardTitle>
                        <CardDescription>
                            Common email template patterns and examples
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <h4 className="font-medium text-blue-900 mb-2">Welcome Email</h4>
                                <div className="text-sm text-blue-700 space-y-1">
                                    <p>&lt;h1&gt;Welcome {{user_name}}!&lt;/h1&gt;</p>
                                    <p>&lt;p&gt;Thank you for joining {{company_name}}&lt;/p&gt;</p>
                                    <p>&lt;a href="{{login_url}}"&gt;Get Started&lt;/a&gt;</p>
                                </div>
                            </div>
                            
                            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                <h4 className="font-medium text-green-900 mb-2">Password Reset</h4>
                                <div className="text-sm text-green-700 space-y-1">
                                    <p>&lt;h2&gt;Reset Your Password&lt;/h2&gt;</p>
                                    <p>&lt;p&gt;Click the link below to reset:&lt;/p&gt;</p>
                                    <p>&lt;a href="{{reset_url}}"&gt;Reset Password&lt;/a&gt;</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
