"use client"

import Head from "next/head"

export default function MetadataHead() {
  const title = "P2P Wallet - Private Communication"
  const description = "Decentralized encrypted messaging, calls, and crypto payments"
  const url = typeof window !== "undefined" ? window.location.href : "https://p2p-wallet.app"
  const image = "/og-image.png"

  return (
    <Head>
      <meta name="description" content={description} />
      <meta name="theme-color" content="#07C160" />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      {/* Additional */}
      <link rel="canonical" href={url} />
    </Head>
  )
}
