import type { ReactNode } from 'react'

import type {
  CowHook,
  CowHookCreation,
  HookDappOrderParams,
  CoWHookDappActions,
  HookDappContext as GenericHookDappContext,
  CowHookDetails,
} from '@cowprotocol/hook-dapp-lib'
import type { Signer } from '@ethersproject/abstract-signer'

export type { CowHook, CowHookCreation, HookDappOrderParams }

export enum HookDappType {
  INTERNAL = 'INTERNAL',
  IFRAME = 'IFRAME',
}

export enum HookDappWalletCompatibility {
  EOA = 'EOA',
  SMART_CONTRACT = 'Smart contract',
}

export interface HookDappBase {
  name: string
  descriptionShort?: string
  description?: ReactNode | string
  type: HookDappType
  version: string
  website: string
  image: string
  walletCompatibility: HookDappWalletCompatibility[]
}

export type DappId = `${HookDappType}:::${HookDappBase['name']}`

export interface HookDappInternal extends HookDappBase {
  type: HookDappType.INTERNAL
  component: (props: HookDappProps) => ReactNode
  walletCompatibility: HookDappWalletCompatibility[]
}

export interface HookDappIframe extends HookDappBase {
  type: HookDappType.IFRAME
  url: string
}

export type HookDapp = HookDappInternal | HookDappIframe

export interface CowHookDetailsSerialized {
  hookDetails: CowHookDetails
  dappId: DappId
}

export type AddHook = CoWHookDappActions['addHook']
export type EditHook = CoWHookDappActions['editHook']
export type RemoveHook = (uuid: string) => void

export interface HookDappContext extends GenericHookDappContext {
  addHook: AddHook
  editHook: EditHook
  setSellToken(tokenAddress: string): void
  setBuyToken(tokenAddress: string): void
  signer?: Signer
}

export interface HookDappProps {
  dapp: HookDapp
  context: HookDappContext
}
