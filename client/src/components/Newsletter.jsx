import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Newsletter = () => {
  return (
    <section className="py-24" id="join">
      <motion.div
        className="max-w-[1220px] mx-auto px-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <div className="bg-landing-primary p-12 lg:p-20 rounded-[2rem] text-center lg:text-left">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-white font-bold uppercase text-xs mb-2 block tracking-wider opacity-80">
                Newsletter
              </span>
              <h2 className="text-3xl lg:text-4xl font-montagu font-bold text-white mb-6">
                Get the Latest Updates
              </h2>
              <p className="text-white/80 text-lg font-montserrat max-w-md">
                Join our community of book lovers and receive exclusive
                discounts and new release alerts.
              </p>
            </div>

            <div>
              <form
                className="flex flex-col sm:flex-row gap-3"
                onSubmit={(e) => e.preventDefault()}
              >
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40 rounded-xl h-14 px-6 focus-visible:ring-1 focus-visible:ring-white"
                />
                <Button className="h-14 rounded-xl px-10 bg-white text-landing-primary hover:bg-white/90 font-bold transition-all shrink-0">
                  Subscribe
                </Button>
              </form>
              <p className="mt-4 text-white/40 text-sm">
                We respect your privacy.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Newsletter;
