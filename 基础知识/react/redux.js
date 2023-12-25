function createStore(reducer, initialState) {
    let state = initialState
    let listeners = []

    // 订阅
    const subscribe = (listener) => {
        listeners.push(listener)
    }

    // 变更发布通知
    const changeState = (action) => {
        state = reducer(state, action)
        for (let i = 0; i < listeners.length; i++) {
            listeners[i]()
        }
    }

    const getState = () => {
        return state
    }

    return {
        getState,
        changeState,
        subscribe
    }
}

let initState = {
    counter: {
        count: 0
    },
    info: {
        name: '前端九部',
        description: '我们都是前端爱好者！'
    }
}

function counterReducer(state, action) {
    switch (action.type) {
        case 'INCREMENT':
            return {
                count: state.count + 1
            }
        case 'DECREMENT':
            return {
                ...state,
                count: state.count - 1
            }
        default:
            return state;
    }
}

function infoReducer(state, action) {
    switch (action.type) {
        case 'SET_NAME':
            return {
                ...state,
                name: action.name
            }
        case 'SET_DESCRIPTION':
            return {
                ...state,
                description: action.description
            }
        default:
            return state;
    }
}

const combineReducers = (reducers) => {
    const keys = Object.keys(reducers)
    return function (state = {}, action) {
        const nextState = {}
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i]
            const plan = reducers[key]
            nextState[key] = plan(state[key], action)
        }
    }
}

const reducer = combineReducers({
    counter: counterReducer,
    info: infoReducer
})