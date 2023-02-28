import styled from 'styled-components/macro'
import {Wrapper as TokenWrapper} from '@cow/common/pure/TokenAmount'
import { transparentize } from 'polished'

export const RateValue = styled.span`
  ${TokenWrapper} > span {
    color: ${({ theme }) => transparentize(0.3, theme.text1)};
  }
`

export const StatusBox = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`

export const AmountItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    white-space: normal;
  `};

  > div {
    display: flex;
    align-items: center;
  }

  > span {
    white-space: normal;
    word-break: break-all;
  }

  > span > span {
    color: ${({ theme }) => transparentize(0.3, theme.text1)};
  }
`

export const WarningIndicator = styled.button`
  --height: 28px;
  margin: 0;
  background: ${({ theme }) => (theme.darkMode ? transparentize(0.9, theme.alert) : transparentize(0.85, theme.alert))};
  color: ${({ theme }) => theme.alert};
  line-height: 0;
  border: 0;
  padding: 0 5px;
  width: auto;
  height: var(--height);
  border-radius: 0 9px 9px 0;

  svg > path {
    fill: ${({ theme }) => theme.alert};
  }
`

export const WarningContent = styled.div`
  max-width: 450px;
  padding: 15px 20px;
  color: ${({ theme }) => theme.black};

  h3,
  p {
    margin: 0;
  }

  h3 {
    margin-bottom: 8px;
  }
`

export const WarningParagraph = styled.div`
  margin-bottom: 20px;

  :last-child {
    margin-bottom: 0;
  }
`

export const CellElement = styled.div<{ doubleRow?: boolean }>`
  padding: 12px 0;
  font-size: 13px;
  font-weight: 400;
  display: flex;

  > b {
    font-weight: 400;
  }

  ${({ doubleRow }) =>
    doubleRow &&
    `
    flex-flow: column wrap;
    gap: 2px;

    > i {
      opacity: 0.7;
    }
  `}
`

export const CurrencyLogoPair = styled.div`
  display: flex;

  > img {
    border: 2px solid ${({ theme }) => theme.grey1};
  }

  > img:last-child,
  > svg:last-child {
    margin: 0 0 0 -14px;
  }
`

export const CurrencyCell = styled.div<{ clickable?: boolean }>`
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  gap: 6px;
  cursor: ${({ clickable }) => (clickable ? 'pointer' : '')};

  :hover {
    text-decoration: ${({ clickable }) => (clickable ? 'underline' : '')};
  }
`

export const CurrencyAmountWrapper = styled.div`
  display: flex;
  flex-flow: column wrap;
  gap: 2px;
`

export const ProgressBar = styled.div<{ value: number }>`
  position: relative;
  margin: 2px 0 0;
  height: 5px;
  width: 100%;
  background: ${({ theme }) => (theme.darkMode ? theme.bg1 : transparentize(0.92, theme.text1))};
  border-radius: 6px;

  &::before {
    content: '';
    position: absolute;
    height: 100%;
    width: ${({ value }) => value}%;
    background: ${({ theme }) => theme.text3};
    border-radius: 5px;
  }
`
