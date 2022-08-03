import React, { useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { useNav } from '../../context/nav';

import { Card } from './styles';

const MyClasses: React.FC = () => {

    const { setSelectedMenu, setContentTitle } = useNav()

    useEffect(() => {
        setContentTitle('Minhas turmas')
    },[])

    return (
        <Container>
            
        </Container>
    );
}

export default MyClasses;