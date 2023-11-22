import { transparentize } from 'polished'
import { Repeat } from 'react-feather'
import styled from 'styled-components/macro'

import QuestionHelper from 'legacy/components/QuestionHelper'

import { UI } from 'common/constants/theme'
import { RateInfo } from 'common/pure/RateInfo'

export const Box = styled.div`
  margin: 6px 8px;
`

export const Row = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  font-weight: 400;
  color: var(${UI.COLOR_PRIMARY_TEXT});
  min-height: 24px;
  gap: 3px;

  > div {
    display: flex;
    align-items: center;

    &:first-child {
      font-weight: 400;
      gap: 3px;
    }

    &:first-child > span {
      color: ${`var(${UI.COLOR_PRIMARY_TEXT_OPACITY_25})`};
      transition: color 0.15s ease-in-out;

      &:hover {
        color: var(${UI.COLOR_PRIMARY_TEXT});
      }
    }

    &:last-child {
      text-align: right;
    }
  }
`

export const PriceSwitchButton = styled(Repeat)`
  cursor: pointer;
  border-radius: 20px;
  background: ${({ theme }) => theme.bg4};
  padding: 4px;
  vertical-align: middle;
  line-height: 0;
`

export const QuestionHelperWrapped = styled(QuestionHelper)`
  display: inline-block;
  vertical-align: middle;
  line-height: 0;
`

export const Discount = styled.span`
  margin: auto;
  display: flex;
  cursor: pointer;
  padding: 2px 8px;
  background: var(${UI.COLOR_GREY});
  color: var(${UI.COLOR_PRIMARY_TEXT});
  border-radius: 5px;
  font-weight: 400;
  transition: background 0.2s ease-in-out, color 0.2s ease-in-out;

  &:hover {
    background: var(${UI.COLOR_PRIMARY});
    color: ${({ theme }) => theme.white};
  }
`

export const LightText = styled.span`
  font-weight: 300;
`

export const StyledRateInfo = styled(RateInfo)`
  font-size: 13px;
  font-weight: 500;
  min-height: 24px;
`
