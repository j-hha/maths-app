
class LessonData {
    constructor(numOfLessons) {
        this.lessonData = this.generateLessonData(numOfLessons); 
    }

    generateLessonData(numOfLessons = 0) {
        const result = [];

        for (let i=0; i < numOfLessons; i++) {
            result.push(
                {
                    factor1: this.generateNum(0, 10),
                    factor2: this.generateNum(0, 10),
                }
            );
        }

        return result;
    }

    generateNum(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min);   
    }
}

class Lesson extends LessonData {
    constructor(elements, numOfLessons) {
        super(numOfLessons);
        this.progress = {
            exerciseIndex: 0,
            correctAnswers: 0,
            incorrectAnswers: 0,
        };
        this.elements = elements;
        this.numOfLessons = numOfLessons;

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.checkAnswer = this.checkAnswer.bind(this);
        this.next = this.next.bind(this);
        this.newLesson = this.newLesson.bind(this);

    }

    updateProgress(newVal) {
        this.progress = {
            ...this.progress,
            ...newVal
        };
    }

    generateExercise() {
        const { factor1, factor2 } = this.elements;
        const { exerciseIndex } = this.progress;
        factor1.innerHTML = this.lessonData[exerciseIndex].factor1;
        factor2.innerHTML = this.lessonData[exerciseIndex].factor2;
    }

    newLesson() {
        this.resetResponse();
        this.resetAnswer();
        this.updateView(false, false, 'new')
        const currentLesson = new Lesson(elements, 2);
        currentLesson.init();
    }

    init() {
        const { form, input, next, newSession} = this.elements;
        this.generateExercise();
        form.addEventListener('submit', this.handleSubmit);
        input.addEventListener('change', this.handleChange);
        next.addEventListener('click', this.next);
        newSession.addEventListener('click', this.newLesson);
    }

    next() {
        this.generateExercise();
        this.resetResponse();
        this.resetAnswer();
        this.updateView(false, false, 'next')
    }

    checkAnswer(answer) {
        const { next, input, submit, form } = this.elements;
        const { exerciseIndex, correctAnswers, incorrectAnswers } = this.progress;
        const result = this.lessonData[exerciseIndex].factor1 * this.lessonData[exerciseIndex].factor2;

        if(result !== parseInt(answer)) {
            this.updateProgress({ 
                incorrectAnswers: incorrectAnswers+1,
            });
            throw new Error('Rechne bitte noch mal nach. Dieses Ergebnis stimmt leider nicht.');
        }

        if (exerciseIndex === this.numOfLessons - 1) {
            this.updateView(true, true, 'new')
            this.showResponse(`Super! ${answer} ist korrekt! Du hast hast alle Aufgaben gelöst.`);
        } else {
            this.updateView(true, true, 'next')
            this.showResponse(`Super! ${answer} ist korrekt! Weiter so!`);
        }

        this.updateProgress({ 
                exerciseIndex: exerciseIndex+1, 
                correctAnswers: correctAnswers+1,
            });
    }

    updateView(disableForm=false, showButton=false, buttonType='') {
        const { next, input, submit, form, newSession } = this.elements;        
        input.disabled = disableForm;
        submit.disabled = disableForm;
        form.disabled = disableForm;

        if(typeof buttonType !== 'string' || buttonType.length === 0) {
            return;
        }

        let button = null;

        switch(buttonType) {
            case 'next': 
                button = next;
                break;
            case 'new':
                button = newSession;
                break;
            default:
                button = null;
        }

        if (!button) {
            return;
        }

        if (showButton) {
            button.classList.add(`button__${buttonType}--visible`);
        } else {
            button.classList.remove(`button__${buttonType}--visible`);
        }
    }

    validateForm(data) {
        if (!data || isNaN(parseInt(data)) ) {
            throw new Error('Bitte gib eine Zahl ein.');
        }

        this.checkAnswer(data)
    }

    showResponse(message) {
        const { response } = this.elements;
        response.innerHTML = message;
    }
     
    setErrors(message) {
        const { input } = this.elements;
        input.classList.add('input--error')
        this.showResponse(message);
    }

    resetError() {
        const { input } = this.elements;
        input.classList.remove('input--error');
    }
     
    resetResponse() {
        this.showResponse('');
    }

    resetAnswer() {
        const { input } = this.elements;
        input.value = '';
    }

    handleChange() {
        this.resetResponse();
    }
    
    handleSubmit(event) {
        const {input: { value } } = this.elements;
        this.resetResponse();
        event.preventDefault();
        console.log('submitting', value);
    
        try {
            this.validateForm(value);
        } catch (error) {
            this.setErrors(error.message);
        }
    }
}

const elements = {
    form: document.getElementById('js-form'),
    input: document.getElementById('js-input'),
    response: document.getElementById('js-response'),
    factor1: document.getElementById('js-factor-1'),
    factor2: document.getElementById('js-factor-2'),
    next: document.getElementById('js-next'),
    submit: document.getElementById('js-submit'),
    newSession: document.getElementById('js-new'),
}

const currentLesson = new Lesson(elements, 5);

currentLesson.init();