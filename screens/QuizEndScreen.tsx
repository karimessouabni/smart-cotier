import { useEffect, useRef, useState } from 'react';
import { Animated, ScrollView, TouchableOpacity } from 'react-native';
import { ListItem, Text } from 'react-native-ui-lib';
import { Lesson, LessonProgression, Quiz, UserQuizResult } from 'types';
import { VStack, Box, Divider, AspectRatio, Center, Heading, Stack, CloseIcon, HStack } from 'native-base';
import { AreaChart, BarChart, Grid, YAxis, PieChart } from 'react-native-svg-charts'

import LottieView from 'lottie-react-native'
import tw from 'twrnc'
import UserService from 'services/UserService';
import { useTheme } from '@react-navigation/native'

export type LessonScreenProps = {
    chapterId?: string
    quiz: Quiz
    userQuizResult: UserQuizResult
    setIsQuizCompleted: any
}

export default function QuizEndScreen({ route, navigation }: any) {
    const data = [0, 60, 10, 90]
    const fill = 'rgb(134, 65, 244)'
    const { colors } = useTheme()

    const msgs = ["🌊 Ne vous découragez pas ! Chaque erreur est une étape vers la réussite. Prenez un moment pour revoir les points à améliorer et réessayez. Vous êtes sur le bon chemin !",
        "⛵ Qui a dit que naviguer était facile ? Même les plus grands marins ont dû apprendre à ajuster leurs voiles. Revoyez vos notes, et bientôt, vous serez le capitaine de votre propre navire !",
        "⚓️ Gardez votre cap ! La mer n'a pas été explorée en un jour. Prenez le temps de réviser et la prochaine fois, vous naviguerez vers la réussite.",
        "🚤 Félicitations pour tout le travail accompli jusqu'à présent ! Chaque examen blanc est une étape de plus vers votre objectif. Continuez ainsi, et vous verrez, la prochaine fois sera la bonne !",
        "🏆 Félicitations, futur capitaine ! Vous avez non seulement réussi, mais vous avez également prouvé que vous avez la discipline et la détermination nécessaires pour conquérir les mers."]
    const { quiz, userQuizResult, setIsQuizCompleted, chapterId }: LessonScreenProps = route.params
    const [lessons, setLessons] = useState<Lesson[]>([])
    const [progressions, setProgressions] = useState<LessonProgression[]>([])
    const [lottieFinished, setLottieFinished] = useState(false);
    const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0
    const [correctAnswerNbr, setCorrectAnswerNbr] = useState(0);
    const [wrongAnswerNbr, setWrongAnswerNbr] = useState(0);
    const [quizMessage, setQuizMessage] = useState("");
    const [annimationFailed, setAnnimationFailed] = useState(false);


    useEffect(() => {
        setIsQuizCompleted(prev => true)
        const updateHeaderOptions = () => {
            navigation.setOptions({
                // headerTitle: () => <>{<Text style={{ color: "black" }}>{label || 'Faites votre choix'}</Text>}</>,
                headerRight: () => (
                    <TouchableOpacity onPress={() => navigation.popToTop()}>
                        <CloseIcon mx={4} size="6" mt="0.5" color={colors.primary} />
                    </TouchableOpacity>
                ),
                headerLeft: () => <></>
            })
        }

        updateHeaderOptions()
    }, [navigation])

    useEffect(() => {
        const ca = userQuizResult.answeredQcm.filter(qcm => qcm.rightReponse).length
        const wa = userQuizResult.answeredQcm.filter(qcm => !qcm.rightReponse).length
        setCorrectAnswerNbr(ca)
        setWrongAnswerNbr(wa)
        const rate = ca / (ca + wa) * 100
        calculateMsg(rate)
        rate < 87 && setAnnimationFailed(true)

        UserService.saveUserQuizResult({ ...userQuizResult, rate: rate, chapterId: chapterId })
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

    const calculateMsg = (rate: number) => {
        if (rate < 20) {
            setQuizMessage(msgs[0])
        }
        else if (rate < 40) {
            setQuizMessage(msgs[1])
        }
        else if (rate < 60) {
            setQuizMessage(msgs[2])
        }
        else if (rate < 70) {
            setQuizMessage(msgs[3])
        }
        else if (rate > 87) {
            setQuizMessage(msgs[4])
        }
    }


    return (

        <ScrollView >
            <Animated.View // Special animatable View
                style={{
                    paddingBottom: 100,
                    opacity: fadeAnim, // Bind opacity to animated value
                }}>
                <Box rounded="lg" overflow="hidden" borderColor={colors.background2} m={4} borderWidth="1" borderRadius={4} backgroundColor={colors.background2}>
                    {annimationFailed ?
                        <Animated.View style={tw`relative items-center `}>
                            <LottieView
                                autoPlay
                                onAnimationFinish={onAnimationFinish}
                                loop={false}
                                style={{
                                    width: 200,
                                    height: 200
                                }}
                                source={require("../assets/animation/failed.json")} />
                        </Animated.View>
                        :
                        <Animated.View style={tw`relative items-center `}>
                            <LottieView
                                autoPlay
                                onAnimationFinish={onAnimationFinish}
                                loop={false}
                                style={{
                                    width: 200,
                                    height: 200
                                }}
                                source={require("../assets/animation/congrats.json")} />
                        </Animated.View>}
                    <VStack space="4" >
                        <Box px="4" alignItems={'center'} >
                            <Heading color={colors.text} size='2xl' >
                                {!chapterId && `Test blanc ${quiz.order}`}
                            </Heading>
                        </Box>
                        <Divider />
                        <Box px="4" alignSelf={'center'}>
                            <Heading textAlign={'justify'} py="5" size='xs' >
                                <Text color={colors.text2} text70 >
                                    {quizMessage}
                                </Text>
                            </Heading>
                        </Box>
                        <Box px="4">
                            <HStack style={{
                                shadowColor: "black",
                                borderColor: "black",
                                borderRadius: 4,
                                borderWidth: 0,
                                shadowOpacity: 0.2,
                                shadowOffset: { width: 2, height: 2 },
                                shadowRadius: 3,
                            }} bg="white" alignItems={'center'} p={4} justifyContent={'space-between'} >
                                <Text text70  >
                                    Taux de réponses correctes :
                                </Text>
                                <Text text70 >
                                    {(userQuizResult && correctAnswerNbr / (wrongAnswerNbr + correctAnswerNbr) * 100).toFixed(0)}%
                                </Text>
                            </HStack>
                        </Box>
                        <Box px="4">
                            <HStack style={{
                                shadowColor: "green",
                                borderColor: "green",
                                borderRadius: 4,
                                borderWidth: 0,
                                shadowOpacity: 0.2,
                                shadowOffset: { width: 2, height: 2 },
                                shadowRadius: 3,

                            }} bg={colors.switchOn} alignItems={'center'} p={4} justifyContent={'space-between'} >
                                <Text text70  >
                                    Bonnes réponses :
                                </Text>
                                <Text text70 >
                                    {userQuizResult && correctAnswerNbr}
                                </Text>
                            </HStack>
                        </Box>
                        <Box px="4" pb="4">

                            <HStack style={{
                                shadowColor: "red",
                                borderColor: "red",
                                borderRadius: 4,
                                borderWidth: 0,
                                shadowOpacity: 0.2,
                                shadowOffset: { width: 2, height: 2 },
                                shadowRadius: 1,

                            }} bg={colors.red} alignItems={'center'} p={4} justifyContent={'space-between'}>
                                <Text text70 >
                                    Mauvaises réponses :
                                </Text>
                                <Text text70 >
                                    {userQuizResult && wrongAnswerNbr}
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
                                fill: colors.red,
                                onPress: () => console.log('press red', wrongAnswerNbr),
                            },
                            key: `pie0`,
                        }, {
                            value: correctAnswerNbr,
                            svg: {
                                fill: colors.switchOn,
                                onPress: () => console.log('press green ', correctAnswerNbr),
                            },
                            key: `pie1`,
                        }]
                        }

                    />
                    <Center bg={colors.red} _text={{
                        fontWeight: "300",
                        fontSize: "xs"
                    }} position="absolute" bottom="0" px="2" py="0.5">
                        ❌
                    </Center>
                    <Center bg={colors.switchOn} _text={{
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

