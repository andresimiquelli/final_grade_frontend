import React from 'react';

import { Container } from './styles';

interface ButtonColumnProps {
    children: React.ReactNode;
}

const ButtonColumn: React.FC<ButtonColumnProps> = ({ children }) => {
    return (
        <Container>
            { children }
        </Container>
    );
}

export default ButtonColumn;