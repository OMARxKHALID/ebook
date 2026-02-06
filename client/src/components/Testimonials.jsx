import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";
import { motion } from "framer-motion";

export const reviews = [
  {
    img: "https://placehold.co/100x100/png?text=RJ",
    name: "Riana J.",
    desc: "The best website to buy books is this one. Clean design.",
  },
  {
    img: "https://placehold.co/100x100/png?text=KM",
    name: "Kevin M.",
    desc: "The service is excellent, I received my book in perfect condition.",
  },
  {
    img: "https://placehold.co/100x100/png?text=SL",
    name: "Sarah L.",
    desc: "I love the variety of categories they have, highly recommended.",
  },
  {
    img: "https://placehold.co/100x100/png?text=DB",
    name: "David B.",
    desc: "Quick responses from support and very easy to navigate.",
  },
];

const Testimonials = () => {
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <section className="py-24 bg-landing-container/5" id="testimonial">
      <motion.div
        className="max-w-[1220px] mx-auto px-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        <div className="text-center mb-16 px-4">
          <span className="text-landing-primary font-bold uppercase text-xs mb-2 block tracking-wider">
            Testimonials
          </span>
          <h2 className="text-3xl lg:text-4xl font-montagu font-bold text-landing-title">
            What Our Readers Say
          </h2>
        </div>

        <Swiper
          modules={[Pagination, Autoplay]}
          loop={reviews.length > 3}
          spaceBetween={24}
          grabCursor={true}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-16"
        >
          {reviews.map((review, index) => (
            <SwiperSlide key={index}>
              <Card className="border border-landing-border bg-white dark:bg-landing-container/10 p-8 shadow-sm">
                <CardContent className="p-0">
                  <Quote
                    size={32}
                    className="text-landing-primary opacity-20 mb-6"
                  />
                  <p className="text-landing-text text-lg italic mb-8 font-montserrat opacity-80 leading-relaxed">
                    "{review.desc}"
                  </p>
                  <div className="flex items-center gap-4">
                    <img
                      src={review.img}
                      alt={review.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-bold text-landing-title">
                        {review.name}
                      </h4>
                      <p className="text-sm text-landing-text opacity-60">
                        Avid Reader
                      </p>
                    </div>
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

export default Testimonials;
