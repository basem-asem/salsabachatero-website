import Head from "next/head";
import React from "react";

const Title = ({ name }) => {
  return (
    <div>
      <Head>
        <title>{name}</title>
      </Head>
    </div>
  );
};

export default Title;
