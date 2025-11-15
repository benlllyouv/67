// INSANE Quiz Script — no images
// Deep TVD lore 20 questions, Hybrid chaos (Damon + Katherine + bats + blood + compel)

// QUESTIONS (20 INSANE, specific)
const questions = [
  {q:"In Season 1, Episode 5, what exact phrase does Damon first say to Stefan when he appears in the Salvatore house?", a:["'Hello, brother.'","'You again.'","'Finally.'","'Miss me?'"], correct:0},
  {q:"Which episode and season does Elena first say 'I love you' to Stefan (exact moment)?", a:["S2E22 at the hospital","S3E22 at the bridge","S2E21 in the woods","S3E10 by the lake"], correct:0},
  {q:"Who killed Mason Lockwood and in which circumstance (true answer requires the actor/action)?", a:["Damon, on a whim","Stefan, Ripper mode","Klaus, during a ritual","Tyler, as a werewolf"], correct:1},
  {q:"In Season 4, who actually removes the sire bond between Elena and the Salvatore brothers?", a:["Alaric","Bonnie","Elena herself","Klaus"], correct:2},
  {q:"Which ep/season contains the original 'The Ripper' reveal for Stefan—where he admits his violent past?", a:["S3E5 'The Reckoning'","S2E21 'The Last Day'","S3E10 'The New Deal'","S4E1 'Growing Pains'"], correct:0},
  {q:"Which TALENTED witch sacrifices herself to power the spell that closes the veil in Season 8?", a:["Bonnie Bennett","Qetsiyah","Faye Chamberlain","Lilian Salvatore"], correct:0},
  {q:"What is the precise name of the cure that is central to Season 4's plot?", a:["Traveler's antidote","The cure","Silas cure","Elixir of life"], correct:1},
  {q:"Which character betrays Elena by turning her into a vampire (episode context expected)?", a:["Katherine Pierce by blood transfer","Stefan in a mercy act","Damon by accident","Alaric to save her"], correct:1},
  {q:"Which villain uses mind compulsion to make someone stab themselves in Season 6's major twist?", a:["Kai Parker","Silas","Klaus","Rory"], correct:0},
  {q:"Which book/ritual did Qetsiyah create that ties her to Silas (deep lore)?", a:["A spell called 'The Anchor'","The Immortality Ritual","The Gemini Book","The Hollow Manual"], correct:1},
  {q:"Which character dies in the doppelgänger ritual attempt (S4) and whose blood is used?", a:["Katherine dies, Elena's blood used","Elena nearly dies, Katherine used","Jenna dies, Elena used","Unknown sacrifice"], correct:0},
  {q:"Which exact line does Katherine deliver when revealed in the season 2 finale after her return?", a:["'I always survive.'","'You think I'm afraid?'","'Don't you know me?'","'I do this for fun.'"], correct:0},
  {q:"Which character removes Damon from the sunlight ring (S1–S2 arc) and how?", a:["Stefan with the daylight ring","Elena destroys it","Damon removes it himself","Bonnie creates a shield"], correct:0},
  {q:"Which character becomes the Original hybrid's 'love interest' storyline (Klaus arc) that deeply affects TVD?", a:["Caroline Forbes","Hayley Marshall","Rebekah Mikaelson","Elena Gilbert"], correct:0},
  {q:"What is the exact name of the prison world that traps Silas (deep specific)?", a:["The Other Side (prison world)","The Other Side","Eternal Prison","Shadow Realm"], correct:1},
  {q:"Which character turns into a vampire in a bathtub scene (specific early-season transformation)?", a:["Caroline Forbes","Vicki Donovan","Anna","Isobel Flemming"], correct:0},
  {q:"Who says 'You are my humanity' to whom in a crucial scene (quote-source match)?", a:["Elena -> Stefan","Stefan -> Elena","Damon -> Elena","Caroline -> Tyler"], correct:0},
  {q:"Which villain fakes death as part of a plan involving a doppelgänger (hint: Silas/Kai era)?", a:["Silas","Kai Parker","Klaus","Mikaelson"], correct:0},
  {q:"Which Salvatore brother drives the car during the blood bag hospital scene and almost loses control (specific moment)?", a:["Damon","Stefan","Neither","Both"], correct:1},
  {q:"Which character performs the ritual that ultimately kills Silas (deep timeline)?", a:["Bonnie Bennett","Qetsiyah","Damon Salvatore","Katherine Pierce"], correct:0}
];

// STATE
let current = 0, score = 0, total = questions.length;
const timePerQuestion = 25; // seconds
let timerVal = timePerQuestion;
let timerInterval = null;
let locked = false;

// DOM
const qnum = id('qnum'), qtotal = id('qtotal'), questionEl = id('question'), answersEl = id('answers');
const nextBtn = id('next'), finishBtn = id('finish'), retryBtn = id('retry'), copyBtn = id('copy');
const quizCard = id('quiz'), resultCard = id('result'), resultTitle = id('result-title'), resultMsg = id('result-msg');
const sndCorrect = id('snd-correct'), sndWrong = id('snd-wrong'), sndLaugh = id('snd-laugh'), sndHeart = id('snd-heart');
const batLayer = id('bat-layer'), timerEl = id('timer');

qtotal.innerText = total;

// ROASTS (Damon & Katherine)
const damonRoasts = [
  "Wrong, sweetheart. Is that guesswork or just desperation?",
  "You disappoint me. How tragically human.",
  "Do you even pay attention to Mystic Falls?",
  "Bless your heart — wrong again."
];
const katherineMocks = [
  "Adorable. Keep trying, it’s cute.",
  "Do I look like I care? No.",
  "You actually thought that was right? Charming."
];

// UTIL
function id(x){return document.getElementById(x)}
function pick(arr){return arr[Math.floor(Math.random()*arr.length)]}
function randInt(max){return Math.floor(Math.random()*max)}

// RENDER
function render(i){
  current = i;
  locked = false;
  timerVal = timePerQuestion;
  resetTimer();
  startTimer();
  qnum.innerText = i+1;
  const Q = questions[i];
  questionEl.innerText = Q.q;
  answersEl.innerHTML = '';
  nextBtn.classList.add('hidden'); finishBtn.classList.add('hidden');

  Q.a.forEach((txt, idx) => {
    const d = document.createElement('div');
    d.className = 'answer';
    d.innerText = `${String.fromCharCode(65+idx)}. ${txt}`;
    d.dataset.index = idx;
    d.addEventListener('click', onAnswer);
    answersEl.appendChild(d);
  });
}

// TIMER
function startTimer(){
  timerEl.innerText = `⏱ ${timerVal}s`;
  timerInterval = setInterval(()=>{
    timerVal--;
    timerEl.innerText = `⏱ ${timerVal}s`;
    if(timerVal <= 0){ clearInterval(timerInterval); onTimeout(); }
  },1000);
}
function resetTimer(){ clearInterval(timerInterval); timerInterval=null; timerEl.innerText = `⏱ ${timePerQuestion}s`}

// TIMEOUT
function onTimeout(){
  if(locked) return;
  locked = true;
  // treat as wrong
  sndWrong.currentTime = 0; sndWrong.play();
  triggerChaos(true);
  showFloating(`${pick(damonRoasts)} — ${pick(katherineMocks)}`,2200);
  revealCorrect();
  setTimeout(()=> {
    if(current < total-1) nextBtn.classList.remove('hidden'); else finishBtn.classList.remove('hidden');
    locked = false;
  },900);
}

// ANSWER
function onAnswer(e){
  if(locked) return;
  locked = true;
  clearInterval(timerInterval);
  const sel = Number(e.currentTarget.dataset.index);
  const Q = questions[current];

  if(sel === Q.correct){
    e.currentTarget.classList.add('correct');
    sndCorrect.currentTime = 0; sndCorrect.play();
    score++;
    showFloating("Correct. Damon briefly approves. :)",1400);
  } else {
    e.currentTarget.classList.add('wrong');
    sndWrong.currentTime = 0; sndWrong.play();
    triggerChaos(false);
    setTimeout(()=> showFloating(`${pick(damonRoasts)} — ${pick(katherineMocks)}`,2200),120);
  }

  setTimeout(()=> {
    revealCorrect();
    if(current < total-1) nextBtn.classList.remove('hidden'); else finishBtn.classList.remove('hidden');
    locked = false;
  },700);
}

// reveal correct visually
function revealCorrect(){
  const nodes = answersEl.querySelectorAll('.answer');
  nodes.forEach(n=>{
    const idx = Number(n.dataset.index);
    if(idx === questions[current].correct){
      n.classList.add('correct');
      n.style.opacity = '1';
    } else {
      if(!n.classList.contains('wrong')) n.style.opacity = '0.55';
      n.style.pointerEvents = 'none';
    }
    n.style.pointerEvents = 'none';
  });
}

// small floating message
function showFloating(txt, ms=2000){
  const el = document.createElement('div');
  el.className = 'compel';
  el.style.zIndex = 2000;
  el.innerText = txt;
  document.body.appendChild(el);
  setTimeout(()=> el.remove(), ms);
}

// CHAOS: blood flash, bats, heartbeat, shake, fake compel
function triggerChaos(fromTimeout=false){
  // blood flash
  const flash = document.createElement('div'); flash.className='flash';
  document.body.appendChild(flash);
  setTimeout(()=>flash.remove(),700);

  // bats
  spawnBats(6 + randInt(6));

  // heartbeat
  sndHeart.currentTime = 0; sndHeart.play();

  // shake
  document.body.style.transition = 'transform .12s';
  document.body.style.transform = 'translateX(-8px)';
  setTimeout(()=>document.body.style.transform = 'translateX(8px)',90);
  setTimeout(()=>document.body.style.transform = '',220);

  // fake compel popup occasionally
  if(Math.random() < 0.45 || fromTimeout){
    const txt = Math.random() < 0.5 ? "You are compelled. Try again." : "Compulsion failed. You fail dramatically.";
    showFloating(txt, 2000);
  }

  // Katherine laugh
  setTimeout(()=>{ sndLaugh.currentTime = 0; sndLaugh.play() }, 240);
}

// spawn bats
function spawnBats(n=4){
  for(let i=0;i<n;i++){
    const b = document.createElement('div'); b.className='bat';
    // simple bat svg
    b.innerHTML = `<svg viewBox="0 0 64 48" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;">
      <path d="M2 30 C18 18, 30 18, 32 22 C34 18, 46 18, 62 30 C46 18, 34 24, 32 24 C30 24, 18 18, 2 30 Z" fill="#06060a"/>
      <path d="M14 30 C20 24, 24 24, 32 28 C40 24, 44 24, 50 30 C40 26, 36 28, 32 28 C28 28, 24 26, 14 30 Z" fill="#111"/>
    </svg>`;
    const w = 36 + Math.random()*80;
    b.style.width = `${w}px`;
    const left = Math.random()*(window.innerWidth - w);
    b.style.left = `${left}px`;
    b.style.top = `${window.innerHeight + 40}px`;
    b.style.animationDuration = `${3 + Math.random()*3}s`;
    b.style.transform = `translateY(0) rotate(${Math.random()*40 - 20}deg)`;
    batLayer.appendChild(b);
    setTimeout(()=> b.remove(), 5500 + Math.random()*2500);
  }
}

// NAV
nextBtn.addEventListener('click', ()=> {
  render(current+1);
});
finishBtn.addEventListener('click', finishQuiz);
retryBtn.addEventListener('click', ()=> {
  // reset
  score = 0; current = 0;
  resultCard.classList.add('hidden'); quizCard.classList.remove('hidden');
  render(0);
});
copyBtn.addEventListener('click', ()=> {
  const txt = `I scored ${score}/${total} on the INSANE Vampire Diaries Quiz.`;
  navigator.clipboard?.writeText(txt).then(()=> showFloating("Score copied."), ()=> showFloating("Copy failed."));
});

// FINISH
function finishQuiz(){
  clearInterval(timerInterval);
  quizCard.classList.add('hidden');
  resultCard.classList.remove('hidden');
  resultTitle.innerText = `You scored ${score}/${total}`;
  // insults or praise
  if(score === total) resultMsg.innerText = "Impossible. You are a TVD demigod. Damon reluctantly bows.";
  else if(score >= Math.ceil(total*0.8)) resultMsg.innerText = "Impressive. Katherine is unimpressed, but impressed.";
  else if(score >= Math.ceil(total*0.5)) resultMsg.innerText = "Not bad. You survive, for now.";
  else if(score >= 2) resultMsg.innerText = "You need a history lesson. Damon is rolling his eyes.";
  else resultMsg.innerText = "Utter failure. Katherine is laughing and Damon is plotting dramatic revenge.";

  // unleash final chaos depending on score
  if(score <= 2){ spawnBats(18); triggerChaos(); showFloating("Total chaos unleashed. Try again if you dare.",2600); }
  else if(score <= Math.ceil(total/2)){ spawnBats(8); showFloating("Moderate chaos. Could be worse.",2000); }
}

// INITIALIZE
render(0);

