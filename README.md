# Inventory Dashboard

This project is a small inventory dashboard made with React and Vite. It lets a user add products, change stock quantities, remove products, filter the list, and review recent activity. Product data and audit entries are saved in the browser's local storage.

## CSR and SSR for an e-commerce dashboard

Client-Side Rendering (CSR) and Server-Side Rendering (SSR) differ in where the page is assembled. In a standard Vite and React application, the server sends a small HTML file and JavaScript bundles. The browser runs the JavaScript, then React builds the page. This dashboard uses CSR. After the first visit, navigation and updates can feel quick because React changes the page without requesting a new HTML document. The first load can take longer on a slow connection because the browser must run the application code before showing the full interface.

With SSR, a server runs the application for a request and sends HTML containing the page content. The browser can display text sooner, then download JavaScript to make buttons and forms interactive. This can help search engines read product pages and improve the first impression. SSR needs more server work: teams must consider server capacity, caching, and hosting costs. CSR can be hosted as static files on a content delivery network, which is often simpler and less expensive, but search visibility and first load may need extra attention.

For an enterprise e-commerce site, the choice depends on the pages. Public product and category pages often benefit from SSR because they need to be discoverable and show content quickly. A private inventory dashboard is usually behind a login and changes frequently, so CSR is practical: search engines do not need to index it, and staff can stay in the interface while working. A larger application can combine approaches, using SSR for the storefront and CSR for staff tools. The trade-off is added complexity: teams must maintain server and browser rendering and handle data loading carefully.

## Run locally

```sh
npm install
npm run dev
```
