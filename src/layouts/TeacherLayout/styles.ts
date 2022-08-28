import styled from 'styled-components';

export const Container = styled.div`
    width: 100%;
    padding: 0;
    min-height: 100vh;
`;

export const Background = styled.div`
    width: 100%;
    height: 100vh;
    background-image: url('/images/abs_background1.jpg');
    background-size: cover;
`;

export const Content = styled.div`
    height: 100%;
    background-color: ${props => props.theme.colors.white};
    border: 2px solid ${props => props.theme.colors.gray_30};
    padding: 0;
    overflow: hidden;
    min-height: calc(100vh - 86px);
`;

export const MainCol = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
`;