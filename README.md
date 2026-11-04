# NFS Cabs Website (Vite + React)
npm install → npm run dev → npm run build
- Business details, cities, cars, tariff, reviews, FAQs: `src/data.js`
- Images: put files in `public/images/` and set paths in `IMG` in `src/data.js` (empty = dummy placeholder)
- Deploy: build `dist/`; configure host to rewrite all routes to `index.html` (Netlify: `public/_redirects` is included)
