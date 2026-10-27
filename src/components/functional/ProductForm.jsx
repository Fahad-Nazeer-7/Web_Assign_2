import { useRef, useState } from 'react'
import CardWrapper from './CardWrapper.jsx'

const emptyForm = {
  name: '',
  category: '',
  price: '',
  quantity: '',
  status: 'Active',
}

function ProductForm({ onAddProduct }) {
  const [form, setForm] = useState(emptyForm)
  const titleInputRef = useRef(null)

  function handleChange(event) {
    const { name, value } = event.target
    setForm((currentForm) => ({ ...currentForm, [name]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    onAddProduct({
      name: form.name.trim(),
      category: form.category.trim(),
      price: Number(form.price),
      quantity: Number(form.quantity),
      status: form.status,
    })
    setForm(emptyForm)
    titleInputRef.current?.focus()
  }

  return (
    <CardWrapper className="form-card">
      <div className="section-heading">
        <div>
          <p className="eyebrow">PRODUCTS</p>
          <h2>Add a product</h2>
        </div>
      </div>
      <form className="product-form" onSubmit={handleSubmit}>
        <label>
          Product name
          <input
            ref={titleInputRef}
            autoFocus
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Wireless headphones"
            required
            maxLength={80}
          />
        </label>
        <label>
          Category
          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="e.g. Electronics"
            required
            maxLength={40}
          />
        </label>
        <div className="form-row">
          <label>
            Price
            <div className="input-with-prefix">
              <span>$</span>
              <input
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={handleChange}
                placeholder="0.00"
                required
              />
            </div>
          </label>
          <label>
            Stock quantity
            <input
              name="quantity"
              type="number"
              min="0"
              step="1"
              value={form.quantity}
              onChange={handleChange}
              placeholder="0"
              required
            />
          </label>
        </div>
        <label>
          Status
          <select name="status" value={form.status} onChange={handleChange}>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </label>
        <button className="button button-primary add-button" type="submit">
          Add product
        </button>
      </form>
    </CardWrapper>
  )
}

export default ProductForm
