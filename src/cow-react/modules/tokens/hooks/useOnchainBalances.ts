import { Interface } from '@ethersproject/abi'
import { isAddress } from '@src/utils'
import { CurrencyAmount, Token } from '@uniswap/sdk-core'
import JSBI from 'jsbi'
import ERC20ABI from 'abis/erc20.json'
import { Erc20Interface } from 'abis/types/Erc20'
import { useMultipleContractSingleData } from 'lib/hooks/multicall'
import { ListenerOptionsWithGas } from '@uniswap/redux-multicall'
import { useMemo } from 'react'
import { OnchainState } from '../types'

const ERC20Interface = new Interface(ERC20ABI) as Erc20Interface
const DEFAULT_LISTENER_OPTIONS: ListenerOptionsWithGas = { gasRequired: 185_000, blocksPerFetch: 5 }

export type OnchainTokenAmount = OnchainState<CurrencyAmount<Token> | null>

export type OnchainTokenAmounts = {
  [tokenAddress: string]: OnchainTokenAmount
}

export type OnchainAmountsResult = {
  amounts: OnchainTokenAmounts
  isLoading: boolean
}

export interface OnchainAmountsParams {
  account?: string
  tokens?: (Token | undefined)[]
  blocksPerFetch?: number
}

export type OnchainBalancesParams = OnchainAmountsParams

export type OnchainAllowancesParams = OnchainAmountsParams & { spender?: string }

export function useOnchainBalances(params: OnchainBalancesParams): OnchainAmountsResult {
  const { account } = params
  const callParams = useMemo(() => [account], [account])
  return useOnchainErc20Amounts('balanceOf', callParams, params)
}

export function useOnchainAllowances(params: OnchainAllowancesParams): OnchainAmountsResult {
  const { account, spender } = params
  const callParams = useMemo(() => [account, spender], [account, spender])
  return useOnchainErc20Amounts('allowance', callParams, params)
}

export interface OnchainBalancesAndAllowancesParams {
  account: string | undefined
  spender: string | undefined
  tokens: Token[]
  blocksPerFetchBalance?: number
  blocksPerFetchAllowance?: number
}

export interface OnchainBalancesAndAllowances {
  balances: OnchainTokenAmounts
  allowances: OnchainTokenAmounts
}

/**
 * Fetches
 * @param params
 * @returns
 */
export function useOnchainBalancesAndAllowances(
  params: OnchainBalancesAndAllowancesParams
): OnchainBalancesAndAllowances {
  const { account, spender, tokens, blocksPerFetchAllowance, blocksPerFetchBalance } = params

  const { amounts: balances } = useOnchainBalances({ account, tokens, blocksPerFetch: blocksPerFetchBalance })
  const { amounts: allowances } = useOnchainAllowances({
    account,
    tokens,
    spender,
    blocksPerFetch: blocksPerFetchAllowance,
  })

  return useMemo(() => ({ balances, allowances }), [balances, allowances])
}

function useOnchainErc20Amounts(
  erc20Method: 'balanceOf' | 'allowance',
  callParams: (string | undefined)[],
  params: OnchainAmountsParams
): OnchainAmountsResult {
  const { account, blocksPerFetch, tokens } = params

  const validatedTokens: Token[] = useMemo(
    () => tokens?.filter((t?: Token): t is Token => isAddress(t?.address) !== false) ?? [],
    [tokens]
  )
  const validatedTokenAddresses = useMemo(() => validatedTokens.map((vt) => vt.address), [validatedTokens])

  // Do on-chain calls
  const balancesCallState = useMultipleContractSingleData(
    validatedTokenAddresses,
    ERC20Interface,
    erc20Method,
    callParams,
    blocksPerFetch ? { ...DEFAULT_LISTENER_OPTIONS, blocksPerFetch } : DEFAULT_LISTENER_OPTIONS
  )

  const isLoading: boolean = useMemo(
    () => balancesCallState.some((callState) => callState.loading),
    [balancesCallState]
  )

  // Return amounts
  return useMemo(() => {
    if (!account || validatedTokens.length === 0) {
      return { isLoading, amounts: {} }
    }

    const tokenBalances = validatedTokens.reduce<OnchainTokenAmounts>((acc, token, i) => {
      const { error, loading, result, syncing, valid } = balancesCallState[i]
      const value = result?.[0]
      const amount = value ? JSBI.BigInt(value.toString()) : null

      acc[token.address] = {
        value: amount ? CurrencyAmount.fromRawAmount(token, amount) : acc[token.address].value,
        loading,
        error,
        syncing,
        valid,
      }
      return acc
    }, {})

    return { amounts: tokenBalances, isLoading }
  }, [account, validatedTokens, balancesCallState, isLoading])
}
