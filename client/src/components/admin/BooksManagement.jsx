import { useState, useEffect, useMemo } from "react";
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
import { useNavigate } from "react-router-dom";
import { BooksTable } from "./books/BooksTable";
import { handleApiError } from "@/lib/errorHandler";
import { usePagination } from "@/hooks/usePagination";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { AdminPageHeader } from "./shared/AdminPageHeader";
import { AdminPagination } from "./shared/AdminPagination";
import { SEO } from "../SEO";

export function BooksManagement() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBooks, setSelectedBooks] = useState([]);

  const filteredBooks = useMemo(
    () =>
      books.filter(
        (book) =>
          book.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.category?.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [books, searchQuery],
  );

  const {
    currentPage,
    totalPages,
    paginatedItems: paginatedBooks,
    setCurrentPage,
  } = usePagination(filteredBooks, 10);

  useEffect(() => {
    loadBooks();
  }, []);
  const loadBooks = async () => {
    try {
      const data = await booksApi.getAll();
      setBooks(data);
    } catch (error) {
      handleApiError(error, "Loading Books");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, setCurrentPage]);

  const handleEdit = (book) => {
    navigate(`/admin/books/edit/${book._id || book.id}`);
  };

  const handleDelete = async (id) => {
    try {
      await booksApi.delete(id);
      toast.success("Book deleted successfully");
      loadBooks();
    } catch (error) {
      handleApiError(error, "Delete Book");
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
      handleApiError(error, "Bulk Delete");
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
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-500">
      <SEO
        title="Manage Books"
        description="Interface for adding, editing, and deleting books from the catalog."
        noindex={true}
      />
      <AdminPageHeader
        title="Books"
        description={`Manage your book catalog. ${books.length} total books.`}
      >
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
        <Button onClick={() => navigate("/admin/books/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Add Book
        </Button>
      </AdminPageHeader>

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

          <AdminPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default BooksManagement;
