import React from 'react';

import { Container } from './styles';

interface ContentToolBarFormProps {
    children?: React.ReactNode;
}

const ContentToolBarForm: React.FC<ContentToolBarFormProps> = ({ children }) => {
    return (
        <Container>
            { children }
        </Container>
    );
}

export default ContentToolBarForm;