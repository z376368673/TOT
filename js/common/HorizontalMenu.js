import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image, ScrollView,
} from 'react-native';
import BaseComponent, {BaseStyles} from "../page/BaseComponent";
import HttpUtils from "../util/HttpUtils";
import BaseUrl from '../util/BaseUrl';
import DialogUtils from '../util/DialogUtils';
import FastImage from 'react-native-fast-image'
import {Carousel, Label, SegmentedBar, Theme} from 'teaset';
import Colors from "../util/Colors";
//订单公用类（相当于Fragment）
const window_w = require('Dimensions').get('window').width;
export const KEYS = [""]
export default class HorizontalMenu extends BaseComponent {
    constructor(props) {
        super(props);
        //this.barScrollItems = this.props.data?this.props.data:['全部'];
        this.state = {
            activeIndex: 0,
            animated: true,
            //barScrollItems:this.props.data?this.props.data:['全部']
        };
    }

    static defaultProps = {
        height: window_w / 3,//默认高度
        width: window_w,
        onSegmentedBarChange:()=>{},
        titleStyle:{}, //未选中的文字样式
        activeTitleStyle:{},//选中的文字样式
        style:{},
    }

    //界面加载完成
    componentDidMount() {
        // this.getData()
    }

    onSegmentedBarChange(index,value) {
        if (index != this.state.activeIndex) {
            this.setState({activeIndex: index});
            if (this.refs.carousel) {
                this.refs.carousel.scrollToPage(index, false);
            }
            this.props.onSegmentedBarChange(index,value)
        }
    }
    onCarouselChange(index) {
        index != this.state.activeIndex && this.setState({activeIndex: index});
    }
    render() {
        let {animated, activeIndex} = this.state;
        let {titleStyle, activeTitleStyle, style , data }= this.props;
        let barScrollItems =data;
        return (
            <View style={[{height: 45}]}  >
                <SegmentedBar
                    justifyItem={"scrollable"}
                    indicatorType={"customWidth"}
                    indicatorPosition={"bottom"}
                    indicatorWidth={40}
                    indicatorLineColor={Colors.mainColor}
                    indicatorLineWidth={2}
                    indicatorPositionPadding={2}
                    animated={animated}
                    autoScroll={true}
                    activeIndex={activeIndex}
                    onChange={index => this.onSegmentedBarChange(index,barScrollItems[index])}
                >
                    {barScrollItems.map((item, index) =>
                        <SegmentedBar.Item key={'item' + index}
                                           title={item}
                                           style={style}
                                           titleStyle={titleStyle}
                                           activeTitleStyle={activeTitleStyle}
                                           />)}
                </SegmentedBar>
                {/*<Carousel*/}
                    {/*style={{*/}
                        {/*backgroundColor: Theme.defaultColor,*/}
                        {/*height: 238,*/}
                        {/*borderTopWidth: 1,*/}
                        {/*borderTopColor: Theme.pageColor*/}
                    {/*}}*/}
                    {/*carousel={false}*/}
                    {/*startIndex={activeIndex}*/}
                    {/*cycle={false}*/}
                    {/*ref='carousel'*/}
                    {/*onChange={index => this.onCarouselChange(index)}*/}
                {/*>*/}
                    {/*{barScrollItems.map((item, index) => (*/}
                        {/*<View key={'view' + index} style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>*/}
                            {/*<Label type='detail' size='xl' text={item}/>*/}
                        {/*</View>*/}
                    {/*))}*/}
                {/*</Carousel>*/}

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