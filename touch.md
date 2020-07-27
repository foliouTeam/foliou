---
description: 封装PC和移动端的触碰事件
---

# Touch

## 用法

```javascript
var Touch= require("foliou/touch");
var touchEve = new Touch(".div",{
    start:function(){
        //开始触碰
    },
    move:function(){
        //触碰后移动
    },
    end:function(){
        //触碰结束
    }
});
```

### 

