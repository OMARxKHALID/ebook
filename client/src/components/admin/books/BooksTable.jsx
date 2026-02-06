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
import { MoreHorizontal, Pencil, Eye, Trash2, Star } from "lucide-react";

export function BooksTable({
  books,
  selectedBooks,
  onSelectAll,
  onSelectBook,
  onEdit,
  onDelete,
}) {
  return (
    <>
      <div className="grid gap-4 md:hidden">
        {books.length > 0 ? (
          books.map((book) => (
            <div
              key={book._id || book.id}
              className="bg-card rounded-xl border p-4 shadow-sm space-y-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={selectedBooks.includes(book._id || book.id)}
                    onCheckedChange={(checked) =>
                      onSelectBook(book._id || book.id, checked)
                    }
                  />
                  <img
                    src={book.image}
                    alt={book.title}
                    className="h-16 w-12 rounded object-cover shadow-sm"
                  />
                  <div>
                    <h3 className="font-bold text-sm line-clamp-2">
                      {book.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {book.category}
                    </p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(book)}>
                      <Pencil className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" /> View Details
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onDelete(book._id || book.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="grid grid-cols-2 gap-4 pb-2">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                    Price
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm">
                      ${book.discountPrice?.toFixed(2)}
                    </span>
                    {book.originalPrice !== book.discountPrice && (
                      <span className="text-[10px] text-muted-foreground line-through">
                        ${book.originalPrice?.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                    Rating
                  </p>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{book.rating}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-2 border-t">
                {book.isFeatured && (
                  <Badge className="text-[10px] h-5 px-2">Featured</Badge>
                )}
                {book.isNewBook && (
                  <Badge
                    variant="secondary"
                    className="text-[10px] h-5 px-2 font-bold"
                  >
                    New
                  </Badge>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-muted/20 rounded-xl border border-dashed">
            <p className="text-muted-foreground italic">No books found.</p>
          </div>
        )}
      </div>

      <div className="hidden md:block rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
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
              <TableHead>Book</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {books.length > 0 ? (
              books.map((book) => (
                <TableRow key={book._id || book.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedBooks.includes(book._id || book.id)}
                      onCheckedChange={(checked) =>
                        onSelectBook(book._id || book.id, checked)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={book.image}
                        alt={book.title}
                        className="h-12 w-9 rounded object-cover"
                      />
                      <div>
                        <p className="font-medium line-clamp-1">{book.title}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {book.description?.substring(0, 50)}...
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{book.category}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div>
                      <span className="font-medium">
                        ${book.discountPrice?.toFixed(2)}
                      </span>
                      {book.originalPrice !== book.discountPrice && (
                        <span className="ml-2 text-xs text-muted-foreground line-through">
                          ${book.originalPrice?.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{book.rating}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {book.isFeatured && (
                        <Badge className="text-xs">Featured</Badge>
                      )}
                      {book.isNewBook && (
                        <Badge variant="secondary" className="text-xs">
                          New
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
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
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onDelete(book._id || book.id)}
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
                <TableCell
                  colSpan={7}
                  className="h-24 text-center text-muted-foreground"
                >
                  No books found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
