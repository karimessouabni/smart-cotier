import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { Colors, BorderRadiuses, View, ListItem, Text, RadioButton } from 'react-native-ui-lib';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import LessonService from '../services/LessonService';
import { useFocusEffect } from '@react-navigation/native';
import { Lesson, LessonProgression, Progress, Quiz } from 'types';
import { useTheme } from '@react-navigation/native'
import ExpoInstaStory from 'expo-insta-story';
import { Button, Fab, Icon } from 'native-base';
import UserService from '../services/UserService';
import QuizService from 'services/QuizService';
import { LinearGradient } from 'expo-linear-gradient';


export type LessonScreenProps = {
    chapterId: string
    chapName: string
}


type LessonStories = {
    id: number;
    avatar_image: string;
    user_name: string;
    stories: Story[];
};


type Story = {
    story_id: number;
    story: string;
    duration: number;
};

export default function ChapterScreen({ route, navigation }: any) {
    const { chapterId }: LessonScreenProps = route.params
    const [lessons, setLessons] = useState<Lesson[]>([])
    const [stories, setStories] = useState<LessonStories[]>([])
    const [quiz, setQuiz] = useState<Quiz>()

    const [progressions, setProgressions] = useState<LessonProgression[]>([])
    const { colors } = useTheme()


    useFocusEffect(
        React.useCallback(() => {
            const fetchChapterProgression = async () => {
                const fetchedChapProgres: LessonProgression[] = await UserService.fetchAllProgressionOfLessons(chapterId)
                setProgressions(fetchedChapProgres)
            }
            fetchChapterProgression();
            return () => {
            };
        }, [])
    );

    useEffect(() => {

        const fetchChapters = async () => {
            const fetchedLessons = await LessonService.fetchAllLessonOfChapter(chapterId)
            setLessons(fetchedLessons)
            fillStories(fetchedLessons);
        }

        const fetchChapterProgression = async () => {
            const fetchedChapProgres: LessonProgression[] = await UserService.fetchAllProgressionOfLessons(chapterId)
            setProgressions(fetchedChapProgres)
        }

        const fetchChapterQuiz = async () => {
            const fetchedQuiz: Quiz | null = await QuizService.fetchQuizOfChapter(chapterId)
            fetchedQuiz && setQuiz(fetchedQuiz)
            console.log(fetchedQuiz)
        }

        fetchChapterQuiz()
        fetchChapters()
        fetchChapterProgression()
    }, [])


    const fillStories = (fetchedLessons: Lesson[]) => {
        let imageId = 1; // Start image ID from 1 and increment for each image
        let stroyId = 1;
        const lessonImagesList: LessonStories[] = fetchedLessons.map(lesson => ({
            id: stroyId++,
            user_name: lesson.name,
            avatar_image: lesson.imgs[0],
            stories: lesson.imgs.map(img => ({
                story_id: imageId++, // Generate unique ID for each image
                story: img,
                duration: 10
            } as Story))
        }));
        setStories(prev => lessonImagesList);
    }
    const checkLessonProgress = (lessonId: string): boolean => {
        return progressions.find(p => p.lessonId == lessonId)?.progress == Progress.COMPLETED ? true : false;
    }

    const getLessonProgressMsg = (lessonId: string): string => {
        const progress = progressions.find(p => p.lessonId == lessonId)?.progress
        switch (progress) {
            case Progress.IN_PROGRESS: {
                return "en cours"
            }
            case Progress.COMPLETED: {
                return "terminé"
            }
            default: {
                return "non commencé"
            }
        }
    }


    const getLessonProgress = (lessonId: string): Progress => {
        return progressions.find(p => p.lessonId == lessonId)?.progress || Progress.ZERO;
    }

    const keyExtractor = (item: Lesson) => item.name;

    const renderRow = (lesson: Lesson, id: number) => {
        const statusColor = Colors.red30;

        return (
            lessons.length > 0 && <View>

                <ListItem
                    activeBackgroundColor={Colors.grey20}
                    activeOpacity={0.3}
                    height={77.5}
                    onPress={() => navigation.navigate('LearningCard', { chapterId: chapterId, lesson: lesson, lessonProgress: getLessonProgress(lesson.id) })} >

                    <ListItem.Part left >
                        <RadioButton containerStyle={{ margin: 10 }} selected={checkLessonProgress(lesson.id)} color={colors.primary} size={18} />
                    </ListItem.Part>
                    <ListItem.Part middle column containerStyle={[styles.border, { paddingRight: 17 }]}>
                        <ListItem.Part containerStyle={{ marginBottom: 3 }}>
                            <Text color={colors.text}
                                text70 style={{ flex: 1, marginRight: 10 }} numberOfLines={1}>
                                {lesson.name}
                            </Text>
                            <View style={{ marginTop: 2 }}>
                                <MaterialIcons name="keyboard-arrow-right" size={24} color={colors.primary} />
                            </View>
                        </ListItem.Part>
                        <ListItem.Part>
                            <Text
                                style={{ flex: 1, marginRight: 10 }}
                                text90
                                color={colors.secondaryText}
                                numberOfLines={1}
                            >{getLessonProgressMsg(lesson.id)}</Text>
                            <Text text90 color={statusColor} numberOfLines={1}>
                            </Text>
                        </ListItem.Part>
                    </ListItem.Part>

                </ListItem>

            </View>
        );
    }


    return (
        <>
            {stories.length > 0 &&
                <ExpoInstaStory data={stories} duration={5} unPressedBorderColor={colors.secondary} storyImageStyle={{ objectFit: 'scale-down' }} />
            }
            <FlatList
                data={lessons}
                renderItem={({ item, index }) => renderRow(item, index)}
                keyExtractor={keyExtractor}
            />

            <LinearGradient
                colors={["#00A0F4", "#00D6DF"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}>
                <Button textAlign={'center'} alignContent={'center'} p={2} pb={7} pt={5}
                    onPress={() => navigation.navigate('QcmScreen', { quiz: quiz, chapterId: chapterId })} variant="solid" backgroundColor='transparent' borderRadius={0} endIcon={<Icon as={Ionicons} name="boat" size="lg" />}>


                    <Text color={"white"}
                        text60M style={{ flex: 1, marginRight: 10 }} numberOfLines={1}>
                        Lancer un test pour ce chapitre
                    </Text>

                </Button>
            </LinearGradient>
        </>

    );
}


const styles = StyleSheet.create({

    linearGradient: {
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 5
    },
    buttonText: {
        fontSize: 18,
        fontFamily: 'Gill Sans',
        textAlign: 'center',
        margin: 10,
        color: '#ffffff',
        backgroundColor: 'transparent',
    }, image: {
        width: 54,
        height: 54,
        borderRadius: BorderRadiuses.br20,
        marginHorizontal: 14
    },
    border: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: Colors.grey70
    }
});


