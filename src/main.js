import Vue from 'vue'
import App from './App.vue'
import '../public/app.css'

import { parseFen } from './chessops/fen'
import { Chess } from './chessops/chess'
import { parseUci } from './chessops/util'
import { makeFen } from './chessops/fen'

new Vue({
  el: '#app',
  render: h => h(App)
})

function setFen(fen){
    document.getElementById('fen').value = fen
    document.getElementById("clickbutton").click()
}

const startFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

function posFromFen(fen){
    const setup = parseFen(fen).unwrap()
    const pos = Chess.fromSetup(setup).unwrap()

    return pos
}

function posToFen(pos){
    const fen = makeFen(pos.toSetup(), null)

    return fen
}

function makeUciMove(pos, uci){
    const m = parseUci(uci)    
    pos.play(m)
}

setFen(startFen)

let pos = posFromFen(startFen)

makeUciMove(pos, "e2e4")

setFen(posToFen(pos))
