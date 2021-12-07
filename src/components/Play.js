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
            history: chess.initialHistory
        };
        this.handleDragOver = this.handleDragOver.bind(this);
        this.handleDrag = this.handleDrag.bind(this);
        this.handleDrop = this.handleDrop.bind(this);
        this.beginMove = undefined;
        this.endMove = undefined;
        this.movedPiece = undefined;
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
        let arrangement = this.state.info;
        let xyBegin = p.oneDimTwoDim(this.beginMove);
        let xyEnd = p.oneDimTwoDim(this.endMove);
        arrangement[xyBegin[1]][xyBegin[0]] = 'e';
        arrangement[xyEnd[1]][xyEnd[0]] = this.movedPiece;
        this.setState(
            {
                info: arrangement
            }
        );
    }

    render()
    {
        let height, width, top, left, boardHeight, boardWidth, notationTop; 
        let squareWidth, squareWidthCSS;
        let squares = [];
        let pieces = [];
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
                squares.push(<div onDrop={this.handleDrop} onDragOver={this.handleDragOver} key={i} id={i.toString()} style={{position : 'absolute', backgroundColor : colors[colorIndex], top : squareTopCSS, left : squareLeftCSS, width : squareWidthCSS, height : squareWidthCSS}}><img style={{width : '100%', height : '100%' }} draggable='true' onDrag={this.handleDrag} className={this.state.info[p.oneDimTwoDim(i)[1]][p.oneDimTwoDim(i)[0]]} src={figures[this.state.info[p.oneDimTwoDim(i)[1]][p.oneDimTwoDim(i)[0]]]}/></div>);
            }
        }
        
        return (
            <div className="frame" style={{height : `${this.props.ht}`}}>
                <div className='board' style={{top : top, left : left, width : boardWidth, height : boardHeight}}>
                    {squares}
                </div>
                <div className='notation' style={{top : notationTop}}>
                    <p id='whiteNotation'>
                        White notation:
                    </p>
                    <p id='blackNotation'>
                        Black notation:
                    </p>
                </div>
            </div>
        );
    }
}

export default Play;