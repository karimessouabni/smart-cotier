import _ from 'lodash';
import React, { Component, useEffect, useRef, useState } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { Constants, Spacings, View, Text, Carousel, Image, Colors } from 'react-native-ui-lib';
import { renderBooleanOption, renderSliderOption } from './ExampleScreenPresenter';
import LearningCardService from '../services/LearningCardService';
import { Lesson } from '../data/chapters';
import Markdown, { MarkdownIt } from 'react-native-markdown-display';


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
    const { lesson }: any = route.params

    const carousel = useRef(null);
    const [firstText, setFirstText] = useState<String>("")


    // useEffect(() => {

    //     const fetchChapters = async () => {
    //         const fetchedText1 = await LearningCardService.fetchFirstText(chapterId, lessonId)
    //         setFirstText(fetchedText1)
    //         console.log(fetchedText1)

    //     }
    //     fetchChapters();

    // }, [])


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

            {/* {formatStr().map((part, index) => {
                    const isBold = index % 2 !== 0; // Every second part will be between "**", thus bold
                    return (
                        <Markdown>
                            {part}
                        </Markdown>
                        // <Text key={index} style={isBold ? { fontWeight: 'bold' } : {}}>
                        //     {part}
                        // </Text>
                    );
                })} */}

            {/* </Text> */}
            <Carousel
                key={3}
                ref={carousel}
                pageWidth={getWidth()}
                itemSpacings={Spacings.s3}
                containerStyle={{ paddingTop: 100, height: 460 }}
                pageControlPosition={Carousel.pageControlPositions.UNDER}

            >
                {_.map([...Array(3)], (_item, index) => (
                    <Page style={{ backgroundColor: BACKGROUND_COLORS[index] }} key={index}>
                        <Image
                            overlayType={Image.overlayTypes.BOTTOM}
                            style={{ flex: 1 }}
                            source={{
                                uri: IMAGES[index]
                            }}
                        />
                        <Text margin-15>{index}/{3}</Text>

                    </Page>
                ))}
            </Carousel>







        </ScrollView >
    );

}

// @ts-ignore
const Page = ({ children, style, ...others }) => {
    return (
        <View {...others} style={[styles.page, style]}>
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
        borderWidth: 1,
        borderRadius: 8
    },
    loopCarousel: {
        position: 'absolute',
        bottom: 15,
        left: 10
    }
});

