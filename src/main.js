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

let pos = null

function setFen(fen){
    document.getElementById('fen').value = fen
    document.getElementById("clickbutton").click()

    pos = posFromFen(fen)
}

setFen(startFen)

let showmove = document.getElementById("showmove")

function waitShowMove(){
    return new Promise(resolve => {
        const current = showmove.value

        setInterval(function(){
            if(showmove.value != current){                
                resolve(JSON.parse(showmove.value))
            }
        }, 200)
    })
}

function fetchBook(fen){
    return new Promise(resolve => {
        fetch(`https://explorer.lichess.ovh/lichess?fen=${fen}&play=&variant=standard&speeds%5B%5D=blitz&speeds%5B%5D=rapid&ratings%5B%5D=2000&ratings%5B%5D=2200&ratings%5B%5D=2500`).then(response => response.json().then(json => {
            resolve(json)
        }))
    })
}

let depth = 0

async function play(){
    const currFen = posToFen(pos)

    let data = await waitShowMove()

    let san = data.history[0]

    pos = posFromFen(data.fen)

    setFen(data.fen)

    fetchBook(currFen).then(json => {
        let index = json.moves.findIndex(item => item.san == san)

        if(index < 0){
            setFen(startFen)
            window.alert("This move is not among top 12 choices. You lose. Lets start again ...")

            setTimeout(function(){play()}, 0)

            return
        }else{            
            setFen(data.fen)
            depth++
        }

        if(depth >= 5){
            window.alert("Well done.")

            setFen(startFen)
        }else{
            fetchBook(posToFen(pos)).then(json => {
                const m = json.moves[Math.floor(Math.random() * json.moves.length)]

                makeUciMove(pos, m.uci)

                setFen(posToFen(pos))

                setTimeout(function(){play()}, 0)
            })
        }
    })
}

setTimeout(function(){play()}, 0)
