import { createGlobalStyle } from "styled-components";
import { reset } from "styled-reset";

const GlobalStyle = createGlobalStyle`
  ${reset}

  @font-face {
    font-family: 'Cafe24Dangdanghae';
    src: url('/assets/font/Cafe24Dangdanghae-v2.0.otf') format('opentype');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Cafe24Oneprettynight';
    src: url('/assets/font/Cafe24Oneprettynight-v2.0.otf') format('opentype');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'NanumPen';
    src: url('/assets/font/NanumPen.otf') format('opentype');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }

  body {
    font-family: 'Cafe24Oneprettynight', sans-serif;
    font-size: 20px;
    line-height: 26px;
    letter-spacing: 0;
    box-sizing: border-box;
    text-decoration: none;
    color: ${({ theme }) => theme.PALETTE.text.black};
  }

  * {
    font-family: 'Cafe24Oneprettynight', sans-serif;
    box-sizing: border-box;
  }

  input::placeholder,
  textarea::placeholder {
    color: ${({ theme }) => theme.PALETTE.text.placeholder};
  }

  button {
    font-family: 'Cafe24Oneprettynight', sans-serif;
    cursor: pointer;
    border: none;
  }
`;

export default GlobalStyle;
