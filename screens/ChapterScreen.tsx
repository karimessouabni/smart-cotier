import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { Colors, BorderRadiuses, View, ListItem, Text, RadioButton } from 'react-native-ui-lib';
import { Lesson } from '../data/chapters';
import { MaterialIcons } from '@expo/vector-icons';
import LessonService from '../services/LessonService';

export type LessonScreenProps = {
    chapterId: string
    chapName: string
}

export default function ChapterScreen({ route, navigation }: any) {
    const { chapterId }: LessonScreenProps = route.params
    const [lessons, setChapters] = useState<Lesson[]>([])


    useEffect(() => {

        const fetchChapters = async () => {
            const fetchedLessons = await LessonService.fetchAllLessonOfChapter(chapterId)
            setChapters(fetchedLessons)
        }
        fetchChapters();

    }, [])

    const keyExtractor = (item: Lesson) => item.name;

    const renderRow = (row: Lesson, id: number) => {
        const statusColor = Colors.red30;

        return (
            lessons.length > 0 && <View>
                <ListItem
                    activeBackgroundColor={Colors.grey20}
                    activeOpacity={0.3}
                    height={77.5}
                    onPress={() => navigation.navigate('LearningCard', { lesson: row })}

                >

                    <ListItem.Part left >
                        <RadioButton containerStyle={{ margin: 10 }} selected={false} color='#30ba37' size={18} />
                    </ListItem.Part>
                    <ListItem.Part middle column containerStyle={[styles.border, { paddingRight: 17 }]}>
                        <ListItem.Part containerStyle={{ marginBottom: 3 }}>
                            <Text grey10 text70 style={{ flex: 1, marginRight: 10 }} numberOfLines={1}>
                                {row.name}
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