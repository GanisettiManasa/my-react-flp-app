import { useState } from 'react';
import './App.css';

function App() {
  const [form, setForm] = useState({
    name: '',
    price: '',
    quantity: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    let errs = {};
    if (!form.name.trim()) errs.name = 'Product name is required';
    if (!form.price || isNaN(form.price) || form.price <= 0)
      errs.price = 'Enter a valid price';
    if (!form.quantity || isNaN(form.quantity) || form.quantity <= 0)
      errs.quantity = 'Enter a valid quantity';
    return errs;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSubmitted(true);
  };

  const handleReset = () => {
    setForm({ name: '', price: '', quantity: '' });
    setErrors({});
    setSubmitted(false);
  };

  return (
    <div className="container">
      <h2 className="title">Product Form</h2>

      {submitted ? (
        <div className="success-box">
          <h3>✅ Product Submitted Successfully!</h3>
          <p><strong>Name:</strong> {form.name}</p>
          <p><strong>Price:</strong> ${form.price}</p>
          <p><strong>Quantity:</strong> {form.quantity}</p>
          <button className="btn-reset" onClick={handleReset}>
            Add Another Product
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="form">

          <div className="form-group">
            <label>Product Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter product name"
              className={errors.name ? 'input error' : 'input'}
            />
            {errors.name && <span className="error-msg">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label>Price ($)</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="Enter price"
              className={errors.price ? 'input error' : 'input'}
            />
            {errors.price && <span className="error-msg">{errors.price}</span>}
          </div>

          <div className="form-group">
            <label>Quantity</label>
            <input
              type="number"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              placeholder="Enter quantity"
              className={errors.quantity ? 'input error' : 'input'}
            />
            {errors.quantity && <span className="error-msg">{errors.quantity}</span>}
          </div>

          <div className="btn-group">
            <button type="submit" className="btn-submit">Submit</button>
            <button type="button" className="btn-reset" onClick={handleReset}>Reset</button>
          </div>

        </form>
      )}
    </div>
  );
}

export default App;