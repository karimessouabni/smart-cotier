import { useState } from 'react'
import { View, Animated, TouchableWithoutFeedback, KeyboardAvoidingView, Platform, Keyboard, ScrollView, StyleSheet } from 'react-native'
import { Center, Icon, Input, Text, FormControl, WarningOutlineIcon, Pressable, Link, Stack } from 'native-base'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useNavigation } from '@react-navigation/native'
import { useTailwind } from 'tailwind-rn'

import { auth } from '../../firebase'
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import { useTheme } from '@react-navigation/native'
import SaveButton from '../styled/SaveBouton'
import tw from 'twrnc'

export default function EmailAuth() {
    const navigation = useNavigation<any>()
    const tailwind = useTailwind()
    const [show, setShow] = useState(false)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loginOn, setLoginOn] = useState(false)
    const [errorOnLoggin, setErrorOnLoggin] = useState(false)
    const inputAccessoryViewID = 'saveBtnId'

    const { colors } = useTheme()

    const loginUser = async () => {
        try {
            setLoginOn(true)
            await signInWithEmailAndPassword(auth, email, password)
            setLoginOn(false)
        } catch (err) {
            setLoginOn(false)
            console.error(err)
            setErrorOnLoggin(true)
        }
    }

    const styles = StyleSheet.create({
        checkboxBase: {
            width: 20,
            height: 20,
            borderRadius: 4,
            borderWidth: 2,
            borderColor: colors.primary,
            backgroundColor: 'transparent'
        },
        checkboxChecked: {
            backgroundColor: colors.primary
        }
    })

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'position' : 'height'} style={{ flex: 1 }}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView>
                    <Center>
                        <FormControl isInvalid={errorOnLoggin}>
                            <Stack mx={4} mt={10}>

                            </Stack>

                            <Stack m={4}>
                                <FormControl.Label _text={{ color: colors.text }}>Votre email :</FormControl.Label>
                                <Input
                                    InputLeftElement={<Icon as={MaterialCommunityIcons} name="email" size={5} color={colors.text} marginLeft={3} />}
                                    placeholder="Adresse email"
                                    value={email}
                                    keyboardType="email-address"
                                    inputAccessoryViewID={inputAccessoryViewID}
                                    autoCapitalize="none"
                                    style={{ margin: 10, fontFamily: 'circular-std', fontSize: 14 }}
                                    onChangeText={(newEmail) => setEmail(newEmail)}
                                    focusOutlineColor={colors.primary}
                                    variant="filled"
                                    backgroundColor={colors.inputBg}
                                    color={colors.text}
                                />
                            </Stack>

                            <Stack m={4}>
                                <FormControl.Label _text={{ color: colors.text }}>Votre mot de passe :</FormControl.Label>
                                <Input
                                    InputLeftElement={<Icon as={MaterialCommunityIcons} name="lock" size={5} color={colors.text} marginLeft={3} />}
                                    placeholder="Mot de passe"
                                    value={password}
                                    inputAccessoryViewID={inputAccessoryViewID}
                                    style={{ margin: 10, fontFamily: 'circular-std', fontSize: 14 }}
                                    onChangeText={(newPassword) => setPassword(newPassword)}
                                    variant="filled"
                                    focusOutlineColor={colors.primary}
                                    backgroundColor={colors.inputBg}
                                    color={colors.text}
                                    type={show ? 'text' : 'password'}
                                    InputRightElement={
                                        <Pressable onPress={() => setShow(!show)}>
                                            <Icon as={<MaterialIcons name={show ? 'visibility' : 'visibility-off'} />} size={5} mr="2" color="muted.400" />
                                        </Pressable>
                                    }
                                />
                            </Stack>

                            <Stack m={4}>
                                <FormControl.ErrorMessage mt={-5} leftIcon={<WarningOutlineIcon size="xs" />}>
                                    Votre email ou votre mot de passe est incorrect.
                                </FormControl.ErrorMessage>
                            </Stack>

                            <Stack mx={4}>
                                <View style={[tailwind('flex flex-row justify-between items-center'), { color: colors.text }]}>
                                    <Link onPress={() => navigation.navigate('ResetPassword')}>
                                        <Text underline fontWeight={500} color={colors.secondary}>
                                            Mot de passe oublié ?
                                        </Text>
                                    </Link>
                                </View>
                            </Stack>

                            <Stack m={4} alignContent="center">
                                <Center>
                                    <SaveButton handleSaveClick={loginUser} saving={loginOn} isDisabled={false} btnName="Connexion" btnOn="Connexion en cours..." />
                                </Center>
                            </Stack>
                            <Stack mx={4} mb={10}>
                                <Center>
                                    <Link style={{}} onPress={() => navigation.navigate('Signup')}>
                                        <Text underline fontWeight={500} color={colors.secondary}>
                                            Créer un nouveau compte
                                        </Text>
                                    </Link>
                                </Center>
                            </Stack>
                        </FormControl>
                    </Center>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
}
