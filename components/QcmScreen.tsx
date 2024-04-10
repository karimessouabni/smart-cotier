import _ from 'lodash';
import { ScrollView } from "react-native-gesture-handler";
import { Card, View, Text, Button, AnimatedScanner, Colors, PageControl, Checkbox, Assets, ExpandableSection } from "react-native-ui-lib";

import { useEffect, useState } from "react";
import QcmService from "../services/QcmService";
import { Quiz, Qcm, AnsweredQcm, UserQuizResult } from "types";
import { useTheme } from '@react-navigation/native'


export default function QcmScreen({ route, navigation }: any) {
    const { quiz }: { quiz: Quiz } = route.params
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



    useEffect(() => {
        const fetcQcmList = async () => {
            const fetchedQcmList = await QcmService.fetchAllQcm(quiz.id)
            setQcmList(fetchedQcmList)
            setQcmOnScreen(fetchedQcmList[0])
            setQcmValidAnswerIds(fetchedQcmList[0]?.answers.filter(answer => answer.valid == true).map(answer => answer.id))
        }
        fetcQcmList();
    }, [])




    useEffect(() => {
        setAnimatedScreen(true)
    }, [animatedScreen])


    const goToBackQcm = () => {
        if (qcmList[indexQcmOnScreen - 1]) {
            setQcmOnScreen(qcmList[indexQcmOnScreen - 1])
            setIndexQcmOnScreen(prev => --prev)
        }
        setAnimatedScreen(false)
    }


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
            setErrorMessage(`Mauvaise réponse ${qcmOnScreen?.explain ? " : " + qcmOnScreen?.explain : ""}`)
        }
    }


    const goToNextQcm = () => {
        // Reset Componenet state on next QCM Screen
        setValidated(false)
        setCorrectAnswer(false)
        setErrorMessage("")
        setQcmUserAnswerIds([])
        setAnimatedScreen(false)

        if (qcmList[indexQcmOnScreen + 1]) {
            setQcmOnScreen(qcmList[indexQcmOnScreen + 1])
            setIndexQcmOnScreen(prev => ++prev)
        }
    }

    const terminateQcm = () => {

        console.log("QCM is finished")
        console.log({ ...userQuizResult })
        console.log(userQuizResult.answeredQcm)
        navigation.navigate('QuizEndScreen', { quiz: quiz, userQuizResult: userQuizResult })

    }
    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            {qcmOnScreen && <View paddingB-40>
                <View flex padding-5>
                    <View paddingL-40 marginB-20>
                        <AnimatedScanner
                            backgroundColor={colors.secondaryText}
                            progress={(indexQcmOnScreen + 1) / qcmList.length * 100}
                            duration={1600}
                            containerStyle={{ backgroundColor: colors.primary, height: 6 }}
                        />
                    </View>

                    <Card containerStyle={{ marginBottom: 15, backgroundColor: colors.background2 }} >
                        <Card.Image height={250} source={{ uri: qcmOnScreen.img }} />
                        <View padding-20>
                            <Text text40 color={colors.text}>
                                Question {indexQcmOnScreen + 1}
                            </Text>
                            {/* {correctAnswer && <Text text50 color={Colors.green30}>Bonne réponse</Text>} */}
                            <Text text70M color={colors.text2}>
                                {qcmOnScreen.question}
                            </Text>

                            <Text text90 color={Colors.grey40}>
                                Sélectionner jusqu'a deux réponses
                            </Text>
                            {/* <View row spread>
                                {correctAnswer && <Button style={{ marginRight: 10 }} text90 link label="Bonne réponse" />}
                                <Button text90 link label="Voir le cours" />
                            </View> */}
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
                                            shadowColor: isGreenStyle ? colors.primary :
                                                Colors.grey70,
                                            borderColor: isGreenStyle ? colors.primary :
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
                                            errorMessage ? Colors.white : isGreenStyle ? colors.primary : Colors.$textDefault}
                                        iconColor={
                                            !qcmValidAnswerIds.includes(answer.id) &&
                                                answerIsClicked &&
                                                errorMessage ? Colors.red30 : Colors.white}
                                    />
                                </View>
                            })
                            }
                        </View>

                        {errorMessage && <Text margin-20 text90 color={Colors.red30}>
                            {errorMessage}
                        </Text>}

                        <PageControl numOfPages={qcmList.length} currentPage={indexQcmOnScreen} color={colors.text2} />
                        <Text center style={{ padding: 5, color: colors.text2 }}>{indexQcmOnScreen + 1}/{qcmList.length}</Text>

                    </Card>


                </View>


                <Button onPress={validated ? qcmList.length == indexQcmOnScreen + 1 ? terminateQcm : goToNextQcm : validateQcm}
                    borderRadius={5}
                    disabled={qcmUserAnswerIds.length == 0}
                    backgroundColor={colors.primary}
                    iconOnRight
                    iconSource={validated && nextIcon}
                    marginH-10
                    paddingV-15
                    marginB-10
                    labelStyle={{ fontSize: 20, fontWeight: '600', color: colors.text }}
                    iconStyle={{ height: 15, width: 25, tintColor: colors.text }}
                    size='large' style={{ minWidth: 120 }}
                    label={validated ? qcmList.length == indexQcmOnScreen + 1 ? "Terminer" : "Suivant" : "Valider"} />

            </View>}

        </ScrollView>
    )
}