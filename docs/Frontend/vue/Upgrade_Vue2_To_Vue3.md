- 安装：

  - ```
    npm install -g @vue/cli
    ```

  - 

- 创建：

  - ```
    vue create projectname
    ```

- 配置：

  - 1，i18n

    - ```
       npm install vue-i18n@next --save-dev
      ```

    - main.js中引入：

      - ```
        import {createI18n} from "vue-i18n";
        const i18n = createI18n({
            locale: 'zh-CN',
            messages: message //定义好的message
        })
        ```

  - 2，Vuex：

    - ```
      npm install vuex@next --save-dev
      ```

    - 在index中定义：

    - ```
      import Vuex from 'vuex'
      const store = Vuex.createStore({
        state : {
          isPhone : true,
          noticeMessage : null
        }
      })
      export default store;
      ```

  - 3，创建app：

  - ```
    const app = createApp(App)
    app.use(i18n)
    app.mount('#app')
    ```

  - 

