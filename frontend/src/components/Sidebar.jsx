import React from 'react';
import { LayoutDashboard, Server, Settings, Shield, Activity } from 'lucide-react';
import SidebarItem from './SidebarItem';
import './Sidebar.css';

const Sidebar = () => {
    return (
        <div className="sidebar">
            <div className="logo-container">
                <Server size={28} className="logo-icon" />
                <h1 className="app-title">ConfigWeaver</h1>
            </div>

            <nav className="nav-menu">
                <SidebarItem icon={LayoutDashboard} label="Overview" to="/" />
                <SidebarItem icon={Activity} label="Monitoring" to="/monitoring" />
                <SidebarItem icon={Shield} label="Security Policies" to="/security" />
                <SidebarItem icon={Settings} label="Devices" to="/devices" />
            </nav>

            <div className="sidebar-footer">
                <div className="user-info">
                    <div className="user-avatar">AD</div>
                    <div className="user-details">
                        <span className="username">Admin User</span>
                        <span className="role">Administrator</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
