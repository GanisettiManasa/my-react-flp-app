import { useState, useEffect } from 'react';

const BASE = '/sap/opu/odata4/sap/zftx_analytics_srv/srvd/sap/zftx_analytics_srd/0001';

const TILE_CONFIG = {
    ZFTX_C_APP_ACTIVITY: {
        id: 'app-activity',
        title: 'App Activity',
        description: 'Application usage and launch statistics',
        icon: '📱',
        color: '#0070f3',
        light: '#e8f0fe'
    },
    ZFTX_C_DASHBOARD: {
        id: 'dashboard',
        title: 'Dashboard',
        description: 'Daily active users and app usage overview',
        icon: '📊',
        color: '#00a36c',
        light: '#e6f4ee'
    },
    ZFTX_C_LOGON_DETAIL: {
        id: 'logon-detail',
        title: 'Logon Detail',
        description: 'User login sessions and device information',
        icon: '🔐',
        color: '#e67e22',
        light: '#fef5ec'
    },
    ZFTX_C_USER_ACTIVITY: {
        id: 'user-activity',
        title: 'User Activity',
        description: 'Per-user app usage and activity tracking',
        icon: '👤',
        color: '#8e44ad',
        light: '#f5eef8'
    }
};

function Dashboard({ navigate }) {
    const [tiles, setTiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`${BASE}/?sap-client=100`)
            .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
            .then(json => {
                const mapped = (json.value || [])
                    .filter(item => TILE_CONFIG[item.name])
                    .map(item => TILE_CONFIG[item.name]);
                setTiles(mapped);
                setLoading(false);
            })
            .catch(e => { setError(e.message); setLoading(false); });
    }, []);

    if (loading) {
        return (
            <div className="page">
                <div className="loading">
                    <div className="spinner"></div>
                    <p>Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page">
                <div className="error-box">Error loading dashboard: {error}</div>
            </div>
        );
    }

    return (
        <div style={{ padding: '24px', background: '#ffffff', minHeight: '100vh' }}>
            <div className="dash-header">
                <h1>Analytics Dashboard</h1>
                <p>Select a report to view detailed data</p>
            </div>

            <div className="tiles-grid">
                {tiles.map(tile => (
                    <div
                        key={tile.id}
                        className="tile"
                        style={{ borderTop: `4px solid ${tile.color}` }}
                        onClick={() => navigate(tile.id)}
                    >
                        <div className="tile-icon" style={{ background: tile.light }}>
                            <span>{tile.icon}</span>
                        </div>
                        <div className="tile-content">
                            <h3 style={{ color: tile.color }}>{tile.title}</h3>
                            <p>{tile.description}</p>
                        </div>
                        <div className="tile-arrow" style={{ color: tile.color }}>→</div>
                    </div>
                ))}
            </div>

            <div className="tiles-count">
                {tiles.length} reports available
            </div>
        </div>
    );
}

export default Dashboard;