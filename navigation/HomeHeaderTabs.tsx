

import { useTheme } from '@react-navigation/native'
import { Colors, View, Text } from 'react-native-ui-lib';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import HomeScreen from '../screens/HomeScreen';
import QuizScreen from '../screens/QuizScreen';

// We used the HomeHeaderTab.Navigator and HomeHeaderTab.Screen to create a tab navigator
const HomeHeaderTab = createMaterialTopTabNavigator()

// This will be the header of the CategoryScreen within the BottomTab and will contain the tabs
// for the categories, modifiers and labels
export const HomeHeaderTabs = () => {
    const { colors } = useTheme()
    const headerTextColor = (focused: boolean) => (focused ? colors.text : colors.secondaryText)
    const headerIconColor = (focused: boolean) => (focused ? colors.primary : colors.secondary)

    return (
        <HomeHeaderTab.Navigator
            initialRouteName="Category"
            screenOptions={{

                swipeEnabled: true,
                tabBarStyle: {
                    backgroundColor: colors.background
                },
                tabBarIndicatorStyle: {
                    backgroundColor: colors.primary
                },
                tabBarActiveTintColor: colors.primary
            }}>
            <HomeHeaderTab.Screen
                name="Lesson"
                component={HomeScreen}
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

