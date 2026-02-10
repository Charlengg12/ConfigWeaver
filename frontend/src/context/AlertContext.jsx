import React, { createContext, useContext, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const AlertContext = createContext();

export const useAlert = () => {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error('useAlert must be used within AlertProvider');
    }
    return context;
};

export const AlertProvider = ({ children }) => {
    const [alerts, setAlerts] = useState([]);

    const showAlert = (message, severity = 'info') => {
        const id = Date.now();
        setAlerts(prev => [...prev, { id, message, severity }]);

        // Auto-dismiss after 4 seconds
        setTimeout(() => {
            setAlerts(prev => prev.filter(alert => alert.id !== id));
        }, 4000);
    };

    const closeAlert = (id) => {
        setAlerts(prev => prev.filter(alert => alert.id !== id));
    };

    return (
        <AlertContext.Provider value={{ showAlert }}>
            {children}
            {alerts.map((alert, index) => (
                <Snackbar
                    key={alert.id}
                    open={true}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    style={{ top: `${80 + index * 70}px` }}
                    onClose={() => closeAlert(alert.id)}
                >
                    <Alert
                        onClose={() => closeAlert(alert.id)}
                        severity={alert.severity}
                        variant="outlined"
                        sx={{
                            width: '100%',
                            bgcolor: 'background.paper',
                            boxShadow: 3
                        }}
                    >
                        {alert.message}
                    </Alert>
                </Snackbar>
            ))}
        </AlertContext.Provider>
    );
};
