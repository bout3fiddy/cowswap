import { AppProps } from 'next/app'
import GlobalStyles from 'styles/global.styles'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { CONFIG } from '@/const/meta'
import { Analytics } from '@/components/Analytics'
import { ApolloProvider } from '@apollo/client'
import { apolloClient } from 'services/uniswap-price/apollo-client'
import { useInitializeUtm } from 'modules/utm'
import { WithLDProvider } from '@/components/WithLDProvider'
import Script from 'next/script'

export default function App(props: AppProps) {
  const { Component, pageProps } = props
  useInitializeUtm()

  const router = useRouter()
  const CURRENT_URL = `${CONFIG.url.root}${router.asPath}`

  return (
    <>
      <Head>
        {/* Prevent indexing of development and preview environments */}
        {(process.env.NEXT_PUBLIC_ENVIRONMENT === 'DEVELOPMENT' ||
          process.env.NEXT_PUBLIC_ENVIRONMENT === 'PREVIEW') && <meta name="robots" content="noindex" key="robots" />}

        <meta name="description" content={CONFIG.description} key="description" />
        <link rel="canonical" href={CURRENT_URL} key="canonical" />

        {/* Favicons */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" href="/favicon-light-mode.png" media="(prefers-color-scheme: light)" />
        <link rel="icon" type="image/png" href="/favicon-dark-mode.png" media="(prefers-color-scheme: dark)" />
        <link rel="icon" type="image/png" href="/favicon-dark-mode.png" media="(prefers-color-scheme: no-preference)" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#000000" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="theme-color" content="#ffffff" />

        <meta key="ogType" property="og:type" content="website" />
        <meta key="ogTitle" property="og:title" content={CONFIG.title} />
        <meta key="ogDescription" property="og:description" content={CONFIG.description} />
        <meta key="ogImage" property="og:image" content={CONFIG.url.root + '/images/og-meta-cowprotocol.png'} />
        <meta key="ogUrl" property="og:url" content={CURRENT_URL} />
        <meta key="twitterCard" name="twitter:card" content="summary_large_image" />
        <meta key="twitterSite" name="twitter:site" content={CONFIG.social.twitter.account} />
        <meta key="twitterTitle" name="twitter:title" content={CONFIG.title} />
        <meta key="twitterImage" name="twitter:image" content={CONFIG.url.root + '/images/og-meta-cowprotocol.png'} />
        <meta key="viewport" name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1" />
      </Head>

      <GlobalStyles />
      <Analytics />
      <ApolloProvider client={apolloClient}>
        <WithLDProvider>
          <Component {...pageProps} />
        </WithLDProvider>
      </ApolloProvider>

      <Script id="clarity-script" strategy="afterInteractive">
        {`
    (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "mqse7dmywa");
  `}
      </Script>
    </>
  )
}
