import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

const services = [
  {
    icon: "ri-truck-line",
    title: "Free Shipping",
    desc: "Order More Than $100",
  },
  {
    icon: "ri-lock-2-line",
    title: "Secure Payment",
    desc: "100% Secure Payment",
  },
  {
    icon: "ri-customer-service-2-line",
    title: "24/7 Support",
    desc: "Call us anytime",
  },
];

const Services = () => {
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
      transition: { duration: 0.6 },
    },
  };

  return (
    <section className="py-24 lg:py-32 bg-transparent" id="services">
      <motion.div
        className="max-w-[1220px] mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {services.map((service, index) => (
          <motion.div key={index} variants={itemVariants}>
            <Card className="h-full border border-landing-border bg-white dark:bg-landing-container/10 p-8 transition-colors hover:border-landing-primary active:scale-95 duration-300">
              <CardContent className="p-0 flex flex-col items-center lg:items-start">
                <div className="w-12 h-12 flex items-center justify-center mb-6 text-landing-primary">
                  <i className={`${service.icon} text-3xl`}></i>
                </div>

                <h3 className="text-xl font-montagu font-bold text-landing-title mb-4 tracking-tight">
                  {service.title}
                </h3>

                <p className="text-landing-text text-base leading-relaxed text-center lg:text-left font-montserrat opacity-70">
                  {service.desc}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default Services;
