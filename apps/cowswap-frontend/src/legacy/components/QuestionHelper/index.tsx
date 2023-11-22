import { ReactNode } from 'react'

import QuestionImage from '@cowprotocol/assets/svg/question.svg'
import { renderTooltip } from '@cowprotocol/ui'

import SVG from 'react-inlinesvg'
import styled from 'styled-components/macro'

import { UI } from 'common/constants/theme'

import QuestionHelperMod, { QuestionHelperProps } from './QuestionHelperMod'

const DefaultQuestionMark = <SVG src={QuestionImage} />

export const QuestionWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  width: 16px;
  height: 16px;
  border: none;
  outline: none;
  cursor: default;
  border-radius: 16px;
  background-color: transparent;

  > svg > path {
    stroke: var(${UI.COLOR_PRIMARY_TEXT});
  }
`

interface EnhancedQuestionHelperProps extends Omit<QuestionHelperProps, 'QuestionMark'> {
  text: ReactNode
  Icon?: JSX.Element
}

export default function QuestionHelper({ text, Icon, ...props }: EnhancedQuestionHelperProps) {
  const tooltip = renderTooltip(text, props)

  return <QuestionHelperMod {...props} text={tooltip} QuestionMark={() => Icon || DefaultQuestionMark} />
}
