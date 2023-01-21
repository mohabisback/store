import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
body {
  background-color: ${({ theme }) => theme.colors.bodyBG};
  color: ${({ theme }) => theme.colors.bodyFG};
  font-family: monospace;
  overflow-x: hidden;
}
`;
