import React from 'react';
import { Route, Routes } from 'react-router-dom';
import DefaultLayout from '../pages/DefaultLayout';

import Dashboard from '../pages/Dashboard';
import Students from '../pages/Students';
import Enrollments from '../pages/Students/Enrollments';
import Users from '../pages/Users';
import Subjects from '../pages/Subjects';
import Courses from '../pages/Courses';
import Packs from '../pages/Packs';
import Modules from '../pages/Packs/Modules';
import ModuleSubjects from '../pages/Packs/Modules/ModuleSubjects';
import Classes from '../pages/Classes';
import Assignments from '../pages/Users/Assignments';

const AppRoutes: React.FC = () => {
    return (
        <DefaultLayout>
            <Routes>
                <Route path='/' element={<Dashboard/>} />
                <Route path='users' element={<Users/>} />
                <Route path='users/:teacher_id/assignments' element={<Assignments/>} />
                <Route path='students' element={<Students/>} />
                <Route path='students/:student_id/enrollments' element={<Enrollments/>} />
                <Route path='subjects' element={<Subjects/>} />
                <Route path='courses' element={<Courses/>} />                
                <Route path='classes' element={<Classes/>} />
                <Route path='packs' element={<Packs/>} />
                <Route path='packs/:pack_id/modules' element={<Modules/>} />
                <Route path='packs/:pack_id/modules/:module_id/subjects' element={<ModuleSubjects/>} />
                <Route element={<Dashboard />} />
            </Routes>
        </DefaultLayout>
    );
}

export default AppRoutes;