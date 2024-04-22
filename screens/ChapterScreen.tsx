import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { Colors, BorderRadiuses, View, ListItem, Text, RadioButton } from 'react-native-ui-lib';
import { MaterialIcons } from '@expo/vector-icons';
import LessonService from '../services/LessonService';
import UserService from '../services/UserService';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Lesson, LessonProgression, Progress } from 'types';
import { useTheme } from '@react-navigation/native'

export type LessonScreenProps = {
    chapterId: string
    chapName: string
}

export default function ChapterScreen({ route, navigation }: any) {
    const { chapterId }: LessonScreenProps = route.params
    const [lessons, setLessons] = useState<Lesson[]>([])
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
        }

        const fetchChapterProgression = async () => {
            const fetchedChapProgres: LessonProgression[] = await UserService.fetchAllProgressionOfLessons(chapterId)
            setProgressions(fetchedChapProgres)
        }

        fetchChapters();
        fetchChapterProgression();
    }, [])


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