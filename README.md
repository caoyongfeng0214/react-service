# react-service

[MobX](https://mobx.js.org/)？非常优秀。还有一些其它的类似的package，也有不少优秀之作。但我想要的仅仅是一个能让我能非常简单地进行数据维护的方式。或许称之为state management不太确切。

**react-service**是数据与UI之间的桥梁。

# install
```
npm install react-service -save
```

# Example
**Service**是用来操作数据的，并维护UI中的状态。可为每一类数据创建一个Service。

./service/User.js
```js
import Service from 'react-service';

class User extends Service{ // 每个Service继承自react-service中的Service
  gets(){
    if(!this.$data.users){ // 数据存储在 $data 中
      // HTTP调用服务端提供的接口获取数据
      var users = [
        {id: 10, name: 'CYF'},
        {id: 20, name: '张三丰'},
        {id: 30, name: '袁崇焕'}
      ];
      // 将数据使用 $set 方法存储到 $data 中
      this.$set('users', users);
    }
  }
  
  remove(id){
    var idx = this.$data.users.findIndex((T) => {
      return T.id == id;
    });
    if(id >= 0){
      this.$data.users.splice(idx, 1);
      // 数据发生改变后，并不会立即应用到UI中，需调用 $apply 方法使之体现到UI中
      this.$apply();
    }
    
    // // 第二种方式
    // var users = this.$data.users.filter((T) => {
    //   return T.id != id;
    // });
    // // 使用 $set 方法重新设置数据，将立即体现在UI中，而不用调用 $apply 方法
    // this.$set('users', users);
  }
}
```

./App.js
```js
import React from 'react';
import {View, Text, Button} from 'react-native';

import User from './service/User';

class App extends React.Component {
  constructor(props){
    super(props);
    
    // 初始化Service，将当前组件作为参数传入，
    // 这样，当前组件的状态就能在Service中维护了
    this.user = User.init(this);
    
    // 调用Service中的方法获取数据
    this.gets();
  }
  
  remove(id){
    // 调用Service中的remove方法
    this.user.remove(id);
  }
  
  render(){
    // UI中的数据从Service的$data获取
    return <View>
      {
        this.user.$data.users
        ?
        this.user.$data.users.map((T) => {
          return <View>
            <Text>{T.id} : {T.name}</Text>
            <Button title="Remove" onPress={()=>this.remove(T.id)}/>
          </View>
        })
        :
        null
      }
    </View>
  }
}
```
