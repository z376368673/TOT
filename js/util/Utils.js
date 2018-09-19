import DialogUtils from './DialogUtils';
import area from "../../res/raw/area.json"
import React from 'react';
import { Platform, CameraRoll } from 'react-native';

export default class Utils {

    static getWidth() {
        return require('Dimensions').get('window').width
    }
    static getHeight() {
        return require('Dimensions').get('window').height
    }
    static  isFullScreenPhone(){
       return this.getHeight()/this.getWidth()<18/10&&Platform.OS==="ios"?false:true
    }


    /**
     * 检查该Item是否被收藏
     * **/
    static checkFavorite(item, items) {
        for (var i = 0, len = items.length; i < len; i++) {
            let id = item.id ? item.id : item.fullName;
            if (id.toString() === items[i]) {
                return true;
            }
        }
        return false;
    }

    /**
     * 检查项目更新时间
     * @param longTime 项目更新时间
     * @return {boolean} true 不需要更新,false需要更新
     */
    static checkDate(longTime) {
        return false;
        let currentDate = new Date();
        let targetDate = new Date();
        targetDate.setTime(longTime);
        if (currentDate.getMonth() !== targetDate.getMonth()) return false;
        if (currentDate.getDate() !== targetDate.getDate()) return false;
        if (currentDate.getHours() - targetDate.getHours() > 4) return false;
        // if (currentDate.getMinutes() - targetDate.getMinutes() > 1)return false;
        return true;
    }


    /**
     * 
     * 
        static getCurrentPosition(geo_success, geo_error?, geo_options?)
        该方法用于获取当前的位置，其参数如下：
        （1）geo_success：成功回调函数
        （2）geo_error：失败回调函数
        （3）geo_options：传递的参数。其支持的属性有：
            timeout：指定获取地理位置的超时时间，默认不限时。单位为毫秒。
            maximumAge：最长有效期，在重复获取地理位置时，此参数指定多久再次获取位置。默认为 0，表示浏览器需要立刻重新计算位置。
            enableHighAccuracy：指示浏览器获取高精度的位置，默认为 false。当开启后，可能没有任何影响，也可能使浏览器花费更长的时间获取更精确的位置数据
     * 
     * @param {*} callback 
     */
    static getLocation(callback,error) {
        //获取经纬度
        navigator.geolocation.getCurrentPosition(
            // navigator.geolocation.watchPosition(
            (location) => {
                var result = "速度：" + location.coords.speed +
                    "\n经度：" + location.coords.longitude +
                    "\n纬度：" + location.coords.latitude +
                    "\n准确度：" + location.coords.accuracy +
                    "\n行进方向：" + location.coords.heading +
                    "\n海拔：" + location.coords.altitude +
                    "\n海拔准确度：" + location.coords.altitudeAccuracy +
                    "\n时间戳：" + location.timestamp;
                // let longitude = JSON.stringify(location.coords.longitude);//精度
                // let latitude = JSON.stringify(location.coords.latitude);//纬度 
                callback(location.coords)
                DialogUtils.showToast("定位成功")
            },
            ()=> {
               error("定位失败,请开启权限")
                //DialogUtils.showToast("定位失败,请开启权限"+JSON.stringify(error))
              //  console.warn(error.message)
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
    }

    /**
          *  根据经纬度获取地址信息
          * @param {*} longitude 
          * @param {*} latitude 
          */
    static getCityInfoBy(longitude, latitude, callback) {
        fetch('http://restapi.amap.com/v3/geocode/regeo?key=7905a31aeab2f2134f1a6a06f6b63e79&location=' + longitude + ',' + latitude + '')
            .then((response) => response.json())
            .then((responseBody) => {
                if (responseBody.status == 1) {
                    callback(responseBody.regeocode.addressComponent)
                } else {
                    DialogUtils.showToast('定位失败')
                }
            }).catch((error) => {
                DialogUtils.showToast("getCityInfoBy:" + error.message);
            })
    };
    static chkPrice(obj) { //方法1
        obj = obj.replace(/[^\d.]/g, "");
        //必须保证第一位为数字而不是. 
        obj = obj.replace(/^\./g, "");
        //保证只有出现一个.而没有多个. 
        obj = obj.replace(/\.{2,}/g, ".");
        //保证.只出现一次，而不能出现两次以上 
        obj = obj.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
         //newText =  new Number(newText).toFixed(2)
        if(obj.indexOf(".")>=0&&obj.length-obj.indexOf(".")>2){
            obj = new Number(obj).toFixed(2)
        }
        return obj;
    }
    static chkCurrency(obj,num) { //方法1
        obj = obj.replace(/[^\d.]/g, "");
        //必须保证第一位为数字而不是. 
        obj = obj.replace(/^\./g, "");
        //保证只有出现一个.而没有多个. 
        obj = obj.replace(/\.{2,}/g, ".");
        //保证.只出现一次，而不能出现两次以上 
        obj = obj.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
        if(obj.indexOf(".")>=0&&obj.length-obj.indexOf(".")>num){
            obj = new Number(obj).toFixed(num)
        }
        return obj;
    }
    /**
     * 格式化小数点保留位数
     * @param {*} str  数字
     * @param {*} num  保留小数位
     */
    static formatNumBer(str,num){
       return new Number(str).toFixed(num)?new Number(str).toFixed(num):0
    }
    /**
     * 检测是否是数字 包含小数点
     * @param {*} str 
     * @param {*} num 小数位
     */
    static regNumber(str){
        let regPrice =/^[0-9]+.?[0-9]*$/
        if (regPrice.test(str)) {
            return true
        }
        return false
    }

    /** 
     * 检测是否是2位小数    比如 regNumber(0.21234) 返回 false    regNumber(0.24) 返回 true  
     * @param {*} num 
     */
    static regPrice(num){
        let regPrice = /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/
        if (regPrice.test(num)) {
            return true
        }
        return false
    }

    /**
     * 截取小数点  num
     * @param s
     * @param num
     * @returns {string}
     */
    static formatNumbers(s,num) {
        var value = String(s)
        if (value.indexOf(".")>=0){
            value = value.substring(0, value.indexOf(".") + num + 1)
        }
        return value
    }




    static formatDateTime(inputTime, symbol) {
        let sb = symbol ? symbol : '/'
        var date = new Date(inputTime);
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        var h = date.getHours();
        h = h < 10 ? ('0' + h) : h;
        var minute = date.getMinutes();
        var second = date.getSeconds();
        minute = minute < 10 ? ('0' + minute) : minute;
        second = second < 10 ? ('0' + second) : second;
        return y + sb + m + sb + d + ' ' + h + ':' + minute + ':' + second;
    }


    static formatDateGetHour(inputTime) {
        let sb =  '/'
        var date = new Date(inputTime);
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        var h = date.getHours();
        h = h < 10 ? ('0' + h) : h;
        var minute = date.getMinutes();
        var second = date.getSeconds();
        minute = minute < 10 ? ('0' + minute) : minute;
        second = second < 10 ? ('0' + second) : second;
        return  h + ':' + minute
    }


    /**
     *   获取省市区数据
     */
    static createPCA() {
        let data = [];
        let len = area.length;
        for (let i = 0; i < len; i++) {
            let city = [];
            for (let j = 0, cityLen = area[i]['city'].length; j < cityLen; j++) {
                let _city = {};
                _city[area[i]['city'][j]['name']] = area[i]['city'][j]['area'];
                city.push(_city);
            }
            let _data = {};
            _data[area[i]['name']] = city;
            data.push(_data);
        }
        return data;
    }


}

