import styled from 'styled-components';

export const Container = styled.main`
    width: 100%;
    height: 100vh;

    > aside {
        width: 300px;
        height: 100%;
        background-color: blue;
    }

    display: flex;
`;

export const Content = styled.div`
    height: 100%;
`;