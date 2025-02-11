# **整合 ESLint、Prettier、Husky、lint-staged 使用**

**目的: husky 加上 lint-staged 的搭配, 可以初步把關程式碼以及減輕團隊 code review 的壓力, 確保不會有 error 會被推到 repository, 且程式碼也能符合團隊規範**

1. 先初始化產生一個 npm package 專案
    
    ```bash
    npm init
    ```
    
2. Eslint: ESLint ( ECMAScript + Lint ) 是用來檢查 JavaScript 程式碼的工具, 可在 commit 前檢查語法錯誤、提示潛在的 bug, 有效提高程式碼質量, 和統一基本的 coding style
    
    **以下範例是使用 v8, v9 後的 API 有 breaking change**
    
    1. 安裝 eslint 套件到 dev 開發環境
        
        ```bash
        npm install eslint -D
        ```
        
    2. 初始化 eslint 專案
        
        ```bash
        // 以下語法二選一
        npx eslint --init
        npm init @eslint/config # 執行此語法必須專案下有 package.json
        ```
        
    3. 依序設定會需要輸入
        
        ![image](https://github.com/user-attachments/assets/38829301-71d0-4902-acfd-52f23c8f2791)

        
    4. 設定 eslint npm script
        
        ```json
        "scripts": {
            "lint": "eslint . --ext .js,.ts,.vue",
            "lint-fix": "eslint . --ext .js,.ts,.vue --fix"
        },
        ```
        
    5. .eslintrc.js 設定如下
        
        ```jsx
        module.exports = {
          env: {
            browser: true,
            es2021: true,
            node: true,
          },
          extends: [
            // extends 套件名稱前面的 eslint-config- 可以省略
            // 'airbnb-base' <==> eslint-config-airbnb-base
            'plugin:vue/vue3-essential',
            'standard-with-typescript', // <==> eslint-config-standard-with-typescript
            'plugin:prettier/recommended',
            'prettier', // <==> eslint-config-prettier
          ],
          overrides: [],
          parserOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
          },
          plugins: [
            // plugins 套件名稱前面的 eslint-plugin- 可以省略
            'vue', // <==> eslint-plugin-vue
            'prettier', // <==> eslint-plugin-prettier
          ],
          rules: {
            semi: ['error', 'always'],
            quotes: ['error', 'single'],
            // 'no-unused-vars': 'off',
          },
        };
        ```
        
3. Prettier: 是一個 Code formatter, 能夠將 JavaScript, TypeScript, CSS 程式碼格式化, 進而統一程式碼風格 Codeing Style
    1. 安裝 prettier 相關套件設定
        
        ```bash
        npm install prettier -D 
        npm install eslint-config-prettier -D # 設置 ESlint 的 Plugin, 提供能力關閉那些與 Prettier 衝突的設定
        npm install eslint-plugin-prettier -D # 讓 ESlint 把 Prettier 當作一條規則去執行
        ```
        
    2. 新增 .prettierrc.json 檔案
        
        ```json
        // 在根目錄新增 .prettierrc.json
        // 以下配置視情況而定, 並不是每個都需要的
        {
          "printWidth": 100,       // 超過多少字符強制換行
          "endOfLine": "auto",     // 文件換行格式 LF/CRLF
          "singleQuote": true      // 是否使用單引號
        }
        ```
        
    3. 修改 .eslintrc.js
        
        ```jsx
        // .eslintrc.js
        module.exports = {
          extends: [
        		//.....部分省略
            'prettier', // <==> eslint-config-prettier
          ],
          plugins: [
        		//.....部分省略
        		'prettier', // <==> eslint-plugin-prettier
          ],
        };
        ```
        
        或可以簡寫成
        
        ```jsx
        // .eslintrc.js
        module.exports = {
          extends: [
        		//.....部分省略
            'plugin:prettier/recommended',
          ],
        };
        ```
        
    4. 設定 prettier npm script
        
        ```json
        "scripts": {
            "format": "prettier --write src/**/*.{js,ts,vue} .*.js"
        	},
        ```
        
4. Husky: npm 套件, 讓使用者配置 Git hooks 相關的腳本, Husky 會在對應的時機觸發腳本執行
    1. 安裝 husky 套件到 dev 開發環境
        
        ```bash
        npm install husky -D
        ```
        
    2. 在根目錄下產生一個 .husky 資料夾, 存放 husky 的相關腳本, 有兩種做法
        - 使用 npm set-script 命令：加入 Husky 的 npm prepare script 中加上 husky install, 專案在npm install 運行時就會一起執行 Husky 的安裝程序
            
            ```bash
            # npm set-script prepare "husky install" 這段語法已經 deprecated
            npm pkg set scripts.prepare="husky install"
            ```
            
            ```json
            {
              "scripts": {
            	  // 上面指令執行完後會在 npm scripts 產生 prepare 指令
                "prepare": "husky install"
              },
            }
            ```
            
        - 直接下 npx husky install 指令, 缺點是第一次下載 repo 都需要執行此命令
            
            ```bash
            npx husky install
            ```
            
    3. 指定在 git commit 前會先跑過 npx lint-staged 腳本, 如果失敗 git commit 不會被執行
        
        ```bash
        npx husky add .husky/pre-commit "npx lint-staged"
        ```
        
        上述指令執行完後 .husky 資料夾下會多了 pre-commit 檔案, 內容如下
        
        ```bash
        #!/usr/bin/env sh
        . "$(dirname -- "$0")/_/husky.sh"
        
        npx lint-staged # 只針對 git stage 檔案檢查
        npm run lint # 針對 npm scipt lint 符合的路徑檔案類型全部檢查
        ```
        
5. Lint-Staged :  npm 套件, 檔案執行 git add . 後, 將放在暫存區(Git Stage) 檔案根據配置檔設定分別經過 linter 檢查和 prettier format, 可依照自己的需求調整
    1. 安裝 lint-stage 套件到 dev 開發環境
        
        ```bash
        npm install lint-staged -D
        ```
        
    2. 配置檔設定有兩種, 擇一即可
        - package.json
            
            ```json
            "lint-staged": {
                "*.{json,js,ts,vue}": [
                  "prettier --write",
            			"eslint --quiet --fix"
                ],
                "*.{html,scss,css,vue,md}": [
            			"prettier --write"
                ]
             },
            ```
            
        - .lintstagedrc.json
            ```json
            {
              "*.{html,scss,css,vue,md}": ["prettier --write"],
              "*.{json,js,ts,vue}": ["prettier --write", "eslint --fix"]
            }
            ```
          
