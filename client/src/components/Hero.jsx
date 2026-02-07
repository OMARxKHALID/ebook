import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import { motion } from "framer-motion";
import { booksApi } from "../lib/api";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    booksApi
      .getAll({ featured: true })
      .then((data) => setBooks(data.slice(0, 8)))
      .catch((err) => console.error(err));
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section
      className="relative pt-32 pb-16 lg:pt-48 lg:pb-32 w-full overflow-hidden bg-transparent"
      id="home"
    >
      <div className="max-w-[1220px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
        {/* Text Content */}
        <motion.div
          className="w-full flex flex-col items-center lg:items-start text-center lg:text-left mx-auto lg:mx-0 max-w-2xl z-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="w-full">
            <span className="text-landing-primary font-bold uppercase text-xs mb-3 block tracking-widest text-center lg:text-left">
              Available Now
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-montagu font-bold text-landing-title mb-6 leading-tight text-center lg:text-left">
              Browse & Select <br className="hidden md:block" />
              <span className="text-landing-primary">E-Books</span>
            </h1>
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="text-landing-text text-base sm:text-lg mb-8 max-w-lg mx-auto lg:mx-0 font-montserrat opacity-80 text-center lg:text-left"
          >
            Explore a vast universe of knowledge and imagination. Find the
            perfect book for every moment, curated for your reading journey.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="w-full flex justify-center lg:justify-start"
          >
            <div className="flex flex-col sm:flex-row items-center gap-5">
              <Button
                asChild
                size="lg"
                className="rounded-full px-8 py-6 text-base font-bold bg-landing-primary hover:bg-landing-primary/90 transition-all font-montserrat shadow-lg shadow-landing-primary/20"
              >
                <Link
                  to="/books"
                  className="flex items-center justify-center gap-2"
                >
                  Explore Library
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>

              <a
                href="#new"
                className="text-landing-title font-semibold px-4 py-2 hover:text-landing-primary transition-colors font-montserrat"
              >
                New Arrivals
              </a>
            </div>
          </motion.div>
        </motion.div>

        {/* Mobile & Tablet: Simple Swiper */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="w-full relative flex lg:hidden z-20 justify-center"
        >
          <div className="w-full max-w-md px-4">
            <Swiper
              key={`mobile-swiper-${books.length}`}
              grabCursor={true}
              centeredSlides={true}
              spaceBetween={32}
              slidesPerView={1.3}
              loop={books.length > 1}
              modules={[Autoplay]}
              autoplay={{
                delay: 2500,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              className="w-full py-4"
            >
              {books.length > 0
                ? books.map((book) => (
                    <SwiperSlide key={book._id}>
                      <div className="relative w-full max-w-[180px] mx-auto aspect-2/3 rounded-xl overflow-hidden bg-white dark:bg-landing-container/10 shadow-md transition-all duration-300 hover:shadow-lg">
                        <img
                          src={book.image}
                          alt={book.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </SwiperSlide>
                  ))
                : /* Skeleton/Empty State */
                  [1, 2, 3].map((n) => (
                    <SwiperSlide key={n}>
                      <div className="w-full max-w-[180px] mx-auto aspect-2/3 bg-landing-title/10 rounded-xl animate-pulse" />
                    </SwiperSlide>
                  ))}
            </Swiper>
          </div>
        </motion.div>

        {/* Desktop: Coverflow Effect */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="w-full relative items-center justify-center hidden lg:flex z-20"
        >
          <Swiper
            key={`desktop-swiper-${books.length}`}
            effect={"coverflow"}
            grabCursor={true}
            centeredSlides={true}
            spaceBetween={-28}
            slidesPerView={3}
            loop={books.length >= 3}
            coverflowEffect={{
              rotate: 50,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: false,
            }}
            modules={[EffectCoverflow, Autoplay]}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            className="w-full h-full py-10 px-10"
          >
            {books.length > 0
              ? books.map((book) => (
                  <SwiperSlide key={book._id}>
                    <div className="relative w-full aspect-2/3 rounded-lg overflow-hidden bg-white dark:bg-landing-container/10 transition-all duration-300">
                      <img
                        src={book.image}
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </SwiperSlide>
                ))
              : /* Skeleton/Empty State */
                [1, 2, 3].map((n) => (
                  <SwiperSlide key={n}>
                    <div className="w-full aspect-2/3 bg-landing-title/10 rounded-lg animate-pulse" />
                  </SwiperSlide>
                ))}
          </Swiper>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
