import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
} from 'react-native';
import BaseComponent, {BaseStyles} from "../page/BaseComponent";
import HttpUtils from "../util/HttpUtils";
import BaseUrl from '../util/BaseUrl';
import DialogUtils from '../util/DialogUtils';
import FastImage from 'react-native-fast-image'
import {Carousel, Theme} from 'teaset';
import Colors from "../util/Colors";


//订单公用类（相当于Fragment）
const window_w = require('Dimensions').get('window').width;
export const KEYS = [""]
export default class ViewPager extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            dataArray: this.props.data
        }
        // alert(this.props.data.length)
        Theme.carouselDotColor = "#999"
        Theme.carouselActiveDotColor = "#d11"
        this.userInfo = this.getUserInfo();
    }

    static defaultProps = {
        height: window_w / 3,//默认高度
        width: window_w,
        data: [],
        carousel: false,//是否轮播
        //itemView:(data,index)=>this.itemView(data,index),
        onChange: (index) => {
        },
    }

    //界面加载完成
    componentDidMount() {

    }

    itemView(data, index) {
       // alert(data)
        let view = this.props.itemView ? this.props.itemView(data, index) :
            <TouchableOpacity
                key={index+""}
                onPress={() => {
                }}
                activeOpacity={0.8}>
                <FastImage
                    style={{width: this.props.width, height: this.props.height}}
                    source={{uri:this.getImgUrl(data)}}/>
            </TouchableOpacity>

        return view
    }

    createView() {
        let views = []
         this.props.data.map((value,index)=>{
                views.push(this.itemView(value,index))
            })
        //轮播图需要至少两个图片
        // if (views.length==1){
        //     views = views.concat(views)
        // }
        return views
    }

    render() {
        return (
            <View  style={{width: this.props.width, height: this.props.height}}>

                {this.props.data.length>1?<Carousel
                    style={{width: this.props.width, height: this.props.height}}
                    control={() => { return <Carousel.Control/>}}
                    onChange={index => this.props.onChange(index)}
                >
                    {this.createView()}
                </Carousel>:
                this.itemView(this.props.data.length>0?this.props.data[0]:[],0)
                }
            </View>

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