class BinaryPuzzle {
  constructor(grid) {
    this.size = grid.length;
    this.grid = [];

    if (this.size % 2 !== 0)
      throw new Error('Grid size must be even');

    // Populate grid with data
    for (let i = 0; i < this.size; i++) {
      if (!(grid instanceof Array))
        throw new Error('Data row must be an array');

      if (grid[i].length !== this.size)
        throw new Error('Data row must have same length as grid size');

      this.grid.push(grid[i]);
    }
  }

  // Check if solved
  solved() {
    // Every entry is 1 or 0
    const oneOrZero = this.rows.every(row => row.every(v => [0, 1].includes(v)));

    // Max 2 of the same number next to each other
    const onlyOneEqualNeighbor = [this.rows, this.columns].every(list =>
      list.every(entries =>
        entries.every((number, index) => !(number === entries[index - 1] && number === entries[index + 1]))
      )
    );

    // Each row/column has an equal amount of 1s and 0s 
    const equalAmountOfNum = [this.rows, this.columns].every(list =>
      list.every(entries => entries.reduce((x, y) => x + y) === this.size / 2)
    );

    // Row/column should be unique
    const allUnique = [this.rows, this.columns].every(list => {
      const stringArrays = list.map(entries => JSON.stringify(entries));
      return list.every((entries, index) =>
        !stringArrays.slice(index + 1).includes(JSON.stringify(entries))
      );
    });

    return oneOrZero && onlyOneEqualNeighbor && equalAmountOfNum && allUnique;
  }

  setEntry(x, y, num) {
    if ([x, y].some(v => v < 0 || v >= this.size))
      throw new Error(`X and Y must be in grid (0-${this.size - 1})`);

    if (![0, 1].includes(num))
      throw new Error('Number should be 1 or 0');

    this.grid[y][x % this.size] = num;
  }

  getEntry(x, y) {
    if ([x, y].some(v => v < 0 || v >= this.size))
      throw new Error(`X and Y must be in grid (0-${this.size - 1})`);

    return this.grid[y][x % this.size];
  }

  get rows() {
    return this.grid;
  }

  get columns() {
    const columns = [];
    for (let i = 0; i < this.grid.length; i++) {
      columns.push(this.grid.map(row => row[i]));
    }
    return columns;
  }

  get string() {
    return this.grid.map(list => list.map(v => v === null ? '.' : v).join(' ')).reduce((x, y) => `${x}${y}\n`, '');
  }
}

module.exports = BinaryPuzzle;
