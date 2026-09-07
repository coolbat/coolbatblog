export type Site = {
  website: string;
  author: string;
  profile: string;
  desc: string;
  title: string;
  ogImage?: string;
  lightAndDarkMode: boolean;
  postPerIndex: number;
  postPerPage: number;
  scheduledPostMargin: number;
  showArchives?: boolean;
  editPost?: {
    url?: URL["href"];
    text?: string;
    appendFilePath?: boolean;
  };
};

export type SocialObjects = {
  name: string;
  href: string;
  active: boolean;
  linkTitle: string;
}[];

export type Project = {
  id?: string;
  title: string;
  description: string;
  link: string;
  image: string;
  tags: string[];
  featured?: boolean;
  order?: number;
  status?: "live" | "beta" | "archived";
  visibility?: "public" | "private";
  imagePosition?: string;
  imageFit?: "cover" | "contain";
};
