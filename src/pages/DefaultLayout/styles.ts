import styled from 'styled-components';

export const Container = styled.main`
    background-color: ${props => props.theme.colors.white+'55'};
    backdrop-filter: blur(5px);

    > aside {
        width: 300px;
        height: 100%;
    }

    display: flex;
`;

export const Background = styled.div`
    width: 100%;
    height: 100vh;
    background-image: url('/images/abs_background1.jpg');
    background-size: cover;
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
    border: 2px solid ${props => props.theme.colors.gray_30};
    border-radius: 25px 0 0 0;
    padding: 0;
    overflow: hidden;
`;