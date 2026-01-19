import React from 'react';
import './Monitoring.css';

const Monitoring = () => {
    // In a real scenario, this URL would be dynamic or configured via env vars
    // Assuming Grafana is running on localhost:3000 and has a dashboard with UID 'networkweaver'
    // using "d-solo" for single panels or "d" for full dashboard
    const GRAFANA_URL = "http://localhost:3000/d/networkweaver-main?orgId=1&kiosk=tv";

    return (
        <div className="page-container monitoring-container">
            <iframe
                src={GRAFANA_URL}
                width="100%"
                height="100%"
                frameBorder="0"
                title="Grafana Dashboard"
            ></iframe>
            {/* Fallback Message for Demo */}
            <div className="grafana-overlay">
                <p>If Grafana is not loading, ensure the container is running and the dashboard is created.</p>
                <p>Dashboard URL: <a href="http://localhost:3000" target="_blank" rel="noreferrer">Open Grafana</a></p>
            </div>
        </div>
    );
};

export default Monitoring;
