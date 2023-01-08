import styled from "styled-components";

interface ContainerProps {
  variant?: "default" | "bordered";
}

export const Container = styled.div<ContainerProps>`
  width: 100%;
  padding: 1rem 2rem;

  display: flex;

  background-color: ${(props) =>
    props.variant === "bordered"
      ? props.theme.colors.white
      : props.theme.colors.gray_3};
  border-bottom: ${(props) =>
    props.variant === "bordered" ? "1px solid" : "none"};
  border-color: ${(props) => props.theme.colors.gray_10};

  > * {
    flex: 1;
    display: flex;

    &:first-child {
      justify-content: flex-start;
    }

    &:last-child {
      justify-content: flex-end;
    }

    justify-content: center;
  }
`;
