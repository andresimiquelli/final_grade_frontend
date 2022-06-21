import React from 'react';

import { Container, Content } from './styles'

interface DefaultLayoutProps {
    children: React.ReactNode
}

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {
    return (
        <Container>
            <aside>
                Aside
            </aside>
            <Content>
                { children }
            </Content>
        </Container>
    );
}

export default DefaultLayout;