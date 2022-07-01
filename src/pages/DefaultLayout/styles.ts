import styled from 'styled-components';

export const Container = styled.main`
    width: 100%;
    height: 100vh;
    background-color: ${props => props.theme.colors.gray_3};

    > aside {
        width: 300px;
        height: 100%;
    }

    display: flex;
`;

export const MainCol = styled.div`
    display: flex;
    flex-direction: column;
    height: 100vh;
    flex: 1;
`;

export const Content = styled.div`
    height: 100%;
   background-color: ${props => props.theme.colors.white};
    border-radius: 25px 0 0 0;
    padding: 0;
    overflow: hidden;
`;