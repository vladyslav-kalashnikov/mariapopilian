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
  return pageByPath[pathname] ?? "home";
}

export function isAdminPath(pathname: string) {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}
