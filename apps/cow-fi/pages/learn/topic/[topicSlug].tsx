import React from 'react'
import Head from 'next/head'
import { GetStaticPaths, GetStaticProps } from 'next'
import styled from 'styled-components'
import { Font, Color, Media } from '@cowprotocol/ui'
import Layout from '@/components/Layout'
import { getCategoryBySlug, getAllCategorySlugs, getArticles } from 'services/cms'
import { SearchBar } from '@/components/SearchBar'
import { ArrowButton } from '@/components/ArrowButton'

import {
  Breadcrumbs,
  ContainerCard,
  ContainerCardSection,
  ContainerCardSectionTop,
  LinkSection,
  LinkColumn,
  LinkItem,
} from '@/styles/styled'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 1600px;
  width: 100%;
  margin: 76px auto 0;
  gap: 24px;
  padding: 0 16px;

  ${Media.upToMedium()} {
    margin: 0 auto;
    gap: 0;
    padding: 0 8px;
  }
`

const CategoryTitle = styled.div`
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  gap: 24px;
  font-size: 32px;
`

const CategoryImageWrapper = styled.div`
  --size: 82px;
  width: var(--size);
  height: var(--size);
  border-radius: var(--size);
  display: flex;
  justify-content: center;
`

const CategoryImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: inherit;
`

const CategoryDescription = styled.div`
  font-size: 21px;
  line-height: 1.5;
  color: ${Color.neutral20};
  display: flex;
  flex-flow: column wrap;
  gap: 24px;

  > p {
    margin: 0;
    font-size: inherit;
    line-height: inherit;
    color: inherit;
  }

  > i {
    font-size: 16px;
    font-weight: ${Font.weight.bold};
    color: ${Color.neutral0};
    font-style: normal;
  }
`

interface TopicPageProps {
  category: any // Adjust the type as per your Category structure
  articles: any[] // Adjust the type as per your Article structure
}

export default function TopicPage({ category, articles }: TopicPageProps) {
  const { name, description, image } = category.attributes || {}
  const imageUrl = image?.data?.attributes?.url

  return (
    <Layout>
      <Head>
        <title>{name} - Knowledge Base</title>
        <meta name="description" content={description} />
        <meta property="og:description" content={description} />
        <meta property="og:title" content={name} />
        <meta name="twitter:title" content={name} />
      </Head>

      <Wrapper>
        <SearchBar articles={articles} />

        <ContainerCard gap={42} gapMobile={24} touchFooter>
          <Breadcrumbs padding={'0'}>
            <a href="/learn/topics/">Topic</a>
            <span>{name}</span>
          </Breadcrumbs>

          <ContainerCardSectionTop>
            <CategoryTitle>
              {imageUrl && (
                <CategoryImageWrapper>
                  <CategoryImage src={imageUrl} alt={name} />
                </CategoryImageWrapper>
              )}
              <h1>{name}</h1>
            </CategoryTitle>
            <ArrowButton link="/learn/topics" text="All topics" />
          </ContainerCardSectionTop>

          <ContainerCardSection>
            <CategoryDescription>
              <p>{description}</p>
              <i>{articles.length} articles</i>
            </CategoryDescription>

            <LinkSection bgColor={'transparent'} columns={1} padding="0">
              <LinkColumn>
                {articles?.map((article) =>
                  article.attributes ? (
                    <LinkItem key={article.id} href={`/learn/${article.attributes.slug}`}>
                      {article.attributes.title}
                      <span>→</span>
                    </LinkItem>
                  ) : null
                )}
              </LinkColumn>
            </LinkSection>
          </ContainerCardSection>
        </ContainerCard>
      </Wrapper>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.topicSlug as string
  const categoryResponse = await getCategoryBySlug(slug)
  const category = categoryResponse

  if (!category) {
    return {
      notFound: true,
    }
  }

  const articlesResponse = await getArticles({
    page: 0,
    pageSize: 50,
    filters: {
      categories: {
        slug: {
          $eq: slug,
        },
      },
    },
  })

  const articles = articlesResponse.data

  return {
    props: {
      category,
      articles,
    },
    revalidate: 5 * 60,
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const categoriesResponse = await getAllCategorySlugs()
  const paths = categoriesResponse.map((slug) => ({
    params: { topicSlug: slug },
  }))

  return {
    paths,
    fallback: false,
  }
}
