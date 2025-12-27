let questions = [];
let index = 0;
let score = 0;
let currentBook = "";

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
    document.getElementById("question").innerText =
      `Completed! Score: ${score}/${questions.length}`;
    document.getElementById("options").innerHTML = "";
    return;
  }

  const q = questions[index];
  document.getElementById("question").innerText = q.question;

  const optDiv = document.getElementById("options");
  optDiv.innerHTML = "";

  q.options.forEach((opt, i) => {
    const div = document.createElement("div");
    div.className = "option";
    div.innerText = opt;
    div.onclick = () => checkAnswer(i);
    optDiv.appendChild(div);
  });

  document.getElementById("status").innerText =
    `Question ${index + 1} / ${questions.length}`;
}

function checkAnswer(choice) {
  const correct = questions[index].answer;
  if (choice === correct) score++;

  localStorage.setItem(
    currentBook,
    JSON.stringify({ index, score })
  );
}

function nextQuestion() {
  index++;
  localStorage.setItem(
    currentBook,
    JSON.stringify({ index, score })
  );
  showQuestion();
}

function resetProgress() {
  localStorage.removeItem("gandhi");
  localStorage.removeItem("vivekananda");
  alert("Progress reset");
}
