import { ExternalLink } from '@cowprotocol/ui'

import styled from 'styled-components/macro'

import { UI } from 'common/constants/theme'

export const ReadMoreLink = styled(ExternalLink)`
  color: var(${UI.COLOR_PRIMARY_TEXT});
  text-decoration: underline;
`
