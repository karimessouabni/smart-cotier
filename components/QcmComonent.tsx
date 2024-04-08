import _ from 'lodash';
import { ScrollView } from "react-native-gesture-handler";
import { Card, View, Text, Button, AnimatedScanner, Colors, PageControl, Checkbox, Assets } from "react-native-ui-lib";

import { useEffect, useState } from "react";
import QcmService from "../services/QcmService";
import { Quiz, Qcm, AnsweredQcm, UserQuizResult } from "types";


export default function QcmComonent({ route, navigation }: any) {
    const { quiz }: { quiz: Quiz } = route.params
    const nextIcon = require('../assets/icons/next.png');

    const [validated, setValidated] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [correctAnswer, setCorrectAnswer] = useState(false)
    const [animatedScreen, setAnimatedScreen] = useState(true)

    const [userQuizResult, setUserQuizResult] = useState<UserQuizResult>({ quizId: quiz.id, passedDate: Date.now(), answeredQcm: [] } as unknown as UserQuizResult)
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
        setQcmUserAnswerIds(perv => {
            return perv.includes(id) ? perv.filter(item => item !== id) : [...perv, id];
        })
    }

    const validateQcm = () => {
        setValidated(true)
        if (!_.isEqual(qcmUserAnswerIds, qcmValidAnswerIds)) {
            setErrorMessage("Fausse réponse" + qcmOnScreen?.explain)
        } else {
            setCorrectAnswer(true)
        }
    }


    const goToNextQcm = () => {
        // Reset Componenet state on next QCM Screen
        setValidated(false)
        setCorrectAnswer(false)
        setErrorMessage("")
        setQcmUserAnswerIds([])

        setUserQuizResult(prev => {
            const answeredQcm = {
                qcmId: qcmOnScreen?.id,
                answeredId: qcmUserAnswerIds,
                validAnswerId: qcmValidAnswerIds
            } as AnsweredQcm
            return { ...prev, answeredQcm: [...prev.answeredQcm, answeredQcm] } as UserQuizResult
        })

        if (qcmList[indexQcmOnScreen + 1]) {
            setQcmOnScreen(qcmList[indexQcmOnScreen + 1])
            setIndexQcmOnScreen(prev => ++prev)
        }
        setAnimatedScreen(false)
    }

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            {qcmOnScreen && <View>
                <View flex padding-5>
                    <View paddingL-40 marginB-20>
                        <AnimatedScanner
                            backgroundColor={Colors.green50}
                            progress={(indexQcmOnScreen + 1) / qcmList.length * 100}
                            duration={1600}
                            containerStyle={{ backgroundColor: Colors.green30, height: 6 }}
                        />
                    </View>

                    <Card containerStyle={{ marginBottom: 15 }} >
                        <Card.Image height={250} source={{ uri: qcmOnScreen.img }} />
                        <View padding-20>
                            <Text text40 color={Colors.grey10}>
                                Question {indexQcmOnScreen + 1}
                            </Text>
                            {/* {correctAnswer && <Text text50 color={Colors.green30}>Bonne réponse</Text>} */}
                            <Text text70M color={Colors.grey10}>
                                {qcmOnScreen.question}
                            </Text>

                            <Text text90 color={Colors.grey50}>
                                Sélectionner jusqu'a deux réponses
                            </Text>
                            <View row spread>
                                {/* {correctAnswer && <Button style={{ marginRight: 10 }} text90 link label="Bonne réponse" />} */}
                                <Button text90 link label="Voir le cours" />
                            </View>
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
                                return <View paddingB-20 key={index} >
                                    <Checkbox
                                        style={{ margin: 10, marginVertical: 20 }}
                                        value={qcmUserAnswerIds.includes(answer.id)}
                                        onValueChange={() => checkUncheckAnswer(answer.id)}
                                        borderRadius={3}
                                        labelStyle={{
                                            padding: 10, color: !qcmValidAnswerIds.includes(answer.id) &&
                                                answerIsClicked &&
                                                errorMessage ? Colors.white : Colors.$textDefault, fontWeight: qcmUserAnswerIds.includes(answer.id) ? '500' : 'normal'
                                        }}
                                        containerStyle={{
                                            shadowColor: isCorrectAnswer || qcmValidAnswerIds.includes(answer.id) && errorMessage ? Colors.green30 :
                                                Colors.grey70,
                                            borderColor: isCorrectAnswer || qcmValidAnswerIds.includes(answer.id) && errorMessage ? Colors.green30 :
                                                Colors.grey70,
                                            borderEndEndRadius: 20,
                                            borderWidth: 1,
                                            shadowOpacity: isCorrectAnswer || qcmValidAnswerIds.includes(answer.id) && errorMessage ? 0.9 : 0.02,
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
                                            errorMessage ? Colors.white : Colors.green30}
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
                    </Card>
                </View>




                {validated ?
                    <Button onPress={goToNextQcm}
                        borderRadius={5}
                        disabled={qcmUserAnswerIds.length == 0}
                        backgroundColor={Colors.green20}
                        iconOnRight iconSource={nextIcon}
                        marginH-10
                        marginB-10
                        iconStyle={{ height: 10, width: 10 }}
                        size='large' style={{ minWidth: 120 }}
                        label={qcmList.length == indexQcmOnScreen + 1 ? "Terminer" : "Suivant"} />
                    :
                    <Button onPress={validateQcm}
                        borderRadius={5}
                        disabled={qcmUserAnswerIds.length == 0}
                        backgroundColor={Colors.green20}
                        // iconOnRight iconSource={nextIcon}
                        marginH-10
                        marginB-10
                        iconStyle={{ height: 10, width: 10 }}
                        size='large' style={{ minWidth: 120 }}
                        label={"Valider"} />}

                <PageControl numOfPages={qcmList.length} currentPage={indexQcmOnScreen} color={Colors.grey30} />
                <Text center style={{ paddingVertical: 5, paddingBottom: 49, color: Colors.grey30 }}>{indexQcmOnScreen + 1}/{qcmList.length}</Text>

            </View>}

        </ScrollView>
    )
}