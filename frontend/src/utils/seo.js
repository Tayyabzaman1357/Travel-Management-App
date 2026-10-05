// Lightweight SEO helper: sets document title + meta description

export function useSEO(title, description) {
  // Imported lazily to avoid SSR concerns — plain function style
  document.title = title
  let meta = document.querySelector('meta[name="description"]')
  if (description && meta) meta.setAttribute('content', description)
}

export function setMetaTags(title, description) {
  useSEO(title, description)
}
