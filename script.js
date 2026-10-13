let username = "";
let currentSubject = "";
let currentLevel = "";

let currentQuestion = 0;
let score = 0;

let timer;
let timeLeft = 60;

// =========================
// ELEMENTS
// =========================

const sections = document.querySelectorAll(".section");

const home = document.getElementById("home");
const subjects = document.getElementById("subjects");
const difficulty = document.getElementById("difficulty");
const exam = document.getElementById("exam");
const result = document.getElementById("result");

const usernameInput = document.getElementById("username");
const startBtn = document.getElementById("startBtn");

const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const qInfo = document.getElementById("qInfo");
const timerEl = document.getElementById("timer");

const scoreEl = document.getElementById("score");

// =========================
// QUESTIONS BANK (Simple MVP)
// =========================

const questions = {
  html: [
    {
      q: "What does HTML stand for?",
      a: [
        "Hyper Text Markup Language",
        "Home Tool Markup Language",
        "Hyperlinks Text Mark Language",
      ],
      correct: 0,
    },
    {
      q: "Which tag is used for title?",
      a: ["<title>", "<head>", "<meta>"],
      correct: 0,
    },
  ],
  css: [
    {
      q: "CSS stands for?",
      a: [
        "Cascading Style Sheets",
        "Color Style Sheet",
        "Creative Style System",
      ],
      correct: 0,
    },
  ],
  js: [
    {
      q: "Which company created JavaScript?",
      a: ["Netscape", "Google", "Microsoft"],
      correct: 0,
    },
  ],
};

// =========================
// NAVIGATION
// =========================

function showSection(section) {
  sections.forEach((sec) => sec.classList.remove("active"));
  section.classList.add("active");
}

// =========================
// START APP
// =========================

startBtn.addEventListener("click", () => {
  if (usernameInput.value.trim() === "") return;

  username = usernameInput.value;
  showSection(subjects);
});

// =========================
// SUBJECT SELECT
// =========================

document.querySelectorAll(".card[data-subject]").forEach((btn) => {
  btn.addEventListener("click", () => {
    currentSubject = btn.dataset.subject;
    showSection(difficulty);
  });
});

// =========================
// LEVEL SELECT
// =========================

document.querySelectorAll(".card[data-level]").forEach((btn) => {
  btn.addEventListener("click", () => {
    currentLevel = btn.dataset.level;

    startExam();
  });
});

// =========================
// START EXAM
// =========================

function startExam() {
  currentQuestion = 0;
  score = 0;

  showSection(exam);

  loadQuestion();
  startTimer();
}

// =========================
// LOAD QUESTION
// =========================

function loadQuestion() {
  const q = questions[currentSubject][currentQuestion];

  questionEl.textContent = q.q;

  answersEl.innerHTML = "";

  q.a.forEach((answer, index) => {
    const btn = document.createElement("button");
    btn.textContent = answer;

    btn.addEventListener("click", () => selectAnswer(index));

    answersEl.appendChild(btn);
  });

  qInfo.textContent = `Question ${currentQuestion + 1} / ${questions[currentSubject].length}`;
}

// =========================
// ANSWER CHECK
// =========================

function selectAnswer(index) {
  const q = questions[currentSubject][currentQuestion];

  if (index === q.correct) {
    score++;
  }

  currentQuestion++;

  if (currentQuestion < questions[currentSubject].length) {
    loadQuestion();
  } else {
    endExam();
  }
}

// =========================
// TIMER
// =========================

function startTimer() {
  timeLeft = 60;

  timer = setInterval(() => {
    timeLeft--;

    timerEl.textContent = timeLeft + "s";

    if (timeLeft <= 0) {
      endExam();
    }
  }, 1000);
}

// =========================
// END EXAM
// =========================

function endExam() {
  clearInterval(timer);

  showSection(result);

  scoreEl.textContent = `${username} your score is ${score} / ${questions[currentSubject].length}`;
}

let xp = 0;
let level = 1;

// =========================
// LOAD SAVED DATA
// =========================

function loadData() {
  const savedXP = localStorage.getItem("xp");
  const savedLevel = localStorage.getItem("level");

  if (savedXP) xp = Number(savedXP);
  if (savedLevel) level = Number(savedLevel);
}

loadData();

// =========================
// SAVE DATA
// =========================

function saveData() {
  localStorage.setItem("xp", xp);
  localStorage.setItem("level", level);
}

// =========================
// UPDATE XP SYSTEM
// =========================

function addXP(points) {
  xp += points;

  if (xp >= level * 100) {
    xp = 0;
    level++;
    alert("🎉 Level Up! You reached level " + level);
  }

  saveData();
}

// =========================
// MODIFY SELECT ANSWER
// =========================

const oldSelectAnswer = selectAnswer;

selectAnswer = function (index) {
  const q = questions[currentSubject][currentQuestion];

  const buttons = document.querySelectorAll("#answers button");

  buttons.forEach((btn, i) => {
    btn.disabled = true;

    if (i === q.correct) {
      btn.style.background = "#22c55e"; // correct
    }

    if (i === index && i !== q.correct) {
      btn.style.background = "#ef4444"; // wrong
    }
  });

  if (index === q.correct) {
    score++;
    xp += 10;
    playSound("correct");
  } else {
    playSound("wrong");
  }

  updateXPBar();

  setTimeout(() => {
    currentQuestion++;

    if (currentQuestion < questions[currentSubject].length) {
      loadQuestion();
    } else {
      endExam();
    }
  }, 800);
};
// =========================
// ENHANCED RESULT SCREEN
// =========================

function endExam() {
  clearInterval(timer);

  showSection(result);

  let percent = Math.round((score / questions[currentSubject].length) * 100);

  scoreEl.innerHTML = `
    <h2>🎉 Exam Completed</h2>
    <p>Name: ${username}</p>
    <p>Score: ${score} / ${questions[currentSubject].length}</p>
    <p>Percentage: ${percent}%</p>
    <p>XP: ${xp}</p>
    <p>Level: ${level}</p>
  `;
}

let streak = localStorage.getItem("streak")
  ? Number(localStorage.getItem("streak"))
  : 0;

// =========================
// UPDATE STREAK
// =========================

function updateStreak() {
  streak++;
  localStorage.setItem("streak", streak);
}

// =========================
// RESET EXAM
// =========================

document.getElementById("restartBtn")?.addEventListener("click", () => {
  currentQuestion = 0;
  score = 0;
  timeLeft = 60;

  showSection(home);
});

// =========================
// OVERRIDE END EXAM (FINAL VERSION)
// =========================

function endExam() {
  clearInterval(timer);

  updateStreak();

  showSection(result);

  let percent = Math.round((score / questions[currentSubject].length) * 100);

  let message = "";

  if (percent === 100) message = "🏆 Perfect!";
  else if (percent >= 80) message = "🔥 Excellent!";
  else if (percent >= 50) message = "👍 Good!";
  else message = "📚 Try Again!";

  scoreEl.innerHTML = `
    <div class="result-box">
      <h2>${message}</h2>

      <p><b>Name:</b> ${username}</p>
      <p><b>Subject:</b> ${currentSubject}</p>

      <p><b>Score:</b> ${score} / ${questions[currentSubject].length}</p>
      <p><b>Percentage:</b> ${percent}%</p>

      <p><b>XP:</b> ${xp}</p>
      <p><b>Level:</b> ${level}</p>
      <p><b>Streak:</b> ${streak} 🔥</p>
    </div>
  `;
}

// =========================
// SIMPLE PROGRESS BAR (LOGIC ONLY)
// =========================

function updateProgress() {
  let progress = (currentQuestion / questions[currentSubject].length) * 100;

  document.body.style.setProperty("--progress", progress + "%");
}

// modify loadQuestion again (enhancement)
const oldLoadQuestion = loadQuestion;

loadQuestion = function () {
  oldLoadQuestion();
  updateProgress();
};

function updateXPBar() {
  const progress = document.getElementById("xpFill");
  if (!progress) return;

  let percent = xp % 100;

  progress.style.width = percent + "%";
}

function showConfetti() {
  for (let i = 0; i < 30; i++) {
    let conf = document.createElement("div");

    conf.innerHTML = "🎉";
    conf.style.position = "fixed";
    conf.style.left = Math.random() * 100 + "vw";
    conf.style.top = "-20px";
    conf.style.fontSize = "20px";
    conf.style.animation = "fall 3s linear forwards";

    document.body.appendChild(conf);

    setTimeout(() => conf.remove(), 3000);
  }
}

function playSound(type) {
  let audio = new Audio();

  if (type === "correct") {
    audio.src = "data:audio/mp3;base64,//uQx...";
  } else {
    audio.src = "data:audio/mp3;base64,//uQx...";
  }

  audio.play().catch(() => {});
}

function endExam() {
  clearInterval(timer);

  let percent = Math.round((score / questions[currentSubject].length) * 100);

  if (percent >= 80) {
    showConfetti();
  }

  updateXPBar();

  showSection(result);

  scoreEl.innerHTML = `
    <div class="result-box">
      <h2>🏆 Exam Completed</h2>

      <p><b>User:</b> ${username}</p>
      <p><b>Subject:</b> ${currentSubject}</p>

      <p><b>Score:</b> ${score}/${questions[currentSubject].length}</p>
      <p><b>Percentage:</b> ${percent}%</p>

      <p><b>XP:</b> ${xp}</p>
      <p><b>Level:</b> ${level}</p>

      <p style="font-size:18px; margin-top:10px;">
        ${percent >= 80 ? "🔥 Legendary Performance!" : "📚 Keep Practicing!"}
      </p>
    </div>
  `;
}

function saveProgress() {
  localStorage.setItem(
    "exam_data",
    JSON.stringify({
      xp,
      level,
      username,
    }),
  );
}

function loadProgress() {
  const data = JSON.parse(localStorage.getItem("exam_data"));

  if (!data) return;

  xp = data.xp || 0;
  level = data.level || 1;
  username = data.username || "";
}


// =========================
// LOADER
// =========================

window.addEventListener("load", () => {
    const loader = document.getElementById("loader");

    setTimeout(() => {
        loader.style.opacity = "0";
        loader.style.visibility = "hidden";

        setTimeout(() => {
            loader.remove();
        }, 500);

    }, 1000);
});