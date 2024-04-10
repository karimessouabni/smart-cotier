import { useEffect, useRef, useState } from 'react';
import { Animated, ScrollView, TouchableOpacity } from 'react-native';
import { ListItem, Text } from 'react-native-ui-lib';
import { Lesson, LessonProgression, Quiz, UserQuizResult } from 'types';
import { VStack, Box, Divider, AspectRatio, Center, Heading, Stack, CloseIcon, HStack } from 'native-base';
import { AreaChart, BarChart, Grid, YAxis, PieChart } from 'react-native-svg-charts'
// import AnimatedProgressWheel from 'react-native-progress-wheel';

import LottieView from 'lottie-react-native'
import tw from 'twrnc'

export type LessonScreenProps = {
    quiz: Quiz
    userQuizResult: UserQuizResult
}

export default function QuizEndScreen({ route, navigation }: any) {
    const data = [0, 60, 10, 90]
    const fill = 'rgb(134, 65, 244)'

    const { quiz, userQuizResult }: LessonScreenProps = route.params
    const [lessons, setLessons] = useState<Lesson[]>([])
    const [progressions, setProgressions] = useState<LessonProgression[]>([])
    const [lottieFinished, setLottieFinished] = useState(false);
    const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0
    const [correctAnswerNbr, setCorrectAnswerNbr] = useState(0);
    const [wrongAnswerNbr, setWrongAnswerNbr] = useState(0);

    useEffect(() => {
        const updateHeaderOptions = () => {
            navigation.setOptions({
                // headerTitle: () => <>{<Text style={{ color: "black" }}>{label || 'Faites votre choix'}</Text>}</>,
                headerRight: () => (
                    <TouchableOpacity onPress={() => navigation.popToTop()}>
                        <CloseIcon mx={4} size="6" mt="0.5" color={"green.900"} />
                    </TouchableOpacity>
                ),
                headerLeft: () => <></>
            })
        }

        updateHeaderOptions()
    }, [navigation])

    useEffect(() => {
        setCorrectAnswerNbr(userQuizResult.answeredQcm.filter(qcm => qcm.rightReponse).length)
        setWrongAnswerNbr(userQuizResult.answeredQcm.filter(qcm => !qcm.rightReponse).length)

    }, [])

    const onAnimationFinish = () => {
        setLottieFinished(prev => true);
        console.log("finished")
    }

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
        }).start();
    }, [fadeAnim]);

    return (

        <ScrollView>



            <Animated.View // Special animatable View
                style={{
                    opacity: fadeAnim, // Bind opacity to animated value
                }}>

                <Box rounded="lg" overflow="hidden" borderColor="coolGray.200" m={4} borderWidth="1" borderRadius={4} backgroundColor="gray.50">
                    <Animated.View style={tw`relative items-center `}>
                        <LottieView
                            autoPlay
                            onAnimationFinish={onAnimationFinish}
                            loop={false}
                            style={{
                                width: 200,
                                height: 200
                            }}
                            source={require('../assets/animation/congrats.json')} />
                    </Animated.View>

                    <VStack space="4" >
                        <Box px="4" alignItems={'center'} >
                            <Heading size="md" >
                                Test blanc {quiz.order}
                            </Heading>
                        </Box>
                        <Divider />
                        {/* <Box>

                            <BarChart
                                spacingInner={0.2}
                                spacingOuter={10}
                                numberOfTicks={2}

                                style={{ height: 40 }}
                                data={data} svg={{ fill }}
                            >
                                <Grid />
                            </BarChart>

                        </Box> */}
                        <Box px="4" alignSelf={'center'}>
                            <Heading textAlign={'center'} size='sm' >
                                Félicitation tu as obtenu un score meilleur que la dernière fois 🚀
                            </Heading>

                        </Box>


                        <Box px="4" >

                            <HStack style={{
                                shadowColor: "red",
                                borderColor: "red",
                                borderRadius: 4,
                                borderWidth: 0,
                                shadowOpacity: 0.2,
                                shadowOffset: { width: 2, height: 2 },
                                shadowRadius: 1,

                            }} bg="red.200" alignItems={'center'} p={4} justifyContent={'space-between'}>
                                <Text text70 >
                                    Mauvaises réponses :
                                </Text>
                                <Text text70 >
                                    {userQuizResult && userQuizResult.answeredQcm.filter(qcm => !qcm.rightReponse).length}
                                </Text>
                            </HStack>

                        </Box>
                        <Box px="4" pb="4">
                            <HStack style={{
                                shadowColor: "green",
                                borderColor: "green",
                                borderRadius: 4,
                                borderWidth: 0,
                                shadowOpacity: 0.2,
                                shadowOffset: { width: 2, height: 2 },
                                shadowRadius: 3,

                            }} bg="green.200" alignItems={'center'} p={4} justifyContent={'space-between'} >
                                <Text text70  >
                                    Bonne réponses :
                                </Text>
                                <Text text70 >
                                    {userQuizResult && userQuizResult.answeredQcm.filter(qcm => qcm.rightReponse).length}
                                </Text>
                            </HStack>
                        </Box>


                    </VStack>
                    <Divider></Divider>


                    <PieChart
                        valueAccessor={({ item }) => item.value}
                        outerRadius={80}
                        innerRadius={70}


                        style={{ height: 200 }}


                        data={[{
                            value: wrongAnswerNbr,
                            svg: {
                                fill: 'red',
                                onPress: () => console.log('press red', wrongAnswerNbr),
                            },
                            key: `pie0`,
                        }, {
                            value: correctAnswerNbr,
                            svg: {
                                fill: '#15be53',
                                onPress: () => console.log('press green ', correctAnswerNbr),
                            },
                            key: `pie1`,
                        }]
                        }

                    />
                    <Center bg="red.200" _text={{
                        fontWeight: "300",
                        fontSize: "xs"
                    }} position="absolute" bottom="0" px="2" py="0.5">
                        ❌
                    </Center>
                    <Center bg="green.200" _text={{
                        fontWeight: "300",
                        fontSize: "xs"
                    }} position="absolute" bottom="6" px="2" py="0.5">
                        ✅
                    </Center>

                </Box>


            </Animated.View >

        </ScrollView >
    );



}

