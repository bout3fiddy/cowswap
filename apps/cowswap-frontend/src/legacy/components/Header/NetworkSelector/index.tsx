import { useRef } from 'react'

import { getChainInfo } from '@cowprotocol/common-const'
import { UI } from '@cowprotocol/ui'
import { getIsTallyWallet, useIsSmartContractWallet, useWalletInfo } from '@cowprotocol/wallet'
import { useWeb3React } from '@web3-react/core'

import { Trans } from '@lingui/macro'
import { darken, transparentize } from 'color2k'
import { AlertTriangle, ChevronDown } from 'react-feather'
import styled from 'styled-components/macro'

import { useCloseModal, useModalIsOpen, useOpenModal, useToggleModal } from 'legacy/state/application/hooks'
import { ApplicationModal } from 'legacy/state/application/reducer'

import { useIsProviderNetworkUnsupported } from 'common/hooks/useIsProviderNetworkUnsupported'
import { useOnSelectNetwork } from 'common/hooks/useOnSelectNetwork'
import { NetworksList } from 'common/pure/NetworksList'
import { Media } from '@cowprotocol/ui'
import { tr } from 'make-plural'

const FlyoutHeader = styled.div`
  color: inherit;
  font-weight: 400;
`

const FlyoutMenu = styled.div`
  ${Media.MediumAndUp()} {
    position: absolute;
    width: 272px;
    z-index: 99;
    padding-top: 10px;
    top: 38px;
    right: 0;
  }
`

const FlyoutMenuContents = styled.div`
  align-items: flex-start;
  background-color: var(${UI.COLOR_PAPER});
  border: 1px solid var(${UI.COLOR_PAPER_DARKEST});
  box-shadow: var(${UI.BOX_SHADOW});
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  font-size: 16px;
  overflow: auto;
  min-width: 175px;
  z-index: 99;
  padding: 16px;

  ${Media.upToMedium()} {
    bottom: 56px;
    left: 0;
    position: fixed;
    width: 100%;
    border-radius: 12px 12px 0 0;
    box-shadow: 0 -100vh 0 100vh ${transparentize('black', 0.4)};
  }

  & > *:not(:last-child) {
    margin-bottom: 5px;
  }
`
const SelectorLabel = styled.div`
  display: block;
  flex: 1 1 auto;
  margin: 0;
  white-space: nowrap;

  ${Media.upToExtraSmall()} {
    display: none;
  }
`
const SelectorControls = styled.div<{ isChainIdUnsupported: boolean }>`
  align-items: center;
  color: inherit;
  display: flex;
  font-weight: 500;
  justify-content: space-between;
  gap: 6px;

  &:focus {
    background-color: ${({ theme }) => darken(theme.red1, 0.1)};
  }

  border-radius: 21px;
  border: 2px solid transparent;
  padding: 6px;
  transition: border var(${UI.ANIMATION_DURATION}) ease-in-out;
  background: transparent;

  &:hover {
    border: 2px solid ${({ theme }) => transparentize(theme.text, 0.7)};
  }

  ${({ isChainIdUnsupported, theme }) =>
    isChainIdUnsupported &&
    `
      color: ${theme.danger}!important;
      background: ${transparentize(theme.danger, 0.85)}!important;
      border: 2px solid ${transparentize(theme.danger, 0.5)}!important;
    `}
`
const SelectorLogo = styled.img<{ interactive?: boolean }>`
  --size: 24px;
  width: var(--size);
  height: var(--size);
  margin-right: ${({ interactive }) => (interactive ? 8 : 0)}px;
  object-fit: contain;

  ${Media.upToExtraSmall()} {
    --size: 21px;
  }
`
const SelectorWrapper = styled.div`
  display: flex;
  cursor: pointer;

  ${Media.MediumAndUp()} {
    position: relative;
  }
`
const StyledChevronDown = styled(ChevronDown)`
  width: 21px;
  height: 21px;
  margin: 0 0 0 -3px;
  object-fit: contain;
`
const NetworkIcon = styled(AlertTriangle)`
  margin-left: 0.25rem;
  margin-right: 0.25rem;
  width: 16px;
  height: 16px;
`
const NetworkAlertLabel = styled.div`
  flex: 1 1 auto;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0 0.5rem 0 0.4rem;
  font-size: 1rem;
  width: fit-content;
  font-weight: 500;
`

export function NetworkSelector() {
  const { provider } = useWeb3React()
  const { chainId } = useWalletInfo()
  const node = useRef<HTMLDivElement>(null)
  const isOpen = useModalIsOpen(ApplicationModal.NETWORK_SELECTOR)
  const openModal = useOpenModal(ApplicationModal.NETWORK_SELECTOR)
  const closeModal = useCloseModal(ApplicationModal.NETWORK_SELECTOR)
  const toggleModal = useToggleModal(ApplicationModal.NETWORK_SELECTOR)
  const isSmartContractWallet = useIsSmartContractWallet()
  const isTallyWallet = getIsTallyWallet(provider?.provider)
  const isChainIdUnsupported = useIsProviderNetworkUnsupported()
  const info = getChainInfo(chainId)

  const onSelectChain = useOnSelectNetwork()

  if (!chainId || !provider || isSmartContractWallet || isTallyWallet) {
    return null
  }

  return (
    <SelectorWrapper ref={node} onClick={toggleModal}>
      <SelectorControls isChainIdUnsupported={isChainIdUnsupported}>
        {!isChainIdUnsupported ? (
          <>
            <SelectorLogo src={info?.logoUrl} />
            <SelectorLabel>{info?.label}</SelectorLabel>
            <StyledChevronDown />
          </>
        ) : (
          <>
            <NetworkIcon />
            <NetworkAlertLabel>Switch Network</NetworkAlertLabel>
            <StyledChevronDown />
          </>
        )}
      </SelectorControls>
      {isOpen && (
        <FlyoutMenu>
          <FlyoutMenuContents>
            <FlyoutHeader>
              <Trans>Select a network</Trans>
            </FlyoutHeader>
            <NetworksList currentChainId={isChainIdUnsupported ? null : chainId} onSelectChain={onSelectChain} />
          </FlyoutMenuContents>
        </FlyoutMenu>
      )}
    </SelectorWrapper>
  )
}
