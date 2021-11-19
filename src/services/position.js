let letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

function oneDimTwoDim(n)
{
    let y = Math.floor(n / 8);
    let x = n % 8;
    return [x, y];
}

function twoDimOneDim(x, y)
{
    return y * 8 + x;
}

function twoDimLetter(x, y)
{
    return letters[x] + (8 - y);
}

function letterTwoDim(s)
{
    let x = Math.abs('a'.charCodeAt(0) - s.toLowerCase().charCodeAt(0));
    let y = 8 - Number(s[1]);
    return [x, y];   
}

function oneDimLetter(n)
{
    return twoDimLetter(oneDimTwoDim(n));
}

function letterOneDim(s)
{
    return twoDimOneDim(letterTwoDim(s));
}

function leftTopTwoDim(left, top, width)
{
    return [left / width, top / width];
}

function twoDimLeftTop(x, y, width)
{
    return [x * width, y * width];
}

function leftTopOneDim(left, top, width)
{
    return twoDimOneDim(leftTopTwoDim(left, top, width));
}

function oneDimLeftTop(n, width)
{
    twoDimLeftTop(oneDimTwoDim(n), width)
}

function leftTopLetter(left, top, width)
{
    return twoDimLetter(leftTopTwoDim(left, top, width));
}

function letterLeftTop(s, width)
{
    twoDimLeftTop(letterTwoDim(s), width)
}

function pointTwoDim(left, top, width)
{
    return [Math.floor(left / width), Math.floor(top / width)];
}

function pointOneDim(left, top, width)
{
    return twoDimOneDim(pointTwoDim(left, top, width));
}

function pointLetter(left, top, width)
{
    return twoDimLetter(pointTwoDim(left, top, width));
}

function pointLeftTop(left, top, width)
{
    return twoDimLeftTop(pointTwoDim(left, top, width));
}

export default
{
    pointLeftTop,
    pointLetter,
    pointOneDim,
    pointTwoDim,
    oneDimTwoDim,
    twoDimOneDim,
    twoDimLeftTop,
    leftTopTwoDim,
    twoDimLetter,
    letterTwoDim,
    oneDimLeftTop,
    leftTopOneDim,
    oneDimLetter,
    letterOneDim,
    letterLeftTop,
    leftTopLetter
}