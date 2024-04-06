import React, { useState } from 'react'
import { Text } from 'native-base'
import { useTheme } from '@react-navigation/native'
import { ActivityIndicator, TouchableOpacity, View } from 'react-native'

interface SaveButtonProps {
    handleSaveClick: () => void
    btnName?: string
    btnOn?: string
    saving: boolean
    isDisabled: boolean
}

const SaveButton: React.FC<SaveButtonProps> = ({ handleSaveClick, saving, isDisabled, btnName, btnOn }) => {
    const [isPressed, setIsPressed] = useState(false)
    const { colors } = useTheme()

    const handlePressIn = () => {
        setIsPressed(true)
    }

    const handlePressOut = () => {
        setIsPressed(false)
        handleSaveClick()
    }

    const scale = isPressed ? { transform: [{ scale: 0.99 }], opacity: 0.5 } : {}

    return (
        <View
            style={{
                flexDirection: 'row',
                justifyContent: 'space-between'
            }}>
            <TouchableOpacity
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                disabled={isDisabled}
                style={[
                    scale,
                    {
                        flex: 2,
                        padding: 15,
                        marginBottom: 5,
                        borderRadius: 5
                    },
                    isDisabled ? { backgroundColor: '#D5D6D6' } : { backgroundColor: '#7437F3' }
                ]}>
                {saving ? (
                    <Text style={{ fontFamily: 'circular-std', fontSize: 20, color: 'white', textAlign: 'center' }}>
                        {btnOn ? btnOn : 'En cours...'}
                        <ActivityIndicator size="small" color="#FFFFFF" />
                    </Text>
                ) : (
                    <Text style={{ fontFamily: 'circular-std', fontSize: 20, color: 'white', textAlign: 'center' }}>{btnName ? btnName : 'Sauvegarder'}</Text>
                )}
            </TouchableOpacity>
        </View>
    )
}

export default SaveButton
