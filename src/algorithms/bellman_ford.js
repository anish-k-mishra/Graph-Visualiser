// bellmanFord.js

export function bellmanFord(grid, startNode, finishNode) {
    const visitedNodesInOrder = [];
    const allNodes = getAllNodes(grid);
  
    // Initialize distances
    allNodes.forEach(node => {
      node.distance = Infinity;
      node.previousNode = null;
    });
  
    startNode.distance = 0;
  
    // Relax edges up to V-1 times (where V is the number of vertices)
    for (let i = 0; i < allNodes.length - 1; i++) {
      allNodes.forEach(node => {
        if (node.isWall) return;
        updateNeighbors(node, grid);
      });
    }
  
    // Check for negative weight cycles
    allNodes.forEach(node => {
      if (node.isWall) return;
      const neighbors = getUnvisitedNeighbors(node, grid);
      neighbors.forEach(neighbor => {
        if (node.distance + 1 < neighbor.distance) {
          // Negative weight cycle detected
          console.error("Graph contains a negative weight cycle");
        }
      });
    });
  
    // Build the path to the finishNode
    let currentNode = finishNode;
    while (currentNode) {
      visitedNodesInOrder.unshift(currentNode);
      currentNode = currentNode.previousNode;
    }
  
    return visitedNodesInOrder;
  }
  
  function updateNeighbors(node, grid) {
    const neighbors = getUnvisitedNeighbors(node, grid);
    neighbors.forEach(neighbor => {
      if (node.distance + 1 < neighbor.distance) {
        neighbor.distance = node.distance + 1;
        neighbor.previousNode = node;
      }
    });
  }
  export function getAllNodes(grid) {
    const nodes = [];
    for (const row of grid) {
      for (const node of row) {
        nodes.push(node);
      }
    }
    return nodes;
  }
  
  // Helper function to get unvisited neighbors of a node
  export function getUnvisitedNeighbors(node, grid) {
    const neighbors = [];
    const { col, row } = node;
  
    // Check neighboring nodes
    if (row > 0) neighbors.push(grid[row - 1][col]); // Top
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]); // Bottom
    if (col > 0) neighbors.push(grid[row][col - 1]); // Left
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]); // Right
  
    // Filter out visited nodes
    return neighbors.filter(neighbor => !neighbor.isVisited);
  }
  
  
  // Reuse getAllNodes and getUnvisitedNeighbors from previous implementations
  