import { useState, useEffect } from 'react';
import './App.css';

const BASE_URL = '/sap/opu/odata4/sap/zftx_analytics_srv/srvd/sap/zftx_analytics_srd/0001';

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch(`${BASE_URL}/ZFTX_C_APP_ACTIVITY?sap-client=100&$orderby=total_launches desc`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch data: ' + res.status);
        return res.json();
      })
      .then(json => {
        setData(json.value || []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const formatTimestamp = (ts) => {
    if (!ts) return '-';
    const str = Math.floor(ts).toString();
    if (str.length < 14) return str;
    const y = str.slice(0, 4);
    const mo = str.slice(4, 6);
    const d = str.slice(6, 8);
    const h = str.slice(8, 10);
    const mi = str.slice(10, 12);
    const s = str.slice(12, 14);
    return `${d}/${mo}/${y} ${h}:${mi}:${s}`;
  };

  const filtered = data.filter(row =>
    row.app_id?.toLowerCase().includes(search.toLowerCase()) ||
    row.app_name?.toLowerCase().includes(search.toLowerCase()) ||
    row.system_id?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">

      <div className="page-header">
        <h2>App Activity</h2>
        <span className="badge">{filtered.length} Records</span>
      </div>

      <div className="toolbar">
        <input
          type="text"
          className="search-input"
          placeholder="Search by App ID, Name or System..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {loading && (
        <div className="status-box">
          <div className="spinner"></div>
          <p>Loading data...</p>
        </div>
      )}

      {error && (
        <div className="error-box">
          <p>Error: {error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>App ID</th>
                <th>App Name</th>
                <th>Module</th>
                <th>System</th>
                <th>Total Launches</th>
                <th>Unique Users</th>
                <th>Last Used</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="no-data">No records found</td>
                </tr>
              ) : (
                filtered.map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'row-even' : 'row-odd'}>
                    <td><span className="app-id">{row.app_id || '-'}</span></td>
                    <td>{row.app_name || '-'}</td>
                    <td>{row.module_name || '-'}</td>
                    <td><span className="system-badge">{row.system_id || '-'}</span></td>
                    <td className="number">{row.total_launches ?? '-'}</td>
                    <td className="number">{row.unique_users ?? '-'}</td>
                    <td className="timestamp">{formatTimestamp(row.last_used_ts)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}

export default App;














// import { useState } from 'react';
// import './App.css';

// function App() {
//   const [form, setForm] = useState({
//     name: '',
//     price: '',
//     quantity: ''
//   });

//   const [submitted, setSubmitted] = useState(false);
//   const [errors, setErrors] = useState({});

//   const validate = () => {
//     let errs = {};
//     if (!form.name.trim()) errs.name = 'Product name is required';
//     if (!form.price || isNaN(form.price) || form.price <= 0)
//       errs.price = 'Enter a valid price';
//     if (!form.quantity || isNaN(form.quantity) || form.quantity <= 0)
//       errs.quantity = 'Enter a valid quantity';
//     return errs;
//   };

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//     setErrors({ ...errors, [e.target.name]: '' });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const errs = validate();
//     if (Object.keys(errs).length > 0) {
//       setErrors(errs);
//       return;
//     }
//     setSubmitted(true);
//   };

//   const handleReset = () => {
//     setForm({ name: '', price: '', quantity: '' });
//     setErrors({});
//     setSubmitted(false);
//   };

//   return (
//     <div className="container">
//       <h2 className="title">Product Form</h2>

//       {submitted ? (
//         <div className="success-box">
//           <h3>✅ Product Submitted Successfully!</h3>
//           <p><strong>Name:</strong> {form.name}</p>
//           <p><strong>Price:</strong> ${form.price}</p>
//           <p><strong>Quantity:</strong> {form.quantity}</p>
//           <button className="btn-reset" onClick={handleReset}>
//             Add Another Product
//           </button>
//         </div>
//       ) : (
//         <form onSubmit={handleSubmit} className="form">

//           <div className="form-group">
//             <label>Product Name</label>
//             <input
//               type="text"
//               name="name"
//               value={form.name}
//               onChange={handleChange}
//               placeholder="Enter product name"
//               className={errors.name ? 'input error' : 'input'}
//             />
//             {errors.name && <span className="error-msg">{errors.name}</span>}
//           </div>

//           <div className="form-group">
//             <label>Price ($)</label>
//             <input
//               type="number"
//               name="price"
//               value={form.price}
//               onChange={handleChange}
//               placeholder="Enter price"
//               className={errors.price ? 'input error' : 'input'}
//             />
//             {errors.price && <span className="error-msg">{errors.price}</span>}
//           </div>

//           <div className="form-group">
//             <label>Quantity</label>
//             <input
//               type="number"
//               name="quantity"
//               value={form.quantity}
//               onChange={handleChange}
//               placeholder="Enter quantity"
//               className={errors.quantity ? 'input error' : 'input'}
//             />
//             {errors.quantity && <span className="error-msg">{errors.quantity}</span>}
//           </div>

//           <div className="btn-group">
//             <button type="submit" className="btn-submit">Submit</button>
//             <button type="button" className="btn-reset" onClick={handleReset}>Reset</button>
//           </div>

//         </form>
//       )}
//     </div>
//   );
// }

// export default App;