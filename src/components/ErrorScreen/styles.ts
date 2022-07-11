import styled from 'styled-components';

interface ContainerProps {
    show?: boolean;
}

export const Container = styled.div<ContainerProps>`
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-color: ${props => props.theme.colors.white};
    display: ${props => props.show? 'flex' : 'none'};
    align-items: center;
    justify-content: center;
    flex-direction: column;

    > p {
        padding: 0rem 2rem 0rem 2rem;
        font-size: .95rem;
        text-align: center;
    }
`;

export const Icon = styled.div` 
    font-size: 2rem;
    color: ${props => props.theme.colors.error_primary};
`;

export const ButtonClose = styled.button `
    padding: .5rem 1rem .5rem 1rem;
    border: 0;
    height: 42px;
    border-radius: 21px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${props => props.theme.colors.white};
    background-color: ${props => props.theme.colors.error_primary};

    &:active {
        background-color: ${props => props.theme.colors.error_secondary};
    }
`