import styled from 'styled-components';

export const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;

    > button {
        padding: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        background-color: transparent;
        font-size: 1.3rem;
        color: ${props => props.theme.colors.gray_80};

        &:disabled {
            color: ${props => props.theme.colors.gray_30};
        }
    }
`;

export const PageNumber = styled.div`
    min-width: 35px;
    text-align: center;
    font-size: .9rem;
    font-weight: bold;
    color: ${props => props.theme.colors.gray_80}
`;