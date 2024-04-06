import { StyleSheet } from 'react-native';
import Navigation from './navigation';
import React, { useCallback, useState } from 'react';
import { useFonts } from 'expo-font';
import utilities from './tailwind.json'
import { NativeBaseProvider } from 'native-base'
import { TailwindProvider } from 'tailwind-rn'
import { auth } from './firebase'
import { onAuthStateChanged } from 'firebase/auth'

export default function App() {
  const [loggedIn, setLoggedIn] = useState<boolean>(false)


  const [fontsLoaded] = useFonts({
    poppins: require('./assets/fonts/poppins-light.ttf'),

    poppinsm: require('./assets/fonts/Poppins-Medium.ttf'),
    'circular-std': require('./assets/fonts/circular-std-medium-500.ttf')
  })


  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      //  await SplashScreen.hideAsync()
    }
  }, [fontsLoaded])

  onAuthStateChanged(auth, (userAuth) => {
    setLoggedIn(userAuth != null)
  })

  return (
    <TailwindProvider utilities={utilities}>
      <NativeBaseProvider >
        <Navigation loggedIn={loggedIn} />
      </NativeBaseProvider>
    </TailwindProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 100,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
