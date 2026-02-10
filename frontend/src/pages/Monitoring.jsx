import React from 'react';

const Monitoring = () => {
    // Mikrotik Dashboard - Kiosk mode for cleaner embedded view
    const GRAFANA_URL = "http://localhost:3000/d/LyX-A_nnk/mikrotik?orgId=1&kiosk&theme=dark";

    return (
        <div style={{ width: '100%', height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
            <iframe
                src={GRAFANA_URL}
                width="100%"
                height="100%"
                frameBorder="0"
                title="MikroTik Dashboard"
                style={{ display: 'block' }}
            ></iframe>
        </div>
    );
};

export default Monitoring;
