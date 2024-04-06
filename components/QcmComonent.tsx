import { ScrollView } from "react-native-gesture-handler";
import { Card, View, Text, Button, AnimatedScanner, Colors, PageControl, Toast, RadioButton, Checkbox } from "react-native-ui-lib";
import { Answer, Qcm, Quiz } from "../data/chapters";
import { useEffect, useState } from "react";
import QcmService from "../services/QcmService";
import AnswerService from "../services/AnswerService";


export default function QcmComonent({ route, navigation }: any) {
    const { quiz }: { quiz: Quiz } = route.params
    const localImageSource = require('../assets/images/boat1.jpg'); // eslint-disable-line
    const nextIcon = require('../assets/icons/next.png');
    const backIcon = require('../assets/icons/back.png');
    const [checkV, setCheckV] = useState(false)
    const [animatedScreen, setAnimatedScreen] = useState(true)


    const [qcmList, setQcmList] = useState<Qcm[]>([])
    const [qcmOnScreen, setQcmOnScreen] = useState<Qcm>()
    const [indexQcmOnScreen, setIndexQcmOnScreen] = useState<number>(0)


    useEffect(() => {
        const fetcQcmList = async () => {
            const fetchedQcmList = await QcmService.fetchAllQcm(quiz.id)
            setQcmList(fetchedQcmList)
            setQcmOnScreen(fetchedQcmList[0])

        }
        fetcQcmList();
    }, [])

    // useEffect(() => {
    //     if (qcmList) {
    //         const fetchAnswerList = async () => {
    //             const fetchedAnswerList = await AnswerService.fetchAllAnswers(quiz.id, qcm.id)
    //             setAnswerList(fetchedAnswerList)

    //         }
    //         fetchAnswerList();
    //     }
    // }, [qcmList])

    const posts = [
        {
            coverImage: localImageSource,
            title: 'Question 1',
            status: '1/30',
            timestamp: '31 August 2016',
            description: 'Reference this table when designing your app’s interface, and make sure',
            likes: 345,
        },
        {
            title: 'New Post',
            status: 'Draft',
            timestamp: '07 March 2017',
            description: 'This is the beginning of a new post',
            likes: 0,
        },
    ];

    const post = posts[0];


    const goToNextQcm = () => {
        if (qcmList[indexQcmOnScreen + 1]) {
            setQcmOnScreen(qcmList[indexQcmOnScreen + 1])
            setIndexQcmOnScreen(prev => ++prev)
        }
        setAnimatedScreen(false)
    }

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
    return (
        <ScrollView showsVerticalScrollIndicator={false}>


            {qcmOnScreen && <View >
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
                            {/* <Card.Image height={290} source={post.coverImage} /> */}

                            <Text text90 color={Colors.green30}>Quiz {quiz.order}</Text>
                            {/* <Text text90 color={Colors.green30}>
                                {post.status}
                            </Text> */}

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

                                return <View paddingB-20 key={index}>
                                    <Checkbox
                                        style={{ margin: 10, marginVertical: 20 }}
                                        value={answer.valid}
                                        onValueChange={value3 => setCheckV(prev => !prev)}
                                        borderRadius={3}
                                        labelStyle={{ padding: 10 }}
                                        containerStyle={{ backgroundColor: Colors.grey70, borderRadius: 5 }}
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
                <PageControl numOfPages={qcmList.length} currentPage={indexQcmOnScreen} />
                <View row flex spread centerV padding-20 >
                    <Button onPress={goToBackQcm}
                        disabled={indexQcmOnScreen == 0}
                        backgroundColor={Colors.green40}
                        iconSource={backIcon} iconStyle={{ height: 10, width: 10 }}
                        size="medium" label="Précédent"
                        style={{ minWidth: 120 }} />
                    <Text style={{ paddingLeft: 12 }}>{indexQcmOnScreen + 1}/{qcmList.length}</Text>
                    <Button onPress={goToNextQcm}
                        backgroundColor={Colors.green20}
                        iconOnRight iconSource={nextIcon}
                        iconStyle={{ height: 10, width: 10 }}
                        marginL-10 size="medium" style={{ minWidth: 120 }}
                        label={qcmList.length == indexQcmOnScreen + 1 ? "Terminer" : "Suivant"} />
                </View>
            </View>}

        </ScrollView>
    )
}