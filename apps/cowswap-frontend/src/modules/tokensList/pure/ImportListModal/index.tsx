import { useState } from 'react'

import { TokenLogo, getTokenListViewLink, ListState } from '@cowprotocol/tokens'
import { ButtonPrimary } from '@cowprotocol/ui'

import { ExternalSourceAlert } from 'common/pure/ExternalSourceAlert'

import * as styledEl from './styled'

import { ModalHeader } from '../ModalHeader'

export interface ImportListModalProps {
  list: ListState
  onImport(list: ListState): void
  onBack(): void
  onDismiss(): void
}

export function ImportListModal(props: ImportListModalProps) {
  const { list, onBack, onDismiss, onImport } = props

  const [isAccepted, setIsAccepted] = useState(false)

  const viewLink = getTokenListViewLink(list.source)

  return (
    <styledEl.Wrapper>
      <ModalHeader onBack={onBack} onClose={onDismiss}>
        Import List
      </ModalHeader>
      <styledEl.ListInfo>
        <TokenLogo logoURI={list.list.logoURI} size={36} />
        <div>
          <styledEl.ListTitle>
            {list.list.name} · {list.list.tokens.length} tokens
          </styledEl.ListTitle>
          <styledEl.ListLink target="_blank" href={viewLink} rel="noreferrer">
            {list.source}
          </styledEl.ListLink>
        </div>
      </styledEl.ListInfo>
      <ExternalSourceAlert title="Import at your own risk" onChange={() => setIsAccepted((state) => !state)}>
        <>
          <p>
            By adding this list you are implicitly trusting that the data is correct. Anyone can create a list,
            including creating fake versions of existing lists and lists that claim to represent projects that do not
            have one.
          </p>
          <p>
            <strong>If you purchase a token from this list, you may not be able to sell it back.</strong>
          </p>
        </>
      </ExternalSourceAlert>
      <styledEl.ActionButtonWrapper>
        <ButtonPrimary disabled={!isAccepted} onClick={() => onImport(list)}>
          Import
        </ButtonPrimary>
      </styledEl.ActionButtonWrapper>
    </styledEl.Wrapper>
  )
}
