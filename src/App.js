import logo from './logo.svg';
import './App.css';
import VisNetwork from './graph.js'
import { useAtom } from 'jotai';
import { graphAtom } from './atom';

import {NameForm} from './form.js'
import { DataSet, Network} from 'vis-network/standalone/esm/vis-network';






function App() {

  return (
    <div className="App">
      <div className='Layout'>
        <NameForm/>
        <div className='aua'><VisNetwork className="vis"></VisNetwork></div>
      </div>
    </div>
  );
}

export default App;
