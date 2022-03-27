const questions = [
  {
    questionText: "Commonly used data types DO NOT include:",
    options: ["1. strings", "2. booleans", "3. alerts", "4. numbers"],
    answer: "3. alerts",
  },
  {
    questionText: "Arrays in JavaScript can be used to store ______.",
    options: [
      "1. numbers and strings",
      "2. other arrays",
      "3. booleans",
      "4. all of the above",
    ],
    answer: "4. all of the above",
  },
  {
    questionText:
      "String values must be enclosed within _____ when being assigned to variables.",
    options: ["1. commas", "2. curly brackets", "3. quotes", "4. parentheses"],
    answer: "3. quotes",
  },
  {
    questionText:
      "A very useful tool used during development and debugging for printing content to the debugger is:",
    options: [
      "1. JavaScript",
      "2. terminal/bash",
      "3. for loops",
      "4. console.log",
    ],
    answer: "4. console.log",
  },
  {
    questionText:
      "Which of the following is a statement that can be used to terminate a loop, switch or label statement?",
    options: ["1. break", "2. stop", "3. halt", "4. exit"],
    answer: "1. break",
  },
];

let timer = 50;
let score = 0;

const INITIAL = 1;
const QUIZ_STARTED = 2;
const QUIZ_COMPLETED = 3;
const TIME_EXPIRED = 4;
const VIEWING_HIGHSCORE = 5;


let pageState = INITIAL;
const container = document.getElementById("container");

document.getElementById("countdownTimer").innerText="";

const decreamentTime = ()=>{
    setTimeout(()=>{
        timer-=1;
        if(timer<0||pageState===TIME_EXPIRED||pageState===QUIZ_COMPLETED){
            pageState = TIME_EXPIRED;
            buildUi();
        }else {
            decreamentTime();
            document.getElementById("countdownTimer").innerText=timer;
        }
    },1000)
}

//register onclick for view highscore

const displayIntro = ()=>{
    document.getElementById('app').innerHTML=`
        <div class="card">
                <h3 class="card-title">
                    Coding Quiz Challenge
                </h3>
                <p class="card-body">
                    To answer the following code related questions within the time limit. </p><p>Keep in mind that incorrect answers will penalize your score/time by 10 seconds!
                </p>
                <button class="card-action-button" onclick="startQuiz()">
                    Start Quiz
                </button>
            </div>
    `
}
const startQuiz = ()=>{
    timer=50;
    pageState = QUIZ_STARTED;
    document.getElementById("countdownTimer").innerText=timer;
    decreamentTime();
    buildUi();
}
const displayQuestion = (i,isCorrect)=>{
        document.getElementById('app').innerHTML=`
        <div class="card">
                <h3 class="card-title">
                    ${questions[i].questionText}
                </h3>
                <div class="button-list">
                ${
                    questions[i].options.map((option,optionIndex)=>(
                `<button class="card-action-button full-width" onclick="next(${i},'${option}')">
                    ${option}
                </button>`
                    )).join('')
                }
                <div>
                <p>${isCorrect}<p>
            </div>
    `;
}
const isAnswerCorrect = (index,option)=>{
    if(questions[index].answer===option){
        score+=1;
        return 'Correct!'
    }else{
        timer-=10;
        if(timer<0){
            timer=0;
        pageState = TIME_EXPIRED;
        buildUi();
        }
        document.getElementById("countdownTimer").innerText=timer;
        return 'Incorrect!';
    }
}
const next = (i,option)=>{
    if(i===questions.length-1){
        let isCorrect = isAnswerCorrect(i,option);
        pageState = QUIZ_COMPLETED;
        buildUi();
    }else{
        let isCorrect = isAnswerCorrect(i,option);
        displayQuestion(i+1,isCorrect)
    }
}
const displayQuiz = ()=>{
    displayQuestion(0,"");
}
const displayQuizResult = ()=>{
    document.getElementById("countdownTimer").innerText='';
    document.getElementById('app').innerHTML=`
        <div class="card">
                <h3 class="card-title">
                    All Done!
                </h3>
                <p class="card-body">
                    Your final score is ${score}. </p><div class="row">Enter Initials: <input type="text" id="initials"/>
                <button class="card-action-button" onclick="setpageToViewScore()">
                    Submit
                </button>
                </div>
            </div>
    `;
}

const displayScore = ()=>{
    pageState = VIEWING_HIGHSCORE;
    buildUi();
}
const setpageToViewScore = ()=>{
    let hs =[];
    let highscores = localStorage.getItem("highscores");
    if(highscores){
        hs = JSON.parse(highscores);
        
        hs.push({initials:document.getElementById("initials").value,score})
    }else{
        hs.push({initials:document.getElementById("initials").value,score:score})
    }
    localStorage.setItem("highscores",JSON.stringify(hs));
    score = 0;
    displayScore();
}
document.getElementById("leaderboard").onclick =()=>displayScore(); 
const viewHighscore = ()=>{
    let hs = [];
    let highscores = localStorage.getItem("highscores");
    if(highscores){
        hs = JSON.parse(highscores);
        hs=hs.sort((hs1,hs2)=>{
            return hs2.score-hs1.score;
        })
    }
    
    
document.getElementById('app').innerHTML=`
        <div class="card">
                <h3 class="card-title">
                    Highscores
                </h3>${
                    hs.map((highscore,index)=>(
                        `<p class="card-body">${index+1}) ${highscore.initials} - ${highscore.score}
                </p>`
                    )).join('')
                }
                
                <button class="card-action-button" onclick="goBack()">
                    Go Back
                </button>
                <button class="card-action-button" onclick="clearHighscores()">
                    Clear Higscores
                </button>
            </div>
    `
}
const clearHighscores = ()=>{
    localStorage.removeItem("highscores");
    goBack();
}
const goBack = ()=>{
    pageState = INITIAL;
    buildUi();
}
const buildUi = ()=>{
    switch(pageState){
        case INITIAL:
            displayIntro();
            break;
        case QUIZ_STARTED:
            displayQuiz();
            break;
        case QUIZ_COMPLETED:
            displayQuizResult();
            break;
        case TIME_EXPIRED:
            displayQuizResult();
            break;
        case VIEWING_HIGHSCORE:
            viewHighscore();
            break;
        default:
            displayIntro();
            break;
    }
};
buildUi();