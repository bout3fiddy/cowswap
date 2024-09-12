import { StrictMode } from 'react'

import 'inter-ui'
import { createRoot } from 'react-dom/client'

import { HookDapp } from './app/hook-dapp'

function Root() {
  return (
    <StrictMode>
      <HookDapp />
    </StrictMode>
  )
}

const root = createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
