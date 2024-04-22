import { View } from 'react-native'
import { Stack, FormControl, Box, Select, CheckIcon, Center, TextArea } from 'native-base'
import { useTheme } from '@react-navigation/native'
import { auth } from '../../firebase'

import { useState } from 'react'
import SaveButton from '../../components/styled/SaveBouton'
import ConfirmDeletionAlert from '../../components/styled/ConfirmDeletionAlert'

export default function Contact({ route, navigation }: any) {
    const { colors } = useTheme()
    const [subject, setSubject] = useState('')
    const [body, setBody] = useState('')
    const [saving, setSaving] = useState(false)
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)

    const handleSubmit = async () => {
        // Construct the email body from form data
        subject == 'Demander la suppression du compte' ? setIsDeleteModalVisible(true) : sendEmail()
    }

    const sendEmail = async () => {
        setIsDeleteModalVisible(false)
        try {
            setSaving(true)
            const response = await fetch('https://us-central1-piato-prod.cloudfunctions.net/piatoContatAdminApp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    subject: subject,
                    uid: auth.currentUser?.uid,
                    body: body
                })
            })

            if (response.ok) {
                console.log('Form submitted successfully')
                // Handle success
            } else {
                console.log('Form submission failed')
                // Handle error
            }
        } catch (error) {
            console.error('Error:', error)
        } finally {
            setSaving(false)
            setIsDeleteModalVisible(false)
            navigation.goBack()
        }
    }
    return (
        <View>
            <ConfirmDeletionAlert
                onConfirmDelete={() => sendEmail()}
                onCancelDelete={() => setIsDeleteModalVisible(false)}
                isVisible={isDeleteModalVisible}
                message={`Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible et entraînera la suppression permanente de toutes vos données personnelles et de votre historique sur notre application. Si vous avez des abonnements actifs, ils seront annulés.`}
            />
            {/* <ComminSoon width={300} height={300} /> */}

            <Stack mx={4} mt={10} mb={4}>
                <FormControl.Label _text={{ color: colors.text }} isRequired>
                    Choisir un sujet
                </FormControl.Label>
                <Box maxW="400">
                    <Select
                        selectedValue={subject}
                        minWidth="200"
                        accessibilityLabel="Choisir un sujet"
                        placeholder="Choisissez un sujet"
                        _selectedItem={{
                            bg: 'blue',
                            color: 'white',
                            fontFamily: 'circular-std',
                            endIcon: <CheckIcon size="5" />
                        }}
                        mt={1}
                        style={{ margin: 10, color: colors.text, fontFamily: 'circular-std' }}
                        onValueChange={(subject) => setSubject(subject)}>
                        <Select.Item style={{ color: colors.text, fontFamily: 'circular-std' }} label="Signaler un bug" value={'Signaler un bug'} />
                        <Select.Item style={{ color: colors.text, fontFamily: 'circular-std' }} label="Suggérer une fonctionnalité" value={'Suggérer une fonctionnalité'} />
                        <Select.Item style={{ color: colors.text, fontFamily: 'circular-std' }} label="Demander la suppression du compte" value={'Demander la suppression du compte'} />
                    </Select>
                </Box>
            </Stack>

            <Stack mx={4} mt={4} mb={4}>
                <Box alignItems="center" w="100%">
                    <TextArea h={20} style={{ color: colors.text, fontFamily: 'circular-std' }} placeholder="Saississez votre message" value={body} onChangeText={(text) => setBody(text)} isRequired />
                </Box>
            </Stack>

            <Stack m={4}>
                <Center>
                    <SaveButton handleSaveClick={handleSubmit} saving={saving} isDisabled={!subject || !body} btnName="Envoyer" />
                </Center>
            </Stack>
        </View>
    )
}
