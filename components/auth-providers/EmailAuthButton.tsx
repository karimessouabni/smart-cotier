import React from 'react'
// import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useTailwind } from 'tailwind-rn'
import { useNavigation } from '@react-navigation/native'
import { Button } from '../styled/Themed'
import { MaterialCommunityIcons } from '@expo/vector-icons'

export default function EmailAuthButton() {
    const navigation = useNavigation<any>()
    const tailwind = useTailwind()

    return (
        <Button icon={() => <MaterialCommunityIcons name="email-outline" size={24} style={tailwind('text-black dark:text-white')} />} onPress={() => navigation.navigate('EmailLogin')}>
            Continuer avec Email
        </Button>
    )
}
