import { useMemo, useState } from 'react'
import CardWrapper from './CardWrapper.jsx'
import ProductCard from './ProductCard.jsx'

function ProductList({ products, onDelete, onStockChange, onToggleStatus }) {
  const [categoryFilter, setCategoryFilter] = useState('All categories')
  const [stockFilter, setStockFilter] = useState('All stock')

  const categories = useMemo(
    () => [...new Set(products.map((product) => product.category))].sort(),
    [products],
  )

  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        const categoryMatches =
          categoryFilter === 'All categories' || product.category === categoryFilter
        const stockStatus =
          product.quantity === 0
            ? 'Out of Stock'
            : product.quantity <= 5
              ? 'Low Stock'
              : 'In Stock'
        const stockMatches = stockFilter === 'All stock' || stockStatus === stockFilter
        return categoryMatches && stockMatches
      }),
    [products, categoryFilter, stockFilter],
  )

  return (
    <CardWrapper className="inventory-card">
      <div className="inventory-heading">
        <div>
          <p className="eyebrow">YOUR CATALOG</p>
          <h2>Inventory</h2>
          <p className="muted-copy">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </div>
        <div className="filters">
          <label className="visually-hidden" htmlFor="category-filter">Filter by category</label>
          <select
            id="category-filter"
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
          >
            <option>All categories</option>
            {categories.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
          <label className="visually-hidden" htmlFor="stock-filter">Filter by stock</label>
          <select
            id="stock-filter"
            value={stockFilter}
            onChange={(event) => setStockFilter(event.target.value)}
          >
            <option>All stock</option>
            <option>In Stock</option>
            <option>Low Stock</option>
            <option>Out of Stock</option>
          </select>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon" aria-hidden="true">□</span>
          <h3>{products.length === 0 ? 'No products yet' : 'No matching products'}</h3>
          <p>
            {products.length === 0
              ? 'Add your first product using the form.'
              : 'Try changing the filters to see more products.'}
          </p>
        </div>
      ) : (
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onDelete={onDelete}
              onStockChange={onStockChange}
              onToggleStatus={onToggleStatus}
            />
          ))}
        </div>
      )}
    </CardWrapper>
  )
}

export default ProductList
