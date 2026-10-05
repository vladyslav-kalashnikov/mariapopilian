export const publicPagePaths = {
  home: "/",
  about: "/about",
  portfolio: "/portfolio",
  press: "/press",
  contact: "/contact",
} as const;

export type PublicPageId = keyof typeof publicPagePaths;

const pageByPath = Object.entries(publicPagePaths).reduce<Record<string, PublicPageId>>(
  (accumulator, [page, pathname]) => {
    accumulator[pathname] = page as PublicPageId;
    return accumulator;
  },
  {},
);

export function pageToPath(page: PublicPageId) {
  return publicPagePaths[page];
}

export function normalizePageId(page: string): PublicPageId {
  return page in publicPagePaths ? (page as PublicPageId) : "home";
}

export function pathnameToPage(pathname: string): PublicPageId {
  // Сторінки цінностей — частина розділу «Про Марію»
  if (valueSlugFromPath(pathname)) return "about";
  return pageByPath[pathname] ?? "home";
}

/** /values/<slug> → slug (сторінка окремої цінності) */
export function valueSlugFromPath(pathname: string) {
  const match = pathname.match(/^\/values\/([a-z0-9-]+)\/?$/);
  return match ? match[1] : null;
}

export function valuePath(slug: string) {
  return `/values/${slug}`;
}

export function isAdminPath(pathname: string) {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}
