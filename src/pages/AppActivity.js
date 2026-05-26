import { useState, useEffect, useRef, useCallback } from 'react';

const BASE = '/sap/opu/odata4/sap/zftx_analytics_srv/srvd/sap/zftx_analytics_srd/0001';

const COLORS = [
  '#0070f3','#00a36c','#e67e22','#8e44ad','#e74c3c',
  '#16a085','#2980b9','#f39c12','#27ae60','#c0392b',
  '#1abc9c','#9b59b6','#3498db','#2ecc71','#e91e63',
  '#ff5722','#607d8b','#795548','#009688','#ff9800'
];

const fmt = (ts) => {
  if (!ts) return '-';
  const s = Math.floor(ts).toString();
  if (s.length < 14) return s;
  return `${s.slice(6,8)}/${s.slice(4,6)}/${s.slice(0,4)}`;
};

// ── Modal ────────────────────────────────────────────
function Modal({ title, color, rows, type, loading, onClose }) {

  const fmtTs = (ts) => {
    if (!ts) return '-';
    const s = Math.floor(ts).toString();
    if (s.length < 14) return s;
    return `${s.slice(6,8)}/${s.slice(4,6)}/${s.slice(0,4)}`;
  };

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.55)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px'
    }}>
      <div style={{
        background: '#fff', borderRadius: '12px',
        width: '85%', maxWidth: '950px', maxHeight: '85vh',
        display: 'flex', flexDirection: 'column',
        boxShadow: '0 12px 40px rgba(0,0,0,0.25)'
      }}>

        {/* Header */}
        <div style={{
          background: color, padding: '14px 20px',
          borderRadius: '12px 12px 0 0',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '15px' }}>{title}</span>
          <button onClick={onClose} style={{
            background: 'rgba(255,255,255,0.25)', border: 'none',
            color: '#fff', width: '28px', height: '28px',
            borderRadius: '50%', cursor: 'pointer', fontSize: '14px'
          }}>✕</button>
        </div>

        {/* Body */}
        <div style={{ overflow: 'auto', flex: 1 }}>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>
              Loading...
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead style={{ position: 'sticky', top: 0 }}>
                <tr style={{ background: '#f5f5f5' }}>
                  {type === 'users'
                    ? ['User ID','System','Total Launches','Unique Apps','Last Activity','First Activity'].map(col => (
                        <th key={col} style={{
                          padding: '10px 14px',
                          textAlign: ['Total Launches','Unique Apps'].includes(col) ? 'right' : 'left',
                          color: color, fontWeight: '700', fontSize: '12px',
                          borderBottom: `2px solid ${color}`
                        }}>{col}</th>
                      ))
                    : ['App ID','System','Launches','Users','Last Accessed'].map(col => (
                        <th key={col} style={{
                          padding: '10px 14px',
                          textAlign: ['Launches','Users'].includes(col) ? 'right' : 'left',
                          color: color, fontWeight: '700', fontSize: '12px',
                          borderBottom: `2px solid ${color}`
                        }}>{col}</th>
                      ))
                  }
                </tr>
              </thead>
              <tbody>
                {rows.length === 0
                  ? <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#999' }}>No records found</td></tr>
                  : rows.map((r, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#fafafa', borderBottom: '1px solid #eee' }}>
                      {type === 'users' ? (
                        <>
                          <td style={{ padding: '8px 14px' }}>
                            <span style={{ background: '#f5eef8', color: '#8e44ad', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                              {r.user_id || '-'}
                            </span>
                          </td>
                          <td style={{ padding: '8px 14px' }}>
                            <span style={{ background: '#e8f5e9', color: '#2e7d32', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>
                              {r.system_id}
                            </span>
                          </td>
                          <td style={{ padding: '8px 14px', textAlign: 'right', fontWeight: 'bold', color: '#e74c3c' }}>{r.total_launches?.toLocaleString()}</td>
                          <td style={{ padding: '8px 14px', textAlign: 'right', color: '#0070f3', fontWeight: 'bold' }}>{r.unique_apps_used}</td>
                          <td style={{ padding: '8px 14px', fontSize: '12px', color: '#666' }}>{fmtTs(r.last_activity_ts)}</td>
                          <td style={{ padding: '8px 14px', fontSize: '12px', color: '#666' }}>{r.first_activity_date}</td>
                        </>
                      ) : (
                        <>
                          <td style={{ padding: '8px 14px' }}>
                            <span style={{ background: '#e8f0fe', color: '#0070f3', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                              {r.app_id || '-'}
                            </span>
                          </td>
                          <td style={{ padding: '8px 14px' }}>
                            <span style={{ background: '#e8f5e9', color: '#2e7d32', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>
                              {r.system_id}
                            </span>
                          </td>
                          <td style={{ padding: '8px 14px', textAlign: 'right', fontWeight: 'bold', color: '#e74c3c' }}>{r.total_launches?.toLocaleString()}</td>
                          <td style={{ padding: '8px 14px', textAlign: 'right', color: '#8e44ad', fontWeight: 'bold' }}>{r.unique_users}</td>
                          <td style={{ padding: '8px 14px', fontSize: '12px', color: '#666' }}>{fmt(r.last_used_ts)}</td>
                        </>
                      )}
                    </tr>
                  ))
                }
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '12px 20px', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', color: '#777' }}>{rows.length} records</span>
          <button onClick={onClose} style={{ padding: '7px 20px', background: color, color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>Close</button>
        </div>

      </div>
    </div>
  );
}

// ── Donut Chart ──────────────────────────────────────
function DonutChart({ data }) {
  const canvasRef   = useRef(null);
  const [tooltip, setTooltip] = useState(null);
  const segmentsRef = useRef([]);

  const draw = useCallback((hi = -1) => {
    const canvas = canvasRef.current;
    if (!canvas || !data.length) return;
    const ctx    = canvas.getContext('2d');
    const cx     = canvas.width / 2;
    const cy     = canvas.height / 2;
    const radius = Math.min(canvas.width, canvas.height) / 2 - 10;
    const inner  = radius * 0.52;
    const total  = data.reduce((s, d) => s + d.value, 0);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    segmentsRef.current = [];
    let startAngle = -Math.PI / 2;

    data.forEach((item, i) => {
      const slice = (item.value / total) * 2 * Math.PI;
      const end   = startAngle + slice;
      const off   = i === hi ? 7 : 0;
      const mid   = startAngle + slice / 2;

      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(mid)*off, cy + Math.sin(mid)*off);
      ctx.arc(cx + Math.cos(mid)*off, cy + Math.sin(mid)*off, radius, startAngle, end);
      ctx.lineTo(cx + Math.cos(mid)*off, cy + Math.sin(mid)*off);
      ctx.closePath();
      ctx.fillStyle   = COLORS[i % COLORS.length];
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth   = 1.5;
      ctx.stroke();

      segmentsRef.current.push({ startAngle, endAngle: end, item, color: COLORS[i % COLORS.length] });
      startAngle = end;
    });

    ctx.beginPath();
    ctx.arc(cx, cy, inner, 0, 2 * Math.PI);
    ctx.fillStyle = '#fff';
    ctx.fill();

    ctx.fillStyle = '#222';
    ctx.textAlign = 'center';
    ctx.font      = 'bold 18px Arial';
    ctx.fillText(data.length, cx, cy - 4);
    ctx.font      = '11px Arial';
    ctx.fillStyle = '#888';
    ctx.fillText('Apps', cx, cy + 14);
  }, [data]);

  useEffect(() => { draw(); }, [draw]);

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect   = canvas.getBoundingClientRect();
    const x      = e.clientX - rect.left;
    const y      = e.clientY - rect.top;
    const cx     = canvas.width / 2;
    const cy     = canvas.height / 2;
    const dist   = Math.sqrt((x-cx)**2 + (y-cy)**2);
    const radius = Math.min(canvas.width, canvas.height) / 2 - 10;
    const inner  = radius * 0.52;

    if (dist < inner || dist > radius) { setTooltip(null); draw(-1); return; }

    let angle = Math.atan2(y-cy, x-cx);
    if (angle < -Math.PI/2) angle += 2*Math.PI;

    const idx = segmentsRef.current.findIndex(seg => {
      let s = seg.startAngle, en = seg.endAngle;
      if (s  < -Math.PI/2) s  += 2*Math.PI;
      if (en < -Math.PI/2) en += 2*Math.PI;
      return angle >= s && angle <= en;
    });

    if (idx !== -1) {
      draw(idx);
      const seg   = segmentsRef.current[idx];
      const total = data.reduce((s,d) => s+d.value, 0);
      setTooltip({
        x: x+10, y: y-10,
        name: seg.item.name,
        value: seg.item.value.toLocaleString(),
        pct: ((seg.item.value/total)*100).toFixed(1),
        color: seg.color
      });
    } else { setTooltip(null); draw(-1); }
  };

  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      <canvas ref={canvasRef} width={220} height={220}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => { setTooltip(null); draw(-1); }}
        style={{ cursor: 'pointer', display: 'block' }}
      />
      {tooltip && (
        <div style={{
          position: 'absolute', left: tooltip.x, top: tooltip.y,
          background: '#222', color: '#fff', padding: '7px 11px',
          borderRadius: '6px', fontSize: '12px', pointerEvents: 'none',
          whiteSpace: 'nowrap', zIndex: 10,
          borderLeft: `3px solid ${tooltip.color}`
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>{tooltip.name}</div>
          <div>Launches: {tooltip.value}</div>
          <div>Share: {tooltip.pct}%</div>
        </div>
      )}
    </div>
  );
}

// ── Main ─────────────────────────────────────────────
function AppActivity({ navigate }) {
  const [data, setData]                 = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [filterApp, setFilterApp]       = useState('');
  const [filterSystem, setFilterSystem] = useState('');
  const [filterDate, setFilterDate]     = useState('');
  const [modal, setModal]               = useState(null);

  useEffect(() => {
    fetch(`${BASE}/ZFTX_C_APP_ACTIVITY?sap-client=100&$orderby=total_launches desc`)
      .then(r => { if (!r.ok) throw new Error('HTTP '+r.status); return r.json(); })
      .then(j => { setData(j.value||[]); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  }, []);

  const filtered = data.filter(r => {
    const matchApp    = r.app_id?.toLowerCase().includes(filterApp.toLowerCase());
    const matchSystem = r.system_id?.toLowerCase().includes(filterSystem.toLowerCase());
    const matchDate   = filterDate ? (() => {
      if (!r.last_used_ts) return false;
      const s = Math.floor(r.last_used_ts).toString();
      if (s.length < 8) return false;
      return `${s.slice(0,4)}-${s.slice(4,6)}-${s.slice(6,8)}` === filterDate;
    })() : true;
    return matchApp && matchSystem && matchDate;
  });

  const totalLaunches = filtered.reduce((s,r) => s+(r.total_launches||0), 0);
  const totalUsers    = filtered.reduce((s,r) => s+(r.unique_users||0), 0);
  const totalApps     = filtered.length;
  const chartData     = filtered.map(r => ({ name: r.app_id||'Unknown', value: r.total_launches||0 }));

  const openModal = (type) => {
    if (type === 'apps') {
      setModal({ title: `All Apps (${totalApps})`, color: '#0070f3', rows: [...filtered], type: 'apps' });
    } else if (type === 'launches') {
      setModal({
        title: `By Total Launches (${totalLaunches.toLocaleString()})`,
        color: '#00a36c',
        rows: [...filtered].sort((a, b) => (b.total_launches || 0) - (a.total_launches || 0)),
        type: 'launches'
      });
    } else if (type === 'users') {
      setModal({ title: 'Loading Users...', color: '#8e44ad', rows: [], type: 'users', loading: true });
      fetch(`${BASE}/ZFTX_C_USER_ACTIVITY?sap-client=100&$orderby=total_launches desc`)
        .then(r => r.json())
        .then(j => setModal({
          title: `Unique Users (${j.value?.length || 0})`,
          color: '#8e44ad',
          rows: j.value || [],
          type: 'users',
          loading: false
        }))
        .catch(() => setModal({ title: 'Unique Users', color: '#8e44ad', rows: [], type: 'users', loading: false }));
    }
  };

  const inputStyle = { padding: '5px 10px', fontSize: '12px', border: '1px solid #ddd', borderRadius: '4px', outline: 'none' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#f0f2f5', overflow: 'hidden' }}>

      {modal && (
  <Modal
    title={modal.title}
    color={modal.color}
    rows={modal.rows}
    type={modal.type}
    loading={modal.loading}
    onClose={() => setModal(null)}
  />
)}

      {/* ── Top Bar ── */}
      <div style={{
        background: '#fff', borderLeft: '4px solid #0070f3',
        padding: '10px 20px', display: 'flex', alignItems: 'center',
        gap: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', flexShrink: 0
      }}>
        <button className="back-btn" onClick={() => navigate('home')}>← Back</button>
        <div>
          <span style={{ fontWeight: 'bold', fontSize: '16px', color: '#0070f3' }}>App Activity</span>
          <span style={{ fontSize: '12px', color: '#999', marginLeft: '10px' }}>Application usage and launch statistics</span>
        </div>
        <span style={{ marginLeft: 'auto', background: '#0070f3', color: '#fff', padding: '3px 12px', borderRadius: '20px', fontSize: '12px' }}>
          {totalApps} Apps
        </span>
      </div>

      {/* ── Summary Strip ── */}
      <div style={{ display: 'flex', gap: '12px', padding: '10px 20px', flexShrink: 0 }}>
        {[
          { id:'apps',     label:'Total Apps',     value: totalApps,                     color:'#0070f3', icon:'📱' },
          { id:'launches', label:'Total Launches',  value: totalLaunches.toLocaleString(), color:'#00a36c', icon:'🚀' },
          { id:'users',    label:'Unique Users',    value: totalUsers.toLocaleString(),    color:'#8e44ad', icon:'👤' }
        ].map(card => (
          <div key={card.id} onClick={() => !loading && openModal(card.id)}
            style={{
              flex: 1, background: '#fff', borderRadius: '8px',
              padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '12px',
              border: `1.5px solid ${card.color}`, cursor: 'pointer',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
            }}
            onMouseEnter={e => e.currentTarget.style.background = `${card.color}0d`}
            onMouseLeave={e => e.currentTarget.style.background = '#fff'}
          >
            <span style={{ fontSize: '22px' }}>{card.icon}</span>
            <div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: card.color, lineHeight: 1 }}>{card.value}</div>
              <div style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>{card.label}</div>
            </div>
            <div style={{ marginLeft: 'auto', fontSize: '11px', color: card.color, background: `${card.color}15`, padding: '2px 8px', borderRadius: '8px' }}>
              View →
            </div>
          </div>
        ))}
      </div>

      {/* ── Filters Strip ── */}
      <div style={{
        display: 'flex', gap: '10px', padding: '0 20px 10px',
        alignItems: 'flex-end', flexShrink: 0
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <label style={{ fontSize: '10px', color: '#666', fontWeight: 'bold' }}>APP ID</label>
          <input style={{ ...inputStyle, width: '170px' }} placeholder="Search App ID..."
            value={filterApp} onChange={e => setFilterApp(e.target.value)} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <label style={{ fontSize: '10px', color: '#666', fontWeight: 'bold' }}>SYSTEM</label>
          <input style={{ ...inputStyle, width: '130px' }} placeholder="Search System..."
            value={filterSystem} onChange={e => setFilterSystem(e.target.value)} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <label style={{ fontSize: '10px', color: '#666', fontWeight: 'bold' }}>LAST ACCESSED</label>
          <input type="date" style={{ ...inputStyle, width: '150px' }}
            value={filterDate} onChange={e => setFilterDate(e.target.value)} />
        </div>
        <button onClick={() => { setFilterApp(''); setFilterSystem(''); setFilterDate(''); }}
          style={{ ...inputStyle, background: '#f0f0f0', cursor: 'pointer', border: '1px solid #ccc', color: '#555' }}>
          ✕ Clear
        </button>
      </div>

      {loading && <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>Loading...</div>}
      {error   && <div style={{ margin: '0 20px', padding: '12px', background: '#fff3f3', color: '#c00', borderRadius: '6px', fontSize: '13px' }}>Error: {error}</div>}

      {/* ── Bottom Content ── */}
      {!loading && !error && (
        <div style={{ display: 'flex', gap: '16px', padding: '0 20px 20px', flex: 1, overflow: 'hidden', minHeight: 0 }}>

          {/* Table 55% */}
          <div style={{ flex: '0 0 55%', display: 'flex', flexDirection: 'column', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', overflow: 'hidden', border: '1px solid #e0e0e0' }}>
            <div style={{ background: '#2b507a', padding: '10px 14px', color: '#fff', fontWeight: 'bold', fontSize: '13px', display: 'flex', justifyContent: 'space-between', flexShrink: 0 }}>
              <span>App Usage — By App ID</span>
              <span style={{ background: 'rgba(255,255,255,0.2)', padding: '1px 10px', borderRadius: '10px', fontSize: '12px' }}>{filtered.length} rows</span>
            </div>
            <div style={{ overflowY: 'auto', flex: 1 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                  <tr style={{ background: '#e8f0fe' }}>
                    {['App ID','System','Launches','Users','Last Accessed'].map(col => (
                      <th key={col} style={{
                        padding: '9px 12px',
                        textAlign: col==='Launches'||col==='Users' ? 'right' : 'left',
                        color: '#2b507a', fontSize: '12px', fontWeight: '700',
                        borderBottom: '2px solid #2b507a'
                      }}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0
                    ? <tr><td colSpan="5" style={{ textAlign:'center', padding:'40px', color:'#999' }}>No records found</td></tr>
                    : filtered.map((r,i) => (
                      <tr key={i} style={{ background: i%2===0 ? '#fff' : '#f9f9f9', borderBottom: '1px solid #eee' }}>
                        <td style={{ padding:'8px 12px' }}>
                          <span style={{  color:'#1d2d3e', padding:'2px 7px', borderRadius:'4px', fontSize:'11px', fontWeight:'bold' }}>{r.app_id||'-'}</span>
                        </td>
                        <td style={{ padding:'8px 12px' }}>
                          <span style={{ background:'#e8f5e9', color:'#2e7d32', padding:'2px 7px', borderRadius:'4px', fontSize:'11px' }}>{r.system_id}</span>
                        </td>
                        <td style={{ padding:'8px 12px', textAlign:'right', fontWeight:'bold', color:'#e74c3c', fontSize:'13px' }}>{r.total_launches?.toLocaleString()}</td>
                        <td style={{ padding:'8px 12px', textAlign:'right', color:'#555' }}>{r.unique_users}</td>
                        <td style={{ padding:'8px 12px', fontSize:'11px', color:'#777' }}>{fmt(r.last_used_ts)}</td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>

          {/* Chart 45% */}
          <div style={{ flex: '0 0 calc(45% - 16px)', display: 'flex', flexDirection: 'column', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', overflow: 'hidden', border: '1px solid #e0e0e0' }}>
            <div style={{ background: '#2b507a', padding: '10px 14px', color: '#fff', fontWeight: 'bold', fontSize: '13px', flexShrink: 0 }}>
              App Usage — Tiles View
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'row', alignItems: 'center', padding: '16px', gap: '16px', overflow: 'hidden' }}>
              {chartData.length === 0
                ? <div style={{ color:'#999', width:'100%', textAlign:'center' }}>No data</div>
                : <>
                  {/* Donut */}
                  <DonutChart data={chartData} />

                  {/* Legend */}
                  <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '5px', height: '100%' }}>
                    {chartData.map((item, i) => (
                      <div key={i} style={{ display:'flex', alignItems:'center', gap:'7px', fontSize:'12px', padding:'3px 0', borderBottom:'1px solid #f5f5f5' }}>
                        <div style={{ width:'10px', height:'10px', borderRadius:'2px', background: COLORS[i%COLORS.length], flexShrink:0 }} />
                        <span style={{ flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', color:'#333' }}>
                          {item.name.length > 20 ? item.name.slice(0,20)+'...' : item.name}
                        </span>
                        <span style={{ color:'#e74c3c', fontWeight:'bold', fontSize:'12px' }}>
                          {item.value.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              }
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

export default AppActivity;