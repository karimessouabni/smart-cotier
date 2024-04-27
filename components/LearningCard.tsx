import _ from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Constants, Spacings, View, Text, Carousel, Image, Colors } from 'react-native-ui-lib';
import Markdown, { MarkdownIt } from 'react-native-markdown-display';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import UserService from '../services/UserService';
import { Lesson, Progress } from 'types';

import { useTheme } from '@react-navigation/native'
import { Button, Center, HStack } from 'native-base';
import MusicPlayer from './MusicPlayer';
import TrackPlayer, { Capability } from 'react-native-track-player';


export type LearningCardProps = {
    chapterId: string
    lesson: Lesson
    lessonProgress: Progress
}


export default function LearningCard({ route, navigation }: any) {
    const { lesson, chapterId, lessonProgress }: LearningCardProps = route.params
    const carousel = useRef(null);
    const { colors } = useTheme()
    const [fontSize, setFontSize] = useState(0);


    const setupPlayer = async () => {
        try {
            await TrackPlayer.setupPlayer();
            await TrackPlayer.updateOptions({

                capabilities: [
                    Capability.Play,
                    Capability.Pause,
                    Capability.SkipToNext,
                    Capability.SkipToPrevious
                ],
            });
            const track1 = {
                url: 'https://audiocdn.epidemicsound.com/ES_ITUNES/h8jx0H_18%20Karat/ES_18%20Karat.mp3',
                title: 'Avaritia',
                artist: 'deadmau5',
                album: 'while(1<2)',
                genre: 'Progressive House, Electro House',
                date: '2014-05-20T07:00:00+00:00', // RFC 3339
                artwork: 'http://example.com/cover.png', // Load artwork from the network
                duration: 402 // Duration in seconds
            };

            await TrackPlayer.add(track1);
            await TrackPlayer.play();

        } catch (error) {
            console.log(error)
            TrackPlayer.play();
        }
    };

    useEffect(() => {
        TrackPlayer.reset();

        const track1 = {
            url: 'https://audiocdn.epidemicsound.com/ES_ITUNES/h8jx0H_18%20Karat/ES_18%20Karat.mp3',
            title: 'Avaritia',
            artist: 'deadmau5',
            album: 'while(1<2)',
            genre: 'Progressive House, Electro House',
            date: '2014-05-20T07:00:00+00:00', // RFC 3339
            artwork: 'http://example.com/cover.png', // Load artwork from the network
            duration: 402 // Duration in seconds
        };
        // TrackPlayer.add(track1);
        // TrackPlayer.play();
    }, []);

    useEffect(() => {
        const updateHeaderOptions = () => {
            navigation.setOptions({
                headerRight: () => (
                    <HStack >
                        <Button.Group isAttached size="xs" pr={2} >
                            <Button onPress={() => setFontSize(prev => prev - 1)}>a</Button>
                            <Button onPress={() => setFontSize(prev => prev + 1)} variant="subtle">A</Button>
                        </Button.Group>
                        {lessonProgress === Progress.COMPLETED ?
                            <TouchableOpacity style={{ paddingRight: 20 }} onPress={() => showConfirmationDialogFoReset()}>
                                <HStack >
                                    <Text style={{ paddingTop: 4 }} text90BL color={colors.text}>Réouvrir </Text>
                                    <MaterialCommunityIcons color={colors.text} size={25} name={'restart'} />
                                </HStack>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity style={{ paddingRight: 20 }} onPress={() => showConfirmationDialogFoFinish()}>
                                <HStack >
                                    <Text style={{ paddingTop: 4 }} text90BL color={colors.switchOn}>Terminer </Text>
                                    <MaterialCommunityIcons color={colors.switchOn} size={25} name={'check-all'} />
                                </HStack>
                            </TouchableOpacity>}
                    </HStack>

                )
            })
        }

        updateHeaderOptions()
    }, [navigation])


    const showConfirmationDialogFoReset = () => {
        Alert.alert(
            "Rouvrir le chapitre",
            "Êtes-vous sûr de vouloir rouvrir ce chapitre ?",
            [
                // Bouton "Non"
                {
                    text: "Non",
                    onPress: () => console.log("Action annulée"),
                    style: "cancel"
                },
                // Bouton "Oui"
                {
                    text: "Oui",
                    onPress: () => restartChapter()
                }
            ],
            { cancelable: true }
        );
    }

    const showConfirmationDialogFoFinish = () => {
        Alert.alert(
            "Confirmer la fin du chapitre",
            "Êtes-vous sûr de vouloir marquer ce chapitre comme terminé ?",
            [
                // Bouton "Non"
                {
                    text: "Non",
                    onPress: () => console.log("Action annulée"),
                    style: "cancel"
                },
                // Bouton "Oui"
                {
                    text: "Oui",
                    onPress: () => finishChapter()
                }
            ],
            { cancelable: true }
        );
    }



    const finishChapter = async () => {
        console.log("teminien")
        await UserService.updateLessonProgression({ chapterId: chapterId, lessonId: lesson.id, progress: Progress.COMPLETED })
        await UserService.increaseChapterProgression(chapterId)

        navigation.goBack()
    }

    const restartChapter = async () => {
        await UserService.updateLessonProgression({ chapterId: chapterId, lessonId: lesson.id, progress: Progress.IN_PROGRESS })
        await UserService.decreaseChapterProgression(chapterId)
        // await UserService.setupProgressToZero()
        navigation.goBack()
    }


    const getWidth = () => {
        return Constants.windowWidth - Spacings.s5 * 2;
    };


    const formatStr = (): String => {
        return lesson.text1.replaceAll('\\n', '\n');
        // .split('**'); // Split by the style indicator, assuming it's always "**"

    }


    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <Text text30M color={colors.primary} margin-15>{lesson.name}</Text>

            {/* <Text grey10 text70L margin-15> */}

            <Markdown
                markdownit={
                    MarkdownIt({ typographer: true })
                }
                style={{
                    body: { color: colors.text, fontSize: 14 + fontSize, paddingHorizontal: 15 },
                    heading3: { color: colors.secondary, fontFamily: 'poppinsm', paddingTop: 20, paddingBottom: 5 },
                    code_block: { color: colors.text, fontSize: 14 + fontSize }
                }}>
                {`${formatStr()}`}

            </Markdown>


            <Carousel
                key={0}
                ref={carousel}
                pageWidth={getWidth()}
                itemSpacings={Spacings.s3}
                containerStyle={{ paddingTop: 20, height: 460, width: 400 }}
                pageControlPosition={Carousel.pageControlPositions.UNDER}>
                {lesson.imgs && lesson.imgs.length > 0 && lesson.imgs.map((uri, index) => (
                    <Page key={index} style={{ flex: 1, justifyContent: 'top', alignItems: 'top' }}>
                        <Image
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

