import React, { useEffect, useRef } from 'react';
import { DataSet, Network} from 'vis-network/standalone/esm/vis-network';

import { useAtom } from 'jotai';
import { graphAtom } from './atom';



const VisNetwork = () => {

  const [gr, setGr] = useAtom(graphAtom);
  // A reference to the div rendered by this component
  const domNode = useRef(null);

  // A reference to the vis network instance
  const network = useRef(null);

  // An array of nodes
  

  

  const options = {height: "754px"};

  useEffect(
    () => {
      const nodes = new DataSet(gr[0]);
      const edges = new DataSet(gr[1]);
      
      const data = {nodes, edges}

      network.current = new Network(domNode.current, data, options);
      

    },
    [domNode, network, gr, options]
  );

  return (
    <div ref = { domNode } />
  );
};

export default VisNetwork;