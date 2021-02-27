let currentInterval =  []
let result = { correctAnswers: 0, incorrectAnswers: 0 };
let questionsAnswered = {
};
const main = document.getElementById('app')

function displayMainScreen() {
  fetch('https://127.0.0.1:5001/api/categories')
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

async function onCategoryClick(e) {
  let id = e.target.id;
  let queryString = questionsAnswered[e.target.id]?.map(x => `exclude=${x}`);
  let resp = await fetch(`https://127.0.0.1:5001/api/questions/${id}?${queryString?.join('&')}`)
  let data = await resp.json();
  createQuiz(data, id);

}

function createQuiz(data, id) {
  main.innerHTML = '';
  data.forEach((x, i) => {
    console.log(x)
    if (!questionsAnswered[id]) {
      questionsAnswered[id] = [];
    }
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

    main.appendChild(question);
  });
  currentInterval.push(setTimeout(() => timeRanOut(document.querySelector('main > div')), 10000))
}

function onAnswerClick(e) {
  if (confirm(`Are you sure you want to choose ${e.target.textContent}`)) {
    currentInterval.forEach(x => clearTimeout(x))
    if (e.target.isCorrect) {
      result.correctAnswers++;
    } else {
      result.incorrectAnswers++;
    }
    let parent = e.target.parentElement;
    parent.style.display = 'none';
    let nextElement = parent.nextElementSibling;
    if (!nextElement) {
      displayMainScreen()
    } else {
      nextElement.style.display = 'block';
      currentInterval.push(setTimeout(() => timeRanOut(nextElement), 10000))
    }
    alert(`The answer is ${e.target.isCorrect ? "correct" : "incorrect"}`)
  }

}

function timeRanOut(el) {
  result.incorrectAnswers++;
  let parent = el;
  parent.style.display = 'none';
  let nextElement = parent.nextElementSibling;
  if (!nextElement) {
    displayMainScreen()
  } else {
    nextElement.style.display = 'block';
    currentInterval.push(setTimeout(() => timeRanOut(nextElement), 10000))
  }
  alert(`Time ran out. Marked question as wrong.`)
}
displayMainScreen();