// On each Pending, Expired, Fulfilled order action a corresponding sound is dispatched
import { AppState } from '../../index'
import { getCowSoundError, getCowSoundSend, getCowSoundSuccess } from '../../../utils/sound'
import { AddPendingOrderParams, BatchOrdersUpdateParams, UpdateOrderParams } from '../actions'
import { OrdersState } from '../reducer'
import { getOrderByIdFromState } from '../helpers'
import { AnyAction, Dispatch, Middleware, MiddlewareAPI } from 'redux'
import * as OrderActions from '../actions'
import { isAnyOf } from '@reduxjs/toolkit'
import { addPopup } from '../../application/reducer'

// action syntactic sugar
// const isSingleOrderChangeAction = isAnyOf(OrderActions.addPendingOrder)
const isPendingOrderAction = isAnyOf(OrderActions.addPendingOrder)
const isUpdateOrderAction = isAnyOf(OrderActions.updateOrder)
const isBatchOrderAction = isAnyOf(
  OrderActions.fulfillOrdersBatch,
  OrderActions.expireOrdersBatch,
  OrderActions.cancelOrdersBatch,
  OrderActions.preSignOrders
)
const isBatchFulfillOrderAction = isAnyOf(OrderActions.fulfillOrdersBatch)
const isBatchExpireOrderAction = isAnyOf(OrderActions.expireOrdersBatch)
const isBatchCancelOrderAction = isAnyOf(OrderActions.cancelOrdersBatch)
// const isBatchPresignOrders = isAnyOf(OrderActions.preSignOrders)
const isFulfillOrderAction = isAnyOf(OrderActions.addPendingOrder, OrderActions.fulfillOrdersBatch)
const isAddPopup = isAnyOf(addPopup)

export const soundMiddleware: Middleware<Record<string, unknown>, AppState> = (store) => (next) => (action) => {
  const result = next(action)

  if (isBatchOrderAction(action)) {
    const { chainId } = action.payload
    const orders = store.getState().orders[chainId]

    // no orders were executed/expired
    if (!orders) {
      return result
    }

    const updatedElements = isBatchFulfillOrderAction(action) ? action.payload.ordersData : action.payload.ids
    // no orders were executed/expired
    if (updatedElements.length === 0) {
      return result
    }
  }

  let cowSound
  if (isPendingOrderAction(action)) {
    if (_shouldPlayPendingOrderSound(action.payload)) {
      cowSound = getCowSoundSend()
    }
  } else if (isFulfillOrderAction(action)) {
    cowSound = getCowSoundSuccess()
  } else if (isBatchExpireOrderAction(action)) {
    if (_shouldPlayExpiredOrderSound(action.payload, store)) {
      cowSound = getCowSoundError()
    }
  } else if (isBatchCancelOrderAction(action)) {
    cowSound = getCowSoundError()
  } else if (isFailedTxAction(action)) {
    cowSound = getCowSoundError()
  } else if (isUpdateOrderAction(action)) {
    cowSound = _getUpdatedOrderSound(action.payload)
  }

  if (cowSound) {
    cowSound.play().catch((e) => {
      console.error('🐮 Moooooo sound cannot be played', e)
    })
  }

  return result
}

function _shouldPlayPendingOrderSound(payload: AddPendingOrderParams): boolean {
  // Only play COW sound if added pending order is not hidden
  return !payload.order.isHidden
}

function _shouldPlayExpiredOrderSound(
  payload: BatchOrdersUpdateParams,
  store: MiddlewareAPI<Dispatch<AnyAction>, { orders: OrdersState }>
): boolean {
  const { chainId, ids } = payload
  const orders = store.getState().orders[chainId]

  // Only play COW sound if there's at least one order expired which wasn't hidden
  return ids.some((id) => {
    const order = getOrderByIdFromState(orders, id)?.order
    return order && !order.isHidden
  })
}

function _getUpdatedOrderSound(payload: UpdateOrderParams) {
  if (!payload.order.isHidden) {
    // Trigger COW sound when an order is being updated to a non-hidden state
    return getCowSoundSend()
  }
  return undefined
}

/**
 * Checks whether the action is `addPopup` for a `txn` which failed
 */
function isFailedTxAction(action: unknown): boolean {
  return isAddPopup(action) && 'txn' in action.payload.content && action.payload.content.txn.success === false
}
