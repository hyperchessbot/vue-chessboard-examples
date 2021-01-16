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

let score = 0

function showScore(text){
    document.getElementById("score").innerHTML = text
}

async function play(){
    const currFen = posToFen(pos)

    let data = await waitShowMove()

    let san = data.history[0]

    pos = posFromFen(data.fen)

    setFen(data.fen)

    fetchBook(currFen).then(json => {
        let index = json.moves.findIndex(item => item.san == san)

        if(index < 0){
            window.alert("This move is not among top 12 choices. You lose. Lets start again ...")
            setFen(startFen)
            depth = 0
            showScore("Make your opening move!")
            score = 0

            setTimeout(function(){play()}, 0)

            return
        }else{            
            setFen(data.fen)
            depth++

            let bonus = 12 - index

            score = score + bonus

            showScore(`You made the move ranked <span class="rank">${index + 1}</span> . You receive <span class="bonus">${bonus}</span> points. Your score is <span class="standing">${score}</span> .`)
        }

        if(depth >= 12){
            window.alert(`Well done! Your final score is ${score} .`)
            showScore(`Your final score is <span class="standing">${score}</span> . Make your first move!`)
            setFen(startFen)
            depth = 0
            showScore(`Your final score is <span class="standing">${score}</span> . Make your first move!`)
            score = 0

            setTimeout(function(){play()}, 0)
        }else{
            fetchBook(posToFen(pos)).then(json => {
                let total = 0

                for(let item of json.moves){                    
                    total += item.white + item.draws + item.black
                }

                let rand = Math.floor(Math.random() * total)

                total = 0

                let selected = null

                for(let item of json.moves){                    
                    total += item.white + item.draws + item.black
                    if(total >= rand){
                        selected = item

                        break
                    }
                }

                makeUciMove(pos, selected.uci)

                setFen(posToFen(pos))

                setTimeout(function(){play()}, 0)
            })
        }
    })
}

showScore("Welcome to Lichess Opening Trainer! Make your first move!")

setTimeout(function(){play()}, 0)
