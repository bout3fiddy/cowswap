import { TokenWithLogo } from '@cowprotocol/common-const'
import { SupportedChainId } from '@cowprotocol/cow-sdk'

import { TokenSearchFromApiResult } from '../services/searchTokensInApi'
import { isTruthy } from '@cowprotocol/common-utils'
import { tokenWithLogoFromToken } from './tokenWithLogoFromToken'

export function parseTokensFromApi(apiResult: TokenSearchFromApiResult[], chainId: SupportedChainId): TokenWithLogo[] {
  return apiResult
    .filter((token) => token.chainId === chainId)
    .map((token) => {
      try {
        return tokenWithLogoFromToken(token, token.project.logoUrl)
      } catch (e) {
        console.error('parseTokensFromApi error', e)

        return null
      }
    })
    .filter(isTruthy)
}
