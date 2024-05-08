import _ from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Alert, ImageBackground, Dimensions } from 'react-native';
import { Constants, Spacings, View, Text, Image } from 'react-native-ui-lib';
import Markdown, { MarkdownIt } from 'react-native-markdown-display';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import UserService from '../services/UserService';
import { Lesson, Progress } from 'types';
import * as Haptics from 'expo-haptics';

import { useTheme } from '@react-navigation/native'
import { Button, Center, HStack } from 'native-base';
import MusicPlayer from './MusicPlayer';
import TrackPlayer, { Capability } from 'react-native-track-player';
import GradientText from '../providers/GradientText';
import { LinearGradient } from 'expo-linear-gradient';
import Carousel from 'react-native-reanimated-carousel';


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
    const { width, height } = Dimensions.get('window');


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

                    <LinearGradient
                        colors={["#00A0F4", "#00D6DF"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}>
                        <HStack>
                            <Button.Group isAttached size="xs" pr={10} >


                                <Button pr={5} onPress={() => { setFontSize(prev => prev - 1) }} backgroundColor={'transparent'} >A-</Button>
                                <Button onPress={() => setFontSize(prev => prev + 1)} backgroundColor={'transparent'} >A+</Button>


                            </Button.Group>

                            {lessonProgress === Progress.COMPLETED ?
                                <TouchableOpacity style={{ paddingRight: 20 }} onPress={() => showConfirmationDialogFoReset()}>
                                    <HStack >
                                        <Text style={{ paddingTop: 8 }} text90BL color={'white'}>Réouvrir </Text>
                                        <MaterialCommunityIcons style={{ paddingTop: 6 }} color={'white'} size={20} name={'restart'} />
                                    </HStack>
                                </TouchableOpacity>
                                :
                                <TouchableOpacity style={{ paddingRight: 20 }} onPress={() => showConfirmationDialogFoFinish()}>
                                    <HStack >
                                        <Text style={{ paddingTop: 8 }} text90BL color={'white'}>Terminer </Text>
                                        <MaterialCommunityIcons color={'white'} size={25} name={'check-all'} />
                                    </HStack>
                                </TouchableOpacity>}

                        </HStack>
                    </LinearGradient>

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
        <View style={styles.container}>

            {/* <ImageBackground source={require('../assets/adaptive-icon.png')} style={styles.backgroundImage}> */}
            <Image
                source={require('../assets/adaptive-icon.png')}
                style={styles.fixedImage}
            />
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <GradientText text={lesson.name} />
                <Markdown
                    markdownit={
                        MarkdownIt({ typographer: true })
                    }
                    style={{
                        body: { color: colors.text, fontSize: 14 + fontSize, paddingHorizontal: 15 },
                        heading3: { color: colors.secondary, fontFamily: 'centraleSansB', paddingTop: 20, paddingBottom: 5 },
                        code_block: { color: colors.text, fontSize: 14 + fontSize, fontFamily: 'centraleSansB' }
                    }}>
                    {`${formatStr()}`}

                </Markdown>



                {lesson.imgs && lesson.imgs.length > 0 && <Carousel
                    loop
                    width={width}
                    height={width}
                    data={lesson.imgs}
                    mode="parallax"
                    modeConfig={{
                        parallaxScrollingScale: 0.9,
                        parallaxScrollingOffset: 50,
                    }}
                    onSnapToItem={(index) => console.log('current index:', index)}
                    renderItem={(data) => (
                        <View
                            style={{
                                flex: 1,
                                justifyContent: 'center',
                            }}
                        >
                            <Image
                                style={{ position: 'absolute', width: '100%', height: '100%' }}
                                source={{
                                    uri: data.item
                                }}
                            />

                        </View>
                    )}
                />}

            </ScrollView >

            {/* </ImageBackground> */}
        </View>
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
    container: {
        flex: 1, // Use flex to expand container to full screen
        backgroundColor: '#fff', // Background color of the container
    },
    scrollView: {
        flex: 1, // Make ScrollView flexible
        backgroundColor: 'transparent', // Ensure background is transparent
    },
    text: {
        fontSize: 20,
        textAlign: 'center',
        margin: 20,
    },
    fixedImage: {
        position: 'absolute', // Absolute positioning to place it over the content
        right: 0, // Align to the right
        bottom: 0, // Align to the bottom
        width: 100, // Set width of the image
        height: 100, // Set height of the image
        opacity: 0.2
    },
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

