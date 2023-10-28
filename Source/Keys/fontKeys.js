export const FamilyNames = {
  MedivalSharpRegular: 'MedievalSharp-Regular',
  TangerineRegular: 'Tangerine-Regular',
  TangerineBold: 'Tangerine-Bold'
}

export const FontFamilies = {
  MedivalSharpRegular: FamilyNames.MedivalSharpRegular,
  TangerineRegular: FamilyNames.TangerineRegular,
  TangerineBold: FamilyNames.TangerineBold
}

export const StyleConfigs = [
  `@font-face {
    font-family: "${FamilyNames.MedivalSharpRegular}";
    font-style: normal;
    font-weight: 400;
    src: url('../../Public/Fonts/MedievalSharp/MedievalSharp-Regular.ttf') format('truetype');
  }`,
  `@font-face {
    font-family: "${FamilyNames.TangerineRegular}";
    font-style: normal;
    font-weight: 400;
    src: url('../../Public/Fonts/Tangerine/Tangerine-Regular.ttf') format('truetype');
  }`,
  `@font-face {
    font-family: "${FamilyNames.TangerineBold}";
    font-style: normal;
    font-weight: 700;
    src: url('../../Public/Fonts/Tangerine/Tangerine-Bold.ttf') format('truetype');
  }`
]