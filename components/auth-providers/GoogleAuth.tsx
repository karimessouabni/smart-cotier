import { Image } from 'react-native'
import { GoogleAuthProvider, getAuth, signInWithCredential } from 'firebase/auth'
import { Button } from '../styled/Themed'
// import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { useEffect } from 'react'
import Constants from 'expo-constants'

const auth = getAuth()

const GoogleAuth = () => {
    useEffect(() => {
        // GoogleSignin.configure({
        //     webClientId: Constants?.expoConfig?.extra?.googleWebClientId
        // })
    }, [])

    const signIn = async () => {
        try {
            // await GoogleSignin.hasPlayServices()
            // const { idToken, user } = await GoogleSignin.signIn()
            // console.log('user', user)

            // const credential = GoogleAuthProvider.credential(idToken)
            // signInWithCredential(auth, credential)

            // // setState({ userInfo })
        } catch (error) {
            console.log('setState', error)
        }
    }

    return (
        <Button icon={() => <Image style={{ width: 24, height: 24, marginRight: 6 }} source={require('../../assets/images/google.png')} />} onPress={() => signIn()}>
            Continuer avec Google
        </Button>
    )
}

export default GoogleAuth
