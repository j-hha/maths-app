import lessonSelectTemplate from "./lesson-select-template";

class LessonView {
    constructor(lessonData) {
        this.progress = {
            exerciseIndex: 0,
            correctAnswers: 0,
            incorrectAnswers: 0,
        };

        this.lessonData = lessonData;
        this.numOfLessons = lessonData.length;
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
            home: document.getElementById('js-home'),
            mainNav: document.getElementById('js-main-nav'),
            main: document.getElementById("main"),
        }
    }

    updateProgress(newVal) {
        this.progress = {
            ...this.progress,
            ...newVal,
        };
    }

    generateExercise() {
        const { factor1, factor2 } = this.elements;
        const { exerciseIndex } = this.progress;
        factor1.innerHTML = this.lessonData[exerciseIndex].factor1;
        factor2.innerHTML = this.lessonData[exerciseIndex].factor2;
    }

    newLesson() {
        const { main, mainNav } = this.elements;
        this.resetResponse();
        this.resetAnswer();
        main.innerHTML = '';
        mainNav.classList.remove('main-nav--visible');
        lessonSelectTemplate();
    }

    init() {
        const { form, input, next, newSession, home, mainNav} = this.elements;
        this.generateExercise();
        form.addEventListener('submit', this.handleSubmit);
        input.addEventListener('change', this.handleChange);
        next.addEventListener('click', this.next);
        newSession.addEventListener('click', this.newLesson);
        mainNav.classList.add('main-nav--visible');
        home.addEventListener('click', this.newLesson);
    }

    next() {
        const { input } = this.elements;
        this.generateExercise();
        this.resetResponse();
        this.resetAnswer();
        this.updateView(false, false, 'next')
        input.focus({ focusVisible: true });
    }

    checkAnswer(answer) {
        const { next, input, submit, form } = this.elements;
        const { exerciseIndex, correctAnswers, incorrectAnswers } = this.progress;
        const result = this.lessonData[exerciseIndex].factor1 * this.lessonData[exerciseIndex].factor2;
        const cleanAnswer = parseInt(answer) !== 0? answer.replace(/^0+/, '') : answer.replace(/^0+/, '0');

        if(result !== parseInt(answer)) {
            this.updateProgress({ 
                incorrectAnswers: incorrectAnswers+1,
            });
            throw new Error('Rechne bitte noch mal nach. Dieses Ergebnis stimmt leider nicht.');
        }

        if (exerciseIndex === this.numOfLessons-1) {
            this.updateView(true, true, 'new')
            this.showResponse(`Super! ${cleanAnswer} ist korrekt! Du hast alle Aufgaben gelöst.`);
        } else {
            this.updateView(true, true, 'next')
            this.showResponse(`Super! ${cleanAnswer} ist korrekt! Weiter so!`);
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
        response.textContent = message;
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
    
        try {
            this.validateForm(value);
        } catch (error) {
            this.setErrors(error.message);
        }
    }
}

export default LessonView;