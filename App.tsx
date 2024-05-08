import { Animated, StyleSheet } from 'react-native';
import Navigation from './navigation';
import React, { useCallback, useRef, useState } from 'react';
import { useFonts } from 'expo-font';
import utilities from './tailwind.json'
import { NativeBaseProvider } from 'native-base'
import { TailwindProvider } from 'tailwind-rn'
import { auth } from './firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { GlassfyProvider } from './providers/GlassfyProvider';
import LottieView from 'lottie-react-native'
import tw from 'twrnc'


export default function App() {
  const [loggedIn, setLoggedIn] = useState<boolean>(false)
  const [annimationDone, setAnimationDon] = useState<boolean>(false)
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const [fontsLoaded] = useFonts({
    poppins: require('./assets/fonts/poppins-light.ttf'),

    poppinsm: require('./assets/fonts/Poppins-Medium.ttf'),
    'centraleSansB': require('./assets/fonts/CentraleSansB.woff2.ttf'),
    'montserrat': require('./assets/fonts/Montserrat.ttf'),

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

  const fadeOut = () => {
    // Will change fadeAnim value to 0 in 3 seconds
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => setAnimationDon(true));
  };


  return (
    annimationDone ? (
      <GlassfyProvider>
        <TailwindProvider utilities={utilities}>
          <NativeBaseProvider >
            <Navigation loggedIn={loggedIn} />
          </NativeBaseProvider>
        </TailwindProvider>
      </GlassfyProvider >) :
      (
        <Animated.View style={[{
          opacity: fadeAnim,
        }, tw`relative items-center`]}>
          <LottieView
            autoPlay
            onAnimationFinish={fadeOut}
            loop={false}
            style={{
              width: "100%",
              height: "100%"
            }}
            source={require('./assets/animation/splash-screen.json')}
          />
        </Animated.View>)

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
