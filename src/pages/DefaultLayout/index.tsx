import React from 'react';
import SideMenu from '../../components/SideMenu';

import { Container, Content } from './styles'

interface DefaultLayoutProps {
    children: React.ReactNode
}

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {
    return (
        <Container>
            <aside>
                <SideMenu />
            </aside>
            <Content>
                { children }
            </Content>
        </Container>
    );
}

export default DefaultLayout;