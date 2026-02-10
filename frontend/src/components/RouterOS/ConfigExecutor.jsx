import React, { useState, useEffect } from 'react';
import { apiClient } from '../../services/api';
import { Terminal, Play, RotateCcw, Box, Hash, ChevronRight, Zap, RefreshCw, Layers, ArrowRight, Shield, Globe } from 'lucide-react';
import { useToast } from '../../App';

const ConfigExecutor = () => {
    const [devices, setDevices] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState('');

    // Dynamic Resources
    const [interfaces, setInterfaces] = useState([]);
    const [bridges, setBridges] = useState([]);
    const [vlans, setVlans] = useState([]);
    const [resourceLoading, setResourceLoading] = useState(false);

    const [command, setCommand] = useState('');
    const [logs, setLogs] = useState('');
    const [loading, setLoading] = useState(false);

    // New State for Templates
    const [template, setTemplate] = useState('custom');
    const [params, setParams] = useState({});

    // Toast Hook
    const { addToast } = useToast();

    // Fetch Devices
    useEffect(() => {
        const abortController = new AbortController();
        apiClient.get('/devices/', { signal: abortController.signal })
            .then(res => setDevices(res.data))
            .catch(err => {
                if (err.name !== 'CanceledError') console.error("Failed to fetch devices", err);
            });
        return () => abortController.abort();
    }, []);

    // Fetch Resources when Device Selected
    useEffect(() => {
        if (!selectedDevice) {
            setInterfaces([]);
            setBridges([]);
            setVlans([]);
            return;
        }

        const fetchResources = async () => {
            setResourceLoading(true);
            try {
                const [ifaceRes, bridgeRes, vlanRes] = await Promise.allSettled([
                    apiClient.get(`/routeros/resources/${selectedDevice}/interfaces`),
                    apiClient.get(`/routeros/resources/${selectedDevice}/bridges`),
                    apiClient.get(`/routeros/resources/${selectedDevice}/vlans`)
                ]);

                if (ifaceRes.status === 'fulfilled') setInterfaces(ifaceRes.value.data);
                if (bridgeRes.status === 'fulfilled') setBridges(bridgeRes.value.data);
                if (vlanRes.status === 'fulfilled') setVlans(vlanRes.value.data);

            } catch (error) {
                console.error("Resource fetch error:", error);
                addToast("Failed to fetch device resources", "warning");
            } finally {
                setResourceLoading(false);
            }
        };

        fetchResources();
    }, [selectedDevice]);

    // Smart Defaults Logic
    useEffect(() => {
        if (template === 'lan_setup' && params['Interface']) {
            // Auto-suggest IP based on interface existing addresses? 
            // For now, let's just use defaults if empty
            if (!params['DNS']) setParams(p => ({ ...p, 'DNS': '8.8.8.8,1.1.1.1' }));
        }
    }, [template, params['Interface']]);

    const handleExecute = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await apiClient.post('/config/deploy', {
                device_id: parseInt(selectedDevice),
                template_name: template,
                params: template === 'custom' ? { command: command } : params
            });
            const msg = res.data.message || 'Configuration applied successfully';
            setLogs(prev => `[Success] ${new Date().toLocaleTimeString()}: ${msg}\n${prev}`);
            addToast(`Success: ${msg}`, 'success');

            // Refresh resources after successful config
            if (template.includes('interface') || template.includes('bridge')) {
                // re-trigger resource fetch
                const ifaceRes = await apiClient.get(`/routeros/resources/${selectedDevice}/interfaces`);
                setInterfaces(ifaceRes.data);
            }

        } catch (error) {
            const errDetails = error.response?.data?.detail || error.message;
            setLogs(prev => `[Error] ${new Date().toLocaleTimeString()}: ${errDetails}\n${prev}`);
            addToast(`Error: ${errDetails}`, 'error');
        } finally {
            setLoading(false);
        }
    };

    const templates = [
        // --- Quick Actions (Workflow Composite) ---
        {
            id: 'lan_setup', category: 'Quick Actions', name: 'LAN Setup (IP + DHCP + NAT)',
            fields: [
                { name: 'Interface', type: 'select', source: 'interfaces' },
                { name: 'IP Address', type: 'text', placeholder: '192.168.88.1/24' },
                { name: 'DHCP Server', type: 'select', options: ['yes', 'no'], default: 'yes' },
                { name: 'DNS', type: 'text', default: '8.8.8.8,1.1.1.1' }
            ]
        },
        {
            id: 'wan_setup', category: 'Quick Actions', name: 'WAN Setup (DHCP Client + Firewall)',
            fields: [
                { name: 'Interface', type: 'select', source: 'interfaces' },
                { name: 'Firewall', type: 'select', options: ['yes', 'no'], default: 'yes' }
            ]
        },

        // --- Bridge ---
        {
            id: 'bridge_add', category: 'Bridge', name: 'Add Bridge',
            fields: [{ name: 'Bridge Name', type: 'text' }]
        },
        {
            id: 'bridge_add_port', category: 'Bridge', name: 'Add Port to Bridge',
            fields: [
                { name: 'Bridge Name', type: 'select', source: 'bridges' },
                { name: 'Interface', type: 'select', source: 'interfaces' }
            ]
        },
        // --- IP ---
        {
            id: 'ip_address_add', category: 'IP', name: 'Add IP Address',
            fields: [
                { name: 'Interface', type: 'select', source: 'interfaces' },
                { name: 'IP Address', type: 'text', placeholder: '10.0.0.1/24' }
            ]
        },
        {
            id: 'dns_config', category: 'IP', name: 'DNS Configuration',
            fields: [
                { name: 'Primary DNS', type: 'text', default: '8.8.8.8' },
                { name: 'Secondary DNS', type: 'text', default: '1.1.1.1' },
                { name: 'Allow Remote Requests', type: 'select', options: ['yes', 'no'], default: 'yes' }
            ]
        },
        // --- NAT ---
        {
            id: 'nat_masquerade', category: 'NAT', name: 'NAT Masquerade',
            fields: [
                { name: 'Out Interface', type: 'select', source: 'interfaces' }
            ]
        },
        {
            id: 'nat_dst', category: 'NAT', name: 'Port Forward (DstNAT)',
            fields: [
                { name: 'Protocol', type: 'select', options: ['tcp', 'udp'], default: 'tcp' },
                { name: 'Dst Port', type: 'text' },
                { name: 'To Address', type: 'text' },
                { name: 'To Port', type: 'text' }
            ]
        },
        // --- Custom ---
        { id: 'custom', category: 'Custom', name: 'Custom Command', fields: [] }
    ];

    const templateCategories = [...new Set(templates.map(t => t.category))];

    // Helper to render fields
    const renderField = (field) => {
        const value = params[field.name] !== undefined ? params[field.name] : (field.default || '');

        // Handle Selects
        if (field.type === 'select') {
            let options = [];
            if (field.source === 'interfaces') options = interfaces.map(i => i.name);
            else if (field.source === 'bridges') options = bridges.map(b => b.name);
            else if (field.options) options = field.options;

            return (
                <div className="form-group" key={field.name}>
                    <label className="input-label">
                        {field.name}
                        {resourceLoading && field.source && <RefreshCw size={10} className="spin" style={{ marginLeft: 5 }} />}
                    </label>
                    <select
                        className="input-field"
                        value={value}
                        onChange={e => setParams(prev => ({ ...prev, [field.name]: e.target.value }))}
                        disabled={resourceLoading && !!field.source}
                        required
                    >
                        <option value="">Select {field.name}...</option>
                        {options.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                </div>
            );
        }

        // Handle Text
        return (
            <div className="form-group" key={field.name}>
                <label className="input-label">{field.name}</label>
                <input
                    type="text"
                    className="input-field"
                    value={value}
                    onChange={e => setParams(prev => ({ ...prev, [field.name]: e.target.value }))}
                    placeholder={field.placeholder || ''}
                    required
                />
            </div>
        );
    };

    return (
        <div className="config-executor-container fade-in">
            <header className="page-header" style={{ border: 'none', paddingBottom: 0 }}>
                <h2 className="section-title">Configuration Studio</h2>
                <p className="page-subtitle">Smart configuration deployment with live resource data</p>
            </header>

            <div className="executor-grid">
                <div className="controls-section">
                    <div className="card">
                        <form onSubmit={handleExecute}>
                            <div className="form-group">
                                <label className="input-label">Target Device</label>
                                <select
                                    className="input-field"
                                    value={selectedDevice}
                                    onChange={e => setSelectedDevice(e.target.value)}
                                    required
                                >
                                    <option value="">Select Device...</option>
                                    {devices.map(d => <option key={d.id} value={d.id}>{d.name} ({d.ip_address})</option>)}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="input-label">Template</label>
                                <select
                                    className="input-field"
                                    value={template}
                                    onChange={e => {
                                        setTemplate(e.target.value);
                                        setParams({});
                                    }}
                                >
                                    {templateCategories.map(category => (
                                        <optgroup key={category} label={category}>
                                            {templates.filter(t => t.category === category).map(t => (
                                                <option key={t.id} value={t.id}>{t.name}</option>
                                            ))}
                                        </optgroup>
                                    ))}
                                </select>
                            </div>

                            <div className="template-fields-container" style={{ minHeight: 150 }}>
                                {template === 'custom' ? (
                                    <div className="form-group">
                                        <label className="input-label">Command / Script</label>
                                        <textarea
                                            className="input-field"
                                            value={command}
                                            onChange={e => setCommand(e.target.value)}
                                            placeholder="/system/identity/print"
                                            rows="5"
                                            style={{ fontFamily: 'var(--font-mono)' }}
                                        />
                                    </div>
                                ) : (
                                    <div className="template-fields">
                                        {templates.find(t => t.id === template)?.fields.map(field => renderField(field))}
                                    </div>
                                )}
                            </div>

                            <div className="action-row">
                                <button type="submit" className="btn-primary" disabled={loading || !selectedDevice}>
                                    {loading ? <RefreshCw className="spin" size={18} /> : <Zap size={18} />}
                                    {loading ? 'Executing...' : 'Run Configuration'}
                                </button>
                                <button
                                    type="button"
                                    className="btn-secondary rollback-btn"
                                    onClick={() => setLogs(prev => `[Rollback] ${new Date().toLocaleTimeString()}: Manual rollback initiated\n${prev}`)}
                                    disabled={loading || !selectedDevice}
                                >
                                    <RotateCcw size={16} /> Rollback
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="log-section">
                    <div className="card log-card">
                        <header className="log-header">
                            <Terminal size={16} />
                            <span>Execution Log</span>
                        </header>
                        <div className="log-content">
                            {logs ? (
                                logs.split('\n').map((line, i) => (
                                    <div key={i} className="log-line">
                                        <span className="line-num">{i + 1}</span>
                                        <span className={
                                            line.includes('[Success]') ? 'text-success' :
                                                line.includes('[Error]') ? 'text-danger' :
                                                    line.includes('[Rollback]') ? 'text-warning' : ''
                                        }>
                                            {line}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div className="log-empty">Waiting for command...</div>
                            )}
                        </div>
                        <footer className="log-footer">
                            <button onClick={() => setLogs('')}>Clear</button>
                        </footer>
                    </div>
                </div>
            </div>

            <style>{`
                .executor-grid {
                    display: grid;
                    grid-template-columns: 1fr 1.5fr;
                    gap: 2rem;
                }
                .section-title {
                    font-size: 1.5rem;
                    font-weight: 700;
                    margin-bottom: 0.25rem;
                    color: var(--text-primary);
                }
                .form-group {
                    margin-bottom: 1.25rem;
                }
                .input-label {
                    display: flex;
                    align-items: center;
                    font-size: 0.75rem;
                    font-weight: 600;
                    color: var(--text-muted);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    margin-bottom: 0.5rem;
                    gap: 6px;
                }
                .action-row {
                    display: flex;
                    gap: 1rem;
                    margin-top: 1.5rem;
                }
                .btn-primary { flex: 1; justify-content: center; }
                .rollback-btn {
                    color: var(--danger);
                    border-color: rgba(239, 68, 68, 0.2);
                    background: rgba(239, 68, 68, 0.05);
                }
                .rollback-btn:hover {
                    background: rgba(239, 68, 68, 0.1);
                    border-color: var(--danger);
                }
                
                /* Log Terminal */
                .log-card {
                    padding: 0;
                    overflow: hidden;
                    height: 100%;
                    max-height: 600px;
                    display: flex;
                    flex-direction: column;
                    background: #111; 
                    border-color: var(--border-color);
                }
                .log-header {
                    padding: 0.75rem 1.25rem;
                    border-bottom: 1px solid var(--border-color);
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    background: rgba(255,255,255,0.02);
                    font-size: 0.75rem;
                    font-weight: 600;
                    color: var(--text-muted);
                    text-transform: uppercase;
                }
                .log-content {
                    flex: 1;
                    padding: 1rem;
                    font-family: var(--font-mono);
                    font-size: 0.85rem;
                    color: var(--text-secondary);
                    overflow-y: auto;
                }
                .log-line {
                    display: flex;
                    gap: 1rem;
                    margin-bottom: 0.25rem;
                    line-height: 1.4;
                }
                .line-num {
                    color: var(--text-muted);
                    opacity: 0.3;
                    user-select: none;
                    min-width: 20px;
                    text-align: right;
                }
                .log-empty {
                    opacity: 0.3;
                    font-style: italic;
                    padding: 1rem;
                }
                .log-footer {
                    padding: 0.5rem 1rem;
                    border-top: 1px solid var(--border-color);
                    text-align: right;
                    background: rgba(255,255,255,0.02);
                }
                .log-footer button {
                    background: none;
                    border: none;
                    color: var(--text-muted);
                    font-size: 0.75rem;
                    cursor: pointer;
                }
                .log-footer button:hover {
                    color: var(--text-primary);
                }
                
                .text-success { color: var(--success); }
                .text-danger { color: var(--danger); }
                .text-warning { color: var(--warning); }
            `}</style>
        </div>
    );
};

export default ConfigExecutor;
