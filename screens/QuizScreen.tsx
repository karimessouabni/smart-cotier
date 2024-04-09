import React, { useEffect, useState } from "react";
import { View, AnimatedImage, Colors, Gradient, Text } from "react-native-ui-lib";
import { VStack, Box, Divider, AspectRatio, Center, Heading, Stack, Image, HStack } from 'native-base';
import { AreaChart, Grid, ProgressCircle, LineChart } from 'react-native-svg-charts'

import QuizService from "../services/QuizService";
import { ScrollView } from "react-native-gesture-handler";
import { Pressable } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Quiz } from "types";
import * as shape from 'd3-shape'



export default function QuizScreen({ route, navigation }: any) {

    const data = [0, 30, 50, 40, 95, 25, 40, 80]
    const fill = Colors.green30

    const cardImage = require('../assets/icon.png');
    const quizImage = require('../assets/images/quiz.png'); // eslint-disable-line


    const [quizList, setQuizList] = useState<Quiz[][]>([])


    useEffect(() => {
        const fetchChapters = async () => {
            const fetchedQuizzes = await QuizService.fetchAllQuiz()
            const quizMatrix: Quiz[][] = []; // Initialiser la matrice de quizz
            for (let i = 0; i < fetchedQuizzes.length; i += 2) {
                const row = fetchedQuizzes.slice(i, i + 2);
                quizMatrix.push(row); // Ajouter cette ligne à la matrice de quizz
            }
            setQuizList(quizMatrix)
        }
        fetchChapters();
    }, [])


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
                                <AspectRatio w="100%" ratio={16 / 9}>
                                    <LineChart
                                        style={{ height: 50 }}
                                        data={data}
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
                                    <Heading size="md" >
                                        Exam {quiz.order}
                                    </Heading>
                                </Stack>

                                <HStack alignItems="center" space={2} >
                                    <HStack alignItems="center">
                                        <Text fontWeight="400">
                                            {'Dernier score : '}
                                        </Text>
                                        <Text color="coolGray.600" _dark={{
                                            color: "warmGray.200"
                                        }} fontWeight="400">
                                            {"25/30"}
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
            <ScrollView showsVerticalScrollIndicator={false}>

                {quizList.map((q, index) => renderRow(q, index))}
            </ScrollView>

        </View>

    )
}