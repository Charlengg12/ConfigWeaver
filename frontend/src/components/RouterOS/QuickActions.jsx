import React from 'react';
import { Zap, Shield, Clock, Flame } from 'lucide-react';

export default function QuickActions({ selectedDevice, onExecute, disabled }) {
    const quickActions = [
        {
            id: 'backup_now',
            name: 'Backup Now',
            icon: <Clock size={18} />,
            description: 'Create timestamped backup',
            template: 'system_backup',
            params: () => ({
                'Backup Name': `backup-${new Date().toISOString().split('T')[0]}-${Date.now()}`
            }),
            color: '#3b82f6'
        },
        {
            id: 'secure_device',
            name: 'Secure Device',
            icon: <Shield size={18} />,
            description: 'Disable telnet, enable SSH',
            multiStep: true,
            steps: [
                { template: 'service_toggle', params: { 'Service Name': 'telnet', 'State (enable/disable)': 'disable', 'Port': 23 } },
                { template: 'service_toggle', params: { 'Service Name': 'ssh', 'State (enable/disable)': 'enable', 'Port': 22 } }
            ],
            color: '#10b981'
        },
        {
            id: 'setup_ntp',
            name: 'Setup NTP',
            icon: <Clock size={18} />,
            description: 'Configure Google NTP servers',
            template: 'system_ntp_client',
            params: () => ({
                'Primary NTP Server': 'time.google.com',
                'Secondary NTP Server': 'time.cloudflare.com',
                'Enabled': 'yes'
            }),
            color: '#8b5cf6'
        },
        {
            id: 'basic_firewall',
            name: 'Basic Firewall',
            icon: <Flame size={18} />,
            description: 'Drop invalid, allow established',
            multiStep: true,
            steps: [
                {
                    template: 'firewall_filter_add',
                    params: {
                        'Chain': 'input',
                        'Protocol': 'tcp',
                        'Dst Port': '',
                        'Action': 'accept',
                        'Src Address': '',
                        'Comment': 'Accept established connections'
                    }
                },
                {
                    template: 'firewall_filter_add',
                    params: {
                        'Chain': 'input',
                        'Protocol': 'icmp',
                        'Dst Port': '',
                        'Action': 'accept',
                        'Src Address': '',
                        'Comment': 'Accept ICMP'
                    }
                },
                {
                    template: 'firewall_filter_add',
                    params: {
                        'Chain': 'input',
                        'Protocol': 'tcp',
                        'Dst Port': '',
                        'Action': 'drop',
                        'Src Address': '',
                        'Comment': 'Drop everything else'
                    }
                }
            ],
            color: '#ef4444'
        }
    ];

    const executeQuickAction = async (action) => {
        if (!selectedDevice) {
            return;
        }

        if (action.multiStep) {
            // Execute multiple templates in sequence
            for (const step of action.steps) {
                await onExecute(step.template, step.params);
            }
        } else {
            // Single template execution
            const params = typeof action.params === 'function' ? action.params() : action.params;
            await onExecute(action.template, params);
        }
    };

    return (
        <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{
                margin: '0 0 0.75rem 0',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: 'var(--text-muted)'
            }}>
                <Zap size={16} /> Quick Actions
            </h4>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '0.75rem'
            }}>
                {quickActions.map(action => (
                    <button
                        key={action.id}
                        onClick={() => executeQuickAction(action)}
                        disabled={disabled || !selectedDevice}
                        className="quick-action-card"
                        style={{
                            padding: '0.75rem',
                            border: '1px solid var(--border)',
                            borderRadius: '8px',
                            backgroundColor: 'var(--card-bg)',
                            cursor: disabled || !selectedDevice ? 'not-allowed' : 'pointer',
                            textAlign: 'left',
                            transition: 'all 0.2s',
                            opacity: disabled || !selectedDevice ? 0.5 : 1
                        }}
                        onMouseEnter={(e) => {
                            if (!disabled && selectedDevice) {
                                e.currentTarget.style.borderColor = action.color;
                                e.currentTarget.style.boxShadow = `0 0 0 1px ${action.color}`;
                            }
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'var(--border)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            marginBottom: '0.25rem'
                        }}>
                            <span style={{ color: action.color }}>{action.icon}</span>
                            <span style={{
                                fontSize: '0.85rem',
                                fontWeight: '600',
                                color: 'var(--text)'
                            }}>
                                {action.name}
                            </span>
                        </div>
                        <p style={{
                            fontSize: '0.75rem',
                            color: 'var(--text-muted)',
                            margin: 0
                        }}>
                            {action.description}
                        </p>
                    </button>
                ))}
            </div>
        </div>
    );
}
