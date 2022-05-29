function johnsonAlgorithm(graph) {
    console.log(graph)
    let BF = startBF(graph);
    let johnsonGraph = CalcNewWeights(BF);
    let paths = dejkstraForEach(johnsonGraph);
    let result = johnsonFinal(BF.h, paths);
    return result;
}


function startBF(graph) {
    let newGr = [];
    for (let i = 0; i < graph[1].length; i++) {
        newGr.push([graph[1][i].from, graph[1][i].to, graph[1][i].label].map(Number));
    }
    for (let i = 0; i < graph[0].length; i++) {
        newGr.push([graph[0].length + 1, i + 1, 0]);
    }

    return {
        h: BellmanFord(newGr, graph[0].length + 1, newGr.length, graph[0].length + 1),
        edges: newGr
    };
}


function BellmanFord(graph, V, E, src) {
    var dis = Array(V).fill(1000000000);
    dis[src] = 0;
    for (var i = 0; i < V - 1; i++) {
        for (var j = 0; j < E; j++) {
            if ((dis[graph[j][0]] + graph[j][2]) < dis[graph[j][1]])
                dis[graph[j][1]] = dis[graph[j][0]] + graph[j][2];
        }
    }
    for (var i = 0; i < E; i++) {
        var x = graph[i][0];
        var y = graph[i][1];
        var weight = graph[i][2];
        if ((dis[x] != 1000000000) && (dis[x] + weight < dis[y])) console.log("Graph contains negative weight cycle");
    }
    return dis;
}


function CalcNewWeights(BF) {
    let newWeights = {
        n: BF.edges[BF.edges.length - 1][0] - 1,
        graph: []
    };
    for (let i = 0; i < BF.edges.length - newWeights.n; i++) {
        newWeights.graph.push([BF.edges[i][0], BF.edges[i][1], BF.edges[i][2] + (BF.h[BF.edges[i][0]] - BF.h[BF.edges[i][1]])]);
    }
    return newWeights;
}


function dejkstraForEach(graph) {
    let n = graph.n;
    let edges = graph.graph;

    edges = matrixFromEdges(edges, n);

    let matrix = [];
    for (let i = 0; i < n; i++) matrix.push(dejkstra(edges, i));
    return matrix;
}

function matrixFromEdges(edges, n) {
    let arr = new Array(n).fill(0).map(() => new Array(n).fill(-1))
    for (let i = 0; i < edges.length; i++) {
        arr[edges[i][0] - 1][edges[i][1] - 1] = edges[i][2];
    }
    return arr;
}

function dejkstra(arr, s) {

    let d = new Array(arr.length).fill(1000000);
    let used = new Array(arr.length).fill(false);

    d[s] = 0;

    for (let i = 0; i < arr.length; i++) {
        let v = null;
        for (let j = 0; j < arr.length; j++) {

            if (!used[j] && (v === null || d[j] < d[v])) v = j;

        }
        if (d[v] == 1000000) break;
        used[v] = true;

        for (let k = 0; k < arr.length; k++) {
            if (arr[v][k] >= 0 && d[v] + arr[v][k] < d[k]) d[k] = d[v] + arr[v][k];
        }
    }
    return d;
}

function johnsonFinal(h, newMatrix) {
    for (let i = 0; i < newMatrix.length; i++) {
        for (let j = 0; j < newMatrix.length; j++) {
            if (newMatrix[i][j] != 1000000) newMatrix[i][j] += (-h[i + 1] + h[j + 1]);
            else newMatrix[i][j] = '✕';
        }
    }
    return newMatrix;
}


module.exports = { johnsonAlgorithm };