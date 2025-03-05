let Questions = [];
const ques = document.getElementById("ques");
const timerDisplay = document.getElementById("timer");
let timerInterval;

async function fetchQuestions() {
    try {
        const response = await fetch('https://opentdb.com/api.php?amount=10');
        if (!response.ok) {
            throw new Error('Something went wrong!! Unable to fetch the data');
        }
        const data = await response.json();
        Questions = data.results;
        startQuiz();
    } catch (error) {
        console.log(error);
        ques.innerHTML = `<h5 style='color: red'>${error}</h5>`;
    }
}

function startQuiz() {
    currQuestion = 0;
    score = 0;
    document.getElementById("start-panel").style.display = "none";
    document.getElementById("btn").textContent = "SUBMIT";
    document.getElementById("btn").style.display = "block";
    document.getElementById("score").innerHTML = '';
    document.getElementById("ques").style.display = "block";
    document.getElementById("opt").style.display = "block";
    timerDisplay.style.display = "block";
    loadQues();
}

function startTimer(duration) {
    clearInterval(timerInterval);
    let timer = duration, minutes, seconds;
    
    timerInterval = setInterval(function () {
        minutes = Math.floor(timer / 60);
        seconds = timer % 60;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        timerDisplay.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            clearInterval(timerInterval);
            document.getElementById("timeout-alert").style.display = "block";
        }
    }, 1000);
}

function closeTimeoutAlert() {
    document.getElementById("timeout-alert").style.display = "none";
    nextQuestion();
}


let currQuestion = 0;
let score = 0;

function loadQues() {
    if (Questions.length === 0) return;

    startTimer(60); // Start timer for each question
    
    const opt = document.getElementById("opt");
    let currentQuestion = Questions[currQuestion].question;

    currentQuestion = currentQuestion.replace(/&quot;/g, '"').replace(/&#039;/g, '\'');

    ques.innerText = currentQuestion;
    opt.innerHTML = "";

    const correctAnswer = Questions[currQuestion].correct_answer;
    const incorrectAnswers = Questions[currQuestion].incorrect_answers;
    const options = [correctAnswer, ...incorrectAnswers];
    options.sort(() => Math.random() - 0.5);

    options.forEach((option) => {
        option = option.replace(/&quot;/g, '"').replace(/&#039;/g, '\'');

        const choicesdiv = document.createElement("div");
        const choice = document.createElement("input");
        const choiceLabel = document.createElement("label");

        choice.type = "radio";
        choice.name = "answer";
        choice.value = option;
        choiceLabel.textContent = option;

        choicesdiv.appendChild(choice);
        choicesdiv.appendChild(choiceLabel);
        opt.appendChild(choicesdiv);
    });

    const btn = document.getElementById("btn");
    if (currQuestion < Questions.length - 1) {
        btn.textContent = "NEXT";
    } else {
        btn.textContent = "SUBMIT";
    }
}

function loadScore() {
    clearInterval(timerInterval); // Stop timer when quiz ends

    // Hide the timer when showing the final score
    timerDisplay.style.display = "none";  

    const totalScore = document.getElementById("score");
    totalScore.innerHTML = `<h2 style="color:#007bff; text-align:center;">You scored ${score} out of ${Questions.length}</h2>`;

    let answerText = "<h3 style='color:#007bff; text-align:center;'>All Answers:</h3>";
    answerText += "<ol class='answer-list'>";
    Questions.forEach((el) => {
        answerText += `<li class="answer-item">${el.correct_answer}</li>`;
    });
    answerText += "</ol>";

    totalScore.innerHTML += answerText;

    const restartBtn = document.createElement("button");
    restartBtn.textContent = "RESTART";
    restartBtn.classList.add("restart-btn");
    restartBtn.onclick = restartQuiz;

    const restartDiv = document.createElement("div");
    restartDiv.classList.add("restart-container");
    restartDiv.appendChild(restartBtn);

    totalScore.appendChild(restartDiv);
}


function nextQuestion() {
    if (currQuestion < Questions.length - 1) {
        currQuestion++;
        loadQues();
    } else {
        document.getElementById("opt").style.display = "none";
        document.getElementById("ques").style.display = "none";
        document.getElementById("btn").style.display = "none";
        loadScore();
    }
}

function checkAns() {
    const selectedAns = document.querySelector('input[name="answer"]:checked');
    if (selectedAns) {
        if (selectedAns.value === Questions[currQuestion].correct_answer) {
            score++;
        }
        nextQuestion();
    } else {
        document.getElementById("alert-box").style.display = "block";
    }
}

function closeAlert() {
    document.getElementById("alert-box").style.display = "none";
}


function restartQuiz() {
    fetchQuestions();
}
