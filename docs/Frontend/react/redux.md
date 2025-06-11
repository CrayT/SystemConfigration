### 1, `redux` :
- 安装redux:
```
npm install redux
```
- 配置 `store` :
  - 创建 `store.js` , 创建`store` (这里直接使用 `combineReducers` 创建，以便分模块开发)
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
### 组件内部订阅：
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

### 組件间数据管理：
- 组件A改变数据：
  
```javascript
    store.dispatch({
        type: "Change",
        payload: {
            p1 : "p1",
            p2 : "p2"
        }
    })
``` 
  - 组件B订阅数据变化
```javascript
    constructor() {
        super();
        this.state = { myData: store.getState().myData }
    }
    componentDidMount() {
        store.subscribe(() => {
            this.setState({
                myData: store.getState().myData
            })
        })
    }
```

- `reducer`定义：

```javascript
const reducerC = function(state = { p1:"", p2:"" }, action){
    switch (action.type){
        case "Change":
            return { ...state,
                p1: action.payload.p1,
                p2: action.payload.p2
            }
            break;
        default:
            return state
    }
}
export {reducerC}
```

### `reducer` 是什么：
```
reducer 描述一个状态模型。在 Redux 下，应用的状态存储在一个对象中。
reducer 处理 Action，一个 Action 触发，根据这个 Action 的类型进行相应的操作, 对 旧State 进行修改，并返回一个新的State。
每个 diapatch 的 Action 会调用 combineReducers(REDUCERS) 中所有的 REDUCERS 进行处理，一个 Action 会被每个 REDUCER 都处理一遍.
```
### 2, `mobx` 使用 

```javascript
import { makeObservable, observable, action } from "mobx";

class Store {

    param1: boolean = '';
    constructor() {
        makeObservable(this, {
        param1: observable
        setValue: action,
        });
    }

    setValue() {}
}
export const store = new Store();

// 组件示例
import { observer } from "mobx-react-lite";
const Component1: React.FC = observer(() => {
  if (!store.param1) {
    return null;
  }

  return (
    <div className={styles["aaa"]}>
      <Component2 />
    </div>
  );
});

```