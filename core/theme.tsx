import { DefaultTheme } from '@react-navigation/native'

export type CustomColors = {
    dark: boolean
    colors: {
        primary: string
        secondary: string
        background: string
        background2: string
        text: string
        secondaryText: string
        border: string
        red: string
        inputBg: string
        settingsBackground: string
        openHeaderGradientLeft: string
        openHeaderGradientCenter: string
        openHeaderGradientRight: string
        closedHeaderGradientLeft: string
        closedHeaderGradientCenter: string
        closedHeaderGradientRight: string
        orderScreenList: string
        inputFocusOutline: string
        switchOn: string
        switchOff: string
    }
}

const LightTheme: CustomColors = {
    ...DefaultTheme,
    dark: false,
    colors: {
        ...DefaultTheme.colors,
        primary: '#00a8ae',//'#72fe14',
        secondary: '#00d2da',
        background: '#FFFFFF',
        text: 'rgb(17, 24, 39)',
        background2: '#1e293c',
        text2: '#7D8290',
        secondaryText: '#575c66',
        border: '#F19E9B',
        red: 'rgb(255, 69, 58)',
        inputBg: 'muted.100',
        orderScreenList: '#F9FAFB',
        settingsBackground: '#f4f5f6',
        openHeaderGradientLeft: 'hsla(203, 100%, 94%, 1)',
        openHeaderGradientCenter: 'hsla(203, 100%, 94%, 0.4)',
        openHeaderGradientRight: 'hsla(0, 0%, 100%, 1) ',
        closedHeaderGradientLeft: 'hsla(275, 100%, 85%, 0.7)',
        closedHeaderGradientRight: 'hsla(275, 100%, 85%, 0.2)',
        closedHeaderGradientCenter: 'hsla(275, 100%, 85%, 0.2)',
        switchOn: '#72fe14',
        switchOff: '#A80900'
    }
}

const DarkTheme: CustomColors = {
    ...DefaultTheme,
    dark: true,
    colors: {
        ...DefaultTheme.colors,
        primary: '#00a8ae',//'#72fe14',
        secondary: '#00d2da',
        background: '#11151c',
        background2: '#1e293c',
        text: '#FFFFFF',
        text2: '#DADDE2',
        secondaryText: '#a5a5a5',
        border: '#F19E9B',
        red: 'rgb(255, 69, 58)',
        inputBg: '#334155',
        settingsBackground: '#f4f5f6',
        orderScreenList: '#2a2a3f',
        openHeaderGradientLeft: 'hsla(203, 100%, 94%, 0)',
        openHeaderGradientCenter: 'hsla(203, 100%, 94%, 0)',
        openHeaderGradientRight: 'hsla(0, 0%, 100%, 0) ',
        closedHeaderGradientLeft: 'hsla(275, 100%, 85%, 0)',
        closedHeaderGradientRight: 'hsla(275, 100%, 85%, 0)',
        closedHeaderGradientCenter: 'hsla(275, 100%, 85%, 0)',
        switchOn: '#72fe14',
        switchOff: '#A80900'
    }
}

export { DarkTheme, LightTheme }
