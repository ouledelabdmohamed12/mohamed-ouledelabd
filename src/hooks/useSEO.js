import { useEffect } from "react";

const SITE_URL = "https://mohamed-ouledelabd.vercel.app";

const setMeta = (attr, key, value) => {
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
};

// Updates the document title, meta description, Open Graph/Twitter tags and
// canonical link for the current route. Needed because this is a single
// index.html SPA — without this, every route would share the same tags.
export const useSEO = ({ title, description, path = "/" }) => {
  useEffect(() => {
    if (title) {
      document.title = title;
      setMeta("property", "og:title", title);
      setMeta("name", "twitter:title", title);
    }
    if (description) {
      setMeta("name", "description", description);
      setMeta("property", "og:description", description);
      setMeta("name", "twitter:description", description);
    }

    const canonicalUrl = `${SITE_URL}${path}`;
    setMeta("property", "og:url", canonicalUrl);

    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", canonicalUrl);
  }, [title, description, path]);
};
