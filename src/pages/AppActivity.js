import { useState, useEffect } from 'react';

const BASE = '/sap/opu/odata4/sap/zftx_analytics_srv/srvd/sap/zftx_analytics_srd/0001';

const fmt = (ts) => {
  if (!ts) return '-';
  const s = Math.floor(ts).toString();
  if (s.length < 14) return s;
  return `${s.slice(6,8)}/${s.slice(4,6)}/${s.slice(0,4)}`;
};

function AppActivity({ navigate }) {
  const [data, setData]             = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [filterApp, setFilterApp]   = useState('');
  const [filterSystem, setFilterSystem] = useState('');
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    fetch(`${BASE}/ZFTX_C_APP_ACTIVITY?sap-client=100&$orderby=total_launches desc`)
      .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(j => { setData(j.value || []); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  }, []);

  const filtered = data.filter(r => {
    const matchApp    = r.app_id?.toLowerCase().includes(filterApp.toLowerCase());
    const matchSystem = r.system_id?.toLowerCase().includes(filterSystem.toLowerCase());
    const matchDate   = filterDate ? fmt(r.last_used_ts).includes(filterDate) : true;
    return matchApp && matchSystem && matchDate;
  });

  const totalLaunches = filtered.reduce((s, r) => s + (r.total_launches || 0), 0);
  const totalUsers    = filtered.reduce((s, r) => s + (r.unique_users || 0), 0);
  const totalApps     = filtered.length;

  const clearFilters = () => {
    setFilterApp('');
    setFilterSystem('');
    setFilterDate('');
  };

  return (
    <div style={{ padding: '20px', background: '#fff', minHeight: '100vh' }}>
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate('home')}>← Back</button>
        <div>
          <h1>App Activity</h1>
          <p>Application usage and launch statistics</p>
        </div>
        <span className="count-badge">{totalApps} Apps</span>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
        {[
          { label: 'Total Apps',     value: totalApps,                     color: '#0070f3' },
          { label: 'Total Launches', value: totalLaunches.toLocaleString(), color: '#00a36c' },
          { label: 'Unique Users',   value: totalUsers.toLocaleString(),    color: '#8e44ad' }
        ].map(card => (
          <div key={card.label} style={{
            flex: 1, background: '#fff', border: `2px solid ${card.color}`,
            borderRadius: '8px', padding: '16px', textAlign: 'center',
            boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
          }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: card.color }}>
              {card.value}
            </div>
            <div style={{ fontSize: '13px', color: '#777', marginTop: '4px' }}>
              {card.label}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        display: 'flex', gap: '12px', marginBottom: '20px',
        background: '#f8f9fa', padding: '14px', borderRadius: '8px',
        alignItems: 'flex-end', flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '12px', color: '#555', fontWeight: 'bold' }}>App ID</label>
          <input className="search-input" placeholder="Search App ID..."
            value={filterApp} onChange={e => setFilterApp(e.target.value)}
            style={{ width: '200px' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '12px', color: '#555', fontWeight: 'bold' }}>System</label>
          <input className="search-input" placeholder="Search System..."
            value={filterSystem} onChange={e => setFilterSystem(e.target.value)}
            style={{ width: '160px' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '12px', color: '#555', fontWeight: 'bold' }}>Last Accessed</label>
          <input type="date" className="search-input"
            value={filterDate} onChange={e => setFilterDate(e.target.value)}
            style={{ width: '180px' }} />
        </div>
        <button onClick={clearFilters} style={{
          padding: '8px 16px', background: '#e0e0e0', border: '1px solid #ccc',
          borderRadius: '4px', cursor: 'pointer', fontSize: '13px'
        }}>Clear Filters</button>
      </div>

      {loading && <div className="loading"><div className="spinner"></div><p>Loading...</p></div>}
      {error   && <div className="error-box">Error: {error}</div>}

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
                <th>Last Accessed</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0
                ? <tr><td colSpan="7" className="no-data">No records found</td></tr>
                : filtered.map((r, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'row-even' : 'row-odd'}>
                    <td><span style={{
                      background: '#e8f0fe', color: '#0070f3',
                      padding: '2px 8px', borderRadius: '4px',
                      fontSize: '12px', fontWeight: 'bold'
                    }}>{r.app_id || '-'}</span></td>
                    <td>{r.app_name || '-'}</td>
                    <td>{r.module_name || '-'}</td>
                    <td><span className="tag green">{r.system_id}</span></td>
                    <td className="num" style={{ color: '#e74c3c', fontWeight: 'bold' }}>
                      {r.total_launches?.toLocaleString()}
                    </td>
                    <td className="num">{r.unique_users}</td>
                    <td className="ts">{fmt(r.last_used_ts)}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AppActivity;