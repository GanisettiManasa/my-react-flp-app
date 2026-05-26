import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

const BASE =
  '/sap/opu/odata4/sap/zftx_analytics_srv/srvd/sap/zftx_analytics_srd/0001';

const PAGE_SIZE = 500;

const formatDateTime = (ts) => {
  if (!ts) return '-';

  return new Date(ts).toLocaleString();
};

export default function LogonDetail({
  navigate,
}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] =
    useState(false);
  const [error, setError] = useState('');

  const [searchUser, setSearchUser] =
    useState('');
  const [searchDate, setSearchDate] =
    useState('');

  const [page, setPage] = useState(1);

  // API CALL WITH PAGINATION
  useEffect(() => {
    setLoading(true);

    const skip = (page - 1) * PAGE_SIZE;

    fetch(
      `${BASE}/ZFTX_C_LOGON_DETAIL?$top=${PAGE_SIZE}&$skip=${skip}&sap-client=100`
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error(
            `HTTP ${res.status}`
          );
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
  }, [page]);

  // FILTERING
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const userMatch = item.user_id
        ?.toLowerCase()
        .includes(
          searchUser.toLowerCase()
        );

      const dateMatch = searchDate
        ? item.event_date === searchDate
        : true;

      return userMatch && dateMatch;
    });
  }, [data, searchUser, searchDate]);

  // KPI DATA
  const totalLogons =
    filteredData.length;

  const uniqueUsers = new Set(
    filteredData.map(
      (item) => item.user_id
    )
  ).size;

  const desktopUsers =
    filteredData.filter(
      (item) =>
        item.device_type ===
        'Desktop'
    ).length;

  const browserCount = {};

  filteredData.forEach((item) => {
    browserCount[item.browser] =
      (browserCount[item.browser] ||
        0) + 1;
  });

  const topBrowser =
    Object.keys(browserCount).sort(
      (a, b) =>
        browserCount[b] -
        browserCount[a]
    )[0] || '-';

  // CARD STYLE
  const cardStyle = (bg) => ({
    flex: 1,
    background: bg,
    borderRadius: '16px',
    padding: '20px',
    color: '#fff',
    boxShadow:
      '0 6px 18px rgba(0,0,0,0.12)',
    minHeight: '140px',
  });

  return ( 
    <div
      style={{
        background: '#eef3f8',
        minHeight: '100vh',
        padding: '20px',
        fontFamily:
          'Inter, Arial, sans-serif',
      }}
    >

      {/* HEADER */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '18px 24px',
          display: 'flex',
          justifyContent:
            'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          boxShadow:
            '0 3px 12px rgba(0,0,0,0.08)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
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
            <div
              style={{
                fontSize: '18px',
                fontWeight: '700',
                color: '#16324f',
              }}
            >
              Logon Detail Analytics
            </div>

            <div
              style={{
                fontSize: '13px',
                color: '#6b7280',
                marginTop: '4px',
              }}
            >
              SAP User Login Activity
              Dashboard
            </div>
          </div>
        </div>

      </div>
     

      {/* KPI CARDS */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(4, 1fr)',
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
              justifyContent:
                'space-between',
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
                  fontSize: '38px',
                  fontWeight: '700',
                  marginTop: '14px',
                }}
              >
                {totalLogons}
              </div>
            </div>

            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '14px',
                background:
                  'rgba(255,255,255,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent:
                  'center',
                fontSize: '28px',
              }}
            >
              🔐
            </div>
          </div>

          <div
            style={{
              marginTop: '16px',
              fontSize: '12px',
              opacity: 0.8,
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
              justifyContent:
                'space-between',
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
                  fontSize: '38px',
                  fontWeight: '700',
                  marginTop: '14px',
                }}
              >
                {uniqueUsers}
              </div>
            </div>

            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '14px',
                background:
                  'rgba(255,255,255,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent:
                  'center',
                fontSize: '28px',
              }}
            >
              👥
            </div>
          </div>

          <div
            style={{
              marginTop: '16px',
              fontSize: '12px',
              opacity: 0.8,
            }}
          >
            Active SAP users
          </div>
        </div>

        {/* DESKTOP */}
        <div
          style={cardStyle(
            'linear-gradient(135deg,#5b2c6f,#7d3c98)'
          )}
        >
          <div
            style={{
              display: 'flex',
              justifyContent:
                'space-between',
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
                  fontSize: '38px',
                  fontWeight: '700',
                  marginTop: '14px',
                }}
              >
                {desktopUsers}
              </div>
            </div>

            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '14px',
                background:
                  'rgba(255,255,255,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent:
                  'center',
                fontSize: '28px',
              }}
            >
              🖥️
            </div>
          </div>

          <div
            style={{
              marginTop: '16px',
              fontSize: '12px',
              opacity: 0.8,
            }}
          >
            Desktop sessions
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
              justifyContent:
                'space-between',
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
                  marginTop: '16px',
                }}
              >
                {topBrowser}
              </div>
            </div>

            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '14px',
                background:
                  'rgba(255,255,255,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent:
                  'center',
                fontSize: '28px',
              }}
            >
              🌐
            </div>
          </div>

          <div
            style={{
              marginTop: '16px',
              fontSize: '12px',
              opacity: 0.8,
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
          boxShadow:
            '0 3px 10px rgba(0,0,0,0.08)',
        }}
      >
        {/* USER */}
        <div>
          <label
            style={{
              display: 'block',
              marginBottom: '6px',
              fontSize: '12px',
              fontWeight: '700',
              color: '#555',
            }}
          >
            USER ID
          </label>

          <input
            type="text"
            value={searchUser}
            onChange={(e) =>
              setSearchUser(
                e.target.value
              )
            }
            placeholder="Search User..."
            style={{
              width: '240px',
              padding: '10px 12px',
              borderRadius: '8px',
              border:
                '1px solid #d0d7de',
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
              fontWeight: '700',
              color: '#555',
            }}
          >
            EVENT DATE
          </label>

          <input
            type="date"
            value={searchDate}
            onChange={(e) =>
              setSearchDate(
                e.target.value
              )
            }
            style={{
              width: '200px',
              padding: '10px 12px',
              borderRadius: '8px',
              border:
                '1px solid #d0d7de',
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
            background:
              'linear-gradient(135deg,#334155,#1e293b)',
            color: '#fff',
            cursor: 'pointer',
            fontWeight: '700',
          }}
        >
          Clear
        </button>
      </div>

      {/* TABLE */}
      <div
        style={{
          background: '#fff',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow:
            '0 3px 10px rgba(0,0,0,0.08)',
        }}
      >
        {/* TABLE HEADER */}
        <div
          style={{
            background:
              'linear-gradient(90deg,#16324f,#274c77)',
            color: '#fff',
            padding: '16px 20px',
            fontWeight: '700',
            display: 'flex',
            justifyContent:
              'space-between',
            alignItems: 'center',
          }}
        >
          <span>
            Logon Details
          </span>

          {/* PAGINATION */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <button
              disabled={page === 1}
              onClick={() =>
                setPage((p) => p - 1)
              }
              style={{
                border: 'none',
                padding:
                  '7px 14px',
                borderRadius: '8px',
                cursor:
                  page === 1
                    ? 'not-allowed'
                    : 'pointer',
                background:
                  page === 1
                    ? '#94a3b8'
                    : '#ffffff',
                color:
                  page === 1
                    ? '#fff'
                    : '#16324f',
                fontWeight: '700',
              }}
            >
              Prev
            </button>

            <div
              style={{
                fontSize: '13px',
                fontWeight: '700',
              }}
            >
              Page {page}
            </div>

            <button
              onClick={() =>
                setPage((p) => p + 1)
              }
              style={{
                border: 'none',
                padding:
                  '7px 14px',
                borderRadius: '8px',
                cursor: 'pointer',
                background: '#ffffff',
                color: '#16324f',
                fontWeight: '700',
              }}
            >
              Next
            </button>
          </div>
        </div>

        {/* TABLE BODY */}
        <div
          style={{
            maxHeight: '620px',
            overflowY: 'auto',
            overflowX: 'auto',
          }}
        >
          {loading ? (
            <div
              style={{
                padding: '60px',
                textAlign: 'center',
                color: '#64748b',
              }}
            >
              Loading data...
            </div>
          ) : error ? (
            <div
              style={{
                padding: '30px',
                color: '#dc2626',
                fontWeight: '700',
              }}
            >
              Error: {error}
            </div>
          ) : (
            <table
              style={{
                width: '100%',
                borderCollapse:
                  'collapse',
                fontSize: '13px',
              }}
            >
              <thead
                style={{
                  position: 'sticky',
                  top: 0,
                  zIndex: 5,
                }}
              >
                <tr
                  style={{
                    background:
                      '#edf4ff',
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
                        padding:
                          '14px',
                        textAlign:
                          'left',
                        color:
                          '#16324f',
                        fontWeight:
                          '700',
                        borderBottom:
                          '1px solid #dbe7ff',
                        whiteSpace:
                          'nowrap',
                      }}
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filteredData.length ===
                0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      style={{
                        padding:
                          '50px',
                        textAlign:
                          'center',
                        color:
                          '#64748b',
                      }}
                    >
                      No records found
                    </td>
                  </tr>
                ) : (
                  filteredData.map(
                    (
                      item,
                      index
                    ) => (
                      <tr
                        key={
                          index
                        }
                        style={{
                          background:
                            index %
                              2 ===
                            0
                              ? '#fff'
                              : '#f8fbff',
                          borderBottom:
                            '1px solid #eef2f7',
                        }}
                      >
                        {/* USER */}
                        <td
                          style={{
                            padding:
                              '14px',
                          }}
                        >
                          <div
                            style={{
                              display:
                                'flex',
                              alignItems:
                                'center',
                              gap: '12px',
                            }}
                          >
                            <div
                              style={{
                                width:
                                  '40px',
                                height:
                                  '40px',
                                borderRadius:
                                  '50%',
                                background:
                                  'linear-gradient(135deg,#0a6ed1,#0854a0)',
                                color:
                                  '#fff',
                                display:
                                  'flex',
                                alignItems:
                                  'center',
                                justifyContent:
                                  'center',
                                fontWeight:
                                  '700',
                              }}
                            >
                              {item.user_id?.slice(
                                0,
                                2
                              )}
                            </div>

                            <div>
                              <div
                                style={{
                                  fontWeight:
                                    '700',
                                  color:
                                    '#16324f',
                                }}
                              >
                                {
                                  item.user_id
                                }
                              </div>

                              {/* <div
                                style={{
                                  fontSize:
                                    '11px',
                                  color:
                                    '#64748b',
                                }}
                              >
                                SAP User
                              </div> */}
                            </div>
                          </div>
                        </td>

                        {/* BROWSER */}
                        <td
                          style={{
                            padding:
                              '14px',
                          }}
                        >
                          {
                            item.browser
                          }
                        </td>

                        {/* DEVICE */}
                        <td
                          style={{
                            padding:
                              '14px',
                          }}
                        >
                          <span
                            style={{
                              background:
                                item.device_type ===
                                'Desktop'
                                  ? '#dcfce7'
                                  : '#fff7ed',
                              color:
                                item.device_type ===
                                'Desktop'
                                  ? '#166534'
                                  : '#ea580c',
                              padding:
                                '5px 12px',
                              borderRadius:
                                '20px',
                              fontSize:
                                '11px',
                              fontWeight:
                                '700',
                            }}
                          >
                            {
                              item.device_type
                            }
                          </span>
                        </td>

                        {/* SYSTEM */}
                        <td
                          style={{
                            padding:
                              '14px',
                          }}
                        >
                          <span
                            style={{
                              background:
                                '#dbeafe',
                              color:
                                '#1d4ed8',
                              padding:
                                '5px 12px',
                              borderRadius:
                                '20px',
                              fontSize:
                                '11px',
                              fontWeight:
                                '700',
                            }}
                          >
                            {
                              item.system_id
                            }
                          </span>
                        </td>

                        {/* DATE */}
                        <td
                          style={{
                            padding:
                              '14px',
                          }}
                        >
                          {
                            item.event_date
                          }
                        </td>

                        {/* TIME */}
                        <td
                          style={{
                            padding:
                              '14px',
                          }}
                        >
                          {formatDateTime(
                            item.event_ts
                          )}
                        </td>

                        {/* SESSION */}
                        <td
                          style={{
                            padding:
                              '14px',
                            fontFamily:
                              'monospace',
                            color:
                              '#475569',
                          }}
                        >
                          {
                            item.session_id
                          }
                        </td>
                      </tr>
                    )
                  )
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}