// import { Category, Sorters } from '../types'
import { collection, getDocs, orderBy, query } from 'firebase/firestore/lite'
import { db } from '../firebase'
import { Lesson } from '../data/chapters'

class LessonService {

    fetchAllLessonOfChapter = async (chapterId: string) => {
        console.log('fetching all chapter from Service')
        const q = query(this.getAllLessons(chapterId), orderBy('order'));

        const querySnapshot = await getDocs(q)
        return querySnapshot.docs.map((fbDoc) => {
            return { id: fbDoc.id, ...fbDoc.data() } as Lesson
        })
    }



    private getAllLessons(chapterId: string) {
        return collection(db, 'chapters/' + chapterId + '/lessons')
    }
}

export default new LessonService()
