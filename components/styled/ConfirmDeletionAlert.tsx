import { Alert } from 'react-native'

type ConfirmDeletionAlertProps = {
    onConfirmDelete: () => void
    onCancelDelete: () => void
    isVisible: boolean
    message: string
}

const ConfirmDeletionAlert = ({ onConfirmDelete, onCancelDelete, isVisible, message }: ConfirmDeletionAlertProps) => {
    const createTwoButtonAlert = () =>
        Alert.alert('Confirmation', message, [
            {
                text: 'Annuler',
                onPress: onCancelDelete,
                style: 'cancel'
            },
            { text: 'Supprimer ', onPress: onConfirmDelete, style: 'destructive' }
        ])

    if (isVisible) {
        createTwoButtonAlert()
    }
    return null
}

export default ConfirmDeletionAlert
