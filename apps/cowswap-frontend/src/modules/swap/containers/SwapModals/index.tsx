import React from 'react'

import { genericPropsChecker } from '@cowprotocol/common-utils'

import { ConfirmSwapModalSetup, ConfirmSwapModalSetupProps } from 'modules/swap/containers/ConfirmSwapModalSetup'
import { EthFlowModal, EthFlowProps } from 'modules/swap/containers/EthFlow'

import { SurplusModalSetup } from '../SurplusModalSetup'

export interface SwapModalsProps {
  showNativeWrapModal: boolean
  showCowSubsidyModal: boolean
  confirmSwapProps: ConfirmSwapModalSetupProps
  ethFlowProps: EthFlowProps
}

export const SwapModals = React.memo(function (props: SwapModalsProps) {
  const { showNativeWrapModal, confirmSwapProps, ethFlowProps } = props

  return (
    <>
      {/* TODO: Re-enable modal once subsidy is back  */}
      {/*<CowSubsidyModal isOpen={showCowSubsidyModal} onDismiss={closeModals} /> */}
      {<ConfirmSwapModalSetup {...confirmSwapProps} />}
      {showNativeWrapModal && <EthFlowModal {...ethFlowProps} />}
      {!showNativeWrapModal && <SurplusModalSetup />}
    </>
  )
}, genericPropsChecker)
