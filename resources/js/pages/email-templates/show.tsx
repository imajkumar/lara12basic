import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
    Mail, 
    Edit, 
    Trash2, 
    ArrowLeft,
    Send,
    Eye,
    Code,
    Calendar,
    User,
    Palette
} from 'lucide-react';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { useState } from 'react';
import { Label } from '@/components/ui/label';

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
    created_at: string;
    updated_at: string;
}

interface Props {
    template: EmailTemplate;
}

export default function ShowEmailTemplate({ template }: Props) {
    const [previewMode, setPreviewMode] = useState(false);
    const [deleteProcessing, setDeleteProcessing] = useState(false);
    const [testProcessing, setTestProcessing] = useState(false);

    const handleDelete = () => {
        setDeleteProcessing(true);
        // This would need to be implemented with Inertia delete
        console.log('Delete template:', template.id);
        setDeleteProcessing(false);
    };

    const handleSendTest = () => {
        setTestProcessing(true);
        // This would need to be implemented with Inertia post
        console.log('Send test email for template:', template.id);
        setTestProcessing(false);
    };

    const getTemplatePreview = () => {
        return `@extends('beautymail::templates.${template.template_type}')

@section('content')
${template.content}
@stop`;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getTemplateTypeLabel = (type: string) => {
        const types: Record<string, string> = {
            'widgets': 'Widgets (Campaign Monitor)',
            'minty': 'Minty (Stamplia)',
            'sunny': 'Sunny',
            'ark': 'Ark'
        };
        return types[type] || type;
    };

    const getCategoryLabel = (category: string) => {
        const categories: Record<string, string> = {
            'general': 'General',
            'welcome': 'Welcome',
            'notification': 'Notification',
            'invoice': 'Invoice',
            'password': 'Password Reset',
            'verification': 'Email Verification'
        };
        return categories[category] || category;
    };

    return (
        <AppLayout>
            <Head title={`Email Template - ${template.name}`} />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/email-templates">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Templates
                            </Link>
                        </Button>
                        <div>
                            <Heading title={template.name} />
                            <p className="text-muted-foreground">
                                {template.subject}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setPreviewMode(!previewMode)}
                        >
                            {previewMode ? <Code className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
                            {previewMode ? 'Code View' : 'Preview'}
                        </Button>
                        <Button 
                            variant="outline" 
                            size="sm"
                            onClick={handleSendTest}
                            disabled={testProcessing}
                        >
                            <Send className="mr-2 h-4 w-4" />
                            {testProcessing ? 'Sending...' : 'Send Test'}
                        </Button>
                        <Button asChild>
                            <Link href={`/email-templates/${template.id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Template
                            </Link>
                        </Button>
                        <ConfirmDialog
                            title="Delete Template"
                            description={`Are you sure you want to delete "${template.name}"? This action cannot be undone.`}
                            confirmText="Delete Template"
                            onConfirm={handleDelete}
                        >
                            <Button 
                                variant="outline" 
                                size="sm"
                                className="text-destructive hover:text-destructive"
                                disabled={deleteProcessing}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                {deleteProcessing ? 'Deleting...' : 'Delete'}
                            </Button>
                        </ConfirmDialog>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Template Information */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Basic Info Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Mail className="mr-2 h-5 w-4" />
                                    Template Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                                    <Badge variant={template.is_active ? "default" : "secondary"}>
                                        {template.is_active ? "Active" : "Inactive"}
                                    </Badge>
                                </div>
                                
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-muted-foreground">Template Type</Label>
                                    <div className="text-sm">{getTemplateTypeLabel(template.template_type)}</div>
                                </div>
                                
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-muted-foreground">Category</Label>
                                    <Badge variant="outline">{getCategoryLabel(template.category)}</Badge>
                                </div>
                                
                                {template.from_email && (
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-muted-foreground">From Email</Label>
                                        <div className="text-sm">{template.from_email}</div>
                                    </div>
                                )}
                                
                                {template.from_name && (
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-muted-foreground">From Name</Label>
                                        <div className="text-sm">{template.from_name}</div>
                                    </div>
                                )}
                                
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-muted-foreground">Created</Label>
                                    <div className="text-sm flex items-center">
                                        <Calendar className="mr-2 h-4 w-4" />
                                        {formatDate(template.created_at)}
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-muted-foreground">Last Updated</Label>
                                    <div className="text-sm flex items-center">
                                        <Calendar className="mr-2 h-4 w-4" />
                                        {formatDate(template.updated_at)}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Variables Card */}
                        {template.variables && template.variables.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <Code className="mr-2 h-5 w-4" />
                                        Template Variables
                                    </CardTitle>
                                    <CardDescription>
                                        Variables used in this template
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        {template.variables.map((variable) => (
                                            <Badge key={variable} variant="secondary">
                                                {variable}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Template Content */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <Palette className="mr-2 h-5 w-4" />
                                        Template Content
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Badge variant="outline">
                                            {template.variables?.length || 0} variables
                                        </Badge>
                                    </div>
                                </CardTitle>
                                <CardDescription>
                                    {previewMode ? 'Blade template code' : 'Rendered preview'}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {previewMode ? (
                                    <div className="space-y-4">
                                        <div className="p-4 bg-gray-50 rounded-lg border">
                                            <h4 className="font-medium mb-2">Blade Template:</h4>
                                            <pre className="text-sm text-gray-600 whitespace-pre-wrap font-mono">
                                                {getTemplatePreview()}
                                            </pre>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="p-4 bg-gray-50 rounded-lg border">
                                            <h4 className="font-medium mb-2">Content Preview:</h4>
                                            <div 
                                                className="prose max-w-none"
                                                dangerouslySetInnerHTML={{ __html: template.content }}
                                            />
                                        </div>
                                        
                                        <div className="text-sm text-muted-foreground">
                                            <p><strong>Note:</strong> This is a preview of how the email will look. 
                                            Variables like {{user_name}} will be replaced with actual values when sent.</p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
