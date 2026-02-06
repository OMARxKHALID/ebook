import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { motion } from "framer-motion";
import { Autoplay, Pagination } from "swiper/modules";
import { booksApi } from "../lib/api";
import { useDispatch } from "react-redux";
import { addToCart } from "../store/slices/cartSlice";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

const NewBooks = () => {
  const [newBooks, setNewBooks] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    booksApi
      .getAll({ new: true })
      .then((data) => setNewBooks(data.slice(0, 10)))
      .catch((err) => console.error(err));
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  if (newBooks.length === 0) return null;

  return (
    <section className="py-24" id="new">
      <motion.div
        className="max-w-[1220px] mx-auto px-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        <div className="text-center mb-16">
          <span className="text-landing-primary font-bold uppercase text-xs mb-2 block tracking-wider">
            New Arrivals
          </span>
          <h2 className="text-3xl lg:text-4xl font-montagu font-bold text-landing-title">
            Newly Released Books
          </h2>
        </div>

        <Swiper
          modules={[Autoplay, Pagination]}
          loop={newBooks.length > 2}
          spaceBetween={24}
          grabCursor={true}
          slidesPerView={1}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 2, spaceBetween: 32 },
          }}
          className="pb-16"
        >
          {newBooks.map((book) => (
            <SwiperSlide key={book._id || book.id}>
              <Card className="border border-landing-border bg-white dark:bg-landing-container/10 rounded-2xl overflow-hidden transition-all hover:border-landing-primary">
                <CardContent className="p-6 flex gap-6 items-center">
                  <div className="w-1/3 shrink-0">
                    <img
                      src={book.image}
                      alt={book.title}
                      className="w-full h-auto aspect-2/3 object-cover rounded-lg shadow-sm"
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-montagu font-bold text-landing-title mb-2">
                      {book.title}
                    </h3>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-lg font-bold text-landing-primary">
                        ${book.discountPrice.toFixed(2)}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      className="rounded-lg bg-landing-primary text-white hover:bg-landing-primary/90 transition-colors flex items-center gap-2"
                      onClick={() => {
                        dispatch(addToCart(book));
                      }}
                    >
                      <ShoppingCart size={14} />
                      Buy Now
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

export default NewBooks;
