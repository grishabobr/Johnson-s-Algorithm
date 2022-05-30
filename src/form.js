import React, {useState, useRef} from 'react';
import { useAtom } from 'jotai';
import { graphAtom } from './atom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { johnsonAlgorithm } from './johnsonAlgrithm';

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
        edgesArr.push({
            from: value1,
            to: value2,
            label: value3,
            arrows: {
                to: {
                    enabled: true
                }
            },
            color: {
                color: '#4a5061',
                highlight: '#4a5061',
            }
        })

        const newData = [
            nodesArr,
            edgesArr
        ];
        setGr(newData);
        setValue1('');
        setValue2('');
        setValue3('');
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
                    align: 'center',
                    color:'white'
                },
                color: {
                    border: 'white',
                    background: 'rgb(80, 123, 229)',
                    highlight: {
                        border: '#23386b',
                        background: 'rgb(80, 123, 229)'
                    }
                }

            });
        }

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
                edgesArr.push({
                    from: p1,
                    to: p2,
                    label: p3,
                    arrows: {
                        to: {
                            enabled: true
                        }
                    },
                    color: {
                        color: '#4a5061',
                        highlight: '#4a5061',
                    }
                });
            }
            if (step>=value5.length) break;
        }
        const newData = [
            nodesArr,
            edgesArr
        ];
        setGr(newData);
        event.preventDefault();
    }

    const deleteEdges = () => {
        edgesArr = [];
        const newData = [
            nodesArr,
            edgesArr
        ];
        setGr(newData);
    }


    function Johnson(){
        setTable(johnsonAlgorithm(gr));
    }


   const [tableData, setTableData] = useState('');
   const [tableHeaderData, setTableHeaderData] = useState('');
   const [showTable, setShowTable] = useState(false);
   const [negativeCycle, setNegativeCycle] = useState(false);


    function setTable(result) {
        if (result) {
            const listItems = result.map((d, index) => <tr><td className='tableHeader'>{index+1}</td> {d.map((d1) => <td>{d1}</td>)}</tr>);
            const header = result.map((d, index) => <td className='tableHeader'>{index+1}</td>);
            setTableData(listItems);
            setTableHeaderData(header);
            setShowTable(true);
        }
        else setNegativeCycle(true);
    }


    return (
        <div className='form'>
            {negativeCycle
                ?<div className='formShow'>
                    <div className='errorCycle'>Ошибка: В графе присутствует отрицательный цикл.</div>
                    <button onClick = {
                            () => {
                                setNegativeCycle(false);
                            }
                        } className='btn btn-light'>Назад</button>
                </div>
                :!showTable
                    ?<div className='dd formShow'>
                        <div className='head'>Алгоритм Джонсона</div>
                        <form onSubmit={handleSubmit2} className='form1'>
                            <label>
                                Количество вершин:
                                <input className='inpEdge' type="text" value={value4} onChange={handleChange4} />
                            </label>
                            <input type="submit" value="Создать граф" className='btn btn-light'/>
                        </form>
                        <div className='form2'>
                            Добавить ребро:
                            <form className='fl2' onSubmit={handleSubmit}>
                                <label>
                                    Из:
                                    <input className='inpEdge' type="text" value={value1} onChange={handleChange1} />
                                    В:
                                    <input className='inpEdge' type="text" value={value2} onChange={handleChange2} />
                                    Вес:
                                    <input className='inpEdge' type="text" value={value3} onChange={handleChange3} />
                                </label>
                                <input type="submit" value="Добавить" className='btn btn-light hh'/>
                            </form>
                        </div>
                        
                        <button onClick={deleteEdges} className='btn btn-light'>Удалить все ребра</button>

                        <div className='form2 fl'>
                            Ввести ребра списком ([из] [в] [вес]):
                            <form onSubmit={handleSubmit3} className='form1 fl'>
                                <label className='fl'>
                                    <textarea className='inp' type="
                                    text " value={value5} onChange={handleChange5} />
                                </label>
                                <input type="submit" value="Добавить" className='btn btn-light'/>
                            </form>
                        </div>
                        <button onClick = {
                            () => {
                                Johnson();
                            }
                        } className='john btn btn-light'>Запустить алгоритм Джонсона</button>
                    </div>

                    :<div className='formShow'>
                        <table className='tableJ'>
                            <thead>
                                <tr>
                                    <td className='tableHeader'> </td>
                                    {tableHeaderData}
                                </tr>
                            </thead>
                            <tbody>
                                {tableData}
                            </tbody>
                        
                        </table>
                        <button onClick = {
                            () => {
                                setShowTable(false);
                            }
                        } className='btn btn-light'>Назад</button>
                    </div>
                
            }


            <div className='widther'></div>
        </div>
    );
}

