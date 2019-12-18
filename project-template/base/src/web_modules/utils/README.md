## 阅读索引
1. [Utils公共方法库](#Utils公共方法库)
2. [Lodash工具方法库](#Lodash工具方法库)  
  
---  
  
1. ### Utils公共方法库
Tags:
[`createActionType`](#createActionType)、
[`obJectToId`](#obJectToId)、
[`arrayToId`](#arrayToId)、
[`encodeParams`](#encodeParams)、
[`decodeParams`](#decodeParams)、
[`getTargetName`](#getTargetName)、
[`getDictValue`](#getDictValue)、
[`getDictItems`](#getDictItems)、
[`getAppSet`](#getAppSet)、
[`stringToJson`](#stringToJson)、
[`getPercentage`](#getPercentage)、
[`getFormFirstErrorMsg`](#getFormFirstErrorMsg)、
[`matchPathname`](#matchPathname)、
[`getPermission`](#getPermission)、
[`readAllowed`](#readAllowed)、
[`writeAllowed`](#writeAllowed)、
[`getCurrCode`](#getCurrCode)、
[`trimObjectValues`](#trimObjectValues)、
[`getLocationQuery`](#getLocationQuery)、
[`stopPropagation`](#stopPropagation)、
[`getPinyin`](#getPinyin)、
[`getPinyinStr`](#getPinyinStr)、
[`objectTransBool`](#objectTransBool)、
[`deepFreeze`](#deepFreeze)、
[`noop`](#noop)、
[`inject`](#inject)、
[`connect`](#connect)、
[`bindActionCreators`](#bindActionCreators)、
[`propTypes`](#propTypes)、
[`classnames`](#classnames)、
[`moment`](#moment)、
[`jquery`](#jquery)、
[`md5`](#md5)  

* #### createActionType
获取action type名称，用于规范 action.type 命名
```
// constant.js 文件
import {createActionType} from 'utils';
// 参数名必须是[A-Z_]组合的字符串
// let getActionType = createActionType('ROUTE_MODULE_NAME', 'COMPONENT_NAME');
// let getActionType = createActionType('HELPER', 'FIELD_MANAGE');
let getActionType = createActionType('AMS', 'ADMIN');

export const SET_LIST_DATA = getActionType('SET_LIST_DATA');
export const OPEN_MODAL = getActionType('OPEN_MODAL');
```

* #### obJectToId
序列化对象签名
```
import {obJectToId} from 'utils';
let obj = {a:1, b:'cc'};
let objId = obJectToId(obj);
console.log(objId);
==> xxxxxxxxx
```

* #### arrayToId
序列化数组签名
```
import {arrayToId} from 'utils';
let arr = ['aaa', 'bbb', 324, 'qwer'];
let arrId = arrayToId(arr);
console.log(arrId);
==> xxxxxxxxx
```

* #### encodeParams
编码参数
```
import {encodeParams} from 'utils';
// 常用于JSON数据转字符串并编码进行表单提交
let str1 = encodeParams(arrParams);
let str2 = encodeParams(objParams);
```

* #### decodeParams
解码参数
```
import {decodeParams} from 'utils';
// 常用于服务端返回编码数据解码
let obj = encodeParams(arrStrParams);
let arr = encodeParams(objStrParams);
    
```

* #### getTargetName
获取新窗口名称
```
import {getTargetName} from 'utils';
// 用于设置新窗口唯一标识名
let name = getTargetName('path/to/name');
```

* #### getDictValue
获取字典某个值
```
import {getDictValue} from 'utils';
// 用于获取服务端字典数据的某个键的值
let value = getDictValue(someDict, 'key');
```

* #### getDictItems
获取字典键值对数据
```
import {getDictItems} from 'utils';
// 将服务端返回的字典数据转换成键值对
let obj = getDictValue(someDict);
```

* #### getAppSet
从APP列表中整理出键值对集合
```
import {getAppSet} from 'utils';
// 将应用列表数据转换成键值对
let obj = getAppSet(appList);
```

* #### stringToJson
解析hbase数据结构- xx:ssss;bb:kkkkk;cc:ddddd;dd:wwwww
```
import {stringToJson} from 'utils';
// 将hbase字符串结构数据转换成json数据类型
let obj = stringToJson('xx:ssss;bb:kkkkk;cc:ddddd;dd:wwwww');
console.log(obj);
```

* #### getPercentage
获取百分数
```
import {getPercentage} from 'utils';
// 获取百分数数值
const molecule = 10;
const denominator = 50
let percentage = getPercentage(molecule, denominator, 2);
console.log(percentage);
    
```

* #### getFormFirstErrorMsg
获取表单第一条错误信息
```
import {message} from 'bqs';
import {getFormFirstErrorMsg} from 'utils';
// 用于Form表单验证获取错误信息第一条


let {validateFields, resetFields} = this.props.form;
validateFields({
    first: true,
    force: true
}, (errors, formData) => {
    if (isEmpty(errors)) {
        // to do something
    } else {
        message.error(getFormFirstErrorMsg(errors));
    }
});

    
```

* #### matchPathname
是否匹配react路由
```
import {matchPathname} from 'utils';
    
```

* #### getPermission
获取权限码
```
import {getPermission, inject} from 'utils';
@inject({xxxXXX}, ({admin}, props) => ({
    permission: getPermission(admin.permissions),
    adminInfo: admin.info
    ...props
}))
    
```

* #### readAllowed
判断是否拥有读权限
```
import {readAllowed, inject} from 'utils';
@inject({xxxXXX}, ({admin}, props) => ({
    writeAllowed: readAllowed(admin.permissions),
    adminInfo: admin.info
    ...props
}))
    
```

* #### writeAllowed
判断是否拥有写权限
```
import {writeAllowed, inject} from 'utils';

@inject({xxxXXX}, ({admin}, props) => ({
    writeAllowed: writeAllowed(admin.permissions)
    ...props
}))
    
```

* #### getCurrCode
获取当前菜单权限码
```
import {getCurrCode} from 'utils';
let code = getCurrCode();

```

* #### trimObjectValues
去掉对象中所有字符串型键值的前后空格
```
import {trimObjectValues} from 'utils';
    
```

* #### getLocationQuery
获取地址查询参数
```
import {getLocationQuery} from 'utils';
// 默认解析浏览器地址栏地址
let queryParams = getLocationQuery()
// 可以传入指定地址
let queryParams = getLocationQuery(url)
```

* #### stopPropagation
阻止window.event事件冒泡
```
import {Button} from 'bqs';
import {stopPropagation} from 'utils';
<Button onClick={stopPropagation}></Button>
<a onClick={(e) => {stopPropagation(e)}}></a>
<span onClick={stopPropagation}></span>
```

* #### getPinyin
获取字符串拼音列表
```
import {getPinyin} from 'utils';
let arr = getPinyin('你好');
console.log(arr);
```

* #### getPinyinStr
获取拼音字符串
```
import {getPinyinStr} from 'utils';
let str = getPinyinStr('你好');
console.log(str);
```

* #### objectTransBool
深度遍历对象，将布尔值转换0或1
```
import {objectTransBool} from 'utils';
    
```

* #### deepFreeze
深冻结函数
```
import {deepFreeze} from 'utils';
```

* #### noop
空函数
```   
import {noop} from 'utils';
```

* #### inject
路由组件入口修饰方法
```
import xxxXXX from './_redux/reducer';
import {inject} from 'utils';
@inject({xxxXXX}, ({admin}, props) => ({
    writeAllowed: writeAllowed(admin.permissions)
    ...props
}))
```

* #### connect
路由组件下的业务组件修饰方法
```
import {connect} from 'utils';
@connect(({admin}, props) => ({
    writeAllowed: writeAllowed(admin.permissions)
    ...props
}))
```

* #### bindActionCreators
配合connect/inject绑定action构造器
```
import {connect, bindActionCreators} from 'utils';
import {someAction} from './_redux/action';
// 写法一
@connect(({admin}, props) => ({
    writeAllowed: writeAllowed(admin.permissions),
    emptyApps: isEmpty(admin.apps),
    appSelected: admin.appSelected,
    ...props
}), bindActionCreators.bind(null, {
    someAction
}))

// 写法二
@connect(({admin}, props) => ({
    writeAllowed: writeAllowed(admin.permissions),
    emptyApps: isEmpty(admin.apps),
    appSelected: admin.appSelected,
    ...props
}), dispatch => bindActionCreators({
    someAction
}, dispatch))
    
```

* #### propTypes
react组件传入props数据类型验证方法(参考文档: https://reactjs.org/docs/typechecking-with-proptypes.html)
```
import {propTypes} from 'utils';
```

* #### classnames
类名生成方法(参考文档: https://www.npmjs.com/package/classnames)
```
import {classnames as cs} from 'utils';
```

* #### moment
时间工具库(参考文档: http://momentjs.cn/docs/)
```
import {moment} from 'utils';
```
    
* #### jquery
jquery工具库(参考文档： http://api.jquery.com/)
```
import {jquery as $} from 'utils';
// 禁止用jquery操纵dom
```
        
* #### md5
md5加密方法
```
import {md5} from 'utils';
let str = md5('hello world!');
console.log(md5)
```
2. ### Lodash工具方法库
参考文档: https://lodash.com/docs
Tags:
[`isEmpty`](#isEmpty)、
[`isArray`](#isArray)、
[`isString`](#isString)、
[`isFunction`](#isFunction)、
[`isPlainObject`](#isPlainObject)、
[`compact`](#compact)、
[`find`](#find)、
[`orderBy`](#orderBy)、
[`uniq`](#uniq)、
[`uniqueId`](#uniqueId)、
[`keys`](#keys)、
[`values`](#values)、
[`trim`](#trim)、
[`get`](#get)、
[`set`](#set)、
[`omit`](#omit)、
[`pick`](#pick)、
[`repeat`](#repeat)、
[`times`](#times)、
[`pull`](#pull)、
[`flatten`](#flatten)、
[`flattenDeep`](#flattenDeep)、
[`without`](#without)、
[`cloneDeep`](#cloneDeep)、
[`max`](#max)、
[`min`](#min)、
[`range`](#range)、
...

```jsx
import {isEmpty, isArray, keys, values, trim, get, set, omit, pick, ...} from 'lodash';
```
