import React from 'react';
import { Route, Routes } from 'react-router-dom';
import DefaultLayout from '../pages/DefaultLayout';

import Dashboard from '../pages/Dashboard';
import Students from '../pages/Students';

const AppRoutes: React.FC = () => {
    return (
        <DefaultLayout>
            <Routes>
                <Route path='/' element={<Dashboard/>} />
                <Route path='students' element={<Students/>} />
            </Routes>
        </DefaultLayout>
    );
}

export default AppRoutes;