/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "./common";

export interface ArgentWalletContractInterface extends utils.Interface {
  functions: {
    "wc_multiCall((address,uint256,bytes)[])": FunctionFragment;
    "isValidSignature(bytes32,bytes)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic: "wc_multiCall" | "isValidSignature"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "wc_multiCall",
    values: [
      {
        to: PromiseOrValue<string>;
        value: PromiseOrValue<BigNumberish>;
        data: PromiseOrValue<BytesLike>;
      }[]
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "isValidSignature",
    values: [PromiseOrValue<BytesLike>, PromiseOrValue<BytesLike>]
  ): string;

  decodeFunctionResult(
    functionFragment: "wc_multiCall",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isValidSignature",
    data: BytesLike
  ): Result;

  events: {};
}

export interface ArgentWalletContract extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: ArgentWalletContractInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    wc_multiCall(
      _transactions: {
        to: PromiseOrValue<string>;
        value: PromiseOrValue<BigNumberish>;
        data: PromiseOrValue<BytesLike>;
      }[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    isValidSignature(
      _msgHash: PromiseOrValue<BytesLike>,
      _signature: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<[string]>;
  };

  wc_multiCall(
    _transactions: {
      to: PromiseOrValue<string>;
      value: PromiseOrValue<BigNumberish>;
      data: PromiseOrValue<BytesLike>;
    }[],
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  isValidSignature(
    _msgHash: PromiseOrValue<BytesLike>,
    _signature: PromiseOrValue<BytesLike>,
    overrides?: CallOverrides
  ): Promise<string>;

  callStatic: {
    wc_multiCall(
      _transactions: {
        to: PromiseOrValue<string>;
        value: PromiseOrValue<BigNumberish>;
        data: PromiseOrValue<BytesLike>;
      }[],
      overrides?: CallOverrides
    ): Promise<string[]>;

    isValidSignature(
      _msgHash: PromiseOrValue<BytesLike>,
      _signature: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<string>;
  };

  filters: {};

  estimateGas: {
    wc_multiCall(
      _transactions: {
        to: PromiseOrValue<string>;
        value: PromiseOrValue<BigNumberish>;
        data: PromiseOrValue<BytesLike>;
      }[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    isValidSignature(
      _msgHash: PromiseOrValue<BytesLike>,
      _signature: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    wc_multiCall(
      _transactions: {
        to: PromiseOrValue<string>;
        value: PromiseOrValue<BigNumberish>;
        data: PromiseOrValue<BytesLike>;
      }[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    isValidSignature(
      _msgHash: PromiseOrValue<BytesLike>,
      _signature: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
