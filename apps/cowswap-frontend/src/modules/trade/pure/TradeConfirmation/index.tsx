import React from 'react'

import { ButtonSize, ButtonPrimary } from '@cowprotocol/ui'
import { BackButton } from '@cowprotocol/ui'

import { Trans } from '@lingui/macro'

import { PriceImpact } from 'legacy/hooks/usePriceImpact'

import { CurrencyAmountPreview, CurrencyPreviewInfo } from 'common/pure/CurrencyInputPanel'

import { useIsPriceChanged } from './hooks/useIsPriceChanged'
import * as styledEl from './styled'

import { PriceUpdatedBanner } from '../PriceUpdatedBanner'

export interface TradeConfirmationProps {
  onConfirm(): void
  onDismiss(): void
  inputCurrencyInfo: CurrencyPreviewInfo
  outputCurrencyInfo: CurrencyPreviewInfo
  isConfirmDisabled: boolean
  priceImpact: PriceImpact
  title: JSX.Element | string
  buttonText?: React.ReactNode
  children?: JSX.Element
}

export function TradeConfirmation(props: TradeConfirmationProps) {
  const {
    onConfirm,
    onDismiss,
    inputCurrencyInfo,
    outputCurrencyInfo,
    isConfirmDisabled,
    priceImpact,
    title,
    buttonText = 'Confirm',
    children,
  } = props

  const inputAmount = inputCurrencyInfo.amount?.toExact()
  const outputAmount = outputCurrencyInfo.amount?.toExact()

  const { isPriceChanged, resetPriceChanged } = useIsPriceChanged(inputAmount, outputAmount)

  const isButtonDisabled = isConfirmDisabled || isPriceChanged

  return (
    <styledEl.WidgetWrapper onKeyDown={(e) => e.key === 'Escape' && onDismiss()}>
      <styledEl.Header>
        <BackButton onClick={onDismiss} />
        <styledEl.ConfirmHeaderTitle>{title}</styledEl.ConfirmHeaderTitle>

        {/* TODO: Here we show a countdown before the front-end fetches a new quote */}
        <styledEl.QuoteCountdown>
          Quote expires in <b>20s</b>
        </styledEl.QuoteCountdown>
      </styledEl.Header>
      <styledEl.ContentWrapper id="trade-confirmation">
        <styledEl.AmountsPreviewContainer>
          <CurrencyAmountPreview id="input-currency-preview" currencyInfo={inputCurrencyInfo} />
          <styledEl.SeparatorWrapper>
            <styledEl.AmountsSeparator />
          </styledEl.SeparatorWrapper>
          <CurrencyAmountPreview
            id="output-currency-preview"
            currencyInfo={outputCurrencyInfo}
            priceImpactParams={priceImpact}
          />
        </styledEl.AmountsPreviewContainer>
        {children}
        {isPriceChanged && <PriceUpdatedBanner onClick={resetPriceChanged} />}
        <ButtonPrimary onClick={onConfirm} disabled={isButtonDisabled} buttonSize={ButtonSize.BIG}>
          <Trans>{buttonText}</Trans>
        </ButtonPrimary>
      </styledEl.ContentWrapper>
    </styledEl.WidgetWrapper>
  )
}
