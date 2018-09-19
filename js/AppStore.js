import { observable, computed, action, autorun } from "mobx";
import Utils from "./util/Utils";

class  AppStore{

    @observable userInfo; //用户信息
    @action 
    setUserInfo(userInfo){
        var cangkuNum = userInfo.cangkuNum
        var fengmiNum = userInfo.fengmiNum
        userInfo.cangkuNum = Utils.formatNumbers(cangkuNum,2)
        userInfo.fengmiNum = Utils.formatNumbers(fengmiNum,2) //new Number(fengmiNum).toFixed(2)
        this.userInfo = userInfo;
    }
    //屏幕宽高
    width = require('Dimensions').get('window').width
    height = require('Dimensions').get('window').height
    
}

export default new AppStore()