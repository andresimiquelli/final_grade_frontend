import React from 'react';

import { Container } from './styles';

interface DefaultTableProps {
    children: React.ReactNode
}

const DefaultTable: React.FC<DefaultTableProps> = ( props ) => {
    return (
        <Container>
            { props.children }
        </Container>
    );
}

export default DefaultTable;