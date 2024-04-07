


import { useTheme } from '@react-navigation/native'
import { Colors, View } from 'react-native-ui-lib';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import Waves from '../assets/svgs/waves.svg'
import HomeScreen from '../screens/HomeScreen';
import QuizScreen from '../screens/QuizScreen';
import { HomeHeaderTabs } from './HomeHeaderTabs';



const BottomTab = createBottomTabNavigator()

export function BottomTabNavigator() {
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
                component={HomeScreen}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ focused }) => <MaterialCommunityIcons color={tabIconColor(focused)} size={25} name={focused ? 'cog' : 'cog-outline'} />
                }}
            />
        </BottomTab.Navigator>
    )
}