import React from 'react';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@react-navigation/native'
import { Constants, Spacings, View, Text, Carousel, Image, Colors } from 'react-native-ui-lib';


const GradientText = (props: any) => {
    const { colors } = useTheme()

    return (
        <MaskedView maskElement={<Text text30M margin-15 style={[props.styles, { backgroundColor: 'transparent' }]} >{props.text} </Text>}>
            <LinearGradient
                colors={["#00A0F4", "#00D6DF"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}>
                <Text text30M margin-15 style={[props.style, { opacity: 0 }]}>{props.text}</Text>
            </LinearGradient>
        </MaskedView>
    );
};

export default GradientText;