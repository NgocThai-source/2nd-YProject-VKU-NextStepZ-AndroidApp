import localFont from 'next/font/local'

export const iCielCadena = localFont({
    src: [
        {
            path: '../public/fonts/iciel Cadena.ttf',
            weight: '400',
            style: 'normal',
        },
        {
            path: '../public/fonts/iCielCadena.otf',
            weight: '400',
            style: 'normal',
        }
    ],
    variable: '--font-iciel-cadena'
})
export const iCielCroncante = localFont({
    src: [
        {
            path: '../public/fonts/iCiel Crocante.otf',
            weight: '400',
            style: 'normal',
        },
    ],
    variable: '--font-iciel-croncante'
})
export const iCielShowcase = localFont({
    src: [
        {
            path: '../public/fonts/ShowcaseSans.ttf',
            weight: '400',
            style: 'normal',
        }
    ],
    variable: '--font-iciel-showcase'
})
