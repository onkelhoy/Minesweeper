
let grid = [], N, tileSize, firstClick = true
function setup () {
    N = window.location.href.split('#')[1] | 10
    N = Number(N)

    let size = Math.min(this.innerWidth, this.innerHeight-100)
    tileSize = floor(size / N)

    createCanvas(tileSize*N, tileSize*N)
    textAlign(CENTER, CENTER)

    for (let row=0; row<N; row++) {
      grid[row] = []
      for (let col=0; col<N; col++)
        grid[row][col] = new Cell(row, col)
    }

    noLoop()
}

function makeBombs (x, y) {
  firstClick = false
  let bombs = N
  for (let i=0; i<bombs; i++)
    while (true) {
      let col = round(random(N-1))
      let row = round(random(N-1))

      if (row === x && col === y) continue
      if (grid[row][col].bomb) continue
      grid[row][col].makeBomb()
      break
    }
}

function draw () {
  background(255)

  for (let row=0; row<N; row++) {
    for (let col=0; col<N; col++) {
      let x = row*tileSize, y = col*tileSize
      grid[row][col].render(x, y, tileSize)

      strokeWeight(1)
      stroke(0)
      line(x, y, x + tileSize, y)
      line(x, y, x, y + tileSize)
      line(x + tileSize, y, x + tileSize, y + tileSize)
      line(x, y + tileSize, x + tileSize, y + tileSize)
    }
  }
}


function mousePressed () {
  let x = floor(map(mouseX, 0, width, 0, N))
  let y = floor(map(mouseY, 0, width, 0, N))

  if (x >= 0 && x < N && y >= 0 && y < N) {
    if (firstClick) makeBombs(x, y)
    if (mouseButton === 'left')
      grid[x][y].reviel()
    else
      grid[x][y].mark()
  }

  draw()
}


class Cell {
  constructor (r, c) {
    this.c = c
    this.r = r
    this.bomb = false
    this.revieled = false
    this.value = 0
    this.marked = false
  }

  makeBomb () {
    this.bomb = true
    let row = {s: max(this.r-1, 0), e: min(this.r+1, N-1)}
    let col = {s: max(this.c-1, 0), e: min(this.c+1, N-1)}

    for (let i=row.s; i<=row.e; i++)
      for (let j=col.s; j<=col.e; j++)
        grid[i][j].value++
  }

  mark () {
    if (!this.revieled) this.marked = true
    this.revieled = true
  }

  reviel () {
    this.revieled = true
    if (this.value === 0 && !this.bomb) {
      // reviel all other
      let row = {s: max(this.r-1, 0), e: min(this.r+1, N-1)}
      let col = {s: max(this.c-1, 0), e: min(this.c+1, N-1)}

      for (let i=row.s; i<=row.e; i++)
        for (let j=col.s; j<=col.e; j++)
          if (!grid[i][j].revieled) grid[i][j].reviel()
    }

    if (this.bomb) {
      console.log('game over')
    }
  }
  render (x, y, size) {
    noFill()
    if (this.revieled) {
      if (this.bomb) {
        if (this.marked) noFill()
        else fill('tomato')
        ellipse(x+size/2, y+size/2, size*.7)
      }
      else if (this.value > 0) {
        fill(0)
        text(this.value, x+size/2, y+size/2)
      } else {
        fill(200)
        rect(x, y, size, size)
      }
    }
  }
}
