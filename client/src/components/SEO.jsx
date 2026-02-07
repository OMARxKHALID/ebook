import { Helmet } from "react-helmet-async";

export function SEO({
  title,
  description,
  image,
  type = "website",
  canonical,
  noindex = false,
}) {
  const siteTitle = "Ebook Store";
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const siteDescription =
    description ||
    "Explore a vast library of digital books at Ebook Store. Your premiere destination for fiction, non-fiction, and educational ebooks.";
  const siteUrl = window.location.origin;

  return (
    <Helmet>
      {/* Basic Metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={siteDescription} />
      <link rel="canonical" href={canonical || window.location.href} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={siteDescription} />
      <meta property="og:url" content={window.location.href} />
      {image && <meta property="og:image" content={image} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={siteDescription} />
      {image && <meta name="twitter:image" content={image} />}
    </Helmet>
  );
}
