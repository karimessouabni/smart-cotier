// import { Category, Sorters } from '../types'
import { collection, getDocs, orderBy, query } from 'firebase/firestore/lite'
import { db } from '../firebase'
import { Quiz } from 'types';

class QuizService {



    fetchQuizOfChapter = async (chapterId: string) => {
        const q = query(this.getAllLessonQuizes(chapterId));
        const querySnapshot = await getDocs(q)
        const quizList: Quiz[] = querySnapshot.docs.map((fbDoc) => {
            return { id: fbDoc.id, order: "0", ...fbDoc.data() } as Quiz
        })
        return quizList.length > 0 ? quizList[0] : null
    }



    fetchAllQuiz = async () => {
        const q = query(this.getAllQuizs(), orderBy('order'));
        const querySnapshot = await getDocs(q)
        return querySnapshot.docs.map((fbDoc) => {
            return { id: fbDoc.id, ...fbDoc.data() } as Quiz
        })
    }


    private getAllLessonQuizes(chapterId: string) {
        return collection(db, 'chapters/' + chapterId + '/quiz')
    }

    private getAllQuizs() {
        return collection(db, 'quiz/')
    }
}

export default new QuizService()
