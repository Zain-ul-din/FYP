import localFont from 'next/font/local'

export const LufgaFont = localFont({
  src: [
    { path: '../../public/fonts/LufgaBlack.ttf', weight: '900' },
    { path: '../../public/fonts/LufgaBlackItalic.ttf', weight: '900', style: 'italic' },
    { path: '../../public/fonts/LufgaBold.ttf', weight: '700' },
    { path: '../../public/fonts/LufgaBoldItalic.ttf', weight: '700', style: 'italic' },
    { path: '../../public/fonts/LufgaExtraBold.ttf', weight: '800' },
    { path: '../../public/fonts/LufgaExtraBoldItalic.ttf', weight: '800', style: 'italic' },
    { path: '../../public/fonts/LufgaExtraLight.ttf', weight: '200' },
    { path: '../../public/fonts/LufgaExtraLightItalic.ttf', weight: '200', style: 'italic' },
    { path: '../../public/fonts/LufgaItalic.ttf', style: 'italic' },
    { path: '../../public/fonts/LufgaLight.ttf', weight: '300' },
    { path: '../../public/fonts/LufgaLightItalic.ttf', weight: '300', style: 'italic' },
    { path: '../../public/fonts/LufgaMedium.ttf', weight: '500' },
    { path: '../../public/fonts/LufgaMediumItalic.ttf', weight: '500', style: 'italic' },
    { path: '../../public/fonts/LufgaRegular.ttf' },
    { path: '../../public/fonts/LufgaSemiBold.ttf', weight: '600' },
    { path: '../../public/fonts/LufgaSemiBoldItalic.ttf', weight: '600', style: 'italic' },
    { path: '../../public/fonts/LufgaThin.ttf', weight: '100' },
    { path: '../../public/fonts/LufgaThinItalic.ttf', weight: '100', style: 'italic' },
  ]
})
