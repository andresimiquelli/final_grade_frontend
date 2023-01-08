import styled from "styled-components";

export const Container = styled.div`
  padding: 1rem;
  display: flex;
  align-items: center;
`;

export const TitleColumn = styled.div`
  flex: 1;

  h5 {
    color: ${(props) => props.theme.colors.primary};
  }
`;

export const UserColumn = styled.div``;
