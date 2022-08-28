import React from 'react';
import { Row } from 'react-bootstrap';

import { Container } from './styles';

interface ContentToolBarProps {
    children: React.ReactNode;
    variant?: 'default' | 'bordered';
}

const ContentToolBar: React.FC<ContentToolBarProps> = ({ children, variant }) => {
    return (
        <Row className='p-0'>
            <Container variant={variant}>
                { children }
            </Container>
        </Row>
    );
}

export default ContentToolBar;