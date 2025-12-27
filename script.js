let questions = [];
let index = 0;
let score = 0;
let currentBook = "";
let selectedChoice = -1;
let userAnswers = [];

async function startQuiz() {
  currentBook = document.getElementById("bookSelect").value;
  const res = await fetch(`data/${currentBook}.json`);
  questions = await res.json();

  const saved = JSON.parse(localStorage.getItem(currentBook));
  if (saved) {
    index = saved.index;
    score = saved.score;
    userAnswers = saved.answers || [];
  } else {
    index = 0;
    score = 0;
    userAnswers = [];
  }

  document.getElementById("quizBox").classList.remove("hidden");
  showQuestion();
}

function showQuestion() {
  if (index >= questions.length) {
    document.getElementById(
      "question"
    ).innerText = `Completed! Score: ${score}/${questions.length}`;
    document.getElementById("options").innerHTML = "";
    document.getElementById("nextBtn").style.display = "none";
    return;
  }

  selectedChoice = -1;
  const q = questions[index];
  document.getElementById("question").innerText = q.question;

  const optDiv = document.getElementById("options");
  optDiv.innerHTML = "";

  q.options.forEach((opt, i) => {
    const label = document.createElement("label");
    label.className = "option";
    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "option";
    radio.value = i;
    radio.onchange = () => (selectedChoice = i);
    label.appendChild(radio);
    label.appendChild(document.createTextNode(" " + opt));
    optDiv.appendChild(label);
    optDiv.appendChild(document.createElement("br"));
  });

  document.getElementById("status").innerText = `Question ${index + 1} / ${
    questions.length
  }`;
  document.getElementById("nextBtn").style.display = "none";

  // If already answered, show feedback
  if (userAnswers[index] !== undefined) {
    selectedChoice = userAnswers[index];
    checkAnswer(selectedChoice, false); // false to not increment score again
    document.getElementById("nextBtn").style.display = "inline";
  }
}

function submitQuestion() {
  if (selectedChoice === -1) {
    alert("Please select an option.");
    return;
  }
  checkAnswer(selectedChoice, true);
  document.getElementById("nextBtn").style.display = "inline";
}

function checkAnswer(choice, incrementScore = true) {
  const correct = questions[index].answer;
  if (incrementScore && userAnswers[index] === undefined) {
    if (choice === correct) score++;
  }
  userAnswers[index] = choice;

  // Apply visual feedback
  const options = document.querySelectorAll(".option");
  options.forEach((opt, i) => {
    if (i === correct) {
      opt.classList.add("correct");
    } else if (i === choice && choice !== correct) {
      opt.classList.add("wrong");
    }
    opt.querySelector("input").disabled = true;
  });

  localStorage.setItem(
    currentBook,
    JSON.stringify({ index, score, answers: userAnswers })
  );
}

function previousQuestion() {
  if (index > 0) {
    index--;
    localStorage.setItem(
      currentBook,
      JSON.stringify({ index, score, answers: userAnswers })
    );
    showQuestion();
  }
}

function nextQuestion() {
  index++;
  localStorage.setItem(
    currentBook,
    JSON.stringify({ index, score, answers: userAnswers })
  );
  showQuestion();
}

function resetProgress() {
  localStorage.removeItem("gandhi");
  localStorage.removeItem("vivekananda");
  userAnswers = [];
  alert("Progress reset");
}
