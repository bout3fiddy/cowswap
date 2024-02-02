import { useCallback, useMemo } from 'react'

import EtherscanImage from '@cowprotocol/assets/cow-swap/etherscan-icon.svg'
import { GP_VAULT_RELAYER, TokenWithLogo } from '@cowprotocol/common-const'
import { useTheme } from '@cowprotocol/common-hooks'
import { getBlockExplorerUrl } from '@cowprotocol/common-utils'
import { SupportedChainId as ChainId } from '@cowprotocol/cow-sdk'
import { useAreThereTokensWithSameSymbol } from '@cowprotocol/tokens'
import { TokenAmount, TokenSymbol, Loader, TokenName } from '@cowprotocol/ui'
import { useWalletInfo } from '@cowprotocol/wallet'
import { CurrencyAmount, MaxUint256, Token } from '@uniswap/sdk-core'

import SVG from 'react-inlinesvg'
import { Link } from 'react-router-dom'

import { useErrorModal } from 'legacy/hooks/useErrorMessageAndModal'

import { parameterizeTradeRoute } from 'modules/trade/utils/parameterizeTradeRoute'

import { Routes } from 'common/constants/routes'
import { useApproveCallback } from 'common/hooks/useApproveCallback'
import { ApprovalState, useApproveState } from 'common/hooks/useApproveState'
import { CardsSpinner, ExtLink } from 'pages/Account/styled'

import BalanceCell from './BalanceCell'
import FavouriteTokenButton from './FavouriteTokenButton'
import { FiatBalanceCell } from './FiatBalanceCell'
import {
  ApproveLabel,
  BalanceValue,
  Cell,
  CustomLimit,
  IndexNumber,
  ResponsiveLogo,
  TableButton,
  TokenText,
} from './styled'

type DataRowParams = {
  tokenData: TokenWithLogo
  index: number
  balance?: CurrencyAmount<Token> | undefined
  openApproveModal: (tokenSymbol?: string) => void
  closeApproveModal: () => void
  toggleWalletModal: () => void
}

export const TokensTableRow = ({
  tokenData,
  index,
  balance,
  closeApproveModal,
  openApproveModal,
  toggleWalletModal,
}: DataRowParams) => {
  const { account, chainId = ChainId.MAINNET } = useWalletInfo()
  const areThereTokensWithSameSymbol = useAreThereTokensWithSameSymbol()

  const theme = useTheme()
  const tradeLink = useCallback(
    ({ symbol, address }: Token) => {
      const inputCurrencyId = areThereTokensWithSameSymbol(symbol) ? address : symbol

      return parameterizeTradeRoute(
        { chainId: chainId.toString(), inputCurrencyId, outputCurrencyId: undefined },
        Routes.SWAP
      )
    },
    [areThereTokensWithSameSymbol, chainId]
  )

  const { handleSetError, handleCloseError } = useErrorModal()

  const vaultRelayer = chainId ? GP_VAULT_RELAYER[chainId] : undefined
  const amountToApprove = CurrencyAmount.fromRawAmount(tokenData, MaxUint256)

  const { state: approvalState, currentAllowance } = useApproveState(amountToApprove)
  const approveCallback = useApproveCallback(amountToApprove, vaultRelayer)

  const handleApprove = useCallback(async () => {
    handleCloseError()

    if (!account) {
      toggleWalletModal()
      return
    }

    // TODO: make a separate hook out of this and add GA
    try {
      openApproveModal(tokenData?.symbol)
      await approveCallback(`Approve ${tokenData?.symbol || 'token'}`)
    } catch (error: any) {
      console.error(`[TokensTableRow]: Issue approving.`, error)
      handleSetError(error?.message)
    } finally {
      closeApproveModal()
    }
  }, [
    account,
    approveCallback,
    handleCloseError,
    handleSetError,
    toggleWalletModal,
    tokenData?.symbol,
    openApproveModal,
    closeApproveModal,
  ])

  const hasZeroBalance = !balance || balance?.equalTo(0)

  // This is so we only create fiat value request if there is a balance
  const fiatValue = useMemo(() => {
    if (!balance && account) {
      return <Loader stroke={theme.text3} />
    } else if (hasZeroBalance) {
      return <BalanceValue hasBalance={false}>0</BalanceValue>
    } else {
      return <FiatBalanceCell balance={balance} />
    }
  }, [account, balance, hasZeroBalance, theme])

  const displayApproveContent = useMemo(() => {
    if (approvalState === ApprovalState.APPROVED) {
      return <ApproveLabel>Approved ✓</ApproveLabel>
    }

    if (approvalState === ApprovalState.NOT_APPROVED) {
      if (!currentAllowance || currentAllowance.equalTo(0)) {
        return <TableButton onClick={handleApprove}>Approve</TableButton>
      }

      return (
        <CustomLimit>
          <TableButton onClick={handleApprove}>Approve all</TableButton>
          <ApproveLabel>
            Approved:{' '}
            <strong>
              <TokenAmount amount={currentAllowance} />
            </strong>
          </ApproveLabel>
        </CustomLimit>
      )
    }

    return <CardsSpinner />
  }, [currentAllowance, handleApprove, approvalState])

  return (
    <>
      <Cell>
        <FavouriteTokenButton tokenData={tokenData} />
        <IndexNumber>{index + 1}</IndexNumber>
      </Cell>

      <Cell>
        <Link to={tradeLink(tokenData)}>
          <ResponsiveLogo token={tokenData} size={28} />
          <TokenText>
            <span>
              <b>
                <TokenSymbol token={tokenData} />
              </b>
              <i>
                <TokenName token={tokenData} />
              </i>
            </span>
          </TokenText>
        </Link>
      </Cell>

      <Cell>
        <BalanceCell balance={balance} />
      </Cell>

      <Cell>{fiatValue}</Cell>

      <Cell>
        <ExtLink href={getBlockExplorerUrl(chainId, 'token', tokenData.address)}>
          <TableButton>
            <SVG src={EtherscanImage} title="View token contract" description="View token contract" />
          </TableButton>
        </ExtLink>
        {displayApproveContent}
      </Cell>
    </>
  )
}
