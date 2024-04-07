import { useEffect, useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { z } from 'zod'
import { Link } from '../../components/styled/Themed'
import { auth } from '../../firebase'
import { Input, Center, Icon, Text, FormControl, WarningOutlineIcon, HStack, Stack } from 'native-base'
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import { useTheme } from '@react-navigation/native'
import tw from 'twrnc'
import { Animated, Platform, TouchableWithoutFeedback, KeyboardAvoidingView, ScrollView, Keyboard, Pressable } from 'react-native'
import PasswordStatus from '../../components/auth-providers/PasswordStatus'
import LottieView from 'lottie-react-native'
import SaveButton from '../../components/styled/SaveBouton'
import { FirebaseError } from 'firebase/app'

export default function SignupScreen({ navigation }: any) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [pswdErrors, setPswdErrors] = useState<boolean[]>([])
    const [cnfPswdErrors, setCnfPswdErrors] = useState<boolean>(false)
    const [signupOn, setSignupOn] = useState(false)
    const [showPswd, setShowPswd] = useState(false)
    const [showPswdCnf, setShowPswdCnf] = useState(false)

    const [passwordsMatch, setPasswordsMatch] = useState(false)
    const [emailInUse, setEmailInUse] = useState(false)

    const [errorOnLoggin, setErrorOnLoggin] = useState(false)

    const [isFormValid, setIsFormValid] = useState(false)

    const [emailOnError, setEmailOnError] = useState(false)
    const [intRender, setInitRender] = useState(true)

    const { colors } = useTheme()

    const SignupSchema = z.object({
        email: z.string().email(),
        password: z
            .string()
            .min(6)
            .refine((maj) => /[A-Z]/.test(maj), {
                message: 'Mot de passe incorrect.',
                path: ['maj']
            })
            .refine((min) => /[a-z]/.test(min), {
                message: 'Mot de passe incorrect.',
                path: ['min']
            })
            .refine((chif) => /[0-9]/.test(chif), {
                message: 'Mot de passe incorrect.',
                path: ['chif']
            })
            .refine((spe) => /[^a-zA-Z0-9]/.test(spe), {
                message: 'Mot de passe incorrect.',
                path: ['spe']
            }),
        confirmPassword: z.string().refine((value) => value === password, {
            message: 'La confirmation du mot de passe ne correspond pas au mot de passe.',
            path: ['confpswd']
        })
    })

    const handlePasswordChange = (newPassword: string) => {
        setPassword(newPassword)
        setPasswordsMatch(newPassword === confirmPassword)
    }

    const handleConfirmPasswordChange = (newConfirmPassword: string) => {
        setConfirmPassword(newConfirmPassword)
        setPasswordsMatch(newConfirmPassword === password)
    }

    // Function to extract the list of messages and associated paths

    const createUser = async () => {
        let isReadyToSignUp = true

        try {
            SignupSchema.parse({ email, password, confirmPassword })
        } catch (err) {
            if (err instanceof z.ZodError) {
                isReadyToSignUp = false
            }
        }

        if (isReadyToSignUp) {
            try {
                setSignupOn(true)
                let a = await createUserWithEmailAndPassword(auth, email, password)
                setSignupOn(false)
            } catch (err: FirebaseError) {
                setSignupOn(false)
                console.log('error when trying to signup', err)
                if (err.code.includes('mail-already-in-use')) {
                    setEmailInUse(true)
                }
            }
        }
    }

    useEffect(() => {
        let result
        if (intRender) {
            setInitRender(false)
        } else {
            try {
                result = SignupSchema.parse({ email, password, confirmPassword })
                setIsFormValid(true)
                setEmailOnError(false)
            } catch (err) {
                if (err instanceof z.ZodError) {
                    setErrorOnLoggin(true)
                    const maj = !err.errors.flatMap((err) => err.path).includes('maj')
                    const min = !err.errors.flatMap((err) => err.path).includes('min')
                    const spe = !err.errors.flatMap((err) => err.path).includes('spe')
                    const chif = !err.errors.flatMap((err) => err.path).includes('chif')

                    password.length > 0 ? setPswdErrors([maj, min, spe, chif]) : setPswdErrors([])

                    // Handling conf password
                    const confPswd = err.errors.flatMap((err) => err.path).includes('confpswd')
                    console.log(
                        err.errors.flatMap((err) => err.path),
                        password,
                        confirmPassword
                    )
                    confirmPassword.length > 0 ? setCnfPswdErrors(confPswd) : setCnfPswdErrors(false)

                    // Handling email error
                    const emailError = err.errors.some((error) => error.path[0] === 'email')
                    email.length > 0 ? setEmailOnError(emailError) : setEmailOnError(false)
                } else {
                    console.log('error when trying to signup', err)
                }
                setIsFormValid(false)
            }
            if (result) {
                setEmailOnError(false)
                setPswdErrors([true, true, true, true])
                setCnfPswdErrors(false)
            }
        }
    }, [password, confirmPassword, email])

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'position' : 'height'} style={{ flex: 1 }}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView>
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
                                        source={require('../../assets/animation/signup.json')}
                                    />
                                </Animated.View>
                            </Stack>

                            <Stack m={4}>
                                <FormControl.Label _text={{ color: colors.text }}>Email :</FormControl.Label>
                                <Input
                                    InputLeftElement={<Icon as={MaterialCommunityIcons} name="email" size={5} color={colors.text} marginLeft={3} />}
                                    value={email}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    style={{ margin: 10, fontFamily: 'circular-std', fontSize: 14 }}
                                    onChangeText={(newEmail) => setEmail(newEmail)}
                                    focusOutlineColor={colors.primary}
                                    variant="filled"
                                    backgroundColor={colors.inputBg}
                                    color={colors.text}
                                    isInvalid={emailOnError}
                                    placeholder="Entrer votre email"
                                // onBlur={() => validateEmail(email)}
                                // onFocus={() => {
                                //     setEmailOnError(false)
                                // }}
                                />
                                <FormControl.ErrorMessage isInvalid={emailInUse} leftIcon={<WarningOutlineIcon size="xs" />}>
                                    L'email est déjà utilisé par un autre compte
                                </FormControl.ErrorMessage>
                                <FormControl.ErrorMessage isInvalid={emailOnError} leftIcon={<WarningOutlineIcon size="xs" />}>
                                    Votre email est invalide
                                </FormControl.ErrorMessage>
                            </Stack>

                            <Stack mx={4} mb={4}>
                                <FormControl.Label _text={{ color: colors.text }}>Mot de passe :</FormControl.Label>

                                <Input
                                    isInvalid={pswdErrors.includes(false)}
                                    InputLeftElement={<Icon as={MaterialCommunityIcons} name="lock" size={5} color={colors.text} marginLeft={3} />}
                                    placeholder="Entrer votre mot de passe"
                                    style={{ margin: 10, fontFamily: 'circular-std', fontSize: 14 }}
                                    value={password}
                                    focusOutlineColor={colors.primary}
                                    onChangeText={handlePasswordChange}
                                    variant="filled"
                                    backgroundColor={colors.inputBg}
                                    color={colors.text}
                                    type={showPswd ? 'text' : 'password'}
                                    InputRightElement={
                                        <Pressable onPress={() => setShowPswd(!showPswd)}>
                                            <Icon as={<MaterialIcons name={showPswd ? 'visibility' : 'visibility-off'} />} size={5} mr="2" color="muted.400" />
                                        </Pressable>
                                    }
                                />
                                <FormControl.ErrorMessage isInvalid={pswdErrors.includes(false)} leftIcon={<WarningOutlineIcon size="xs" />}>
                                    Votre mot de passe est incorrect.
                                </FormControl.ErrorMessage>
                            </Stack>

                            <Stack mx={4} mb={4}>
                                <FormControl.Label _text={{ color: colors.text }}>Confirmation mot de passe :</FormControl.Label>

                                <Input
                                    isInvalid={cnfPswdErrors}
                                    InputLeftElement={<Icon as={MaterialCommunityIcons} name="lock-check" size={5} color={colors.text} marginLeft={3} />}
                                    placeholder="Confirmer votre mot de passe"
                                    style={{ margin: 10, fontFamily: 'circular-std', fontSize: 14 }}
                                    value={confirmPassword}
                                    focusOutlineColor={colors.primary}
                                    onChangeText={handleConfirmPasswordChange}
                                    type={showPswdCnf ? 'text' : 'password'}
                                    InputRightElement={
                                        <Pressable onPress={() => setShowPswdCnf(!showPswdCnf)}>
                                            <Icon as={<MaterialIcons name={showPswdCnf ? 'visibility' : 'visibility-off'} />} size={5} mr="2" color="muted.400" />
                                        </Pressable>
                                    }
                                    variant="filled"
                                    backgroundColor={colors.inputBg}
                                    color={colors.text}
                                />

                                <FormControl.ErrorMessage isInvalid={cnfPswdErrors} leftIcon={<WarningOutlineIcon size="xs" />}>
                                    La confirmation du mot de passe est incorrecte
                                </FormControl.ErrorMessage>
                            </Stack>
                            {/* TODO : Ajouter dasn component et passer les couleur (red/green)en props */}
                            <Stack mx={4} mb={4}>
                                <HStack>
                                    <Text style={[tw`rounded-md`, { fontFamily: 'poppins', color: colors.secondaryText, fontSize: 14 }]}> Votre mot de passe doit contenir :</Text>
                                </HStack>
                                <HStack m={2}>
                                    <PasswordStatus pswdRule={'une lettre majuscule.'} ruleStatus={pswdErrors[0]} />
                                    <PasswordStatus pswdRule={'une lettre minuscule.'} ruleStatus={pswdErrors[1]} />
                                </HStack>
                                <HStack m={2}>
                                    <PasswordStatus pswdRule={'un caractère spécial.'} ruleStatus={pswdErrors[2]} />
                                    <PasswordStatus pswdRule={'un chiffre.'} ruleStatus={pswdErrors[3]} />
                                </HStack>
                            </Stack>

                            <Stack mt={10} m={4} alignContent="center">
                                <Center>
                                    <SaveButton handleSaveClick={createUser} saving={signupOn} isDisabled={!isFormValid} btnName="Créer votre compte" btnOn="Création en cours..." />
                                </Center>
                            </Stack>
                            <Stack mx={4} mb={10}>
                                <Center>
                                    <Link style={{}} onPress={() => navigation.navigate('EmailLogin')}>
                                        <Text underline fontWeight={500} color={colors.secondary}>
                                            Se connecter à un compte existant
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
