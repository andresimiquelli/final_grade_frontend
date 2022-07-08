import styled from 'styled-components';

export const Container = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: flex-end;

    > div.divisor {
        flex: 1;
        display: flex;
        align-items: center;
    }

    > div.align-end {
        justify-content: flex-end;
    }

    > div.align-center {
        justify-content: center;
    }

    > button {
        background-color: transparent;
        min-width: 52px;
        height: 52px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: ${props => props.theme.colors.primary};
        font-size: .95rem;
        font-weight: 600;
        border: 0;
        border-radius: 26px;
    }

    > button.secondary {
        color: ${props => props.theme.colors.gray_80};
    }

    > button:hover {
        background-color: ${props => props.theme.colors.white};
    }

    > button.ml-1 {
        margin-left: 1rem;
    }

    > button.mr-1 {
        margin-right: 1rem;
    }
`;