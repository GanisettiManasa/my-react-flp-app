import React, { useEffect, useMemo, useState } from 'react';

const BASE =
  '/sap/opu/odata4/sap/zftx_analytics_srv/srvd/sap/zftx_analytics_srd/0001';

const formatDateTime = (ts) => {
  if (!ts) return '-';

  return new Date(ts).toLocaleString();
};

export default function LogonDetail({ navigate }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchUser, setSearchUser] = useState('');
  const [searchDate, setSearchDate] = useState('');

  // API CALL
  useEffect(() => {
    fetch(
      `${BASE}/ZFTX_C_LOGON_DETAIL`
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        return res.json();
      })
      .then((json) => {
        setData(json.value || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // FILTERING
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const userMatch = item.user_id
        ?.toLowerCase()
        .includes(searchUser.toLowerCase());

      const dateMatch = searchDate
        ? item.event_date === searchDate
        : true;

      return userMatch && dateMatch;
    });
  }, [data, searchUser, searchDate]);

  // KPI DATA
  const totalLogons = filteredData.length;

  const uniqueUsers = new Set(
    filteredData.map((item) => item.user_id)
  ).size;

  const desktopUsers = filteredData.filter(
    (item) => item.device_type === 'Desktop'
  ).length;

  const topBrowser =
    [...filteredData].sort((a, b) => {
      return (
        filteredData.filter((x) => x.browser === b.browser)
          .length -
        filteredData.filter((x) => x.browser === a.browser)
          .length
      );
    })[0]?.browser || '-';

  // CARD STYLE
  const cardStyle = (bg) => ({
    flex: 1,
    background: bg,
    borderRadius: '16px',
    padding: '20px',
    color: '#fff',
    boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
  });

  return (
    <div
      style={{
        background: '#eef2f7',
        minHeight: '100vh',
        padding: '20px',
        fontFamily: 'Arial',
      }}
    >
      {/* HEADER */}
      <div
        style={{
          background: '#fff',
          borderRadius: '14px',
          padding: '18px 22px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '18px',
          boxShadow: '0 3px 10px rgba(0,0,0,0.08)',
        }}
      >
        <div>
          <div
            style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#1d3557',
            }}
          >
            Logon Detail Analytics
          </div>

          <div
            style={{
              fontSize: '13px',
              color: '#777',
              marginTop: '4px',
            }}
          >
            SAP User Login Activity Dashboard
          </div>
        </div>

        <button
          onClick={() => navigate('home')}
          style={{
            border: 'none',
            background: '#0a6ed1',
            color: '#fff',
            padding: '10px 18px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          ← Back
        </button>
      </div>

      {/* KPI CARDS */}
<div
  style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '18px',
    marginBottom: '22px',
  }}
>
  {/* TOTAL LOGONS */}
  <div
    style={cardStyle(
      'linear-gradient(135deg,#16324f,#1f4e79)'
    )}
  >
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
      }}
    >
      <div>
        <div
          style={{
            fontSize: '11px',
            letterSpacing: '1px',
            opacity: 0.85,
            fontWeight: '600',
          }}
        >
          TOTAL LOGONS
        </div>

        <div
          style={{
            fontSize: '36px',
            fontWeight: '700',
            marginTop: '12px',
            lineHeight: 1,
          }}
        >
          {totalLogons}
        </div>
      </div>

      <div
        style={{
          width: '54px',
          height: '54px',
          borderRadius: '14px',
          background: 'rgba(255,255,255,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '26px',
        }}
      >
        🔐
      </div>
    </div>

    <div
      style={{
        marginTop: '14px',
        fontSize: '12px',
        opacity: 0.75,
      }}
    >
      System access events
    </div>
  </div>

  {/* UNIQUE USERS */}
  <div
    style={cardStyle(
      'linear-gradient(135deg,#0b5345,#117864)'
    )}
  >
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
      }}
    >
      <div>
        <div
          style={{
            fontSize: '11px',
            letterSpacing: '1px',
            opacity: 0.85,
            fontWeight: '600',
          }}
        >
          UNIQUE USERS
        </div>

        <div
          style={{
            fontSize: '36px',
            fontWeight: '700',
            marginTop: '12px',
            lineHeight: 1,
          }}
        >
          {uniqueUsers}
        </div>
      </div>

      <div
        style={{
          width: '54px',
          height: '54px',
          borderRadius: '14px',
          background: 'rgba(255,255,255,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '26px',
        }}
      >
        👥
      </div>
    </div>

    <div
      style={{
        marginTop: '14px',
        fontSize: '12px',
        opacity: 0.75,
      }}
    >
      Active SAP users
    </div>
  </div>

  {/* DESKTOP USERS */}
  <div
    style={cardStyle(
      'linear-gradient(135deg,#5b2c6f,#7d3c98)'
    )}
  >
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
      }}
    >
      <div>
        <div
          style={{
            fontSize: '11px',
            letterSpacing: '1px',
            opacity: 0.85,
            fontWeight: '600',
          }}
        >
          DESKTOP LOGINS
        </div>

        <div
          style={{
            fontSize: '36px',
            fontWeight: '700',
            marginTop: '12px',
            lineHeight: 1,
          }}
        >
          {desktopUsers}
        </div>
      </div>

      <div
        style={{
          width: '54px',
          height: '54px',
          borderRadius: '14px',
          background: 'rgba(255,255,255,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '26px',
        }}
      >
        🖥️
      </div>
    </div>

    <div
      style={{
        marginTop: '14px',
        fontSize: '12px',
        opacity: 0.75,
      }}
    >
      Desktop device sessions
    </div>
  </div>

  {/* TOP BROWSER */}
  <div
    style={cardStyle(
      'linear-gradient(135deg,#7e5109,#b9770e)'
    )}
  >
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
      }}
    >
      <div>
        <div
          style={{
            fontSize: '11px',
            letterSpacing: '1px',
            opacity: 0.85,
            fontWeight: '600',
          }}
        >
          TOP BROWSER
        </div>

        <div
          style={{
            fontSize: '28px',
            fontWeight: '700',
            marginTop: '14px',
            lineHeight: 1.2,
          }}
        >
          {topBrowser}
        </div>
      </div>

      <div
        style={{
          width: '54px',
          height: '54px',
          borderRadius: '14px',
          background: 'rgba(255,255,255,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '26px',
        }}
      >
        🌐
      </div>
    </div>

    <div
      style={{
        marginTop: '14px',
        fontSize: '12px',
        opacity: 0.75,
      }}
    >
      Most used browser
    </div>
  </div>
</div>

      {/* FILTERS */}
      <div
        style={{
          background: '#fff',
          borderRadius: '14px',
          padding: '18px',
          marginBottom: '18px',
          display: 'flex',
          gap: '14px',
          alignItems: 'flex-end',
          boxShadow: '0 3px 10px rgba(0,0,0,0.08)',
        }}
      >
        {/* USER */}
        <div>
          <label
            style={{
              display: 'block',
              marginBottom: '6px',
              fontSize: '12px',
              fontWeight: 'bold',
              color: '#555',
            }}
          >
            USER ID
          </label>

          <input
            type="text"
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
            placeholder="Search User..."
            style={{
              width: '240px',
              padding: '10px 12px',
              borderRadius: '8px',
              border: '1px solid #d0d7de',
              outline: 'none',
            }}
          />
        </div>

        {/* DATE */}
        <div>
          <label
            style={{
              display: 'block',
              marginBottom: '6px',
              fontSize: '12px',
              fontWeight: 'bold',
              color: '#555',
            }}
          >
            EVENT DATE
          </label>

          <input
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            style={{
              width: '200px',
              padding: '10px 12px',
              borderRadius: '8px',
              border: '1px solid #d0d7de',
              outline: 'none',
            }}
          />
        </div>

        {/* CLEAR */}
        <button
          onClick={() => {
            setSearchUser('');
            setSearchDate('');
          }}
          style={{
            padding: '10px 16px',
            border: 'none',
            borderRadius: '8px',
            background: '#f1f3f5',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Clear
        </button>
      </div>

      {/* TABLE */}
      <div
        style={{
          background: '#fff',
          borderRadius: '14px',
          overflow: 'hidden',
          boxShadow: '0 3px 10px rgba(0,0,0,0.08)',
        }}
      >
        {/* HEADER */}
        <div
          style={{
            background:
              'linear-gradient(90deg,#1d3557,#274c77)',
            color: '#fff',
            padding: '16px 20px',
            fontWeight: 'bold',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <span>Logon Details</span>

          <span
            style={{
              background: 'rgba(255,255,255,0.15)',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '12px',
            }}
          >
            {filteredData.length} Records
          </span>
        </div>

        {loading && (
          <div
            style={{
              padding: '50px',
              textAlign: 'center',
              color: '#777',
            }}
          >
            Loading data...
          </div>
        )}

        {error && (
          <div
            style={{
              padding: '20px',
              color: '#c0392b',
              fontWeight: 'bold',
            }}
          >
            Error: {error}
          </div>
        )}

        {!loading && !error && (
          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '13px',
              }}
            >
              <thead>
                <tr
                  style={{
                    background: '#edf4ff',
                  }}
                >
                  {[
                    'User',
                    'Browser',
                    'Device',
                    'System',
                    'Event Date',
                    'Event Time',
                    'Session ID',
                  ].map((head) => (
                    <th
                      key={head}
                      style={{
                        padding: '14px',
                        textAlign: 'left',
                        color: '#1d3557',
                        fontWeight: 'bold',
                        borderBottom:
                          '2px solid #dbe7ff',
                      }}
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filteredData.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      style={{
                        padding: '40px',
                        textAlign: 'center',
                        color: '#888',
                      }}
                    >
                      No records found
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item, index) => (
                    <tr
                      key={index}
                      style={{
                        background:
                          index % 2 === 0
                            ? '#fff'
                            : '#fafcff',
                        borderBottom:
                          '1px solid #f0f0f0',
                      }}
                    >
                      {/* USER */}
                      <td style={{ padding: '14px' }}>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                          }}
                        >
                          <div
                            style={{
                              width: '38px',
                              height: '38px',
                              borderRadius: '50%',
                              background:
                                'linear-gradient(135deg,#0a6ed1,#0854a0)',
                              color: '#fff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 'bold',
                            }}
                          >
                            {item.user_id?.slice(0, 2)}
                          </div>

                          <div>
                            <div
                              style={{
                                fontWeight: 'bold',
                                color: '#1d3557',
                              }}
                            >
                              {item.user_id}
                            </div>

                            <div
                              style={{
                                fontSize: '11px',
                                color: '#777',
                              }}
                            >
                              SAP User
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* BROWSER */}
                      <td style={{ padding: '14px' }}>
                        {item.browser}
                      </td>

                      {/* DEVICE */}
                      <td style={{ padding: '14px' }}>
                        <span
                          style={{
                            background:
                              item.device_type ===
                              'Desktop'
                                ? '#e8f5e9'
                                : '#fff3e0',

                            color:
                              item.device_type ===
                              'Desktop'
                                ? '#2e7d32'
                                : '#ef6c00',

                            padding: '5px 10px',
                            borderRadius: '20px',
                            fontSize: '11px',
                            fontWeight: 'bold',
                          }}
                        >
                          {item.device_type}
                        </span>
                      </td>

                      {/* SYSTEM */}
                      <td style={{ padding: '14px' }}>
                        <span
                          style={{
                            background: '#e3f2fd',
                            color: '#1565c0',
                            padding: '5px 10px',
                            borderRadius: '20px',
                            fontSize: '11px',
                            fontWeight: 'bold',
                          }}
                        >
                          {item.system_id}
                        </span>
                      </td>

                      {/* DATE */}
                      <td style={{ padding: '14px' }}>
                        {item.event_date}
                      </td>

                      {/* TIME */}
                      <td style={{ padding: '14px' }}>
                        {formatDateTime(item.event_ts)}
                      </td>

                      {/* SESSION */}
                      <td
                        style={{
                          padding: '14px',
                          fontFamily: 'monospace',
                          color: '#555',
                        }}
                      >
                        {item.session_id}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}