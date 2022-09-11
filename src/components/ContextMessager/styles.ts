import styled from 'styled-components';

export const Container = styled.div`
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 2rem;
`;

export const MessageWrapper = styled.div`
    width: 60%;

    @media(max-width: ${props => props.theme.breacks.medium}) {
        width: 95%;
    }

    @media(max-width: ${props => props.theme.breacks.large}) {
        width: 80%;
    }
`;