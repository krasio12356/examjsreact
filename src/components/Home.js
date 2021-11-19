import './Home.module.css';
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

class Home extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = 
        {
            
        };
        
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
                squares.push(<div key={i} style={{position : 'absolute', backgroundColor : colors[colorIndex], top : squareTopCSS, left : squareLeftCSS, width : squareWidthCSS, height : squareWidthCSS}}></div>)
            }
            for(let i = 0; i < 64; i++)
            {
                let squareTop = squareWidth * Math.floor(i / 8);
                let squareLeft = i % 8 * squareWidth;
                let squareTopCSS = squareTop + 'px';
                let squareLeftCSS = squareLeft + 'px';
                if (i == 0 || i == 7)
                {
                    pieces.push(<div key={i * 100} style={{position : 'absolute', top : squareTopCSS, left : squareLeftCSS, width : squareWidthCSS, height : squareWidthCSS}}><img src={blackRook}/></div>)
                }
                else if (i == 1 || i == 6)
                {
                    pieces.push(<div key={i * 100} style={{position : 'absolute', top : squareTopCSS, left : squareLeftCSS, width : squareWidthCSS, height : squareWidthCSS}}><img src={blackKnight}/></div>)
                }
                else if (i == 2 || i == 5)
                {
                    pieces.push(<div key={i * 100} style={{position : 'absolute', top : squareTopCSS, left : squareLeftCSS, width : squareWidthCSS, height : squareWidthCSS}}><img src={blackBishop}/></div>)
                }
                else if (i == 3)
                {
                    pieces.push(<div key={i * 100} style={{position : 'absolute', top : squareTopCSS, left : squareLeftCSS, width : squareWidthCSS, height : squareWidthCSS}}><img src={blackQueen}/></div>)
                }
                else if (i == 4)
                {
                    pieces.push(<div key={i * 100} style={{position : 'absolute', top : squareTopCSS, left : squareLeftCSS, width : squareWidthCSS, height : squareWidthCSS}}><img src={blackKing}/></div>)
                }
                else if (i >= 8 && i <= 15)
                {
                    pieces.push(<div key={i * 100} style={{position : 'absolute', top : squareTopCSS, left : squareLeftCSS, width : squareWidthCSS, height : squareWidthCSS}}><img src={blackPawn}/></div>)
                }
                else if (i >= 16 && i <= 47)
                {
                    pieces.push(<div key={i * 100} style={{position : 'absolute', top : squareTopCSS, left : squareLeftCSS, width : squareWidthCSS, height : squareWidthCSS}}></div>)
                }
                else if (i >= 48 && i <= 55)
                {
                    pieces.push(<div key={i * 100} style={{position : 'absolute', top : squareTopCSS, left : squareLeftCSS, width : squareWidthCSS, height : squareWidthCSS}}><img src={whitePawn}/></div>)
                }
                else if (i == 56 || i == 63)
                {
                    pieces.push(<div key={i * 100} style={{position : 'absolute', top : squareTopCSS, left : squareLeftCSS, width : squareWidthCSS, height : squareWidthCSS}}><img src={whiteRook}/></div>)
                }
                else if (i == 57 || i == 62)
                {
                    pieces.push(<div key={i * 100} style={{position : 'absolute', top : squareTopCSS, left : squareLeftCSS, width : squareWidthCSS, height : squareWidthCSS}}><img src={whiteKnight}/></div>)
                }
                else if (i == 58 || i == 61)
                {
                    pieces.push(<div key={i * 100} style={{position : 'absolute', top : squareTopCSS, left : squareLeftCSS, width : squareWidthCSS, height : squareWidthCSS}}><img src={whiteBishop}/></div>)
                }
                else if (i == 59)
                {
                    pieces.push(<div key={i * 100} style={{position : 'absolute', top : squareTopCSS, left : squareLeftCSS, width : squareWidthCSS, height : squareWidthCSS}}><img src={whiteQueen}/></div>)
                }
                else if (i == 60)
                {
                    pieces.push(<div key={i * 100} style={{position : 'absolute', top : squareTopCSS, left : squareLeftCSS, width : squareWidthCSS, height : squareWidthCSS}}><img src={whiteKing}/></div>)
                }
            }
        }
        

        return (
            <div className="frame" style={{height : `${this.props.ht}`}}>
                <div className='board' style={{top : top, left : left, width : boardWidth, height : boardHeight}}>
                    {squares}
                    {pieces}
                </div>
            </div>
        );
    }
}

export default Home;