import { Link } from "react-router-dom";

// The mark is the same file the browser tab uses, so the tab icon, header and
// footer stay in sync. It lives in /public, so it is referenced by absolute
// path (never imported/bundled).
const LOGO_SRC = "/koda-atlas-logo.svg";

// Icon + wordmark lockup. The icon is decorative here (alt="") because the
// visible "Koda Atlas" text already names the brand — giving both a label
// would make screen readers announce it twice.
export const Logo = ({ size = 32, className = "" }) => (
  <span className={`flex items-center gap-3 ${className}`}>
    <img
      src={LOGO_SRC}
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      decoding="async"
      className="block shrink-0"
      style={{ width: size, height: size }}
    />
    <span className="flex items-baseline gap-0.5">
      <span className="text-xl font-bold tracking-tight text-gray-900">
        Koda Atlas
      </span>
      <span className="w-1.5 h-1.5 shrink-0 rounded-full bg-indigo-600 translate-y-[-2px]" />
    </span>
  </span>
);

/** Lockup wrapped in a link back to the homepage. */
export const LogoLink = ({ size, className = "", onClick }) => (
  <Link to="/" onClick={onClick} className={`inline-flex ${className}`}>
    <Logo size={size} />
  </Link>
);

export default Logo;
