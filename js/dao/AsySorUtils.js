
import { AsyncStorage } from 'react-native';
import DialogUtils from '../util/DialogUtils';

/**
 * 本地文件保存 这个类保存和读取都是异步的， 不能保存实时读取和使用的信息 只能保存一些配置信息，
 * 
 * 如果要保存用户信息 建议 一定要使用 mobx  
 * 
 * 以下 保存用户信息 已经废了 我已经改成用mobx保存 或者 全局变量保存了 
 */
export default class AsySorUtils {

    /**
     * user信息   "userid": 26536,
            "account": "13923044417",
            "mobile": "13923044417",
            "username": "刘丶丶",
            "sessionId": "07978ff98dc14660a42a751ca4145c70",
            "userCredit": 5,
            "useGrade": 0,
            "imgHead": "http://tz.hxksky.com/wepay/upload/toux-icon.png",
            "isReward": 1,
            "walletAdd": "41QdCdW46NNV0Ymm3zmzTyghUe16v0a0cP",
            "cangkuNum": 14.2282,
            "fengmiNum": 501.996,
            "todayReleas": 1.004
     * @param {*} info 
     */
    static saveUser(info, callback) {
        AsyncStorage.setItem('userInfo', JSON.stringify(info), (error) => {
            if (error) {
                DialogUtils.showToast("保存异常" + error.message)
                callback()
            } else {
                callback(info)
            }
        });
    }

   


    static  getUser(callback) {
        AsyncStorage.getItem('userInfo', (error, result) => {
            if (!error) {
                callback(JSON.parse(result))
            } else {
                callback(undefined);
            }
            return result
        })
    }
    

    static saveAccountPwd(info, callback) {
        AsyncStorage.setItem('account and password', JSON.stringify(info), (error) => {
            if (error) {
                DialogUtils.showToast("保存异常" + error.message)
            }
        });
    }
    static getAccountPwd(callback) {
        AsyncStorage.getItem('account and password', (error, result) => {
            if (!error) {
                callback(JSON.parse(result))    
            } else {
                callback(null);
            }
            return result
        })
    }

    static async getUserByAwait() {
        try {
            let userInfo =   await AsyncStorage.getItem('userInfo')
            // alert("getUserByAwait"+userInfo)
            //callback(JSON.parse(userInfo))
            return JSON.parse(userInfo)
        } catch (error) {
            //callback(null) 
            return null
        }
      
    }
}