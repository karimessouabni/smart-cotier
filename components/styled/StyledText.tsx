import { TextProps } from 'react-native'
import { useTailwind } from 'tailwind-rn'

import { Text } from './Themed'

export function H1(props: TextProps) {
    const tailwind = useTailwind()

    const { style, ...otherProps } = props

    return <Text style={[tailwind('text-5xl leading-12 font-bold mb-6'), props.style]} {...otherProps} />
}

export function H2(props: TextProps) {
    const tailwind = useTailwind()

    const { style, ...otherProps } = props

    return <Text style={[tailwind('text-3xl leading-8 font-bold mb-6'), props.style]} {...otherProps} />
}
