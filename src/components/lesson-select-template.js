import Lesson from "./lesson";
import LessonView from "./lesson-view";
import exerciseTemplate from "./exercise-template";

const lessonSelectTemplate = () => {
    const main = document.getElementById("main");
    const template = document.querySelector("#lesson-select");
    const mainHeading = document.querySelector("#lesson-select__main-heading");

    const startLesson = (lessonType, mode) => {
        main.innerHTML = '';
        exerciseTemplate();
        const lessonData = new Lesson(10, lessonType, mode);
        const lessonView = new LessonView(lessonData.data);
        lessonView.init();
    };

    const mainHeadingClone = mainHeading.content.cloneNode(true);
    main.appendChild(mainHeadingClone);

    for (let i = 0; i <= 10; i++) {
        const clone = template.content.cloneNode(true);
        const heading = clone.querySelector('.lesson-select__title');
        const number = i.toString();
        heading.textContent = number;

        const buttons = clone.querySelectorAll('.lesson-select__button');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                startLesson(number, button.dataset.mode);
            })
        });
        main.appendChild(clone);
    }

    const templateRandom = document.querySelector("#lesson-select--random");
    const clone = templateRandom.content.cloneNode(true);
    const heading = clone.querySelector('.lesson-select__title');
    const button = clone.querySelector("button");
    const title = 'Zufall';
    const buttonValue = 'Start'
    heading.textContent = title;
    button.addEventListener('click', () => {
        startLesson(buttonValue, 'random');
    });
    main.appendChild(clone);
};

export default lessonSelectTemplate;