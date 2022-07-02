import styled from 'styled-components';

interface ContainerProps {
    show?: boolean;
}

export const Container = styled.div<ContainerProps>`
    position: absolute;
    top: 0;
    left: 0;
    padding: 1rem;
    width: 100%;
    height: 100%;
    background-color: #FFFFFF80;
    display: flex;
    align-items: center;
    justify-content: center;
    display: ${props => props.show? 'visible' : 'none'};
`;