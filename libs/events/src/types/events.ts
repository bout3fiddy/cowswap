import {
  OnFulfilledOrderPayload,
  OnPostedOrderPayload,
  OnRejectedOrderPayload as OnCancelledOrderPayload,
} from './orders'
import { OnToastMessagePayload } from './toastMessages'

export enum CowEvents {
  ON_TOAST_MESSAGE = 'ON_TOAST_MESSAGE',
  ON_POSTED_ORDER = 'ON_POSTED_ORDER',
  ON_FULFILLED_ORDER = 'ON_FULFILLED_ORDER',
  ON_CANCELLED_ORDER = 'ON_CANCELLED_ORDER',
}

// Define types for event payloads
export interface CowEventPayloadMap {
  [CowEvents.ON_TOAST_MESSAGE]: OnToastMessagePayload
  [CowEvents.ON_POSTED_ORDER]: OnPostedOrderPayload
  [CowEvents.ON_FULFILLED_ORDER]: OnFulfilledOrderPayload
  [CowEvents.ON_CANCELLED_ORDER]: OnCancelledOrderPayload
}

export type CowEventPayloads = CowEventPayloadMap[CowEvents]
