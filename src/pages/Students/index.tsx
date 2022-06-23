import React, { useEffect } from 'react';
import { useNav, MenuKeys } from '../../context/nav';

const Students: React.FC = () => {

    const { setSelectedMenu } = useNav()

    useEffect(() => {
        setSelectedMenu(MenuKeys.STUDENTS)
    },[])

    return (
        <h2>Students</h2>
    );
}

export default Students;