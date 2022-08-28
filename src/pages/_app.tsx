import type { AppProps } from "next/app";
import Head from "next/head";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Image Cropper</title>
        <meta name="viewport" content="width=device-width, user-scalable=no" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
