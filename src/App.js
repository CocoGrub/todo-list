import React, {useReducer, useState} from 'react';
import './App.css';

function App() {

    const initialState = {
        allTodos: [{id: Date.now().toLocaleString(), text: 'drink coffee',complete:true}],
        uncompleted:[],
        completed:[],
        filter: 'all',
        search: ''

 }
    function reducer(state, action) {
        switch (action.type) {
            case "add":
                return {...state,allTodos:[...state.allTodos,action.payload]}
            case "del":
                return {...state,allTodos:[...state.allTodos.filter((x) => x.id !== action.payload)]}
            case "filter":return {...state,filterState:[...state.allTodos.filter((x)=>x.text.includes(action.payload))]}
            case "complete":return {...state,allTodos:[...state.allTodos.map((x)=>{
                if(x.id===action.payload) {
                    const z={...x}
                    z.complete = !x.complete;
                    return z
                }
return x
                })]}
            case 'showUnCompleted':return {...state,filterState: [...state.allTodos.filter((x)=>x.complete===false)]}
            case 'showUnCompletedAndFiltered':return {...state,filterState: [...state.allTodos.filter((x)=>x.complete===false)]}
            case 'filterCompleted':return {...state,filterState: [...state.filterState.filter((x)=>x.text.includes(action.payload))]}
            case 'all':return {...state,filter:state.filter='all'}
            case 'done':return {...state,filter:state.filter='done'}
            case 'active':return {...state,filter:state.filter='active'}
            default:
                return state
        }
    }

    const [state, dispatch] = useReducer(reducer, initialState)
    const [addTodoInput, changeAddTodoInput] = useState("")
    const [searchInput, changeSearchInput] = useState("")
    const [currentState, changeCurrentState] = useState("mainState")
    const handleChange = (x) => {
        changeAddTodoInput(x.target.value)
    }
    const handleSubmit = (x) => {
        const todo = {
            id: Date.now().toLocaleString(),
            text: addTodoInput,
            complete:false
        }
        dispatch({type: "add", payload: todo})
        x.preventDefault();
        changeAddTodoInput("")
    }
    const delElement = (x) => {
        dispatch({
            type: 'del', payload: x
        })
    }

    const filterHandleChange=(input)=>{
        console.log(input.target.value)
        changeSearchInput(input.target.value)
        // if(state.filterState.length){
        //     dispatch({type: "filterCompleted", payload: input.target.value})
        // }else {   dispatch({type: "filter", payload: input.target.value})}



    }
    const complete=(x)=>{
        console.log(x)
        dispatch({
            type:'complete',
            payload:x
        })
    }
    const filterItems=(items, filter)=> {
        if (filter === 'all') {
            return items;
        } else if (filter === 'active') {
            return items.filter((item) => (!item.complete));
        } else if (filter === 'done') {
            return items.filter((item) => item.complete);
        }
    }
   const searchItems=(items, search)=> {
        if (search.length === 0) {
            return items;
        }

        return items.filter((item) => {
            return item.text.toLowerCase().indexOf(search.toLowerCase()) > -1;
        });
    }
    // const visibleItems = searchItems(filterItems(items, filter), search);


    const changeVisibleState=(x)=> {
        if(x==='all'){
    dispatch({type:'all'})
        }else if(x==='active'){
            dispatch({type:'active'})
        }else if('done'){
            dispatch({type:'done'})
        }
    }
    const visibleItems = searchItems(filterItems(state.allTodos, state.filter),searchInput);
    return (
        <div className="App">
            <form onSubmit={handleSubmit}>
                <input type={"text"} placeholder={"typo something"} value={addTodoInput} onChange={handleChange}/>
                <button type={"submit"}>go</button>
            </form>
                <input type={"text"} placeholder={"search"} value={searchInput} onChange={filterHandleChange}/>
                <br/>
                <button onClick={()=>{changeVisibleState('all')}}>show all</button>
                <button onClick={()=>{changeVisibleState('active')}}>uncompleted</button>
                <button onClick={()=>{changeVisibleState('done')}}>completed</button>

            <ul>
               <List data={visibleItems} delElement={delElement} complete={complete}/>
            </ul>
        </div>
    );
}

export default App;

const List=({data,delElement,complete})=>{
    return <ul> {data.map((v, k) => {
        return <li style={{backgroundColor:v.complete?'green':'red'}} key={v.id}>{v.text}
            <button onClick={() => {
                delElement(v.id)
            }}>del
            </button>
            <button onClick={() => {
                complete(v.id)
            }}>complete
            </button>
        </li>
    })}
    </ul>}