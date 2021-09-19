import { createGlobalStyle, ThemeProvider } from 'styled-components';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import Head from 'next/head';
import theme from 'styles/theme';
import '@fontsource/roboto';

export default function App({Component, pageProps}) {
  return (
    <>
      <Head>
        <title>Next App</title>
        <meta content="minimum-scale=1, initial-scale=1, width=device-width" name="viewport"/>
      </Head>
      <MuiThemeProvider theme={theme}>
        <ThemeProvider theme={theme}>
          <CssBaseline/>
          <Component {...pageProps} />
        </ThemeProvider>
      </MuiThemeProvider>
    </>
  );
}
