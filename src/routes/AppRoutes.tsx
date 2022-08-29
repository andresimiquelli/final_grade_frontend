import React from 'react';
import { Route, Routes } from 'react-router-dom';
import DefaultLayout from '../layouts/DefaultLayout';

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
import Journals from '../pages/Classes/Journals';
import Lessons from '../pages/Lessons';
import Evaluations from '../pages/Classes/Evaluations';
import FinalGrade from '../pages/Classes/FinalGrade';

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
                <Route path='journals/:class_id' element={<Journals/>} />
                <Route path='packs' element={<Packs/>} />
                <Route path='packs/:pack_id/modules' element={<Modules/>} />
                <Route path='packs/:pack_id/modules/:module_id/subjects' element={<ModuleSubjects/>} />
                <Route path='lessons/:class_id/:subject_id' element={<Lessons />} />
                <Route path='evaluations/:class_id/:subject_id' element={<Evaluations />} />
                <Route path='finalgrade/:class_id/:subject_id' element={<FinalGrade />} />
            </Routes>
        </DefaultLayout>
    );
}

export default AppRoutes;