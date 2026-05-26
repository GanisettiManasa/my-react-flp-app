import React, { useEffect, useMemo, useState } from 'react';

const BASE =
  '/sap/opu/odata4/sap/zftx_analytics_srv/srvd/sap/zftx_analytics_srd/0001';

const formatDateTime = (ts) => {
  if (!ts) return '-';

  const s = Math.floor(ts).toString();

  if (s.length < 14) return s;

  return `${s.slice(6, 8)}/${s.slice(4, 6)}/${s.slice(0, 4)}
   ${s.slice(8, 10)}:${s.slice(10, 12)}`;
};

export default function UserActivity({ navigate }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchUser, setSearchUser] = useState('');
  const [searchSystem, setSearchSystem] = useState('');
  const [searchDate, setSearchDate] = useState('');

  useEffect(() => {
    fetch(
      `${BASE}/ZFTX_C_USER_ACTIVITY?$top=30&sap-client=100`
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

  // const filteredData = useMemo(() => {
  //   return data.filter((item) => {
  //     const userMatch = item.user_id
  //       ?.toLowerCase()
  //       .includes(searchUser.toLowerCase());

  //     const systemMatch = item.system_id
  //       ?.toLowerCase()
  //       .includes(searchSystem.toLowerCase());

  //     return userMatch && systemMatch;
  //   });
  // }, [data, searchUser, searchSystem]);
  const filteredData = useMemo(() => {
  return data.filter((item) => {
    const userMatch = item.user_id
      ?.toLowerCase()
      .includes(searchUser.toLowerCase());

    const dateMatch = searchDate
      ? item.first_activity_date === searchDate
      : true;

    return userMatch && dateMatch;
  });
}, [data, searchUser, searchDate]);

  const totalUsers = filteredData.length;

  const totalLaunches = filteredData.reduce(
    (sum, item) => sum + (item.total_launches || 0),
    0
  );

  const totalApps = filteredData.reduce(
    (sum, item) => sum + (item.unique_apps_used || 0),
    0
  );

  const topUser = [...filteredData].sort(
    (a, b) => (b.total_launches || 0) - (a.total_launches || 0)
  )[0];

  const cardStyle = (bg) => ({
  flex: 1,
  background: bg,
  borderRadius: '16px',
  padding: '20px',
  color: '#fff',
  boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
  position: 'relative',
  overflow: 'hidden',
  transition: '0.25s ease',
  cursor: 'pointer',
  border: '1px solid rgba(255,255,255,0.08)',
});

  return (
    <div
      style={{
        background: '#eef2f7',
        minHeight: '100vh',
        padding: '20px',
        boxSizing: 'border-box',
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
            User Activity Analytics
          </div>

          {/* <div
            style={{
              fontSize: '13px',
              color: '#777',
              marginTop: '4px',
            }}
          >
            SAP Fiori User Usage Dashboard
          </div> */}
        </div>

        <button
          onClick={() => navigate('home')}
          style={{
            border: 'none',
            background: '#0070f3',
            color: '#fff',
            padding: '10px 18px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '13px',
          }}
        >
          ← Back
        </button>
      </div>

      {/* KPI CARDS */}
    <div
  style={{
    display: 'flex',
    gap: '16px',
    marginBottom: '20px',
  }}
>
  {/* TOTAL USERS */}
  <div
    style={cardStyle(
      'linear-gradient(135deg,#0a6ed1,#0854a0)'
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
            fontSize: '12px',
            opacity: 0.85,
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
          }}
        >
          Total Users
        </div>

        <div
          style={{
            fontSize: '34px',
            fontWeight: '700',
            marginTop: '10px',
          }}
        >
          {totalUsers}
        </div>
      </div>

      <div
        style={{
          width: '52px',
          height: '52px',
          borderRadius: '14px',
          background:
            'rgba(255,255,255,0.16)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '26px',
          backdropFilter: 'blur(6px)',
        }}
      >
        👥
      </div>
    </div>

    <div
      style={{
        marginTop: '14px',
        fontSize: '12px',
        opacity: 0.8,
      }}
    >
      Active SAP Users
    </div>
  </div>

  {/* TOTAL LAUNCHES */}
  <div
    style={cardStyle(
      'linear-gradient(135deg,#107e3e,#0b5d2a)'
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
            fontSize: '12px',
            opacity: 0.85,
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
          }}
        >
          Total Launches
        </div>

        <div
          style={{
            fontSize: '34px',
            fontWeight: '700',
            marginTop: '10px',
          }}
        >
          {totalLaunches}
        </div>
      </div>

      <div
        style={{
          width: '52px',
          height: '52px',
          borderRadius: '14px',
          background:
            'rgba(255,255,255,0.16)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '26px',
          backdropFilter: 'blur(6px)',
        }}
      >
        🚀
      </div>
    </div>

    <div
      style={{
        marginTop: '14px',
        fontSize: '12px',
        opacity: 0.8,
      }}
    >
      Application Opens
    </div>
  </div>

  {/* APPS USED */}
  <div
    style={cardStyle(
      'linear-gradient(135deg,#6f42c1,#512b8f)'
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
            fontSize: '12px',
            opacity: 0.85,
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
          }}
        >
          Apps Used
        </div>

        <div
          style={{
            fontSize: '34px',
            fontWeight: '700',
            marginTop: '10px',
          }}
        >
          {totalApps}
        </div>
      </div>

      <div
        style={{
          width: '52px',
          height: '52px',
          borderRadius: '14px',
          background:
            'rgba(255,255,255,0.16)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '26px',
          backdropFilter: 'blur(6px)',
        }}
      >
        📱
      </div>
    </div>

    <div
      style={{
        marginTop: '14px',
        fontSize: '12px',
        opacity: 0.8,
      }}
    >
      Fiori Applications
    </div>
  </div>

  {/* TOP USER */}
  <div
    style={cardStyle(
      'linear-gradient(135deg,#e9730c,#c75d00)'
    )}
  >
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
      }}
    >
      <div style={{ width: '75%' }}>
        <div
          style={{
            fontSize: '12px',
            opacity: 0.85,
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
          }}
        >
          Top Active User
        </div>

        <div
          style={{
            fontSize: '22px',
            fontWeight: '700',
            marginTop: '14px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {topUser?.user_id || '-'}
        </div>
      </div>

      <div
        style={{
          width: '52px',
          height: '52px',
          borderRadius: '14px',
          background:
            'rgba(255,255,255,0.16)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '26px',
          backdropFilter: 'blur(6px)',
        }}
      >
        🏆
      </div>
    </div>

    <div
      style={{
        marginTop: '14px',
        fontSize: '12px',
        opacity: 0.8,
      }}
    >
      Highest Usage
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
  {/* USER SEARCH */}
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

  {/* LAST ACTIVITY DATE */}
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
      LAST ACTIVITY DATE
    </label>

    <input
      type="date"
      value={searchDate}
      onChange={(e) => setSearchDate(e.target.value)}
      style={{
        width: '220px',
        padding: '10px 12px',
        borderRadius: '8px',
        border: '1px solid #d0d7de',
        outline: 'none',
      }}
    />
  </div>

  {/* CLEAR BUTTON */}
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
      color: '#444',
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
        {/* TABLE HEADER */}
        <div
          style={{
            background: 'linear-gradient(90deg,#1d3557,#274c77)',
            color: '#fff',
            padding: '16px 20px',
            fontWeight: 'bold',
            fontSize: '15px',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <span>User Activity Details</span>

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
                    // background: '#edf4ff',
                  }}
                >
                  {[
                    'User',
                    'System',
                    'Launches',
                    'Apps Used',
                    'First Activity',
                    'Last Activity',
                  ].map((head) => (
                    <th
                      key={head}
                      style={{
                        padding: '14px',
                        textAlign:
                          head === 'Launches' ||
                          head === 'Apps Used'
                            ? 'right'
                            : 'left',
                        color: '#1d3557',
                        fontWeight: 'bold',
                        borderBottom: '2px solid #dbe7ff',
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
                      colSpan="6"
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
                          index % 2 === 0 ? '#fff' : '#fafcff',
                        transition: '0.2s',
                        borderBottom: '1px solid #f0f0f0',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          '#edf4ff';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background =
                          index % 2 === 0 ? '#fff' : '#fafcff';
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
                              width: '40px',
                              height: '40px',
                              borderRadius: '50%',
                              background:
                                'linear-gradient(135deg,#0070f3,#0057c2)',
                              color: '#fff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 'bold',
                              fontSize: '14px',
                              flexShrink: 0,
                            }}
                          >
                            {item.user_id?.slice(0, 2)}
                          </div>

                          <div>
                            <div
                              style={{
                                fontWeight: 'bold',
                                color: '#1d3557',
                                fontSize: '13px',
                              }}
                            >
                              {item.user_id}
                            </div>

                            <div
                              style={{
                                fontSize: '11px',
                                color: '#777',
                                marginTop: '2px',
                              }}
                            >
                              {item.department || 'SAP User'}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* SYSTEM */}
                      <td style={{ padding: '14px' }}>
                        <span
                          style={{
                            background: '#e8f5e9',
                            color: '#2e7d32',
                            padding: '5px 10px',
                            borderRadius: '20px',
                            fontSize: '11px',
                            fontWeight: 'bold',
                          }}
                        >
                          {item.system_id}
                        </span>
                      </td>

                      {/* LAUNCHES */}
                      <td
                        style={{
                          padding: '14px',
                          textAlign: 'right',
                        }}
                      >
                        <span
                          style={{
                            background:
                              item.total_launches > 20
                                ? '#e8f5e9'
                                : '#fff3e0',

                            color:
                              item.total_launches > 20
                                ? '#2e7d32'
                                : '#ef6c00',

                            padding: '6px 12px',
                            borderRadius: '20px',
                            fontWeight: 'bold',
                            fontSize: '12px',
                          }}
                        >
                          {item.total_launches}
                        </span>
                      </td>

                      {/* APPS */}
                      <td
                        style={{
                          padding: '14px',
                          textAlign: 'right',
                          fontWeight: 'bold',
                          color: '#8e44ad',
                        }}
                      >
                        {item.unique_apps_used}
                      </td>

                      {/* FIRST ACTIVITY */}
                      <td
                        style={{
                          padding: '14px',
                          color: '#555',
                          fontSize: '12px',
                        }}
                      >
                        {item.first_activity_date}
                      </td>

                      {/* LAST ACTIVITY */}
                      <td
                        style={{
                          padding: '14px',
                          color: '#555',
                          fontSize: '12px',
                        }}
                      >
                        {formatDateTime(item.last_activity_ts)}
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