// Puzzle grid goes here, a dot indicates an empty cell
// Solving hard 14x14 puzzles can take more than 100 seconds
// Puzzles must have an answer for this to work (duh)
// Simple 6x6 puzzles can be solved within 0.5s (0.15s on a Surface Pro 2017 with i5)
// This solver is O(n^2)
// To see solving process un-comment 'console.log(puzzle.string);'' in the while loop
const puzzleGrid = `
....0.00..
..11......
.....1....
1......0..
...00..0..
0..0......
..1.......
.0...00..1
......0...
...1.1...1
`;

const BinaryPuzzle = require('./BinaryPuzzle');
const puzzle = new BinaryPuzzle(
  puzzleGrid.split('\n').filter(v => v).map(row => [...row].map(v => v === '.' ? null : parseInt(v)))
);

console.log(`Solving ${puzzle.size}x${puzzle.size} Binary Puzzle\n`);
console.log(puzzle.string);

while (!puzzle.solved()) {
  // Loop through every entry and solve
  for (let y = 0; y < puzzle.size; y++) {
    const emptySpots = puzzle.rows[y].filter(v => v === null).length;
    if (!emptySpots) continue;

    // Get all row possibilitities
    const rowPossibilities = getRowPossibilities(puzzle.rows, y);
    // Only 1 possible row? Fill whole row
    if (rowPossibilities.length === 1) {
      rowPossibilities[0].forEach((v, x) => {
        puzzle.setEntry(x, y, v);
      });
      // console.log(puzzle.string);
      continue;
    }

    for (let x = 0; x < puzzle.size; x++) {
      // Get all column possibilities
      const columnPossibilities = getRowPossibilities(puzzle.columns, x);
      // Only 1 possible column? Fill whole column
      if (columnPossibilities.length === 1) {
        columnPossibilities[0].forEach((v, y) => {
          puzzle.setEntry(x, y, v);
        });
        // console.log(puzzle.string);
        continue;
      }
      const columnNumsOnCoord = [...new Set(columnPossibilities.map(v => v[y]))];
      const rowNumsOnCoord = [...new Set(rowPossibilities.map(v => v[x]))];
      // Only one possible number on this coordinate? Fill it
      if (columnNumsOnCoord.length === 1) {
        puzzle.setEntry(x, y, columnNumsOnCoord[0]);
        // console.log(puzzle.string);
        continue;
      } else if (rowNumsOnCoord.length === 1) {
        puzzle.setEntry(x, y, rowNumsOnCoord[0]);
        // console.log(puzzle.string);
        continue;
      }
    }
  }
}

// This function is very slow (it creates every binary combination for X bits and filters invalid ones out)
// Please email me if you know a better solution than this (timvandamcs@gmail.com). I couldn't come up with one
function getRowPossibilities(list, index) {
  const row = list[index];
  const possibilities = [];
  // Get max int (row.length bits) in decimal. Loop and add valid rows
  const maxInt = 2 ** row.length - 1; // same as parseInt('1'.repeat(row.length), 2);
  for (let i = 0; i < maxInt; i++) {
    const posRow = i.toString(2).split('').map(v => parseInt(v));
    const missingNums = list.length - posRow.length;
    posRow.unshift(...Array(missingNums).fill(0));
    const presentNums = row.filter(v => v !== null).length;
    const matchingNums = row.filter((v, index) => v !== null && v === posRow[index]).length;
    const matches = matchingNums === presentNums;
    if (matches && isValidRow(posRow)) {
      const unique = !list.filter(v => JSON.stringify(v) === JSON.stringify(posRow)).length &&
        !possibilities.filter(v => JSON.stringify(v) === JSON.stringify(posRow)).length;
      if (unique) possibilities.push(posRow);
    }
  }
  return possibilities;
}

// Enforce Binary Puzzle rules
function isValidRow(row) {
  const oneOrZero = row.every(v => [0, 1].includes(v));
  const noTriplet = row.every((v, i) => !(v === row[i - 1] && v === row[i + 1]));
  const equalAmountOfNum = row.reduce((x, y) => x + y) === row.length / 2;
  return oneOrZero && noTriplet && equalAmountOfNum;
}

console.log(Array(puzzle.size * 2).fill('-').join('') + '\n');
console.log('Binary Puzzle solved.\n');
console.log(puzzle.string);

/*
The code below can be pasted in the console on binarypuzzle.com to instantly get a formatted binary puzzle
-
size = Math.sqrt(document.querySelectorAll('.puzzlecel').length);
puzzle = '\n';
for (var i = 1; i <= size; i++) {
  for (var j = 1; j <= size; j++) {
    var p = document.querySelector('#celpar_' + i + '_' + j).innerText.trim();
    puzzle += isNaN(parseInt(p)) ? '.' : p; 
  }
  puzzle += '\n';
}
*/
