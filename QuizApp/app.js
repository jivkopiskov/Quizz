let currentTimeouts = []
let currentIntervals = []
let currentCategory = 0;
let currentQuizResult = { correctAnswers: 0, incorrectAnswers: 0 };
let resultPerCategory = {};
let questionsAnswered = {};
const main = document.getElementById('app')
alertify.set('notifier', 'position', 'top-center');

function displayMainScreen() {
  fetch('https://localhost:5001/api/categories')
    .then(resp => resp.json())
    .then(data => {
      main.innerHTML = '<h1>Choose category:<h1>';
      console.log(data)
      data.forEach(category => {
        let el = document.createElement('p');
        let button = document.createElement('button');
        button.id = category.id;
        button.textContent = category.name;
        button.addEventListener('click', onCategoryClick)
        el.appendChild(button);
        main.appendChild(el);
      });
    })
    .catch(x => console.log(x))
}

function startNewGame() {
  if (confirm('Do you want to cancel this quiz and start new game?')) {
    currentTimeouts.forEach(x => clearTimeout(x))
    currentIntervals.forEach(x => clearInterval(x))
    displayMainScreen();
  }
}

async function onCategoryClick(e) {
  let id = e.target.id;
  currentCategory = e.target.id;
  if (!resultPerCategory[currentCategory]) {
    resultPerCategory[currentCategory] = { correctAnswers: 0, incorrectAnswers: 0 }
  }
  let queryString = questionsAnswered[e.target.id]?.map(x => `exclude=${x}`);
  let resp = await fetch(`https://localhost:5001/api/questions/${id}?${queryString?.join('&')}`)
  let data = await resp.json();
  createQuiz(data, id);

}

function createQuiz(data, id) {
  main.innerHTML = '';
  let newGameButton = document.createElement('button');
  newGameButton.textContent = 'Start new game';
  newGameButton.classList.add('newGame');
  newGameButton.addEventListener('click', startNewGame);
  main.appendChild(newGameButton);

  if (!questionsAnswered[id]) {
    questionsAnswered[id] = [];
  }

  currentQuizResult = { correctAnswers: 0, incorrectAnswers: 0 }

  data.forEach((x, i) => {
    questionsAnswered[id].push(x.id)

    let question = document.createElement('div');
    question.style.display = i == 0 ? "block" : "none";

    let h2 = document.createElement('h2');
    h2.innerText = x.text;
    question.appendChild(h2);

    x.answers.forEach(a => {
      let button = document.createElement('button');
      button.innerText = a.text;
      button.isCorrect = a.isCorrect;
      button.addEventListener('click', onAnswerClick);
      question.appendChild(button);
    });

    let timer = document.createElement('p');
    timer.innerHTML = 'Remaining time: <b>30</b>'
    question.appendChild(timer)

    main.appendChild(question);
  });

  currentTimeouts.push(setTimeout(() => timeRanOut(document.querySelector('main > div')), 30000))
  let timer = document.querySelector('b')
  currentIntervals.push(setInterval(() => timer.textContent = Number(timer.textContent) - 1, 1000));
}

function onAnswerClick(e) {
  alertify.confirm('Confirm', `Are you sure you want to choose ${e.target.textContent}`, function () {
    currentTimeouts.forEach(x => clearTimeout(x))
    currentIntervals.forEach(x => clearInterval(x))
    if (e.target.isCorrect) {
      currentQuizResult.correctAnswers++;
      resultPerCategory[currentCategory].correctAnswers++;
      alertify.success(`Correct!`)

    } else {
      currentQuizResult.incorrectAnswers++;
      resultPerCategory[currentCategory].incorrectAnswers++;
      alertify.error(`Wrong!`)
    }
    nextQuestion(e.target.parentElement);

  }, function () { });
}

function timeRanOut(el) {
  currentIntervals.forEach(x => clearInterval(x))
  currentQuizResult.incorrectAnswers++;
  resultPerCategory[currentCategory].incorrectAnswers++;
  nextQuestion(el)
  alertify.confirm().destroy(); 
  alertify.error("Time ran out. Marked as incorrect.")
}

function nextQuestion(currentQuestion) {
  let nextElement = currentQuestion.nextElementSibling;
  currentQuestion.remove();
  if (!nextElement) {
    displayMainScreen()
  } else {
    nextElement.style.display = 'block';
    currentTimeouts.push(setTimeout(() => timeRanOut(nextElement), 30000))
    let timer = document.querySelector('b')
    currentIntervals.push(setInterval(() => timer.textContent = Number(timer.textContent) - 1, 1000));
  }
}

displayMainScreen();