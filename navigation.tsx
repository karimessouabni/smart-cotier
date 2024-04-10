


import { NavigationContainer, useTheme } from '@react-navigation/native'
import { Colors } from 'react-native-ui-lib';

import { createStackNavigator } from '@react-navigation/stack'
import ChapterScreen from './screens/ChapterScreen';
import LearningCard from './components/LearningCard';
import QuizScreen from './screens/QuizScreen';
import QcmScreen from './components/QcmScreen';
import ResetPasswordScreen from './screens/login-and-signup/ResetPasswordScreen';
import SignupScreen from './screens/login-and-signup/SignupScreen';
import EmailLoginScreen from './screens/login-and-signup/EmailLoginScreen';
import LoginScreen from './screens/login-and-signup/LoginScreen';
import { BottomTabNavigator } from 'navigation/BottomTabNavigator';
import QuizEndScreen from 'screens/QuizEndScreen';



export default function Navigation({ loggedIn }: { loggedIn: boolean; }) {
    return <NavigationContainer >
        <RootNavigator loggedIn={loggedIn} />
    </NavigationContainer>
}



const Stack = createStackNavigator()

function RootNavigator({ loggedIn }: { loggedIn: boolean }) {

    const { colors } = useTheme()

    return (
        <Stack.Navigator>
            <Stack.Group
                screenOptions={{

                    headerShown: false,
                    headerStyle: {
                        backgroundColor: colors.background,
                        shadowColor: 'transparent', // this covers iOS
                        elevation: 0 // this covers Android
                    },
                    headerTintColor: Colors.green10,
                    headerShadowVisible: false,
                    headerBackTitleVisible: false
                }}>
                {loggedIn ? (
                    <>
                        <Stack.Screen name="HomeScreen" component={BottomTabNavigator} />
                        <Stack.Screen
                            name="Items"
                            component={QuizScreen}
                            options={{
                                gestureDirection: 'horizontal',
                                gestureEnabled: false,
                                cardStyle: { backgroundColor: colors.background },
                                headerShown: true,

                                // header: () => headerRestoOpen(),
                                presentation: 'card', keyboardHandlingEnabled: true
                            }}
                        />
                        <Stack.Screen name="ChapterScreen"
                            component={ChapterScreen}
                            options={({ route }) => ({
                                cardStyle: { backgroundColor: colors.background },
                                headerShown: true,
                                headerTitle: route.params.chapName,
                                presentation: 'card'
                            })} />
                        <Stack.Screen name="LearningCard" component={LearningCard} options={{ cardStyle: { backgroundColor: colors.background }, headerShown: true, headerTitle: "", presentation: 'card' }} />
                        <Stack.Screen name="QuizScreen" component={QuizScreen} options={({ route }) => ({ cardStyle: { backgroundColor: colors.background }, headerShown: true, presentation: 'card' })} />
                        <Stack.Screen name="QcmComonent" component={QcmScreen} options={({ route }) => ({ cardStyle: { backgroundColor: colors.background }, headerShown: true, headerTitle: 'Quiz numéro : ' + route.params.quiz.order, presentation: 'card' })} />
                        <Stack.Screen name="QuizEndScreen" component={QuizEndScreen} options={({ route }) => ({ cardStyle: { backgroundColor: colors.background }, headerShown: true, headerTitle: 'Quiz numéro : ' + route.params.quiz.order, presentation: 'card' })} />

                    </>
                ) :
                    (<>
                        {/* <Stack.Screen name="Welcome" component={WelcomeSliderScreen} options={{ headerShown: false }} /> */}
                        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="EmailLogin" component={EmailLoginScreen} options={{ headerTitle: `Connexion` }} />
                        <Stack.Screen name="Signup" component={SignupScreen} options={{ title: 'Créer un compte' }} />
                        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} options={{ title: 'Réinitialiser votre mot de passe' }} />
                    </>)
                }
            </Stack.Group>
        </Stack.Navigator>
    )
}