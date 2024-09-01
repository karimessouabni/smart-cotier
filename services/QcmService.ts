// import { Category, Sorters } from '../types'
import { collection, getDocs, orderBy, query } from 'firebase/firestore/lite'
import { db } from '../firebase'
import { Qcm, Answer } from 'types';

class QcmService {

    fetchAllQcm = async (quizId: string) => {
        console.debug("fetchAllQcm => " + quizId)
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


    fetchAllCahpterQcm = async (chapterId: string) => {
        console.debug("fetchAllCahpterQcm", chapterId)
        const qcmPath = `chapters/${chapterId}/quiz/quiz1/qcms`;
        const q = query(collection(db, qcmPath));

        const querySnapshot = await getDocs(q)

        const qcms = await Promise.all(querySnapshot.docs.map(async (qcmDoc) => {
            const qcmData = { id: qcmDoc.ref.id, ...qcmDoc.data() } as Qcm;

            const answersSnapshot = await getDocs(collection(db, `${qcmPath}/${qcmDoc.id}/answers`));
            const answers = answersSnapshot.docs.map(answerDoc => ({ id: qcmDoc.ref.id, ...answerDoc.data() } as Answer));

            // Ajouter les réponses au QCM
            return { ...qcmData, answers } as Qcm;
        }));



        return qcms;

    }


}

export default new QcmService()
