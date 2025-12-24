import type { Drug } from '../types';

/**
 * Normalize string for search (lowercase, remove special characters)
 */
function normalizeString(str: string): string {
  return str.toLowerCase().trim();
}

/**
 * Check if a drug matches a search query
 */
export function matchesDrug(drug: Drug, query: string): boolean {
  const normalizedQuery = normalizeString(query);

  if (!normalizedQuery) return true;

  // Check English generic name (성분명)
  if (normalizeString(drug.name_en).includes(normalizedQuery)) {
    return true;
  }

  // Check Korean name (한글 성분명)
  if (drug.name_kr.includes(query)) {
    return true;
  }

  // Check Korean brand names (한글 상품명)
  if (drug.brand_names_kr.some(brand => brand.includes(query))) {
    return true;
  }

  // Check English brand names (영문 상품명)
  if (drug.brand_names_en?.some(brand => normalizeString(brand).includes(normalizedQuery))) {
    return true;
  }

  // Check drug class
  if (normalizeString(drug.drug_class).includes(normalizedQuery)) {
    return true;
  }

  // Check English drug class
  if (drug.drug_class_en && normalizeString(drug.drug_class_en).includes(normalizedQuery)) {
    return true;
  }

  return false;
}

/**
 * Filter drugs by search query
 */
export function filterDrugs(drugs: Drug[], query: string): Drug[] {
  if (!query.trim()) return drugs;
  return drugs.filter(drug => matchesDrug(drug, query));
}

/**
 * Sort drugs by relevance to query
 */
export function sortByRelevance(drugs: Drug[], query: string): Drug[] {
  const normalizedQuery = normalizeString(query);

  if (!normalizedQuery) return drugs;

  return [...drugs].sort((a, b) => {
    // Exact English name match gets highest priority (성분명 정확히 일치)
    const aExactEn = normalizeString(a.name_en) === normalizedQuery;
    const bExactEn = normalizeString(b.name_en) === normalizedQuery;
    if (aExactEn && !bExactEn) return -1;
    if (!aExactEn && bExactEn) return 1;

    // Exact Korean name match (한글명 정확히 일치)
    const aExactKr = a.name_kr === query;
    const bExactKr = b.name_kr === query;
    if (aExactKr && !bExactKr) return -1;
    if (!aExactKr && bExactKr) return 1;

    // English name starts with query (영문 성분명이 쿼리로 시작)
    const aStartsEn = normalizeString(a.name_en).startsWith(normalizedQuery);
    const bStartsEn = normalizeString(b.name_en).startsWith(normalizedQuery);
    if (aStartsEn && !bStartsEn) return -1;
    if (!aStartsEn && bStartsEn) return 1;

    // Korean name starts with query (한글명이 쿼리로 시작)
    const aStartsKr = a.name_kr.startsWith(query);
    const bStartsKr = b.name_kr.startsWith(query);
    if (aStartsKr && !bStartsKr) return -1;
    if (!aStartsKr && bStartsKr) return 1;

    // English brand name match (영문 상품명 일치)
    const aEnBrandMatch = a.brand_names_en?.some(brand => normalizeString(brand).includes(normalizedQuery)) ?? false;
    const bEnBrandMatch = b.brand_names_en?.some(brand => normalizeString(brand).includes(normalizedQuery)) ?? false;
    if (aEnBrandMatch && !bEnBrandMatch) return -1;
    if (!aEnBrandMatch && bEnBrandMatch) return 1;

    // Korean brand name match (한글 상품명 일치)
    const aBrandMatch = a.brand_names_kr.some(brand => brand.includes(query));
    const bBrandMatch = b.brand_names_kr.some(brand => brand.includes(query));
    if (aBrandMatch && !bBrandMatch) return -1;
    if (!aBrandMatch && bBrandMatch) return 1;

    // Default: alphabetical by Korean name
    return a.name_kr.localeCompare(b.name_kr, 'ko');
  });
}

/**
 * Get highlighted text with search query
 */
export function highlightMatch(text: string, query: string): { text: string; highlighted: boolean }[] {
  if (!query.trim()) {
    return [{ text, highlighted: false }];
  }

  const normalizedText = text.toLowerCase();
  const normalizedQuery = query.toLowerCase();
  const index = normalizedText.indexOf(normalizedQuery);

  if (index === -1) {
    return [{ text, highlighted: false }];
  }

  const parts: { text: string; highlighted: boolean }[] = [];

  if (index > 0) {
    parts.push({ text: text.slice(0, index), highlighted: false });
  }

  parts.push({ text: text.slice(index, index + query.length), highlighted: true });

  if (index + query.length < text.length) {
    parts.push({ text: text.slice(index + query.length), highlighted: false });
  }

  return parts;
}
