


import { useTheme } from '@react-navigation/native'
import { Colors, View } from 'react-native-ui-lib';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import Waves from '../assets/svgs/waves.svg'
import WavesNight from '../assets/svgs/waves-night.svg'

import HomeScreen from '../screens/HomeScreen';
import QuizScreen from '../screens/QuizScreen';
import { HomeHeaderTabs } from './HomeHeaderTabs';
import SettingsScreen from 'screens/settings/SettingsScreen';



const BottomTab = createBottomTabNavigator()

export function BottomTabNavigator() {
    const { dark, colors } = useTheme()

    const tabIconColor = (focused: boolean) => (focused ? colors.primary : colors.secondary)

    const headerRestoOpen = () => {
        return (
            <View style={{ marginTop: -120 }}>
                {dark ? < WavesNight style={{
                }} width={"100%"} height={250} /> : < Waves style={{
                }} width={"100%"} height={250} />}
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
                name="store"
                component={SettingsScreen}
                options={{
                    headerShown: true,
                    tabBarIcon: ({ focused }) => <MaterialCommunityIcons color={tabIconColor(focused)} size={25} name={focused ? 'account' : 'account-outline'} />
                }}
            />
        </BottomTab.Navigator>
    )
}