import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Pencil, Trash2, Star, Search } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { AdminStatusBadge } from "../shared/AdminStatusBadge";

export function BooksTable({
  books,
  selectedBooks,
  onSelectAll,
  onSelectBook,
  onEdit,
  onDelete,
}) {
  const [bookToDelete, setBookToDelete] = useState(null);

  const handleDeleteClick = (book) => {
    setBookToDelete(book);
  };

  const confirmDelete = () => {
    if (bookToDelete) {
      onDelete(bookToDelete._id || bookToDelete.id);
      setBookToDelete(null);
    }
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return "Out of Stock";
    if (stock < 5) return "Low Stock";
    return "In Stock";
  };

  return (
    <>
      <AlertDialog
        open={!!bookToDelete}
        onOpenChange={(open) => !open && setBookToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              book
              <span className="font-bold text-foreground mx-1">
                "{bookToDelete?.title}"
              </span>
              and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="grid gap-4 md:hidden">
        {books.length > 0 ? (
          books.map((book) => {
            const stockStatus = getStockStatus(book.stock);

            return (
              <div
                key={book._id || book.id}
                className="bg-card rounded-xl border p-4 shadow-sm space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Checkbox
                      checked={selectedBooks.includes(book._id || book.id)}
                      onCheckedChange={(checked) =>
                        onSelectBook(book._id || book.id, checked)
                      }
                    />
                    <div className="relative group">
                      <img
                        src={book.image}
                        alt={book.title}
                        className="h-20 w-14 rounded-md object-cover shadow-sm border"
                      />
                      <div className="absolute inset-0 bg-black/5 rounded-md" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm leading-tight truncate">
                        {book.title}
                      </h3>

                      <p className="text-xs text-muted-foreground mt-0.5 truncate">
                        by {book.author || "Unknown"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 truncate">
                        {book.category}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <AdminStatusBadge
                          status={stockStatus}
                          className="text-[10px] h-5"
                        />
                        <span className="text-[10px] text-muted-foreground">
                          ({book.stock})
                        </span>
                      </div>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 -mt-2 -mr-2"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(book)}>
                        <Pencil className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDeleteClick(book)}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                      Price
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="font-bold text-base">
                        ${book.discountPrice?.toFixed(2)}
                      </span>
                      {book.originalPrice > book.discountPrice && (
                        <span className="text-xs text-muted-foreground line-through">
                          ${book.originalPrice?.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider text-right">
                      Rating
                    </p>
                    <div className="flex items-center justify-end gap-1">
                      <span className="text-sm font-bold">{book.rating}</span>
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {book.isFeatured && (
                    <Badge
                      variant="outline"
                      className="text-[10px] h-5 border-amber-200 bg-amber-50 text-amber-700"
                    >
                      Featured
                    </Badge>
                  )}
                  {book.isNewBook && (
                    <Badge
                      variant="outline"
                      className="text-[10px] h-5 border-blue-200 bg-blue-50 text-blue-700"
                    >
                      New Arrival
                    </Badge>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <EmptyState
            icon={Search}
            title="No books found"
            description="Try adjusting your search query."
          />
        )}
      </div>

      <div className="hidden md:block rounded-xl border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-12 pl-4">
                <Checkbox
                  checked={
                    books.length > 0 &&
                    books.every((book) =>
                      selectedBooks.includes(book._id || book.id),
                    )
                  }
                  onCheckedChange={onSelectAll}
                />
              </TableHead>
              <TableHead className="w-[40%]">Product</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Stock</TableHead>
              <TableHead className="text-center">Rating</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead className="w-12 pr-4"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {books.length > 0 ? (
              books.map((book) => (
                <TableRow key={book._id || book.id} className="group">
                  <TableCell className="pl-4">
                    <Checkbox
                      checked={selectedBooks.includes(book._id || book.id)}
                      onCheckedChange={(checked) =>
                        onSelectBook(book._id || book.id, checked)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-12 shrink-0 overflow-hidden rounded-md border bg-muted shadow-sm">
                        <img
                          src={book.image}
                          alt={book.title}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm truncate text-foreground">
                          {book.title}
                        </p>
                        <p className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5 opacity-70">
                          {book.description}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-medium text-foreground">
                      {book.author || "Unknown"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className="font-medium rounded-lg text-[11px]"
                    >
                      {book.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-col items-end gap-0.5">
                      <span className="font-bold text-sm">
                        ${book.discountPrice?.toFixed(2)}
                      </span>
                      {book.originalPrice > book.discountPrice && (
                        <span className="text-[10px] text-muted-foreground line-through">
                          ${book.originalPrice?.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <AdminStatusBadge
                      status={getStockStatus(book.stock)}
                      className="text-[10px] h-5"
                    />
                    <p className="text-[10px] text-muted-foreground mt-1">
                      ({book.stock})
                    </p>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1.5 bg-muted/30 py-1 px-2 rounded-full w-fit mx-auto">
                      <span className="text-[11px] font-bold">
                        {book.rating}
                      </span>
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1.5">
                      {book.isFeatured && (
                        <Badge
                          variant="outline"
                          className="text-[10px] h-5 border-amber-200 bg-amber-50 text-amber-700 truncate"
                        >
                          Featured
                        </Badge>
                      )}
                      {book.isNewBook && (
                        <Badge
                          variant="outline"
                          className="text-[10px] h-5 border-blue-200 bg-blue-50 text-blue-700 truncate"
                        >
                          New
                        </Badge>
                      )}
                      {!book.isFeatured && !book.isNewBook && (
                        <span className="text-xs text-muted-foreground/50">
                          -
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="pr-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onEdit(book)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteClick(book)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  <EmptyState
                    icon={Search}
                    title="No books found"
                    description="Try adjusting your search query."
                    className="py-12"
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
