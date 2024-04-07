// import { Category, Sorters } from '../types'
import { collection, doc, getDoc, getDocs, increment, query, setDoc, updateDoc } from 'firebase/firestore/lite'
import { db, auth } from '../firebase'
import { LessonProgression } from 'types';

class UserService {

    fetchAllProgressionOfLessons = async (chapterId: string) => {
        try {
            const q = query(collection(db, `users/${auth.currentUser?.uid}/chapters/${chapterId}/lessonProgress`));
            const querySnapshot = await getDocs(q)
            return querySnapshot.docs.map((fbDoc) => fbDoc.data() as LessonProgression)
        } catch (e) {
            console.error('Error on fetchAllProgressionOfLessons: ', e)
            return []
        }
    }


    updateLessonProgression = async (chapterProgress: LessonProgression) => {
        try {
            const lessonProgressRef = doc(db, `users/${auth.currentUser?.uid}/chapters/${chapterProgress.chapterId}/lessonProgress`, chapterProgress.lessonId)
            await setDoc(lessonProgressRef, chapterProgress, { merge: true })
            console.log("updateLessonProgression ✅")
        } catch (e) {
            console.error('Error on updateLessonProgression: ', e)
            return null
        }
    }


    increaseChapterProgression = async (chapterId: string) => {
        try {
            const chapterProgressRef = doc(db, `users/${auth.currentUser?.uid}/chapters`, chapterId)
            // Atomically increment the progress field by 1.

            const docSnap = await getDoc(chapterProgressRef);

            if (!docSnap.exists()) {
                // Document does not exist, create it
                await setDoc(chapterProgressRef, {
                    uid: chapterId,
                    progress: 1
                })
                    .then(() => {
                        console.log(`Document with UID '${auth.currentUser?.uid}' successfully created.`);
                    })
                    .catch((error) => {
                        console.error('Error creating document: ', error);
                    });
            } else {
                console.log(`Document with UID '${auth.currentUser?.uid}' already exists.`);
                await updateDoc(chapterProgressRef, {
                    progress: increment(+1)
                });
                console.log("increaseChapterProgression +1 ✅")
            }

        } catch (e) {
            console.error('Error on increaseChapterProgression: ', e)
            return null
        }
    }

    decreaseChapterProgression = async (chapterId: string) => {
        try {
            const chapterProgressRef = doc(db, `users/${auth.currentUser?.uid}/chapters`, chapterId)
            // Atomically increment the progress field by 1.

            const docSnap = await getDoc(chapterProgressRef);

            if (!docSnap.exists()) {
                // Document does not exist, create it
                await setDoc(chapterProgressRef, {
                    uid: chapterId,
                    progress: 0
                })
                    .then(() => {
                        console.log(`Document with UID '${auth.currentUser?.uid}' successfully created.`);
                    })
                    .catch((error) => {
                        console.error('Error creating document: ', error);
                    });
            } else {
                console.log(`Document with UID '${auth.currentUser?.uid}' already exists.`);
                await updateDoc(chapterProgressRef, {
                    progress: increment(-1)
                });
                console.log("increaseChapterProgression -1 ✅")
            }

        } catch (e) {

            console.error('Error on increaseChapterProgression: ', e)
            return null
        }
    }


}

export default new UserService()
