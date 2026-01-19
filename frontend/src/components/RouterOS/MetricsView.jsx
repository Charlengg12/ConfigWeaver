import React, { useState, useEffect, useCallback } from 'react';
import { routerosAPI } from '../../services/routeros/api';
import { apiClient } from '../../services/api';
import { Cpu, Activity, Database, Clock, Zap, AlertCircle } from 'lucide-react';

const MetricsView = () => {
    const [devices, setDevices] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState('');
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchMetrics = useCallback(async () => {
        if (!selectedDevice) return;
        setError(null);
        try {
            const res = await routerosAPI.getMetrics(selectedDevice);
            setMetrics(res.data);
        } catch (err) {
            setError("Failed to fetch metrics: " + (err.response?.data?.detail || err.message));
        }
    }, [selectedDevice]);

    useEffect(() => {
        if (selectedDevice) {
            setLoading(true);
            fetchMetrics().finally(() => setLoading(false));
            const interval = setInterval(fetchMetrics, 3000);
            return () => clearInterval(interval);
        }
    }, [selectedDevice, fetchMetrics]);

    return (
        <div className="metrics-page fade-in">
            <header className="metrics-header" style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.25rem' }}>Real-time Health</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Live system diagnostics and interface statistics</p>
                </div>
                <div className="device-selection" style={{ display: 'flex', gap: '0.75rem' }}>
                    <select
                        value={selectedDevice}
                        onChange={e => setSelectedDevice(e.target.value)}
                        className="input-field"
                        style={{ width: '240px', padding: '0.6rem 1rem' }}
                    >
                        <option value="">Select a Device...</option>
                        {devices.map(d => <option key={d.id} value={d.id}>{d.name} ({d.ip_address})</option>)}
                    </select>
                </div>
            </header>

            {error && (
                <div className="alert error" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger-color)', padding: '1rem', borderRadius: '8px', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <AlertCircle size={20} />
                    {error}
                </div>
            )}

            {!selectedDevice && (
                <div className="no-selection-state" style={{ height: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', background: 'var(--glass-bg)', borderRadius: '12px', border: '1px dashed var(--glass-border)' }}>
                    <Activity size={48} style={{ marginBottom: '1rem', opacity: '0.5' }} />
                    <p>Select a device to start monitoring real-time health</p>
                </div>
            )}

            {loading && !metrics && (
                <div style={{ padding: '4rem', textAlign: 'center' }}>
                    <Zap className="spin" size={32} color="var(--accent-color)" />
                </div>
            )}

            {metrics && (
                <div className="metrics-content">
                    <div className="health-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
                        <div className="card metric-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: '500' }}>CPU Load</span>
                                <Cpu size={20} color="var(--accent-color)" />
                            </div>
                            <div style={{ fontSize: '2rem', fontWeight: '700' }}>{metrics['cpu-load']}%</div>
                            <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', marginTop: '1rem' }}>
                                <div style={{ width: `${metrics['cpu-load']}%`, height: '100%', background: metrics['cpu-load'] > 80 ? 'var(--danger-color)' : 'var(--accent-color)', borderRadius: '2px', transition: 'width 0.3s' }}></div>
                            </div>
                        </div>

                        <div className="card metric-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: '500' }}>Free Memory</span>
                                <Database size={20} color="var(--accent-color)" />
                            </div>
                            <div style={{ fontSize: '2rem', fontWeight: '700' }}>{Math.round(metrics['free-memory'] / 1024 / 1024)}<span style={{ fontSize: '1rem', marginLeft: '0.25rem', color: 'var(--text-secondary)' }}>MB</span></div>
                            <div style={{ color: 'var(--success-color)', fontSize: '0.75rem', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <Activity size={12} /> Optimal
                            </div>
                        </div>

                        <div className="card metric-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: '500' }}>System Uptime</span>
                                <Clock size={20} color="var(--accent-color)" />
                            </div>
                            <div style={{ fontSize: '1.25rem', fontWeight: '600', height: '2.5rem', display: 'flex', alignItems: 'center' }}>{metrics['uptime']}</div>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '0.5rem' }}>
                                Since last reboot
                            </div>
                        </div>

                        <div className="card metric-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: '500' }}>Version</span>
                                <Zap size={20} color="var(--accent-color)" />
                            </div>
                            <div style={{ fontSize: '1.25rem', fontWeight: '600', height: '2.5rem', display: 'flex', alignItems: 'center' }}>{metrics['version']}</div>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '0.5rem' }}>
                                Stable Release
                            </div>
                        </div>
                    </div>

                    <div className="visualization-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                            <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between' }}>
                                <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Interface Traffic</h4>
                            </div>
                            <iframe
                                src={`http://localhost:3000/d-solo/networkweaver-main/routeros-metrics?orgId=1&panelId=1&var-device=${selectedDevice}&kiosk`}
                                width="100%"
                                height="280"
                                frameBorder="0"
                                title="Interface Traffic"
                                style={{ display: 'block' }}
                            ></iframe>
                        </div>

                        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                            <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between' }}>
                                <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Performance History</h4>
                            </div>
                            <iframe
                                src={`http://localhost:3000/d-solo/networkweaver-main/routeros-metrics?orgId=1&panelId=2&var-device=${selectedDevice}&kiosk`}
                                width="100%"
                                height="280"
                                frameBorder="0"
                                title="CPU & Memory"
                                style={{ display: 'block' }}
                            ></iframe>
                        </div>
                    </div>
                    <div style={{ marginTop: '1rem', textAlign: 'right' }}>
                        <small style={{ color: 'var(--text-secondary)', opacity: '0.7', fontSize: '0.7rem' }}>
                            <Activity size={10} style={{ marginRight: '4px' }} className="spin" />
                            Live updates every 3 seconds
                        </small>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MetricsView;
