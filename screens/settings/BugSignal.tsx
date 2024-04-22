import { View } from 'react-native'
import { Stack, FormControl, Box, Select, CheckIcon, Center, TextArea } from 'native-base'
import { useTheme } from '@react-navigation/native'
import { auth } from '../../firebase'

import { useState } from 'react'
import SaveButton from '../../components/styled/SaveBouton'
import ConfirmDeletionAlert from '../../components/styled/ConfirmDeletionAlert'

export default function BugSignal({ route, navigation }: any) {
    const { colors } = useTheme()
    const [body, setBody] = useState('')
    const qcmId = route.params.qcmId

    const [saving, setSaving] = useState(false)



    const sendEmail = async () => {
        try {
            setSaving(true)
            const response = await fetch('https://us-central1-piato-prod.cloudfunctions.net/piatoContatAdminApp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    subject: "buig au niveau du qcm " + qcmId,
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
            navigation.goBack()
        }
    }
    return (
        <View>


            <Stack mx={4} mt={10} mb={4}>
                <FormControl.Label _text={{ color: colors.text }} isRequired>
                    Signaler un bug
                </FormControl.Label>

            </Stack>

            <Stack mx={4} mt={4} mb={4}>
                <Box alignItems="center" w="100%">
                    <TextArea h={20} style={{ color: colors.text, fontFamily: 'circular-std' }} placeholder="Saississez votre message" value={body} onChangeText={(text) => setBody(text)} isRequired />
                </Box>
            </Stack>

            <Stack m={4}>
                <Center>
                    <SaveButton handleSaveClick={sendEmail} saving={saving} isDisabled={!body} btnName="Envoyer" />
                </Center>
            </Stack>
        </View>
    )
}
