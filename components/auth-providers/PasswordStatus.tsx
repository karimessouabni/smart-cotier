import React from 'react'
import { View, Text } from 'native-base'
import tw from 'twrnc'
import { useTheme } from '@react-navigation/native'

type PasswordStatusProps = {
    pswdRule: string
    ruleStatus: boolean
}

const PasswordStatus: React.FC<PasswordStatusProps> = ({ pswdRule, ruleStatus }) => {
    const { colors } = useTheme()

    return (
        <>
            <View style={tw`mt-1 flex items-center gap-x-1.5`}>
                {ruleStatus ? (
                    <View style={tw`flex-none rounded-full bg-emerald-500/20 p-1`}>
                        <View style={tw`h-1.5 w-1.5 rounded-full bg-emerald-500`}></View>
                    </View>
                ) : (
                    <View style={tw`flex-none rounded-full bg-red-500/20 p-1`}>
                        <View style={tw`h-1.5 w-1.5 rounded-full bg-red-500`}></View>
                    </View>
                )}
            </View>
            <View pl={2} pr={8}>
                <Text style={[tw`rounded-md`, { color: colors.text, fontFamily: 'poppins', fontSize: 12 }]}>{pswdRule}</Text>
            </View>
        </>
    )
}

export default PasswordStatus
