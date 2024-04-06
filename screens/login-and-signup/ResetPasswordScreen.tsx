import { useEffect, useState } from 'react'
import { Animated, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import { sendPasswordResetEmail, AuthError } from 'firebase/auth'
import Constants from 'expo-constants';

import { Link } from '../../components/styled/Themed'
import { auth } from '../../firebase'
import { useNavigation } from '@react-navigation/native'
import SaveButton from '../../components/styled/SaveBouton'
import { Stack, Center, FormControl, Icon, Input, Text } from 'native-base'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useTheme } from '@react-navigation/native'
import tw from 'twrnc'
import LottieView from 'lottie-react-native'

export default function ResetPasswordScreen() {
    const navigation = useNavigation()

    const [email, setEmail] = useState('')
    const [isValidEmail, setIsValidEmail] = useState(false)
    const [emailSent, setEmailSent] = useState(false)

    const [error, setError] = useState<AuthError | undefined>(undefined)
    const [success, setSuccess] = useState<string | undefined>(undefined)
    const [resetOn, setResetOn] = useState(false)

    const { colors } = useTheme()

    const doSendResetPasswordEmail = async () => {
        try {
            setResetOn(true)
            await sendPasswordResetEmail(auth, email)
            setSuccess('Please check your email to finish resetting your password')
            setResetOn(false)
            setEmailSent(true)
        } catch (err) {
            setError(err as AuthError)
            setResetOn(false)
        }
    }

    useEffect(() => {
        validateEmail(email)
    }, [email])

    const validateEmail = (email: string) => {
        const emailRegex: any = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        setIsValidEmail(emailRegex.test(email))
    }

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'position' : 'height'} style={{ flex: 1 }}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <Center>
                    <FormControl>
                        <Stack mx={4} mt={10}>
                            <Animated.View style={tw`relative items-center `}>
                                <LottieView
                                    autoPlay
                                    loop={false}
                                    style={{
                                        width: 200,
                                        height: 200
                                    }}
                                    source={require('../../assets/animation/reset-pswd.json')}
                                />
                            </Animated.View>
                        </Stack>
                        <Stack m={4}>
                            <Text>Pour réinitialiser votre mot de passe, nous devons vous envoyer un e-mail.</Text>
                        </Stack>

                        <Stack m={4}>
                            <FormControl.Label _text={{ color: colors.text }}>Votre email :</FormControl.Label>
                            <Input
                                InputLeftElement={<Icon as={MaterialCommunityIcons} name="email" size={5} color={colors.text} marginLeft={3} />}
                                placeholder="Adresse email"
                                value={email}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                style={{ margin: 10, fontFamily: 'circular-std', fontSize: 14 }}
                                onChangeText={(newEmail) => setEmail(newEmail)}
                                focusOutlineColor={colors.primary}
                                variant="filled"
                                backgroundColor={colors.inputBg}
                                color={colors.text}
                            />
                        </Stack>

                        {emailSent && (
                            <Stack mx={4} mt={4}>
                                <Text color={colors.primary}>E-mail de réinitialisation de mot de passe envoyé, assurez-vous de consulter la boîte de réception.</Text>
                            </Stack>
                        )}

                        <Stack mt={10} mx={4} mb={4} alignContent="center">
                            <Center>
                                <SaveButton handleSaveClick={doSendResetPasswordEmail} saving={resetOn} isDisabled={!isValidEmail} btnName="Réinitialiser mon mot de passe" btnOn="Envoi de mail en cours..." />
                            </Center>
                        </Stack>
                        <Stack mx={4} mb={10}>
                            <Center>
                                <Link style={{}} onPress={() => navigation.navigate('EmailLogin')}>
                                    <Text underline fontWeight={500} color={colors.primary}>
                                        Retour à l'écran de connexion
                                    </Text>
                                </Link>
                            </Center>
                        </Stack>
                    </FormControl>
                </Center>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%'
    }
})
