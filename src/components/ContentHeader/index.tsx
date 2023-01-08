import React from "react";
import UserGadget from "../UserGadget";

import { Container, TitleColumn, UserColumn } from "./styles";

interface ContentHeaderProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
}

const ContentHeader: React.FC<ContentHeaderProps> = (props) => {
  return (
    <Container>
      <TitleColumn>
        <h4>{props.title}</h4>
        {props.title && <h5>{props.subtitle}</h5>}
      </TitleColumn>
      <UserColumn>
        <UserGadget />
      </UserColumn>
    </Container>
  );
};

export default ContentHeader;
