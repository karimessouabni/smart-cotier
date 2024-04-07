import { ScrollView } from "react-native-gesture-handler";
import { Card, View, Text, Button, AnimatedScanner, Colors, PageControl, Checkbox } from "react-native-ui-lib";

import { useEffect, useState } from "react";
import QcmService from "../services/QcmService";
import { Quiz, Qcm, AnsweredQcm, UserQuizResult } from "types";


export default function QcmComonent({ route, navigation }: any) {
    const { quiz }: { quiz: Quiz } = route.params
    const localImageSource = require('../assets/images/boat1.jpg'); // eslint-disable-line
    const nextIcon = require('../assets/icons/next.png');
    const backIcon = require('../assets/icons/back.png');
    const [checkV, setCheckV] = useState(false)
    const [animatedScreen, setAnimatedScreen] = useState(true)

    const [userQuizResult, setUserQuizResult] = useState<UserQuizResult>({ quizId: quiz.id, passedDate: Date.now(), answeredQcm: [] } as unknown as UserQuizResult)
    // const [answeredQcmList, setAnsweredQcmList] = useState<AnsweredQcm[]>([])

    const [qcmList, setQcmList] = useState<Qcm[]>([])
    const [qcmOnScreen, setQcmOnScreen] = useState<Qcm>()
    const [indexQcmOnScreen, setIndexQcmOnScreen] = useState<number>(0)
    const [qcmUserAnswerIds, setQcmUserAnswerIds] = useState<string[]>([])



    useEffect(() => {
        const fetcQcmList = async () => {
            const fetchedQcmList = await QcmService.fetchAllQcm(quiz.id)
            setQcmList(fetchedQcmList)
            setQcmOnScreen(fetchedQcmList[0])
        }
        fetcQcmList();
    }, [])


    useEffect(() => {
        console.log("starting quiz :", userQuizResult)


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
        console.log(qcmUserAnswerIds)
    }


    const goToNextQcm = () => {

        setUserQuizResult(prev => {
            const answeredQcm = {
                qcmId: qcmOnScreen?.id,
                answeredId: qcmUserAnswerIds,
                validAnswerId: qcmOnScreen?.answers.filter(answer => answer.valid == true).map(answer => answer.id)
            } as AnsweredQcm
            return {
                ...prev,
                answeredQcm: [...prev.answeredQcm, answeredQcm]
            }

        })

        console.log("userQuizResult", userQuizResult)

        if (qcmList[indexQcmOnScreen + 1]) {
            setQcmOnScreen(qcmList[indexQcmOnScreen + 1])
            setIndexQcmOnScreen(prev => ++prev)
            setQcmUserAnswerIds([])
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
                            <Text text90 color={Colors.green30}>Quiz {quiz.order}</Text>
                            <Text text70M color={Colors.grey10}>
                                {qcmOnScreen.question}
                            </Text>

                            <Text text90 color={Colors.grey50}>
                                Sélectionner jusqu'a deux réponses
                            </Text>
                            <View row spread>
                                <Button style={{ marginRight: 10 }} text90 link label="Aide" />
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

                                return <View paddingB-20 key={index} >
                                    <Checkbox

                                        style={{ margin: 10, marginVertical: 20 }}
                                        value={qcmUserAnswerIds.includes(answer.id)}
                                        onValueChange={() => checkUncheckAnswer(answer.id)}
                                        borderRadius={3}
                                        labelStyle={{ padding: 10, fontWeight: qcmUserAnswerIds.includes(answer.id) ? '500' : 'normal' }}
                                        containerStyle={{
                                            shadowOpacity: qcmUserAnswerIds.includes(answer.id) ? 0.1 : 0.02,
                                            backgroundColor: qcmUserAnswerIds.includes(answer.id) ? Colors.grey60 : Colors.grey70,
                                            borderRadius: 5
                                        }}
                                        size={18}
                                        label={answer.text}
                                        color={Colors.green30}
                                        iconColor={Colors.white}
                                    />
                                </View>
                            })
                            }
                        </View>
                    </Card>
                </View>



                <Button onPress={goToNextQcm}
                    borderRadius={5}
                    backgroundColor={Colors.green20}
                    iconOnRight iconSource={nextIcon}
                    marginH-10
                    marginB-10
                    iconStyle={{ height: 10, width: 10 }}
                    size='large' style={{ minWidth: 120 }}
                    label={qcmList.length == indexQcmOnScreen + 1 ? "Terminer" : "Suivant"} />

                <PageControl numOfPages={qcmList.length} currentPage={indexQcmOnScreen} color={Colors.grey30} />
                <Text center style={{ paddingVertical: 5, paddingBottom: 49, color: Colors.grey30 }}>{indexQcmOnScreen + 1}/{qcmList.length}</Text>

            </View>}

        </ScrollView>
    )
}