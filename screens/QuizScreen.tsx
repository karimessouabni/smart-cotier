import React, { useEffect, useState } from "react";
import { View, AnimatedImage, Colors, Gradient, Text } from "react-native-ui-lib";
import { VStack, Box, Divider, AspectRatio, Center, Heading, Stack, Image, HStack } from 'native-base';
import { AreaChart, Grid, ProgressCircle, LineChart } from 'react-native-svg-charts'

import QuizService from "../services/QuizService";
import { ScrollView } from "react-native-gesture-handler";
import { Pressable, RefreshControl } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Quiz, UserQuizResult } from "types";
import * as shape from 'd3-shape'
import UserService from "services/UserService";
import { useFocusEffect } from '@react-navigation/native';



export default function QuizScreen({ route, navigation }: any) {

    const [refreshOnGoBack, setRefreshOnGoBack] = useState<boolean>(false)
    const [refreshing, setRefreshing] = React.useState(false);
    const [quizList, setQuizList] = useState<Quiz[][]>([])

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
        const fetchQuizList = async () => {
            const fetchedQuizzes = await QuizService.fetchAllQuiz()
            const quizMatrix: Quiz[][] = []; // Initialiser la matrice de quizz

            const promises = fetchedQuizzes.map(async (q) => {
                const rates: number[] = await UserService.fetchScoreRateForAQuiz(q.id);
                console.log(rates)
                return { ...q, userRate: [0, ...rates] }
            });
            const quizListWithUserHistory = await Promise.all(promises);


            for (let i = 0; i < quizListWithUserHistory.length; i += 2) {
                const row = quizListWithUserHistory.slice(i, i + 2);
                quizMatrix.push(row); // Ajouter cette ligne à la matrice de quizz
            }

            setQuizList(quizMatrix)
        }

        fetchQuizList();
    }, [refreshOnGoBack])



    const renderRow = (quizTabOf2: Quiz[], index: number) =>
        <View key={index} row margin-10>


            {quizTabOf2.map((quiz, index) =>
                <Pressable
                    flex={1} borderRadius="md"
                    borderWidth={0}
                    paddingRight={index % 2 == 0 ? 2 : 0}
                    style={{ shadowRadius: 0, shadowColor: Colors.grey10 }}
                    onPress={() => navigation.navigate('QcmComonent', { quiz: quiz })}>
                    <Box alignItems="center">
                        <Box maxW="80" rounded="lg" overflow="hidden" borderColor="coolGray.200" borderWidth="1" _light={{
                            backgroundColor: "gray.50"
                        }}>
                            <Box>
                                <AspectRatio marginTop={2} w="100%" ratio={16 / 9}>
                                    <LineChart
                                        style={{ height: 50 }}
                                        data={quiz.userRate ? quiz.userRate : [0, 0]}
                                        numberOfTicks={0}
                                        svg={{ stroke: Colors.green30 }}
                                        curve={shape.curveNatural} />
                                </AspectRatio>
                                <Center bg="green.200" _text={{
                                    fontWeight: "300",
                                    fontSize: "xs"
                                }} position="absolute" bottom="0" px="2" py="0.5">
                                    Evolution
                                </Center>
                            </Box>
                            <Stack p="4" space={3}>
                                <Stack space={2}>
                                    <Heading size="md">
                                        Test blanc {quiz.order}
                                    </Heading>
                                </Stack>

                                <HStack alignItems="center" space={2} >
                                    <HStack alignItems="center" >
                                        <Text text90>
                                            {quiz.userRate.length > 1 && 'Dernier score : '}
                                        </Text><Text color="coolGray.600" text90>
                                            {quiz.userRate.length > 1 ? `${quiz.userRate[quiz.userRate.length - 1]}%` : "Commencer le test"}
                                        </Text>

                                    </HStack>
                                </HStack>
                            </Stack>
                        </Box>
                    </Box>

                </Pressable>
            )
            }

        </View >
    return (
        <View marginT-10 >
            <ScrollView refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            } showsVerticalScrollIndicator={false}>

                {quizList.map((q, index) => renderRow(q, index))}
            </ScrollView>

        </View>

    )
}