function App() {
    const [num, setNum] = useState(0)
    return {
        click() {
            setNum(num => num + 1)
        }
    }
}

type Action = (key: any) => void

interface Update {
    action: Action,
    next?: Update
}

interface Queue {
    pending?: Update
}

interface Hook {
    queue: Queue,
    memoizedState: any
    next?: Hook
}

interface Fiber {
    memoizedState?: Hook;
    stateNode: () => { click: () => void }
}

const fiber: Fiber = {
    memoizedState: undefined,
    stateNode: App
}
let isMount = true; // 是否是第一次渲染页面
let workInProgressHook: Hook | undefined
let callbackNode: number | undefined = undefined

const schedule = () => {
    if (callbackNode) {
        clearTimeout(callbackNode)
    }
    callbackNode = setTimeout(() => {
        workInProgressHook = fiber.memoizedState
        window.app = fiber.stateNode()
        isMount = false
    })
}

const dispatchSetState = (queue: Queue, action: Action) =>{
    const update = {
        action,
        next: undefined
    }
    if (!queue.pending) {
        update.next = update
    } else {
        update.next = queue.pending.next
        queue.pending.next = update
    }
    queue.pending = update
    schedule()
}

const useState = (initialState: any) => {
    let hook;
    if (isMount) {
        hook = {
            queue: {
                pending: undefined
            },
            memoizedState: initialState,
            next: undefined
        }
        if (!fiber.memoizedState) {
            fiber.memoizedState = hook
        } else {
            workInProgressHook.next = hook
        }
        workInProgressHook = hook
    } else {
        hook = workInProgressHook
        workInProgressHook = workInProgressHook.next
    }

    if (!hook) {
        throw new Error('Hook is null')
    }

    let baseState = hook.memoizedState
    if (hook.queue.pending) {
        let firstUpdate = hook.queue.pending.next

        do {
            const action = firstUpdate.action
            baseState = action(baseState)
            firstUpdate = firstUpdate.next
        } while (firstUpdate !== hook.queue.pending.next)

        hook.queue.pending = undefined
    }

    hook.memoizedState = baseState
    return [baseState, dispatchSetState.bind(null, hook.queue)]
}