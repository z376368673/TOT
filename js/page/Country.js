import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
} from 'react-native';
import BaseComponent, { BaseStyles } from "./BaseComponent";
import NavigationBar from "../common/NavigationBar";
import Utils from "../util/Utils";
import RefreshFlatList2 from "../common/RefreshFlatList2";
import HttpUtils from "../util/HttpUtils";
import BaseUrl from '../util/BaseUrl';
import DialogUtils from '../util/DialogUtils';

/**
 * 选择国家
 */

const width = Utils.getWidth()
export default class Country extends BaseComponent {
    pageIndex = 1;
    constructor(props) {
        super(props);
        this.userInfo = this.getUserInfo();
        const {country}  =  this.props.navigation.state.params
        this.state={
            selectCountry:country
        }
        this.countryArr = ["英国","澳大利亚","印度","泰国","德国","印度尼西亚","马来西亚"
        ,"老挝","中国香港","日本","新加坡","菲律宾","中国台湾","美国","韩国","中国澳门","越南"
        ,"中国","加拿大","孟加拉国","意大利","哥斯达黎加","西班牙","法国","匈牙利","希腊"
        ,"比利时","荷兰","哈萨克斯坦","俄罗斯","缅甸","葡萄牙","阿根廷","蒙古","南非","巴西"
        ,"保加利亚","罗马尼亚","瑞典","新西兰","挪威","阿尔及利亚","墨西哥","安哥拉","文莱","斯里兰卡","尼日利亚"
        ,"塞内加尔","毛里塔尼亚","几内亚","塞拉利昂","冈比亚","加纳","喀麦隆","科特迪瓦"]
    }

    //界面加载完成
    componentDidMount() {
        this._refreshData()
    }

    render() {
        return (
            <View style={BaseStyles.container_column}>
                <NavigationBar
                    title={"选择国家"}
                    navigation={this.props.navigation}
                />
                <View style={{ justifyContent: "center",padding:10}}>
                        <Text style={{ color: '#333',fontSize: 13,}}>当前选择国家/地区:{this.state.selectCountry}</Text>
                    </View>
                <View style={{ flex: 1, marginTop: 1, backgroundColor: "#fff" }}>
                    <RefreshFlatList2
                        ref={refList => this.refList = refList}
                        onRefreshs={() => {
                            this._refreshData()
                        }}
                        renderItem={(item) => this._getItem(item)} />
                </View>
            </View>
        );
    }
    //刷新数据
    _refreshData() {
        this.refList.setData(this.countryArr)
    }
    _getItem(data) {
        return <View style={{
            borderBottomWidth: 0.5,
            borderColor: '#CCC',
            backgroundColor: '#fff',
            paddingBottom: 10,
            paddingTop: 10,
            paddingLeft: 5,
            paddingRight: 5,
        }}>
            <TouchableOpacity onPress={() => {
                 let  exis =   this.props.navigation.state.params.selectCountry
                 if(exis){
                    this.props.navigation.state.params.selectCountry(data.item)
                   this.props.navigation.goBack()
                 }
            }}>
              <View style={{ justifyContent: "center",}}>
                        <Text style={{
                            color: '#333',
                            fontSize: 13,
                        }}>{data.item}</Text>
                    </View>
            </TouchableOpacity>
        </View>
    }

}
