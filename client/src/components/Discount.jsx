import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { booksApi } from "../lib/api";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Discount = () => {
  const [discountBooks, setDiscountBooks] = useState([]);

  useEffect(() => {
    booksApi
      .getAll()
      .then((data) => {
        const discounted = data
          .filter((b) => b.discountPrice < b.originalPrice)
          .slice(0, 2);
        setDiscountBooks(discounted);
      })
      .catch((err) => console.error(err));
  }, []);

  if (discountBooks.length === 0) return null;

  return (
    <section className="py-24 bg-landing-container/5" id="discount">
      <div className="max-w-[1220px] mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          className="relative lg:order-2 flex justify-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex gap-4">
            {discountBooks.map((book, i) => (
              <div
                key={i}
                className={`w-[200px] lg:w-[240px] shadow-sm rounded-lg overflow-hidden ${i === 1 ? "hidden sm:block mt-8" : ""}`}
              >
                <img
                  src={book.image}
                  alt={book.title}
                  className="w-full h-auto aspect-2/3 object-cover"
                />
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="text-center lg:text-left lg:order-1"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-landing-primary font-bold uppercase text-xs mb-2 block tracking-wider">
            Sale
          </span>
          <h2 className="text-4xl lg:text-5xl font-montagu font-bold text-landing-title mb-6 leading-tight">
            Up To 50% Discount
          </h2>

          <p className="text-landing-text text-lg mb-8 max-w-xl font-montserrat opacity-80">
            Take advantage of the discount days we have for you. Buy books from
            your favorite writers at half the price.
          </p>

          <Button
            asChild
            className="rounded-full px-8 py-6 text-base font-bold bg-landing-primary hover:bg-landing-primary/90 transition-all"
          >
            <a href="#featured" className="flex items-center gap-2">
              Shop Now
              <ArrowRight size={18} />
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default Discount;
