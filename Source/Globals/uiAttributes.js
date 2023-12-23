import { FontFamilies } from '../Keys/fontKeys.js'

export const LeftAlign = 'left'
export const CenterAlign = 'center'
export const RightAlign = 'right'
export const TopAlign = 'top'
export const MiddleAlign = 'middle'
export const BottomAlign = 'bottom'

export const UIColor = '#FFFFFF'
export const UIDangerColor = '#FF0000'
export const Player1Color = '#FF0000'
export const Player2Color = '#00FF00'
export const Player3Color = '#0000FF'
export const Player4Color = '#FFFF00'
export const UIFontSize = '20px'
export const UIFontFamily = FontFamilies.MedivalSharpRegular
export const TextLineSpacing = 2

export const TitleFontSize = '48px'

export function getFontSizeNumber (fontSize) {
  return parseInt(fontSize.replace('px', ''))
}

export default {
  LeftAlign,
  CenterAlign,
  RightAlign,
  TopAlign,
  MiddleAlign,
  BottomAlign,

  Player1Color,
  Player2Color,
  Player3Color,
  Player4Color,

  UIColor,
  UIDangerColor,
  UIFontSize,
  UIFontFamily,
  TextLineSpacing,
  TitleFontSize,

  getFontSizeNumber
}