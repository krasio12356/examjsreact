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
                  'rnbqkbnr',
                  'pppppppp',
                  'eeeeeeee',
                  'eeeeeeee',
                  'eeeeeeee',
                  'eeeeeeee',
                  'PPPPPPPP',
                  'RNBQKBNR'
                ]
            
        };
        this.allowDrop = this.allowDrop.bind(this);
        this.drag = this.drag.bind(this);
        this.drop = this.drop.bind(this);
        this.beginMove = undefined;
        this.endMove = undefined;
        this.movedPiece = undefined;
    }

    allowDrop(ev) 
    {
        ev.preventDefault();
    }
      
    drag(ev) 
    {
        ev.dataTransfer.setData("text", ev.target.className);
        this.beginMove = Number(ev.target.parentElement.id);
    }
      
    drop(ev) 
    {
        ev.preventDefault();
        this.movedPiece = ev.dataTransfer.getData("text");
        //ev.target.appendChild(document.getElementById(data));
        this.endMove = Number(ev.target.id);
    }

    render()
    {
        let height, width, top, left, boardHeight, boardWidth; 
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
            top = top + 'px';
            left = left + 'px';
            boardHeight = boardHeight + 'px';
            boardWidth = boardWidth + 'px';
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
                squares.push(<div key={i} id={i.toString()} style={{position : 'absolute', top : squareTopCSS, left : squareLeftCSS, width : squareWidthCSS, height : squareWidthCSS}}><img className={this.state.info[p.oneDimTwoDim(i)[0]][p.oneDimTwoDim(i)[1]]} src={figures[this.state.info[p.oneDimTwoDim(i)[0]][p.oneDimTwoDim(i)[1]]]}/></div>);
            }
        }
        
        return (
            <div className="frame" style={{height : `${this.props.ht}`}}>
                <div className='board' style={{top : top, left : left, width : boardWidth, height : boardHeight}}>
                    {squares}
                </div>
            </div>
        );
    }
}

export default Play;