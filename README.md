# Nova Store – Sample Web App

A simple static web shop for test automation demos (Tosca Cloud). No build step, no backend.

- `index.html` – product list (search, add to cart)
- `cart.html` – cart (quantity +/−, remove, clear, checkout)
- Cart is stored in browser `localStorage` (key `nova-cart`).

## Run locally
Open `index.html` in a browser, or: `python -m http.server 8000`

## Deploy to GitHub Pages
1. Push these files to the root of the `main` branch.
2. Repo → **Settings → Pages** → Source: *Deploy from a branch* → `main` / `(root)` → Save.
3. App URL: `https://adaru-tricentis.github.io/SampleWebApp/`

## Test automation hooks
Every interactive element has a stable `id` and `data-testid`:

| Element | id / data-testid |
|---|---|
| Cart badge | `cart-count` |
| Search | `search` |
| Product card | `product-<id>` / `product-card` |
| Add to cart | `add-<id>` / `add-to-cart` |
| Cart row | `cart-item-<id>` / `cart-item` |
| Qty +/− | `increase-<id>`, `decrease-<id>` |
| Quantity | `qty-<id>` |
| Remove | `remove-<id>` |
| Totals | `summary-items`, `summary-subtotal`, `summary-total` |
| Checkout / Clear | `checkout-btn`, `clear-cart-btn` |
| Order confirmation | `order-success`, `order-number` |

Product ids: `p1`–`p8`.
