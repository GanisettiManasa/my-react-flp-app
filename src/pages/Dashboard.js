// import { useState, useEffect } from 'react';

// const BASE = '/sap/opu/odata4/sap/zftx_analytics_srv/srvd/sap/zftx_analytics_srd/0001';

// const TILE_CONFIG = {
//     ZFTX_C_APP_ACTIVITY: {
//         id: 'app-activity',
//         title: 'App Activity',
//         description: 'Application usage and launch statistics',
//         icon: '📱',
//         color: '#0070f3',
//         light: '#e8f0fe'
//     },
//     ZFTX_C_DASHBOARD: {
//         id: 'dashboard',
//         title: 'Dashboard',
//         description: 'Daily active users and app usage overview',
//         icon: '📊',
//         color: '#00a36c',
//         light: '#e6f4ee'
//     },
//     ZFTX_C_LOGON_DETAIL: {
//         id: 'logon-detail',
//         title: 'Logon Detail',
//         description: 'User login sessions and device information',
//         icon: '🔐',
//         color: '#e67e22',
//         light: '#fef5ec'
//     },
//     ZFTX_C_USER_ACTIVITY: {
//         id: 'user-activity',
//         title: 'User Activity',
//         description: 'Per-user app usage and activity tracking',
//         icon: '👤',
//         color: '#8e44ad',
//         light: '#f5eef8'
//     }
// };

// function Dashboard({ navigate }) {
//     const [tiles, setTiles] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         fetch(`${BASE}/?sap-client=100`)
//             .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
//             .then(json => {
//                 const mapped = (json.value || [])
//                     .filter(item => TILE_CONFIG[item.name])
//                     .map(item => TILE_CONFIG[item.name]);
//                 setTiles(mapped);
//                 setLoading(false);
//             })
//             .catch(e => { setError(e.message); setLoading(false); });
//     }, []);

//     if (loading) {
//         return (
//             <div className="page">
//                 <div className="loading">
//                     <div className="spinner"></div>
//                     <p>Loading dashboard...</p>
//                 </div>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="page">
//                 <div className="error-box">Error loading dashboard: {error}</div>
//             </div>
//         );
//     }

//     return (
//         <div style={{ padding: '24px', background: '#ffffff', minHeight: '100vh' }}>
//             <div className="dash-header">
//                 <h1>Analytics Dashboard</h1>
//                 <p>Select a report to view detailed data</p>
//             </div>

//             <div className="tiles-grid">
//                 {tiles.map(tile => (
//                     <div
//                         key={tile.id}
//                         className="tile"
//                         style={{ borderTop: `4px solid ${tile.color}` }}
//                         onClick={() => navigate(tile.id)}
//                     >
//                         <div className="tile-icon" style={{ background: tile.light }}>
//                             <span>{tile.icon}</span>
//                         </div>
//                         <div className="tile-content">
//                             <h3 style={{ color: tile.color }}>{tile.title}</h3>
//                             <p>{tile.description}</p>
//                         </div>
//                         <div className="tile-arrow" style={{ color: tile.color }}>→</div>
//                     </div>
//                 ))}
//             </div>

//             <div className="tiles-count">
//                 {tiles.length} reports available
//             </div>
//         </div>
//     );
// }

// export default Dashboard;

import { useState, useEffect } from 'react';

const BASE =
  '/sap/opu/odata4/sap/zftx_analytics_srv/srvd/sap/zftx_analytics_srd/0001';

const TILE_CONFIG = {
  ZFTX_C_APP_ACTIVITY: {
    id: 'app-activity',
    title: 'App Activity',
    description:
      'Application usage and launch statistics',
    icon: '📱',
    gradient:
      'linear-gradient(135deg,#0ea5e9,#0369a1)',
    glow: 'rgba(14,165,233,0.25)',
  },

  ZFTX_C_DASHBOARD: {
    id: 'dashboard',
    title: 'Dashboard',
    description:
      'Daily active users and app usage overview',
    icon: '🌐',
    gradient:
      'linear-gradient(135deg,#8b5cf6,#5b21b6)',
    glow: 'rgba(139,92,246,0.25)',
  },

  ZFTX_C_LOGON_DETAIL: {
    id: 'logon-detail',
    title: 'Logon Detail',
    description:
      'User login sessions and device information',
    icon: '🔐',
    gradient:
      'linear-gradient(135deg,#f97316,#c2410c)',
    glow: 'rgba(249,115,22,0.25)',
  },

  ZFTX_C_USER_ACTIVITY: {
    id: 'user-activity',
    title: 'User Activity',
    description:
      'Per-user app usage and activity tracking',
    icon: '👤',
    gradient:
      'linear-gradient(135deg,#10b981,#047857)',
    glow: 'rgba(16,185,129,0.25)',
  },
};

function Dashboard({ navigate }) {
  const [tiles, setTiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${BASE}/?sap-client=100`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        return res.json();
      })
      .then((json) => {
        const mapped = (json.value || [])
          .filter(
            (item) => TILE_CONFIG[item.name]
          )
          .map((item) => TILE_CONFIG[item.name]);

        setTiles(mapped);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background:
            'linear-gradient(180deg,#f4f7fb,#eaf1f8)',
          fontFamily: 'Arial',
        }}
      >
        <div
          style={{
            background: '#fff',
            padding: '30px 40px',
            borderRadius: '18px',
            boxShadow:
              '0 10px 30px rgba(0,0,0,0.08)',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: '32px',
              marginBottom: '10px',
            }}
          >
            ⏳
          </div>

          <div
            style={{
              fontSize: '15px',
              color: '#475569',
              fontWeight: '600',
            }}
          >
            Loading Dashboard...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background:
            'linear-gradient(180deg,#f4f7fb,#eaf1f8)',
          fontFamily: 'Arial',
        }}
      >
        <div
          style={{
            background: '#fff',
            padding: '30px 40px',
            borderRadius: '18px',
            boxShadow:
              '0 10px 30px rgba(0,0,0,0.08)',
            color: '#dc2626',
            fontWeight: '700',
          }}
        >
          Error Loading Dashboard : {error}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: '26px',
        background:
          'linear-gradient(180deg,#f4f7fb,#e8eef6)',
        fontFamily: 'Arial',
      }}
    >
      {/* HEADER */}
      <div
        style={{
          background:'#fff',
          borderRadius: '22px',
          padding: '26px 30px',
          marginBottom: '28px',
          boxShadow:
            '0 12px 30px rgba(15,23,42,0.18)',
        }}
      >
        <div
          style={{
            fontSize: '34px',
            fontWeight: '700',
            color: '#000',
            letterSpacing: '0.5px',
          }}
        >
          SAP Analytics Dashboard
        </div>

        <div
          style={{
            marginTop: '8px',
            color: '#cbd5e1',
            fontSize: '14px',
          }}
        >
          Enterprise Reporting & Monitoring Center
        </div>
      </div>

      {/* TILE GRID */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit,minmax(300px,1fr))',
          gap: '22px',
        }}
      >
        {tiles.map((tile) => (
          <div
            key={tile.id}
            onClick={() => navigate(tile.id)}
            style={{
              background: tile.gradient,
              borderRadius: '24px',
              padding: '26px',
              position: 'relative',
              overflow: 'hidden',
              cursor: 'pointer',
              transition: '0.3s ease',
              boxShadow: `0 12px 28px ${tile.glow}`,
              minHeight: '210px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform =
                'translateY(-6px) scale(1.01)';

              e.currentTarget.style.boxShadow =
                `0 18px 38px ${tile.glow}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform =
                'translateY(0px)';

              e.currentTarget.style.boxShadow =
                `0 12px 28px ${tile.glow}`;
            }}
          >
            {/* BACKGROUND CIRCLE */}
            <div
              style={{
                position: 'absolute',
                right: '-40px',
                top: '-40px',
                width: '150px',
                height: '150px',
                borderRadius: '50%',
                background:
                  'rgba(255,255,255,0.08)',
              }}
            />

            {/* ICON */}
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '20px',
                background:
                  'rgba(255,255,255,0.16)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '34px',
                backdropFilter: 'blur(10px)',
                marginBottom: '22px',
                border:
                  '1px solid rgba(255,255,255,0.12)',
              }}
            >
              {tile.icon}
            </div>

            {/* TITLE */}
            <div
              style={{
                fontSize: '26px',
                fontWeight: '700',
                color: '#fff',
                marginBottom: '10px',
                letterSpacing: '0.3px',
              }}
            >
              {tile.title}
            </div>

            {/* DESCRIPTION */}
            <div
              style={{
                fontSize: '14px',
                lineHeight: '22px',
                color: 'rgba(255,255,255,0.82)',
                maxWidth: '90%',
              }}
            >
              {tile.description}
            </div>

            {/* BUTTON */}
            <div
              style={{
                marginTop: '28px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                background:
                  'rgba(255,255,255,0.14)',
                padding: '10px 16px',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '13px',
                fontWeight: '700',
                border:
                  '1px solid rgba(255,255,255,0.1)',
              }}
            >
              Open Report
              <span style={{ fontSize: '16px' }}>
                →
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <div
        style={{
          marginTop: '26px',
          textAlign: 'center',
          color: '#64748b',
          fontSize: '13px',
          fontWeight: '600',
        }}
      >
        {tiles.length} Analytics Reports Available
      </div>
    </div>
  );
}

export default Dashboard;