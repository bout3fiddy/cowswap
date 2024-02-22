import { TokenWithLogo } from '@cowprotocol/common-const'
import { OnPostedOrderPayload } from '@cowprotocol/events'
import { CurrencyAmount } from '@uniswap/sdk-core'

import { PendingOrderNotificationProps } from 'common/pure/PendingOrderNotification'
import { UiOrderType } from 'utils/orderUtils/getUiOrderType'

export function getPendingOrderNotificationProps(
  payload: OnPostedOrderPayload,
  isSafeWallet: boolean
): PendingOrderNotificationProps {
  const { inputToken, inputAmount: inputAmountRaw, outputAmount: outputAmountRaw, outputToken } = payload

  const inputAmount = CurrencyAmount.fromRawAmount(TokenWithLogo.fromToken(inputToken), inputAmountRaw.toString())

  const outputAmount = CurrencyAmount.fromRawAmount(TokenWithLogo.fromToken(outputToken), outputAmountRaw.toString())

  return {
    ...payload,
    isSafeWallet,
    inputAmount,
    outputAmount,
    // TODO: remove after fixing type
    orderType: payload.orderType as UiOrderType,
  }
}
