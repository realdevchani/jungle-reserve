import styled from "styled-components";

const tagMap = {
  title: "h1",
  modalTitle: "h2",
  modalText: "p",
  dashboard: "p",
  explain: "span",
};

const Typography = styled.span.attrs(({ type }) => ({
  as: tagMap[type] || "span",
}))`
  font-family: ${({ theme, type }) => theme.FONT[type]?.family};
  font-size: ${({ theme, type }) => theme.FONT[type]?.size};
  line-height: ${({ theme, type }) => theme.FONT[type]?.lineHeight};
  letter-spacing: ${({ theme, type }) => theme.FONT[type]?.letterSpacing};
`;

export default Typography;
