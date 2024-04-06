


import React, { } from 'react'
import { NavigationContainer, useFocusEffect, useTheme } from '@react-navigation/native'
import { Colors, BorderRadiuses, View, Image, ListItem, Text, GridView, GridList, GridListItem, Card } from 'react-native-ui-lib';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import { Appearance, useColorScheme, StatusBar } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'
import ComminSoon from './assets/coming-soon.svg'
import ExpoInstaStory from 'expo-insta-story';
import CoursScreen from './screens/CoursScreen';
import ChapterScreen from './screens/ChapterScreen';
import LearningCard from './components/LearningCard';
import QuizScreen from './screens/QuizScreen';
import QcmComonent from './components/QcmComonent';



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
                        // headerShown: false, headerTintColor: '#fff',
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
                        <Stack.Screen name="Smart Cotier" component={BottomTabNavigator} />
                        <Stack.Screen
                            name="Items"
                            component={QuizScreen}
                            options={{ gestureDirection: 'horizontal', gestureEnabled: false, cardStyle: { backgroundColor: colors.background }, headerShown: true, presentation: 'card', keyboardHandlingEnabled: true }}
                        />
                        <Stack.Screen name="ChapterScreen" component={ChapterScreen} options={({ route }) => ({ cardStyle: { backgroundColor: colors.background }, headerShown: true, headerTitle: route.params.chapName, presentation: 'card', keyboardHandlingEnabled: true })} />
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

    return (
        <BottomTab.Navigator
            screenOptions={{
                tabBarShowLabel: false,
                tabBarStyle: {
                    borderTopWidth: 0,
                    shadowColor: 'transparent', // this covers iOS
                    elevation: 0, // this covers Android
                    backgroundColor: colors.background
                }
            }}>
            <BottomTab.Screen
                name="CategoryScreen"
                component={HomeHeaderTabs}
                options={{
                    headerShown: false,
                    //  header: () => headerRestoOpen(),
                    tabBarIcon: ({ focused }) => <MaterialCommunityIcons color={tabIconColor(focused)} size={25} name={focused ? 'home' : 'home-outline'} />
                }}
            />

            <BottomTab.Screen
                name="orders"
                component={QuizScreen}
                options={{
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





