
import { shuffle } from "../helpers/shuffle";
import { getRandomNum } from "../helpers/get-random-num";

class Lesson {
    constructor(numOfExercises, lessonType, mode) {
        this.data = this.getLesson(numOfExercises, lessonType, mode); 
    }

    generateLessonData(numOfExercises = 0, lessonType='1') {
        const result = [];
        const parsedLessonType = parseInt(lessonType, 10);
        const isMultiplicationTableRow = typeof parsedLessonType === 'number' && !isNaN(parsedLessonType);
        
        if (isMultiplicationTableRow) {
            for (let i = 0; i <= numOfExercises; i++) {
                result.push(
                    {
                        factor1: i,
                        factor2: lessonType,
                    }
                ); 
            }

            return result;
        }

        for (let i = 0; i <= numOfExercises; i++) {
            result.push(
                {
                    factor1: getRandomNum(0, 10),
                    factor2: getRandomNum(0, 10),
                }
            );
        }

        return result;
    }
    
    orderLessonData(data, mode) {
        switch(mode) {
            case 'regular':
                return data;
            case 'reverse':
                return data.reverse();
            case 'random':
                return shuffle(data);
            default: 
                throw new Error('Unknown lesson mode.');
        }
    }

    getLesson(numOfExercises = 0, lessonType='1', mode = 'regular')  {
        const data = this.generateLessonData(numOfExercises, lessonType);
        try {
            return this.orderLessonData(data, mode)
        } catch(error) {
            console.log(error.message);
            return data;
        }
    }
}

export default Lesson;