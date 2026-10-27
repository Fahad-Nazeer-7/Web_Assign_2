import CardWrapper from './CardWrapper.jsx'

function ProductCard({ product, onDelete, onStockChange, onToggleStatus }) {
  const stockStatus =
    product.quantity === 0
      ? 'Out of Stock'
      : product.quantity <= 5
        ? 'Low Stock'
        : 'In Stock'

  return (
    <CardWrapper className="product-card">
      <div className="product-card-top">
        <div className="product-icon" aria-hidden="true">
          {product.name.charAt(0).toUpperCase()}
        </div>
        <button
          className="icon-button delete-button"
          type="button"
          onClick={() => onDelete(product.id)}
          aria-label={`Delete ${product.name}`}
          title="Delete product"
        >
          ×
        </button>
      </div>
      <p className="product-category">{product.category}</p>
      <h3>{product.name}</h3>
      <div className="product-info-row">
        <span className={`stock-badge ${stockStatus.toLowerCase().replaceAll(' ', '-')}`}>
          {stockStatus}
        </span>
        <button
          className={`status-label status-toggle ${product.status.toLowerCase()}`}
          type="button"
          onClick={() => onToggleStatus(product.id)}
          aria-label={`Mark ${product.name} as ${product.status === 'Active' ? 'Inactive' : 'Active'}`}
          title="Click to change product status"
        >
          {product.status}
        </button>
      </div>
      <div className="product-card-bottom">
        <div>
          <span className="muted-label">Price</span>
          <strong>${Number(product.price).toFixed(2)}</strong>
        </div>
        <div className="quantity-control">
          <span className="muted-label">Stock</span>
          <div className="quantity-buttons">
            <button
              className="icon-button"
              type="button"
              onClick={() => onStockChange(product.id, -1)}
              disabled={product.quantity <= 0}
              aria-label={`Remove one ${product.name} from stock`}
            >
              −
            </button>
            <strong>{product.quantity}</strong>
            <button
              className="icon-button"
              type="button"
              onClick={() => onStockChange(product.id, 1)}
              aria-label={`Add one ${product.name} to stock`}
            >
              +
            </button>
          </div>
        </div>
      </div>
    </CardWrapper>
  )
}

export default ProductCard
