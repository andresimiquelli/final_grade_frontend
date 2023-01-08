import React, { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import ContentHeader from "../../components/ContentHeader";
import SideMenu from "../../components/SideMenu";
import { useNav } from "../../context/nav";

import { Container, MainCol, Content, Background } from "./styles";

interface DefaultLayoutProps {
  children: React.ReactNode;
}

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {
  const { contentTitle, contentSubtitle, setContentTitle, setContentSubtitle } =
    useNav();

  const location = useLocation();

  useLayoutEffect(() => {
    setContentTitle("");
    setContentSubtitle(undefined);
  }, [location.pathname]);

  return (
    <Background>
      <Container>
        <aside>
          <SideMenu />
        </aside>
        <MainCol>
          <ContentHeader title={contentTitle} subtitle={contentSubtitle} />
          <Content>{children}</Content>
        </MainCol>
      </Container>
    </Background>
  );
};

export default DefaultLayout;
