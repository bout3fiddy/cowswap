import styled from 'styled-components/macro'
import { CowSwapTheme } from '@cowprotocol/widget-lib'
import { Color, Media } from '@cowprotocol/ui'

export const FooterContainer = styled.footer<{ theme: CowSwapTheme; expanded: boolean }>`
  --bgColor: ${({ theme }) => Color(theme).neutral10};
  --color: ${({ theme }) => Color(theme).neutral50};
  --colorTitle: ${({ theme }) => Color(theme).neutral98};
  background: var(--bgColor);
  color: var(--color);
  padding: ${({ expanded }) => (expanded ? '134px 0 0' : '0')};
  text-align: left;
  transition: padding 0.3s ease;
  font-size: 18px;

  ${Media.upToSmall} {
    padding: ${({ expanded }) => (expanded ? '54px 0 0' : '0')};
  }
`

export const FooterContent = styled.div`
  display: grid;
  grid-template-columns: 0.7fr 1fr;
  gap: 20px;
  padding: 0 48px;

  ${Media.upToLarge} {
    grid-template-columns: 1fr;
    gap: 56px;
  }

  ${Media.upToSmall} {
    padding: 0 24px;
  }
`

export const FooterDescriptionSection = styled.div`
  display: flex;
  flex-flow: column wrap;
  gap: 40px;
  max-width: 400px;
  width: 100%;

  ${Media.upToLarge} {
    max-width: 100%;
  }
`

export const FooterLogo = styled.div`
  display: flex;
  align-items: center;
`

export const SocialIconsWrapper = styled.div`
  display: flex;
  gap: 16px;
`

export const SocialIconLink = styled.a`
  --size: 32px;
  background: var(--color);
  color: var(--bgColor);
  text-decoration: none;
  border-radius: var(--size);
  display: flex;
  justify-content: center;
  align-items: center;
  height: var(--size);
  width: var(--size);
  padding: calc(var(--size) / 4);
  transition: background 0.2s ease-in-out;

  &:hover {
    background: var(--colorTitle);
  }

  > svg {
    height: 100%;
    width: 100%;
    object-fit: contain;
    color: inherit;
  }
`

export const SectionTitle = styled.h4`
  margin: 0;
  color: var(--colorTitle);
`

export const LinkListWrapper = styled.div`
  column-count: 3;
  column-gap: 70px;
  width: max-content;
  margin: 0 0 0 auto;
  color: inherit;

  ${Media.upToLarge} {
    width: 100%;
  }

  ${Media.upToSmall} {
    column-count: initial;
    column-gap: initial;
  }
`

export const LinkListGroup = styled.div`
  break-inside: avoid;
  margin: 0 0 40px;
  padding: 0;
  color: inherit;
  display: flex;
  flex-flow: column wrap;
  gap: 20px;
`

export const LinkList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
  color: inherit;
  gap: 10px;
  display: flex;
  flex-flow: column wrap;
  font-size: 18px;

  ${Media.upToSmall} {
    gap: 16px;
  }

  > li {
    margin: 0;
    padding: 0;
    color: inherit;
    font-size: inherit;
  }
`

export const Link = styled.a`
  color: inherit;
  text-decoration: none;

  &:hover {
    color: var(--colorTitle);
  }
`

export const FooterBottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  gap: 24px;
  font-size: 14px;

  ${Media.upToLarge} {
    flex-flow: column wrap;
  }
`

export const FooterBottomLogos = styled.div`
  display: flex;
  gap: 28px;
  height: auto;
  margin: 0 auto 0 0;

  ${Media.upToLarge} {
    width: 100%;
    margin: 24px auto;
    justify-content: center;
    flex-flow: row wrap;
    gap: 56px;
  }

  > a {
    display: flex;
    align-items: center;
    justify-content: center;
    height: inherit;
  }
`

export const BottomText = styled.p`
  margin: 0;
`

export const Description = styled.p`
  margin: 0;
  line-height: 1.5;
`

export const BottomRight = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex: 1 1 auto;
  margin: 0 0 0 auto;
  gap: 10px;

  ${Media.upToLarge} {
    margin: 0;
    width: 100%;
    justify-content: flex-start;
  }
`

export const ToggleFooterButton = styled.button<{ expanded: boolean }>`
  --size: 22px;
  height: var(--size);
  width: var(--size);
  object-fit: contain;
  background: transparent;
  border: none;
  color: inherit;
  cursor: pointer;
  font-size: 16px;
  padding: 0;
  transition: transform 0.3s ease-in-out;
  transform: ${({ expanded }) => (expanded ? 'rotate(-90deg)' : 'rotate(0deg)')};

  ${Media.upToLarge} {
    margin: 0 0 0 auto;
  }
`
