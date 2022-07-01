import React from 'react';

import { Container } from './styles';

interface ContentHeaderProps {
    title?: string;
    children?: React.ReactNode;
}

const ContentHeader: React.FC<ContentHeaderProps> = ( props ) => {
    return (
        <Container>
            <h4>{props.title}</h4>
        </Container>
    );
}

export default ContentHeader;