// import { Category, Sorters } from '../types'
import { collection, getDocs, orderBy, query } from 'firebase/firestore/lite'
import { db } from '../firebase'
import { Quiz } from 'types';

class QuizService {

    fetchAllQuiz = async () => {
        const q = query(this.getAllChapters(), orderBy('order'));
        const querySnapshot = await getDocs(q)
        return querySnapshot.docs.map((fbDoc) => {
            return { id: fbDoc.id, ...fbDoc.data() } as Quiz
        })
    }


    private getAllChapters() {
        return collection(db, 'quiz/')
    }
}

export default new QuizService()
