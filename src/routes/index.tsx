import React from 'react';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import AppRoutes from './AppRoutes';

const Routes: React.FC = () => {
    return (
        <HashRouter>
            <AppRoutes />
        </HashRouter>
    );
}

export default Routes;