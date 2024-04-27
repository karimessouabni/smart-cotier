import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { Colors, BorderRadiuses, View, ListItem, Text, RadioButton } from 'react-native-ui-lib';
import { MaterialIcons } from '@expo/vector-icons';
import LessonService from '../services/LessonService';
import UserService from '../services/UserService';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Lesson, LessonProgression, Progress } from 'types';
import { useTheme } from '@react-navigation/native'
import ExpoInstaStory from 'expo-insta-story';

export type LessonScreenProps = {
    chapterId: string
    chapName: string
}

const data = [
    {
        id: 1,
        avatar_image:
            'https://firebasestorage.googleapis.com/v0/b/smart-cotier.appspot.com/o/Chapters%2Fsecuritemer%2F1.png?alt=media&token=988754cc-400e-48f4-8195-9cf02dea4ecd',
        user_name: 'cours 1',
        stories: [{ "duration": 10, "story": "https://firebasestorage.googleapis.com/v0/b/smart-cotier.appspot.com/o/Chapters%2Fintroduction%2F1.jpg?alt=media&token=6f9002a0-2238-4f1e-a58c-57412266e5dc", "story_id": 1 }, { "duration": 10, "story": "https://firebasestorage.googleapis.com/v0/b/smart-cotier.appspot.com/o/Chapters%2Fintroduction%2F2.jpg?alt=media&token=6f9002a0-2238-4f1e-a58c-57412266e5dc", "story_id": 2 }, { "duration": 10, "story": "https://firebasestorage.googleapis.com/v0/b/smart-cotier.appspot.com/o/Chapters%2Fintroduction%2F3.jpg?alt=media&token=6f9002a0-2238-4f1e-a58c-57412266e5dc", "story_id": 3 }],
    },
    {
        id: 2,
        avatar_image:
            'https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80',
        user_name: 'Test User',
        stories: [
            {
                story_id: 1,
                story:
                    'https://firebasestorage.googleapis.com/v0/b/smart-cotier.appspot.com/o/Chapters%2Fsecuritemer%2F1.png?alt=media&token=988754cc-400e-48f4-8195-9cf02dea4ecd',
                swipeText: 'Custom swipe text for this story',
                onPress: () => console.log('story 1 swiped'),
                duration: 10,
            }
        ],
    },
];

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
            fillStories(fetchedLessons, setStories);
        }

        const fetchChapterProgression = async () => {
            const fetchedChapProgres: LessonProgression[] = await UserService.fetchAllProgressionOfLessons(chapterId)
            setProgressions(fetchedChapProgres)
        }

        fetchChapters();
        fetchChapterProgression();
    }, [])


    const fillStories = (fetchedLessons: Lesson[], setStories: React.Dispatch<React.SetStateAction<LessonStories[]>>) => {
        let imageId = 1; // Start image ID from 1 and increment for each image
        let stroyId = 1;
        const lessonImagesList: LessonStories[] = fetchedLessons.map(lesson => ({
            id: stroyId++,
            user_name: "",
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
            {stories.length > 0 && <ExpoInstaStory data={stories} duration={10} unPressedBorderColor={colors.primary} storyImageStyle={{ objectFit: 'scale-down' }} />}
            <FlatList
                data={lessons}
                renderItem={({ item, index }) => renderRow(item, index)}
                keyExtractor={keyExtractor}
            />
        </>

    );
}


const styles = StyleSheet.create({
    image: {
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


