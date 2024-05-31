import { isSellOrder } from '@cowprotocol/common-utils'
import { type OrderParameters, getQuoteAmountsAndCosts, QuoteAmountsAndCosts } from '@cowprotocol/cow-sdk'
import { Currency, CurrencyAmount, Percent, Price } from '@uniswap/sdk-core'

import { DirectedReceiveAmounts, ReceiveAmountInfo } from '../types'

export function getDirectedReceiveAmounts(info: ReceiveAmountInfo): DirectedReceiveAmounts {
  const {
    isSell,
    costs: { networkFee },
    afterPartnerFees,
    afterSlippage,
    beforeNetworkCosts,
  } = info

  return {
    amountBeforeFees: isSell ? beforeNetworkCosts.buyAmount : beforeNetworkCosts.sellAmount,
    amountAfterFees: isSell ? afterPartnerFees.buyAmount : afterPartnerFees.sellAmount,
    amountAfterSlippage: isSell ? afterSlippage.buyAmount : afterSlippage.sellAmount,
    networkFeeAmount: isSell ? networkFee.amountInBuyCurrency : networkFee.amountInSellCurrency,
  }
}

type AmountsAndCosts = Omit<QuoteAmountsAndCosts<CurrencyAmount<Currency>>, 'quotePrice'>

/**
 * Map native bigint amounts to CurrencyAmounts
 */
export function getReceiveAmountInfo(
  orderParams: OrderParameters,
  inputCurrency: Currency,
  outputCurrency: Currency,
  slippagePercent: Percent,
  _partnerFeeBps: number | undefined
): AmountsAndCosts & { quotePrice: Price<Currency, Currency> } {
  const partnerFeeBps = _partnerFeeBps ?? 0
  const currencies = { inputCurrency, outputCurrency }

  const isSell = isSellOrder(orderParams.kind)

  const result = getQuoteAmountsAndCosts({
    orderParams,
    sellDecimals: inputCurrency.decimals,
    buyDecimals: outputCurrency.decimals,
    slippagePercentBps: Number(slippagePercent.numerator),
    partnerFeeBps,
  })

  const beforeNetworkCosts = mapBigIntAmounts(result.beforeNetworkCosts, currencies)
  const afterNetworkCosts = mapBigIntAmounts(result.afterNetworkCosts, currencies)

  return {
    ...result,
    quotePrice: new Price<Currency, Currency>({
      baseAmount: beforeNetworkCosts.sellAmount,
      quoteAmount: afterNetworkCosts.buyAmount,
    }),
    costs: {
      networkFee: {
        amountInSellCurrency: CurrencyAmount.fromRawAmount(
          inputCurrency,
          result.costs.networkFee.amountInSellCurrency.toString()
        ),
        amountInBuyCurrency: CurrencyAmount.fromRawAmount(
          outputCurrency,
          result.costs.networkFee.amountInBuyCurrency.toString()
        ),
      },
      partnerFee: {
        amount: CurrencyAmount.fromRawAmount(
          isSell ? outputCurrency : inputCurrency,
          result.costs.partnerFee.amount.toString()
        ),
        bps: result.costs.partnerFee.bps,
      },
    },
    beforeNetworkCosts,
    afterNetworkCosts,
    afterPartnerFees: mapBigIntAmounts(result.afterPartnerFees, currencies),
    afterSlippage: mapBigIntAmounts(result.afterSlippage, currencies),
  }
}

function mapBigIntAmounts(
  amounts: { sellAmount: bigint; buyAmount: bigint },
  currencies: { inputCurrency: Currency; outputCurrency: Currency }
): {
  sellAmount: CurrencyAmount<Currency>
  buyAmount: CurrencyAmount<Currency>
} {
  return {
    sellAmount: CurrencyAmount.fromRawAmount(currencies.inputCurrency, amounts.sellAmount.toString()),
    buyAmount: CurrencyAmount.fromRawAmount(currencies.outputCurrency, amounts.buyAmount.toString()),
  }
}
