import _ from 'lodash';
import React, { Component, useEffect, useRef, useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Constants, Spacings, View, Text, Carousel, Image, Colors } from 'react-native-ui-lib';
import { renderBooleanOption, renderSliderOption } from './ExampleScreenPresenter';
import LearningCardService from '../services/LearningCardService';
import { Lesson } from '../data/chapters';
import Markdown, { MarkdownIt } from 'react-native-markdown-display';
import { MaterialCommunityIcons } from '@expo/vector-icons';


const IMAGES = [
    'https://images.pexels.com/photos/6785289/pexels-photo-6785289.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/5560909/pexels-photo-5560909.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/5416342/pexels-photo-5416342.jpeg?auto=compress&cs=tinysrgb&w=800'
];
const BACKGROUND_COLORS = [
    Colors.red50,
    Colors.yellow20,
    Colors.purple50,
    Colors.green50,
    Colors.cyan50,
    Colors.purple20,
    Colors.blue60,
    Colors.red10,
    Colors.green20,
    Colors.purple60
];

export type LearningCardProps = {
    lesson: Lesson
}


export default function LearningCard({ route, navigation }: any) {
    const { lesson }: LearningCardProps = route.params
    const carousel = useRef(null);
    const [firstText, setFirstText] = useState<String>("")


    useEffect(() => {
        const updateHeaderOptions = () => {
            navigation.setOptions({
                // headerTitle: () => <>{<Text style={{ color: Colors.black }}>{label || 'Faites votre choix'}</Text>}</>,
                headerRight: () => (
                    <TouchableOpacity style={{ paddingRight: 20 }} onPress={() => navigation.goBack()}>
                        <MaterialCommunityIcons color={Colors.green10} size={25} name={'check-all'} />
                    </TouchableOpacity>
                )
            })
        }

        updateHeaderOptions()
    }, [navigation])


    const getWidth = () => {
        return Constants.windowWidth - Spacings.s5 * 2;
    };


    const formatStr = (): String => {
        return lesson.text1.replaceAll('\\n', '\n');
        // .split('**'); // Split by the style indicator, assuming it's always "**"

    }


    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <Text text30M style={{ color: "#0a2540" }} margin-15>{lesson.name}</Text>

            {/* <Text grey10 text70L margin-15> */}
            <Markdown style={{
                body: { color: "#425466", paddingHorizontal: 15 },
                heading3: { color: '#15be53', fontFamily: 'poppinsm', paddingTop: 20, paddingBottom: 5 },
                code_block: { color: 'black', fontSize: 14 }
            }}>
                {`${formatStr()}`}

            </Markdown>


            <Carousel
                key={0}
                ref={carousel}
                pageWidth={getWidth()}
                itemSpacings={Spacings.s3}
                containerStyle={{ paddingTop: 20, height: 460, width: 400 }}
                pageControlPosition={Carousel.pageControlPositions.UNDER}

            >
                {lesson.imgs && lesson.imgs.length > 0 && lesson.imgs.map((uri, index) => (
                    <Page key={index} style={{ flex: 1, justifyContent: 'top', alignItems: 'top' }}>
                        <Image
                            overlayType={Image.overlayTypes.BOTTOM}
                            style={{ position: 'absolute', width: '100%', height: '100%' }}
                            source={{
                                uri: uri
                            }}
                        />
                        {/* <Text text80 color={Colors.green1} style={{ position: 'absolute', textAlign: 'left' }} padding-35>{index}/{3}</Text> */}

                    </Page>
                ))}
            </Carousel>







        </ScrollView >
    );

}

// @ts-ignore
const Page = ({ children, style, ...others }) => {
    return (
        <View {...others} style={{ flex: 1 }}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    picker: {
        marginHorizontal: 20
    },
    page: {
        flex: 1,
    },
    loopCarousel: {
        position: 'absolute',
        bottom: 15,
        left: 10
    }
});

