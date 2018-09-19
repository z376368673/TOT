import AppNavigator from './js/navigators/AppNavigator'
import React, { Component } from 'react';
import { Provider } from 'mobx-react';
import AppStore from './js/AppStore';
const stores ={
    AppStore,
} 
export default class indexPage extends Component {
    render() {
        return (
            //配置mobx 的 Store 
            <Provider {...stores}>
                <AppNavigator/>
            </Provider>
        )}
}

//export default AppNavigator
// 关闭指定警告
console.ignoredYellowBox = [ 'Warning: isMounted(...)','Warning: Failed prop type' ];
// 关闭全部的警告
//console.disableYellowBox = true;
