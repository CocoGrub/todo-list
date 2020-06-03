import React, {useReducer, useState} from 'react';
import './App.css';
import Button from "@material-ui/core/Button";
import Input from "@material-ui/core/Input";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Chip from "@material-ui/core/Chip";

function App() {

    const initialState = {
        allTodos: [{id: Date.now().toLocaleString(), text: 'drink coffee', complete: true}],
        uncompleted: [],
        completed: [],
        filter: 'all',
        search: ''

    }

    function reducer(state, action) {
        switch (action.type) {
            case "add":
                return {...state, allTodos: [...state.allTodos, action.payload]}
            case "del":
                return {...state, allTodos: [...state.allTodos.filter((x) => x.id !== action.payload)]}
            case "complete":
                return {
                    ...state, allTodos: [...state.allTodos.map((x) => {
                        if (x.id === action.payload) {
                            const z = {...x}
                            z.complete = !x.complete;
                            return z
                        }
                        return x
                    })]
                }
            case 'all':
                return {...state, filter: state.filter = 'all'}
            case 'done':
                return {...state, filter: state.filter = 'done'}
            case 'active':
                return {...state, filter: state.filter = 'active'}
            default:
                return state
        }
    }

    const [state, dispatch] = useReducer(reducer, initialState)
    const [addTodoInput, changeAddTodoInput] = useState("")
    const [searchInput, changeSearchInput] = useState("")
    const handleChange = (x) => {
        changeAddTodoInput(x.target.value)
    }
    const handleSubmit = (x) => {
        const todo = {
            id: Date.now().toLocaleString(),
            text: addTodoInput,
            complete: false
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

    const filterHandleChange = (input) => {
        changeSearchInput(input.target.value)
    }

    const complete = (x) => {
        dispatch({
            type: 'complete',
            payload: x
        })
    }

    const TodoCount = () => {

        const allTODO = state.allTodos.length
        const completedTODO = state.allTodos.filter((x) => x.complete).length
        const uncompletedTODO = allTODO - completedTODO

        return [allTODO,completedTODO,uncompletedTODO]
    }

    const [allTODO,completedTODO,uncompletedTODO]=TodoCount()

    const filterItems = (items, filter) => {
        if (filter === 'all') {
            return items;
        } else if (filter === 'active') {
            return items.filter((item) => (!item.complete));
        } else if (filter === 'done') {
            return items.filter((item) => item.complete);
        }
    }

    const searchItems = (items, search) => {
        if (search.length === 0) {
            return items;
        }

        return items.filter((item) => {
            return item.text.toLowerCase().indexOf(search.toLowerCase()) > -1;
        });
    }

    const changeVisibleState = (x) => {
        if (x === 'all') {
            dispatch({type: 'all'})
        } else if (x === 'active') {
            dispatch({type: 'active'})
        } else if ('done') {
            dispatch({type: 'done'})
        }
    }
    const visibleItems = searchItems(filterItems(state.allTodos, state.filter), searchInput);
    return (
        <div className="App">
            <form onSubmit={handleSubmit}>
                <Input type={"text"} placeholder={"typo something"} value={addTodoInput} onChange={handleChange}/>
                <Button style={{border:'1px solid green',height:"1.9rem"}} type={"submit"}>add</Button>
            </form>
            <Input type={"text"} placeholder={"search"} value={searchInput} onChange={filterHandleChange}/>
            <br/>
            <Chip size="small" label={`all todos:${allTODO}`}></Chip><Chip size="small" label={`completed:${completedTODO}`}></Chip> <Chip size="small" label={`uncompleted:${uncompletedTODO}`}></Chip>
            <hr/>
            <ButtonGroup variant="text" color="primary" aria-label="text primary button group">
            <Button onClick={() => {
                changeVisibleState('all')
            }}>show all
            </Button>

            <Button onClick={() => {
                changeVisibleState('done')
            }}>completed
            </Button>
            <Button onClick={() => {
                changeVisibleState('active')
            }}>uncompleted
            </Button>
            </ButtonGroup>
            <List  >
                <TodoList data={visibleItems} delElement={delElement} complete={complete}/>
                </List>
        </div>
    );
}

export default App;

const TodoList = ({data, delElement, complete}) => {
    return <>  {data.map((v, k) => {
        return <ListItem   style={{justifyContent: "center", fontSize:'1.5rem'}} key={v.id}>
            {/*<Button variant="contained" color="primary"></Button>*/}
            <input type={"checkbox"} checked={v.complete} onChange={() => {
                complete(v.id)
            }}>
            </input>
            &nbsp;{v.text}&nbsp;
            <Button style={{height:"1.2rem"}}  variant="contained" color="primary" onClick={() => {
                delElement(v.id)
            }}>del</Button>
<br/>
        </ListItem >
    })}
    </>
}