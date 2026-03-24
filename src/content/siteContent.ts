import defaultSiteContentData from "./defaultSiteContent.json";

export type NavigationLink = {
  id: string;
  label: string;
};

export type SocialLink = {
  id: string;
  label: string;
  url: string;
};

export type HighlightItem = {
  label: string;
  value: string;
};

export type StatItem = {
  value: string;
  label: string;
};

export type ServiceItem = {
  num: string;
  title: string;
  desc: string;
};

export type BrandValue = {
  num: string;
  title: string;
  description: string;
};

export type TimelineItem = {
  year: string;
  title: string;
  description: string;
  details: string;
};

export type GalleryItem = {
  id: string;
  imageUrl: string;
  altText: string;
  category: string;
  title: string;
};

export type ReelItem = {
  id: string;
  imageUrl: string;
  altText: string;
  title: string;
  duration: string;
};

export type PressItem = {
  year: string;
  magazine: string;
  title: string;
  category: string;
  url: string;
};

export type JournalItem = {
  id: string;
  imageUrl: string;
  altText: string;
  date: string;
  title: string;
  href: string;
  ctaLabel: string;
};

export type ContactMethod = {
  label: string;
  value: string;
  href: string;
};

export type SiteContent = {
  navigation: {
    logoPrimary: string;
    logoAccent: string;
    links: NavigationLink[];
    socialLinks: SocialLink[];
  };
  footer: {
    copyright: string;
    ctaLabel: string;
    cmsLabel: string;
  };
  hero: {
    badge: string;
    firstName: string;
    lastName: string;
    roles: string[];
    ctaLabel: string;
    highlights: HighlightItem[];
  };
  about: {
    watermark: string;
    eyebrow: string;
    headlineLines: string[];
    paragraphs: string[];
    stats: StatItem[];
  };
  services: {
    eyebrow: string;
    titleLine1: string;
    titleAccent: string;
    description: string;
    items: ServiceItem[];
  };
  personalBrand: {
    watermark: string;
    eyebrow: string;
    titleMain: string;
    titleAccent: string;
    values: BrandValue[];
    quote: string;
    quoteAuthor: string;
  };
  careerTimeline: {
    watermark: string;
    eyebrow: string;
    titleLine1: string;
    titleAccent: string;
    description: string;
    highlights: HighlightItem[];
    achievements: TimelineItem[];
    quote: string;
    quoteAuthor: string;
  };
  charity: {
    eyebrow: string;
    titleLine1: string;
    titleAccent: string;
    paragraphs: string[];
    buttonLabel: string;
  };
  portfolio: {
    titleLine1: string;
    titleAccent: string;
    items: GalleryItem[];
  };
  reels: {
    eyebrow: string;
    titleLine1: string;
    titleAccent: string;
    moreLabel: string;
    moreUrl: string;
    items: ReelItem[];
  };
  press: {
    watermark: string;
    eyebrow: string;
    titleLine1: string;
    titleAccent: string;
    items: PressItem[];
  };
  journal: {
    titlePrefix: string;
    titleAccent: string;
    eyebrow: string;
    items: JournalItem[];
  };
  contact: {
    watermark: string;
    eyebrow: string;
    titlePrefix: string;
    titleAccent: string;
    methods: ContactMethod[];
    form: {
      namePlaceholder: string;
      emailPlaceholder: string;
      detailsPlaceholder: string;
      submitLabel: string;
    };
    footerLeft: string;
    footerRight: string;
  };
};

export const defaultSiteContent = defaultSiteContentData as SiteContent;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function deepMerge<T>(target: T, source: unknown): T {
  if (Array.isArray(target)) {
    return (Array.isArray(source) ? source : target) as T;
  }

  if (!isPlainObject(target) || !isPlainObject(source)) {
    return (source ?? target) as T;
  }

  const next = { ...target } as Record<string, unknown>;

  for (const key of Object.keys(source)) {
    const sourceValue = source[key];
    const targetValue = next[key];

    if (Array.isArray(sourceValue)) {
      next[key] = sourceValue;
      continue;
    }

    if (isPlainObject(targetValue) && isPlainObject(sourceValue)) {
      next[key] = deepMerge(targetValue, sourceValue);
      continue;
    }

    next[key] = sourceValue;
  }

  return next as T;
}

export function cloneSiteContent(content: SiteContent = defaultSiteContent) {
  return JSON.parse(JSON.stringify(content)) as SiteContent;
}

export function mergeSiteContent(content: unknown) {
  return deepMerge(cloneSiteContent(defaultSiteContent), content);
}
