import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function RecentBooks({ books }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Books</CardTitle>
          <CardDescription>Latest added books</CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to="/admin/books">View All</Link>
        </Button>
      </CardHeader>
      <CardContent>
        {/* Mobile View */}
        <div className="grid gap-3 sm:hidden">
          {books.length > 0 ? (
            books.map((book) => (
              <div
                key={book._id || book.id}
                className="flex items-center justify-between p-3 rounded-lg border bg-muted/30"
              >
                <div className="space-y-1">
                  <p className="font-bold text-sm line-clamp-1">{book.title}</p>
                  <p className="text-xs text-muted-foreground font-medium">
                    ${book.discountPrice?.toFixed(2)}
                  </p>
                </div>
                <div className="flex shrink-0">
                  {book.isFeatured ? (
                    <Badge className="text-[10px] h-5 px-2">Featured</Badge>
                  ) : book.isNewBook ? (
                    <Badge variant="secondary" className="text-[10px] h-5 px-2">
                      New
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-[10px] h-5 px-2">
                      Regular
                    </Badge>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-sm text-muted-foreground py-4">
              No books yet
            </p>
          )}
        </div>

        {/* Desktop View */}
        <div className="hidden sm:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {books.length > 0 ? (
                books.map((book) => (
                  <TableRow key={book._id || book.id}>
                    <TableCell className="font-medium truncate max-w-[150px]">
                      {book.title}
                    </TableCell>
                    <TableCell>${book.discountPrice?.toFixed(2)}</TableCell>
                    <TableCell>
                      {book.isFeatured ? (
                        <Badge>Featured</Badge>
                      ) : book.isNewBook ? (
                        <Badge variant="secondary">New</Badge>
                      ) : (
                        <Badge variant="outline">Regular</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-center text-muted-foreground"
                  >
                    No books yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
