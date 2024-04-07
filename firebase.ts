import Constants from 'expo-constants'
import { initializeApp } from 'firebase/app'
import { getFirestore as getFirestoreLite } from 'firebase/firestore/lite'
import { getFirestore } from 'firebase/firestore'

import { getStorage } from 'firebase/storage'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { initializeAuth, getReactNativePersistence } from 'firebase/auth'


// Initialize Firebase
const firebaseConfig = {
    apiKey: Constants?.expoConfig?.extra?.firebaseApiKey,
    authDomain: Constants?.expoConfig?.extra?.firebaseAuthDomain,
    databaseURL: Constants?.expoConfig?.extra?.firebaseDatabaseURL,
    projectId: Constants?.expoConfig?.extra?.firebaseProjectId,
    storageBucket: Constants?.expoConfig?.extra?.firebaseStorageBucket,
    messagingSenderId: Constants?.expoConfig?.extra?.firebaseMessagingSenderId,
    appId: Constants?.expoConfig?.extra?.firebaseAppId,
    measurementId: Constants?.expoConfig?.extra?.firebaseMeasurementId
}

const app = initializeApp(firebaseConfig)

const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestoreLite(app)
const firestore = getFirestore(app)

const storage = getStorage(app)

export { app, db, storage, auth, firestore }


