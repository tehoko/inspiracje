let wordsContainer = [ ];
let wordsHistory = [ ];
let wordsHistoryIndex = 0;
let containers = [
    { type: "noun",       color: "#1c74c1", label: "rzeczownik" },
    { type: "location",   color: "#14a020", label: "miejsce" },
    { type: "character",  color: "#ce9900", label: "postać" },
    { type: "relation",   color: "#d40b0b", label: "relacja" },
    { type: "emotion",    color: "#bb2392", label: "emocja" },
    { type: "dictionary", color: "#777777", label: "dowolne słowo" },
];

function sectionId(type) {
    return `section-${type}`;
}

function nextButtonId(type) {
    return `button-next-${type}`;
}

function prevButtonId(type) {
    return `button-prev-${type}`;
}

function sectionWordId(type) {
    return `word-${type}`;
}

function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

function setWord(type, word) {
    let wordBox = document.getElementById(sectionWordId(type));
    wordBox.innerHTML = word;
}

function ajax(url, callback) {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            callback(xhr.responseText);
        }
    }
    xhr.open("GET", url, true);
    xhr.send();
}

function getWords(type, firstInit) {
    ajax("ajax/" + type + ".php", function(output) {
        wordsContainer[type].words = eval(output);
        shuffle(wordsContainer[type].words);
        document.getElementById(nextButtonId(type)).disabled = false;
        if (firstInit) {
            wordsContainer[type].nextWord();
        }
    });
}

class Container {
    constructor(type, color, label) {
        this.type = type;
        this.color = color;
        this.label = label;
        this.wordsHistory = [ ];
        this.wordsHistoryIndex = 0;
        this.init(true);
        addSection(type, color, label);
    }

    init(firstInit = false) {
        this.words = [ ];
        this.index = 0;
        getWords(this.type, firstInit);
    }

    nextIndex() {
        let index = this.index++;
        if (index >= this.words.length - 10)
            this.init();
        return index;
    }

    nextWord() {
        let word = this.words[this.nextIndex()];
        setWord(this.type, word);
        this.pushHistory(word);
    }

    prevWord() {
        let word = this.popHistory();
        if (this.wordsHistoryIndex === 0)
            document.getElementById(prevButtonId(this.type)).disabled = true;
        if (word === undefined) {
            word = "&middot;&middot;&middot;";
            document.getElementById(prevButtonId(this.type)).disabled = true;
        }
        setWord(this.type, word);
    }

    pushHistory(word) {
        this.wordsHistory.push(word);
        this.wordsHistoryIndex = this.wordsHistory.length - 1;
        if (this.wordsHistoryIndex > 0)
            document.getElementById(prevButtonId(this.type)).disabled = false;
    }

    popHistory() {
        this.wordsHistoryIndex--;
        return this.wordsHistory[this.wordsHistoryIndex];
    }
}

function addSectionButtons(parentElement, type, color) {
    let prevButton = document.createElement("button");
    prevButton.id = prevButtonId(type);
    prevButton.disabled = true;
    prevButton.innerHTML = `<span style="color: ${color}">&laquo;</span>`;
    prevButton.addEventListener("click", function(e) {
        e.preventDefault();
        wordsContainer[type].prevWord();
    });

    let nextButton = document.createElement("button");
    nextButton.id = nextButtonId(type);
    nextButton.disabled = true;
    nextButton.style.backgroundColor = color;
    nextButton.innerHTML = "<span>&raquo;</span>";
    nextButton.addEventListener("click", function(e) {
        e.preventDefault();
        wordsContainer[type].nextWord();
    });

    parentElement.appendChild(prevButton);
    parentElement.appendChild(nextButton);
}

function addSectionHeader(parentElement, color, label) {
    let header = document.createElement("div");
    header.classList.add("section-header");
    header.style.color = color;
    header.innerHTML = label;
    parentElement.appendChild(header);
}

function addSectionWord(parentElement, type, color) {
    let div = document.createElement("div");
    div.id = sectionWordId(type);
    div.style.color = color;
    div.innerHTML = "&middot;&middot;&middot;";
    parentElement.appendChild(div);
}

function addSection(type, color, label) {
    let section = document.createElement("div");
    section.id = sectionId(type);
    addSectionHeader(section, color, label);
    addSectionButtons(section, type, color);
    addSectionWord(section, type, color);
    document.getElementsByTagName("main")[0].appendChild(section);
}

function init() {
    for (let c of containers)
        wordsContainer[c.type] = new Container(c.type, c.color, c.label);
}

if (document.readyState != "loading")
    init();
else if (document.addEventListener)
    document.addEventListener("DOMContentLoaded", init);
else
    document.attachEvent("onreadystatechange", function() {
        if (document.readyState == "complete")
            init();
    });