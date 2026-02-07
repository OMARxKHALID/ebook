import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import { booksApi } from "../lib/api";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { addToCart } from "../store/slices/cartSlice";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { Link } from "react-router-dom";

const Featured = () => {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await booksApi.getAll({ featured: true });
        setFeaturedBooks(data);
      } catch (error) {
        console.error("Failed to fetch featured books:", error);
      }
    };
    fetchBooks();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  if (featuredBooks.length === 0) return null;

  return (
    <section className="py-24 relative overflow-hidden" id="featured">
      <motion.div
        className="max-w-[1220px] mx-auto px-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="text-landing-primary font-bold uppercase text-xs mb-2 block tracking-wider">
              Selection
            </span>
            <h2 className="text-3xl lg:text-4xl font-montagu font-bold text-landing-title">
              Featured Books
            </h2>
          </div>

          <div className="flex gap-2">
            <button className="swiper-button-prev-custom p-2 rounded-lg border border-landing-border text-landing-title hover:bg-landing-primary hover:text-white transition-colors">
              <ChevronLeft size={20} />
            </button>
            <button className="swiper-button-next-custom p-2 rounded-lg border border-landing-border text-landing-title hover:bg-landing-primary hover:text-white transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <Swiper
          modules={[Navigation, Autoplay]}
          loop={featuredBooks.length > 4}
          spaceBetween={24}
          grabCursor={true}
          slidesPerView={1}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          navigation={{
            nextEl: ".swiper-button-next-custom",
            prevEl: ".swiper-button-prev-custom",
          }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1200: { slidesPerView: 4 },
          }}
        >
          {featuredBooks.map((book) => (
            <SwiperSlide key={book._id || book.id}>
              <Card className="h-full border border-landing-border bg-white dark:bg-landing-container/10 rounded-2xl overflow-hidden transition-all hover:border-landing-primary">
                <CardContent className="p-5">
                  <div className="aspect-3/4 mb-5 rounded-lg overflow-hidden bg-landing-container/20">
                    <img
                      src={book.image}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="text-center lg:text-left">
                    <h3 className="text-lg font-montagu font-bold text-landing-title mb-2 truncate">
                      {book.title}
                    </h3>

                    <div className="flex flex-col items-center lg:items-start gap-2 mb-5">
                      <div className="flex items-center gap-3">
                        <span className="text-xl font-bold text-landing-primary">
                          ${book.discountPrice.toFixed(2)}
                        </span>
                        <span className="text-sm line-through text-landing-text opacity-40">
                          ${book.originalPrice.toFixed(2)}
                        </span>
                      </div>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${
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
                      asChild
                      className="w-full rounded-xl py-5 bg-landing-primary text-white hover:bg-landing-primary/90 transition-all flex items-center justify-center gap-2 font-bold"
                    >
                      <Link to={`/books/${book._id || book.id}`}>
                        <Eye size={16} />
                        View Details
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.div>
    </section>
  );
};

export default Featured;
