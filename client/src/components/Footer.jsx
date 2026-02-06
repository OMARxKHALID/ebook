import {
  BookOpen,
  MapPin,
  Mail,
  Phone,
  Instagram,
  Facebook,
  Twitter,
  Github,
} from "lucide-react";

const footerLinks = [
  {
    title: "About",
    links: ["Awards", "FAQs", "Privacy policy", "Terms of services"],
  },
  {
    title: "Company",
    links: ["Blogs", "Community", "Our team", "Help center"],
  },
];

const socialLinks = [
  { icon: "ri-facebook-circle-line", url: "https://www.facebook.com/" },
  { icon: "ri-instagram-line", url: "https://www.instagram.com/" },
  { icon: "ri-twitter-x-line", url: "https://twitter.com/" },
];

const Footer = () => {
  return (
    <footer className="pt-24 pb-12 lg:pt-32 bg-landing-container/10 border-t border-landing-border">
      <div className="max-w-[1220px] mx-auto px-6 grid gap-16 lg:grid-cols-4 items-start">
        <div className="lg:col-span-1">
          <a
            href="#"
            className="flex items-center gap-2.5 text-2xl font-montagu font-bold text-landing-title mb-8"
          >
            <div className="bg-landing-primary p-2 rounded-xl">
              <BookOpen size={24} className="text-white" />
            </div>
            <span>E-Book</span>
          </a>
          <p className="text-landing-text text-lg leading-relaxed font-montserrat opacity-80 mb-8 max-w-xs">
            Discover a curated collection of world-class literature across all
            possible genres and categories.
          </p>
          <div className="flex gap-4">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-white dark:bg-landing-title shadow-sm flex items-center justify-center text-landing-primary hover:bg-landing-primary hover:text-white transition-all duration-300 ring-1 ring-landing-border"
              >
                <i className={`${social.icon} text-lg`}></i>
              </a>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-12">
          {footerLinks.map((section, index) => (
            <div key={index}>
              <h3 className="text-lg font-montagu font-bold text-landing-title mb-6">
                {section.title}
              </h3>
              <ul className="space-y-4">
                {section.links.map((link, i) => (
                  <li key={i}>
                    <a
                      href="#"
                      className="text-landing-text hover:text-landing-primary transition-colors font-montserrat opacity-70 hover:opacity-100"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <h3 className="text-lg font-montagu font-bold text-landing-title mb-6">
            Contact Us
          </h3>
          <ul className="space-y-6">
            <li className="flex items-start gap-3 text-landing-text font-montserrat opacity-80">
              <MapPin size={20} className="text-landing-primary shrink-0" />
              <address className="not-italic">
                Av. Hacienda, Lima 4321, Peru
              </address>
            </li>
            <li className="flex items-center gap-3 text-landing-text font-montserrat opacity-80">
              <Mail size={20} className="text-landing-primary shrink-0" />
              <span>e.book@gmail.com</span>
            </li>
            <li className="flex items-center gap-3 text-landing-text font-montserrat opacity-80">
              <Phone size={20} className="text-landing-primary shrink-0" />
              <span>0987-654-321</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-[1220px] mx-auto px-6 mt-20 pt-8 border-t border-landing-border text-center">
        <p className="text-sm text-landing-text opacity-50 font-montserrat">
          &copy; {new Date().getFullYear()} E-Book. All Rights Reserved.
          Designed with Passion.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
