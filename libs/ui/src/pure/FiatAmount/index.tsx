import styled from 'styled-components'
import { FeatureFlag, formatFiatAmount, FractionUtils } from '@cowprotocol/common-utils'
import { AMOUNTS_FORMATTING_FEATURE_FLAG } from '../../consts'
import { FractionLike, Nullish } from '../../types'
import { LONG_PRECISION } from '@cowprotocol/common-const'
export interface FiatAmountProps {
  amount: Nullish<FractionLike>
  accurate?: boolean
  defaultValue?: string
  className?: string
}

const highlight = !!FeatureFlag.get(AMOUNTS_FORMATTING_FEATURE_FLAG)

const Wrapper = styled.span<{ highlight: boolean }>`
  // TODO: don't use hardcoded colors
  background: ${({ highlight }) => (highlight ? 'rgba(113,255,18,0.4)' : '')};
`

export function FiatAmount({ amount, defaultValue, className, accurate = false }: FiatAmountProps) {
  const formattedAmount = formatFiatAmount(amount)
  const title = FractionUtils.fractionLikeToExactString(amount, LONG_PRECISION)
  const accuracySymbol = accurate ? '' : '≈ '

  return (
    <Wrapper title={title} className={(className || '') + ' fiat-amount'} highlight={highlight}>
      {formattedAmount ? accuracySymbol + '$' : ''}
      {formattedAmount || defaultValue}
    </Wrapper>
  )
}
