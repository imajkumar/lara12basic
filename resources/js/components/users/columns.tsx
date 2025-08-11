import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react"
import { Link } from "@inertiajs/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export interface User {
  id: number
  name: string
  email: string
  role: string
  status: 'active' | 'inactive' | 'suspended'
  avatar?: string | null
  created_at: string
  last_login: string
  phone?: string
  department?: string
  position?: string
}

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "User",
    cell: ({ row }) => {
      const user = row.original
      return (
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatar || undefined} />
            <AvatarFallback className="bg-primary/10 text-primary font-medium">
              {user.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{user.name}</div>
            <div className="text-sm text-muted-foreground">{user.email}</div>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role") as string
      const getRoleBadgeVariant = (role: string) => {
        switch (role) {
          case 'Super Admin':
            return 'destructive'
          case 'Admin':
            return 'default'
          case 'Manager':
            return 'default'
          case 'User':
            return 'secondary'
          default:
            return 'outline'
        }
      }
      return (
        <Badge variant={getRoleBadgeVariant(role)}>
          {role}
        </Badge>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      const getStatusBadgeVariant = (status: string) => {
        switch (status) {
          case 'active':
            return 'default'
          case 'inactive':
            return 'secondary'
          case 'suspended':
            return 'destructive'
          default:
            return 'outline'
        }
      }
      return (
        <Badge variant={getStatusBadgeVariant(status)}>
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: "department",
    header: "Department",
    cell: ({ row }) => {
      const department = row.getValue("department") as string
      return department || <span className="text-muted-foreground">-</span>
    },
  },
  {
    accessorKey: "position",
    header: "Position",
    cell: ({ row }) => {
      const position = row.getValue("position") as string
      return position || <span className="text-muted-foreground">-</span>
    },
  },
  {
    accessorKey: "created_at",
    header: "Created",
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at"))
      return (
        <div className="text-sm">
          {date.toLocaleDateString()}
        </div>
      )
    },
  },
  {
    accessorKey: "last_login",
    header: "Last Login",
    cell: ({ row }) => {
      const lastLogin = row.getValue("last_login") as string
      if (!lastLogin || lastLogin === 'Never') {
        return <span className="text-muted-foreground">Never</span>
      }
      const date = new Date(lastLogin)
      return (
        <div className="text-sm">
          {date.toLocaleDateString()}
          <div className="text-xs text-muted-foreground">
            {date.toLocaleTimeString()}
          </div>
        </div>
      )
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const user = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/users/${user.id}`} className="flex items-center">
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/users/${user.id}/edit`} className="flex items-center">
                <Edit className="mr-2 h-4 w-4" />
                Edit User
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete User
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
