// import { Category, Sorters } from '../types'
import { collection, getDocs, orderBy, query } from 'firebase/firestore/lite'
import { db } from '../firebase'
import { Answer } from 'types';

class AnswerService {

    fetchAllAnswers = async (quizId: string, qcmId: string) => {
        const q = query(collection(db, `quiz/${quizId}/qcms/${qcmId}/answers`));
        const querySnapshot = await getDocs(q)
        return querySnapshot.docs.map((fbDoc) => fbDoc.data() as Answer)
    }


}

export default new AnswerService()
