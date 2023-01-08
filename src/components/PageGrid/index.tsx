import React from "react";

import { Container } from "./styles";

interface PageGridProps {
  children: React.ReactNode;
}

const PageGrid: React.FC<PageGridProps> = ({ children }) => {
  return <Container>{children}</Container>;
};

export default PageGrid;
