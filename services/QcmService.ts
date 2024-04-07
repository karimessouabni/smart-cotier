// import { Category, Sorters } from '../types'
import { collection, getDocs, orderBy, query } from 'firebase/firestore/lite'
import { db } from '../firebase'
import { Qcm, Answer } from 'types';

class QcmService {

    fetchAllQcm = async (quizId: string) => {
        const q = query(collection(db, `quiz/${quizId}/qcms`));

        const querySnapshot = await getDocs(q)

        const qcms = await Promise.all(querySnapshot.docs.map(async (fbDoc) => {
            const qcmData = { id: fbDoc.id, ...fbDoc.data() } as Qcm;

            const answersSnapshot = await getDocs(collection(db, `quiz/${quizId}/qcms/${fbDoc.id}/answers`));
            const answers = answersSnapshot.docs.map(answerDoc => (answerDoc.data() as Answer));
            // Ajouter les réponses au QCM
            return { ...qcmData, answers } as Qcm;
        }));

        return qcms;

    }


}

export default new QcmService()
