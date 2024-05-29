import Head from 'next/head'
import { GetStaticProps } from 'next'
import { Font, Color, Media, ProductLogo, ProductVariant } from '@cowprotocol/ui'
import IMG_ICON_CROWN_COW from '@cowprotocol/assets/images/icon-crown-cow.svg'
import IMG_ICON_GOVERNANCE from '@cowprotocol/assets/images/icon-governance.svg'
import IMG_ICON_BULB_COW from '@cowprotocol/assets/images/icon-bulb-cow.svg'
import IMG_ICON_BUILD_WITH_COW from '@cowprotocol/assets/images/icon-build-with-cow.svg'
import IMG_ICON_SECURE from '@cowprotocol/assets/images/icon-secure.svg'
import IMG_ICON_OWL from '@cowprotocol/assets/images/icon-owl.svg'
import IMG_ICON_GHOST from '@cowprotocol/assets/images/icon-ghost.svg'
import IMG_LOGO_SAFE from '@cowprotocol/assets/images/logo-safe.svg'
import IMG_LOGO_OASIS from '@cowprotocol/assets/images/logo-oasis.svg'

import styled from 'styled-components'

import { CONFIG } from '@/const/meta'

import LayoutV2 from '@/components/Layout/LayoutV2'
import FAQ from '@/components/FAQ'
import { getCategories, getArticles, Category, ArticleListResponse } from 'services/cms'

import {
  ContainerCard,
  ContainerCardSection,
  TopicList,
  TopicCard,
  TopicImage,
  TopicTitle,
  TopicDescription,
  TopicButton,
  SectionTitleWrapper,
  SectionTitleIcon,
  SectionTitleText,
  SectionTitleDescription,
  SectionImage,
  TopicCardInner,
  HeroContainer,
  HeroImage,
  HeroButton,
  HeroDescription,
  HeroContent,
  HeroTitle,
  HeroSubtitle,
  MetricsCard,
  MetricsItem,
  TrustedBy,
  SwiperSlideWrapper,
} from '@/styles/styled'

import { DAO_CONTENT as CONTENT } from '@/data/siteContent/daos'

import SVG from 'react-inlinesvg'
import IMG_ICON_FAQ from '@cowprotocol/assets/images/icon-faq.svg'

import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation } from 'swiper/modules'

const DATA_CACHE_TIME_SECONDS = 5 * 60 // Cache 5min

const FAQ_DATA = [
  {
    question: 'What is CoW DAO?',
    answer: 'CoW DAO is ...',
  },
  {
    question: 'What is CoW Swap?',
    answer:
      'CoW Protocol is a fully permissionless trading protocol that leverages batch auctions as its price finding mechanism. CoW Protocol uses batch auctions to maximize liquidity via Coincidence of Wants (CoWs) in addition to tapping all available on-chain liquidity whenever needed.',
  },
  {
    question: 'What is MEV Blocker?',
    answer: 'MEV Blocker is ...',
  },
  {
    question: 'What is CoW AMM?',
    answer: 'CoW AMM is ...',
  },
  {
    question: 'Where does the name come from?',
    answer: 'The name comes from ...',
  },
]

interface PageProps {
  siteConfigData: typeof CONFIG
  categories: {
    name: string
    slug: string
    description: string
    bgColor: string
    textColor: string
    link: string
    iconColor: string
  }[]
  articles: ArticleListResponse['data']
}

const Wrapper = styled.div`
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  align-items: center;
  max-width: 1600px;
  width: 100%;
  margin: 76px auto 0;
  gap: 24px;
`

export default function Page({ siteConfigData }: PageProps) {
  return (
    <LayoutV2 bgColor={Color.neutral90}>
      <Head>
        <title>
          {siteConfigData.title} - {siteConfigData.descriptionShort}
        </title>
      </Head>

      <Wrapper>
        <HeroContainer variant="secondary" maxWidth={1300}>
          <HeroContent variant="secondary">
            <HeroSubtitle color={'#66018E'}>DAOs</HeroSubtitle>
            <HeroTitle fontSize={67} fontSizeMobile={38} as="h2">
              Savvy DAOs Choose CoW Swap
            </HeroTitle>
            <HeroDescription>The smartest DAOs trust CoW Swap with their most-important trades</HeroDescription>
          </HeroContent>
          <HeroImage width={470} height={400} color={'#66018E'}>
            <SVG src={IMG_ICON_BULB_COW} />
          </HeroImage>
        </HeroContainer>

        <MetricsCard bgColor="#F996EE" color="#66018E" columns={1} touchFooter>
          <TrustedBy>
            <p>Trusted by</p>
            <ul>
              {CONTENT.trustedDAOs.map(
                ({ icon, title, volume }, index) =>
                  volume && (
                    <li key={index}>
                      <SVG src={icon} title={title} />
                      <small>with</small>
                      <strong>{volume}</strong>
                    </li>
                  )
              )}
            </ul>
          </TrustedBy>
        </MetricsCard>

        <ContainerCard bgColor={Color.neutral10}>
          <ContainerCardSection>
            <SectionTitleWrapper color={Color.neutral100} maxWidth={1100} gap={56}>
              <SectionTitleIcon size={98}>
                <SVG src={IMG_ICON_CROWN_COW} />
              </SectionTitleIcon>
              <SectionTitleText fontSize={64}>Expert trading for expert DAOs</SectionTitleText>
              <SectionTitleDescription maxWidth={900}>
                CoW Swap is the only DEX built to solve the unique challenges faced by DAOs
              </SectionTitleDescription>
            </SectionTitleWrapper>

            <SwiperSlideWrapper>
              <Swiper
                slidesPerView={'auto'}
                centeredSlides={true}
                grabCursor={true}
                loop={true}
                keyboard={{
                  enabled: true,
                }}
                pagination={{
                  dynamicBullets: true,
                  clickable: true,
                }}
                autoplay={{
                  delay: 5000,
                  disableOnInteraction: true,
                }}
                navigation={{
                  nextEl: '.swiper-button-next',
                  prevEl: '.swiper-button-prev',
                }}
                spaceBetween={50}
                modules={[Autoplay, Pagination, Navigation]}
                className="daoSwiper"
              >
                {CONTENT.slides.map((slide, index) => (
                  <SwiperSlide key={index}>
                    <img src={slide.image} alt={slide.title} />
                    <span>
                      <h4>{slide.title}</h4>
                      <p>{slide.description}</p>
                    </span>
                  </SwiperSlide>
                ))}
              </Swiper>

              <div className="swiper-button-prev"></div>
              <div className="swiper-button-next"></div>
            </SwiperSlideWrapper>
          </ContainerCardSection>
        </ContainerCard>

        <ContainerCard bgColor={'transparent'} color={Color.neutral10}>
          <ContainerCardSection>
            <SectionTitleWrapper padding="150px 0 0" maxWidth={800}>
              <SectionTitleIcon size={60}>
                <ProductLogo variant={ProductVariant.CowProtocol} theme="dark" logoIconOnly />
              </SectionTitleIcon>
              <SectionTitleText fontSize={62}>Advanced order types</SectionTitleText>
              <SectionTitleDescription fontSize={24} color={Color.neutral40}>
                CoW Swap's many order types help you get better prices for your trades, manage token launches,
                facilitate buybacks, and much more
              </SectionTitleDescription>
            </SectionTitleWrapper>

            <TopicList columns={3}>
              <TopicCard contentAlign={'left'} bgColor={Color.neutral100} padding={'32px'} gap={16} asProp="div">
                <TopicImage bgColor="transparent" height={75} width={'auto'}>
                  <SVG src="images/icon-milkman.svg" />
                </TopicImage>
                <TopicCardInner contentAlign="left">
                  <TopicTitle>Milkman Orders</TopicTitle>
                  <TopicDescription fontSize={18} color={Color.neutral40} margin="0">
                    Ensure your trades are always close to the real-time market price thanks to the{' '}
                    <a href="https://github.com/charlesndalton/milkman" target="_blank" rel="noopener noreferrer">
                      Milkman bot
                    </a>
                    . Set the maximum deviation you&apos;ll accept, and Milkman will do the rest.
                  </TopicDescription>
                </TopicCardInner>
              </TopicCard>

              <TopicCard contentAlign={'left'} bgColor={Color.neutral100} padding={'32px'} gap={16} asProp="div">
                <TopicImage bgColor="transparent" height={75} width={'auto'}>
                  <SVG src="images/icon-twap-orders.svg" />
                </TopicImage>
                <TopicCardInner contentAlign="left">
                  <TopicTitle>TWAP Orders</TopicTitle>
                  <TopicDescription fontSize={18} color={Color.neutral40} margin="0">
                    Time-weighted average price orders allow you to spread your trade out over time, averaging out your
                    trading price, minimizing price impact, and allowing for lower slippage.
                  </TopicDescription>
                </TopicCardInner>
              </TopicCard>

              <TopicCard contentAlign={'left'} bgColor={Color.neutral100} padding={'32px'} gap={16} asProp="div">
                <TopicImage bgColor="transparent" height={75} width={'auto'}>
                  <SVG src="images/icon-limit-orders.svg" />
                </TopicImage>
                <TopicCardInner contentAlign="left">
                  <TopicTitle>Limit Orders</TopicTitle>
                  <TopicDescription fontSize={18} color={Color.neutral40} margin="0">
                    CoW Swap's surplus-capturing limit orders allow you to set a price and sit back while your order
                    gets filled over time - perfect for token buybacks and other large trades.
                  </TopicDescription>
                </TopicCardInner>
              </TopicCard>

              <TopicCard contentAlign={'left'} bgColor={Color.neutral100} padding={'32px'} gap={16} asProp="div">
                <TopicImage bgColor="transparent" height={75} width={'auto'}>
                  <SVG src="images/icon-price-walls.svg" />
                </TopicImage>
                <TopicCardInner contentAlign="left">
                  <TopicTitle>Price Walls</TopicTitle>
                  <TopicDescription fontSize={18} color={Color.neutral40} margin="0">
                    Pick an asset, define a threshold price, and CoW Swap will automatically sell above the threshold,
                    and buy below it.
                  </TopicDescription>
                </TopicCardInner>
              </TopicCard>

              <TopicCard contentAlign={'left'} bgColor={Color.neutral100} padding={'32px'} gap={16} asProp="div">
                <TopicImage bgColor="transparent" height={75} width={'auto'}>
                  <SVG src="images/icon-basket-sells.svg" />
                </TopicImage>
                <TopicCardInner contentAlign="left">
                  <TopicTitle>Basket Sells</TopicTitle>
                  <TopicDescription fontSize={18} color={Color.neutral40} margin="0">
                    <a href="https://dump.services/" target="_blank" rel="noopener noreferrer">
                      Dump.services
                    </a>
                    , a collaboration between CoW Swap and Yearn, allows DAOs and traders to sell multiple tokens in a
                    single transaction.
                  </TopicDescription>
                </TopicCardInner>
              </TopicCard>

              <TopicCard contentAlign={'left'} bgColor={Color.neutral100} padding={'32px'} gap={16} asProp="div">
                <TopicImage bgColor="transparent" height={75} width={'auto'}>
                  <SVG src="images/icon-logic.svg" />
                </TopicImage>
                <TopicCardInner contentAlign="left">
                  <TopicTitle>Place Your Logic Here</TopicTitle>
                  <TopicDescription fontSize={18} color={Color.neutral40} margin="0">
                    ERC-1271 Smart Orders and CoW Hooks allow you to define your own complex trading logic; if you can
                    think it, you can trade it.
                  </TopicDescription>
                </TopicCardInner>
              </TopicCard>
            </TopicList>
          </ContainerCardSection>
        </ContainerCard>

        <ContainerCard bgColor={'transparent'}>
          <ContainerCardSection>
            <SectionTitleWrapper padding="150px 0 0" maxWidth={878} color={Color.neutral10}>
              <SectionTitleIcon size={128}>
                <SVG src={IMG_ICON_BULB_COW} />
              </SectionTitleIcon>
              <SectionTitleText fontSize={90} textAlign="center">
                Powering innovation across DeFi
              </SectionTitleText>
            </SectionTitleWrapper>

            <TopicList columns={3}>
              <TopicCard contentAlign={'left'} bgColor="#66018E" textColor="#F996EE" padding={'32px'} asProp="div">
                <TopicImage iconColor="#8702AA" bgColor="transparent" height={96} width={'auto'}>
                  <ProductLogo variant={ProductVariant.CowDao} logoIconOnly theme="dark" />
                </TopicImage>
                <TopicCardInner contentAlign="left">
                  <TopicTitle color={Color.neutral100} fontSize={38}>
                    Liquidations
                  </TopicTitle>
                  <TopicDescription fontSize={21} color="#F996EE">
                    Info about liquidations goes here. Info about liquidations goes here. Info about liquidations goes
                    here.
                  </TopicDescription>
                </TopicCardInner>
              </TopicCard>

              <TopicCard contentAlign={'left'} bgColor="#66018E" textColor="#F996EE" padding={'32px'} asProp="div">
                <TopicImage iconColor="#8702AA" bgColor="transparent" height={96} width={'auto'}>
                  <ProductLogo variant={ProductVariant.CowDao} logoIconOnly theme="dark" />
                </TopicImage>
                <TopicCardInner contentAlign="left">
                  <TopicTitle color={Color.neutral100} fontSize={38}>
                    Solver infrastructure
                  </TopicTitle>
                  <TopicDescription fontSize={21} color="#F996EE">
                    CoW Protocol maintains the most robust network of solvers in DeFi, with more being added every day.
                  </TopicDescription>
                </TopicCardInner>
              </TopicCard>

              <TopicCard contentAlign={'left'} bgColor="#66018E" textColor="#F996EE" padding={'32px'} asProp="div">
                <TopicImage iconColor="#8702AA" bgColor="transparent" height={96} width={'auto'}>
                  <ProductLogo variant={ProductVariant.CowDao} logoIconOnly theme="dark" />
                </TopicImage>
                <TopicCardInner contentAlign="left">
                  <TopicTitle color={Color.neutral100} fontSize={38}>
                    Rebalancing portfolios
                  </TopicTitle>
                  <TopicDescription fontSize={21} color="#F996EE">
                    Info about rebalancing portfolios goes here. Info about rebalancing portfolios goes here.
                  </TopicDescription>
                </TopicCardInner>
              </TopicCard>
            </TopicList>
          </ContainerCardSection>
        </ContainerCard>

        <ContainerCard bgColor={Color.neutral10} color={Color.neutral98}>
          <ContainerCardSection>
            <SectionTitleWrapper padding="150px 0 0">
              <SectionTitleIcon multiple>
                <SVG src={IMG_ICON_OWL} />
                <ProductLogo variant={ProductVariant.CowProtocol} theme="dark" logoIconOnly height={60} />
                <SVG src={IMG_ICON_GHOST} />
              </SectionTitleIcon>
              <SectionTitleText fontSize={90}>Trusted by the best</SectionTitleText>
            </SectionTitleWrapper>

            <TopicList columns={3}>
              <TopicCard contentAlign={'center'} bgColor={Color.neutral98} padding={'42px'} href="/">
                <TopicImage
                  iconColor={Color.neutral20}
                  bgColor={'transparent'}
                  width={'100%'}
                  height={54}
                  margin={'auto'}
                >
                  <SVG src={IMG_LOGO_SAFE} />
                </TopicImage>
              </TopicCard>

              <TopicCard contentAlign={'center'} bgColor={Color.neutral98} padding={'42px'} href="/">
                <TopicImage
                  iconColor={Color.neutral20}
                  bgColor={'transparent'}
                  width={'100%'}
                  height={54}
                  margin={'auto'}
                >
                  <SVG src={IMG_LOGO_OASIS} />
                </TopicImage>
              </TopicCard>

              <TopicCard contentAlign={'center'} bgColor={Color.neutral98} padding={'42px'} href="/">
                <TopicImage
                  iconColor={Color.neutral20}
                  bgColor={'transparent'}
                  width={'100%'}
                  height={54}
                  margin={'auto'}
                >
                  <SVG src={IMG_LOGO_SAFE} />
                </TopicImage>
              </TopicCard>

              <TopicCard contentAlign={'center'} bgColor={Color.neutral98} padding={'42px'} gap={12} asProp="div">
                <TopicImage iconColor="#8702AA" bgColor={'transparent'} height={128}>
                  <SVG src={IMG_ICON_OWL} />
                </TopicImage>
                <TopicCardInner contentAlign="center">
                  <TopicTitle fontSize={51}>Yearn</TopicTitle>
                  <TopicDescription fontSize={21}>
                    Aave DAO used CoW Swap to swap over $4 million directly into Balancer liquidity pool
                  </TopicDescription>
                  <TopicButton bgColor="#490072" color="#F996EE">
                    Learn more
                  </TopicButton>
                </TopicCardInner>
              </TopicCard>

              <TopicCard contentAlign={'center'} bgColor={Color.neutral98} padding={'42px'} gap={12} asProp="div">
                <TopicImage iconColor="#8702AA" bgColor={'transparent'} height={128}>
                  <SVG src={IMG_ICON_GHOST} />
                </TopicImage>
                <TopicCardInner contentAlign="center">
                  <TopicTitle fontSize={51}>Giveth</TopicTitle>
                  <TopicDescription fontSize={21}>
                    Aave DAO used CoW Swap to swap over $4 million directly into Balancer liquidity pool
                  </TopicDescription>
                  <TopicButton bgColor="#490072" color="#F996EE">
                    Learn more
                  </TopicButton>
                </TopicCardInner>
              </TopicCard>

              <TopicCard contentAlign={'center'} bgColor={Color.neutral98} padding={'42px'} gap={12} asProp="div">
                <TopicImage iconColor="#8702AA" bgColor={'transparent'} height={128}>
                  <SVG src={IMG_ICON_GHOST} />
                </TopicImage>
                <TopicCardInner contentAlign="center">
                  <TopicTitle fontSize={51}>Balancer</TopicTitle>
                  <TopicDescription fontSize={21}>
                    Aave DAO used CoW Swap to swap over $4 million directly into Balancer liquidity pool
                  </TopicDescription>
                  <TopicButton bgColor="#490072" color="#F996EE">
                    Learn more
                  </TopicButton>
                </TopicCardInner>
              </TopicCard>

              <TopicCard contentAlign={'center'} bgColor={Color.neutral98} padding={'42px'} href="/">
                <TopicImage
                  iconColor={Color.neutral20}
                  bgColor={'transparent'}
                  width={'100%'}
                  height={54}
                  margin={'auto'}
                >
                  <SVG src={IMG_LOGO_SAFE} />
                </TopicImage>
              </TopicCard>

              <TopicCard contentAlign={'center'} bgColor={Color.neutral98} padding={'42px'} href="/">
                <TopicImage
                  iconColor={Color.neutral20}
                  bgColor={'transparent'}
                  width={'100%'}
                  height={54}
                  margin={'auto'}
                >
                  <SVG src={IMG_LOGO_OASIS} />
                </TopicImage>
              </TopicCard>

              <TopicCard contentAlign={'center'} bgColor={Color.neutral98} padding={'42px'} href="/">
                <TopicImage
                  iconColor={Color.neutral20}
                  bgColor={'transparent'}
                  width={'100%'}
                  height={54}
                  margin={'auto'}
                >
                  <SVG src={IMG_LOGO_SAFE} />
                </TopicImage>
              </TopicCard>
            </TopicList>
          </ContainerCardSection>
        </ContainerCard>

        <ContainerCard bgColor={'transparent'}>
          <ContainerCardSection>
            <SectionTitleWrapper color={Color.neutral10} maxWidth={1100}>
              <SectionTitleIcon size={114}>
                <SVG src={IMG_ICON_BUILD_WITH_COW} />
              </SectionTitleIcon>
              <SectionTitleText>Build with CoW Protocol</SectionTitleText>
            </SectionTitleWrapper>

            <TopicList columns={2}>
              <TopicCard contentAlign={'left'} bgColor="#66018E" textColor="#F996EE" padding={'32px'} asProp="div">
                <TopicCardInner contentAlign="left">
                  <TopicTitle fontSize={38} color={Color.neutral100}>
                    For developers
                  </TopicTitle>
                  <TopicDescription fontSize={21} color="#F996EE">
                    As an open-source protocol, building on top of CoW Protocol is permissionless. Thanks to
                    comprehensive documentation and even a live coding environment, integrating the protocol is easy.
                  </TopicDescription>
                  <TopicButton bgColor="#ED60E9" color="#66018E" fontSize={27}>
                    Read the docs
                  </TopicButton>
                </TopicCardInner>
                <TopicImage iconColor="#8702AA" bgColor="transparent" margin={'0 0 0 auto'} height={187} width={'auto'}>
                  <ProductLogo variant={ProductVariant.CowDao} logoIconOnly theme="dark" />
                </TopicImage>
              </TopicCard>

              <TopicCard contentAlign={'left'} bgColor="#66018E" textColor="#F996EE" padding={'32px'} asProp="div">
                <TopicCardInner contentAlign="left">
                  <TopicTitle fontSize={38} color={Color.neutral100}>
                    For DeFi projects
                  </TopicTitle>
                  <TopicDescription fontSize={21} color="#F996EE">
                    The worry-free DEX can power swaps and intent-based transactions for any DeFi project or use-case.
                  </TopicDescription>
                  <TopicButton bgColor="#ED60E9" color="#66018E" fontSize={27}>
                    Read the docs
                  </TopicButton>
                </TopicCardInner>
                <TopicImage iconColor="#8702AA" bgColor="transparent" margin={'0 0 0 auto'} height={187} width={'auto'}>
                  <ProductLogo variant={ProductVariant.CowDao} logoIconOnly theme="dark" />
                </TopicImage>
              </TopicCard>

              <TopicCard contentAlign={'left'} bgColor="#66018E" textColor="#F996EE" padding={'32px'} asProp="div">
                <TopicCardInner contentAlign="left">
                  <TopicTitle fontSize={38} color={Color.neutral100}>
                    For dummies
                  </TopicTitle>
                  <TopicDescription fontSize={21} color="#F996EE">
                    Want to bring the most advanced swap features in DeFi directly to your website, dApp, or project?
                  </TopicDescription>
                  <TopicButton bgColor="#ED60E9" color="#66018E" fontSize={27}>
                    Integrate the widget
                  </TopicButton>
                </TopicCardInner>
                <TopicImage iconColor="#8702AA" bgColor="transparent" margin={'0 0 0 auto'} height={187} width={'auto'}>
                  <ProductLogo variant={ProductVariant.CowDao} logoIconOnly theme="dark" />
                </TopicImage>
              </TopicCard>

              <TopicCard contentAlign={'left'} bgColor="#66018E" textColor="#F996EE" padding={'32px'} asProp="div">
                <TopicCardInner contentAlign="left">
                  <TopicTitle fontSize={38} color={Color.neutral100}>
                    For anyone
                  </TopicTitle>
                  <TopicDescription fontSize={21} color="#F996EE">
                    The CoW Grants program has given out over $100,000 to community contributors and to innovative
                    projects built on top of CoW Protocol.
                  </TopicDescription>
                  <TopicButton bgColor="#ED60E9" color="#66018E" fontSize={27}>
                    Apply for a grant
                  </TopicButton>
                </TopicCardInner>
                <TopicImage iconColor="#8702AA" bgColor="transparent" margin={'0 0 0 auto'} height={187} width={'auto'}>
                  <ProductLogo variant={ProductVariant.CowDao} logoIconOnly theme="dark" />
                </TopicImage>
              </TopicCard>
            </TopicList>
          </ContainerCardSection>
        </ContainerCard>

        <ContainerCard bgColor={'transparent'}>
          <ContainerCardSection>
            <SectionTitleWrapper>
              <SectionTitleIcon size={100}>
                <SVG src={IMG_ICON_SECURE} />
              </SectionTitleIcon>
              <SectionTitleText fontSize={90} textAlign="center">
                Secure & battle-tested
              </SectionTitleText>
            </SectionTitleWrapper>

            <TopicList columns={3}>
              <TopicCard bgColor="#66018E" textColor={Color.neutral100} href="/">
                <TopicImage iconColor="#F996EE" large></TopicImage>
                <TopicTitle fontSize={38}>Programmatic orders</TopicTitle>
              </TopicCard>

              <TopicCard bgColor="#66018E" textColor={Color.neutral100} href="/">
                <TopicImage iconColor="#F996EE" large></TopicImage>
                <TopicTitle fontSize={38}>CoW Hooks</TopicTitle>
              </TopicCard>

              <TopicCard bgColor="#66018E" textColor={Color.neutral100} href="/">
                <TopicImage iconColor="#F996EE" large></TopicImage>
                <TopicTitle fontSize={38}>Smart orders</TopicTitle>
              </TopicCard>
            </TopicList>
          </ContainerCardSection>
        </ContainerCard>

        <ContainerCard bgColor={'transparent'} color={Color.neutral10} touchFooter>
          <ContainerCardSection padding={'0 0 100px'}>
            <SectionTitleWrapper>
              <SectionTitleIcon>
                <SVG src={IMG_ICON_FAQ} />
              </SectionTitleIcon>
              <SectionTitleText>FAQs</SectionTitleText>
            </SectionTitleWrapper>

            <FAQ faqs={FAQ_DATA} />
          </ContainerCardSection>
        </ContainerCard>
      </Wrapper>
    </LayoutV2>
  )
}

export const getStaticProps: GetStaticProps<PageProps> = async () => {
  const siteConfigData = CONFIG
  const categoriesResponse = await getCategories()
  const articlesResponse = await getArticles()

  const categories =
    categoriesResponse?.map((category: Category) => ({
      name: category?.attributes?.name || '',
      slug: category?.attributes?.slug || '',
      description: category?.attributes?.description || '',
      bgColor: category?.attributes?.backgroundColor || '#fff',
      textColor: category?.attributes?.textColor || '#000',
      link: `/topic/${category?.attributes?.slug}`,
      iconColor: '#fff',
    })) || []

  return {
    props: {
      siteConfigData,
      categories,
      articles: articlesResponse.data,
    },
    revalidate: DATA_CACHE_TIME_SECONDS,
  }
}
