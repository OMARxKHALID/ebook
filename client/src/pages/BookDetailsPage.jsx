import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { booksApi } from "../lib/api";
import { useDispatch } from "react-redux";
import { addToCart } from "../store/slices/cartSlice";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ArrowLeft, Star } from "lucide-react";
import { SEO } from "../components/SEO";

const BookDetailsPage = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const data = await booksApi.getById(id);
        setBook(data);
      } catch (error) {
        console.error("Failed to fetch book:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-landing-primary"></div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold">Book Not Found</h2>
        <Link to="/books" className="text-landing-primary hover:underline">
          Back to Library
        </Link>
      </div>
    );
  }

  return (
    <section className="py-16 md:py-24 px-6 min-h-screen bg-landing-body">
      <SEO
        title={book.title}
        description={book.description?.substring(0, 160)}
        image={book.image}
        type="book"
      />
      <div className="max-w-[1220px] mx-auto">
        <Link
          to="/books"
          className="inline-flex items-center gap-2 text-landing-text hover:text-landing-primary mb-6 md:mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Library
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] lg:grid-cols-[0.8fr_1.2fr] gap-8 md:gap-12 lg:gap-24 items-start">
          <div className="relative aspect-3/4 bg-white dark:bg-transparent rounded-2xl shadow-lg dark:shadow-none border border-landing-border dark:border-none overflow-hidden group max-w-sm mx-auto w-full md:max-w-none">
            <img
              src={book.image}
              alt={book.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {book.stock <= 0 && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                <span className="text-white text-2xl font-bold px-6 py-3 border-2 border-white rounded-lg tracking-widest uppercase">
                  Sold Out
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-6">
            <div>
              <span className="text-landing-primary font-bold uppercase text-xs mb-2 block tracking-wider">
                {book.category || "General"}
              </span>
              <h1 className="text-4xl lg:text-5xl font-montagu font-bold text-landing-title mb-4 leading-tight">
                {book.title}
              </h1>
              <p className="text-lg text-landing-text opacity-80 font-medium">
                by{" "}
                <span className="font-semibold">
                  {book.author || "Unknown Author"}
                </span>
              </p>

              <div className="flex items-center gap-1 mt-2">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="font-bold text-landing-title">
                  {book.rating || "4.5"}
                </span>
                <span className="text-landing-text/60 text-sm ml-1">
                  (120 reviews)
                </span>
              </div>
            </div>

            <div className="h-px bg-landing-border w-full" />

            <div className="prose prose-lg text-landing-text opacity-90 leading-relaxed font-secondary">
              <p>
                {book.description || "No description available for this book."}
              </p>
            </div>

            <div className="mt-4">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-4xl font-bold text-landing-primary">
                  ${book.discountPrice.toFixed(2)}
                </span>
                {book.originalPrice > book.discountPrice && (
                  <span className="text-xl line-through text-landing-text opacity-40">
                    ${book.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between p-4 bg-landing-container/5 rounded-xl border border-landing-border">
                  <span className="font-medium text-landing-title">
                    Availability
                  </span>
                  <span
                    className={`font-bold ${
                      book.stock > 0
                        ? book.stock < 5
                          ? "text-amber-600"
                          : "text-emerald-600"
                        : "text-red-500"
                    }`}
                  >
                    {book.stock > 0 ? (
                      <span className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${book.stock < 5 ? "bg-amber-500" : "bg-emerald-500"}`}
                        ></div>
                        {book.stock} In Stock
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        Out of Stock
                      </span>
                    )}
                  </span>
                </div>

                <Button
                  size="lg"
                  className="w-full rounded-xl py-8 text-lg bg-landing-primary text-white hover:bg-landing-primary/90 transition-all flex items-center justify-center gap-3 font-bold shadow-lg shadow-landing-primary/20 hover:shadow-landing-primary/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                  onClick={() => dispatch(addToCart(book))}
                  disabled={book.stock <= 0}
                >
                  <ShoppingCart size={24} />
                  {book.stock > 0 ? "Add to Cart" : "Currently Unavailable"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookDetailsPage;
