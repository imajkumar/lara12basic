import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
    Mail, 
    Plus, 
    Eye, 
    Edit, 
    Trash2, 
    Send,
    CheckCircle,
    XCircle
} from 'lucide-react';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

interface EmailTemplate {
    id: number;
    name: string;
    subject: string;
    template_type: string;
    category: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

interface Props {
    templates: EmailTemplate[];
}

export default function EmailTemplatesIndex({ templates }: Props) {
    const getTemplateTypeColor = (type: string) => {
        const colors: { [key: string]: string } = {
            'widgets': 'bg-blue-100 text-blue-800',
            'minty': 'bg-green-100 text-green-800',
            'sunny': 'bg-yellow-100 text-yellow-800',
            'ark': 'bg-purple-100 text-purple-800',
        };
        return colors[type] || 'bg-gray-100 text-gray-800';
    };

    const getCategoryColor = (category: string) => {
        const colors: { [key: string]: string } = {
            'welcome': 'bg-green-100 text-green-800',
            'notification': 'bg-blue-100 text-blue-800',
            'invoice': 'bg-purple-100 text-purple-800',
            'password': 'bg-orange-100 text-orange-800',
            'verification': 'bg-indigo-100 text-indigo-800',
            'general': 'bg-gray-100 text-gray-800',
        };
        return colors[category] || 'bg-gray-100 text-gray-800';
    };

    return (
        <AppLayout>
            <Head title="Email Templates" />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <Heading title="Email Templates" />
                        <p className="text-muted-foreground">
                            Manage beautiful email templates for your ERP system
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/email-templates/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Create Template
                        </Link>
                    </Button>
                </div>

                {/* Templates Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {templates.map((template) => (
                        <Card key={template.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Mail className="h-5 w-5 text-primary" />
                                        <div>
                                            <CardTitle className="text-lg">{template.name}</CardTitle>
                                            <CardDescription className="text-sm">
                                                {template.subject}
                                            </CardDescription>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        {template.is_active ? (
                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                        ) : (
                                            <XCircle className="h-4 w-4 text-red-500" />
                                        )}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {/* Template Type */}
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm font-medium text-muted-foreground">Type:</span>
                                        <Badge className={getTemplateTypeColor(template.template_type)}>
                                            {template.template_type}
                                        </Badge>
                                    </div>

                                    {/* Category */}
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm font-medium text-muted-foreground">Category:</span>
                                        <Badge className={getCategoryColor(template.category)}>
                                            {template.category}
                                        </Badge>
                                    </div>

                                    {/* Status */}
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm font-medium text-muted-foreground">Status:</span>
                                        <Badge variant={template.is_active ? 'default' : 'secondary'}>
                                            {template.is_active ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </div>

                                    {/* Last Updated */}
                                    <div className="text-sm text-muted-foreground">
                                        Updated: {new Date(template.updated_at).toLocaleDateString()}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center space-x-2 pt-3">
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={`/email-templates/${template.id}`}>
                                                <Eye className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={`/email-templates/${template.id}/edit`}>
                                                <Edit className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={`/email-templates/${template.id}/test`}>
                                                <Send className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        <ConfirmDialog
                                            title="Delete Template"
                                            description={`Are you sure you want to delete "${template.name}"? This action cannot be undone.`}
                                            confirmText="Delete Template"
                                            onConfirm={() => {
                                                // Handle delete
                                                console.log('Delete template:', template.id);
                                            }}
                                        >
                                            <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </ConfirmDialog>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Empty State */}
                {templates.length === 0 && (
                    <Card>
                        <CardContent className="text-center py-12">
                            <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No email templates yet</h3>
                            <p className="text-muted-foreground mb-4">
                                Create your first email template to start sending beautiful emails
                            </p>
                            <Button asChild>
                                <Link href="/email-templates/create">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create Your First Template
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
