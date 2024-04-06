import React from 'react'
import { Text } from 'react-native'

interface SuccessBoxProps {
    message: string
}

export default function SuccessBox({ message }: SuccessBoxProps) {
    return <Text style={{ color: '#43a047', marginTop: 20, fontWeight: 'bold' }}>{message}</Text>
}
