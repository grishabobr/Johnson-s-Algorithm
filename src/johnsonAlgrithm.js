import PriorityQueue from "js-priority-queue";

export default function johnsonAlgorithm(graph) {
    let BF = startBF(graph);
    if (!BF) return false;
    let johnsonGraph = CalcNewWeights(BF);
    let paths = dijkstraForEach(johnsonGraph);
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
    let BFres = BellmanFord(newGr, graph[0].length + 1, newGr.length, graph[0].length + 1);
    if (BFres){
        return {
            h: BFres,
            edges: newGr
        };
    }
    else return false;
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
        if ((dis[x] != 1000000000) && (dis[x] + weight < dis[y])) dis=false;
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


function dijkstraForEach(graph) {
    let n = graph.n;
    let edges = graph.graph;
    let matrix = [];
    for (let i = 0; i < n; i++) matrix.push(dijkstra(pairsFromEdges(edges, n), i, n));
    return matrix;
}

function pairsFromEdges(edges, n) {
    let arr = new Array(n).fill(0).map(() => new Array())
    for (let i=0;i<edges.length;i++){
        arr[edges[i][0]-1].push([edges[i][1]-1, edges[i][2]]);
    }
    return arr;
}

function dijkstra(arr, s, n) {
    let d = new Array(n).fill(1000000);
    d[s]=0;
    
    var q = new PriorityQueue({
        comparator: function (a, b) {
            return b[0] - a[0];
        }
    });
    q.queue([0, s]);
    while (q.length!=0) {
        let v = q.peek()[1];
        let cur_d = -q.peek()[0];
        q.dequeue();
        if (cur_d > d[v]) continue;

        for (let j=0; j<arr[v].length; j++){
            let to = arr[v][j][0];
            let len = arr[v][j][1];
            if (d[v] + len < d[to]) {
                d[to] = d[v] + len;
                //p[to] = v;
                q.queue([-d[to], to]);
            }
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
