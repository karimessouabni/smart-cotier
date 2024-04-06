// import { Category, Sorters } from '../types'
import { addDoc, collection, doc, getDocs, orderBy, query, setDoc } from 'firebase/firestore/lite'
import { db, auth } from '../firebase'
import { Answer, ChapterProgression, Qcm, Quiz } from '../data/chapters'

class UserService {

    fetchAllProgressionOfChapter = async (chapterId: string) => {
        try {
            const q = query(collection(db, `users/ ${auth.currentUser?.uid}/chapter/${chapterId}/lessonProgress`));
            const querySnapshot = await getDocs(q)
            return querySnapshot.docs.map((fbDoc) => fbDoc.data() as ChapterProgression)
        } catch (e) {
            console.error('Error on fetchAllProgressionOfChapter: ', e)
            return []
        }
    }

    fetchAllAnswers = async (quizId: string, qcmId: string) => {
        const q = query(collection(db, `quiz/${quizId}/qcms/${qcmId}/answers`));
        const querySnapshot = await getDocs(q)
        return querySnapshot.docs.map((fbDoc) => fbDoc.data() as Answer)
    }

    updateChapterProgression = async (chapterProgress: ChapterProgression) => {
        try {
            const chapterProgressRef = doc(db, `users/ ${auth.currentUser?.uid}/chapter/${chapterProgress.chapterId}/lessonProgress`, chapterProgress.lessonId)
            await setDoc(chapterProgressRef, chapterProgress, { merge: true })
            console.log("updated")
        } catch (e) {
            console.error('Error on createNewChapterProgression: ', e)
            return null
        }
    }
}

export default new UserService()
