import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import AuditLogger from './components/class/AuditLogger.jsx'
import ProductForm from './components/functional/ProductForm.jsx'
import ProductList from './components/functional/ProductList.jsx'
import CardWrapper from './components/functional/CardWrapper.jsx'
import { ThemeContext, ThemeProvider } from './context/ThemeContext.jsx'

const PRODUCTS_KEY = 'inventoryProducts'

const sampleProducts = [
  { id: 'sample-1', name: 'Wireless Headphones', category: 'Electronics', price: 79.99, quantity: 18, status: 'Active' },
  { id: 'sample-2', name: 'Canvas Backpack', category: 'Accessories', price: 42.5, quantity: 4, status: 'Active' },
  { id: 'sample-3', name: 'Ceramic Coffee Mug', category: 'Home', price: 14.0, quantity: 0, status: 'Active' },
  { id: 'sample-4', name: 'Desk Lamp', category: 'Home', price: 35.99, quantity: 12, status: 'Inactive' },
]

function loadProducts() {
  try {
    const savedProducts = localStorage.getItem(PRODUCTS_KEY)
    return savedProducts === null ? sampleProducts : JSON.parse(savedProducts)
  } catch {
    return sampleProducts
  }
}

function createId() {
  return globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`
}

function Dashboard() {
  const { theme, toggleTheme } = useContext(ThemeContext)
  const [products, setProducts] = useState(loadProducts)
  const [latestLog, setLatestLog] = useState(null)

  const metrics = useMemo(() => {
    const activeProducts = products.filter((product) => product.status === 'Active')
    const totalUnits = products.reduce((total, product) => total + Number(product.quantity), 0)
    const lowStock = products.filter(
      (product) => product.quantity > 0 && product.quantity <= 5,
    ).length
    const outOfStock = products.filter((product) => product.quantity === 0).length

    return {
      productCount: products.length,
      activeCount: activeProducts.length,
      totalUnits,
      attentionCount: lowStock + outOfStock,
    }
  }, [products])

  useEffect(() => {
    try {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products))
    } catch {
      // Inventory remains available in app state if browser storage is unavailable.
    }
  }, [products])

  useEffect(() => {
    document.title = `Inventory Dashboard (${metrics.activeCount} active)`
  }, [metrics.activeCount])

  const addProduct = useCallback((productDetails) => {
    const product = { ...productDetails, id: createId() }
    setProducts((currentProducts) => [product, ...currentProducts])
    setLatestLog({
      id: createId(),
      action: 'Product added',
      details: product.name,
      message: `${product.name} added to inventory`,
      timestamp: new Date().toISOString(),
    })
  }, [])

  const deleteProduct = useCallback((productId) => {
    const product = products.find((item) => item.id === productId)
    if (!product) return

    setProducts((currentProducts) => currentProducts.filter((item) => item.id !== productId))
    setLatestLog({
      id: createId(),
      action: 'Product deleted',
      details: product.name,
      message: `${product.name} removed from inventory`,
      timestamp: new Date().toISOString(),
    })
  }, [products])

  const changeStock = useCallback((productId, change) => {
    const product = products.find((item) => item.id === productId)
    if (!product) return
    const nextQuantity = Math.max(0, Number(product.quantity) + change)
    if (nextQuantity === Number(product.quantity)) return

    setProducts((currentProducts) => currentProducts.map((item) =>
      item.id === productId ? { ...item, quantity: nextQuantity } : item,
    ))
    setLatestLog({
      id: createId(),
      action: 'Stock updated',
      details: `${product.name}: ${product.quantity} to ${nextQuantity}`,
      message: `Stock updated for ${product.name}`,
      timestamp: new Date().toISOString(),
    })
  }, [products])

  const toggleProductStatus = useCallback((productId) => {
    const product = products.find((item) => item.id === productId)
    if (!product) return

    const nextStatus = product.status === 'Active' ? 'Inactive' : 'Active'
    setProducts((currentProducts) => currentProducts.map((item) =>
      item.id === productId ? { ...item, status: nextStatus } : item,
    ))
    setLatestLog({
      id: createId(),
      action: 'Product status changed',
      details: `${product.name}: ${product.status} to ${nextStatus}`,
      message: `${product.name} marked ${nextStatus.toLowerCase()}`,
      timestamp: new Date().toISOString(),
    })
  }, [products])

  return (
    <div className={`app-shell ${theme}`}>
      <main className="page-container">
        <header className="app-header">
          <a className="brand" href="#top" aria-label="Stockroom home">
            <span className="brand-mark" aria-hidden="true">S</span>
            <span>Stockroom</span>
          </a>
          <button className="theme-button" type="button" onClick={toggleTheme}>
            <span aria-hidden="true">{theme === 'light' ? '☾' : '☀'}</span>
            {theme === 'light' ? 'Dark mode' : 'Light mode'}
          </button>
        </header>

        <section className="welcome-row" id="top">
          <div>
            <p className="eyebrow">OVERVIEW</p>
            <h1>Inventory dashboard</h1>
            <p className="welcome-copy">A simple place to keep an eye on your products and stock.</p>
          </div>
          <span className="date-label">Inventory at a glance</span>
        </section>

        <section className="metrics-grid" aria-label="Inventory summary">
          <CardWrapper className="metric-card">
            <span className="metric-icon blue" aria-hidden="true">▦</span>
            <p>Total products</p>
            <strong>{metrics.productCount}</strong>
          </CardWrapper>
          <CardWrapper className="metric-card">
            <span className="metric-icon green" aria-hidden="true">✓</span>
            <p>Active products</p>
            <strong>{metrics.activeCount}</strong>
          </CardWrapper>
          <CardWrapper className="metric-card">
            <span className="metric-icon purple" aria-hidden="true">▤</span>
            <p>Units in stock</p>
            <strong>{metrics.totalUnits}</strong>
          </CardWrapper>
          <CardWrapper className="metric-card">
            <span className="metric-icon orange" aria-hidden="true">!</span>
            <p>Need attention</p>
            <strong>{metrics.attentionCount}</strong>
          </CardWrapper>
        </section>

        <div className="content-layout">
          <ProductForm onAddProduct={addProduct} />
          <div className="main-column">
            <ProductList
              products={products}
              onDelete={deleteProduct}
              onStockChange={changeStock}
              onToggleStatus={toggleProductStatus}
            />
            <AuditLogger latestLog={latestLog} />
          </div>
        </div>

        <footer className="app-footer">Stockroom · Inventory made simple</footer>
      </main>
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <Dashboard />
    </ThemeProvider>
  )
}

export default App
