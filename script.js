let questions = [];
let index = 0;
let score = 0;
let currentBook = "";
let selectedChoice = -1;

async function startQuiz() {
  currentBook = document.getElementById("bookSelect").value;
  const res = await fetch(`data/${currentBook}.json`);
  questions = await res.json();

  const saved = JSON.parse(localStorage.getItem(currentBook));
  if (saved) {
    index = saved.index;
    score = saved.score;
  } else {
    index = 0;
    score = 0;
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
}

function submitQuestion() {
  if (selectedChoice === -1) {
    alert("Please select an option.");
    return;
  }
  checkAnswer(selectedChoice);
  document.getElementById("nextBtn").style.display = "inline";
}

function checkAnswer(choice) {
  const correct = questions[index].answer;
  if (choice === correct) score++;

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

  localStorage.setItem(currentBook, JSON.stringify({ index, score }));
}

function previousQuestion() {
  if (index > 0) {
    index--;
    localStorage.setItem(currentBook, JSON.stringify({ index, score }));
    showQuestion();
  }
}

function nextQuestion() {
  index++;
  localStorage.setItem(currentBook, JSON.stringify({ index, score }));
  showQuestion();
}

function resetProgress() {
  localStorage.removeItem("gandhi");
  localStorage.removeItem("vivekananda");
  alert("Progress reset");
}
