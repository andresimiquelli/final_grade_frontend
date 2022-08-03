import styled from 'styled-components';

export const Container = styled.div`
    border: 1px solid ${props => props.theme.colors.gray_40};
    border-radius: 26px;
    height: 52px;
    display: flex;
    align-items: center;
    padding: 0 4px 0 4px;
    background-color: ${props => props.theme.colors.white};
    position: relative;
    cursor: pointer;
`;

export const Avatar = styled.div`
    width: 42px;
    height: 42px;
    background-color: ${props => props.theme.colors.primary};
    border-radius: 21px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.3rem;
    font-weight: bold;
    color: ${props => props.theme.colors.white};
`;

export const Name = styled.div`
    margin-left: .5rem;
    max-width: 80px;
    font-size: .8rem;
    overflow: hidden;
    height: 1.1rem;
`;

export const Menu = styled.div`
    position: absolute;
    left: 8px;
    top: 56px;
    border: 1px solid ${props => props.theme.colors.gray_20};
    box-shadow: 1px 1px 5px ${props => props.theme.colors.gray_10};
    width: 140px;
    background-color: ${props => props.theme.colors.white};
    border-radius: 7px;
    overflow: hidden;

    > ul {
        list-style: none;
        padding: 0;
        font-size: .85rem;
        margin: 0;

        > li {
            padding: 4px 8px;
            border-bottom: 1px solid ${props => props.theme.colors.gray_20};
            :last-child {
                border-bottom: none;
            }

            :hover {
                background-color: ${props => props.theme.colors.gray_5};
            }
        }
    }

    z-index: 5;
`;