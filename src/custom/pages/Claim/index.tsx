import { useCallback, useEffect, useMemo } from 'react'
import { useActiveWeb3React } from 'hooks/web3'
import { useUserEnhancedClaimData, useUserUnclaimedAmount, useClaimCallback, ClaimInput } from 'state/claim/hooks'
import { PageWrapper, InnerPageWrapper } from 'pages/Claim/styled'
import EligibleBanner from './EligibleBanner'
import { getFreeClaims, hasPaidClaim, hasFreeClaim, prepareInvestClaims } from 'state/claim/hooks/utils'
import { useWalletModalToggle } from 'state/application/hooks'
import Confetti from 'components/Confetti'

import useENS from 'hooks/useENS'

import ClaimNav from './ClaimNav'
import { ClaimSummary } from './ClaimSummary'
import ClaimAddress from './ClaimAddress'
import CanUserClaimMessage from './CanUserClaimMessage'
import ClaimingStatus from './ClaimingStatus'
import ClaimsTable from './ClaimsTable'
import InvestmentFlow from './InvestmentFlow'

import { useClaimDispatchers, useClaimState } from 'state/claim/hooks'
import { ClaimStatus } from 'state/claim/actions'

import { OperationType } from 'components/TransactionConfirmationModal'
import useTransactionConfirmationModal from 'hooks/useTransactionConfirmationModal'

import { useErrorModal } from 'hooks/useErrorMessageAndModal'
import FooterNavButtons from './FooterNavButtons'
import ClaimsOnOtherChainsBanner from './ClaimsOnOtherChainsBanner'
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'

/* TODO: Replace URLs with the actual final URL destinations */
export const COW_LINKS = {
  vCowPost: 'https://cow.fi/',
  stepGuide: 'https://cow.fi/',
}

export default function Claim() {
  const { account, chainId } = useActiveWeb3React()
  const { error } = useWeb3React()

  const {
    // address/ENS address
    inputAddress,
    // account
    activeClaimAccount,
    // check address
    isSearchUsed,
    // claiming
    claimStatus,
    // investment
    investFlowStep,
    // table select change
    selected,
    // investFlowData
    investFlowData,
  } = useClaimState()

  const {
    // account
    setInputAddress,
    setActiveClaimAccount,
    setActiveClaimAccountENS,
    // search
    setIsSearchUsed,
    // claiming
    setClaimStatus,
    setClaimedAmount,
    setEstimatedGas,
    // investing
    setIsInvestFlowActive,
    // claim row selection
    setSelected,
    // reset claim ui
    resetClaimUi,
  } = useClaimDispatchers()

  // addresses
  const { address: resolvedAddress, name: resolvedENS } = useENS(inputAddress)

  // toggle wallet when disconnected
  const toggleWalletModal = useWalletModalToggle()
  // error handling modals
  const { handleCloseError, handleSetError, ErrorModal } = useErrorModal()

  // get user claim data
  const userClaimData = useUserEnhancedClaimData(activeClaimAccount)

  // get total unclaimed amount
  const unclaimedAmount = useUserUnclaimedAmount(activeClaimAccount)

  const hasClaims = useMemo(() => userClaimData.length > 0, [userClaimData])
  const isAirdropOnly = useMemo(() => !hasPaidClaim(userClaimData), [userClaimData])
  const isPaidClaimsOnly = useMemo(() => hasPaidClaim(userClaimData) && !hasFreeClaim(userClaimData), [userClaimData])

  // claim callback
  const { claimCallback, estimateGasCallback } = useClaimCallback(activeClaimAccount)

  // reset claim state
  const resetClaimState = useCallback(() => {
    setClaimStatus(ClaimStatus.DEFAULT)
    setActiveClaimAccount('')
    setActiveClaimAccountENS('')
    setSelected([])
  }, [setActiveClaimAccount, setClaimStatus, setSelected])

  // handle change account
  const handleChangeAccount = () => {
    resetClaimState()
    setIsSearchUsed(true)
  }

  // check claim
  const handleCheckClaim = () => {
    setActiveClaimAccount(resolvedAddress || '')
    setActiveClaimAccountENS(resolvedENS || '')
    setInputAddress('')
  }

  // aggregate the input for claim callback
  const claimInputData = useMemo(() => {
    const freeClaims = getFreeClaims(userClaimData)
    const paidClaims = prepareInvestClaims(investFlowData, userClaimData)

    const inputData = freeClaims.map(({ index }) => ({ index }))
    return inputData.concat(paidClaims)
  }, [investFlowData, userClaimData])

  // track gas price estimation for given input data
  useEffect(() => {
    estimateGasCallback(claimInputData).then((gas) => setEstimatedGas(gas?.toString() || ''))
  }, [claimInputData, estimateGasCallback, setEstimatedGas])

  // handle submit claim
  const handleSubmitClaim = useCallback(() => {
    // Reset error handling
    handleCloseError()

    // just to be sure
    if (!activeClaimAccount) return

    const sendTransaction = (inputData: ClaimInput[]) => {
      setClaimStatus(ClaimStatus.ATTEMPTING)
      claimCallback(inputData)
        .then((vCowAmount) => {
          setClaimStatus(ClaimStatus.SUBMITTED)
          setClaimedAmount(vCowAmount)
        })
        .catch((error) => {
          setClaimStatus(ClaimStatus.DEFAULT)
          console.error('[Claim::index::handleSubmitClaim]::error', error)
          handleSetError(error?.message)
        })
    }

    // check if there are any selected (paid) claims
    if (!selected.length) {
      console.log('Starting claiming with', claimInputData)
      sendTransaction(claimInputData)
    } else if (investFlowStep == 2) {
      console.log('Starting claiming with', claimInputData)
      sendTransaction(claimInputData)
    } else {
      setIsInvestFlowActive(true)
    }
  }, [
    handleCloseError,
    activeClaimAccount,
    selected.length,
    investFlowStep,
    setClaimStatus,
    claimCallback,
    setClaimedAmount,
    handleSetError,
    claimInputData,
    setIsInvestFlowActive,
  ])

  // on account/activeAccount/non-connected account (if claiming for someone else) change
  useEffect(() => {
    if (!isSearchUsed && account) {
      setActiveClaimAccount(account)
    }

    // handle unsupported network
    if (error instanceof UnsupportedChainIdError) {
      resetClaimState()
    }

    // properly reset the user to the claims table and initial investment flow
    resetClaimUi()
    // Depending on chainId even though it's not used because we want to reset the state on network change
  }, [
    account,
    activeClaimAccount,
    chainId,
    resolvedAddress,
    isSearchUsed,
    setActiveClaimAccount,
    resetClaimUi,
    error,
    resetClaimState,
  ])

  // Transaction confirmation modal
  const { TransactionConfirmationModal, openModal, closeModal } = useTransactionConfirmationModal(
    OperationType.APPROVE_TOKEN
  )

  return (
    <PageWrapper>
      {/* Cross chain claim banner */}
      <ClaimsOnOtherChainsBanner />
      {/* Claiming content */}
      <InnerPageWrapper>
        {/* Approve confirmation modal */}
        <TransactionConfirmationModal />
        {/* Error modal */}
        <ErrorModal />
        {/* If claim is confirmed > trigger confetti effect */}
        <Confetti start={claimStatus === ClaimStatus.CONFIRMED} />
        {/* Top nav buttons */}
        <ClaimNav account={account} handleChangeAccount={handleChangeAccount} />
        {/* Show general title OR total to claim (user has airdrop or airdrop+investment) --------------------------- */}
        <EligibleBanner hasClaims={hasClaims} />
        {/* Show total to claim (user has airdrop or airdrop+investment) */}
        <ClaimSummary hasClaims={hasClaims} unclaimedAmount={unclaimedAmount} />
        {/* Get address/ENS (user not connected yet or opted for checking 'another' account) */}
        <ClaimAddress account={account} toggleWalletModal={toggleWalletModal} />
        {/* Is Airdrop only (simple) - does user have claims? Show messages dependent on claim state */}
        <CanUserClaimMessage
          hasClaims={hasClaims}
          isAirdropOnly={isAirdropOnly}
          handleChangeAccount={handleChangeAccount}
        />

        {/* Try claiming or inform successful claim */}
        <ClaimingStatus />
        {/* IS Airdrop + investing (advanced) */}
        <ClaimsTable isAirdropOnly={isAirdropOnly} hasClaims={hasClaims} />
        {/* Investing vCOW flow (advanced) */}
        <InvestmentFlow isAirdropOnly={isAirdropOnly} hasClaims={hasClaims} modalCbs={{ openModal, closeModal }} />

        <FooterNavButtons
          handleCheckClaim={handleCheckClaim}
          handleSubmitClaim={handleSubmitClaim}
          toggleWalletModal={toggleWalletModal}
          isAirdropOnly={isAirdropOnly}
          isPaidClaimsOnly={isPaidClaimsOnly}
          hasClaims={hasClaims}
          resolvedAddress={resolvedAddress}
        />
      </InnerPageWrapper>
    </PageWrapper>
  )
}
