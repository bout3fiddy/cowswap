import { EnrichedOrder } from '@cowprotocol/cow-sdk'

import { Order } from 'legacy/state/orders/actions'
import { computeOrderSummary } from 'legacy/state/orders/updaters/utils'

import { TokensByAddress } from 'modules/tokensList/state/tokensListAtom'

import { getPartOrderStatus } from './getPartOrderStatus'

import { TwapPartOrderItem } from '../state/twapPartOrdersAtom'
import { TwapOrderItem, TwapOrderStatus } from '../types'

export function mapPartOrderToStoreOrder(
  item: TwapPartOrderItem,
  enrichedOrder: EnrichedOrder,
  isVirtualPart: boolean,
  parent: TwapOrderItem,
  tokensByAddress: TokensByAddress
): Order {
  const isCancelling = parent.status === TwapOrderStatus.Cancelling
  const status = getPartOrderStatus(enrichedOrder, parent, isVirtualPart)

  const storeOrder: Order = {
    ...enrichedOrder,
    id: enrichedOrder.uid,
    composableCowInfo: {
      isVirtualPart,
      parentId: parent.id,
    },
    sellAmountBeforeFee: enrichedOrder.sellAmount,
    inputToken: tokensByAddress[enrichedOrder.sellToken.toLowerCase()],
    outputToken: tokensByAddress[enrichedOrder.buyToken.toLowerCase()],
    creationTime: enrichedOrder.creationDate,
    summary: '',
    status,
    apiAdditionalInfo: enrichedOrder,
    isCancelling,
  }

  const summary = computeOrderSummary({ orderFromStore: storeOrder, orderFromApi: enrichedOrder })

  storeOrder.summary = summary || ''

  return storeOrder
}
