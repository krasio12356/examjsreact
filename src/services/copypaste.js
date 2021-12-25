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
import waitEnemy from '../services/messages'

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
        this.playMove = this.playMove.bind(this);
        this.showPopup = this.showPopup.bind(this);
        this.clean = this.clean.bind(this);
        this.beginMove = undefined;
        this.endMove = undefined;
        this.movedPiece = undefined;
        this.data = undefined;
        this.yourcolour = undefined;
        this.turn = undefined;
        this.popupContent = undefined;
        this.interval = undefined;
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
        if (this.turn != undefined && this.turn.slice(-6) === this.yourcolour.substring(0, 6))
        {
            return true;
        }
        return false;
    }

    async playMove()
    {
        if (this.isMyTurn() == false)
        {
            this.popupContent = "It's not your turn";
            this.showPopup();
            return;
        }
        let h = chess.historyDeepCopy(this.state.history);
        let result = chess.move[this.movedPiece](h, p.oneDimTwoDim(this.beginMove), p.oneDimTwoDim(this.endMove));
        if (result != 'ok')
        {
            this.popupContent = "Invalid move";
            this.showPopup();
            return;
        }
        let whiteNotation = h[h.length - 1].gameState.whiteNotation.join(', ');
        let blackNotation = h[h.length - 1].gameState.blackNotation.join(', ');
        let notation = whiteNotation + '/' + blackNotation;
        try
        {
            let response = await fetch('http://localhost:5000/playMove',
            {
                method: 'POST',
                headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                body: JSON.stringify({authorization: sessionStorage.getItem('token'), id: sessionStorage.getItem('playGameId'), notation})
            });
            let data = await response.json();
            if (data.notation !== 'not updated')
            {
                this.setState({info: this.state.info});
            }
        }
        catch(er)
        {
      
        }
    }

    async componentDidUpdate()
    {
        if (sessionStorage.getItem('playGameId') !== undefined)
        {
            try
            {
                let response = await fetch('http://localhost:5000/currentGame',
                {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    body: JSON.stringify({authorization: sessionStorage.getItem('token'), id: sessionStorage.getItem('playGameId')})
                });
                let data = await response.json();
                let x = data;
                let y = x;
                if (data.notation !== this.data.notation)
                {
                    this.data.notation = data.notation;
                    let result = chess.playNotation(this.data.notation, chess.history);
                    this.turn = result.history[result.history.length - 1].gameState.turn;
                    if (this.turn === chess.WHITE)
                    {
                        this.turn = 'Turn: Whites'
                    }
                    else
                    {
                        this.turn = 'Turn: Blacks'
                    }
                    if (sessionStorage.getItem('playername') === this.data.whites)
                    {
                        this.yourcolour = 'Whites: You / Blacks: ' + this.data.blacks;
                    }
                    else
                    {
                        this.yourcolour = 'Blacks: You / Whites: ' + this.data.whites;
                    }
                    if (this.isMyTurn() == false)
                    {
                        this.interval = setInterval(waitEnemy, 1000);
                    }
                    else
                    {
                        if (this.interval)
                        {
                            clearInterval(this.interval);
                            this.interval = undefined;
                        }
                    }
                    if (result.result === 'ok');
                    {
                        this.setState(
                        {
                            info: result.history[result.history.length - 1].board, 
                            history: result.history
                        });
                    }
                }
            }
            catch(er)
            {
      
            }
        }
    }

    async componentDidMount()
    {
        if (sessionStorage.getItem('playGameId') !== undefined)
        {
            try
            {
                let response = await fetch('http://localhost:5000/currentGame',
                {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    body: JSON.stringify({authorization: sessionStorage.getItem('token'), id: sessionStorage.getItem('playGameId')})
                });
                this.data = await response.json();
                let result = chess.playNotation(this.data.notation, chess.history);
                this.turn = result.history[result.history.length - 1].gameState.turn;
                if (this.turn === chess.WHITE)
                {
                    this.turn = 'Turn: Whites'
                }
                else
                {
                    this.turn = 'Turn: Blacks'
                }
                if (sessionStorage.getItem('playername') === this.data.whites)
                {
                    this.yourcolour = 'Whites: You / Blacks: ' + this.data.blacks;
                }
                else
                {
                    this.yourcolour = 'Blacks: You / Whites: ' + this.data.whites;
                }
                if (this.isMyTurn() == false)
                {
                    this.interval = setInterval(this.waitEnemy, 1000);
                }
                else
                {
                    if (this.interval)
                    {
                        clearInterval(this.interval);
                        this.interval = undefined;
                    }
                }
                if (result.result === 'ok');
                {
                    this.setState(
                    {
                        info: result.history[result.history.length - 1].board, 
                        history: result.history
                    });
                }
            }
            catch(er)
            {
      
            }
        }
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
                        <p id='yourcolour'>
                            {this.yourcolour}
                        </p>
                        <p id='smallCastle'>
                            <button className='niceButton'>
                                Small castle
                            </button>
                        </p>
                        <p id='bigCastle'>
                            <button className='niceButton'>
                                Big castle
                            </button>
                        </p>
                        <p id='surrender'>
                            <button className='niceButton'>
                                Surrender
                            </button>
                        </p>
                        <p id='offerDraw'>
                            <button className='niceButton'>
                                Offer a draw
                            </button>
                        </p>
                        <p id='demandDraw'>
                            <button className='niceButton'>
                                Demand a draw
                            </button>
                        </p>
                        <p id='turn'>
                            {this.turn}
                        </p>
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