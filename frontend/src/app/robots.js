export default function robots() {
  const baseUrl = "http://localhost:8082"; // TODO: Replace with production domain

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/'], // Add any private routes here to prevent crawling
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
