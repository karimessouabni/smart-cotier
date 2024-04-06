import { config } from 'dotenv'

config()


module.exports = {
    expo: {
        name: 'smart-cotier',
        slug: 'smart-cotier',
        owner: 'ekitlab',
        version: '1.0.0',
        orientation: 'portrait',
        icon: './assets/icon.png',
        scheme: 'demo',
        packagerOpts: {
            config: 'metro.config.js'
        },
        userInterfaceStyle: 'automatic',
        jsEngine: 'hermes',
        splash: {
            image: './assets/splash-scn.png',
            resizeMode: 'contain',
            backgroundColor: '#ffffff'
        },
        updates: {
            url: 'https://u.expo.dev/26878654-2083-4a67-896b-c29b97536c06'
        },
        runtimeVersion: {
            policy: 'sdkVersion'
        },
        assetBundlePatterns: ['**/*'],
        ios: {
            googleServicesFile: './GoogleService-Info.plist',
            usesAppleSignIn: true,
            supportsTablet: true,
            bundleIdentifier: 'com.ekit.app.prod'
        },
        android: {
            package: 'com.ekit.app.prod',
            versionCode: 5,
            googleServicesFile: './google-services-prod.json',
            adaptiveIcon: {
                foregroundImage: './assets/images/icon.png',
                backgroundColor: '#ffffff'
            }
        },
        web: {
            favicon: './assets/icon.png'
        },
        extra: {
            
            firebaseApiKey: process.env.DEV_FIREBASE_API_KEY,
            firebaseAuthDomain: process.env.DEV_FIREBASE_AUTH_DOMAIN,
            firebaseProjectId: process.env.DEV_FIREBASE_PROJECT_ID,
            firebaseStorageBucket: process.env.DEV_FIREBASE_STORAGE_BUCKET,
            firebaseMessagingSenderId: process.env.DEV_FIREBASE_MESSAGING_SENDER_ID,
            firebaseAppId: process.env.DEV_FIREBASE_APP_ID,
            firebaseMeasurementId: process.env.DEV_FIREBASE_MEASUREMENT_ID,
            }
    }
}
