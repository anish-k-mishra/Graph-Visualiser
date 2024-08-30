export function astar(grid, startNode, finishNode) {
    const visitedNodesInOrder = [];
    const unvisitedNodes = getAllNodes(grid);
    startNode.distance = 0;
    startNode.heuristic = heuristic(startNode, finishNode);
    startNode.totalCost = startNode.heuristic;
  
    while (unvisitedNodes.length) {
      sortNodesByTotalCost(unvisitedNodes);
      const closestNode = unvisitedNodes.shift();
  
      if (closestNode.isWall) continue;
      if (closestNode.distance === Infinity) return visitedNodesInOrder;
      closestNode.isVisited = true;
      visitedNodesInOrder.push(closestNode);
      if (closestNode === finishNode) return visitedNodesInOrder;
      updateUnvisitedNeighbors(closestNode, grid, finishNode);
    }
  }
  
  function heuristic(nodeA, nodeB) {
    return Math.abs(nodeA.row - nodeB.row) + Math.abs(nodeA.col - nodeB.col);
  }
  
  function sortNodesByTotalCost(unvisitedNodes) {
    unvisitedNodes.sort((nodeA, nodeB) => nodeA.totalCost - nodeB.totalCost);
  }
  
  function updateUnvisitedNeighbors(node, grid, finishNode) {
    const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
    for (const neighbor of unvisitedNeighbors) {
      const newDistance = node.distance + 1;
      if (newDistance < neighbor.distance) {
        neighbor.distance = newDistance;
        neighbor.heuristic = heuristic(neighbor, finishNode);
        neighbor.totalCost = neighbor.distance + neighbor.heuristic;
        neighbor.previousNode = node;
      }
    }
  }
  // Helper function to get all nodes in the grid
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
  