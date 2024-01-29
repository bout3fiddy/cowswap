import { useAtomValue } from 'jotai'
import { useAtom } from 'jotai/index'
import React, { ReactNode, useEffect } from 'react'

import { PriorityTokensUpdater } from '@cowprotocol/balances-and-allowances'
import { maxAmountSpend } from '@cowprotocol/common-utils'
import { isInjectedWidget } from '@cowprotocol/common-utils'
import { useIsSafeWallet, useWalletDetails, useWalletInfo } from '@cowprotocol/wallet'

import { t } from '@lingui/macro'

import { AccountElement } from 'legacy/components/Header/AccountElement'
import { PriceImpact } from 'legacy/hooks/usePriceImpact'

import { TradeWidgetLinks } from 'modules/application/containers/TradeWidgetLinks'
import { SetRecipientProps } from 'modules/swap/containers/SetRecipient'
import { SelectTokenWidget, useOpenTokenSelectWidget } from 'modules/tokensList'
import { useIsWrapOrUnwrap } from 'modules/trade/hooks/useIsWrapOrUnwrap'
import { RecipientAddressUpdater } from 'modules/trade/updaters/RecipientAddressUpdater'
import { TradeFormValidationUpdater } from 'modules/tradeFormValidation'
import { TradeQuoteUpdater } from 'modules/tradeQuote'

import { TradeApproveModal } from 'common/containers/TradeApprove'
import { tradeApproveStateAtom } from 'common/containers/TradeApprove/tradeApproveStateAtom'
import { useCategorizeRecentActivity } from 'common/hooks/useCategorizeRecentActivity'
import { useIsProviderNetworkUnsupported } from 'common/hooks/useIsProviderNetworkUnsupported'
import { useThrottleFn } from 'common/hooks/useThrottleFn'
import { CurrencyArrowSeparator } from 'common/pure/CurrencyArrowSeparator'
import { CurrencyInputPanel, CurrencyInputPanelProps } from 'common/pure/CurrencyInputPanel'
import { CurrencyInfo } from 'common/pure/CurrencyInputPanel/types'
import { PoweredFooter } from 'common/pure/PoweredFooter'

import * as styledEl from './styled'
import { TradeWidgetModals } from './TradeWidgetModals'

import { selectTokenWidgetAtom } from '../../../tokensList/state/selectTokenWidgetAtom'
import { usePriorityTokenAddresses } from '../../hooks/usePriorityTokenAddresses'
import { tradeConfirmStateAtom } from '../../state/tradeConfirmStateAtom'
import { wrapNativeStateAtom } from '../../state/wrapNativeStateAtom'
import { CommonTradeUpdater } from '../../updaters/CommonTradeUpdater'
import { DisableNativeTokenSellingUpdater } from '../../updaters/DisableNativeTokenSellingUpdater'
import { PriceImpactUpdater } from '../../updaters/PriceImpactUpdater'
import { WrapFlowActionButton } from '../WrapFlowActionButton'
import { WrapNativeModal } from '../WrapNativeModal'

export interface TradeWidgetActions {
  onCurrencySelection: CurrencyInputPanelProps['onCurrencySelection']
  onUserInput: CurrencyInputPanelProps['onUserInput']
  onChangeRecipient: SetRecipientProps['onChangeRecipient']
  onSwitchTokens(): void
}

interface TradeWidgetParams {
  recipient: string | null
  isEoaEthFlow?: boolean
  compactView: boolean
  showRecipient: boolean
  isTradePriceUpdating: boolean
  isExpertMode: boolean
  priceImpact: PriceImpact
  disableQuotePolling?: boolean
  disableNativeSelling?: boolean
  disablePriceImpact: boolean
}

export interface TradeWidgetSlots {
  settingsWidget: ReactNode
  lockScreen?: ReactNode
  middleContent?: ReactNode
  bottomContent?: ReactNode
  outerContent?: ReactNode
  updaters?: ReactNode
}

export interface TradeWidgetProps {
  id?: string
  slots: TradeWidgetSlots
  inputCurrencyInfo: CurrencyInfo
  outputCurrencyInfo: CurrencyInfo
  actions: TradeWidgetActions
  params: TradeWidgetParams
  disableOutput?: boolean
  children?: ReactNode
}

export const TradeWidgetContainer = styledEl.Container

export function TradeWidget(props: TradeWidgetProps) {
  const {
    id,
    slots,
    inputCurrencyInfo,
    outputCurrencyInfo,
    actions,
    params,
    disableOutput,
    children: confirmModal,
  } = props
  const { settingsWidget, lockScreen, middleContent, bottomContent, outerContent, updaters } = slots

  const { onCurrencySelection, onUserInput, onSwitchTokens, onChangeRecipient } = actions
  const {
    compactView,
    showRecipient,
    isTradePriceUpdating,
    isEoaEthFlow = false,
    priceImpact,
    recipient,
    disableQuotePolling = false,
    isExpertMode,
    disableNativeSelling = false,
    disablePriceImpact,
  } = params

  const { chainId, account } = useWalletInfo()
  const isWrapOrUnwrap = useIsWrapOrUnwrap()
  const { allowsOffchainSigning } = useWalletDetails()
  const isChainIdUnsupported = useIsProviderNetworkUnsupported()
  const isSafeWallet = useIsSafeWallet()
  const openTokenSelectWidget = useOpenTokenSelectWidget()
  const priorityTokenAddresses = usePriorityTokenAddresses()

  const { isOpen: isTradeReviewOpen } = useAtomValue(tradeConfirmStateAtom)
  const { open: isTokenSelectOpen } = useAtomValue(selectTokenWidgetAtom)
  const [{ isOpen: isWrapNativeOpen }] = useAtom(wrapNativeStateAtom)
  const [{ approveInProgress, currency: approvingCurrency }] = useAtom(tradeApproveStateAtom)

  const areCurrenciesLoading = !inputCurrencyInfo.currency && !outputCurrencyInfo.currency
  const bothCurrenciesSet = !!inputCurrencyInfo.currency && !!outputCurrencyInfo.currency

  const canSellAllNative = isSafeWallet
  const maxBalance = maxAmountSpend(inputCurrencyInfo.balance || undefined, canSellAllNative)
  const showSetMax = maxBalance?.greaterThan(0) && !inputCurrencyInfo.amount?.equalTo(maxBalance)

  // Disable too frequent tokens switching
  const throttledOnSwitchTokens = useThrottleFn(onSwitchTokens, 500)

  const currencyInputCommonProps = {
    isChainIdUnsupported,
    chainId,
    areCurrenciesLoading,
    bothCurrenciesSet,
    onCurrencySelection,
    onUserInput,
    allowsOffchainSigning,
    openTokenSelectWidget,
  }

  /**
   * Reset recipient value only once at App start
   */
  useEffect(() => {
    onChangeRecipient(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const isInjectedWidgetMode = isInjectedWidget()

  const { pendingActivity } = useCategorizeRecentActivity()

  const isNextWidgetOpen = isTradeReviewOpen || isTokenSelectOpen || isWrapNativeOpen || approveInProgress

  return (
    <>
      <styledEl.Container id={id}>
        <PriorityTokensUpdater account={account} chainId={chainId} tokenAddresses={priorityTokenAddresses} />
        <RecipientAddressUpdater />

        {!disableQuotePolling && <TradeQuoteUpdater />}
        <TradeWidgetModals />
        <PriceImpactUpdater />
        <TradeFormValidationUpdater isExpertMode={isExpertMode} />
        <CommonTradeUpdater />
        {disableNativeSelling && <DisableNativeTokenSellingUpdater />}
        {updaters}

        <styledEl.Container>
          {isTradeReviewOpen && confirmModal}
          {isTokenSelectOpen && <SelectTokenWidget />}
          {isWrapNativeOpen && <WrapNativeModal />}
          {approveInProgress && <TradeApproveModal currency={approvingCurrency} />}

          {!isNextWidgetOpen && (
            <>
              <styledEl.ContainerBox>
                <styledEl.Header>
                  <TradeWidgetLinks isDropdown={isInjectedWidgetMode} />
                  {isInjectedWidgetMode && (
                    <AccountElement isWidgetMode={isInjectedWidgetMode} pendingActivities={pendingActivity} />
                  )}
                  {!lockScreen && settingsWidget}
                </styledEl.Header>

                {lockScreen ? (
                  lockScreen
                ) : (
                  <>
                    <div>
                      <CurrencyInputPanel
                        id="input-currency-input"
                        currencyInfo={inputCurrencyInfo}
                        showSetMax={showSetMax}
                        maxBalance={maxBalance}
                        topLabel={isWrapOrUnwrap ? undefined : inputCurrencyInfo.label}
                        {...currencyInputCommonProps}
                      />
                    </div>
                    {!isWrapOrUnwrap && middleContent}
                    <styledEl.CurrencySeparatorBox
                      compactView={compactView}
                      withRecipient={!isWrapOrUnwrap && showRecipient}
                    >
                      <CurrencyArrowSeparator
                        isCollapsed={compactView}
                        hasSeparatorLine={!compactView}
                        border={!compactView}
                        onSwitchTokens={isChainIdUnsupported ? () => void 0 : throttledOnSwitchTokens}
                        withRecipient={!isWrapOrUnwrap && showRecipient}
                        isLoading={isTradePriceUpdating}
                      />
                    </styledEl.CurrencySeparatorBox>
                    <div>
                      <CurrencyInputPanel
                        id="output-currency-input"
                        inputDisabled={isEoaEthFlow || isWrapOrUnwrap || disableOutput}
                        inputTooltip={
                          isEoaEthFlow
                            ? t`You cannot edit this field when selling ${inputCurrencyInfo?.currency?.symbol}`
                            : undefined
                        }
                        currencyInfo={
                          isWrapOrUnwrap
                            ? { ...outputCurrencyInfo, amount: inputCurrencyInfo.amount }
                            : outputCurrencyInfo
                        }
                        priceImpactParams={!disablePriceImpact ? priceImpact : undefined}
                        topLabel={isWrapOrUnwrap ? undefined : outputCurrencyInfo.label}
                        {...currencyInputCommonProps}
                      />
                    </div>
                    {!isWrapOrUnwrap && showRecipient && (
                      <styledEl.StyledRemoveRecipient
                        recipient={recipient || ''}
                        onChangeRecipient={onChangeRecipient}
                      />
                    )}

                    {isWrapOrUnwrap ? <WrapFlowActionButton /> : bottomContent}
                  </>
                )}

                {isInjectedWidgetMode && <PoweredFooter />}
              </styledEl.ContainerBox>
              <styledEl.OuterContentWrapper>{outerContent}</styledEl.OuterContentWrapper>
            </>
          )}
        </styledEl.Container>
      </styledEl.Container>
    </>
  )
}
