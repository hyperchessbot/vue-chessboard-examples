<template>
  <div id="app">    
    <input style="display:none;" type="text" id="fen"/>
    <button id="clickbutton" style="display:none;" @click="setFen()"/>
    <input style="display:none;" type="text" id="showmove"/>
    <chessboard :fen="currentFen" @onMove="showMove"/>        
  </div>
</template>

<script>
import {chessboard} from 'vue-chessboard'
import 'vue-chessboard/dist/vue-chessboard.css'

export default {
  name: 'app',  
  components: {
      chessboard,
  },
  data () {
    return {        
        currentFen: '',
        positionInfo: null,      
    }
  },
  methods: {
    showMove(data) {
      const blob = JSON.stringify(data)
      document.getElementById("showmove").value = blob
    },    
    setFen(fen){
        const inp = document.getElementById("fen")        
        if(fen) inp.value = fen
        this.currentFen = inp.value
    },
    promote() {
      if (confirm("Want to promote to rook? Queen by default") ) {
        return 'r'
      } else {
        return 'q'
      }
    }
  },
  created() {
    this.fens = ['5rr1/3nqpk1/p3p2p/Pp1pP1pP/2pP1PN1/2P1Q3/2P3P1/R4RK1 b - f3 0 28',
                'r4rk1/pp1b3p/6p1/8/3NpP2/1P4P1/P2K3P/R6R w - - 0 22'
                ]
  },
}
</script>
