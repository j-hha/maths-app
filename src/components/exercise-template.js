const exerciseTemplate = () => {
    const main = document.getElementById("main");
    const template = document.querySelector("#lesson-card");
    const clone = template.content.cloneNode(true);
    main.appendChild(clone);
    const input = document.getElementById("js-input")
    input.focus({ focusVisible: true });
};

export default exerciseTemplate;