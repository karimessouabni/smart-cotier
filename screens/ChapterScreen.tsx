import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { Colors, BorderRadiuses, View, ListItem, Text, RadioButton } from 'react-native-ui-lib';
import { ChapterProgression, Lesson, Progress } from '../data/chapters';
import { MaterialIcons } from '@expo/vector-icons';
import LessonService from '../services/LessonService';
import UserService from '../services/UserService';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

export type LessonScreenProps = {
    chapterId: string
    chapName: string
}

export default function ChapterScreen({ route, navigation }: any) {
    const { chapterId }: LessonScreenProps = route.params
    const [lessons, setLessons] = useState<Lesson[]>([])
    const [progressions, setProgressions] = useState<ChapterProgression[]>([])


    useFocusEffect(
        React.useCallback(() => {
            const fetchChapterProgression = async () => {
                const fetchedChapProgres: ChapterProgression[] = await UserService.fetchAllProgressionOfChapter(chapterId)
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
        }

        const fetchChapterProgression = async () => {
            const fetchedChapProgres: ChapterProgression[] = await UserService.fetchAllProgressionOfChapter(chapterId)
            setProgressions(fetchedChapProgres)
        }

        fetchChapters();
        fetchChapterProgression();
    }, [])


    const checkLessonProgress = (lessonId: string): boolean => {
        return progressions.find(p => p.lessonId == lessonId)?.progress == Progress.COMPLETED ? true : false;
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
                    onPress={() => navigation.navigate('LearningCard', { chapterId: chapterId, lesson: lesson })}

                >

                    <ListItem.Part left >
                        <RadioButton containerStyle={{ margin: 10 }} selected={checkLessonProgress(lesson.id)} color='#30ba37' size={18} />
                    </ListItem.Part>
                    <ListItem.Part middle column containerStyle={[styles.border, { paddingRight: 17 }]}>
                        <ListItem.Part containerStyle={{ marginBottom: 3 }}>
                            <Text grey10 text70 style={{ flex: 1, marginRight: 10 }} numberOfLines={1}>
                                {lesson.name}
                            </Text>
                            <View style={{ marginTop: 2 }}>
                                <MaterialIcons name="keyboard-arrow-right" size={24} color="#15be53" />
                            </View>
                        </ListItem.Part>
                        <ListItem.Part>
                            <Text
                                style={{ flex: 1, marginRight: 10 }}
                                text90
                                grey30
                                numberOfLines={1}
                            >{`en cours`}</Text>
                            <Text text90 color={statusColor} numberOfLines={1}>
                            </Text>
                        </ListItem.Part>
                    </ListItem.Part>
                </ListItem>

            </View>
        );
    }


    return (
        <FlatList
            data={lessons}
            renderItem={({ item, index }) => renderRow(item, index)}
            keyExtractor={keyExtractor}
        />
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