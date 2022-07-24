import React from 'react';
import ContentHeader from '../../components/ContentHeader';
import SideMenu from '../../components/SideMenu';
import { useNav } from '../../context/nav';

import { Container, MainCol, Content, Background } from './styles'

interface DefaultLayoutProps {
    children: React.ReactNode
}

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {

    const { contentTitle } = useNav()

    return (
        <Background>
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
        </Background>
    );
}

export default DefaultLayout;