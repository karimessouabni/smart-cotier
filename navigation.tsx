


import React, { } from 'react'
import { NavigationContainer, useFocusEffect, useTheme } from '@react-navigation/native'
import { Colors, BorderRadiuses, View, Image, ListItem, Text, GridView, GridList, GridListItem, Card } from 'react-native-ui-lib';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import { Appearance, useColorScheme, StatusBar, Switch, Dimensions, StyleSheet, Platform, Button } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'
import Waves from './assets/svgs/waves.svg'
import ExpoInstaStory from 'expo-insta-story';
import CoursScreen from './screens/CoursScreen';
import ChapterScreen from './screens/ChapterScreen';
import LearningCard from './components/LearningCard';
import QuizScreen from './screens/QuizScreen';
import QcmComonent from './components/QcmComonent';
import { LinearGradient } from 'expo-linear-gradient';



export default function Navigation() {
    return <NavigationContainer >
        <RootNavigator />
    </NavigationContainer>
}



const Stack = createStackNavigator()

function RootNavigator() {

    const { colors } = useTheme()

    return (
        <>
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
                        <Stack.Screen name="LearningCard" component={LearningCard} options={{ cardStyle: { backgroundColor: colors.background }, headerShown: true, headerTitle: "", presentation: 'card', keyboardHandlingEnabled: true }} />
                        <Stack.Screen name="QuizScreen" component={QuizScreen} options={({ route }) => ({ cardStyle: { backgroundColor: colors.background }, headerShown: true, presentation: 'card', keyboardHandlingEnabled: true })} />
                        <Stack.Screen name="QcmComonent" component={QcmComonent} options={({ route }) => ({ cardStyle: { backgroundColor: colors.background }, headerShown: true, headerTitle: 'Quiz numéro : ' + route.params.quiz.order, presentation: 'card', keyboardHandlingEnabled: true })} />

                    </>

                </Stack.Group>
            </Stack.Navigator>
        </>
    )
}


const BottomTab = createBottomTabNavigator()

function BottomTabNavigator() {
    const { colors } = useTheme()

    const tabIconColor = (focused: boolean) => (focused ? Colors.green10 : "#2F4858")

    const headerRestoOpen = () => {
        return (
            <View style={{ marginTop: -150 }}>
                < Waves style={{
                }} width={"100%"} height={250} />
            </View >

        )
    }

    return (
        <BottomTab.Navigator
            screenOptions={{
                header: () => headerRestoOpen(),
                headerTitle: '',
                tabBarShowLabel: false,
                tabBarStyle: {
                    borderTopWidth: 0,
                    shadowColor: 'transparent', // this covers iOS
                    elevation: 0, // this covers Android
                    backgroundColor: colors.background
                }
            }}>
            <BottomTab.Screen
                name="HomeTabs"
                component={HomeHeaderTabs}
                options={{
                    headerShown: true,
                    headerTitle: "",
                    tabBarIcon: ({ focused }) => <MaterialCommunityIcons color={tabIconColor(focused)} size={25} name={focused ? 'home' : 'home-outline'} />
                }}
            />

            <BottomTab.Screen
                name="orders"
                component={QuizScreen}
                options={{
                    headerTitle: "",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => <MaterialCommunityIcons color={tabIconColor(focused)} size={25} name={focused ? 'bell-ring' : 'bell-ring-outline'} />
                    // tabBarButton: ({ children }) => <Example />
                }}
            />


            <BottomTab.Screen
                name="store"
                component={CoursScreen}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ focused }) => <MaterialCommunityIcons color={tabIconColor(focused)} size={25} name={focused ? 'cog' : 'cog-outline'} />
                }}
            />
        </BottomTab.Navigator>
    )
}

// We used the HomeHeaderTab.Navigator and HomeHeaderTab.Screen to create a tab navigator
const HomeHeaderTab = createMaterialTopTabNavigator()

// This will be the header of the CategoryScreen within the BottomTab and will contain the tabs
// for the categories, modifiers and labels
const HomeHeaderTabs = () => {
    const { colors } = useTheme()
    const headerTextColor = (focused: boolean) => (focused ? Colors.green10 : "#2F4858")
    const headerIconColor = (focused: boolean) => (focused ? Colors.green10 : "#2F4858")

    return (
        <HomeHeaderTab.Navigator
            initialRouteName="Category"
            screenOptions={{

                swipeEnabled: true,
                tabBarStyle: {
                    backgroundColor: colors.background
                },
                tabBarIndicatorStyle: {
                    backgroundColor: "#00A975"
                },
                tabBarActiveTintColor: colors.primary
            }}>
            <HomeHeaderTab.Screen
                name="Lesson"
                component={CoursScreen}
                options={{
                    tabBarLabel: ({ color, focused }) => (
                        <View>
                            <Text style={[{ color: headerTextColor(focused), fontFamily: 'circular-std', fontSize: 14 }]}>
                                Cours <MaterialCommunityIcons name="notebook-outline" size={24} color={headerIconColor(focused)} />
                            </Text>
                        </View>
                    )
                }}
            />
            <HomeHeaderTab.Screen
                name="Exams"
                component={QuizScreen}
                options={{
                    // tabBarLabel: 'Food',
                    tabBarLabel: ({ color, focused }) => (
                        <View>
                            <Text style={{ color: headerTextColor(focused), fontFamily: 'circular-std', fontSize: 14 }}>
                                Exams <MaterialCommunityIcons name="alarm-plus" size={24} color={headerIconColor(focused)} />
                            </Text>
                        </View>
                    )
                }}
            />
        </HomeHeaderTab.Navigator>
    )
}




const { width } = Dimensions.get('window') // get screen width
const { width: screenWidth } = Dimensions.get('window')

const styles = StyleSheet.create({
    item: {
        justifyContent: 'center',
        alignItems: 'center',
        maxHeight: 200
    },
    imageContainer: {
        width: '100%',
        maxWidth: 500,
        maxHeight: 200,
        height: '100%',
        marginBottom: Platform.select({ ios: 0, android: 1 }), // Prevent a random Android rendering issue
        borderRadius: 8,
        resizeMode: 'cover', // Ajuster l'image pour couvrir tout l'élément Image
        position: 'absolute'
    },
    cardContainer: {
        maxWidth: 500,
        maxHeight: 200,
        padding: 20,
        flexDirection: 'row-reverse'
    },
    icon: {
        padding: 20,
        width: 40,
        height: 40,
        justifyContent: 'center',
        marginVertical: 30,
        borderRadius: 50,
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white'
    },
    textContainer: {
        flex: 1,
        padding: 20,
        justifyContent: 'space-between', // Centrer verticalement
        alignItems: 'flex-start' // Centrer horizontalement
    },
    text: {
        textAlign: 'right',
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white'
    },
    subtitle: {
        fontSize: 18,
        color: 'hsla(203, 100%, 94%, 1)'
    },

    image: {
        ...StyleSheet.absoluteFillObject,
        resizeMode: 'cover'
    },

    container: {
        height: 200,
        flexDirection: 'column',
        justifyContent: 'flex-start'
    },
    halfCircle: {
        width: 50,
        height: 50,
        borderBottomLeftRadius: 50,
        margin: -20,
        borderBottomRightRadius: 50,
        transform: [{ scaleX: width / 50 }]
    },
    halfCircleClosed: {
        borderBottomLeftRadius: 50,
        margin: 10,
        borderBottomRightRadius: 50,
        transform: [{ scaleX: width / 50 }]
    },
    thirdCircle: {
        width: 100,
        height: 90,
        borderBottomLeftRadius: 90,
        margin: -35,
        borderBottomRightRadius: 50,
        transform: [{ scaleX: width / 50 }]
    },
    forthCircle: {
        width: 100,
        height: 90,
        borderBottomLeftRadius: 90,
        margin: -75,
        borderBottomRightRadius: 50,
        transform: [{ scaleX: width / 50 }]
    }
})