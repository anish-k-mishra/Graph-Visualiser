import React, { Component } from 'react';
import Node from './node/node';
import { dijkstra, getNodesInShortestPathOrder } from '../algorithms/dijkstra.js';
import { bfs } from '../algorithms/bfs.js';
import { dfs } from '../algorithms/dfs.js';
import { astar } from '../algorithms/a_star.js';
import { bellmanFord } from '../algorithms/bellman_ford.js';
import { topologicalSort } from '../algorithms/toposort.js';
import { TextField } from '@mui/material';

import './pathfindervisualizer.css';

export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
      selectedAlgorithm: 'Dijkstra', 
      startNodeRow: 10,  // Default values for start node
      startNodeCol: 15,
      finishNodeRow: 10, // Default values for finish node
      finishNodeCol: 35,
    };
  }

  componentDidMount() {
    const grid = getInitialGrid(this.state.startNodeRow, this.state.startNodeCol, this.state.finishNodeRow, this.state.finishNodeCol);
    this.setState({ grid });
  }

  handleMouseDown(row, col) {
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid, mouseIsPressed: true });
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid });
  }

  handleMouseUp() {
    this.setState({ mouseIsPressed: false });
  }

  handleInputChange(event, coordinate) {
    this.setState({ [coordinate]: parseInt(event.target.value) });
  }

  animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited';
      }, 10 * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-shortest-path';
      }, 50 * i);
    }
  }

  visualize() {
    const { grid, selectedAlgorithm, startNodeRow, startNodeCol, finishNodeRow, finishNodeCol } = this.state;
    const startNode = grid[startNodeRow][startNodeCol];
    const finishNode = grid[finishNodeRow][finishNodeCol];
    let visitedNodesInOrder;
    
    if (selectedAlgorithm === 'Dijkstra') {
      visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    } else if (selectedAlgorithm === 'BFS') {
      visitedNodesInOrder = bfs(grid, startNode, finishNode);
    } else if (selectedAlgorithm === 'DFS') {
      visitedNodesInOrder = dfs(grid, startNode, finishNode);
    } else if (selectedAlgorithm === 'A*') {
      visitedNodesInOrder = astar(grid, startNode, finishNode);
    } else if (selectedAlgorithm === 'BellmanFord') {
      visitedNodesInOrder = bellmanFord(grid, startNode, finishNode);
    } else if (selectedAlgorithm === 'Topological Sort') {
      visitedNodesInOrder = topologicalSort(grid, startNode, finishNode);
    }

    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);
  }
  
  handleAlgorithmChange = (event) => {
    this.setState({ selectedAlgorithm: event.target.value });
  };

  render() {
    const { grid, mouseIsPressed, startNodeRow, startNodeCol, finishNodeRow, finishNodeCol } = this.state;
  
    return (
      <div className="container">
        <div className="controls">
          <div className="coordinate-inputs">
            
              
          <TextField
          id="outlined-basic"
          label="Start Node Row"
          variant="outlined"
          type="number"
          value={startNodeRow}
          onChange={(e) => this.handleInputChange(e, 'startNodeRow')}
        />

        <TextField
          id="outlined-basic"
          label="Start Node Col"
          variant="outlined"
          type="number"
          value={startNodeCol}
          onChange={(e) => this.handleInputChange(e, 'startNodeCol')}
        />

<TextField
          id="outlined-basic"
          label="Finish Node Row"
          variant="outlined"
          type="number"
          value={finishNodeRow}
          onChange={(e) => this.handleInputChange(e, 'finishNodeRow')}
        />
           <TextField
           
          id="outlined-basic"
          label="Finish Node Row"
          variant="outlined"
          type="number"
          value={finishNodeCol}
          onChange={(e) => this.handleInputChange(e, 'finishNodeCol')}
        />
          </div>
          
        </div>
        <div id='controls2'>
          <select
            value={this.state.selectedAlgorithm}
            onChange={this.handleAlgorithmChange}
          >
            <option value="Dijkstra">Dijkstra's Algorithm</option>
            <option value="BFS">BFS Algorithm</option>
            <option value="DFS">DFS Algorithm</option>
            <option value="A*">A* Algorithm</option>
            <option value="BellmanFord">BellmanFord Algorithm</option>
            <option value="Topological Sort">Topological Sort</option>
          </select>
          <button onClick={() => this.visualize()}>
            Visualize {this.state.selectedAlgorithm}
          </button>
        </div>
        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx} className="row">
                {row.map((node, nodeIdx) => {
                  const { row, col, isFinish, isStart, isWall } = node;
                  const extraClassName = isFinish
                    ? 'node-finish'
                    : isStart
                    ? 'node-start'
                    : isWall
                    ? 'node-wall'
                    : '';
  
                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) => this.handleMouseEnter(row, col)}
                      onMouseUp={() => this.handleMouseUp()}
                      row={row}
                      extraClassName={extraClassName}
                    ></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

const getInitialGrid = (startNodeRow, startNodeCol, finishNodeRow, finishNodeCol) => {
  const grid = [];
  for (let row = 0; row < 20; row++) {
    const currentRow = [];
    for (let col = 0; col < 50; col++) {
      currentRow.push(createNode(col, row, startNodeRow, startNodeCol, finishNodeRow, finishNodeCol));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (col, row, startNodeRow, startNodeCol, finishNodeRow, finishNodeCol) => {
  return {
    col,
    row,
    isStart: row === startNodeRow && col === startNodeCol,
    isFinish: row === finishNodeRow && col === finishNodeCol,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
};

const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};
