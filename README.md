# NFS Cabs Website (Vite + React)
npm install → npm run dev → npm run build
- Business details, cities, cars, tariff, reviews, FAQs: `src/data.js`
- Images: put files in `public/images/` and set paths in `IMG` in `src/data.js` (empty = dummy placeholder)
- Deploy: build `dist/`; configure host to rewrite all routes to `index.html` (Netlify: `public/_redirects` is included)
- SEO: page metadata and LocalBusiness structured data are managed in `src/seo.js`. If the production domain changes, update `SITE.url` in `src/data.js` and the matching URLs in `index.html`, `public/robots.txt`, and `public/sitemap.xml`.
