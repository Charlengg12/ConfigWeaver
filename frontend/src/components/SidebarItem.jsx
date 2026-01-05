import React from 'react';
import { NavLink } from 'react-router-dom';
import './SidebarItem.css';

const SidebarItem = ({ icon: Icon, label, to }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            `sidebar-item ${isActive ? 'active' : ''}`
        }
    >
        <Icon size={20} />
        <span className="label">{label}</span>
    </NavLink>
);

export default SidebarItem;
