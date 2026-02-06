import { useState, useEffect } from "react";

const ScrollUp = () => {
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY >= 350);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <a
      href="#"
      className={`fixed right-4 bg-landing-container shadow-sm inline-flex p-1.5 text-xl text-landing-title z-10 rounded hover:-translate-y-2 transition-all duration-400 ${showScroll ? "bottom-24 lg:bottom-12" : "-bottom-1/2"}`}
      id="scroll-up"
    >
      <i className="ri-arrow-up-line"></i>
    </a>
  );
};

export default ScrollUp;
