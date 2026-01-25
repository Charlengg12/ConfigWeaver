import React, { useState } from 'react';
import ConfigHistory from '../../components/RouterOS/ConfigHistory';
import ConfigExecutor from '../../components/RouterOS/ConfigExecutor';
import './RouterOS.css';

const RouterOSPage = () => {
    const [activeTab, setActiveTab] = useState('configuration');

    return (
        <div className="page-container">
            <header className="page-header">
                <div>
                    <h1 className="page-title">RouterOS Configurations</h1>
                    <p className="page-subtitle">Execute and manage network configurations</p>
                </div>
            </header>

            {/* Tab Navigation */}
            <div className="tabs-container">
                <div className="tabs-header">
                    <button
                        className={`tab-btn ${activeTab === 'configuration' ? 'active' : ''}`}
                        onClick={() => setActiveTab('configuration')}
                    >
                        Execute Config
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
                        onClick={() => setActiveTab('history')}
                    >
                        Config History
                    </button>
                </div>

                <div className="tab-content">
                    {activeTab === 'configuration' && (
                        <div className="fade-in">
                            <ConfigExecutor />
                        </div>
                    )}

                    {activeTab === 'history' && (
                        <div className="fade-in">
                            <ConfigHistory />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RouterOSPage;

