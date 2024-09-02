import _ from 'lodash';
import { Card, View, Text, Button, AnimatedScanner, Colors, PageControl, Checkbox, Assets, ExpandableSection } from "react-native-ui-lib";

import { useEffect, useRef, useState } from "react";
import QcmService from "../services/QcmService";
import { Quiz, Qcm, AnsweredQcm, UserQuizResult } from "types";
import { useTheme } from '@react-navigation/native'
import ConfirmationAlert from '../components/styled/ConfirmationAlert';
import { Alert, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { HStack, Pressable } from 'native-base';


export default function QcmScreen({ route, navigation }: any) {
    const { quiz, chapterId }: { quiz: Quiz; chapterId?: string } = route.params
    const nextIcon = require('../assets/icons/next.png');
    const { colors } = useTheme()

    const [validated, setValidated] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [correctAnswer, setCorrectAnswer] = useState(false)
    const [animatedScreen, setAnimatedScreen] = useState(true)

    const [userQuizResult, setUserQuizResult] = useState<UserQuizResult>({ quizId: quiz.id, answeredQcm: [] } as unknown as UserQuizResult)
    // const [answeredQcmList, setAnsweredQcmList] = useState<AnsweredQcm[]>([])

    const [qcmList, setQcmList] = useState<Qcm[]>([])
    const [qcmOnScreen, setQcmOnScreen] = useState<Qcm>()
    const [indexQcmOnScreen, setIndexQcmOnScreen] = useState<number>(0)
    const [qcmUserAnswerIds, setQcmUserAnswerIds] = useState<string[]>([])
    const [qcmValidAnswerIds, setQcmValidAnswerIds] = useState<string[]>([])
    const [isQuizCompleted, setIsQuizCompleted] = useState(false);
    const scrollViewRef = useRef<ScrollView>(null);


    useEffect(() => {
        const unsubscribe = navigation.addListener('beforeRemove', (e) => {
            if (isQuizCompleted) {
                return;
            }
            e.preventDefault();
            Alert.alert(
                'Quitter le QCM ?',
                'Êtes-vous sûr de vouloir quitter ? Tout progrès non sauvegardé sera perdu.',
                [
                    { text: "Rester", style: 'cancel', onPress: () => { } },
                    {
                        text: 'Quitter',
                        style: 'destructive',
                        onPress: () => navigation.dispatch(e.data.action),
                    },
                ]
            );
        });

        return unsubscribe;
    }, [navigation, isQuizCompleted]);

    useEffect(() => {
        const fetcQcmList = async () => {
            const fetchedQcmList = chapterId ? await QcmService.fetchAllCahpterQcm(chapterId) : await QcmService.fetchAllQcm(quiz.id)
            setQcmList(fetchedQcmList)
            setQcmOnScreen(fetchedQcmList[0])
            setQcmValidAnswerIds(fetchedQcmList[0]?.answers.filter(answer => answer.valid == true).map(answer => answer.id))
        }
        fetcQcmList();
    }, [])




    useEffect(() => {
        setAnimatedScreen(true)
    }, [animatedScreen])


    const checkUncheckAnswer = (id: string) => {

        if (!correctAnswer && !errorMessage) {
            setQcmUserAnswerIds(perv => {
                return perv.includes(id) ? perv.filter(item => item !== id) : [...perv, id];
            })
        }
    }

    const validateQcm = () => {
        setValidated(true)

        const rightResponse = _.isEqual(qcmUserAnswerIds, qcmValidAnswerIds)
        setUserQuizResult(prev => {
            const answeredQcm = {
                qcmId: qcmOnScreen?.id,
                rightReponse: rightResponse
            } as AnsweredQcm
            return { ...prev, answeredQcm: [...prev.answeredQcm, answeredQcm] } as UserQuizResult
        })

        if (rightResponse) {
            setCorrectAnswer(true)
        } else {
            setErrorMessage(`${qcmOnScreen?.explain ? qcmOnScreen?.explain : ""}`)
        }

    }

    useEffect(() => {

        if (correctAnswer == false && errorMessage == "") {
            scrollViewRef.current?.scrollTo({ y: 0, animated: true });
        } else {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }

    }, [correctAnswer, errorMessage]);

    const goToNextQcm = () => {

        // Reset Componenet state on next QCM Screen
        setValidated(false)
        setCorrectAnswer(false)
        setErrorMessage("")
        setQcmUserAnswerIds(prev => [])
        setAnimatedScreen(false)

        if (qcmList[indexQcmOnScreen + 1]) {
            setQcmOnScreen(qcmList[indexQcmOnScreen + 1])
            setQcmValidAnswerIds(qcmList[indexQcmOnScreen + 1]?.answers.filter(answer => answer.valid == true).map(answer => answer.id))
            setIndexQcmOnScreen(prev => ++prev)
        }
    }

    const terminateQcm = () => {

        console.log("QCM is finished")
        console.log({ ...userQuizResult })
        console.log(userQuizResult.answeredQcm)
        navigation.navigate('QuizEndScreen', {
            quiz: quiz, userQuizResult: userQuizResult, setIsQuizCompleted: setIsQuizCompleted, chapterId: chapterId
        })
    }



    return (
        <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false} >
            {qcmOnScreen && <View paddingB-40>
                <View flex>
                    <View paddingL-40 marginB-20>
                        <AnimatedScanner
                            backgroundColor={"#a5a5a5"}
                            progress={(indexQcmOnScreen + 1) / qcmList.length * 100}
                            duration={1600}
                            containerStyle={{ backgroundColor: colors.secondary, height: 6 }}
                        />
                    </View>

                    <Card containerStyle={{ marginBottom: 15, backgroundColor: "#F9FAFB" }} >
                        {qcmOnScreen.img && <Card.Image height={250} source={{ uri: qcmOnScreen.img }} />}
                        <View padding-20>
                            <Text text40 color={colors.background2}>
                                Question {indexQcmOnScreen + 1}
                            </Text>
                        </View>
                        <View paddingH-20 paddingB-20>
                            <Text text70M color={colors.text}>
                                {qcmOnScreen.question}
                            </Text>
                        </View>
                        <View paddingH-20>
                            <Text text90 color={colors.text2}>
                                Sélectionner une ou plusieurs réponses
                            </Text>
                        </View>
                        {animatedScreen && <AnimatedScanner
                            opacity={0.7}
                            progress={100}
                            duration={1500}
                        />}

                        <View flex paddingH-20 paddingT-20 >

                            {qcmOnScreen.answers.map((answer, index) => {
                                const answerIsClicked = qcmUserAnswerIds.includes(answer.id);
                                const isCorrectAnswer = qcmUserAnswerIds.includes(answer.id) && correctAnswer;
                                const isGreenStyle = isCorrectAnswer || qcmValidAnswerIds.includes(answer.id) && errorMessage;
                                return <View paddingB-20 key={index} onTouchEnd={() => checkUncheckAnswer(answer.id)}>
                                    <Checkbox
                                        style={{ margin: 10, marginVertical: 20 }}
                                        value={qcmUserAnswerIds.includes(answer.id)}
                                        borderRadius={3}
                                        labelStyle={{
                                            padding: 10, color: !qcmValidAnswerIds.includes(answer.id) &&
                                                answerIsClicked &&
                                                errorMessage ? Colors.white : Colors.$textDefault, fontWeight: qcmUserAnswerIds.includes(answer.id) ? '500' : 'normal'
                                        }}
                                        containerStyle={{
                                            shadowColor: isGreenStyle ? colors.switchOn :
                                                Colors.grey70,
                                            borderColor: isGreenStyle ? colors.switchOn :
                                                Colors.grey70,
                                            borderEndEndRadius: 20,
                                            borderWidth: 0.2,
                                            shadowOpacity: isGreenStyle ? 0.9 : 0.02,
                                            shadowOffset: { width: 2, height: 2 },
                                            shadowRadius: 10,
                                            backgroundColor: (answerIsClicked ?
                                                (!qcmValidAnswerIds.includes(answer.id) && errorMessage ? Colors.$iconDangerLight : Colors.grey60)
                                                : Colors.grey70),
                                            borderRadius: 5
                                        }}
                                        size={18}
                                        label={answer.text}
                                        color={!qcmValidAnswerIds.includes(answer.id) &&
                                            answerIsClicked &&
                                            errorMessage ? Colors.white : isGreenStyle ? colors.switchOn : Colors.$textDefault}
                                        iconColor={
                                            !qcmValidAnswerIds.includes(answer.id) &&
                                                answerIsClicked &&
                                                errorMessage ? Colors.red30 : Colors.white}
                                    />
                                </View>
                            })
                            }
                            <View row spread>
                                <Button paddingB-20 color="#00d2da" text90 link label="Signalez un Bug 🛟" onPress={() => navigation.navigate("BugSignal", { qcmId: qcmOnScreen.id })} />
                            </View>
                        </View>

                        {errorMessage && (<>
                            <Text marginH-20 marginT-20 text90 color={colors.red}>
                                {`Mauvaise réponse :`}
                            </Text>
                            <Text marginH-20 marginT-5 marginB-20 text90 color={colors.text}>
                                {errorMessage}
                            </Text>
                        </>)}

                        <PageControl numOfPages={qcmList.length} currentPage={indexQcmOnScreen} color={"#DADDE2"} />

                        <Text center style={{ padding: 5, color: "#DADDE2" }}>{indexQcmOnScreen + 1}/{qcmList.length}</Text>


                    </Card>


                </View>


                <Button onPress={validated ? qcmList.length == indexQcmOnScreen + 1 ? terminateQcm : goToNextQcm : validateQcm}
                    borderRadius={5}
                    disabled={qcmUserAnswerIds.length == 0}
                    backgroundColor={colors.secondary}
                    iconOnRight
                    iconSource={validated && nextIcon}
                    marginH-10
                    paddingV-15
                    marginB-10
                    labelStyle={{ fontSize: 18, fontWeight: '500', color: colors.background }}
                    iconStyle={{ height: 15, width: 25, tintColor: colors.background }}
                    size='large' style={{ minWidth: 120 }}
                    label={validated ? qcmList.length == indexQcmOnScreen + 1 ? "Terminer" : "Suivant" : "Valider"} />

            </View>}

        </ScrollView>
    )

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 20,
    },
    scrollView: {
        width: '100%',
        margin: 10,
    }
})