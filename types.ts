export type Lesson = {
    id: string;
    name: string;
    description: string;
    text1: string;
    imgs: string[]
}


export type LessonProgression = {
    chapterId: string;
    lessonId: string;
    progress: Progress;
}

export enum Progress {
    ZERO = 'ZERO',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
}
export type ChapterProgress = {
    id: string,
    progress: number
}

export type Chapter = {
    id: string;
    name: string;
    nbrLesson: number,
    lessons: Lesson[];
    img: string;
    progress: number;
}

export type Quiz = {
    id: string;
    order: string;
    qcms: Qcm[]
}

export type Qcm = {
    id: string;
    question: string;
    img: string;
    answers: Answer[];
    explain: string;
}

export type Answer = {
    id: string
    text: string;
    valid: boolean;
}

export type UserQuizResult = {
    quizId: string;
    passedDate: Date;
    answeredQcm: AnsweredQcm[];
}

export type AnsweredQcm = {
    qcmId: string;
    answeredId: string[];
    validAnswerId: string[];
}
