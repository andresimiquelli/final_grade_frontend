import styled from 'styled-components';

export const Container = styled.div`
    padding: 1rem 0 1rem 0;
    background-color: ${props => props.theme.colors.gray_0};
    height: 100%;
    color: ${props => props.theme.colors.gray_90};
`;

export const Title = styled.h3`
    font-size: .9rem;
    padding: 0 1rem 0 1rem;
`;

export const Item = styled.div`
    font-size: 1rem;
    display: flex;
    padding: .3rem 1rem .3rem 1rem;
    border-right: 5px solid ${props => props.theme.colors.gray_0};
    cursor: pointer;

    div.icon {
        width: 2rem;
        height: 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
    }

    div.text {
        height: 2rem;
        flex: 1;
        display: flex;
        align-items: center;
        font-size: .9rem;
        padding-left: 7px;
    }

    :hover {
        background-color: ${props => props.theme.colors.gray_3};
        border-right: 4px solid ${props => props.theme.colors.secondary};
        color: ${props => props.theme.colors.secondary};
    }

    &.selected {
        background-color: ${props => props.theme.colors.gray_3};
        border-right: 4px solid ${props => props.theme.colors.primary};
        color: ${props => props.theme.colors.primary};
    }
`;