// import { Category, Sorters } from '../types'
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, setDoc } from 'firebase/firestore/lite'
import { db } from '../firebase'
import { Chapter } from '../data/chapters'

class ChapterService {

    fetchAllChapters = async () => {
        console.log('fetching all chapter from Service')
        const q = query(this.getAllChapters(), orderBy('order'));
        const querySnapshot = await getDocs(q)
        return querySnapshot.docs.map((fbDoc) => {
            return { id: fbDoc.id, progress: 30, ...fbDoc.data() } as Chapter
        })
    }



    private getAllChapters() {
        return collection(db, 'chapters/')
    }
}

export default new ChapterService()
