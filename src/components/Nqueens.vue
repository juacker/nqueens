<template>
  <div>
    <b-navbar :close-on-click="false">
      <template slot="brand">
        <b-navbar-item>
          <img src="../assets/logo.png" >
          <strong>N-queens</strong>
        </b-navbar-item>
      </template>
      <template slot="start">
        <b-navbar-item tag="div">
          <div class="buttons">
            <b-numberinput controls-position="compact" size="is_small" v-model="dim" min=2 max=12 :editable="false" type="is-light" />
            <b-button type="button" @click="reset" size="is_small" icon-left="delete" title="reset">Reset</b-button>
            <b-button type="button" @click="undo" size="is_small" icon-left="undo" title="undo">Undo</b-button>
            <b-button type="button" @click="solve" size="is_small" icon-left="help" title="solve">Solve</b-button>
          </div>
        </b-navbar-item>
      </template>
    </b-navbar>
    <div class="hero is-fullheight">
      <b-field >
        <b-button v-if="solutions.length>0" @click="prevSolution" :disabled="solution==0" icon-left="arrow-left" />
        <b-button v-if="solutions.length>0" @click="nextSolution" :disabled="solution==solutions.length-1" icon-left="arrow-right" />
        <p v-if="solutions.length>0">
          showing solution {{solution+1}} of {{solutions.length}}
        </p>
      </b-field>
      <div class="hero-body" style="{align-items:'flex-start'}">
        <table class="board">
          <tr v-for="(row,i) in squares" :key="i" class="row">
            <td v-for="(square,j) in row" :key="j" :class="square" @click="squareClick(i,j)"/>
          </tr>
        </table>
      </div>
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
      solutions: [],
      solution: 0,
    }
  },
  computed: {
    squares: function() {
      var x = new Array(this.dim);

      // initialize board
      for (var i = 0; i < this.dim; i++) {
        x[i] = new Array(this.dim);
        for (var j = 0; j < this.dim; j++) {
          x[i][j] = "empty"
        }
      }

      // update squares reached by queens
      for (i = 0; i < this.queens.length; i++) {
        var queen = this.queens[i]

        // columns
        for (var col = 0; col < this.dim; col++) {
          x[queen.row][col] = "forbidden"
        }

        // rows
        for (var row = 0; row < this.dim; row++) {
          x[row][queen.col] = "forbidden"
        }

        // diagonals
        // top left diagonal
        var diagRow = queen.row - 1;
        var diagCol = queen.col - 1;
        while (diagRow >= 0 && diagCol >= 0) {
          x[diagRow][diagCol] = "forbidden";
          diagRow--;
          diagCol--;
        }

        // top right diagonal
        diagRow = queen.row + 1;
        diagCol = queen.col + 1;
        while (diagRow < this.dim && diagCol < this.dim) {
          x[diagRow][diagCol] = "forbidden";
          diagRow++;
          diagCol++;
        }

        // bottom left diagonal
        diagRow = queen.row + 1;
        diagCol = queen.col - 1;
        while (diagRow < this.dim && diagCol >= 0) {
          x[diagRow][diagCol] = "forbidden";
          diagRow++;
          diagCol--;
        }

        // bottom right diagonal
        diagRow = queen.row - 1;
        diagCol = queen.col + 1;
        while (diagRow >= 0 && diagCol < this.dim) {
          x[diagRow][diagCol] = "forbidden";
          diagRow--;
          diagCol++;
        }
      }

      // update squares where queens are
      for (i = 0; i < this.queens.length; i++) {
        queen = this.queens[i]
        x[queen.row][queen.col] = "queen"
      }

      // check if user has solved the problem
      if (this.solutions.length == 0 && this.queens.length == this.dim) {
        var reachedSquares = 0;
        for (i = 0; i < this.dim; i++) {
          for (j = 0; j < this.dim; j++) {
              if (x[i][j] != "empty") {
                reachedSquares++;
              }
          }
        }
        if (reachedSquares == this.dim**2) {
          this.$buefy.notification.open({
            duration: 5000,
            message: "Congratulations! you solved the N-queens problem",
            position: 'is-bottom-right',
            type: 'is-success',
            hasIcon: true
          })
        }
      }

      return x;
    }
  },
  methods: {
    nextSolution: function() {
      if (this.solution<this.solutions.length-1) {
          this.solution++;
      }
    },
    prevSolution: function() {
      if (this.solution>0) {
          this.solution--;
      }
    },
    reset: function() {
      this.queens = [];
      this.solutions = [];
      this.solution = 0;
    },
    undo: function() {
      this.queens.pop()
    },
    solve: function() {
      this.reset()

      var colPlacement = new Array(this.dim).fill(0);

      var solveNQueens = (row) => {
          if (row == this.dim) {
            // all queens are well placed, add solution
            this.solutions.push(colPlacement.map(v => {
                return v
            }))
            return
          }
          for (var col=0; col<this.dim; col++) {
              // for each placed queen, check if they are reaching the col position
              if (colPlacement.every((c, r) => {
                  if (r >= row) {
                      return true
                  }
                  return [0, row-r].indexOf(Math.abs(c-col)) < 0
              })) {
                // position not reached, place queen in this col for this row
                colPlacement[row] = col
                // calculate queen position for the next row
                solveNQueens(row + 1)
              }
          }
      }

      solveNQueens(0);

      if (this.solutions.length == 0) {
          this.$buefy.notification.open({
            duration: 5000,
            message: `no solution found for `+this.dim+`x`+this.dim+` board`,
            position: 'is-bottom-right',
            type: 'is-light',
            hasIcon: true
          })
          return
      } else {
          this.$buefy.notification.open({
            duration: 5000,
            message: this.solutions.length+` solutions found, click on the arrow to see them all`,
            position: 'is-bottom-right',
            type: 'is-success',
            hasIcon: true
          })
      }

      // show first solution
      this.queens = this.solutions[0].map((i,v) => {
        return {row: i, col: v}
      })
    },
    squareClick: function(row, col) {
      var squareClass = this.squares[row][col];

      if (squareClass === "forbidden") {
        this.$buefy.notification.open({
          duration: 5000,
          message: `Cannot place a queen here`,
          position: 'is-bottom-right',
          type: 'is-danger',
          hasIcon: true
        })
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
      // clear board if dimension changes
      this.reset()
    },
    solution: function(val) {
      if (val >= 0 && val < this.solutions.length) {
        this.queens = this.solutions[val].map((i,v) => {
          return {row: i, col: v}
        })
      }
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
  width: 90%;
  height: 70%;
  max-width: 80vh; 
  max-height: 80vw; 
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
