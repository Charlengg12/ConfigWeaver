import React, { useState } from 'react';
import { X, Zap, CheckCircle, Loader } from 'lucide-react';
import { apiClient } from '../../services/api';
import { useToast } from '../../App';
import LoadingSpinner from '../LoadingSpinner';

export default function QuickOnboard({ onClose, onSuccess }) {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        ip_address: '192.168.122.',
        username: 'admin',
        password: '',
        port: 8728,
        device_type: 'routeros'
    });
    const [deviceId, setDeviceId] = useState(null);
    const [setupResults, setSetupResults] = useState(null);
    const { addToast } = useToast();

    const handleAddDevice = async () => {
        setLoading(true);
        try {
            const res = await apiClient.post('/devices/', formData);
            setDeviceId(res.data.id);
            addToast(`Device "${formData.name}" added successfully`, 'success');
            setStep(2);
        } catch (error) {
            addToast(error.response?.data?.detail || 'Failed to add device', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleQuickSetup = async () => {
        setLoading(true);
        try {
            const res = await apiClient.post('/routeros/quick-setup', {
                device_id: deviceId,
                enable_snmp: true,
                secure_services: true,
                setup_ntp: true,
                basic_firewall: false
            });

            setSetupResults(res.data);
            addToast(res.data.message, res.data.success ? 'success' : 'warning');
            setStep(3);
        } catch (error) {
            addToast(error.response?.data?.detail || 'Quick setup failed', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDone = () => {
        if (onSuccess) onSuccess();
        onClose();
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }}>
            <div className="card" style={{
                maxWidth: '500px',
                width: '90%',
                maxHeight: '90vh',
                overflow: 'auto',
                position: 'relative'
            }}>
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--text-muted)'
                    }}
                >
                    <X size={20} />
                </button>

                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <Zap size={48} style={{ color: 'var(--accent)', marginBottom: '1rem' }} />
                    <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Quick Add GNS3 Device</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        {step === 1 && 'Enter device details'}
                        {step === 2 && 'Automatic configuration'}
                        {step === 3 && 'Setup complete!'}
                    </p>
                </div>

                {/* Progress Indicator */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
                    {[1, 2, 3].map(i => (
                        <div
                            key={i}
                            style={{
                                width: '40px',
                                height: '4px',
                                backgroundColor: i <= step ? 'var(--accent)' : 'var(--border)',
                                borderRadius: '2px',
                                transition: 'all 0.3s'
                            }}
                        />
                    ))}
                </div>

                {/* Step 1: Device Details */}
                {step === 1 && (
                    <div>
                        <div className="form-group">
                            <label className="input-label">Device Name</label>
                            <input
                                type="text"
                                className="input-field"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g., GNS3-Router-1"
                            />
                        </div>

                        <div className="form-group">
                            <label className="input-label">IP Address</label>
                            <input
                                type="text"
                                className="input-field"
                                value={formData.ip_address}
                                onChange={e => setFormData({ ...formData, ip_address: e.target.value })}
                                placeholder="192.168.122.10"
                            />
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                Default GNS3 range: 192.168.122.x
                            </span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="form-group">
                                <label className="input-label">Username</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={formData.username}
                                    onChange={e => setFormData({ ...formData, username: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label className="input-label">Password</label>
                                <input
                                    type="password"
                                    className="input-field"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="(blank for default)"
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleAddDevice}
                            disabled={loading || !formData.name || !formData.ip_address}
                            className="button-primary"
                            style={{ width: '100%', marginTop: '1rem' }}
                        >
                            {loading ? <LoadingSpinner /> : 'Next: Auto-Configure'}
                        </button>
                    </div>
                )}

                {/* Step 2: Auto Configuration */}
                {step === 2 && (
                    <div style={{ textAlign: 'center' }}>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Automatic Setup</h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                            One click to configure:
                        </p>

                        <div style={{ textAlign: 'left', marginBottom: '2rem' }}>
                            {[
                                '✅ Enable SNMP monitoring',
                                '✅ Disable telnet service',
                                '✅ Enable SSH service',
                                '✅ Configure NTP servers'
                            ].map((item, i) => (
                                <div key={i} style={{
                                    padding: '0.75rem',
                                    marginBottom: '0.5rem',
                                    backgroundColor: 'var(--card-bg)',
                                    borderRadius: '6px',
                                    border: '1px solid var(--border)'
                                }}>
                                    {item}
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={handleQuickSetup}
                            disabled={loading}
                            className="button-primary"
                            style={{ width: '100%' }}
                        >
                            {loading ? <LoadingSpinner /> : <><Zap size={16} /> Run Auto-Setup</>}
                        </button>
                    </div>
                )}

                {/* Step 3: Success */}
                {step === 3 && (
                    <div style={{ textAlign: 'center' }}>
                        <CheckCircle size={64} style={{ color: '#10b981', marginBottom: '1rem' }} />
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Setup Complete!</h3>

                        {setupResults && (
                            <div style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
                                {setupResults.steps_completed.map((step, i) => (
                                    <div key={i} style={{
                                        padding: '0.5rem',
                                        marginBottom: '0.25rem',
                                        fontSize: '0.85rem',
                                        color: 'var(--text-muted)'
                                    }}>
                                        {step}
                                    </div>
                                ))}
                                {setupResults.errors.length > 0 && (
                                    <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#fef2f2', borderRadius: '6px' }}>
                                        {setupResults.errors.map((err, i) => (
                                            <div key={i} style={{ fontSize: '0.8rem', color: '#ef4444' }}>
                                                ⚠️ {err}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                            Your device is now ready and being monitored!
                        </p>

                        <button
                            onClick={handleDone}
                            className="button-primary"
                            style={{ width: '100%' }}
                        >
                            Done
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
