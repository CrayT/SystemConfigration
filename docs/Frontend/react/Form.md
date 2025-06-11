### antd的Form表格使用示例

```javascript
// import React, { MutableRefObject } from "react";
// import {
//   Button,
//   Form,
//   Select,
//   Space,
//   InputNumber,
//   Tag,
//   Flex,
//   Upload,
//   Input,
//   InputRef,
//   message,
// } from "antd";
// import styles from "./index.module.less";
// import { IFormData } from "./interface";
// import { observer } from "mobx-react-lite";
// import { UploadOutlined } from "@ant-design/icons";
// import { RcFile } from "antd/lib/upload";
// import _ from "lodash";

const fs = window.require("fs");

const fileLists: string[] = [];

const　Parameter = observer(() => {
  const [form] = Form.useForm();

  const [collapse, setCollapse] = React.useState(true);

  const Ref１ = React.useRef<InputRef>() as MutableRefObject<InputRef>;

  const Ref２ = React.useRef<InputRef>() as MutableRefObject<InputRef>;

  React.useEffect(() => {
    const defaultFormData = store.formData;　


    form.setFieldsValue(defaultFormData.data);

    setCollapse(true);


  }, [store.formData]);

  React.useEffect(() => {

    fs.readFile(path + "json.json", (_err: any, data: any) => {
      JSON.parse(data.toString());
    });
  }, [store.path]);

  const onSubmit = (values: Partial<IFormData>) => {

  };

  const onReset = () => {
    form.resetFields();
  };


  const throttleSetDirPath = _.throttle((file: File) => {
    const absolutePath = (file as any).path;
    const splits = absolutePath.split("/");
    splits.pop();
    const dir = splits.join("/") + "/";
  }, 100);

  const onStartSelectFiles = () => {
    
  };

  const typeComponent = (type: keyof IFormData) => {
    switch (type) {
      case "input1":
        return (
          <Form.Item key={type} name="input1" label="input1" colon={true}>
            <Input.TextArea
              autoSize={true}
              ref={Ref1}
              placeholder="输入:"
            ></Input.TextArea>
          </Form.Item>
        )
      case "Upload":
        return (
          <Form.Item key={type} name="Upload" label="Upload" colon={true}>
            <Upload
              multiple={true}
              showUploadList={false}
              accept={`.${fileFormat}`}
            >
              <Button onClick={onStartSelectFiles} icon={<UploadOutlined />}>
                (按住ctrl键多选)
              </Button>
            </Upload>
          </Form.Item>
        );
      case "ttttt":
        return (
          <Form.Item key={type} name="ttttt" label="ttttt">
            <Flex gap="4px 0" wrap>
              {/* {lists.map((item, index) => {
                return item ? (
                  <Tag key={index} className={styles["tag"]}>
                    <span>{item}</span>
                    <div
                      className={styles["close"]}
                      onClick={() => closeTag(item)}
                    >
                      {closeOutline}
                    </div>
                  </Tag>
                ) : null;
              })} */}
            </Flex>
            {/* <Button type="default" onClick={() => setShowTopic(!show)}>
              添加
            </Button> */}
          </Form.Item>
        );
      default:
        break;
    }
  };

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 3 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 20 },
    },
  };

  // return (
  //     <div className={styles["content"]}>
  //       <Form
  //         {...formItemLayout}
  //         style={{ maxWidth: 900 }}
  //         className={styles["form-wrapper"]}
  //         form={form}
  //         onFinish={onSubmit}
  //         layout="horizontal"
  //       >
  //         {formData.show.map((key) => {
  //           return typeComponent(key);
  //         })}
  //         {!collapse &&
  //           formData.collapse.map((key) => {
  //             return typeComponent(key);
  //           })}
  //         {formData.collapse.length !== 0 && (
  //           <div
  //             className={styles["open-setting"]}
  //             onClick={() => {
  //               console.log("click");
  //               setCollapse(!collapse);
  //             }}
  //           >
  //             <span>{collapse ? "展开" : "隐藏"}默认配置</span>
  //             <div>{collapse ? rightOutline : topOutline}</div>
  //           </div>
  //         )}
  //         <Form.Item className={styles["footer"]}>
  //           <Space>
  //             <Button type="primary" htmlType="submit">
  //               开始
  //             </Button>
  //           </Space>
  //         </Form.Item>
  //       </Form>
  //     </div>
  // );
});

```