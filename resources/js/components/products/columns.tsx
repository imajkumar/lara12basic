import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Eye, Edit, Trash2, Package, TrendingUp, TrendingDown } from "lucide-react"
import { Link } from "@inertiajs/react"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export interface Product {
  id: number
  name: string
  description: string | null
  price: number
  stock: number
  sku: string
  category: string | null
  brand: string | null
  image: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: "Product",
    enableSorting: true,
    enableColumnFilter: true,
    cell: ({ row }) => {
      const product = row.original
      return (
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Package className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="font-medium">{product.name}</div>
            <div className="text-sm text-muted-foreground">{product.sku}</div>
            {product.description && (
              <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                {product.description}
              </div>
            )}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    enableSorting: true,
    enableColumnFilter: true,
    cell: ({ row }) => {
      const category = row.getValue("category") as string
      return category ? (
        <Badge variant="outline">{category}</Badge>
      ) : (
        <span className="text-muted-foreground">-</span>
      )
    },
  },
  {
    accessorKey: "brand",
    header: "Brand",
    enableSorting: true,
    enableColumnFilter: true,
    cell: ({ row }) => {
      const brand = row.getValue("brand") as string
      return brand ? (
        <Badge variant="secondary">{brand}</Badge>
      ) : (
        <span className="text-muted-foreground">-</span>
      )
    },
  },
  {
    accessorKey: "price",
    header: "Price",
    enableSorting: true,
    enableColumnFilter: true,
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(price)
      return <span className="font-medium">{formatted}</span>
    },
  },
  {
    accessorKey: "stock",
    header: "Stock",
    enableSorting: true,
    enableColumnFilter: true,
    cell: ({ row }) => {
      const stock = row.getValue("stock") as number
      const getStockBadgeVariant = (stock: number) => {
        if (stock === 0) return 'destructive'
        if (stock < 10) return 'secondary'
        if (stock < 50) return 'default'
        return 'default'
      }
      
      const getStockIcon = (stock: number) => {
        if (stock === 0) return null
        if (stock < 10) return <TrendingDown className="h-3 w-3 text-orange-500" />
        if (stock > 100) return <TrendingUp className="h-3 w-3 text-green-500" />
        return null
      }
      
      return (
        <div className="flex items-center space-x-2">
          <Badge variant={getStockBadgeVariant(stock)}>
            {stock} units
          </Badge>
          {getStockIcon(stock)}
        </div>
      )
    },
  },
  {
    accessorKey: "is_active",
    header: "Status",
    enableSorting: true,
    enableColumnFilter: true,
    cell: ({ row }) => {
      const isActive = row.getValue("is_active") as boolean
      return (
        <Badge variant={isActive ? 'default' : 'secondary'}>
          {isActive ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
  },
  {
    accessorKey: "created_at",
    header: "Created",
    enableSorting: true,
    enableColumnFilter: false,
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at"))
      return (
        <div className="text-sm">
          <div>{date.toLocaleDateString()}</div>
          <div className="text-xs text-muted-foreground">
            {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      )
    },
  },
  {
    id: "actions",
    header: "Actions",
    enableSorting: false,
    enableColumnFilter: false,
    cell: ({ row }) => {
      const product = row.original

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
              <Link href={`/products/${product.id}`} className="flex items-center">
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/products/${product.id}/edit`} className="flex items-center">
                <Edit className="mr-2 h-4 w-4" />
                Edit Product
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <ConfirmDialog
                title="Delete Product"
                description={`Are you sure you want to delete "${product.name}"? This action cannot be undone.`}
                confirmText="Delete Product"
                onConfirm={() => {
                  // This would need to be handled by the parent component
                  // For now, we'll just show the confirmation
                  console.log('Delete product:', product.id);
                }}
              >
                <div className="flex items-center text-destructive cursor-pointer">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Product
                </div>
              </ConfirmDialog>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
