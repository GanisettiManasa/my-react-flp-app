import { useState, useEffect, useRef, useCallback } from 'react';

const BASE = '/sap/opu/odata4/sap/zftx_analytics_srv/srvd/sap/zftx_analytics_srd/0001';
const BLUE   = '#0070f3';
const GREEN  = '#00a36c';
const ORANGE = '#e67e22';

// ── Bar Chart ────────────────────────────────────────
function BarChart({ data, labelKey, valueKey, color, title }) {
  const canvasRef = useRef(null);
  const [tooltip, setTooltip]   = useState(null);
  const barsRef   = useRef([]);

  const draw = useCallback((hi = -1) => {
    const canvas = canvasRef.current;
    if (!canvas || !data.length) return;
    const ctx  = canvas.getContext('2d');
    const W    = canvas.width;
    const H    = canvas.height;
    const padL = 40, padR = 10, padT = 20, padB = 40;
    const chartW = W - padL - padR;
    const chartH = H - padT - padB;
    const max  = Math.max(...data.map(d => d[valueKey]), 1);

    ctx.clearRect(0, 0, W, H);
    barsRef.current = [];

    const barW = (chartW / data.length) * 0.6;
    const gap  = chartW / data.length;

    // Grid lines
    ctx.strokeStyle = '#f0f0f0';
    ctx.lineWidth   = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padT + chartH - (i / 4) * chartH;
      ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(W - padR, y); ctx.stroke();
      ctx.fillStyle  = '#aaa';
      ctx.font       = '10px Arial';
      ctx.textAlign  = 'right';
      ctx.fillText(Math.round((max * i) / 4), padL - 4, y + 3);
    }

    data.forEach((d, i) => {
      const x    = padL + i * gap + gap / 2 - barW / 2;
      const h    = (d[valueKey] / max) * chartH;
      const y    = padT + chartH - h;
      const isHi = i === hi;

      ctx.fillStyle = isHi ? '#ff5722' : color;
      ctx.beginPath();
      ctx.roundRect ? ctx.roundRect(x, y, barW, h, [3, 3, 0, 0]) : ctx.rect(x, y, barW, h);
      ctx.fill();

      // X label
      ctx.fillStyle  = '#666';
      ctx.font       = '9px Arial';
      ctx.textAlign  = 'center';
      const lbl = d[labelKey]?.slice(5); // MM-DD
      ctx.fillText(lbl, padL + i * gap + gap / 2, H - padB + 14);

      barsRef.current.push({ x, y, w: barW, h, data: d });
    });
  }, [data, labelKey, valueKey, color]);

  useEffect(() => { draw(); }, [draw]);

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx   = e.clientX - rect.left;
    const my   = e.clientY - rect.top;
    const idx  = barsRef.current.findIndex(b => mx >= b.x && mx <= b.x + b.w && my >= b.y && my <= b.y + b.h);
    if (idx !== -1) {
      draw(idx);
      const b = barsRef.current[idx];
      setTooltip({ x: mx + 10, y: my - 10, label: b.data[labelKey], value: b.data[valueKey] });
    } else { draw(-1); setTooltip(null); }
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#555', marginBottom: '4px' }}>{title}</div>
      <canvas ref={canvasRef} width={500} height={160}
        style={{ width: '100%', height: '160px', display: 'block' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => { draw(-1); setTooltip(null); }}
      />
      {tooltip && (
        <div style={{ position:'absolute', left: tooltip.x, top: tooltip.y, background:'#333', color:'#fff', padding:'6px 10px', borderRadius:'5px', fontSize:'11px', pointerEvents:'none', whiteSpace:'nowrap', borderLeft: `3px solid ${color}` }}>
          <div>{tooltip.label}</div>
          <div style={{ fontWeight:'bold' }}>{tooltip.value}</div>
        </div>
      )}
    </div>
  );
}

// ── Line Chart ───────────────────────────────────────
function LineChart({ data, labelKey, valueKey, color, title }) {
  const canvasRef = useRef(null);
  const [tooltip, setTooltip]   = useState(null);
  const pointsRef = useRef([]);

  const draw = useCallback((hi = -1) => {
    const canvas = canvasRef.current;
    if (!canvas || !data.length) return;
    const ctx  = canvas.getContext('2d');
    const W    = canvas.width;
    const H    = canvas.height;
    const padL = 40, padR = 10, padT = 20, padB = 40;
    const chartW = W - padL - padR;
    const chartH = H - padT - padB;
    const max  = Math.max(...data.map(d => d[valueKey]), 1);

    ctx.clearRect(0, 0, W, H);
    pointsRef.current = [];

    // Grid
    ctx.strokeStyle = '#f0f0f0';
    ctx.lineWidth   = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padT + chartH - (i / 4) * chartH;
      ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(W - padR, y); ctx.stroke();
      ctx.fillStyle = '#aaa'; ctx.font = '10px Arial'; ctx.textAlign = 'right';
      ctx.fillText(Math.round((max * i) / 4), padL - 4, y + 3);
    }

    const pts = data.map((d, i) => ({
      x: padL + (i / (data.length - 1 || 1)) * chartW,
      y: padT + chartH - (d[valueKey] / max) * chartH,
      data: d
    }));

    // Fill area
    ctx.beginPath();
    ctx.moveTo(pts[0].x, padT + chartH);
    pts.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(pts[pts.length - 1].x, padT + chartH);
    ctx.closePath();
    ctx.fillStyle = color + '22';
    ctx.fill();

    // Line
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth   = 2;
    pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
    ctx.stroke();

    // Points
    pts.forEach((p, i) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, i === hi ? 6 : 4, 0, 2 * Math.PI);
      ctx.fillStyle   = i === hi ? '#ff5722' : color;
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth   = 2;
      ctx.stroke();

      // X label
      ctx.fillStyle = '#666'; ctx.font = '9px Arial'; ctx.textAlign = 'center';
      ctx.fillText(data[i][labelKey]?.slice(5), p.x, H - padB + 14);

      pointsRef.current.push(p);
    });
  }, [data, labelKey, valueKey, color]);

  useEffect(() => { draw(); }, [draw]);

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx   = e.clientX - rect.left;
    const my   = e.clientY - rect.top;
    let closest = -1, minDist = 20;
    pointsRef.current.forEach((p, i) => {
      const d = Math.sqrt((mx - p.x) ** 2 + (my - p.y) ** 2);
      if (d < minDist) { minDist = d; closest = i; }
    });
    if (closest !== -1) {
      draw(closest);
      const p = pointsRef.current[closest];
      setTooltip({ x: mx + 10, y: my - 10, label: p.data[labelKey], value: p.data[valueKey] });
    } else { draw(-1); setTooltip(null); }
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#555', marginBottom: '4px' }}>{title}</div>
      <canvas ref={canvasRef} width={500} height={160}
        style={{ width: '100%', height: '160px', display: 'block' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => { draw(-1); setTooltip(null); }}
      />
      {tooltip && (
        <div style={{ position:'absolute', left: tooltip.x, top: tooltip.y, background:'#333', color:'#fff', padding:'6px 10px', borderRadius:'5px', fontSize:'11px', pointerEvents:'none', whiteSpace:'nowrap', borderLeft: `3px solid ${color}` }}>
          <div>{tooltip.label}</div>
          <div style={{ fontWeight:'bold' }}>{tooltip.value}</div>
        </div>
      )}
    </div>
  );
}

// ── Main ─────────────────────────────────────────────
function DashboardData({ navigate }) {
  const [data, setData]             = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [filterFrom, setFilterFrom] = useState('');
  const [filterTo, setFilterTo]     = useState('');

  useEffect(() => {
    fetch(`${BASE}/ZFTX_C_DASHBOARD?sap-client=100&$orderby=event_date asc`)
      .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(j => { setData(j.value || []); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  }, []);

  const filtered = data.filter(r => {
    const matchFrom = filterFrom ? r.event_date >= filterFrom : true;
    const matchTo   = filterTo   ? r.event_date <= filterTo   : true;
    return matchFrom && matchTo;
  });

  const totalDays     = filtered.length;
  const peakUsers     = Math.max(...filtered.map(r => r.active_users || 0), 0);
  const totalLaunches = filtered.reduce((s, r) => s + (r.total_launches || 0), 0);
  const totalApps     = filtered.reduce((s, r) => s + (r.apps_used || 0), 0);

  const inputStyle = { padding: '5px 10px', fontSize: '12px', border: '1px solid #ddd', borderRadius: '4px', outline: 'none' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#f0f2f5', overflow: 'hidden' }}>

      {/* Header */}
      <div style={{ background: '#fff', borderLeft: '4px solid #00a36c', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', flexShrink: 0 }}>
        {/* <button className="back-btn" onClick={() => navigate('home')}>← Back</button> */}
        <button
            onClick={() =>
              navigate('home')
            }
            style={{
              border: 'none',
              background:
                'linear-gradient(135deg,#0a6ed1,#0854a0)',
              color: '#fff',
              padding: '10px 18px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '13px',
            }}
          >
            ← Back
          </button>
        <div>
          <span style={{ fontWeight: 'bold', fontSize: '16px', color: '#00a36c' }}>Dashboard</span>
          <span style={{ fontSize: '12px', color: '#999', marginLeft: '10px' }}>Daily active users and app usage overview</span>
        </div>
        <span style={{ marginLeft: 'auto', background: '#00a36c', color: '#fff', padding: '3px 12px', borderRadius: '20px', fontSize: '12px' }}>
          {totalDays} Days
        </span>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'flex', gap: '12px', padding: '10px 20px', flexShrink: 0 }}>
        {[
          { label: 'Total Days',      value: totalDays,                     color: '#00a36c', icon: '📅' },
          { label: 'Peak Users/Day',  value: peakUsers,                     color: '#0070f3', icon: '👥' },
          { label: 'Total Launches',  value: totalLaunches.toLocaleString(), color: '#e67e22', icon: '🚀' },
          { label: 'Total Apps Used', value: totalApps.toLocaleString(),     color: '#8e44ad', icon: '📱' }
        ].map(card => (
          <div key={card.label} style={{
            flex: 1, background: '#fff', borderRadius: '8px',
            padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px',
            border: `1.5px solid ${card.color}`,
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
          }}>
            <span style={{ fontSize: '20px' }}>{card.icon}</span>
            <div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: card.color, lineHeight: 1 }}>{card.value}</div>
              <div style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>{card.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '10px', padding: '0 20px 10px', alignItems: 'flex-end', flexShrink: 0 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <label style={{ fontSize: '10px', color: '#666', fontWeight: 'bold' }}>FROM DATE</label>
          <input type="date" style={{ ...inputStyle, width: '150px' }} value={filterFrom} onChange={e => setFilterFrom(e.target.value)} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <label style={{ fontSize: '10px', color: '#666', fontWeight: 'bold' }}>TO DATE</label>
          <input type="date" style={{ ...inputStyle, width: '150px' }} value={filterTo} onChange={e => setFilterTo(e.target.value)} />
        </div>
        <button onClick={() => { setFilterFrom(''); setFilterTo(''); }}
          style={{ ...inputStyle, background: '#f0f0f0', cursor: 'pointer', border: '1px solid #ccc', color: '#555' }}>
          ✕ Clear
        </button>
      </div>

      {loading && <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>Loading...</div>}
      {error   && <div style={{ margin: '0 20px', padding: '12px', background: '#fff3f3', color: '#c00', borderRadius: '6px', fontSize: '13px' }}>Error: {error}</div>}

      {!loading && !error && (
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', padding: '0 20px 20px', gap: '12px', minHeight: 0 }}>

          {/* Charts Row */}
          <div style={{ display: 'flex', gap: '12px', flexShrink: 0 }}>

            {/* Bar Chart - Total Launches */}
            <div style={{ flex: 1, background: '#fff', borderRadius: '8px', padding: '14px 16px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', border: '1px solid #e0e0e0' }}>
              <BarChart
                data={filtered}
                labelKey="event_date"
                valueKey="total_launches"
                color={ORANGE}
                title="📊 Daily Total Launches"
              />
            </div>

            {/* Line Chart - Active Users */}
            <div style={{ flex: 1, background: '#fff', borderRadius: '8px', padding: '14px 16px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', border: '1px solid #e0e0e0' }}>
              <LineChart
                data={filtered}
                labelKey="event_date"
                valueKey="active_users"
                color={BLUE}
                title="👥 Daily Active Users"
              />
            </div>

          </div>

          {/* Table */}
          <div style={{ flex: 1, background: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: '1px solid #e0e0e0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ background: '#2b507a', padding: '10px 14px', color: '#fff', fontWeight: 'bold', fontSize: '13px', display: 'flex', justifyContent: 'space-between', flexShrink: 0 }}>
              <span>Daily Activity Details</span>
              <span style={{ background: 'rgba(255,255,255,0.2)', padding: '1px 10px', borderRadius: '10px', fontSize: '12px' }}>{filtered.length} days</span>
            </div>
            <div style={{ overflowY: 'auto', flex: 1 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                  <tr style={{ background: '#e8f0fe' }}>
                    {['Date','System','Active Users','Apps Used','Total Launches'].map(col => (
                      <th key={col} style={{
                        padding: '9px 14px',
                        textAlign: col === 'Active Users' || col === 'Apps Used' || col === 'Total Launches' ? 'right' : 'left',
                        color: '#2b507a', fontSize: '12px', fontWeight: '700',
                        borderBottom: '2px solid #2b507a'
                      }}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0
                    ? <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#999' }}>No records found</td></tr>
                    : filtered.map((r, i) => (
                      <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#f9f9f9', borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '8px 14px', fontWeight: '500', color: '#333' }}>{r.event_date}</td>
                        <td style={{ padding: '8px 14px' }}>
                          <span style={{ background: '#e8f5e9', color: '#2e7d32', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>{r.system_id}</span>
                        </td>
                        <td style={{ padding: '8px 14px', textAlign: 'right', fontWeight: 'bold', color: BLUE }}>{r.active_users}</td>
                        <td style={{ padding: '8px 14px', textAlign: 'right', color: '#8e44ad', fontWeight: 'bold' }}>{r.apps_used}</td>
                        <td style={{ padding: '8px 14px', textAlign: 'right', fontWeight: 'bold', color: ORANGE }}>{r.total_launches?.toLocaleString()}</td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

export default DashboardData;