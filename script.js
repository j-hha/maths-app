
const insertCard = () => {
    const main = document.getElementById("main");
    const template = document.querySelector("#lesson-card");
    const clone = template.content.cloneNode(true);
    main.appendChild(clone);
};

const insertLessonSelect = () => {
    const main = document.getElementById("main");
    const template = document.querySelector("#lesson-select");

    for (let i = 0; i <= 10; i++) {
        const clone = template.content.cloneNode(true);
        const button = clone.querySelector("button");
        const buttonValue = i.toString();
        button.textContent = buttonValue;
        button.addEventListener('click', () => {
            main.innerHTML = '';
            insertCard();
            const currentLesson = new Lesson(10, buttonValue);
            currentLesson.init();
        });
        main.appendChild(clone);
    }

        const clone = template.content.cloneNode(true);
        const button = clone.querySelector("button");
        const buttonValue = 'Zufall';
        button.textContent = buttonValue;
        button.addEventListener('click', () => {
            main.innerHTML = '';
            insertCard();
            const currentLesson = new Lesson(10, buttonValue);
            currentLesson.init();
        });
        main.appendChild(clone);
};

class LessonData {
    constructor(numOfLessons, lessonType) {
        this.lessonData = this.generateLessonData(numOfLessons, lessonType); 
    }

    generateLessonData(numOfLessons = 0, lessonType='1') {
        const result = [];
        let factor = 0;
        const parsedLessonType = parseInt(lessonType, 10);
        
        if (typeof parsedLessonType === 'number' && !isNaN(parsedLessonType)) {
            result.push(
                {
                    factor1: i,
                    factor2: lessonType,
                }
            ); 

            return result;
        }

        for (let i=0; i <= numOfLessons; i++) {
            result.push(
                {
                    factor1: this.generateRandomNum(0, 10),
                    factor2: this.generateRandomNum(0, 10),
                }
            );
        }

        return result;
    }

    generateRandomNum(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min);   
    }
}

class Lesson extends LessonData {
    constructor(numOfLessons, lessonType) {
        super(numOfLessons, lessonType);
        this.progress = {
            exerciseIndex: 0,
            correctAnswers: 0,
            incorrectAnswers: 0,
        };

        this.numOfLessons = numOfLessons;
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.checkAnswer = this.checkAnswer.bind(this);
        this.next = this.next.bind(this);
        this.newLesson = this.newLesson.bind(this);

        this.elements = {
            form: document.getElementById('js-form'),
            input: document.getElementById('js-input'),
            response: document.getElementById('js-response'),
            factor1: document.getElementById('js-factor-1'),
            factor2: document.getElementById('js-factor-2'),
            next: document.getElementById('js-next'),
            submit: document.getElementById('js-submit'),
            newSession: document.getElementById('js-new'),
        }
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
        console.log('new Lesson')
        this.resetResponse();
        this.resetAnswer();
        main.innerHTML = '';
        insertLessonSelect();
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

        if (exerciseIndex === this.numOfLessons) {
            this.updateView(true, true, 'new')
            this.showResponse(`Super! ${answer} ist korrekt! Du hast alle Aufgaben gelöst.`);
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

insertLessonSelect();