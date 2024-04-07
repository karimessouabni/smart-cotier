// import { Category, Sorters } from '../types'
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, setDoc } from 'firebase/firestore/lite'
import { auth, db } from '../firebase'
import { Chapter, ChapterProgress } from '../data/chapters'

class ChapterService {

    fetchAllChapters = async () => {
        console.log('fetching all chapter from Service')
        const q = query(collection(db, 'chapters/'), orderBy('order'));
        const querySnapshot = await getDocs(q)
        return querySnapshot.docs.map((fbDoc) => {
            return { id: fbDoc.id, progress: 0, ...fbDoc.data() } as Chapter
        })
    }



    fetchAllChapProgress = async () => {
        try {
            const q = query(collection(db, `users/${auth.currentUser?.uid}/chapters`));
            const querySnapshot = await getDocs(q)
            return querySnapshot.docs.map((fbDoc) => {
                return { id: fbDoc.id, ...fbDoc.data() } as ChapterProgress
            })
        } catch (e) {
            console.error('Error on fetchAllProgressionOfLessons: ', e)
            return []
        }
    }


    fetchAllChaptersWithProgress = async () => {
        const chapters = await this.fetchAllChapters()
        const progress = await this.fetchAllChapProgress()
        chapters.forEach((chapter) => {
            const matchingProgress = progress.find((p) => p.id === chapter.id);
            if (matchingProgress) {
                chapter.progress = matchingProgress.progress;
            }
        });
        return chapters;

    }





}

export default new ChapterService()
