import './Play.module.css';
import blackPawn from '../img/pb.png';
import blackRook from '../img/rb.png';
import blackKnight from '../img/nb.png';
import blackBishop from '../img/bb.png';
import blackQueen from '../img/qb.png';
import blackKing from '../img/kb.png';
import empty from '../img/ee.png';
import whitePawn from '../img/pw.png';
import whiteRook from '../img/rw.png';
import whiteKnight from '../img/nw.png';
import whiteBishop from '../img/bw.png';
import whiteQueen from '../img/qw.png';
import whiteKing from '../img/kw.png';
import React from "react";
import p from '../services/position';
import chess from '../services/chess';


let figures =
{
    p: blackPawn,
    r: blackRook,
    n: blackKnight,
    b: blackBishop,
    q: blackQueen,
    k: blackKing,
    e: empty,
    P: whitePawn,
    R: whiteRook,
    N: whiteKnight,
    B: whiteBishop,
    Q: whiteQueen,
    K: whiteKing,
}

class Play extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = 
        {
            info: 
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
            history: chess.history
        };
        this.handleDragOver = this.handleDragOver.bind(this);
        this.handleDrag = this.handleDrag.bind(this);
        this.handleDrop = this.handleDrop.bind(this);
        this.isMyTurn = this.isMyTurn.bind(this);
        this.isMyColour = this.isMyColour.bind(this);
        this.playMove = this.playMove.bind(this);
        this.showPopup = this.showPopup.bind(this);
        this.clean = this.clean.bind(this);
        this.waitEnemy = this.waitEnemy.bind(this);
        this.isEqual = this.isEqual.bind(this);
        this.deepCopyData = this.deepCopyData.bind(this);
        this.smallCastle = this.smallCastle.bind(this);
        this.bigCastle = this.bigCastle.bind(this);
        this.getWinner = this.getWinner.bind(this);
        this.getLooser = this.getLooser.bind(this);
        this.surrender = this.surrender.bind(this);
        this.offerDraw = this.offerDraw.bind(this);
        this.acceptDraw = this.acceptDraw.bind(this);
        this.rejectDraw = this.rejectDraw.bind(this);
        this.demandDraw = this.demandDraw.bind(this);
        this.beginMove = undefined;
        this.endMove = undefined;
        this.movedPiece = undefined;
        this.update = false;
        this.data = {whites: undefined, blacks: undefined, notation: '/'};
        this.result = {result: 'ok', history: chess.history};
        this.yourcolour = undefined;
        this.turn = undefined;
        this.turns = ['Turn: Blacks', 'Turn: Whites']
        this.popupContent = undefined;
        this.interval = undefined;
        this.offerdraw = false;
        this.completed = false;
    }

    async waitEnemy()
    {
        if (sessionStorage.getItem('playGameId'))
        {
            try
            {
                let response = await fetch('http://localhost:5000/waitEnemy',
                {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    body: JSON.stringify({authorization: sessionStorage.getItem('token'), id: sessionStorage.getItem('playGameId'), notation: this.data.notation})
                });
                let data = await response.json();
                if (this.yourcolour === undefined || data.notation !== 'do nothing')
                {
                    this.update = true;
                    if (data.notation !== 'do nothing')
                    {
                        this.data = data;
                        this.result = chess.playNotation(data.notation, chess.history);
                    }
                    this.turn = this.result.history[this.result.history.length - 1].gameState.turn;
                    if (sessionStorage.getItem('playername') === data.whites)
                    {
                        this.yourcolour = 'Whites: You / Blacks: ' + data.blacks;
                    }
                    else if (sessionStorage.getItem('playername') === data.blacks)
                    {
                        this.yourcolour = 'Blacks: You / Whites: ' + data.whites;
                    }
                    if (this.result.result === 'ok')
                    {
                        this.state.info = this.result.history[this.result.history.length - 1].board;
                        this.state.history = this.result.history;
                    }
                    else if (this.result.result === 'win')
                    {
                        this.completed = true;
                        this.state.info = this.result.history[this.result.history.length - 1].board;
                        this.state.history = this.result.history;
                        let obj = {};
                        obj.winner = this.getWinner();
                        obj.looser = this.getLooser();
                        obj._id = sessionStorage.getItem('playGameId');
                        obj.authorization = sessionStorage.getItem('token');
                        obj.notation = data.notation;
                        await fetch('http://localhost:5000/win',
                        {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                            body: JSON.stringify(obj)
                        });
                    }
                    else if (this.result.result === 'draw')
                    {
                        this.completed = true;
                        this.state.info = this.result.history[this.result.history.length - 1].board;
                        this.state.history = this.result.history;
                        let obj = {};
                        obj._id = sessionStorage.getItem('playGameId');
                        obj.authorization = sessionStorage.getItem('token');
                        obj.notation = data.notation;
                        await fetch('http://localhost:5000/draw',
                        {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                            body: JSON.stringify(obj)
                        });
                    }
                    else if (this.result.result === 'offerdraw')
                    {
                        this.offerdraw = true;
                        this.state.info = this.result.history[this.result.history.length - 1].board;
                        this.state.history = this.result.history;
                    }
                    else if (this.result.result === 'rejectdraw')
                    {
                        this.offerdraw = false;
                        this.state.info = this.result.history[this.result.history.length - 1].board;
                        this.state.history = this.result.history;
                    }
                    this.forceUpdate();
                }
            }
            catch(er)
            {
      
            }
        }
    }

    getWinner()
    {
        let he = this.state.history[this.state.history.length - 1];
        let whiteNote = he.gameState.whiteNotation[he.gameState.whiteNotation.length - 1]
        if (whiteNote.endsWith('X')) return this.data.whites;
        if (whiteNote.endsWith('SURRENDER')) return this.data.blacks;
        let blackNote = he.gameState.blackNotation[he.gameState.blackNotation.length - 1]
        if (blackNote.endsWith('X')) return this.data.blacks;
        if (blackNote.endsWith('surrender')) return this.data.whites;
    }

    getLooser()
    {
        if (this.getWinner() === this.data.whites) return this.data.blacks;
        else return this.data.whites;
    }

    componentDidMount()
    {
        this.interval = setInterval(this.waitEnemy, 1000);
    }

    componentWillUnmount()
    {
        clearInterval(this.interval);
    }

    isEqual(olddata, data)
    {
        if (data.notation !== olddata.notation) return false;
        if (data.whites !== olddata.whites) return false;
        if (data.blacks !== olddata.blacks) return false;
        return true;
    }

    deepCopyData(olddata, data)
    {
        olddata.notation = data.notation;
        olddata.whites = data.whites;
        olddata.blacks = data.blacks;
    }

    clean(pop)
    {
        document.body.removeChild(pop);
    }

    showPopup()
    {
        let pop = document.createElement('div');
        pop.className = 'centerPopup';
        pop.textContent = this.popupContent;
        document.body.appendChild(pop);
        setTimeout(this.clean, 2000, pop)
    }

    isMyTurn()
    {
        if (this.turn != undefined && this.turns[this.turn].slice(-6) === this.yourcolour.substring(0, 6))
        {
            return true;
        }
        return false;
    }

    isMyColour()
    {
        if (this.movedPiece.toUpperCase() === this.movedPiece)
        {
            if (this.yourcolour.startsWith('Whites'))
            {
                return true;
            }
            return false;
        }
        if (this.movedPiece.toLowerCase() === this.movedPiece)
        {
            if (this.yourcolour.startsWith('Blacks'))
            {
                return true;
            }
            return false;
        }
    }

    smallCastle()
    {
        if (this.yourcolour.startsWith('Whites'))
        {
            this.movedPiece = 'K';
            this.beginMove = 60;
            this.endMove = 62;
            this.playMove();
        }
        else
        {
            this.movedPiece = 'k';
            this.beginMove = 4;
            this.endMove = 6;
            this.playMove();
        }
    }

    bigCastle()
    {
        if (this.yourcolour.startsWith('Whites'))
        {
            this.movedPiece = 'K';
            this.beginMove = 60;
            this.endMove = 58;
            this.playMove();
        }
        else
        {
            this.movedPiece = 'k';
            this.beginMove = 4;
            this.endMove = 2;
            this.playMove();
        }
    }

    playMove()
    {
        if (this.completed)
        {
            this.popupContent = "Game is over";
            this.showPopup();
            return;
        }
        if (this.isMyTurn() == false)
        {
            this.popupContent = "It's not your turn";
            this.showPopup();
            return;
        }
        if (this.offerdraw)
        {
            this.popupContent = "Draw is offered. Either accept or reject";
            this.showPopup();
            return;
        }
        if (this.isMyColour() == false)
        {
            this.popupContent = "It's not your colour";
            this.showPopup();
            return;
        }
        let h = chess.historyDeepCopy(this.state.history);
        let result = chess.move[this.movedPiece](h, p.oneDimTwoDim(this.beginMove), p.oneDimTwoDim(this.endMove));
        if (result === 'invalid')
        {
            this.popupContent = "Invalid move";
            this.showPopup();
            return;
        }
        let whiteNotation = h[h.length - 1].gameState.whiteNotation.join(', ');
        let blackNotation = h[h.length - 1].gameState.blackNotation.join(', ');
        let notation = whiteNotation + '/' + blackNotation;
        this.data.notation = notation;
    }

    surrender()
    {
        if (this.completed)
        {
            this.popupContent = "Game is over";
            this.showPopup();
            return;
        }
        if (this.isMyTurn() == false)
        {
            this.popupContent = "It's not your turn";
            this.showPopup();
            return;
        }
        if (this.offerdraw)
        {
            this.popupContent = "Draw is offered. Either accept or reject";
            this.showPopup();
            return;
        }
        let h = chess.historyDeepCopy(this.state.history);
        if (this.yourcolour.startsWith('Whites'))
        {
            chess.playNote('SURRENDER', h)
        }
        else
        {
            chess.playNote('surrender', h)
        }
        this.completed = true;
        let whiteNotation = h[h.length - 1].gameState.whiteNotation.join(', ');
        let blackNotation = h[h.length - 1].gameState.blackNotation.join(', ');
        let notation = whiteNotation + '/' + blackNotation;
        this.data.notation = notation;
    }

    offerDraw()
    {
        if (this.completed)
        {
            this.popupContent = "Game is over";
            this.showPopup();
            return;
        }
        if (this.isMyTurn() == false)
        {
            this.popupContent = "It's not your turn";
            this.showPopup();
            return;
        }
        if (this.offerdraw)
        {
            this.popupContent = "Draw is offered. Either accept or reject";
            this.showPopup();
            return;
        }
        let h = chess.historyDeepCopy(this.state.history);
        if (this.yourcolour.startsWith('Whites'))
        {
            chess.playNote('OFFERDRAW', h)
        }
        else
        {
            chess.playNote('offerdraw', h)
        }
        this.offerdraw = true;
        let whiteNotation = h[h.length - 1].gameState.whiteNotation.join(', ');
        let blackNotation = h[h.length - 1].gameState.blackNotation.join(', ');
        let notation = whiteNotation + '/' + blackNotation;
        this.data.notation = notation;
    }

    acceptDraw()
    {
        if (this.completed)
        {
            this.popupContent = "Game is over";
            this.showPopup();
            return;
        }
        if (this.isMyTurn() == false)
        {
            this.popupContent = "It's not your turn";
            this.showPopup();
            return;
        }
        if (this.offerdraw == false)
        {
            this.popupContent = "Draw is not offered";
            this.showPopup();
            return;
        }
        let h = chess.historyDeepCopy(this.state.history);
        if (this.yourcolour.startsWith('Whites'))
        {
            chess.playNote('ACCEPTDRAW', h)
        }
        else
        {
            chess.playNote('acceptdraw', h)
        }
        this.completed = true;
        let whiteNotation = h[h.length - 1].gameState.whiteNotation.join(', ');
        let blackNotation = h[h.length - 1].gameState.blackNotation.join(', ');
        let notation = whiteNotation + '/' + blackNotation;
        this.data.notation = notation;
    }
    
    rejectDraw()
    {
        if (this.completed)
        {
            this.popupContent = "Game is over";
            this.showPopup();
            return;
        }
        if (this.isMyTurn() == false)
        {
            this.popupContent = "It's not your turn";
            this.showPopup();
            return;
        }
        if (this.offerdraw == false)
        {
            this.popupContent = "Draw is not offered";
            this.showPopup();
            return;
        }
        let h = chess.historyDeepCopy(this.state.history);
        if (this.yourcolour.startsWith('Whites'))
        {
            chess.playNote('REJECTDRAW', h)
        }
        else
        {
            chess.playNote('rejectdraw', h)
        }
        this.offerdraw = false;
        let whiteNotation = h[h.length - 1].gameState.whiteNotation.join(', ');
        let blackNotation = h[h.length - 1].gameState.blackNotation.join(', ');
        let notation = whiteNotation + '/' + blackNotation;
        this.data.notation = notation;
    }

    demandDraw()
    {
        if (this.completed)
        {
            this.popupContent = "Game is over";
            this.showPopup();
            return;
        }
        if (this.isMyTurn() == false)
        {
            this.popupContent = "It's not your turn";
            this.showPopup();
            return;
        }
        if (this.offerdraw)
        {
            this.popupContent = "Draw is offered. Either accept or reject";
            this.showPopup();
            return;
        }
        let h = chess.historyDeepCopy(this.state.history);
        if (h[h.length - 1].gameState.eog.threefold === false)
        {
            this.popupContent = "This position didn't occur three times";
            this.showPopup();
            return;
        }
        if (this.yourcolour.startsWith('Whites'))
        {
            chess.playNote('DEMANDDRAW', h)
        }
        else
        {
            chess.playNote('demandraw', h)
        }
        this.completed = true;
        let whiteNotation = h[h.length - 1].gameState.whiteNotation.join(', ');
        let blackNotation = h[h.length - 1].gameState.blackNotation.join(', ');
        let notation = whiteNotation + '/' + blackNotation;
        this.data.notation = notation;
    }

    handleDragOver(ev) 
    {
        ev.preventDefault();
    }
      
    handleDrag(ev) 
    {
        this.movedPiece = ev.target.className;
        this.beginMove = Number(ev.target.parentElement.id);
    }
      
    handleDrop(ev) 
    {
        ev.preventDefault();
        if (ev.target.nodeName == 'DIV')
        {
            this.endMove = Number(ev.target.id);
        }
        else
        {
            this.endMove = Number(ev.target.parentElement.id);
        }
        this.playMove();
    }

    render()
    {
        let height, width, top, left, boardHeight, boardWidth, notationTop; 
        let squareWidth, squareWidthCSS;
        let squares = [];
        let pieces = [];
        let whiteNotation = 'White notation: ' + this.state.history[this.state.history.length - 1].gameState.whiteNotation.join(', ');
        let blackNotation = 'Black notation: ' + this.state.history[this.state.history.length - 1].gameState.blackNotation.join(', ');
        if (this.props.ht)
        {
            height = Number(this.props.ht.slice(0, -2));
            width = document.documentElement.clientWidth;
            if (height < width)
            {
                top = Math.floor(height / 4);
                boardHeight = Math.floor(height / 2);
                boardWidth = Math.floor(height / 2);
                left = Math.floor((width - boardWidth) / 2);
            }
            else
            {
                left = Math.floor(width / 4);
                boardHeight = Math.floor(width / 2);
                boardWidth = Math.floor(width / 2);
                top = Math.floor((height - boardHeight) / 2);
            }
            top = 10;
            notationTop = top + boardHeight - boardHeight % 8 + 10 + 'px';
            top = top + 'px';
            left = left + 'px';
            boardHeight = boardHeight - boardHeight % 8 + 'px';
            boardWidth = boardWidth - boardWidth % 8 + 'px';
            squareWidth = Math.floor(Number(boardWidth.slice(0, -2)) / 8);
            squareWidthCSS = squareWidth + 'px';
            for(let i = 0; i < 64; i++)
            {
                let squareTop = squareWidth * Math.floor(i / 8);
                let squareLeft = i % 8 * squareWidth;
                let squareTopCSS = squareTop + 'px';
                let squareLeftCSS = squareLeft + 'px';
                let colors = ['chocolate', 'brown'];
                let colorIndex = (Math.floor(i / 8) % 2) ^ (i % 2);
                squares.push(<div onDrop={this.handleDrop} onDragOver={this.handleDragOver} key={i} id={i.toString()} style={{position : 'absolute', backgroundColor : colors[colorIndex], top : squareTopCSS, left : squareLeftCSS, width : squareWidthCSS, height : squareWidthCSS}}><img style={{width : '100%', height : '100%' }} draggable='true' onDrag={this.handleDrag} className={this.state.info[p.oneDimTwoDim(i)[0]][p.oneDimTwoDim(i)[1]]} src={figures[this.state.info[p.oneDimTwoDim(i)[0]][p.oneDimTwoDim(i)[1]]]}/></div>);
            }
        }
        return (
            <div className="frame" style={{height : `${this.props.ht}`}}>
                <div className='board' style={{top : top, left : left, width : boardWidth, height : boardHeight}}>
                    {squares}
                </div>
                <div className='notation' style={{top : notationTop}}>
                    <div className='status'>
                        <div id='yourcolour'>
                            {this.yourcolour}
                        </div>
                        <div id='smallCastle'>
                            <button className='niceButton' onClick={this.smallCastle}>
                                Small castle
                            </button>
                        </div>
                        <div id='bigCastle'>
                            <button className='niceButton' onClick={this.bigCastle}>
                                Big castle
                            </button>
                        </div>
                        <div id='surrender'>
                            <button className='niceButton' onClick={this.surrender}>
                                Surrender
                            </button>
                        </div>
                        <div id='offerDraw'>
                            <button className='niceButton'>
                                Offer draw
                            </button>
                        </div>
                        <div id='acceptDraw'>
                            <button className='niceButton'>
                                Accept draw
                            </button>
                        </div>
                        <div id='rejectDraw'>
                            <button className='niceButton'>
                                Reject draw
                            </button>
                        </div>
                        <div id='demandDraw'>
                            <button className='niceButton'>
                                Demand draw
                            </button>
                        </div>
                        <div id='turn'>
                            {this.turns[this.turn]}
                        </div>
                    </div>
                    <p id='whiteNotation'>
                        {whiteNotation}
                    </p>
                    <p id='blackNotation'>
                        {blackNotation}
                    </p>
                </div>
            </div>
        );
    }
}

export default Play;
