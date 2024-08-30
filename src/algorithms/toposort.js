// topologicalSort.js

export function topologicalSort(grid) {
    const nodes = getAllNodes(grid);
    const inDegree = {};
    const stack = [];
    const result = [];
  
    // Initialize in-degrees
    nodes.forEach(node => {
      inDegree[node.id] = 0;
    });
  
    // Compute in-degrees
    nodes.forEach(node => {
      getUnvisitedNeighbors(node, grid).forEach(neighbor => {
        inDegree[neighbor.id] = (inDegree[neighbor.id] || 0) + 1;
      });
    });
  
    // Add nodes with zero in-degrees to stack
    nodes.forEach(node => {
      if (inDegree[node.id] === 0) {
        stack.push(node);
      }
    });
  
    // Process nodes
    while (stack.length > 0) {
      const node = stack.pop();
      result.push(node);
  
      getUnvisitedNeighbors(node, grid).forEach(neighbor => {
        inDegree[neighbor.id]--;
        if (inDegree[neighbor.id] === 0) {
          stack.push(neighbor);
        }
      });
    }
  
    // Check if there was a cycle
    if (result.length !== nodes.length) {
      console.error("Graph contains a cycle");
      return [];
    }
  
    return result;
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
  