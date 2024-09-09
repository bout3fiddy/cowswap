import { SigningScheme } from '@cowprotocol/contracts/src/ts/sign'
import { CowHook } from '@cowprotocol/types'
import type { Signer } from '@ethersproject/abstract-signer'
import { MaxUint256 } from '@ethersproject/constants'

import { ethers } from 'ethers'

import { COW_SHED_FACTORY_ADDRESS, OMNIBRIDGE_ADDRESS, WEIROLL_ADDRESS } from './consts'

import { CowShedHooks } from '../../cowShed'
import {
  CallType,
  encodeCommand,
  encodeFlag,
  encodeInput,
  encodeInputArg,
  encodeWeirollExecuteCall,
  END_OF_ARGS,
  fnCalldata,
  fnSelector,
} from '../../weiroll'

const ABI_CODER = ethers.utils.defaultAbiCoder

export interface ICall {
  target: string
  value: bigint
  callData: string
  allowFailure: boolean
  isDelegateCall: boolean
}

interface HookParams {
  proxyAddress: string
  tokenAddress: string
  validTo: number
  signer: Signer
  cowShed: CowShedHooks
}

export async function buildOmnibridgePostHook({
  cowShed,
  proxyAddress,
  tokenAddress,
  validTo,
  signer,
}: HookParams): Promise<CowHook> {
  // weiroll required since swap output amount is not known
  // at tx time. need to fetch it at execution time.
  const balanceOfCommand = encodeCommand(
    fnSelector('balanceOf(address)'),
    // it should be a static call
    encodeFlag(false, false, CallType.StaticCall),
    encodeInput(
      // balanceOf takes one arg, the address whose balance is being queried
      // it is fixed length input, and stored at state index 0
      encodeInputArg(true, 0),
      // all remainder args are unused
      END_OF_ARGS,
      END_OF_ARGS,
      END_OF_ARGS,
      END_OF_ARGS,
      END_OF_ARGS,
    ),
    // this tells the VM that the output of balanceOf is also
    // of fixed length and that it should store it in state index 1
    encodeInputArg(true, 1),
    // target address, this is whats called
    tokenAddress,
  )
  const relayTokensCommand = encodeCommand(
    fnSelector('relayTokens(address,address,uint256)'),
    // it is a Call
    encodeFlag(false, false, CallType.Call),
    encodeInput(
      // token address, fixed length input, read from state index 2
      encodeInputArg(true, 2),
      // user address, fixed length input, read from state index 0
      encodeInputArg(true, 0), // user address
      // balance, fixed length input, read from state index 1, this is where
      // previous command stored it
      encodeInputArg(true, 1), // balance
      // other 3 input args are unused
      END_OF_ARGS,
      END_OF_ARGS,
      END_OF_ARGS,
    ),
    // this commands output is not used/important, hence ignored
    END_OF_ARGS,
    // target address, this is whats called
    OMNIBRIDGE_ADDRESS,
  )
  const weirollCommands = [
    balanceOfCommand,
    // bridge relay tokens call
    relayTokensCommand,
  ]

  const state = [
    ethers.utils.hexZeroPad(proxyAddress, 32), // address to query the balance of
    '0x', // this is where balance output will be written
    ethers.utils.hexZeroPad(tokenAddress, 32), // USDC token address, used in relayTokens call argument
  ]

  // post hooks
  const calls: ICall[] = [
    // approve the bridge to spend the swapped usdc
    {
      target: tokenAddress,
      callData: fnCalldata(
        'approve(address,uint256)',
        ABI_CODER.encode(['address', 'uint256'], [OMNIBRIDGE_ADDRESS, MaxUint256]),
      ),
      value: 0n,
      isDelegateCall: false,
      allowFailure: false,
    },
    // bridge the full output by using weiroll
    {
      target: WEIROLL_ADDRESS,
      callData: encodeWeirollExecuteCall(weirollCommands, state),
      value: 0n,
      isDelegateCall: true,
      allowFailure: false,
    },
  ]
  const nonce = ethers.utils.formatBytes32String('1')

  // signing the hooks intent
  // TODO: support sc wallets
  const encodedSignature = await cowShed.signCalls(calls, nonce, BigInt(validTo), signer, SigningScheme.EIP712)

  const hooksCalldata = cowShed.encodeExecuteHooksForFactory(
    calls,
    nonce,
    BigInt(validTo),
    await signer.getAddress(),
    encodedSignature,
  )

  // TODO: add estimation
  const gasLimit = '300000'

  return { target: COW_SHED_FACTORY_ADDRESS, callData: hooksCalldata, gasLimit }
}
