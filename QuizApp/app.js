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
  if (document.getElementById('result')) {
    currentTimeouts.forEach(x => clearTimeout(x))
    currentIntervals.forEach(x => clearInterval(x))
    displayMainScreen();
  } else {
    if (confirm('Do you want to cancel this quiz and start new game?')) {
      currentTimeouts.forEach(x => clearTimeout(x))
      currentIntervals.forEach(x => clearInterval(x))
      displayMainScreen();
    }
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
    showResult()
  } else {
    nextElement.style.display = 'block';
    currentTimeouts.push(setTimeout(() => timeRanOut(nextElement), 30000))
    let timer = document.querySelector('b')
    currentIntervals.push(setInterval(() => timer.textContent = Number(timer.textContent) - 1, 1000));
  }
}

function showResult() {
  let h2 = document.createElement('h2');
  h2.textContent = "Result from last quiz:";
  main.appendChild(h2);
  let container = document.createElement('div');
  container.className = 'chart-container';
  let chartEl = document.createElement('canvas');
  chartEl.id = "result";
  container.appendChild(chartEl);
  main.appendChild(container);
  createChartForLastQuiz(chartEl);

  h2 = document.createElement('h2');
  h2.textContent = "Overall score per category:";
  main.appendChild(h2);
  container = document.createElement('div');
  container.className = 'chart-container';
  chartEl = document.createElement('canvas');
  chartEl.id = "result";
  container.appendChild(chartEl);
  main.appendChild(container);
  createChartPerCategory(chartEl);
}

function createChartForLastQuiz(chartEl) {
  let ctx = chartEl.getContext('2d')
  let myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Answers'],
      datasets: [{
        label: 'Correct Answers',
        data: [currentQuizResult.correctAnswers],
        backgroundColor: [
          'rgb(32, 186, 32)',
        ],
        borderColor: [
          'rgb(32, 186, 32)',
        ],
        borderWidth: 1
      },
      {
        label: 'Incorrect Answers',
        data: [currentQuizResult.incorrectAnswers],
        backgroundColor: [
          'rgb(255, 99, 132)',
        ],
        borderColor: [
          'rgb(255, 99, 132)',
        ],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            precision: 0
          }
        }]
      }
    },
  });
}

async function createChartPerCategory(chartEl) {
  let resp = await fetch('https://localhost:5001/api/categories');
  let data = await resp.json();
  console.log(data);
  let ctx = chartEl.getContext('2d')
  let labels = Object.keys(resultPerCategory).map(x => data.find(c => c.id == x).name);
  let correctAnswers = Object.values(resultPerCategory).map(x => x.correctAnswers);
  let incorrectAnswers = Object.values(resultPerCategory).map(x => x.incorrectAnswers);
  let backgroundColorCorrectAnswers = new Array(labels.length);
  backgroundColorCorrectAnswers.fill('rgb(32, 186, 32)');
  let backgroundColorIncorrectAnswers = new Array(labels.length);
  backgroundColorIncorrectAnswers.fill('rgb(255, 99, 132)');
  let myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Correct Answers',
        data: correctAnswers,
        backgroundColor: backgroundColorCorrectAnswers,
        borderWidth: 1
      },
      {
        label: 'Incorrect Answers',
        data: incorrectAnswers,
        backgroundColor: backgroundColorIncorrectAnswers,
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            precision: 0
          }
        }]
      }
    },
  });
}

displayMainScreen();