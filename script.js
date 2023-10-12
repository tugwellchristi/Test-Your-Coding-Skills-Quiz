// Array with quiz questions
const questions = [
    {
        question: "Where is the correct place to insert a Javascript?",
        answers: [
            { text: "The head section", correct: false },
            { text: "The body section", correct: false },
            { text: "The head and body section are correct", correct: true },
        ]
    },
    {
        question: "How do you write an IF statement in JavaScript?",
        answers: [
            { text: "if (i == 5)", correct: true },
            { text: "if i = 5 then", correct: false },
            { text: "if i == 5 then", correct: false },
        ]
    },
    {
        question: "Which operator is used to assign a value to a variable?",
        answers: [
            { text: "-", correct: false },
            { text: "X", correct: false },
            { text: "=", correct: true },
        ]
    },
    {
        question: "What will the following code return: Boolean(10 > 9)",
        answers: [
            { text: "false", correct: false },
            { text: "true", correct: true },
            { text: "NAN", correct: false },
        ]
    },
    {
        question: "Which event occurs when the user clicks on an HTML element?",
        answers: [
            { text: "onmouseclick", correct: false },
            { text: "click", correct: false },
            { text: "onclick", correct: true },
        ]
    },
];

// Get elements by Id
const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");
const saveButton = document.getElementById("saveBtn");
const countdownEl = document.getElementById("countdown");
const textEl = document.getElementById("text");
const highScoresEl = document.getElementById("highScores");
const initialsEl = document.getElementById("initials");

// Array for storing high scores and initials
const highScoresTable = [];

// Global variables
let currentQuestionIndex = 0;
let score = 0;
let time = 30;
const myInterval = setInterval(startCountdown, 1000);

// Timer function
function startCountdown() {
    // Used template literal to display remaining time statement
    countdownEl.innerHTML = `${time} Seconds To Complete The Quiz`;
    time--;

    if (time === 0) {
        clearInterval(myInterval);
        sendMessage();
    }
}

// Text message function that displays when time is complete
function sendMessage() {
    countdownEl.textContent = "Time is Up!";
    showScore();
}

// Start quiz function that initiates quiz, pulls and displays question from the question array, score starting at 0
function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    initialsEl.style.display = "none";
    highScoresEl.style.display = "none";
    saveButton.style.display = "none";
    nextButton.innerHTML = "Next";
    showQuestion();
    

}
// Show question function displays new question after the reset state occurs
function showQuestion() {
    resetState();
    let currentQuestion = questions[currentQuestionIndex];
    let questionNo = currentQuestionIndex + 1;
    questionElement.innerHTML = questionNo + ". " + currentQuestion.question;

    currentQuestion.answers.forEach(function (answer) {
        const button = document.createElement("button");
        button.innerHTML = answer.text;
        button.classList.add("btn");
        answerButtons.appendChild(button);
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener("click", selectAnswer);
    });
}

// Reset state function removes previous question text and when occuring with the show question function, displays a new question. Also hides the "Next" button until the question has been answered
function resetState() {
    // "None" hides the next button until first question has been answered
    nextButton.style.display = "none";
    while (answerButtons.firstChild) {
        answerButtons.removeChild(answerButtons.firstChild);
    }
}
// Select answer function increments score as buttons are selected
function selectAnswer(e) {
    const selectedBtn = e.target;
    const isCorrect = selectedBtn.dataset.correct === "true";
    if (isCorrect) {
        selectedBtn.classList.add("correct");
        score++;
    } else {
        selectedBtn.classList.add("incorrect");
    }
    Array.from(answerButtons.children).forEach(function (button) {
        if (button.dataset.correct === "true") {
            button.classList.add("correct");
        }
        button.disabled = true;
    });
    nextButton.style.display = "block";
}

// Show score function displays score statement and provides play again button 
function showScore() {
    resetState();
    // Used template literal to display score
    questionElement.innerHTML = `You scored ${score} out of ${questions.length}!`;
    nextButton.innerHTML = "Play Again";
    nextButton.style.display = "block";
    initialsEl.style.display = "block";
    highScoresEl.style.display = "block";   
    saveButton.style.display = "block";

    saveButton.addEventListener("click", function () {
      const initials = initialsEl.ariaValueMax;
      if (initials) {
        const scoreData = { initials: initials, score: score };
        const existingScores = JSON.parse(this.localStorage.getItem("highScores")) || [];
        existingScores.push(scoreData);
        existingScores.sort(function(a,b) {
            return b.score - a.score;
        });
        localStorage.setItem("highScores", JSON.stringify(existingScores));
        displayHighScores();
      }  
    })
}

// Handle next button function displays another question when pressed if the index is less than the array lenght. If all questions have been answered, it displays the score statement
function handleNextButton() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showScore();   
    }
}
nextButton.addEventListener("click", function () {
    if (currentQuestionIndex < questions.length) {
        handleNextButton();
    } else {
        startQuiz();
        
    }
});

startQuiz();

