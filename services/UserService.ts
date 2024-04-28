// import { Category, Sorters } from '../types'
import { collection, doc, orderBy, getDoc, getDocs, increment, query, addDoc, setDoc, updateDoc, Timestamp } from 'firebase/firestore/lite'
import { db, auth } from '../firebase'
import { LessonProgression, UserQuizResult } from 'types';
import { limit, } from 'firebase/firestore';

class UserService {
    async saveUserQuizResult(userQuizResult: UserQuizResult) {
        try {

            const path = userQuizResult.chapterId ? `users/${auth.currentUser?.uid}/chapters/${userQuizResult.chapterId}/quiz/${userQuizResult.quizId}/scores` : `users/${auth.currentUser?.uid}/quiz/${userQuizResult.quizId}/scores`

            const userQuizResultRes = await addDoc(collection(db, path),
                {
                    ...userQuizResult,
                    createdDate: Timestamp.now(),
                })
            return userQuizResultRes.id
        } catch (e) {
            console.error('Error on saveUserQuizResult: ', e)
            return null
        }
    }

    fetchScoreRateForAQuiz = async (quizId: string) => {
        try {
            console.log("fetchScoreRateForAQuiz ✅")
            const q = query(collection(db, `users/${auth.currentUser?.uid}/quiz/${quizId}/scores`), orderBy('createdDate', 'asc'));
            const querySnapshot = await getDocs(q)
            return querySnapshot.docs.map((fbDoc) => {
                const data = fbDoc.data() as UserQuizResult
                return data.rate ? data.rate : 0
            })

        } catch (e) {
            console.error('Error on fetchAllProgressionOfLessons: ', e)
            return []
        }
    }



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
                console.log("decreaseChapterProgression -1 ✅")
            }

        } catch (e) {

            console.error('Error on increaseChapterProgression: ', e)
            return null
        }
    }


}

export default new UserService()
