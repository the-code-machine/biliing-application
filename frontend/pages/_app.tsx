import AppSidebar from "@/components/app-sidebar/app-sidebar";
import Navbar from "@/components/navbar/navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { QueryProvider } from "@/providers/query.provider";
import ToastProvider from "@/providers/toast.provider";
import type { AppProps } from "next/app";
import Head from "next/head";
import "../styles/globals.css";
export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Application</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
        <meta property="og:url" content="https://mantine.dev" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://mantine.dev/favicon.png" />
      </Head>
      <QueryProvider>
      <SidebarProvider>
        <AppSidebar />
        <main
          className="ml-60"
        >
          <ToastProvider />
          <Navbar />
          <Component {...pageProps} />
        </main>
      </SidebarProvider>
      </QueryProvider>
    </>
  );
}
