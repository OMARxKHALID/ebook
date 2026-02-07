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
import { ArrowUpRight } from "lucide-react";

export function RecentBooks({ books }) {
  return (
    <Card className="border shadow-sm flex flex-col h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="space-y-1">
          <CardTitle className="text-base font-bold">Recent Books</CardTitle>
          <p className="text-xs text-muted-foreground">
            Latest additions to catalog
          </p>
        </div>
        <Button variant="ghost" size="sm" asChild className="h-8 gap-1 pr-2">
          <Link to="/admin/books">
            View All <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        {/* Mobile View */}
        <div className="grid gap-3 p-4 sm:hidden">
          {books.length > 0 ? (
            books.map((book) => (
              <div
                key={book._id || book.id}
                className="flex items-center justify-between p-3 rounded-lg border bg-muted/30"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-10 w-8 shrink-0 overflow-hidden rounded bg-muted border">
                    <img
                      src={book.image}
                      alt={book.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm line-clamp-1">
                      {book.title}
                    </p>
                    <p className="text-xs text-muted-foreground font-medium">
                      ${book.discountPrice?.toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0">
                  {book.isFeatured ? (
                    <Badge className="text-[10px] h-5 bg-amber-500/10 text-amber-600 border-amber-200/50">
                      Featured
                    </Badge>
                  ) : book.isNewBook ? (
                    <Badge
                      variant="secondary"
                      className="text-[10px] h-5 bg-blue-500/10 text-blue-600 border-blue-200/50"
                    >
                      New
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="text-[10px] h-5 opacity-50"
                    >
                      Regular
                    </Badge>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-xs text-muted-foreground py-4">
              No books recently added
            </p>
          )}
        </div>

        {/* Desktop View */}
        <div className="hidden sm:block">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent">
                <TableHead className="py-2 text-[11px] font-bold uppercase tracking-wider pl-4">
                  Product
                </TableHead>
                <TableHead className="py-2 text-[11px] font-bold uppercase tracking-wider">
                  Price
                </TableHead>
                <TableHead className="py-2 text-[11px] font-bold uppercase tracking-wider text-right pr-4">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {books.length > 0 ? (
                books.map((book) => (
                  <TableRow key={book._id || book.id} className="group">
                    <TableCell className="py-3 pl-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-7 shrink-0 overflow-hidden rounded bg-muted border border-border/50">
                          <img
                            src={book.image}
                            alt={book.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <span className="font-medium text-xs line-clamp-1 max-w-[150px]">
                          {book.title}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-3 text-xs font-bold">
                      ${book.discountPrice?.toFixed(2)}
                    </TableCell>
                    <TableCell className="py-3 text-right pr-4">
                      {book.isFeatured ? (
                        <Badge
                          variant="outline"
                          className="text-[10px] h-5 bg-amber-500/10 text-amber-600 border-amber-200/50"
                        >
                          Featured
                        </Badge>
                      ) : book.isNewBook ? (
                        <Badge
                          variant="outline"
                          className="text-[10px] h-5 bg-blue-500/10 text-blue-600 border-blue-200/50"
                        >
                          New
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-[10px] h-5 opacity-60"
                        >
                          Regular
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="h-24 text-center text-xs text-muted-foreground"
                  >
                    No books in catalog
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
