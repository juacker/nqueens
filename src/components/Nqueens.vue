<template>
  <div class="hero is-fullheight">
    <b-field>
		<b-numberinput controls-position="compact" v-model="dim" min=2 max=12 :editable="false" type="is-light" ></b-numberinput>
      <p class="control">
        <b-button type="button" @click="reset" icon-right="delete"></b-button>
        <b-button type="button" @click="undo" icon-right="undo"></b-button>
        <b-button type="button" @click="solve" icon-right="emoji_objects"></b-button>
      </p>
    </b-field>
    <div class="hero is-fullheight">
      <table class="board">
        <tr v-for="(row,i) in squares" :key="i" class="row">
            <td v-for="(square,j) in row" :key="j" :class="square.class" @click="squareClick(i,j)"/>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Nqueens',
  data: function() {
    return {
      dim: 8,
      queens: [],
    }
  },
  computed: {
    squares: function() {
      var x = new Array(this.dim);

      // initialize board
      for (var i = 0; i < this.dim; i++) {
        x[i] = new Array(this.dim);
        for (var j = 0; j < this.dim; j++) {
          x[i][j] = {class: "empty"}
        }
      }

      // update squares reached by queens
      for (i = 0; i < this.queens.length; i++) {
        var queen = this.queens[i]

        // columns
        for (var col = 0; col < this.dim; col++) {
          if (col != queen.col) {
            x[queen.row][col].class = "forbidden"
          }
        }

        // rows
        for (var row = 0; row < this.dim; row++) {
          if (row != queen.row) {
            x[row][queen.col].class = "forbidden"
          }
        }

        // diagonals
        // top left diagonal
        var diagRow = queen.row - 1;
        var diagCol = queen.col - 1;
        while (diagRow >= 0 && diagCol >= 0) {
          x[diagRow][diagCol].class = "forbidden";
          diagRow--;
          diagCol--;
        }

        // top right diagonal
        diagRow = queen.row + 1;
        diagCol = queen.col + 1;
        while (diagRow < this.dim && diagCol < this.dim) {
          x[diagRow][diagCol].class = "forbidden";
          diagRow++;
          diagCol++;
        }

        // bottom left diagonal
        diagRow = queen.row + 1;
        diagCol = queen.col - 1;
        while (diagRow < this.dim && diagCol >= 0) {
          x[diagRow][diagCol].class = "forbidden";
          diagRow++;
          diagCol--;
        }

        // bottom right diagonal
        diagRow = queen.row - 1;
        diagCol = queen.col + 1;
        while (diagRow >= 0 && diagCol < this.dim) {
          x[diagRow][diagCol].class = "forbidden";
          diagRow--;
          diagCol++;
        }
      }

      // update squares where queens are
      for (i = 0; i < this.queens.length; i++) {
        queen = this.queens[i]

        x[queen.row][queen.col].class = "queen"
      }

      return x;
    }
  },
  methods: {
    reset: function() {
      this.queens = [];
    },
    undo: function() {
      this.queens.pop()
    },
    solve: function() {
    },
    squareClick: function(row, col) {
      var squareClass = this.squares[row][col].class;

      if (squareClass === "forbidden") {
        alert("Cannot place a queen here");
      } else if (squareClass === "empty") {
        // place new queen in this square
          this.queens.push({row:row, col:col});
      } else {
        // queen exists here, clicking on it removes it
        for (var i=0; i < this.queens.length; i++) {
          if (this.queens[i].row === row && this.queens[i].col == col) {
            this.queens.splice(i, 1);
            break;
          }
        }
      }
    }
  },
  watch: {
    dim: function() {
      this.reset()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.forbidden {
  background-image: url('../assets/forbidden.png') !important;
  background-repeat: no-repeat;
  background-size: cover;
  opacity: 0.8;
}

.queen {
  background-image: url('../assets/queen.png') !important;
  background-repeat: no-repeat;
  background-size: cover;
  opacity: 0.8;
}

.board {
  width: 95%;
  height: 80%;
  max-width: 80vh; 
  max-height: 100vw; 
  position: absolute;
}

table, td {
  border: 1px solid #d3ac8b;
  border-collapse: collapse;
  background-color: #d3ac8b;
}

tr:nth-child(odd) td:nth-child(even), tr:nth-child(even) td:nth-child(odd) {
	background-color: white;
}
</style>
