import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;

  position: relative;

  > div.fixedTop {
    min-height: 25px;
  }

  > div.content {
    flex: 1;
    overflow-y: overlay;
    overflow-x: hidden;

    ::-webkit-scrollbar {
      background-color: transparent;
      width: 12px;
    }

    ::-webkit-scrollbar-thumb {
      background-color: ${(props) => props.theme.colors.gray_50};
      border-radius: 6px;
    }
  }
`;
