import React, {useState} from 'react';
import { useAtom } from 'jotai';
import { graphAtom } from './atom';
import { DataSet, Network} from 'vis-network/standalone/esm/vis-network';

var nodesArr = [];
var edgesArr = [];



export function NameForm(props) {

    

    const [value1,setValue1] = useState('');
    const [value2,setValue2] = useState('');
    const [value3,setValue3] = useState('');
    const [value4,setValue4] = useState('');
    const [value5,setValue5] = useState('');
  
    const [gr, setGr] = useAtom(graphAtom);

    const handleChange1 = (event) => {
        setValue1(event.target.value)
    }
    const handleChange2 = (event) => {
        setValue2(event.target.value)
    }
    const handleChange3 = (event) => {
        setValue3(event.target.value)
    }
    const handleChange4 = (event) => {
        setValue4(event.target.value)
    }
    const handleChange5 = (event) => {
        setValue5(event.target.value)
    }

    const handleSubmit = (event) => {
        edgesArr.push({from: value1, to: value2, label: value3, arrows:{to:{enabled:true}}})

        var nodes = new DataSet(nodesArr);

        var edges = new DataSet(edgesArr);

        const newData = [
            nodesArr,
            edgesArr
        ];
        setGr(newData);
        event.preventDefault();
    }

    const handleSubmit2 = (event) => {
        nodesArr = [];
        for (let i=1; i<=value4; i++){
            nodesArr.push({
                id: i,
                label: i.toString(),
                borderWidth: 1,
                shape: 'circle',
                font: {
                    align: 'center'
                }
            });
        }
        var nodes = new DataSet(nodesArr);

        var edges = new DataSet(edgesArr);
        const newData = [
            nodesArr,
            edgesArr
        ];
        setGr(newData);
        event.preventDefault();
    }

    const handleSubmit3 = (event) => {
        edgesArr=[];
        let step=0;
        let i=0;
        let p1, p2, p3 = 0;
        while (true) {
            let curValue='';
            while (value5[step]!=' ' && value5[step]!='\n'  && step<value5.length){
                
                curValue+=value5[step];
                step++;
            }
            step++;
            i++;
            if (i%3==1){
                p1=curValue;
            }
            if (i%3==2){
                p2=curValue;
            }
            if (i%3==0){
                p3=curValue;
                edgesArr.push({from: p1, to: p2, label: p3, arrows:{to:{enabled:true}}});
            }
            if (step>=value5.length) break;
        }
        var nodes = new DataSet(nodesArr);
        var edges = new DataSet(edgesArr);
        const newData = [
            nodesArr,
            edgesArr
        ];
        setGr(newData);
        event.preventDefault();
    }

    const deleteEdges = () => {
        edgesArr = [];
        var nodes = new DataSet(nodesArr);

        var edges = new DataSet(edgesArr);
        const newData = [
            nodesArr,
            edgesArr
        ];
        setGr(newData);
    }


    



    function Johnson(){
        let BF = startBF();
        let johnsonGraph = CalcNewWeights(BF);
        let paths = dejkstraForEach(johnsonGraph);
        let oldMatrix = matrixFromEdges(BF.edges, BF.h.length);
        let result = johnsonFinal(BF.h, paths);
        console.log('RESULT:', result);

    }



    function johnsonFinal(h, newMatrix) {
        for (let i = 0; i<newMatrix.length; i++){
            for (let j = 0; j < newMatrix.length; j++) {
                if (newMatrix[i][j] != 1000000) newMatrix[i][j]+=(-h[i+1]+h[j+1]);
                else newMatrix[i][j] = 'X';
            }
        }
        return newMatrix;
    }




    function dejkstraForEach(graph){
        let n = graph.n;
        let edges = graph.graph;
        
        edges = matrixFromEdges(edges, n);

        let matrix = [];
        for (let i=0; i<n; i++) matrix.push(dejkstra(edges, i));
        return matrix;
    }

    function dejkstra(arr, s) {

        let d = new Array(arr.length).fill(1000000);
        let used = new Array(arr.length).fill(false);

        d[s]=0;

        for (let i=0; i< arr.length; i++){
            let v = null;
            for (let j = 0; j < arr.length; j++) {
                
                if (!used[j] && (v === null || d[j] < d[v])) v = j;
                
            }
            if (d[v] == 1000000) break;
            used[v] = true;

            //console.log('used',!used[j]);

            for (let k = 0; k < arr.length; k++) {
                if (arr[v][k] >= 0 && d[v] + arr[v][k] < d[k]) d[k] = d[v] + arr[v][k];
            }
        }
        return d;
    }


    function matrixFromEdges(edges, n){
        let arr = new Array(n).fill(0).map(() => new Array(n).fill(-1))
        for (let i = 0; i < edges.length; i++) {
            arr[edges[i][0] - 1][edges[i][1] - 1] = edges[i][2];
        }
        return arr;
    }




    function CalcNewWeights(BF){
        let newWeights = {
            n: BF.edges[BF.edges.length - 1][0]-1,
            graph: []
        };
        for (let i = 0; i < BF.edges.length - BF.edges[BF.edges.length - 1][0] + 1; i++) {
            newWeights.graph.push([BF.edges[i][0], BF.edges[i][1], BF.edges[i][2] + (BF.h[BF.edges[i][0]] - BF.h[BF.edges[i][1]])]);
            
        }
        return newWeights;
    }


    function startBF(){
        let newGr = [];
        for (let i=0; i<gr[1].length; i++){
            newGr.push([gr[1][i].from, gr[1][i].to, gr[1][i].label].map(Number));
        }
        for (let i = 0; i < gr[0].length; i++) {
            newGr.push([gr[0].length+1, i+1, 0]);
        }

        return {h: BellmanFord(newGr, gr[0].length+1, newGr.length, gr[0].length + 1), edges: newGr};
    }

    

    function BellmanFord(graph, V, E, src) {

        // Initialize distance of all vertices as infinite.
        var dis = Array(V).fill(1000000000);

        // initialize distance of source as 0
        dis[src] = 0;

        // Relax all edges |V| - 1 times. A simple
        // shortest path from src to any other
        // vertex can have at-most |V| - 1 edges
        for (var i = 0; i < V - 1; i++) {
            for (var j = 0; j < E; j++) {
                if ((dis[graph[j][0]] + graph[j][2]) < dis[graph[j][1]])
                    dis[graph[j][1]] = dis[graph[j][0]] + graph[j][2];
            }
        }

        // check for negative-weight cycles.
        // The above step guarantees shortest
        // distances if graph doesn't contain
        // negative weight cycle. If we get a
        // shorter path, then there is a cycle.
        for (var i = 0; i < E; i++) {
            var x = graph[i][0];
            var y = graph[i][1];
            var weight = graph[i][2];
            if ((dis[x] != 1000000000) &&
                (dis[x] + weight < dis[y]))
                console.log("Graph contains negative" +
                    " weight cycle");
        }

        // console.log("Vertex Distance from Source");
        // for (var i = 0; i < V; i++)
        //     console.log(i + "   " + dis[i]);
        return dis;
    }
    
















  
    return (
        <div className='form'>
            <form onSubmit={handleSubmit2}>
                <label>
                    Number of Nodes:
                    <input className='inpEdge' type="text" value={value4} onChange={handleChange4} />
                </label>
                <input type="submit" value="Create graph" />
            </form>
            Add new Edge:
            <form onSubmit={handleSubmit}>
                <label>
                    From:
                    <input className='inpEdge' type="text" value={value1} onChange={handleChange1} />
                    To:
                    <input className='inpEdge' type="text" value={value2} onChange={handleChange2} />
                    Weight:
                    <input className='inpEdge' type="text" value={value3} onChange={handleChange3} />
                </label>
                <input type="submit" value="Add" />
            </form>
            
            <button onClick={deleteEdges}>Delete all edges</button>
            <div>
                List: 
                <form onSubmit={handleSubmit3}>
                    <label>
                        <textarea className='inp' type="text" value={value5} onChange={handleChange5} />
                    </label>
                    <input type="submit" value="Submit" />
                </form>
            </div>
            <button onClick = {
                () => {
                    Johnson();
                }
            } > JohnsonAlg </button>
        </div>
    );
}

