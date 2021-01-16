import Vue from 'vue'
import App from './App.vue'
import '../public/app.css'

new Vue({
  el: '#app',
  render: h => h(App)
})

function setFen(fen){
    document.getElementById('fen').value = fen
    document.getElementById("clickbutton").click()
}

setTimeout(function(){                
    setFen('rnb1kbnr/ppp1pppp/8/q7/8/2N5/PPPP1PPP/R1BQKBNR w KQkq - 2 4')
}, 500)
