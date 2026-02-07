import { useState, useEffect } from "react";
import { booksApi } from "../lib/api";
import { useDispatch } from "react-redux";
import { addToCart } from "../store/slices/cartSlice";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { SEO } from "../components/SEO";

const AllBooksPage = () => {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await booksApi.getAll();
        setBooks(data);
      } catch (error) {
        console.error("Failed to fetch books:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBooks();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-landing-primary"></div>
      </div>
    );
  }

  return (
    <section className="py-16 md:py-24 px-6 min-h-screen">
      <SEO
        title="Browse Library"
        description="Browse our extensive collection of digital books. Filter by category, price, and rating to find your next favorite read."
      />
      <div className="max-w-[1220px] mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <span className="text-landing-primary font-bold uppercase text-xs mb-2 block tracking-wider">
            Explore
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-montagu font-bold text-landing-title">
            All Books
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {books.map((book) => (
            <Card
              key={book._id || book.id}
              className="h-full border border-landing-border bg-white dark:bg-landing-container/10 rounded-2xl overflow-hidden transition-all hover:border-landing-primary hover:shadow-lg flex flex-col"
            >
              <CardContent className="p-5 flex-1 flex flex-col">
                <Link to={`/books/${book._id || book.id}`} className="block">
                  <div className="aspect-3/4 mb-5 rounded-lg overflow-hidden bg-landing-container/20 relative group">
                    <img
                      src={book.image}
                      alt={book.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {book.stock <= 0 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-bold px-4 py-2 border-2 border-white rounded-md">
                          SOLD OUT
                        </span>
                      </div>
                    )}
                  </div>
                </Link>

                <div className="flex-1 flex flex-col">
                  <Link to={`/books/${book._id || book.id}`}>
                    <h3 className="text-lg font-montagu font-bold text-landing-title mb-2 line-clamp-2 hover:text-landing-primary transition-colors">
                      {book.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-landing-text opacity-70 mb-4 line-clamp-1">
                    {book.author || "Unknown Author"}
                  </p>

                  <div className="mt-auto">
                    <div className="flex flex-col gap-2 mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-xl font-bold text-landing-primary">
                          ${book.discountPrice.toFixed(2)}
                        </span>
                        {book.originalPrice > book.discountPrice && (
                          <span className="text-sm line-through text-landing-text opacity-40">
                            ${book.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full w-fit ${
                          book.stock > 0
                            ? book.stock < 5
                              ? "bg-amber-500/10 text-amber-600"
                              : "bg-emerald-500/10 text-emerald-600"
                            : "bg-red-500/10 text-red-600"
                        }`}
                      >
                        {book.stock > 0
                          ? `${book.stock} In Stock`
                          : "Out of Stock"}
                      </span>
                    </div>

                    <Button
                      className="w-full rounded-xl py-5 bg-landing-primary text-white hover:bg-landing-primary/90 transition-all flex items-center justify-center gap-2 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => {
                        dispatch(addToCart(book));
                      }}
                      disabled={book.stock <= 0}
                    >
                      <ShoppingCart size={16} />
                      {book.stock > 0 ? "Add to Cart" : "Out of Stock"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AllBooksPage;
