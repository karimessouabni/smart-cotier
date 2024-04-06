import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { Colors, BorderRadiuses, View, Image, ListItem, Text, ProgressBar, AnimatedImage, AnimatedScanner } from 'react-native-ui-lib';
import { Chapter } from '../data/chapters';
import { MaterialIcons } from '@expo/vector-icons';
import ChapterService from '../services/ChapterService';


export default function HomeScreen({ navigation: { navigate } }: any) {

    const [chapters, setChapters] = useState<Chapter[]>([])


    useEffect(() => {

        const fetchChapters = async () => {
            const fetchedChapters = await ChapterService.fetchAllChapters()
            setChapters(fetchedChapters)
        }
        fetchChapters();

    }, [])

    const keyExtractor = (item: Chapter) => item.name;

    const renderRow = (row: Chapter, id: number) => {
        const statusColor = Colors.red30;

        return (
            <View>
                <ListItem
                    activeBackgroundColor={Colors.grey20}
                    activeOpacity={0.3}
                    height={77.5}
                    onPress={() => navigate('ChapterScreen', { chapterId: row.id, chapName: row.name })}
                >

                    <ListItem.Part left>
                        <AnimatedImage source={{ uri: row.img }} style={styles.image} />
                    </ListItem.Part>
                    <ListItem.Part middle column containerStyle={[styles.border, { paddingRight: 17 }]}>
                        <ListItem.Part containerStyle={{ marginBottom: 3 }}>
                            <Text grey10 text70 style={{ flex: 1, marginRight: 10 }} numberOfLines={1}>
                                {row.name}
                            </Text>
                            <View style={{ marginTop: 2 }}>
                                <MaterialIcons name="keyboard-arrow-right" size={24} color={Colors.green10} />
                            </View>
                        </ListItem.Part>
                        <ListItem.Part>
                            <Text
                                style={{ flex: 1, marginRight: 10 }}
                                text90
                                grey30
                                numberOfLines={1}
                            >{`${row.nbrLesson} séctions`}</Text>
                            <Text text90 color={statusColor} numberOfLines={1}>
                            </Text>
                        </ListItem.Part>
                        <View >
                            <AnimatedScanner
                                backgroundColor={Colors.green80}
                                progress={row.nbrLesson * 20}
                                duration={1600}
                                containerStyle={{ backgroundColor: "#15be53", height: 2 }}
                            />
                        </View>
                    </ListItem.Part>

                </ListItem>

            </View>
        );
    }



    return (
        chapters.length > 0 && <FlatList
            data={chapters}
            renderItem={({ item, index }) => renderRow(item, index)}
            keyExtractor={keyExtractor}
        />
    );
}


const getProgressColor = (progress: number) => {

    switch (true) {
        case progress >= 0 && progress <= 12:
            return Colors.yellow40;
        case progress >= 13 && progress <= 19:
            return Colors.yellow20;
        case progress >= 20 && progress <= 65:
            return Colors.orange30;
        case progress > 65:
            return Colors.green20;
        default:
            return Colors.green1;
    }
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