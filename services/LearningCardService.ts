// import { Category, Sorters } from '../types'
import { collection, getDocs, query } from 'firebase/firestore/lite'
import { db } from '../firebase'

class LearningCardService {

    fetchFirstText = async (chapterId: string, lessonId: string) => {
        console.log('fetching all chapter from Service')
        const q = query(this.getFirstText(chapterId, lessonId))
        const querySnapshot = await getDocs(q)
        return querySnapshot.docs.map((fbDoc) => {
            return fbDoc.data() as String
        })
    }



    private getFirstText(chapterId: string, lessonId: string) {
        return collection(db, `chapters/${chapterId}'/lessons/${lessonId}/text1`)
    }
}

export default new LearningCardService()
