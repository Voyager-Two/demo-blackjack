import React from "react";
import NextHead from "next/head";

export const Head = () => {
  return (
    <NextHead>
      <title>Blackjack Demo</title>

      <meta name="description" content="Blackjack Demo" />

      <meta
        key="viewport"
        content="viewport-fit=cover, width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
        name="viewport"
      />

      <meta name="Content-Type" content="text/html; charset=UTF-8" />

    </NextHead>
  );
}
