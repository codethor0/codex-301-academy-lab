import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import Navbar from "@/components/Navbar";

const siteName = "CodeThor AGENTS.md Lab";
const siteDescription =
  "An independent educational project with guides and examples for the AGENTS.md format for coding agents.";

export default function App({ Component, pageProps }: AppProps) {
  return <>
    <Head>
      <title>{siteName}</title>
      <meta name="description" content={siteDescription} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={siteName} />
      <meta name="twitter:description" content={siteDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={siteName} />
      <meta property="og:description" content={siteDescription} />
    </Head>
    <Navbar />
    <Component {...pageProps} />
  </>;
}
