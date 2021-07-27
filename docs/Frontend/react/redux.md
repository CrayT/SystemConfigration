### 1, `redux` :
- 安装redux
    ```
        npm install redux
    ```
- 配置 `store` :
  - 创建 `store.js` , 创建store (这里直接使用 `combineReducers` 创建，以便分模块开发)
    ```javascript
        import {createStore, combineReducers} from "redux";
        import {reducerA} from "../reducer/ReducerA";
        import {reducerB} from "../reducer/ReducerB";

        const cr = combineReducers({
            a: reducerA,
            b: reducerB
        })
        const store = createStore(cr);
        export default store;
    ```
  - `ReducerA.js`:
    ```javascript
        const reducerA = function(state = { aa: 1 }, action){
        switch (action.type){
            case "Add":
                return { ...state, aa: state.aa + 1}
                break;
            default:
                return state
            }
        }
        export { reducerA }
    ```
  - `ReducerB.js`:
    ```javascript
        const reducerB = function(state = {bb: true}, action){
            switch (action.type){
                case "Sub":
                    return { ...state, bb: !state.bb}
                    break;
                default:
                    return state
            }
        }
        export { reducerB }
    ```
- 组件内部订阅：
    ```javascript
        import store from "../../redux/store";
        componentDidMount() {
            store.subscribe( () => {
                this.forceUpdate()
            })
        }
    ```
- 组件内部触发 `action` ：
    ```javascript
        add(){
            store.dispatch({
                type: "Add",
                payload: 123
            })
            console.log(store.getState())
        }
    ```
- 组件内部获取 `state` ：
    ```javascript
        store.getState()
    ``` 
- `reducer` 是什么：
    ```
        reducer 描述一个状态模型。在 Redux 下，应用的状态存储在一个对象中。
        reducer 处理 Action，一个 Action 触发，根据这个 Action 的类型进行相应的操作, 对 旧State 进行修改，并返回一个新的State。
        每个 diapatch 的 Action 会调用 combineReducers(REDUCERS) 中所有的 REDUCERS 进行处理，一个 Action 会被每个 REDUCER 都处理一遍.
    ```
### 2, `react-redux` 使用 