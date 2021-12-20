import p from './position';
const WHITE = 1;
const BLACK = 0;

const pieceColor = ['black', 'white'];

let history = 
[{
  board:
  [
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    ['e', 'e', 'e', 'e', 'e', 'e', 'e', 'e'],
    ['e', 'e', 'e', 'e', 'e', 'e', 'e', 'e'],
    ['e', 'e', 'e', 'e', 'e', 'e', 'e', 'e'],
    ['e', 'e', 'e', 'e', 'e', 'e', 'e', 'e'],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
  ],
  gameState:
  {
    turn : WHITE,
    enpassant : [-1, -1],
    whiteKingMoved : false,
    blackKingMoved : false,
    whiteSmallRookMoved : false,
    whiteBigRookMoved : false,
    blackSmallRookMoved : false,
    blackBigRookMoved : false,
    eog:
    {
      mate : false,
      stalemate: false,
      threefold: false,
      fivefold: false
    },
    transform :
    {
      whitePieces : ['R', 'N', 'B', 'Q'],
      blackPieces : ['r', 'n', 'b', 'q'],
      index : 3
    },
    whiteNotation : [],
    blackNotation : []
  },
}];

let isMove =
{
  r : isValidBlackRookMove,
  n : isValidBlackKnightMove,
  b : isValidBlackBishopMove,
  q : isValidBlackQueenMove,
  k : isValidBlackKingMove,
  p : isValidBlackPawnMove,
  R : isValidWhiteRookMove,
  N : isValidWhiteKnightMove,
  B : isValidWhiteBishopMove,
  Q : isValidWhiteQueenMove,
  K : isValidWhiteKingMove,
  P : isValidWhitePawnMove
}

let move =
{
  r : blackRookMove,
  n : blackKnightMove,
  b : blackBishopMove,
  q : blackQueenMove,
  k : blackKingMove,
  p : blackPawnMove,
  R : whiteRookMove,
  N : whiteKnightMove,
  B : whiteBishopMove,
  Q : whiteQueenMove,
  K : whiteKingMove,
  P : whitePawnMove
}

//console.log(playNotation('Pe2-e4, Ng1-f3/pe7-e5, ng8-f6', history));

function playNotation(notation, history)
{
  let white, black;
  let h = historyDeepCopy(history);
  let result;
  let a = notation.split('/');
  if (a[0] == '') 
  {
    return {result: 'ok', history};
  }
  if (a[1] == '')
  {
    return {result: playNote(white[0], h), history: h};
  }
  white = a[0].split(', ');
  black = a[1].split(', ');
  for (let i = 0; i < black.length; i++)
  {
    result = playNote(white[i], h);
    if (result != 'ok') break;
    result = playNote(black[i], h);
    if (result != 'ok') break;
  }
  if (result == 'ok' && white.length > black.length)
  {
    result = playNote(white[white.length - 1], h);
  }
  return {result, history: h};
}

function historyDeepCopy(history)
{
  let answer = [];
  for (let i = 0; i < history.length; i++)
  {
    answer.push(historyElementDeepCopy(history[i]));
  }
  return answer;
}

function playNote(note, history)
{
  let word = noteTransfer(note);
  let initial = p.letterTwoDim(note[1] + note[2]);
  let final = p.letterTwoDim(note[4] + note[5]);
  let result = move[word[0]](history, initial, final);
  return result;
}

function noteTransfer(note)
{
  if (note.startsWith('O-O-O'))
  {
    return 'Ke0-c0' + note.substring(5);
  }
  else if (note.startsWith('o-o-o'))
  {
    return 'ke8-c8' + note.substring(5);
  }
  else if (note.startsWith('O-O'))
  {
    return 'Ke0-g0' + note.substring(3);
  }
  else if (note.startsWith('o-o'))
  {
    return 'ke8-g8' + note.substring(3);
  }
  return note;
}

function whitePawnMove(history, initial, final)
{
  let sign;
  let note;
  let he = historyElementDeepCopy(history[history.length - 1]);
  if (isValidWhitePawnMove(he.board, he.gameState, initial, final) == false)
  {
    return 'invalid';
  }
  if (isBlack(he.board[final[0]][final[1]])) sign = ':';
  else sign = '-';
  he.board[initial[0]][initial[1]] = 'e';
  if (final[0] == 0) he.board[final[0]][final[1]] = he.gameState.transform.whitePieces[he.gameState.transform.index];
  else he.board[final[0]][final[1]] = 'P';
  let transformation = he.board[final[0]][final[1]];
  if (transformation == 'P') transformation = '';
  he.gameState.turn = BLACK;
  if (initial[0] == 6 && final[0] == 4)
  {
    he.gameState.enpassant = [3, initial[1]];
  }
  else he.gameState.enpassant = [-1, -1];
  if (isBlackMate(he.board, he.gameState))
  {
    he.gameState.eog.mate = true;
    note = 'P' + p.twoDimLetter(initial[0], initial[1]) + sign + p.twoDimLetter(final[0], final[1]) + transformation + 'X';
    he.gameState.whiteNotation.push(note);
    history = [he];
    return 'win';
  }
  if (isBlackStalemate(he.board, he.gameState))
  {
    he.gameState.eog.stalemate = true;
    note = 'P' + p.twoDimLetter(initial[0], initial[1]) + sign + p.twoDimLetter(final[0], final[1]) + transformation + '=';
    he.gameState.whiteNotation.push(note);
    history = [he];
    return 'draw';
  }
  if (howFold(history) >= 5)
  {
    he.gameState.eog.fivefold = true;
    note = 'P' + p.twoDimLetter(initial[0], initial[1]) + sign + p.twoDimLetter(final[0], final[1]) + transformation + '=';
    he.gameState.whiteNotation.push(note);
    history = [he];
    return 'draw';
  }
  if (howFold(history) >= 3)
  {
    he.gameState.eog.threefold = true;
  }
  else he.gameState.eog.threefold = false;
  note = 'P' + p.twoDimLetter(initial[0], initial[1]) + sign + p.twoDimLetter(final[0], final[1]) + transformation;
  if (blackKingCheck(he.board)) note = note + '+';
  he.gameState.whiteNotation.push(note);
  history.push(he);
  if (he.gameState.eog.threefold) return 'forcedraw';
  return 'ok';
}

function whiteKingMove(history, initial, final)
{
  let sign;
  let note;
  let he = historyElementDeepCopy(history[history.length - 1]);
  if (isValidWhiteKingMove(he.board, he.gameState, initial, final) == false)
  {
    return 'invalid';
  }
  if (isBlack(he.board[final[0]][final[1]])) sign = ':';
  else sign = '-';
  he.board[initial[0]][initial[1]] = 'e';
  he.board[final[0]][final[1]] = 'K';
  if ((initial[0] == 7 && initial[1] == 4) && (final[0] == 7 && final[1] == 6))
  {
    he.board[7][7] = 'e';
    he.board[7][5] = 'R';
  }
  if ((initial[0] == 7 && initial[1] == 4) && (final[0] == 7 && final[1] == 2))
  {
    he.board[7][0] = 'e';
    he.board[7][3] = 'R';
  }
  he.gameState.turn = BLACK;
  he.gameState.enpassant = [-1, -1];
  he.gameState.whiteKingMoved = true;
  if (isBlackMate(he.board, he.gameState))
  {
    he.gameState.eog.mate = true;
    if (initial[1] == 4 && final[1] == 6) note = 'O-OX';
    else if (initial[1] == 4 && final[1] == 2) note = 'O-O-OX'
    else note = 'K' + p.twoDimLetter(initial[0], initial[1]) + sign + p.twoDimLetter(final[0], final[1]) + 'X';
    he.gameState.whiteNotation.push(note);
    history = [he];
    return 'win';
  }
  if (isBlackStalemate(he.board, he.gameState))
  {
    he.gameState.eog.stalemate = true;
    if (initial[1] == 4 && final[1] == 6) note = 'O-O=';
    else if (initial[1] == 4 && final[1] == 2) note = 'O-O-O='
    else note = 'K' + p.twoDimLetter(initial[0], initial[1]) + sign + p.twoDimLetter(final[0], final[1]) + '=';
    he.gameState.whiteNotation.push(note);
    history = [he];
    return 'draw';
  }
  if (howFold(history) >= 5)
  {
    he.gameState.eog.fivefold = true;
    if (initial[1] == 4 && final[1] == 6) note = 'O-O=';
    else if (initial[1] == 4 && final[1] == 2) note = 'O-O-O='
    else note = 'K' + p.twoDimLetter(initial[0], initial[1]) + sign + p.twoDimLetter(final[0], final[1]) + '=';
    he.gameState.whiteNotation.push(note);
    history = [he];
    return 'draw';
  }
  if (howFold(history) >= 3)
  {
    he.gameState.eog.threefold = true;
  }
  else he.gameState.eog.threefold = false;
  if (initial[1] == 4 && final[1] == 6) note = 'O-O';
  else if (initial[1] == 4 && final[1] == 2) note = 'O-O-O'
  else note = 'K' + p.twoDimLetter(initial[0], initial[1]) + sign + p.twoDimLetter(final[0], final[1]);
  if (blackKingCheck(he.board)) note = note + '+';
  he.gameState.whiteNotation.push(note);
  history.push(he);
  if (he.gameState.eog.threefold) return 'forcedraw';
  return 'ok';
}

function whiteQueenMove(history, initial, final)
{
  let sign;
  let note;
  let he = historyElementDeepCopy(history[history.length - 1]);
  if (isValidWhiteQueenMove(he.board, he.gameState, initial, final) == false)
  {
    return 'invalid';
  }
  if (isBlack(he.board[final[0]][final[1]])) sign = ':';
  else sign = '-';
  he.board[initial[0]][initial[1]] = 'e';
  he.board[final[0]][final[1]] = 'Q';
  he.gameState.turn = BLACK;
  he.gameState.enpassant = [-1, -1];
  if (isWhiteMate(he.board, he.gameState))
  {
    he.gameState.eog.mate = true;
    note = 'Q' + p.twoDimLetter(initial[0], initial[1]) + sign + p.twoDimLetter(final[0], final[1]) + 'X';
    he.gameState.whiteNotation.push(note);
    history = [he];
    return 'win';
  }
  if (isWhiteStalemate(he.board, he.gameState))
  {
    he.gameState.eog.stalemate = true;
    note = 'Q' + p.twoDimLetter(initial[0], initial[1]) + sign + p.twoDimLetter(final[0], final[1]) + '=';
    he.gameState.whiteNotation.push(note);
    history = [he];
    return 'draw';
  }
  if (howFold(history) >= 5)
  {
    he.gameState.eog.fivefold = true;
    note = 'Q' + p.twoDimLetter(initial[0], initial[1]) + sign + p.twoDimLetter(final[0], final[1]) + '=';
    he.gameState.whiteNotation.push(note);
    history = [he];
    return 'draw';
  }
  if (howFold(history) >= 3)
  {
    he.gameState.eog.threefold = true;
  }
  else he.gameState.eog.threefold = false;
  note = 'Q' + p.twoDimLetter(initial[0], initial[1]) + sign + p.twoDimLetter(final[0], final[1]);
  if (blackKingCheck(he.board)) note = note + '+';
  he.gameState.whiteNotation.push(note);
  history.push(he);
  if (he.gameState.eog.threefold) return 'forcedraw';
  return 'ok';
}

function whiteBishopMove(history, initial, final)
{
  let sign;
  let note;
  let he = historyElementDeepCopy(history[history.length - 1]);
  if (isValidWhiteBishopMove(he.board, he.gameState, initial, final) == false)
  {
    return 'invalid';
  }
  if (isBlack(he.board[final[0]][final[1]])) sign = ':';
  else sign = '-';
  he.board[initial[0]][initial[1]] = 'e';
  he.board[final[0]][final[1]] = 'B';
  he.gameState.turn = BLACK;
  he.gameState.enpassant = [-1, -1];
  if (isBlackMate(he.board, he.gameState))
  {
    he.gameState.eog.mate = true;
    note = 'B' + p.twoDimLetter(initial[0], initial[1]) + sign + p.twoDimLetter(final[0], final[1]) + 'X';
    he.gameState.whiteNotation.push(note);
    history = [he];
    return 'win';
  }
  if (isWhiteStalemate(he.board, he.gameState))
  {
    he.gameState.eog.stalemate = true;
    note = 'B' + p.twoDimLetter(initial[0], initial[1]) + sign + p.twoDimLetter(final[0], final[1]) + '=';
    he.gameState.whiteNotation.push(note);
    history = [he];
    return 'draw';
  }
  if (howFold(history) >= 5)
  {
    he.gameState.eog.fivefold = true;
    note = 'B' + p.twoDimLetter(initial[0], initial[1]) + sign + p.twoDimLetter(final[0], final[1]) + '=';
    he.gameState.whiteNotation.push(note);
    history = [he];
    return 'draw';
  }
  if (howFold(history) >= 3)
  {
    he.gameState.eog.threefold = true;
  }
  else he.gameState.eog.threefold = false;
  note = 'B' + p.twoDimLetter(initial[0], initial[1]) + sign + p.twoDimLetter(final[0], final[1]);
  if (blackKingCheck(he.board)) note = note + '+';
  he.gameState.whiteNotation.push(note);
  history.push(he);
  if (he.gameState.eog.threefold) return 'forcedraw';
  return 'ok';
}

function whiteKnightMove(history, initial, final)
{
  let sign;
  let note;
  let he = historyElementDeepCopy(history[history.length - 1]);
  if (isValidWhiteKnightMove(he.board, he.gameState, initial, final) == false)
  {
    return 'invalid';
  }
  if (isBlack(he.board[final[0]][final[1]])) sign = ':';
  else sign = '-';
  he.board[initial[0]][initial[1]] = 'e';
  he.board[final[0]][final[1]] = 'N';
  he.gameState.turn = BLACK;
  he.gameState.enpassant = [-1, -1];
  if (isBlackMate(he.board, he.gameState))
  {
    he.gameState.eog.mate = true;
    note = 'N' + p.twoDimLetter(initial[0], initial[1]) + sign + p.twoDimLetter(final[0], final[1]) + 'X';
    he.gameState.whiteNotation.push(note);
    history = [he];
    return 'win';
  }
  if (isBlackStalemate(he.board, he.gameState))
  {
    he.gameState.eog.stalemate = true;
    note = 'N' + p.twoDimLetter(initial[0], initial[1]) + sign + p.twoDimLetter(final[0], final[1]) + '=';
    he.gameState.whiteNotation.push(note);
    history = [he];
    return 'draw';
  }
  if (howFold(history) >= 5)
  {
    he.gameState.eog.fivefold = true;
    note = 'N' + p.twoDimLetter(initial[0], initial[1]) + sign + p.twoDimLetter(final[0], final[1]) + '=';
    he.gameState.whiteNotation.push(note);
    history = [he];
    return 'draw';
  }
  if (howFold(history) >= 3)
  {
    he.gameState.eog.threefold = true;
  }
  else he.gameState.eog.threefold = false;
  note = 'N' + p.twoDimLetter(initial[0], initial[1]) + sign + p.twoDimLetter(final[0], final[1]);
  if (blackKingCheck(he.board)) note = note + '+';
  he.gameState.whiteNotation.push(note);
  history.push(he);
  if (he.gameState.eog.threefold) return 'forcedraw';
  return 'ok';
}


function whiteRookMove(history, initial, final)
{
  let sign;
  let note;
  let he = historyElementDeepCopy(history[history.length - 1]);
  if (isValidWhiteRookMove(he.board, he.gameState, initial, final) == false)
  {
    return 'invalid';
  }
  if (isBlack(he.board[final[0]][final[1]])) sign = ':';
  else sign = '-';
  he.board[initial[0]][initial[1]] = 'e';
  he.board[final[0]][final[1]] = 'R';
  he.gameState.turn = BLACK;
  he.gameState.enpassant = [-1, -1];
  if (initial[0] == 7 && initial[1] == 7)
  {
    he.gameState.whiteSmallRookMoved = true;
  }
  if (initial[0] == 7 && initial[1] == 0)
  {
    he.gameState.whiteBigRookMoved = true;
  }
  if (isWhiteMate(he.board, he.gameState))
  {
    he.gameState.eog.mate = true;
    note = 'R' + p.twoDimLetter(initial[0], initial[1]) + sign + p.twoDimLetter(final[0], final[1]) + 'X';
    he.gameState.whiteNotation.push(note);
    history = [he];
    return 'win';
  }
  if (isWhiteStalemate(he.board, he.gameState))
  {
    he.gameState.eog.stalemate = true;
    note = 'R' + p.twoDimLetter(initial[0], initial[1]) + sign + p.twoDimLetter(final[0], final[1]) + '=';
    he.gameState.whiteNotation.push(note);
    history = [he];
    return 'draw';
  }
  if (howFold(history) >= 5)
  {
    he.gameState.eog.fivefold = true;
    note = 'R' + p.twoDimLetter(initial[0], initial[1]) + sign + p.twoDimLetter(final[0], final[1]) + '=';
    he.gameState.whiteNotation.push(note);
    history = [he];
    return 'draw';
  }
  if (howFold(history) >= 3)
  {
    he.gameState.eog.threefold = true;
  }
  else he.gameState.eog.threefold = false;
  note = 'R' + p.twoDimLetter(initial[0], initial[1]) + sign + p.twoDimLetter(final[0], final[1]);
  if (blackKingCheck(he.board)) note = note + '+';
  he.gameState.whiteNotation.push(note);
  history.push(he);
  if (he.gameState.eog.threefold) return 'forcedraw';
  return 'ok';
}

function blackPawnMove(history, initial, final)
{
  let sign;
  let note;
  let he = historyElementDeepCopy(history[history.length - 1]);
  if (isValidBlackPawnMove(he.board, he.gameState, initial, final) == false)
  {
    return 'invalid';
  }
  if (isWhite(he.board[final[0]][final[1]])) sign = ':';
  else sign = '-';
  he.board[initial[0]][initial[1]] = 'e';
  if (final[0] == 7) he.board[final[0]][final[1]] = he.gameState.transform.blackPieces[he.gameState.transform.index];
  else he.board[final[0]][final[1]] = 'p';
  let transformation = he.board[final[0]][final[1]];
  if (transformation == 'p') transformation = '';
  he.gameState.turn = WHITE;
  if (initial[0] == 1 && final[0] == 3)
  {
    he.gameState.enpassant = [2, initial[1]];
  }
  else he.gameState.enpassant = [-1, -1];
  if (isWhiteMate(he.board, he.gameState))
  {
    he.gameState.eog.mate = true;
    note = 'p' + p.twoDimLetter(initial[0], initial[1]) + sign + p.twoDimLetter(final[0], final[1]) + transformation + 'X';
    he.gameState.blackNotation.push(note);
    history = [he];
    return 'win';
  }
  if (isWhiteStalemate(he.board, he.gameState))
  {
    he.gameState.eog.stalemate = true;
    note = 'p' + p.twoDimLetter(initial[0], initial[1]) + sign + p.twoDimLetter(final[0], final[1]) + transformation + '=';
    he.gameState.blackNotation.push(note);
    history = [he];
    return 'draw';
  }
  if (howFold(history) >= 5)
  {
    he.gameState.eog.fivefold = true;
    note = 'p' + p.twoDimLetter(initial[0], initial[1]) + sign + p.twoDimLetter(final[0], final[1]) + transformation + '=';
    he.gameState.blackNotation.push(note);
    history = [he];
    return 'draw';
  }
  if (howFold(history) >= 3)
  {
    he.gameState.eog.threefold = true;
  }
  else he.gameState.eog.threefold = false;
  note = 'p' + p.twoDimLetter(initial[0], initial[1]) + sign + p.twoDimLetter(final[0], final[1]) + transformation;
  if (whiteKingCheck(he.board)) note = note + '+';
  he.gameState.blackNotation.push(note);
  history.push(he);
  if (he.gameState.eog.threefold) return 'forcedraw';
  return 'ok';
}

function blackKingMove(history, initial, final)
{
  let sign;
  let note;
  let he = historyElementDeepCopy(history[history.length - 1]);
  if (isValidBlackKingMove(he.board, he.gameState, initial, final) == false)
  {
    return 'invalid';
  }
  if (isWhite(he.board[final[0]][final[1]])) sign = ':';
  else sign = '-';
  he.board[initial[0]][initial[1]] = 'e';
  he.board[final[0]][final[1]] = 'k';
  if ((initial[0] == 0 && initial[1] == 4) && (final[0] == 0 && final[1] == 6))
  {
    he.board[0][7] = 'e';
    he.board[0][5] = 'r';
  }
  if ((initial[0] == 0 && initial[1] == 4) && (final[0] == 0 && final[1] == 2))
  {
    he.board[0][0] = 'e';
    he.board[0][3] = 'r';
  }
  he.gameState.turn = WHITE;
  he.gameState.enpassant = [-1, -1];
  he.gameState.blackKingMoved = true;
  if (isWhiteMate(he.board, he.gameState))
  {
    he.gameState.eog.mate = true;
    if (initial[1] == 4 && final[1] == 6) note = 'o-oX';
    else if (initial[1] == 4 && final[1] == 2) note = 'o-o-oX'
    else note = 'k' + p.twoDimLetter(initial[0], initial[1]) + sign + p.twoDimLetter(final[0], final[1]) + 'X';
    he.gameState.blackNotation.push(note);
    history = [he];
    return 'win';
  }
  if (isWhiteStalemate(he.board, he.gameState))
  {
    he.gameState.eog.stalemate = true;
    if (initial[1] == 4 && final[1] == 6) note = 'o-o=';
    else if (initial[1] == 4 && final[1] == 2) note = 'o-o-o='
    else note = 'k' + p.twoDimLetter(initial[0], initial[1]) + sign + p.twoDimLetter(final[0], final[1]) + '=';
    he.gameState.blackNotation.push(note);
    history = [he];
    return 'draw';
  }
  if (howFold(history) >= 5)
  {
    he.gameState.eog.fivefold = true;
    if (initial[1] == 4 && final[1] == 6) note = 'o-o=';
    else if (initial[1] == 4 && final[1] == 2) note = 'o-o-o='
    else note = 'k' + p.twoDimLetter(initial[0], initial[1]) + sign + p.twoDimLetter(final[0], final[1]) + '=';
    he.gameState.blackNotation.push(note);
    history = [he];
    return 'draw';
  }
  if (howFold(history) >= 3)
  {
    he.gameState.eog.threefold = true;
  }
  else he.gameState.eog.threefold = false;
  if (initial[1] == 4 && final[1] == 6) note = 'o-o';
  else if (initial[1] == 4 && final[1] == 2) note = 'o-o-o'
  else note = 'k' + p.twoDimLetter(initial[0], initial[1]) + sign + p.twoDimLetter(final[0], final[1]);
  if (whiteKingCheck(he.board)) note = note + '+';
  he.gameState.blackNotation.push(note);
  history.push(he);
  if (he.gameState.eog.threefold) return 'forcedraw';
  return 'ok';
}

function blackQueenMove(history, initial, final)
{
  let sign;
  let note;
  let he = historyElementDeepCopy(history[history.length - 1]);
  if (isValidBlackQueenMove(he.board, he.gameState, initial, final) == false)
  {
    return 'invalid';
  }
  if (isWhite(he.board[final[0]][final[1]])) sign = ':';
  else sign = '-';
  he.board[initial[0]][initial[1]] = 'e';
  he.board[final[0]][final[1]] = 'q';
  he.gameState.turn = WHITE;
  he.gameState.enpassant = [-1, -1];
  if (isWhiteMate(he.board, he.gameState))
  {
    he.gameState.eog.mate = true;
    note = 'q' + p.twoDimLetter(initial[0], initial[1]) + sign + p.twoDimLetter(final[0], final[1]) + 'X';
    he.gameState.blackNotation.push(note);
    history = [he];
    return 'win';
  }
  if (isWhiteStalemate(he.board, he.gameState))
  {
    he.gameState.eog.stalemate = true;
    note = 'q' + p.twoDimLetter(initial[0], initial[1]) + sign + p.twoDimLetter(final[0], final[1]) + '=';
    he.gameState.blackNotation.push(note);
    history = [he];
    return 'draw';
  }
  if (howFold(history) >= 5)
  {
    he.gameState.eog.fivefold = true;
    note = 'q' + p.twoDimLetter(initial[0], initial[1]) + sign + p.twoDimLetter(final[0], final[1]) + '=';
    he.gameState.blackNotation.push(note);
    history = [he];
    return 'draw';
  }
  if (howFold(history) >= 3)
  {
    he.gameState.eog.threefold = true;
  }
  else he.gameState.eog.threefold = false;
  note = 'q' + p.twoDimLetter(initial[0], initial[1]) + sign + p.twoDimLetter(final[0], final[1]);
  if (whiteKingCheck(he.board)) note = note + '+';
  he.gameState.blackNotation.push(note);
  history.push(he);
  if (he.gameState.eog.threefold) return 'forcedraw';
  return 'ok';
}

function blackBishopMove(history, initial, final)
{
  let sign;
  let note;
  let he = historyElementDeepCopy(history[history.length - 1]);
  if (isValidBlackBishopMove(he.board, he.gameState, initial, final) == false)
  {
    return 'invalid';
  }
  if (isWhite(he.board[final[0]][final[1]])) sign = ':';
  else sign = '-';
  he.board[initial[0]][initial[1]] = 'e';
  he.board[final[0]][final[1]] = 'b';
  he.gameState.turn = WHITE;
  he.gameState.enpassant = [-1, -1];
  if (isWhiteMate(he.board, he.gameState))
  {
    he.gameState.eog.mate = true;
    note = 'b' + p.twoDimLetter(initial[0], initial[1]) + sign + p.twoDimLetter(final[0], final[1]) + 'X';
    he.gameState.blackNotation.push(note);
    history = [he];
    return 'win';
  }
  if (isWhiteStalemate(he.board, he.gameState))
  {
    he.gameState.eog.stalemate = true;
    note = 'b' + p.twoDimLetter(initial[0], initial[1]) + sign + p.twoDimLetter(final[0], final[1]) + '=';
    he.gameState.blackNotation.push(note);
    history = [he];
    return 'draw';
  }
  if (howFold(history) >= 5)
  {
    he.gameState.eog.fivefold = true;
    note = 'b' + p.twoDimLetter(initial[0], initial[1]) + sign + p.twoDimLetter(final[0], final[1]) + '=';
    he.gameState.blackNotation.push(note);
    history = [he];
    return 'draw';
  }
  if (howFold(history) >= 3)
  {
    he.gameState.eog.threefold = true;
  }
  else he.gameState.eog.threefold = false;
  note = 'b' + p.twoDimLetter(initial[0], initial[1]) + sign + p.twoDimLetter(final[0], final[1]);
  if (whiteKingCheck(he.board)) note = note + '+';
  he.gameState.blackNotation.push(note);
  history.push(he);
  if (he.gameState.eog.threefold) return 'forcedraw';
  return 'ok';
}

function blackKnightMove(history, initial, final)
{
  let sign;
  let note;
  let he = historyElementDeepCopy(history[history.length - 1]);
  if (isValidBlackKnightMove(he.board, he.gameState, initial, final) == false)
  {
    return 'invalid';
  }
  if (isWhite(he.board[final[0]][final[1]])) sign = ':';
  else sign = '-';
  he.board[initial[0]][initial[1]] = 'e';
  he.board[final[0]][final[1]] = 'n';
  he.gameState.turn = WHITE;
  he.gameState.enpassant = [-1, -1];
  if (isWhiteMate(he.board, he.gameState))
  {
    he.gameState.eog.mate = true;
    note = 'n' + p.twoDimLetter(initial[0], initial[1]) + sign + p.twoDimLetter(final[0], final[1]) + 'X';
    he.gameState.blackNotation.push(note);
    history = [he];
    return 'win';
  }
  if (isWhiteStalemate(he.board, he.gameState))
  {
    he.gameState.eog.stalemate = true;
    note = 'n' + p.twoDimLetter(initial[0], initial[1]) + sign + p.twoDimLetter(final[0], final[1]) + '=';
    he.gameState.blackNotation.push(note);
    history = [he];
    return 'draw';
  }
  if (howFold(history) >= 5)
  {
    he.gameState.eog.fivefold = true;
    note = 'n' + p.twoDimLetter(initial[0], initial[1]) + sign + p.twoDimLetter(final[0], final[1]) + '=';
    he.gameState.blackNotation.push(note);
    history = [he];
    return 'draw';
  }
  if (howFold(history) >= 3)
  {
    he.gameState.eog.threefold = true;
  }
  else he.gameState.eog.threefold = false;
  note = 'n' + p.twoDimLetter(initial[0], initial[1]) + sign + p.twoDimLetter(final[0], final[1]);
  if (whiteKingCheck(he.board)) note = note + '+';
  he.gameState.blackNotation.push(note);
  history.push(he);
  if (he.gameState.eog.threefold) return 'forcedraw';
  return 'ok';
}


function blackRookMove(history, initial, final)
{
  let sign;
  let note;
  let he = historyElementDeepCopy(history[history.length - 1]);
  if (isValidBlackRookMove(he.board, he.gameState, initial, final) == false)
  {
    return 'invalid';
  }
  if (isWhite(he.board[final[0]][final[1]])) sign = ':';
  else sign = '-';
  he.board[initial[0]][initial[1]] = 'e';
  he.board[final[0]][final[1]] = 'r';
  he.gameState.turn = WHITE;
  he.gameState.enpassant = [-1, -1];
  if (initial[0] == 0 && initial[1] == 7)
  {
    he.gameState.blackSmallRookMoved = true;
  }
  if (initial[0] == 0 && initial[1] == 0)
  {
    he.gameState.blackBigRookMoved = true;
  }
  if (isWhiteMate(he.board, he.gameState))
  {
    he.gameState.eog.mate = true;
    note = 'r' + p.twoDimLetter(initial[0], initial[1]) + sign + p.twoDimLetter(final[0], final[1]) + 'X';
    he.gameState.blackNotation.push(note);
    history = [he];
    return 'win';
  }
  if (isWhiteStalemate(he.board, he.gameState))
  {
    he.gameState.eog.stalemate = true;
    note = 'r' + p.twoDimLetter(initial[0], initial[1]) + sign + p.twoDimLetter(final[0], final[1]) + '=';
    he.gameState.blackNotation.push(note);
    history = [he];
    return 'draw';
  }
  if (howFold(history) >= 5)
  {
    he.gameState.eog.fivefold = true;
    note = 'r' + p.twoDimLetter(initial[0], initial[1]) + sign + p.twoDimLetter(final[0], final[1]) + '=';
    he.gameState.blackNotation.push(note);
    history = [he];
    return 'draw';
  }
  if (howFold(history) >= 3)
  {
    he.gameState.eog.threefold = true;
  }
  else he.gameState.eog.threefold = false;
  note = 'r' + p.twoDimLetter(initial[0], initial[1]) + sign + p.twoDimLetter(final[0], final[1]);
  if (whiteKingCheck(he.board)) note = note + '+';
  he.gameState.blackNotation.push(note);
  history.push(he);
  if (he.gameState.eog.threefold) return 'forcedraw';
  return 'ok';
}

function howFold(someHistory)
{
  if (someHistory.length < 3) return 0;
  let control = someHistory[someHistory.length - 1];
  let count = 0;
  for (let i = someHistory.length - 2; i >= 0; i--)
  {
    if (historyElementIsEqual(control, someHistory[i]))
    {
      control++;
    }
  }
  return control;
}

function hasWhiteValidMove(board, gameState)
{
  for (let i = 0; i < 8; i++)
  {
    for (let j = 0; j < 8; j++)
    {
      if (isWhite(board[i][j]))
      {
        let initial = [i, j];
        for (let k = 0; k < 8; k++)
        {
          for (let m = 0; m < 8; m++)
          {
            if (isMove[board[i][j]](board, gameState, initial, [k, m])) return true;
          }
        }
      }
    }
  }
  return false;
}

function isWhiteMate(board, gameState)
{
  if (hasWhiteValidMove(board, gameState) == false && whiteKingCheck(board) == true)
  {
    return true;
  }
  return false;
}

function isWhiteStalemate(board, gameState)
{
  if (hasWhiteValidMove(board, gameState) == false && whiteKingCheck(board) == false)
  {
    return true;
  }
  return false;
}

function hasBlackValidMove(board, gameState)
{
  for (let i = 0; i < 8; i++)
  {
    for (let j = 0; j < 8; j++)
    {
      if (isBlack(board[i][j]))
      {
        let initial = [i, j];
        for (let k = 0; k < 8; k++)
        {
          for (let m = 0; m < 8; m++)
          {
            if (isMove[board[i][j]](board, gameState, initial, [k, m])) return true;
          }
        }
      }
    }
  }
  return false;
}

function isBlackMate(board, gameState)
{
  if (hasBlackValidMove(board, gameState) == false && blackKingCheck(board) == true)
  {
    return true;
  }
  return false;
}

function isBlackStalemate(board, gameState)
{
  if (hasBlackValidMove(board, gameState) == false && blackKingCheck(board) == false)
  {
    return true;
  }
  return false;
}

function boardIsEqual(board1, board2)
{
  for (let i = 0; i < 8; i++)
  {
    for (let j = 0; j < 8; j++)
    {
      if (board1[i][j] != board2[i][j]) return false;
    }
  }
  return true;
}

function historyElementIsEqual(historyElement1, historyElement2)
{
  if (boardIsEqual(historyElement1.board, historyElement2.board) == false)
  {
    return false;
  }
  if (historyElement1.gameState.turn != historyElement2.gameState.turn)
  {
    return false;
  }
  if (historyElement1.gameState.enpassant[0] != historyElement2.gameState.enpassant[0])
  {
    return false;
  }
  if (historyElement1.gameState.enpassant[1] != historyElement2.gameState.enpassant[1])
  {
    return false;
  }
  if (whiteBigCastleSpoiled(historyElement1.gameState) != whiteBigCastleSpoiled(historyElement2.gameState))
  {
    return false;
  }
  if (whiteSmallCastleSpoiled(historyElement1.gameState) != whiteSmallCastleSpoiled(historyElement2.gameState))
  {
    return false;
  }
  if (blackBigCastleSpoiled(historyElement1.gameState) != blackBigCastleSpoiled(historyElement2.gameState))
  {
    return false;
  }
  if (blackSmallCastleSpoiled(historyElement1.gameState) != blackSmallCastleSpoiled(historyElement2.gameState))
  {
    return false;
  }
  return true;
}

function whiteSmallCastleSpoiled(gameState)
{
  if (gameState.whiteKingMoved || gameState.whiteSmallRookMoved)
  {
    return true;
  }
  return false;
}

function whiteBigCastleSpoiled(gameState)
{
  if (gameState.whiteKingMoved || gameState.whiteBigRookMoved)
  {
    return true;
  }
  return false;
}

function blackSmallCastleSpoiled(gameState)
{
  if (gameState.blackKingMoved || gameState.blackSmallRookMoved)
  {
    return true;
  }
  return false;
}

function blackBigCastleSpoiled(gameState)
{
  if (gameState.blackKingMoved || gameState.blackSmallRookMoved)
  {
    return true;
  }
  return false;
}

function boardDeepCopy(board)
{
  let answer = [];
  for (let i = 0; i < 8; i++) answer.push([]);
  for (let i = 0; i < 8; i++)
  {
    for (let j = 0; j < 8; j++)
    {
      answer[i].push(board[i][j]);
    }
  }
  return answer;
}

function historyElementDeepCopy(historyElement)
{
  let answer = {};
  answer.board = boardDeepCopy(historyElement.board);
  answer.gameState = {};
  answer.gameState.turn = historyElement.gameState.turn;
  answer.gameState.enpassant = historyElement.gameState.enpassant;
  answer.gameState.whiteKingMoved = historyElement.gameState.whiteKingMoved;
  answer.gameState.blackKingMoved = historyElement.gameState.blackKingMoved;
  answer.gameState.whiteSmallRookMoved = historyElement.gameState.whiteSmallRookMoved;
  answer.gameState.whiteBigRookMoved = historyElement.gameState.whiteBigRookMoved;
  answer.gameState.blackSmallRookMoved = historyElement.gameState.blackSmallRookMoved;
  answer.gameState.blackBigRookMoved = historyElement.gameState.blackBigRookMoved;
  answer.gameState.eog = {};
  answer.gameState.eog.mate = historyElement.gameState.eog.mate;
  answer.gameState.eog.stalemate = historyElement.gameState.eog.stalemate;
  answer.gameState.eog.threefold = historyElement.gameState.eog.threefold;
  answer.gameState.eog.fivefold = historyElement.gameState.eog.fivefold;
  answer.gameState.transform = {};
  answer.gameState.transform.whitePieces = ['R', 'N', 'B', 'Q'],
  answer.gameState.transform.blackPieces = ['r', 'n', 'b', 'q'],
  answer.gameState.transform.index = historyElement.gameState.transform.index;
  answer.gameState.whiteNotation = historyElement.gameState.whiteNotation.slice(0, historyElement.gameState.whiteNotation.length);
  answer.gameState.blackNotation = historyElement.gameState.blackNotation.slice(0, historyElement.gameState.blackNotation.length);
  return answer;
}

function replaceSames(board, char, replace, initial)
{
  for (let i = 0; i < 8; i++)
  {
    for (let j = 0; j < 8; j++)
    {
      if (i != initial[0] || j != initial[1])
      {
        if (board[i][j] == char) board[i][j] = replace;
      }
    }
  }
}

function changeOtherSames(board, initial)
{
  let char = board[initial[0]][initial[1]];
  let replace;
  if (isWhite(char))
  {
    replace = 'C';
  }
  else
  {
    replace = 'c';
  }
  replaceSames(board, char, replace, initial);
}

function unchangeOtherSames(board, initial)
{
  let char = board[initial[0]][initial[1]];
  let replace;
  if (isWhite(char))
  {
    replace = 'C';
  }
  else
  {
    replace = 'c';
  }
  replaceSames(board, replace, char, initial);
}

function isValidWhiteRookMove(board, gameState, initial, final)
{
  let testBoard = boardDeepCopy(board);
  if (isWhite(testBoard[final[0]][final[1]])) return false;
  changeOtherSames(testBoard, initial);
  if (!whiteRookAttack(testBoard, final[0], final[1])) return false;
  unchangeOtherSames(testBoard, initial);
  testBoard[final[0]][final[1]] = testBoard[initial[0]][initial[1]];
  testBoard[initial[0]][initial[1]] = 'e';
  if (whiteKingCheck(testBoard)) return false;
  return true;
}

function isValidWhiteKnightMove(board, gameState, initial, final)
{
  let testBoard = boardDeepCopy(board);
  if (isWhite(testBoard[final[0]][final[1]])) return false;
  changeOtherSames(testBoard, initial);
  if (!whiteKnightAttack(testBoard, final[0], final[1])) return false;
  unchangeOtherSames(testBoard, initial);
  testBoard[final[0]][final[1]] = testBoard[initial[0]][initial[1]];
  testBoard[initial[0]][initial[1]] = 'e';
  if (whiteKingCheck(testBoard)) return false;
  return true;
}

function isValidWhiteBishopMove(board, gameState, initial, final)
{
  let testBoard = boardDeepCopy(board);
  if (isWhite(testBoard[final[0]][final[1]])) return false;
  changeOtherSames(testBoard, initial);
  if (!whiteBishopAttack(testBoard, final[0], final[1])) return false;
  unchangeOtherSames(testBoard, initial);
  testBoard[final[0]][final[1]] = testBoard[initial[0]][initial[1]];
  testBoard[initial[0]][initial[1]] = 'e';
  if (whiteKingCheck(testBoard)) return false;
  return true;
}

function isValidWhiteQueenMove(board, gameState, initial, final)
{
  let testBoard = boardDeepCopy(board);
  if (isWhite(testBoard[final[0]][final[1]])) return false;
  changeOtherSames(testBoard, initial);
  if (!whiteQueenAttack(testBoard, final[0], final[1])) return false;
  unchangeOtherSames(testBoard, initial);
  testBoard[final[0]][final[1]] = testBoard[initial[0]][initial[1]];
  testBoard[initial[0]][initial[1]] = 'e';
  if (whiteKingCheck(testBoard)) return false;
  return true;
}

function isValidWhiteKingMove(board, gameState, initial, final)
{
  let testBoard = boardDeepCopy(board);
  if (initial[0] == 7 && initial[1] == 4)
  {
    if (final[0] == 7 && final[1] == 6)
    {
      if (!whiteKingCheck(testBoard))
      {
        if (testBoard[7][5] == 'e' && testBoard[7][6] == 'e')
        {
          if (gameState.whiteSmallRookMoved == false)
          {
            if (gameState.whiteKingMoved == false)
            {
              testBoard[7][4] = 'e';
              testBoard[7][5] = 'K';
              if (!whiteKingCheck(testBoard))
              {
                testBoard[7][5] = 'e';
                testBoard[7][6] = 'K';
                if (!whiteKingCheck(testBoard)) return true;
              }
            }
          }
        }
      }
    }
    if (final[0] == 7 && final[1] == 2)
    {
      if (!whiteKingCheck(testBoard))
      {
        if (testBoard[7][3] == 'e' && testBoard[7][2] == 'e' && testBoard[7][1] == 'e')
        {
          if (gameState.whiteBigRookMoved == false)
          {
            if (gameState.whiteKingMoved == false)
            {
              testBoard[7][4] = 'e';
              testBoard[7][3] = 'K';
              if (!whiteKingCheck(testBoard))
              {
                testBoard[0][3] = 'e';
                testBoard[0][2] = 'K';
                if (!whiteKingCheck(testBoard)) return true;
              }
            }
          }
        }
      }
    }
  }
  if (isWhite(testBoard[final[0]][final[1]])) return false;
  changeOtherSames(testBoard, initial);
  if (!whiteKingAttack(testBoard, final[0], final[1])) return false;
  unchangeOtherSames(testBoard, initial);
  testBoard[final[0]][final[1]] = testBoard[initial[0]][initial[1]];
  testBoard[initial[0]][initial[1]] = 'e';
  if (whiteKingCheck(testBoard)) return false;
  return true;
}

function isValidBlackRookMove(board, gameState, initial, final)
{
  let testBoard = boardDeepCopy(board);
  if (isBlack(testBoard[final[0]][final[1]])) return false;
  changeOtherSames(testBoard, initial);
  if (!blackRookAttack(testBoard, final[0], final[1])) return false;
  unchangeOtherSames(testBoard, initial);
  testBoard[final[0]][final[1]] = testBoard[initial[0]][initial[1]];
  testBoard[initial[0]][initial[1]] = 'e';
  if (blackKingCheck(testBoard)) return false;
  return true;
}

function isValidBlackKnightMove(board, gameState, initial, final)
{
  let testBoard = boardDeepCopy(board);
  if (isBlack(testBoard[final[0]][final[1]])) return false;
  changeOtherSames(testBoard, initial);
  if (!blackKnightAttack(testBoard, final[0], final[1])) return false;
  unchangeOtherSames(testBoard, initial);
  testBoard[final[0]][final[1]] = testBoard[initial[0]][initial[1]];
  testBoard[initial[0]][initial[1]] = 'e';
  if (blackKingCheck(testBoard)) return false;
  return true;
}

function isValidBlackBishopMove(board, gameState, initial, final)
{
  let testBoard = boardDeepCopy(board);
  if (isBlack(testBoard[final[0]][final[1]])) return false;
  changeOtherSames(testBoard, initial);
  if (!blackBishopAttack(testBoard, final[0], final[1])) return false;
  unchangeOtherSames(testBoard, initial);
  testBoard[final[0]][final[1]] = testBoard[initial[0]][initial[1]];
  testBoard[initial[0]][initial[1]] = 'e';
  if (blackKingCheck(testBoard)) return false;
  return true;
}

function isValidBlackQueenMove(board, gameState, initial, final)
{
  let testBoard = boardDeepCopy(board);
  if (isBlack(testBoard[final[0]][final[1]])) return false;
  changeOtherSames(testBoard, initial);
  if (!blackQueenAttack(testBoard, final[0], final[1])) return false;
  unchangeOtherSames(testBoard, initial);
  testBoard[final[0]][final[1]] = testBoard[initial[0]][initial[1]];
  testBoard[initial[0]][initial[1]] = 'e';
  if (blackKingCheck(testBoard)) return false;
  return true;
}

function isValidBlackKingMove(board, gameState, initial, final)
{
  let testBoard = boardDeepCopy(board);
  if (initial[0] == 0 && initial[1] == 4)
  {
    if (final[0] == 0 && final[1] == 6)
    {
      if (!blackKingCheck(testBoard))
      {
        if (testBoard[0][5] == 'e' && testBoard[0][6] == 'e')
        {
          if (gameState.blackSmallRookMoved == false)
          {
            if (gameState.blackKingMoved == false)
            {
              testBoard[0][4] = 'e';
              testBoard[0][5] = 'k';
              if (!blackKingCheck(testBoard))
              {
                testBoard[0][5] = 'e';
                testBoard[0][6] = 'k';
                if (!blackKingCheck(testBoard)) return true;
              }
            }
          }
        }
      }
    }
    if (final[0] == 0 && final[1] == 2)
    {
      if (!blackKingCheck(testBoard))
      {
        if (testBoard[0][3] == 'e' && testBoard[0][2] == 'e' && testBoard[0][1] == 'e')
        {
          if (gameState.blackBigRookMoved == false)
          {
            if (gameState.blackKingMoved == false)
            {
              testBoard[0][4] = 'e';
              testBoard[0][3] = 'k';
              if (!blackKingCheck(testBoard))
              {
                testBoard[0][3] = 'e';
                testBoard[0][2] = 'k';
                if (!blackKingCheck(testBoard)) return true;
              }
            }
          }
        }
      }
    }
  }
  if (isBlack(testBoard[final[0]][final[1]])) return false;
  changeOtherSames(testBoard, initial);
  if (!blackKingAttack(testBoard, final[0], final[1])) return false;
  unchangeOtherSames(testBoard, initial);
  testBoard[final[0]][final[1]] = testBoard[initial[0]][initial[1]];
  testBoard[initial[0]][initial[1]] = 'e';
  if (blackKingCheck(testBoard)) return false;
  return true;
}

function isValidWhitePawnMove(board, gameState, initial, final)
{
  let testBoard = boardDeepCopy(board);
  if (initial[0] == 6 && initial[1] == final[1] && final[0] == 4 && testBoard[initial[0] - 1][initial[1]] == 'e' && testBoard[final[0]][final[1]] == 'e')
  {
    testBoard[final[0]][final[1]] = testBoard[initial[0]][initial[1]];
    testBoard[initial[0]][initial[1]] = 'e';
    if (!whiteKingCheck(testBoard)) return true;
    else return false;
  }
  if (final[0] == initial[0] - 1)
  {
    if (initial[1] == final[1] && board[final[0]][final[1]] == 'e')
    {
      testBoard[final[0]][final[1]] = testBoard[initial[0]][initial[1]];
      testBoard[initial[0]][initial[1]] = 'e';
      if (!whiteKingCheck(testBoard)) return true;
      else return false;
    }
    if ((initial[1] == final[1] - 1 || initial[1] == final[1] + 1) && (isBlack(board[final[0]][final[1]]) || (gameState.enpassant[0] == final[0] && gameState.enpassant[1] == final[1])))
    {
      testBoard[final[0]][final[1]] = testBoard[initial[0]][initial[1]];
      testBoard[initial[0]][initial[1]] = 'e';
      if (!whiteKingCheck(testBoard)) return true;
      else return false;
    }
  }
  return false;
}

function isValidBlackPawnMove(board, gameState, initial, final)
{
  let testBoard = boardDeepCopy(board);
  if (initial[0] == 1 && initial[1] == final[1] && final[0] == 3 && board[initial[0] + 1][initial[1]] == 'e' && board[final[0]][final[1]] == 'e')
  {
    testBoard[final[0]][final[1]] = testBoard[initial[0]][initial[1]];
    testBoard[initial[0]][initial[1]] = 'e';
    if (!blackKingCheck(testBoard)) return true;
    else return false;
  }
  if (final[0] == initial[0] + 1)
  {
    if (initial[1] == final[1] && board[final[0]][final[1]] == 'e')
    {
      testBoard[final[0]][final[1]] = testBoard[initial[0]][initial[1]];
      testBoard[initial[0]][initial[1]] = 'e';
      if (!blackKingCheck(testBoard)) return true;
      else return false;
    }
    if ((initial[1] == final[1] - 1 || initial[1] == final[1] + 1) && (isWhite(board[final[0]][final[1]]) || (gameState.enpassant[0] == final[0] && gameState.enpassant[1] == final[1])))
    {
      testBoard[final[0]][final[1]] = testBoard[initial[0]][initial[1]];
      testBoard[initial[0]][initial[1]] = 'e';
      if (!blackKingCheck(testBoard)) return true;
      else return false;
    }
  }
  return false;
}

function isWhite(char)
{
  if (char == char.toUpperCase()) return true;
  return false;
}

function isEmpty(char)
{
  if (char == 'e') return true;
  return false;
}

function isBlack(char)
{
  if (isWhite(char) || isEmpty(char)) return false;
  return true;
}

function whiteKingCheck(board)
{
  let wk = findWhiteKing(board);
  if (wk[0] >= 0 && wk[1] >= 0)
  {
    if (blackPawnAttack(board, wk[0], wk[1])) return true;
    if (blackRookAttack(board, wk[0], wk[1])) return true;
    if (blackKnightAttack(board, wk[0], wk[1])) return true;
    if (blackBishopAttack(board, wk[0], wk[1])) return true;
    if (blackQueenAttack(board, wk[0], wk[1])) return true;
    if (blackKingAttack(board, wk[0], wk[1])) return true;
  }
  return false;
}

function blackKingCheck(board)
{
  let bk = findBlackKing(board);
  if (bk[0] >= 0 && bk[1] >= 0)
  {
    if (whitePawnAttack(board, bk[0], bk[1])) return true;
    if (whiteRookAttack(board, bk[0], bk[1])) return true;
    if (whiteKnightAttack(board, bk[0], bk[1])) return true;
    if (whiteBishopAttack(board, bk[0], bk[1])) return true;
    if (whiteQueenAttack(board, bk[0], bk[1])) return true;
    if (whiteKingAttack(board, bk[0], bk[1])) return true;
  }
  return false;
}

function whiteKingAttack(board, i, j)
{
  if (i + 1 < 8)
  {
    if (board[i + 1][j] == 'K') return true;
    if (j - 1 >= 0 && board[i + 1][j - 1] == 'K') return true;
    if (j + 1 < 8 && board[i + 1][j + 1] == 'K') return true;
  }
  if (i - 1 >= 0)
  {
    if (board[i - 1][j] == 'K') return true;
    if (j - 1 >= 0 && board[i - 1][j - 1] == 'K') return true;
    if (j + 1 < 8 && board[i - 1][j + 1] == 'K') return true;
  }
  if (j + 1 < 8 && board[i][j + 1] == 'K') return true;
  if (j - 1 >= 0 && board[i][j - 1] == 'K') return true;
  return false;
}

function blackKingAttack(board, i, j)
{
  if (i + 1 < 8)
  {
    if (board[i + 1][j] == 'k') return true;
    if (j - 1 >= 0 && board[i + 1][j - 1] == 'k') return true;
    if (j + 1 < 8 && board[i + 1][j + 1] == 'k') return true;
  }
  if (i - 1 >= 0)
  {
    if (board[i - 1][j] == 'k') return true;
    if (j - 1 >= 0 && board[i - 1][j - 1] == 'k') return true;
    if (j + 1 < 8 && board[i - 1][j + 1] == 'k') return true;
  }
  if (j + 1 < 8 && board[i][j + 1] == 'k') return true;
  if (j - 1 >= 0 && board[i][j - 1] == 'k') return true;
  return false;
}

function whiteKnightAttack(board, i, j)
{
  if (i - 2 >= 0)
  {
    if (j + 1 < 8)
    {
      if (board[i - 2][j + 1] == 'N') return true;
    }
    if (j - 1 >= 0)
    {
      if (board[i - 2][j - 1] == 'N') return true;
    }
  }
  if (i + 2 < 8)
  {
    if (j + 1 < 8)
    {
      if (board[i + 2][j + 1] == 'N') return true;
    }
    if (j - 1 >= 0)
    {
      if (board[i + 2][j - 1] == 'N') return true;
    }
  }
  if (j - 2 >= 0)
  {
    if (i + 1 < 8)
    {
      if (board[i + 1][j - 2] == 'N') return true;
    }
    if (i - 1 >= 0)
    {
      if (board[i - 1][j - 2] == 'N') return true;
    }
  }
  if (j + 2 < 8)
  {
    if (i + 1 < 8)
    {
      if (board[i + 1][j + 2] == 'N') return true;
    }
    if (i - 1 >= 0)
    {
      if (board[i - 1][j + 2] == 'N') return true;
    }
  }
  return false;
}

function blackKnightAttack(board, i, j)
{
  if (i - 2 >= 0)
  {
    if (j + 1 < 8)
    {
      if (board[i - 2][j + 1] == 'n') return true;
    }
    if (j - 1 >= 0)
    {
      if (board[i - 2][j - 1] == 'n') return true;
    }
  }
  if (i + 2 < 8)
  {
    if (j + 1 < 8)
    {
      if (board[i + 2][j + 1] == 'n') return true;
    }
    if (j - 1 >= 0)
    {
      if (board[i + 2][j - 1] == 'n') return true;
    }
  }
  if (j - 2 >= 0)
  {
    if (i + 1 < 8)
    {
      if (board[i + 1][j - 2] == 'n') return true;
    }
    if (i - 1 >= 0)
    {
      if (board[i - 1][j - 2] == 'n') return true;
    }
  }
  if (j + 2 < 8)
  {
    if (i + 1 < 8)
    {
      if (board[i + 1][j + 2] == 'n') return true;
    }
    if (i - 1 >= 0)
    {
      if (board[i - 1][j + 2] == 'n') return true;
    }
  }
  return false;
}

function whiteQueenAttack(board, i, j)
{
  for (let k = 1; k < 8 - i && k < 8 - j; k++)
  {
    if (board[i + k][j + k] == 'e') continue;
    else if (board[i + k][j + k] == 'Q') return true;
    break;
  }
  for (let k = 1; k <= i && k < 8 - j; k++)
  {
    if (board[i - k][j + k] == 'e') continue;
    else if (board[i - k][j + k] == 'Q') return true;
    break;
  }
  for (let k = 1; k < 8 - i && k <= j; k++)
  {
    if (board[i + k][j - k] == 'e') continue;
    else if (board[i + k][j - k] == 'Q') return true;
    break;
  }
  for (let k = 1; k <= i && k <= j; k++)
  {
    if (board[i - k][j - k] == 'e') continue;
    else if (board[i - k][j - k] == 'Q') return true;
    break;
  }
  for (let k = 1; k < 8 - i; k++)
  {
    if (board[i + k][j] == 'e') continue;
    else if (board[i + k][j] == 'Q') return true;
    break;
  }
  for (let k = 1; k <= i; k++)
  {
    if (board[i - k][j] == 'e') continue;
    else if (board[i - k][j] == 'Q') return true;
    break;
  }
  for (let k = 1; k < 8 - j; k++)
  {
    if (board[i][j + k] == 'e') continue;
    else if (board[i][j + k] == 'Q') return true;
    break;
  }
  for (let k = 1; k <= j; k++)
  {
    if (board[i][j - k] == 'e') continue;
    else if (board[i][j - k] == 'Q') return true;
    break;
  }
  return false;
}

function blackQueenAttack(board, i, j)
{
  for (let k = 1; k < 8 - i && k < 8 - j; k++)
  {
    if (board[i + k][j + k] == 'e') continue;
    else if (board[i + k][j + k] == 'q') return true;
    break;
  }
  for (let k = 1; k <= i && k < 8 - j; k++)
  {
    if (board[i - k][j + k] == 'e') continue;
    else if (board[i - k][j + k] == 'q') return true;
    break;
  }
  for (let k = 1; k < 8 - i && k <= j; k++)
  {
    if (board[i + k][j - k] == 'e') continue;
    else if (board[i + k][j - k] == 'q') return true;
    break;
  }
  for (let k = 1; k <= i && k <= j; k++)
  {
    if (board[i - k][j - k] == 'e') continue;
    else if (board[i - k][j - k] == 'q') return true;
    break;
  }
  for (let k = 1; k < 8 - i; k++)
  {
    if (board[i + k][j] == 'e') continue;
    else if (board[i + k][j] == 'q') return true;
    break;
  }
  for (let k = 1; k <= i; k++)
  {
    if (board[i - k][j] == 'e') continue;
    else if (board[i - k][j] == 'q') return true;
    break;
  }
  for (let k = 1; k < 8 - j; k++)
  {
    if (board[i][j + k] == 'e') continue;
    else if (board[i][j + k] == 'q') return true;
    break;
  }
  for (let k = 1; k <= j; k++)
  {
    if (board[i][j - k] == 'e') continue;
    else if (board[i][j - k] == 'q') return true;
    break;
  }
  return false;
}

function whiteBishopAttack(board, i, j)
{
  for (let k = 1; k < 8 - i && k < 8 - j; k++)
  {
    if (board[i + k][j + k] == 'e') continue;
    else if (board[i + k][j + k] == 'B') return true;
    break;
  }
  for (let k = 1; k <= i && k < 8 - j; k++)
  {
    if (board[i - k][j + k] == 'e') continue;
    else if (board[i - k][j + k] == 'B') return true;
    break;
  }
  for (let k = 1; k < 8 - i && k <= j; k++)
  {
    if (board[i + k][j - k] == 'e') continue;
    else if (board[i + k][j - k] == 'B') return true;
    break;
  }
  for (let k = 1; k <= i && k <= j; k++)
  {
    if (board[i - k][j - k] == 'e') continue;
    else if (board[i - k][j - k] == 'B') return true;
    break;
  }
  return false;
}

function blackBishopAttack(board, i, j)
{
  for (let k = 1; k < 8 - i && k < 8 - j; k++)
  {
    if (board[i + k][j + k] == 'e') continue;
    else if (board[i + k][j + k] == 'b') return true;
    break;
  }
  for (let k = 1; k <= i && k < 8 - j; k++)
  {
    if (board[i - k][j + k] == 'e') continue;
    else if (board[i - k][j + k] == 'b') return true;
    break;
  }
  for (let k = 1; k < 8 - i && k <= j; k++)
  {
    if (board[i + k][j - k] == 'e') continue;
    else if (board[i + k][j - k] == 'b') return true;
    break;
  }
  for (let k = 1; k <= i && k <= j; k++)
  {
    if (board[i - k][j - k] == 'e') continue;
    else if (board[i - k][j - k] == 'b') return true;
    break;
  }
  return false;
}

function whiteRookAttack(board, i, j)
{
  for (let k = 1; k < 8 - i; k++)
  {
    if (board[i + k][j] == 'e') continue;
    else if (board[i + k][j] == 'R') return true;
    break;
  }
  for (let k = 1; k <= i; k++)
  {
    if (board[i - k][j] == 'e') continue;
    else if (board[i - k][j] == 'R') return true;
    break;
  }
  for (let k = 1; k < 8 - j; k++)
  {
    if (board[i][j + k] == 'e') continue;
    else if (board[i][j + k] == 'R') return true;
    break;
  }
  for (let k = 1; k <= j; k++)
  {
    if (board[i][j - k] == 'e') continue;
    else if (board[i][j - k] == 'R') return true;
    break;
  }
  return false;
}

function blackRookAttack(board, i, j)
{
  for (let k = 1; k < 8 - i; k++)
  {
    if (board[i + k][j] == 'e') continue;
    else if (board[i + k][j] == 'r') return true;
    break;
  }
  for (let k = 1; k <= i; k++)
  {
    if (board[i - k][j] == 'e') continue;
    else if (board[i - k][j] == 'r') return true;
    break;
  }
  for (let k = 1; k < 8 - j; k++)
  {
    if (board[i][j + k] == 'e') continue;
    else if (board[i][j + k] == 'r') return true;
    break;
  }
  for (let k = 1; k <= j; k++)
  {
    if (board[i][j - k] == 'e') continue;
    else if (board[i][j - k] == 'r') return true;
    break;
  }
  return false;
}

function whitePawnAttack(board, i, j)
{
  if (i + 1 < 8 && j - 1 >= 0)
  {
    if (board[i + 1][j - 1] == 'P') return true;
  }
  if (i + 1 < 8 && j + 1 < 8)
  {
    if (board[i + 1][j + 1] == 'P') return true;
  }
  return false;
}

function blackPawnAttack(board, i, j)
{
  if (i - 1 >= 0 && j - 1 >= 0)
  {
    if (board[i - 1][j - 1] == 'p') return true;
  }
  if (i - 1 >= 0 && j + 1 < 8)
  {
    if (board[i - 1][j + 1] == 'p') return true;
  }
  return false;
}

function findWhiteKing(board)
{
  for (let i = 0; i < 8; i++)
  {
    for (let j = 0; j < 8; j++)
    {
      if (board[i][j] == 'K') return [i, j];
    }
  }
  return [-1, -1];
}

function findBlackKing(board)
{
  for (let i = 0; i < 8; i++)
  {
    for (let j = 0; j < 8; j++)
    {
      if (board[i][j] == 'k') return [i, j];
    }
  }
  return [-1, -1];
}

export default
{
  history,
  move,
  isMove,
  playNote,
  playNotation
}