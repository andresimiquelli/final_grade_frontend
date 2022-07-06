import React from 'react';

import { Container } from './styles';

interface DefaultTableProps {
    children: React.ReactNode;
    selectionMode?: boolean;
}

const DefaultTable: React.FC<DefaultTableProps> = ( props ) => {
    return (
        <Container selectionMode={props.selectionMode}>
            { props.children }
        </Container>
    );
}

export default DefaultTable;