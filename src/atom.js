import { atom } from 'jotai'
import { DataSet, Network} from 'vis-network/standalone/esm/vis-network';

var nodes = [];

    var edges = [];

  const data = [
    nodes,
    edges
  ];


export const graphAtom = atom(data)