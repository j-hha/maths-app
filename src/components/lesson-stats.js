const setView = ({ incorrectAnswers, startTime }, newLessonCB) => {
    const messages = {
        '0': 'Perfekt! Alle Deine Antworten waren richtig. Das Üben zahlt sich aus.',
        '1': 'Super! Fast alle Deine Antworten waren richtig. Das Üben zahlt sich aus.',
        '2': 'Sehr gut! Die meisten Deiner Antworten waren richtig. Übe noch ein bisschen, dann sind bestimmt bald alle Antworten korrekt.',
        '3': 'Gut! Die Mehrheit Deiner Antworten waren richtig. Übe noch ein bisschen, dann sind bestimmt bald alle Antworten korrekt.',
        'default': 'Geschafft! Du hast alle Lösungen herausgefunden. Ein bisschen mehr Übung brauchst aber Du noch. Bleib dran.',
    }
    const messageNode = document.getElementById('js-lesson-stats-message');
    messageNode.innerHTML = messages[incorrectAnswers.toString()] !== undefined? messages[incorrectAnswers.toString()] : messages.default;
    
    const incorrectAnswersNode = document.getElementById('js-lesson-stats-incorrect');
    incorrectAnswersNode.innerHTML = incorrectAnswers.toString();

    const timedNode = document.getElementById('js-lesson-stats-time');
    const timeElapsed = Math.floor((Date.now() - startTime)/1000)
    timedNode.innerHTML = timeElapsed.toString();
    const newSession = document.getElementById('js-new');
    newSession.addEventListener('click', newLessonCB);
}

const lessonStats = (progress, newLessonCB) => {
    const main = document.getElementById("main");
    const template = document.querySelector("#lesson-stats");
    const clone = template.content.cloneNode(true);
    main.innerHTML = '';
    main.appendChild(clone);
    setView(progress, newLessonCB);
}

export default lessonStats