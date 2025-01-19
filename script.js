//Event listener that waits until the HTML document has loaded fulkly
document.addEventListener('DOMContentLoaded', function() {
    //variables used for the code below
    const questionNum = document.getElementById('questionNum');
    const currentQuestion = document.getElementById('questionAsk');
    const options = document.querySelectorAll('.option');
    const start = document.getElementById("start");
    const hide = document.getElementById("hide");
    let userAnswers = [];
    let questions = [];
    let currentQuestionIndex = 0;
    const totalQuestions = 10;
    let quizStartTime;

    // uses the fetch API to read the JSON file and put it in an array
    fetch('questions.json')
        .then(response => response.json())
        .then(data => {
            // randomly selects the questions
            questions = pickRandomQuestions(data, totalQuestions);
            // Event listener that waits until the start button is clicked
            start.addEventListener("click", () => {
                // hides the overlay then generates the questions, answers, and timer
                hide.style.display = "none";
                quizStartTime = Date.now();
                // timer for 15 minutes for the quiz
                var fifteenMinutes = 60 * 15;
                // displays the timer
                var display = document.querySelector('#time');
                // starts the timer and displays it
                startTimer(fifteenMinutes, display);
                // starts the quiz
                startQuiz();
            });
            options.forEach((option, index) => {
                option.addEventListener('click', () => {
                    handleAnswerSelection(index);
                });
            });
            start.style.display = 'block';
        })
        .catch(err => console.error('Error fetching questions:', err));
    // funtions used to shuffle the array of questions
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    // funtion used to pick the questions randomly
    function pickRandomQuestions(array, numQuestions) {
        shuffleArray(array);
        return array.slice(0, numQuestions);
    }
    //funtion to start the quiz
    function startQuiz() {
        currentQuestionIndex = 0;
        displayQuestion();
    }
    // funtion to start the timer 
    function startTimer(duration, display) {
        let timer = duration, minutes, seconds;
        const timerInterval = setInterval(function () {
            minutes = parseInt(timer / 60, 10);
            seconds = parseInt(timer % 60, 10);

            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            display.textContent = minutes + ":" + seconds;

            if (--timer < 0) {
                clearInterval(timerInterval);
                evaluateAnswers();
            }
        }, 1000);
    }
    //funtion used to handle what answers get picked for the questions
    function handleAnswerSelection(index) {
        const optionLetters = ['A', 'B', 'C', 'D'];
        userAnswers[currentQuestionIndex] = {
            questionId: currentQuestionIndex,
            selectedOption: optionLetters[index]
        };
        if (currentQuestionIndex < totalQuestions - 1) {
            currentQuestionIndex++;
            displayQuestion();
        } else {
            evaluateAnswers();
        }
    }
    // displays the questions and the answer options
    function displayQuestion() {
        const current = questions[currentQuestionIndex];
        questionNum.innerText = `Question ${currentQuestionIndex + 1}`;
        currentQuestion.innerText = current.question;
        options[0].innerText = current.A;
        options[1].innerText = current.B;
        options[2].innerText = current.C;
        options[3].innerText = current.D;
    }
    // method to check which answers were picked and sends the score and time to be displayed
    function evaluateAnswers() {
        let score = 0;
        userAnswers.forEach(answer => {
            if (questions[answer.questionId].answer === answer.selectedOption) {
                score++;
            }
        });
        let timeSpent = (Date.now() - quizStartTime) / 1000; // Calculate time spent in seconds
        let timeFormatted = `${Math.floor(timeSpent / 60)}:${Math.floor(timeSpent % 60).toString().padStart(2, '0')}`;
        // sends the time and the score to the resultPage
        window.location.href = `resultPage.html?score=${score}&time=${timeFormatted}`;
    }
});
