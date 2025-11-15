// --- QUIZ DATA ---
const questions = [
  {
    q: "Who are the Salvatore brothers?",
    a: ["Damon & Alaric", "Damon & Stefan", "Stefan & Enzo", "Elijah & Klaus"],
    correct: 1
  },
  {
    q: "Which town is The Vampire Diaries set in?",
    a: ["Forks", "Mystic Falls", "Sunset Valley", "Rosewood"],
    correct: 1
  },
  {
    q: "Who turned Elena into a vampire?",
    a: ["Stefan", "Damon", "Katherine", "Alaric"],
    correct: 0
  },
  {
    q: "What's Elena's surname?",
    a: ["Gilbert", "Forbes", "Salvatore", "Lockwood"],
    correct: 0
  },
  {
    q: "Who frequently says 'Hello, brother' in a dramatic tone?",
    a: ["Damon", "Stefan", "Klaus", "Alaric"],
    correct: 1
  },
  {
    q: "Who is known for being manipulative and stylish?",
    a: ["Katherine", "Bonnie", "Caroline", "Matt"],
    correct: 0
  }
];

// --- STATE ---
let current = 0;
let score = 0;
let total = questions.length;

// DOM
const qnum = document.getElementById('qnum');
const qtotal = document.getElementById('qtotal');
const questionEl = document.getElementById('question');
const answersEl = document.getElementById('answers');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');
const resultCard = document.getElementById('result-card');
const quizCard = document.getElementById('quiz-card');
const sDing = document.getElementById('s-ding');
const sWrong = document.getElementById('s-wrong');
const sLaugh = document.getElementById('s-laugh');
const sHeart = document.getElementById('s-heart');
const batLayer = document.getElementById('bat-layer');
const resultTitle = document.getElementById('result-title');
const resultText = document.getElementById('result-text');
const shareBtn = document.getElementById('share-btn');
const playAgainBtn = document.getElementById('play-again-btn');

qtotal.innerText = total;

// CHAOS ASSETS: quotes
const damonRoasts = [
  "Wrong, sweetheart. Try again.",
  "You disappoint me. How tragically human.",
  "Is that your final answer? *Sigh.*",
  "Bless your heart — no."
];
const katherineLaughs = [
  "You actually chose that? Hilarious.",
  "Do I look like I care?",
  "Cute. Try not to embarrass yourself again."
];

// UTILS
function randInt(max){ return Math.floor(Math.random()*max); }
function pick(arr){ return arr[randInt(arr.length)]; }

// RENDER QUESTION
function renderQuestion(idx){
  current = idx;
  const Q = questions[idx];
  qnum.innerText = idx+1;
  questionEl.innerText = Q.q;
  answersEl.innerHTML = '';
  nextBtn.classList.add('hidden');

  Q.a.forEach((ans, i) => {
    const btn = document.createElement('div');
    btn.className = 'answer';
    btn.innerText = String.fromCharCode(65+i) + '.  ' + ans;
    btn.dataset.index = i;
    btn.addEventListener('click', onAnswer);
    answersEl.appendChild(btn);
  });
}

// ANSWER HANDLER
let locked = false;
function onAnswer(ev){
  if(locked) return;
  locked = true;
  const el = ev.currentTarget;
  const chosen = Number(el.dataset.index);
  const Q = questions[current];

  // correct
  if(chosen === Q.correct){
    el.classList.add('correct');
    sDing.currentTime = 0; sDing.play();
    score++;
    showTinyMessage("Nice — correct. Damon nods approvingly.", 1800);
  } else {
    // wrong chaos
    el.classList.add('wrong');
    sWrong.currentTime = 0; sWrong.play();
    triggerChaos();
    // show roast + laugh
    setTimeout(()=>{
      showTinyMessage(pick(damonRoasts) + "  —  " + pick(katherineLaughs), 2600);
    }, 120);
  }

  // reveal correct answer visually after brief pause
  setTimeout(()=>{
    const nodes = answersEl.querySelectorAll('.answer');
    nodes.forEach(node => {
      if(Number(node.dataset.index) === Q.correct){
        node.classList.add('correct');
      } else {
        // dim others
        if(!node.classList.contains('wrong')) node.style.opacity = '0.55';
      }
      // disable pointer
      node.style.pointerEvents = 'none';
    });

    // show next button or finish
    if(current < total-1) nextBtn.classList.remove('hidden');
    else restartBtn.classList.remove('hidden');

    locked = false;
  }, 700);
}

// small floating message under header
function showTinyMessage(text, ms=2000){
  const el = document.createElement('div');
  el.style.position = 'fixed';
  el.style.left = '50%';
  el.style.top = '12%';
  el.style.transform = 'translateX(-50%)';
  el.style.padding = '10px 16px';
  el.style.background = 'rgba(0,0,0,0.6)';
  el.style.border = '1px solid rgba(255,255,255,0.06)';
  el.style.borderRadius = '10px';
  el.style.zIndex = 9999;
  el.style.color = '#ffd';
  el.style.fontWeight = 700;
  el.innerText = text;
  document.body.appendChild(el);
  setTimeout(()=>el.remove(), ms);
}

// CHAOS EFFECTS
function triggerChaos(){
  // blood flash
  const flash = document.createElement('div');
  flash.className = 'flash';
  document.body.appendChild(flash);
  setTimeout(()=>flash.remove(), 700);

  // spawn a few bats
  spawnBats(6);

  // heartbeat sound
  sHeart.currentTime = 0; sHeart.play();

  // slight page shake
  document.body.style.transition = 'transform .12s';
  document.body.style.transform = 'translateX(-6px)';
  setTimeout(()=>document.body.style.transform = 'translateX(6px)', 80);
  setTimeout(()=>document.body.style.transform = '', 200);

  // random background red tint for a second
  const prev = document.body.style.background;
  document.body.style.background = 'linear-gradient(180deg, rgba(177,18,38,0.06), rgba(22,2,2,0.12))';
  setTimeout(()=>document.body.style.background = prev, 700);

  // Katherine laugh a bit later
  setTimeout(()=>{ sLaugh.currentTime = 0; sLaugh.play() }, 300);
}

// SPAWN BATS
function spawnBats(n=4){
  for(let i=0;i<n;i++){
    const bat = document.createElement('div');
    bat.className = 'bat';
    // simple inline SVG of a bat
    bat.innerHTML = `
      <svg viewBox="0 0 64 48" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;">
        <path d="M2 30 C18 18, 30 18, 32 22 C34 18, 46 18, 62 30 C46 18, 34 24, 32 24 C30 24, 18 18, 2 30 Z" fill="#0b0b10"/>
        <path d="M14 30 C20 24, 24 24, 32 28 C40 24, 44 24, 50 30 C40 26, 36 28, 32 28 C28 28, 24 26, 14 30 Z" fill="#111"/>
      </svg>`;
    // random start pos off bottom
    const width = 40 + Math.random()*80;
    bat.style.width = width + "px";
    const left = Math.random() * (window.innerWidth - width);
    bat.style.left = left + 'px';
    bat.style.top = (window.innerHeight + 60) + 'px';
    bat.style.animationDuration = (4 + Math.random()*3) + 's';
    bat.style.transform = `translateY(0) rotate(${Math.random()*40 - 20}deg)`;
    batLayer.appendChild(bat);

    // remove after animation length
    setTimeout(()=>bat.remove(), 7000 + Math.random()*2000);
  }
}

// NAVIGATION
nextBtn.addEventListener('click', () => {
  renderQuestion(current+1);
});
restartBtn.addEventListener('click', finishQuiz);

// START / FINISH
function finishQuiz(){
  // show result card
  quizCard.classList.add('hidden');
  resultCard.classList.remove('hidden');
  resultTitle.innerText = `You scored ${score}/${total}`;
  // friendly / roast message
  if(score === total) resultText.innerText = "Legend. Damon surrenders his scowl for now.";
  else if(score >= total*0.6) resultText.innerText = "Not terrible. Katherine is mildly amused.";
  else resultText.innerText = "You need help. Damon is disappointed and Katherine is laughing.";
  // show small chaos depending on performance
  if(score <= 1) { spawnBats(12); showTinyMessage("Major chaos unleashed. Try again?", 2500); }
  else if(score <= Math.floor(total/2)) { spawnBats(6); }

  // share button (copy)
  shareBtn.onclick = () => {
    const txt = `I scored ${score}/${total} on the Chaotic Vampire Diaries Quiz!`;
    navigator.clipboard?.writeText(txt).then(()=> showTinyMessage("Copied share text!"), ()=> showTinyMessage("Could not copy."));
  };

  playAgainBtn.onclick = () => {
    // reset state and go back
    score = 0;
    quizCard.classList.remove('hidden');
    resultCard.classList.add('hidden');
    renderQuestion(0);
  };
}

// initial render
renderQuestion(0);
