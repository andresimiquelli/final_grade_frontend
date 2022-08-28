import React from 'react';
import ContentHeader from '../../components/ContentHeader';
import { useNav } from '../../context/nav';

import { Container, Content, Background } from './styles';

interface TeacherLayoutProps {
    children: React.ReactNode;
}

const TeacherLayout: React.FC<TeacherLayoutProps> = ({ children }) => {
    
    const {contentTitle} = useNav()

    return (
        <Background>
            <Container>
                <ContentHeader title={contentTitle}/>
                <Content>
                    { children }
                </Content>                
            </Container>
        </Background>
    );
}

export default TeacherLayout;