import { ReactNode } from 'react'

import { FiatAmount, getTokenAmountTitle, InfoTooltip, RowBetween, RowFixed, TokenAmount, UI } from '@cowprotocol/ui'
import { Currency, CurrencyAmount, Token } from '@uniswap/sdk-core'

import styled from 'styled-components/macro'

import { FiatRate } from 'common/pure/RateInfo'

const PlusGas = styled.span`
  color: var(${UI.COLOR_TEXT2});
  font-size: 11px;
  font-weight: 400;
`

const Label = styled.span`
  font-weight: 400;
  margin-right: 5px;
  opacity: 0.7;
`

const FreeLabel = styled.span`
  color: var(${UI.COLOR_GREEN});
`

const Wrapper = styled(RowBetween)`
  margin-bottom: 5px;
`

export interface RowFeeContentProps {
  label: string
  tooltip: ReactNode
  feeAmount?: CurrencyAmount<Currency> | null
  feeInFiat: CurrencyAmount<Token> | null
  feeIsApproximate?: boolean
  noLabel?: boolean
  requireGas?: boolean
  isFree: boolean
}

export function RowFeeContent(props: RowFeeContentProps) {
  const { label, tooltip, feeAmount, feeInFiat, isFree, feeIsApproximate, noLabel, requireGas } = props

  const tokenSymbol = feeAmount?.currency

  return (
    <Wrapper>
      {!noLabel && (
        <RowFixed>
          <Label>{label}</Label>
          <InfoTooltip content={tooltip} />
        </RowFixed>
      )}

      <div title={getTokenAmountTitle({ amount: feeAmount, tokenSymbol })}>
        {isFree ? (
          <FreeLabel>FREE</FreeLabel>
        ) : (
          <>
            {feeIsApproximate ? '≈ ' : ''}
            <TokenAmount amount={feeAmount} tokenSymbol={tokenSymbol} />
            {requireGas && <PlusGas>&nbsp;+ gas</PlusGas>}
          </>
        )}{' '}
        {feeInFiat && (
          <FiatRate>
            (<FiatAmount amount={feeInFiat} />)
          </FiatRate>
        )}
      </div>
    </Wrapper>
  )
}
