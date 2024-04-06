import { View, Text } from 'react-native'
import { AuthError } from 'firebase/auth'
import ErrorBox from './ErrorBox'
import SuccessBox from './SuccessBox'
import { useTailwind } from 'tailwind-rn'
import { useTheme } from '@react-navigation/native'

interface Props {
    children?: JSX.Element | JSX.Element[]
    title?: string
    header?: JSX.Element
    footer?: JSX.Element
    error?: AuthError
    success?: string
}

export default function FormLayout({ children, title, header, footer, error, success }: Props) {
    const tailwind = useTailwind()
    const { colors } = useTheme()

    return (
        <View style={tailwind('flex-1 items-center justify-center ')}>
            {header && <View style={tailwind('mb-4 ')}>{header}</View>}
            <View style={tailwind(' w-full ')}>
                {title && <Text style={{ fontSize: 24, textAlign: 'center', marginBottom: 20, fontWeight: '700', color: colors.text }}>{title}</Text>}
                {children}
                {error && <ErrorBox error={error} />}
                {success && <SuccessBox message={success} />}
            </View>
            {footer && <View style={tailwind('mt-4')}>{footer}</View>}
        </View>
    )
}
