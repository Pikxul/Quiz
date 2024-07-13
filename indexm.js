const quizContainer = document.getElementById('quiz');
const nextButton = document.getElementById('next-button');
const finalStatus = document.getElementById('status');
let currentQuestionIndex = 0;
let score = 0;
let questions = [];

async function fetchQuestions() {
    try {
        const response = await fetch('https://opentdb.com/api.php?amount=20&category=9&difficulty=medium');
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        questions = data.results;
        totalmarks = questions.length;
        displayQuestion();
    } catch (error) {
        console.error('Error fetching questions:', error);
    }
}

function displayQuestion() {
    if (currentQuestionIndex >= questions.length) {
        displayResults();
        return;
    }

    quizContainer.innerHTML = '';
    const question = questions[currentQuestionIndex];
    const questionElement = document.createElement('div');
    questionElement.classList.add('question');
    questionElement.innerHTML = `<h2>${question.question}</h2>`;
    quizContainer.appendChild(questionElement);

    const optionsElement = document.createElement('div');
    optionsElement.classList.add('options');
    const options = [...question.incorrect_answers, question.correct_answer].sort(() => Math.random() - 0.5);
    options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option;
        button.onclick = () => {
            checkAnswer(option, question.correct_answer);
            nextButton.style.display = 'block';
        };
        optionsElement.appendChild(button);
    });
    quizContainer.appendChild(optionsElement);

    nextButton.style.display = 'none';
}

function checkAnswer(selected, correct) {
    if (selected === correct) {
        score++;
    }
    currentQuestionIndex++;
}

function displayResults() {
    quizContainer.innerHTML = `<h2>Your Score: ${score} / ${questions.length}</h2>`;
    quizContainer.style.textAlign = 'center';
    finalStatus.innerHTML = `<h3>${fstatus(score, totalmarks)}</h3>`;
    finalStatus.style.textAlign = 'center';
    nextButton.style.display = 'none';
}

function fstatus(score, totalmarks) {
    if (score > 0 && score <= totalmarks / 3) {
        return "Bad! 😞";
    } else if (score > totalmarks / 3 && score <= totalmarks / 1.5) {
        return "Good! 😀";
    } else {
        return "Excellent! 🤩";
    }
}

nextButton.onclick = () => {
    if (currentQuestionIndex < questions.length) {
        displayQuestion();
    } else {
        displayResults();
    }
};

fetchQuestions();
