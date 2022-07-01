import React from 'react';
import ContentHeader from '../../components/ContentHeader';
import SideMenu from '../../components/SideMenu';
import { useNav } from '../../context/nav';

import { Container, MainCol, Content } from './styles'

interface DefaultLayoutProps {
    children: React.ReactNode
}

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {

    const { contentTitle } = useNav()

    return (
        <Container>
            <aside>
                <SideMenu />
            </aside>
            <MainCol>
                <ContentHeader title={contentTitle}/>
                <Content>
                    { children }
                </Content>
            </MainCol>
            
        </Container>
    );
}

export default DefaultLayout;