### react-grid-layout

网格布局，通过指定配置文件创建网格布局，示例为由一个基础布局文件创建单面板，可支持向右/向下切分，切分方式为一切为2，同时支持删除任一面板后更新相关联布局的能力，布局之间存在切分的父子兄弟关系,用示例中的Layout记录关联关系

```javascript
import { observer } from "mobx-react-lite";
import GridLayout from "react-grid-layout";
import { toJS } from "mobx";
import { useResizeDetector } from "react-resize-detector";

interface IProps {
  child: any;
  config: IViewConifig[];
}
const SplitLayout = observer((props: IProps) => {
  const [rowHeight, setRowHeight] = useState<number>(0);

  useEffect(() => {
    dataStore.setConfig(props.config);
  }, []);

  const {
    width: containerWidth,
    height: containerHeight,
    ref,
  } = useResizeDetector({
    refreshMode: "debounce",
    refreshRate: 200,
  });

  useEffect(() => {
    if (containerHeight) {
      // rowHeight默认设置50行，即满屏高度50行, 再通过当前屏高或容器高计算布局的行高rowHeight
      const height = Number(containerHeight / 50);
      setRowHeight(height);
    }
  }, [containerHeight]);

  useEffect(() => {
    dataStore.mockData();
  }, []);

  const onAdd = (id: string, type: IConfigType, direction: ISplitDirection) => {
    return store.splitPanel(id, type, direction);
  };

  const onDelete = (id: string, type: IConfigType) => {
    return store.deletePanel(id, type);
  };

  // cols设置72列，即72为满屏宽度
  return (
    <div className={styles["container"]} ref={ref}>
      <div>
        {containerWidth && (
          <GridLayout
            width={containerWidth}
            rowHeight={rowHeight}
            autoSize={false}
            cols={72}　// 设置为72列, 即满宽为72列网格
            margin={[0, 0]}
            isDraggable={false}
            isResizable={false}
            layout={toJS(store.viewConfig)}
          >
            {store.viewConfig.map((config) => {
              return (
                <div key={config.i}>
                  {
                    <props.child
                      id={config.i}
                      onAdd={onAdd}
                      onDelete={onDelete}
                    />
                  }
                </div>
              );
            })}
          </GridLayout>
        )}
      </div>
    </div>
  );
});
export default SplitLayout;

```

#### 切分store处理config

```javascript

class SplitStore {
  /**控制视图的配置 */
  viewConfig = parseConfig(defaultTopicConfig);
  /**
   * 切分窗口
   * @param direction
   */
  splitPanel(id: string, type: IConfigType, direction: ISplitDirection) {
    const config = this.viewConfig.find((c) => c.i === id);
    if (!config) return;
    const newConfig = config.split(direction);
    this.viewConfig.push(newConfig);
    Manager.getInstance().addLayout(id, newConfig.i, type, direction);
    return newConfig.i;
  }

  /**
   * 删除某个panel
   * @param id
   * @param type topic / chart
   * @returns
   */
  deletePanel = (id: string, type: IConfigType) => {
    if (this.viewConfig.length === 1) {
      return;
    }
    const config = this.viewConfig.find((c) => c.i === id);
    if (!config) return;
    const index = this.viewConfig.indexOf(config);
    if (index !== -1) {
      this.viewConfig.splice(index, 1);
      const newLayouts = Manager.getInstance().delete(config.i);
      Manager.getInstance().updateConfigByLayout(this.viewConfig);
      return true;
    }
  };

  setConfig(viewConfig: IViewConifig[]) {
    this.viewConfig = parseConfig(viewConfig);
    Manager.getInstance().init(viewConfig[0].i);
  }

  constructor() {
    makeObservable(this, {
      viewConfig: observable,
    });
  }
}
export const splitStore = new SplitStore();

export function parseConfig(config: IViewConifig[]) {
  return config.map((c) => new Config().parse(c));
}
```

#### config类
```javascript
import { v4 as uuidv4 } from "uuid";

export class Config {
  public i = "";

  public x = 0;

  public y = 0;

  public w = 0;

  public h = 0;

  public maxH = 0;

  public maxW = 0;

  public minH = 0;

  public minW = 0;

  constructor() {}

  parse(data: IViewConifig) {
    this.i = data.i;
    this.x = data.x;
    this.y = data.y;
    this.w = data.w;
    this.h = data.h;
    this.maxH = data.maxH;
    this.minH = data.minH;
    this.maxW = data.maxW;
    this.minW = data.minW;
    return this;
  }

  split(direction: "column" | "row") {
    const newConfig = {
      i: uuidv4(),
      x: direction === "column" ? this.x : this.x + this.w / 2,
      y: direction === "column" ? this.y + this.h / 2 : this.y,
      w: direction === "column" ? this.w : this.w / 2,
      h: direction === "column" ? this.h / 2 : this.h,
      maxH: this.maxH,
      maxW: this.maxW,
      minW: this.minW,
      minH: this.minH,
    };
    if (direction === "column") {
      this.h /= 2;
    } else {
      this.w /= 2;
    }
    return new Config().parse(newConfig);
  }
}
```

#### manager负责管理当前layout，切分核心

```javascript

function getConfigById(configs: IViewConifig[], id: string) {
  const config = configs.find((c) => c.i === id);
  return config;
}

export class Manager {
  layout: Layout | string = "";

  static _instance: Manager | undefined;

  static getInstance() {
    if (!Manager._instance) {
      Manager._instance = new Manager();
    }
    return Manager._instance;
  }

  init(id: string) {
    this.layout = id;
  }

  /**
   * 删除某个布局
   * @param id 布局id，等同于config.i
   * @returns
   */
  delete(id: string) {
    // 未切分
    if (typeof this.layout === "string") return;
    console.log("delete id", id);

    // 只切分一次
    if (
      typeof this.layout.first === "string" &&
      typeof this.layout.second === "string"
    ) {
      if (this.layout.first === id) {
        console.log("delete first node", this.layout.first);
        this.layout = this.layout.second;
      } else if (this.layout.second === id) {
        console.log("delete second node", this.layout.second);
        this.layout = this.layout.first;
      }
      return this.layout;
    }

    const deepSeek = (
      layout: Layout | string,
      parent: Layout,
      pparent?: Layout,
    ) => {
      if (typeof layout === "string") {
        if (layout === id) {
          // 删掉的是first节点
          if (parent.first === layout) {
            // second是叶子节点，将叶子节点链接到父级的父级
            if (typeof parent.second === "string") {
              if (pparent?.first === parent) {
                pparent.first = parent.second;
              } else if (pparent?.second === parent) {
                pparent.second = parent.second;
              }
            } else {
              // second不是叶子节点，将节点的first/second节点直接链接到父级的first/second
              parent.direction = parent.second.direction;
              parent.first = parent.second.first;
              parent.second = parent.second.second;
            }
          } else if (parent.second === layout) {
            // 删掉的是second节点

            // 父级是父父级的second节点，将剩余的first链接到父父级的second节点，否则链接到父父级的first节点
            if (pparent?.second === parent) {
              pparent.second = parent.first;
            } else if (pparent?.first === parent) {
              pparent.first = parent.first;
            } else if (typeof parent.first === "object") {
              const first = parent.first;
              parent.direction = first.direction;
              parent.first = first.first;
              parent.second = first.second;
            }
          }
          return true;
        }
        return;
      }
      if (deepSeek(layout.first, layout, parent)) return;
      if (deepSeek(layout.second, layout, parent)) return;
    };
    deepSeek(this.layout.first, this.layout);
    deepSeek(this.layout.second, this.layout);
    return this.layout;
  }

  /**
   * 增加一个布局
   * @param oldId 切分的来源
   * @param id 切分出的id
   * @param type topic | chart
   * @param direction row | column
   * @returns
   */
  addLayout(
    oldId: string,
    id: string,
    type: string,
    direction: ISplitDirection,
  ) {
    const newLayout = new Layout();
    newLayout.direction = direction;

    if (typeof this.layout === "string") {
      newLayout.first = this.layout;
      newLayout.second = id;
      this.layout = newLayout;
      return;
    }
    const deepSeek = (layout: Layout) => {
      if (layout.first === oldId) {
        // 切分的是first节点
        newLayout.first = oldId;
        newLayout.second = id;
        layout.first = newLayout;
        return true;
      } else if (layout.second === oldId) {
        // 切分的是second节点
        newLayout.first = oldId;
        newLayout.second = id;
        layout.second = newLayout;
        return true;
      }
      if (typeof layout.first !== "string" && deepSeek(layout.first))
        return true;

      if (typeof layout.second !== "string" && deepSeek(layout.second))
        return true;
    };
    deepSeek(this.layout);
  }

  /**
   * 根据 layout 更新 viewConfig
   */
  updateConfigByLayout(viewConfig: IViewConifig[]) {
    if (typeof this.layout === "string") {
      const config = getConfigById(viewConfig, this.layout);
      if (!config) {
        return;
      }
      config.w = FULL_WIDTH;
      config.h = FULL_HEIGHT;
      config.x = 0;
      config.y = 0;
      return;
    }
    const deepUpdate = (
      layout: Layout | string,
      direction: ISplitDirection,
      w: number,
      h: number,
      x: number,
      y: number,
    ) => {
      if (typeof layout === "string") {
        const config = getConfigById(viewConfig, layout);
        if (!config) {
          console.log("----not found", layout);
          return;
        }
        console.log("target", JSON.parse(JSON.stringify(config)));
        if (direction === "row") {
          config.w = w;
          config.x = x;
          config.h = h;
          config.y = y;
        } else {
          config.w = w;
          config.x = x;
          config.h = h;
          config.y = y;
        }
        return;
      }
      if (layout.direction === "column") {
        deepUpdate(layout.first, layout.direction, w, h / 2, x, y);
        deepUpdate(layout.second, layout.direction, w, h / 2, x, y + h / 2);
      } else {
        deepUpdate(layout.first, layout.direction, w / 2, h, x, y);
        deepUpdate(layout.second, layout.direction, w / 2, h, x + w / 2, y);
      }
    };
    if (this.layout.direction === "column") {
      deepUpdate(
        this.layout.first,
        this.layout.direction,
        FULL_WIDTH,
        FULL_HEIGHT / 2,
        0,
        0,
      );
      deepUpdate(
        this.layout.second,
        this.layout.direction,
        FULL_WIDTH,
        FULL_HEIGHT / 2,
        0,
        FULL_HEIGHT / 2,
      );
    } else if (this.layout.direction === "row") {
      deepUpdate(
        this.layout.first,
        this.layout.direction,
        FULL_WIDTH / 2,
        FULL_HEIGHT,
        0,
        0,
      );
      deepUpdate(
        this.layout.second,
        this.layout.direction,
        FULL_WIDTH / 2,
        FULL_HEIGHT,
        FULL_WIDTH / 2,
        0,
      );
    }
    return viewConfig;
  }
}
```

#### Layout
```javascript
export class Layout {
  public direction: ISplitDirection = "row";

  public first: string | Layout = ""; // type:id

  public second: string | Layout = ""; // type:id
}
```

#### 基础布局配置

```javascript
export const defaultConfig = [
  {
    i: "sfasdfasdfasdf",
    maxH: 50, // 与布局中的设置保持一致
    maxW: 72, // 与布局中的设置保持一致
    minH: 1,
    minW: 1,
    h: 50,
    w: 72,
    x: 0,
    y: 0,
  },
];
```

#### 使用方式
```javascript
const Panel = observer(() => {
  return (
    <div className={styles["container"]}>
      <SplitLayout child={TPanel} config={defaultConfig} />
    </div>
  );
});

// 在需要切分的具体组件TPanel中，调用由SplitLayout传入的onAdd和onDelete即可:

  const splitPanel = (direction: ISplitDirection) => {
    const newId = props.onAdd(props.id, direction);
    if (newId) {
      // 增加成功的后处理
    }
  };

  const deletePanel = () => {
    const didDelete = props.onDelete(props.id);
    if(didDelete) {
        // 删除成功的后处理
    }
  };
```