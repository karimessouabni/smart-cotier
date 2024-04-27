import { MaterialIcons, Ionicons } from '@expo/vector-icons'
import { useNavigation, useTheme } from '@react-navigation/native'
import { Box, VStack, Text, Spacer, HStack, View } from 'native-base'
import { useState } from 'react'
import { Pressable, TouchableOpacity } from 'react-native'

import UserService from '../../services/UserService'
import { ScrollView } from 'react-native'
import { deleteUser, signOut } from 'firebase/auth'
import { auth } from '../../firebase'

import tw from 'twrnc'


const data = [
    {
        fullName: 'Paramètres du Profil',
        recentText: 'Gérez votre identité et vos coordonnées',
        navigation: 'UsersAndPermissions',
        icoName: 'people-sharp'
    },


    {
        fullName: 'Abonnements',
        recentText: 'Modifiez ou renouvelez vos options',
        navigation: 'Subscription',
        icoName: 'flash'
    },

    {
        fullName: 'Vos Statistiques',
        recentText: 'Lacunes et points forts',
        navigation: 'Notification',
        icoName: 'notifications-sharp'
    },
    {
        fullName: 'Contactez-nous',
        recentText: 'Une question ou un feedback ?',
        navigation: 'Contact',
        icoName: 'mail'
    }
]


export default function SettingsScreen() {
    const sectionedData = [
        {
            title: 'RÉGLAGES PRINCIPALES',
            data: data.slice(0, 5)
        },
        {
            title: 'AUTRES RÉGLAGES',
            data: data.slice(5)
        }
    ]
    const { colors } = useTheme()



    const LogOutButton = () => {

        const signOutUser = async () => {
            try {
                console.log(' 👨‍💻 logged out event')
                await signOut(auth)
            } catch (e) {
                console.error(e)
            }
        }

        const iconStyle = {
            paddingLeft: 8,
            transform: [{ rotateY: '180deg' }]
        }

        return (
            <View style={{ alignSelf: 'center' }}>
                <TouchableOpacity
                    onPress={signOutUser}
                    style={{
                        borderRadius: 10,
                        padding: 16
                    }}>
                    <View style={[tw`flex-row items-center`]}>
                        <Ionicons name="exit-outline" size={27} color="red" style={iconStyle} />
                        <Text style={{ color: 'red', fontSize: 18, textAlign: 'center' }}>Se déconnecter</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }




    const navigation = useNavigation<any>()



    const Seperator = () => (
        <View
            style={{
                height: 1,
                width: '100%',
                backgroundColor: '#ddd',
                alignSelf: 'flex-end'
            }}
        />
    )

    const iconStyle = {
        paddingTop: 6,
        paddingLeft: 4,
        color: colors.text
    }

    return (
        <ScrollView style={{ backgroundColor: colors.background }}>
            {sectionedData.map((section, sectionIndex) => (
                <Box key={sectionIndex} pt={4}>
                    <View m={4} backgroundColor={colors.background} borderRadius={8}>
                        {section.data.map((item, itemIndex) => (
                            <Pressable onPress={() => navigation.navigate(item.navigation)} key={itemIndex}>
                                <Box p={2}>
                                    <HStack space={[4, 3]} justifyContent="space-between">
                                        <Ionicons name={item.icoName} size={27} style={iconStyle} />
                                        <VStack>
                                            <Text color={colors.text}>{item.fullName}</Text>
                                            <Text color={colors.secondaryText}>{item.recentText}</Text>
                                        </VStack>
                                        <Spacer />
                                        <View pt={3}>
                                            <MaterialIcons name="arrow-forward-ios" size={15} color={colors.secondary} />
                                        </View>
                                    </HStack>
                                </Box>
                                {itemIndex !== section.data.length - 1 && <Seperator />}
                            </Pressable>
                        ))}
                    </View>
                </Box>
            ))}

            <View m={2} borderColor={colors.settingsBackground} borderTopWidth={1} borderRadius={8}>
                <LogOutButton />
            </View>
        </ScrollView>
    )
}
