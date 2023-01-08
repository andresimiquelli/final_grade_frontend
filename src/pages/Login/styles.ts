import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: url("images/abs_background1.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  overflow: hidden;
`;

export const BoxLogin = styled.div`
  position: relative;
  max-width: 550px;
  min-width: 450px;
  background-color: ${(props) => props.theme.colors.white + "88"};
  backdrop-filter: blur(5px);
  border-radius: 14px;
  border: 1px solid ${(props) => props.theme.colors.gray_5};

  small {
    padding: 5px;
    font-size: 0.7rem;
  }
`;

export const Logo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  > img {
    width: 50%;
  }

  padding: 2rem 1rem 1rem 1rem;
`;
