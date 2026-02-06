import { useState, useEffect } from "react";
import { Plus, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { booksApi } from "@/lib/api";
import { toast } from "sonner";
import { BookFormDialog } from "./books/BookFormDialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { BooksTable } from "./books/BooksTable";

export function BooksManagement() {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedBooks, setSelectedBooks] = useState([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      const data = await booksApi.getAll();
      setBooks(data);
    } catch (error) {
      toast.error("Failed to load books");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredBooks = books.filter(
    (book) =>
      book.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.category?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBooks = filteredBooks.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);

    try {
      const bookData = {
        ...formData,
        originalPrice: parseFloat(formData.originalPrice) || 0,
        discountPrice: parseFloat(formData.discountPrice) || 0,
        rating: parseFloat(formData.rating) || 0,
      };

      if (editingBook) {
        await booksApi.update(editingBook._id || editingBook.id, bookData);
        toast.success("Book updated successfully");
      } else {
        await booksApi.create(bookData);
        toast.success("Book created successfully");
      }

      setIsDialogOpen(false);
      setEditingBook(null);
      loadBooks();
    } catch (error) {
      toast.error(error.message || "Failed to save book");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this book?")) return;

    try {
      await booksApi.delete(id);
      toast.success("Book deleted successfully");
      loadBooks();
    } catch (error) {
      toast.error("Failed to delete book");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedBooks.length === 0) return;

    if (
      !confirm(
        `Are you sure you want to delete ${selectedBooks.length} selected books?`,
      )
    )
      return;

    try {
      await booksApi.bulkDelete(selectedBooks);
      toast.success("Selected books deleted successfully");
      setSelectedBooks([]);
      loadBooks();
    } catch (error) {
      toast.error("Failed to delete selected books");
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      const currentPageIds = paginatedBooks.map((b) => b._id || b.id);
      setSelectedBooks((prev) => {
        const otherSelected = prev.filter((id) => !currentPageIds.includes(id));
        return [...otherSelected, ...currentPageIds];
      });
    } else {
      const currentPageIds = paginatedBooks.map((b) => b._id || b.id);
      setSelectedBooks((prev) =>
        prev.filter((id) => !currentPageIds.includes(id)),
      );
    }
  };

  const handleSelectBook = (id, checked) => {
    if (checked) {
      setSelectedBooks((prev) => [...prev, id]);
    } else {
      setSelectedBooks((prev) => prev.filter((i) => i !== id));
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Books</h1>
          <p className="text-muted-foreground">
            Manage your book catalog. {books.length} total books.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {selectedBooks.length > 0 && (
            <Button
              variant="destructive"
              onClick={handleBulkDelete}
              className="animate-in fade-in slide-in-from-top-2 duration-300"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Selected ({selectedBooks.length})
            </Button>
          )}
          <Button
            onClick={() => {
              setEditingBook(null);
              setIsDialogOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Book
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Book Catalog</CardTitle>
              <CardDescription>
                View and manage all books in your store (Page {currentPage} of{" "}
                {totalPages || 1})
              </CardDescription>
            </div>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <BooksTable
            books={paginatedBooks}
            selectedBooks={selectedBooks}
            onSelectAll={handleSelectAll}
            onSelectBook={handleSelectBook}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          isActive={page === currentPage}
                          onClick={() => setCurrentPage(page)}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ),
                  )}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      <BookFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleSubmit}
        editingBook={editingBook}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}

export default BooksManagement;
