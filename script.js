// Custom cursor
const cursor = document.getElementById('cursor');
document.addEventListener('mousemove', e => {
  cursor.style.top = e.clientY + 'px';
  cursor.style.left = e.clientX + 'px';
});

// Rock Paper Scissors
let userScore = 0, compScore = 0;
const resultEl = document.getElementById('rps-result');
const scoreEl = document.getElementById('rps-score');

function playRPS(userChoice) {
  const choices = ['rock','paper','scissors'];
  const computerChoice = choices[Math.floor(Math.random()*3)];
  let result = '';

  if(userChoice===computerChoice){
    result=`Draw! Both chose ${userChoice}.`;
  } else if(
    (userChoice==='rock' && computerChoice==='scissors') ||
    (userChoice==='paper' && computerChoice==='rock') ||
    (userChoice==='scissors' && computerChoice==='paper')
  ){
    result=`You win! ${capitalize(userChoice)} beats ${computerChoice}.`;
    userScore++;
  } else {
    result=`You lose! ${capitalize(computerChoice)} beats ${userChoice}.`;
    compScore++;
  }
  resultEl.textContent=result;
  scoreEl.textContent=`You: ${userScore} | Computer: ${compScore}`;
}
function capitalize(str){ return str.charAt(0).toUpperCase() + str.slice(1); }

// Tic Tac Toe
const tttBoard=document.getElementById('ttt-board');
const tttResult=document.getElementById('ttt-result');
const tttReset=document.getElementById('ttt-reset');
let tttState=Array(9).fill('');
let player='X', computer='O', gameActive=true;

function checkWinnerTTT(){
  const winCond=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  for(let c of winCond){
    const [a,b,cIdx]=c;
    if(tttState[a] && tttState[a]===tttState[b] && tttState[a]===tttState[cIdx]){
      gameActive=false;
      tttResult.textContent=`${tttState[a]} wins!`;
      return true;
    }
  }
  if(!tttState.includes('')){
    gameActive=false;
    tttResult.textContent="It's a tie!";
    return true;
  }
  return false;
}

// Smarter computer AI
function computerMoveTTT(){
  if(!gameActive) return;

  // 1. Win if possible
  let winMove = findBestMove(computer);
  if(winMove !== null){ makeMove(winMove, computer); return; }

  // 2. Block player
  let blockMove = findBestMove(player);
  if(blockMove !== null){ makeMove(blockMove, computer); return; }

  // 3. Take center
  if(tttState[4]===''){ makeMove(4, computer); return; }

  // 4. Take a corner
  const corners=[0,2,6,8].filter(i=>tttState[i]==='');
  if(corners.length>0){
    let randCorner=corners[Math.floor(Math.random()*corners.length)];
    makeMove(randCorner, computer);
    return;
  }

  // 5. Take any side
  const sides=[1,3,5,7].filter(i=>tttState[i]==='');
  if(sides.length>0){
    let randSide=sides[Math.floor(Math.random()*sides.length)];
    makeMove(randSide, computer);
  }
}

function findBestMove(symbol){
  const winCond=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  for(let c of winCond){
    let [a,b,cIdx]=c;
    let line=[tttState[a],tttState[b],tttState[cIdx]];
    if(line.filter(v=>v===symbol).length===2 && line.includes('')){
      return [a,b,cIdx][line.indexOf('')];
    }
  }
  return null;
}

function makeMove(idx, symbol){
  tttState[idx]=symbol;
  tttBoard.children[idx].textContent=symbol;
  checkWinnerTTT();
}

function handleClickTTT(e){
  let idx=parseInt(e.target.getAttribute('data-index'));
  if(tttState[idx]!==''||!gameActive) return;
  tttState[idx]=player;
  e.target.textContent=player;
  if(!checkWinnerTTT()) setTimeout(computerMoveTTT,300);
}

function createTTTBoard(){
  tttBoard.innerHTML='';
  tttState.forEach((_,i)=>{
    let cell=document.createElement('div');
    cell.classList.add('ttt-cell');
    cell.setAttribute('data-index',i);
    cell.addEventListener('click', handleClickTTT);
    tttBoard.appendChild(cell);
  });
}

tttReset.addEventListener('click',()=>{
  tttState=Array(9).fill('');
  gameActive=true;
  tttResult.textContent='';
  createTTTBoard();
});

createTTTBoard();
