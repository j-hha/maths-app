const exerciseTemplate = () => {
    const main = document.getElementById("main");
    const template = document.querySelector("#lesson-card");
    const clone = template.content.cloneNode(true);
    main.appendChild(clone);
};

export default exerciseTemplate;