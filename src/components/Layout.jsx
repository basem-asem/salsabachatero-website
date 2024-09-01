import Head from "next/head";

const Layout = ({ children }) => {
  return (
    <>
      <Head>
        <link rel="icon" href="/images/favicon.png" />
        {/* Add other meta tags, stylesheets, etc. here if needed */}
      </Head>
      {/* Your layout content */}
      {children}
    </>
  );
};

export default Layout;
