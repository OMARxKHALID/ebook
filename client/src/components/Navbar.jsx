import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/slices/authSlice";
import { setCartOpen, addToCart } from "../store/slices/cartSlice";
import { useTheme } from "./theme-provider";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingCart, User, Sun, Moon, X, LogOut } from "lucide-react";

const navLinks = [
  { id: "home", icon: "ri-home-line", label: "Home" },
  { id: "books", icon: "ri-book-line", label: "All Books", path: "/books" },
  { id: "featured", icon: "ri-book-3-line", label: "Featured" },
  { id: "discount", icon: "ri-price-tag-3-line", label: "Discount" },
  { id: "new", icon: "ri-bookmark-line", label: "New Books" },
  { id: "testimonial", icon: "ri-message-3-line", label: "Testimonial" },
];

const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState("home");
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (location.pathname === "/books") {
      setActiveLink("books");
    } else if (location.pathname === "/" && activeLink === "books") {
      setActiveLink("home");
    }
  }, [location.pathname]);

  const { user, token } = useSelector((state) => state.auth);
  const { items: cartItems } = useSelector((state) => state.cart);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const [searchQuery, setSearchQuery] = useState("");
  const [allBooks, setAllBooks] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  const isAuthenticated = !!token;
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (isSearchOpen && allBooks.length === 0) {
      import("../lib/api").then(({ booksApi }) => {
        booksApi
          .getAll()
          .then((data) => setAllBooks(data))
          .catch(console.error);
      });
    }
  }, [isSearchOpen, allBooks.length]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results = allBooks.filter(
      (book) =>
        book.title?.toLowerCase().includes(query) ||
        book.author?.toLowerCase().includes(query),
    );
    setSearchResults(results);
  }, [searchQuery, allBooks]);

  const handleNavClick = (e, link) => {
    e.preventDefault();

    if (link.path) {
      setActiveLink(link.id);
      navigate(link.path);
      return;
    }

    setActiveLink(link.id);

    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById(link.id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      const element = document.getElementById(link.id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY >= 50);

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);

      const sections = document.querySelectorAll("section[id]");
      const scrollY = window.scrollY;

      sections.forEach((current) => {
        const sectionHeight = current.offsetHeight,
          sectionTop = current.offsetTop - 150,
          sectionId = current.getAttribute("id");

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          setActiveLink(sectionId);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "py-4 bg-landing-body border-b border-landing-border shadow-sm"
            : "py-6 bg-transparent"
        }`}
        id="header"
      >
        <nav className="max-w-[1220px] mx-auto px-6 flex justify-between items-center relative">
          <Link
            to="/"
            className="flex items-center gap-2 text-lg sm:text-xl font-montagu font-bold text-landing-title whitespace-nowrap transition-transform hover:scale-105 active:scale-95 shrink-0"
          >
            <div className="bg-landing-primary w-8 h-8 rounded-lg flex items-center justify-center shadow-lg shadow-landing-primary/20">
              <i className="ri-book-3-fill text-white text-lg"></i>
            </div>
            <span>E-Book</span>
          </Link>

          <div className="hidden lg:block">
            <ul className="flex items-center gap-8">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    className={`relative text-sm font-semibold tracking-wide transition-all font-montserrat ${
                      activeLink === link.id
                        ? "text-landing-primary"
                        : "text-landing-text hover:text-landing-primary"
                    }`}
                    onClick={(e) => handleNavClick(e, link)}
                  >
                    {link.label}
                    {activeLink === link.id && (
                      <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-landing-primary rounded-full" />
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-1 sm:gap-3">
            <button
              className="p-2 text-landing-title hover:text-landing-primary hover:bg-landing-primary/5 rounded-full transition-all"
              onClick={() => setIsSearchOpen(true)}
              title="Search"
            >
              <Search size={18} />
            </button>

            <button
              className="relative p-2 text-landing-title hover:text-landing-primary hover:bg-landing-primary/5 rounded-full transition-all"
              onClick={() => dispatch(setCartOpen(true))}
              title="Cart"
            >
              <ShoppingCart size={18} />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-landing-primary text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold border-2 border-white dark:border-landing-body">
                  {cartCount}
                </span>
              )}
            </button>

            <div className="h-6 w-px bg-landing-border mx-1 hidden sm:block"></div>

            {isAuthenticated ? (
              <div className="flex items-center gap-1">
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="p-2 text-landing-title hover:text-landing-primary hover:bg-landing-primary/5 rounded-full transition-all"
                    title="Admin Dashboard"
                  >
                    <User size={18} />
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="p-2 text-landing-title hover:text-red-500 hover:bg-red-500/5 rounded-full transition-all"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="p-2 text-landing-title hover:text-landing-primary hover:bg-landing-primary/5 rounded-full transition-all"
                title="Login"
              >
                <User size={18} />
              </Link>
            )}

            <button
              className="p-2 text-landing-title hover:text-landing-primary hover:bg-landing-primary/5 rounded-full transition-all"
              onClick={toggleTheme}
              title="Toggle Theme"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isDark ? "dark" : "light"}
                  initial={{ opacity: 0, rotate: -45 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 45 }}
                  transition={{ duration: 0.2 }}
                >
                  {isDark ? <Sun size={18} /> : <Moon size={18} />}
                </motion.div>
              </AnimatePresence>
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: isVisible ? 0 : 100 }}
          className="lg:hidden fixed bottom-4 left-4 right-4 z-100"
        >
          <div className="bg-landing-body border border-landing-border rounded-2xl p-3 px-6 shadow-sm flex justify-between items-center">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className={`p-2 transition-all ${
                  activeLink === link.id
                    ? "text-landing-primary"
                    : "text-landing-text/60"
                }`}
                onClick={(e) => handleNavClick(e, link)}
              >
                <i className={`${link.icon} text-xl`}></i>
              </a>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-110 bg-landing-body/95 flex justify-center items-start pt-20 sm:pt-24 p-6"
          >
            <motion.div
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              className="w-full max-w-[600px] relative flex flex-col max-h-[80vh]"
            >
              <form
                className="flex items-center gap-4 border-b-2 border-landing-border focus-within:border-landing-primary py-4 transition-all shrink-0"
                onSubmit={(e) => e.preventDefault()}
              >
                <Search size={20} className="text-landing-text" />
                <input
                  autoFocus
                  type="search"
                  placeholder="Search books..."
                  className="w-full bg-transparent text-lg text-landing-title outline-none placeholder:text-landing-text/50 font-montserrat"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
              <button
                className="absolute -top-12 right-0 p-2 text-landing-title hover:text-landing-primary transition-colors"
                onClick={() => setIsSearchOpen(false)}
              >
                <X size={24} />
              </button>

              <div className="overflow-y-auto mt-4 space-y-2 pr-2 custom-scrollbar">
                {searchQuery && searchResults.length === 0 ? (
                  <p className="text-landing-text text-center py-8 opacity-60">
                    No books found matching "{searchQuery}"
                  </p>
                ) : (
                  searchResults.map((book) => (
                    <div
                      key={book._id}
                      className="flex items-center gap-4 p-3 rounded-xl hover:bg-landing-container/50 transition-colors group cursor-pointer"
                      onClick={() => {
                        dispatch(setCartOpen(true));
                        setIsSearchOpen(false);
                      }}
                    >
                      <div className="w-12 h-16 bg-landing-title/5 rounded-md overflow-hidden shrink-0">
                        <img
                          src={book.image}
                          alt={book.title}
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-landing-title font-bold font-montagu truncate group-hover:text-landing-primary transition-colors">
                          {book.title}
                        </h4>
                        <p className="text-sm text-landing-text opacity-70 truncate">
                          {book.author || "Unknown Author"}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="block font-bold text-landing-primary">
                          ${book.discountPrice || book.originalPrice}
                        </span>
                        <div className="text-[10px] mt-1 text-right">
                          {book.stock > 0 ? (
                            <span className="text-emerald-600 font-medium">
                              {book.stock} in stock
                            </span>
                          ) : (
                            <span className="text-red-500 font-medium">
                              Out of Stock
                            </span>
                          )}
                        </div>
                        <button
                          className={`text-xs uppercase font-bold mt-1 ${
                            book.stock > 0
                              ? "text-landing-text/50 hover:text-landing-primary"
                              : "text-gray-400 cursor-not-allowed"
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (book.stock > 0) {
                              dispatch(addToCart(book));
                            }
                          }}
                          disabled={book.stock <= 0}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
