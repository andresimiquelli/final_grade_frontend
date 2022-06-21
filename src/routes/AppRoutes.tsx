import React from 'react';
import { Route, Routes } from 'react-router-dom';
import DefaultLayout from '../pages/DefaultLayout';

import Dashboard from '../pages/Dashboard';

const AppRoutes: React.FC = () => {
    return (
        <DefaultLayout>
            <Routes>
                <Route path='/' element={<Dashboard/>} />
            </Routes>
        </DefaultLayout>
    );
}

export default AppRoutes;