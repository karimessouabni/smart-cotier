import { useEffect } from 'react'
import { Alert } from 'react-native'

type ConfirmationAlertProps = {
    onPressYes: () => void
    onPressNo: () => void
    isVisible: boolean
    message: string
}

const ConfirmationAlert = ({ onPressYes, onPressNo, isVisible, message }: ConfirmationAlertProps) => {
    const createTwoButtonAlert = () =>
        Alert.alert('Confirmation', message, [
            {
                text: 'Oui',
                onPress: onPressYes
            },
            {
                text: 'Non ',
                onPress: onPressNo
            }
        ])

    useEffect(() => {
        if (isVisible) {
            createTwoButtonAlert()
        }
    }, [isVisible])
    return null
}

export default ConfirmationAlert
