import React from 'react'
import { Platform } from 'react-native'
import * as AppleAuthentication from 'expo-apple-authentication'

import { OAuthProvider, signInWithCredential, getAuth, updateEmail, updateProfile, signInWithPopup } from 'firebase/auth'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useTailwind } from 'tailwind-rn'

const auth = getAuth()
import { Button } from '../styled/Themed'

export default function AppleAuth() {
    const tailwind = useTailwind()

    const loginWithApple = async () => {
        if (Platform.OS === 'web') {
            try {
                const provider = new OAuthProvider('apple.com')
                const result = await signInWithPopup(auth, provider)
            } catch (err) {
                console.error(err)
            }
        } else {
            const rawNonce = Math.random().toString(36).substring(2, 10)
            const requestedScopes = [AppleAuthentication.AppleAuthenticationScope.FULL_NAME, AppleAuthentication.AppleAuthenticationScope.EMAIL]

            try {
                const appleCredential = await AppleAuthentication.signInAsync({
                    requestedScopes
                })

                // signed in

                const { identityToken, email, fullName } = appleCredential

                if (!identityToken) {
                    throw new Error('No identity token provided.')
                }

                const provider = new OAuthProvider('apple.com')

                provider.addScope('email')
                provider.addScope('fullName')

                const credential = provider.credential({
                    idToken: identityToken
                })

                const displayName = fullName ? `${fullName.givenName} ${fullName.familyName}` : undefined
                const data = { email, displayName }

                console.log('===================================================>', email, credential)
                const { user } = await signInWithCredential(auth, credential)

                if (data.email && !user.email) {
                    await updateEmail(user, data.email)
                }

                if (data.displayName && !user.displayName) {
                    await updateProfile(user, { displayName: data.displayName })
                }
            } catch (error) {
                throw error
            }
        }
    }

    return (
        <Button icon={() => <MaterialCommunityIcons name="apple" size={24} style={tailwind('text-black dark:text-white')} />} onPress={() => loginWithApple()}>
            Continuer avec Apple
        </Button>
    )
}
