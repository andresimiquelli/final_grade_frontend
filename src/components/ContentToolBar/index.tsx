import React from 'react';

import { Container } from './styles';

interface ContentToolBarProps {
    children: React.ReactNode
}

const ContentToolBar: React.FC<ContentToolBarProps> = ({ children }) => {
    return (
        <Container>
            { children }
        </Container>
    );
}

export default ContentToolBar;