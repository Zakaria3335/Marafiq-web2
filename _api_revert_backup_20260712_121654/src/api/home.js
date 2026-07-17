import { apiFetch } from "./client";

export function getBanner() {
  return apiFetch("/api/v1/home-page/banner");
}

export function getAboutUs() {
  return apiFetch("/api/v1/home-page/about-us");
}

export function getHomeServices() {
  return apiFetch("/api/v1/home-page/services");
}

export function getMediaCenter() {
  return apiFetch("/api/v1/home-page/media-center");
}

export function getHomepageFaqs() {
  return apiFetch("/api/v1/home-page/homepage-faqs");
}
