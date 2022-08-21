import React from 'react';
import { Row } from 'react-bootstrap';

import { Container } from './styles';

interface ContentToolBarProps {
    children: React.ReactNode
}

const ContentToolBar: React.FC<ContentToolBarProps> = ({ children }) => {
    return (
        <Row className='p-0'>
            <Container>
                { children }
            </Container>
        </Row>
    );
}

export default ContentToolBar;