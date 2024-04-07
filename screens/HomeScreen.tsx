import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Colors, BorderRadiuses, View, Image, ListItem, Text, ProgressBar, AnimatedImage, AnimatedScanner } from 'react-native-ui-lib';
import { Chapter } from '../data/chapters';
import { MaterialIcons } from '@expo/vector-icons';
import ChapterService from '../services/ChapterService';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

export default function HomeScreen({ navigation: { navigate } }: any) {

    const [chapters, setChapters] = useState<Chapter[]>([])
    const [refreshOnGoBack, setRefreshOnGoBack] = useState<boolean>(false)
    const [refreshing, setRefreshing] = React.useState(false);

    useFocusEffect(
        React.useCallback(() => {
            setRefreshOnGoBack(prev => !prev)
            return () => {
            };
        }, [])
    );

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

    useEffect(() => {
        const fetchChapters = async () => {
            const fetchedChapters = await ChapterService.fetchAllChaptersWithProgress()
            setChapters(fetchedChapters)
        }
        fetchChapters();

    }, [refreshOnGoBack])

    const keyExtractor = (item: Chapter) => item.name;

    const renderRow = (chapter: Chapter, id: number) => {
        const statusColor = Colors.red30;

        return (
            <View>
                <ListItem
                    activeBackgroundColor={Colors.grey20}
                    activeOpacity={0.3}
                    height={77.5}
                    onPress={() => navigate('ChapterScreen', { chapterId: chapter.id, chapName: chapter.name })}
                >

                    <ListItem.Part left>
                        <AnimatedImage source={{ uri: chapter.img }} style={styles.image} />
                    </ListItem.Part>
                    <ListItem.Part middle column containerStyle={[styles.border, { paddingRight: 17 }]}>
                        <ListItem.Part containerStyle={{ marginBottom: 3 }}>
                            <Text grey10 text70 style={{ flex: 1, marginRight: 10 }} numberOfLines={1}>
                                {chapter.name}
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
                            >{`${chapter.nbrLesson} séctions`}</Text>
                            <Text text90 color={statusColor} numberOfLines={1}>
                            </Text>
                        </ListItem.Part>
                        <View >
                            <AnimatedScanner
                                backgroundColor={Colors.green80}
                                progress={chapter.progress / chapter.nbrLesson * 100}
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
            contentContainerStyle={styles.scrollView}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            } />
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