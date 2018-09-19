import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
} from 'react-native';
import BaseComponent, { BaseStyles } from "../page/BaseComponent";
import HttpUtils from "../util/HttpUtils";
import BaseUrl from '../util/BaseUrl';
import DialogUtils from '../util/DialogUtils';
import FastImage from 'react-native-fast-image'
import { Carousel } from 'teaset';


//订单公用类（相当于Fragment）
const window_w = require('Dimensions').get('window').width;
export const KEYS = [""]
export default class AdView extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            bannerArray: [],
        }
        this.userInfo = this.getUserInfo();
    }

    static defaultProps = {
        height: window_w / 3,//默认高度
        width: window_w,
        action:"home"
    }

    //界面加载完成
    componentDidMount() {
       this.getData()

    }

    /**
    * 获取数据
    * @param {*} isRefesh  是否刷新
    * @param {*} pageIndex 
    */
    getData() {
        if (this.props.action=="home"){
            this. url = BaseUrl.getBanner()
        } else  if (this.props.action=="store"){
            this. url = BaseUrl.getMallBanner()
        }
       // alert(this. url )
        HttpUtils.getData(this.url)
            .then(result => {
                if (result.code === 1) {
                    this.setState({
                        bannerArray: result.data
                    })
                } else {
                    DialogUtils.showToast(result.msg)
                }
            })
    }

    setImgToBanner(bannerArray) {
        var views = []
        bannerArray.forEach((element, index) => {
            views.push(
                <TouchableOpacity key={index.toString()} onPress={() => this.onClick(element)} activeOpacity={1}>
                    <Image style={{ width:this.props.width, height: this.props.height }}
                           resizeMode='cover' source={{ uri: this.getImgUrl(element.pic) }} />
                </TouchableOpacity>)
        });
        return views;
    }

    onClick(data){
        let type = data.bannerType?data.bannerType:-1
       // alert(type)
        switch (type) {
            case 1:
                alert(type)
                this.props.navigation.navigate('StroeDetails',{
                    storeId:data.shopId?data.shopId:0
                });
                break
            case 2:
                this.props.navigation.navigate('BusinessUnion');
                break
            case 3:
                this.props.navigation.navigate('ShopDetails',{
                    shopId:data.goodsId?data.goodsId:0
                });
                break
            case 4:

                break
            default:
                break
        }    

    }


    render() {
        return (
                <Carousel
                    style={{ width: this.props.width, height: this.props.height }}
                    control={() => { return <Carousel.Control /> }}
                >
                    {this.setImgToBanner(this.state.bannerArray)}
                </Carousel>
        );
    }
}
export const styles = StyleSheet.create({
    container_center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // position:"absolute",  //绝对布局
    },
});