import Hero from "../components/Hero";
import Services from "../components/Services";
import Featured from "../components/Featured";
import Discount from "../components/Discount";
import NewBooks from "../components/NewBooks";
import Testimonials from "../components/Testimonials";
import Newsletter from "../components/Newsletter";
import { SEO } from "../components/SEO";

const Home = () => {
  return (
    <main className="w-full relative overflow-hidden">
      <SEO
        title="Home"
        description="Welcome to Ebook Store, the world's leading digital bookstore. Discover thousands of bestsellers, classics, and new releases."
      />
      <Hero />
      <Services />
      <Featured />
      <Discount />
      <NewBooks />
      <Testimonials />
      <Newsletter />
    </main>
  );
};

export default Home;
