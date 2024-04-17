import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { useNativeTokensBalances } from '@cowprotocol/balances-and-allowances'
import { NATIVE_CURRENCIES } from '@cowprotocol/common-const'
import { useAddSnackbar } from '@cowprotocol/snackbars'
import { hwAccountIndexAtom, AccountIndexSelect, useWalletInfo, WalletAccountsLoader } from '@cowprotocol/wallet'
import { Currency, CurrencyAmount } from '@uniswap/sdk-core'
import { useWalletInfo as useWeb3WalletInfo } from '@web3modal/ethers5/react'

import { Trans } from '@lingui/macro'

import { CowModal } from 'common/pure/Modal'

import { accountSelectorModalAtom, toggleAccountSelectorModalAtom } from './state'
import * as styledEl from './styled'

const EMPTY_BALANCES = {}

export function AccountSelectorModal() {
  const { chainId } = useWalletInfo()
  const { isOpen } = useAtomValue(accountSelectorModalAtom)
  const closeModal = useSetAtom(toggleAccountSelectorModalAtom)

  const [hwAccountIndex, setHwAccountIndex] = useAtom(hwAccountIndexAtom)
  const addSnackbar = useAddSnackbar()
  const { walletInfo } = useWeb3WalletInfo()

  const nativeToken = NATIVE_CURRENCIES[chainId]

  const walletIcon = walletInfo?.icon
  const walletName = walletInfo?.name

  // TODO: FIXME
  // const accountsLoader = useMemo(() => accountsLoaders[connectionType as HardWareWallet], [connectionType])
  const accountsLoader: WalletAccountsLoader | undefined = undefined as unknown as WalletAccountsLoader

  const [accountsList, setAccountsList] = useState<string[] | null>(null)

  const nativeTokensBalances = useNativeTokensBalances(accountsList || undefined)

  const balances = useMemo(() => {
    if (!nativeTokensBalances) return EMPTY_BALANCES

    return Object.keys(nativeTokensBalances).reduce<{ [account: string]: CurrencyAmount<Currency> | undefined }>(
      (acc, key) => {
        const balance = nativeTokensBalances[key]

        if (balance) {
          acc[key] = CurrencyAmount.fromRawAmount(nativeToken, balance.toString())
        }
        return acc
      },
      {}
    )
  }, [nativeTokensBalances, nativeToken])

  const loadMoreAccounts = useCallback(async () => {
    if (!accountsLoader) return

    return accountsLoader.loadMoreAccounts().then(() => {
      setAccountsList(accountsLoader.getAccounts())
    })
  }, [accountsLoader])

  const onAccountIndexChange = useCallback(
    (index: number) => {
      setHwAccountIndex(index)
      closeModal()

      addSnackbar({ content: <Trans>{walletName} account changed</Trans>, id: 'account-changed', icon: 'success' })
    },
    [walletName, addSnackbar, setHwAccountIndex, closeModal]
  )

  useEffect(() => {
    setAccountsList(accountsLoader?.getAccounts() || null)
  }, [accountsLoader])

  if (!accountsList || !accountsLoader) return null

  return (
    <CowModal maxWidth={600} isOpen={isOpen} onDismiss={closeModal} minHeight={false} maxHeight={90}>
      <styledEl.Wrapper>
        <styledEl.Header>
          <h3>
            <styledEl.WalletIcon src={walletIcon} alt={walletName} /> <Trans>Select {walletName} Account</Trans>
          </h3>
          <styledEl.CloseIcon onClick={closeModal} />
        </styledEl.Header>
        <AccountIndexSelect
          balances={balances}
          currentIndex={hwAccountIndex}
          onAccountIndexChange={onAccountIndexChange}
          accountsList={accountsList}
          loadMoreAccounts={loadMoreAccounts}
        />
      </styledEl.Wrapper>
    </CowModal>
  )
}
