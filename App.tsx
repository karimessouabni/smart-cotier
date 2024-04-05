import { StyleSheet } from 'react-native';
import Navigation from './navigation';
import React, { useCallback } from 'react';
import { useFonts } from 'expo-font';

export default function App() {

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
  return (
    <Navigation />
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
