---
description: 常用方法集
---

# 工具类

## 功能

1. 判断当前是否测试服
2. 获取当前url的search参数的解析与拼接
3. Json的解析与序列化
4. Dom选择器

## 使用示例

{% code title="main.js" %}
```javascript
var Utli = require("foliou/utli");

Utli.query(".div1");
Utli.isdev();
Utli.isNan();
Utli.getParam('id');
Utli.jsonToUrl({
    a:1
});
```
{% endcode %}





