import React from 'react';
import UserGadget from '../UserGadget';

import { Container, TitleColumn, UserColumn } from './styles';

interface ContentHeaderProps {
    title?: string;
    children?: React.ReactNode;
}

const ContentHeader: React.FC<ContentHeaderProps> = ( props ) => {
    return (
        <Container>
            <TitleColumn>
                <h4>{props.title}</h4>
            </TitleColumn>
            <UserColumn>
                <UserGadget />
            </UserColumn>
        </Container>
    );
}

export default ContentHeader;