import React, { useEffect, useState } from "react";
import { Card, View, Text, AnimatedImage } from "react-native-ui-lib";
import { Quiz } from "../data/chapters";
import QuizService from "../services/QuizService";
import { ScrollView } from "react-native-gesture-handler";
import { Pressable } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';



export default function QuizScreen({ route, navigation }: any) {

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
        <View row margin-10>


            {quizTabOf2.map((quiz, index) =>
                <Card
                    id={quiz.id}
                    height={120}
                    flex
                    onPress={() => navigation.navigate('QcmComonent', { quiz: quiz })}
                    activeOpacity={1}
                    marginH-10
                    center
                >
                    <Text>exam {quiz.order}</Text>
                </Card>
            )}

        </View>
    return (
        <View marginT-10 >
            <ScrollView>

                {quizList.map((q, index) => renderRow(q, index))}
            </ScrollView>

        </View>

    )
}