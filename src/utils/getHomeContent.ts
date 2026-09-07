import type { CollectionEntry } from "astro:content";
import type { Project } from "../types";
import postFilter from "./postFilter";

export function getFeaturedProjects(projects: Project[]) {
  return projects
    .filter(project => project.featured)
    .sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity))
    .slice(0, 4);
}

export function getLatestWriting(posts: CollectionEntry<"blog">[]) {
  return posts
    .filter(post => post.data.showOnHome && postFilter(post))
    .sort((a, b) => b.data.pubDatetime.getTime() - a.data.pubDatetime.getTime())
    .slice(0, 4);
}

export function formatHomeDate(date: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(date)
    .replaceAll("-", ".");
}
