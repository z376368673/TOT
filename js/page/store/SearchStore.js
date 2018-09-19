import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Image,
    Button,
    ImageBackground,
} from 'react-native';
import BaseComponent, { BaseStyles, mainColor, window_width } from "../BaseComponent";
import NavigationBar from "../../common/NavigationBar";
import HttpUtils from "../../util/HttpUtils";
import BaseUrl from "../../util/BaseUrl";
import { SegmentedBar, Drawer } from 'teaset';
import Utils from '../../util/Utils';
import StoreCommon from '../../common/StoreCommon';
import SplashScreen from "react-native-splash-screen"
import ViewUtils from '../../util/ViewUtils';
import RefreshFlatList from "../../common/RefreshFlatList"
import DialogUtils from '../../util/DialogUtils';

//商品搜索页
const window_w = Utils.getWidth();
export default class SearchStore extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            keyword:"",
            activeIndex: 0,
            typeArr:[],
        }
        this.userInfo = this.getUserInfo();
        this.typeId = ""
    }
    //界面加载完成
    componentDidMount() {
        //this._refreshData()
        this.getCateList()
    }
      //刷新数据
    _refreshData() {
        this.refList.refreshStar()
        this.pageIndex = 1;
        this.getData(true)
    }
    //加载更多数据
    _onLoadData() {
        this.getData(false)
    }

    /**
    * 获取数据
    * @param {*} isRefesh  是否刷新
    * @param {*} pageIndex 
    */
    getData(isRefesh) {
        this.url = BaseUrl.getShopBySearch(this.userInfo.sessionId, this.pageIndex,this.state.keyword,this.typeId)
        //alert(JSON.stringify(this.url))
        HttpUtils.getData(this.url)
            .then(result => {
                //alert(JSON.stringify(result.data))
                if (result.code === 1) {
                   
                    if (isRefesh) {
                        this.refList.setData(result.data)
                        if(result.data.length<1){
                            DialogUtils.showToast("暂无消息") }
                    } else {
                        this.refList.addData(result.data)
                    }
                    this.pageIndex += 1
                    if(result.data.length<1){
                        DialogUtils.showToast("暂无数据")
                    }
                }  else if(result.code === 2||result.code === 4){
                    DialogUtils.showToast(result.msg)
                    this.goLogin(this.props.navigation)
                }else {
                    DialogUtils.showToast(result.msg)
                }
            })
           
    }

   //导航右边更多按钮
   getRightStyle_View() {
    return (
        <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center', }}
                onPress={() => this.leftDrawView()}
            >
               <Text style={{fontSize:16,color:"#fff",padding:5}}>分类</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center', }}
                onPress={() => this._refreshData()}
            >
                <Image
                    style={{ width: 25, height: 25, padding: 5, marginLeft: 10 }}
                    source={require("../../../res/images/sousuo-3.png")} />
            </TouchableOpacity>
        </View>)

}
    render() {
        return (
            <View style={[BaseStyles.container_column, { backgroundColor: "#f1f1f1" }]}>
                <NavigationBar
                    navigation={this.props.navigation}
                    titleView={() => this.searchView()}
                    rightView={this.getRightStyle_View()}
                />
                <View style={{ flex: 1, backgroundColor: "#f1f1f1" }}>
                <RefreshFlatList
                    ref={refList => this.refList = refList}
                    numColumns={ 2 }
                    isDownLoad ={true}
                    onRefreshs={() => this._refreshData()}
                    onLoadData={() => this._onLoadData()}
                    renderItem={(items) =>  this._getStore(items)} />
            
                </View>
            </View>
        );
    }
    searchView() {
        return (<View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={{ marginLeft:-60, width: 230, backgroundColor: "#fff", height: 35, borderRadius: 18, flexDirection: "row", alignItems: "center" }}>
                <Image style={{ height: 30, width: 30, marginLeft: 10 }} source={require("../../../res/images/sousuo-shang.png")} />
                <TextInput
                    style={[{
                        height: 35, flex: 1, fontSize: 13, color: '#333', backgroundColor: "#fff", padding: 5, marginRight: 20,
                        borderColor: "#ccc",
                    }]}
                    placeholder={'请输入商品名称'}
                    //defaultValue={userName}
                    placeholderTextColor={'#999'}
                    underlineColorAndroid='transparent'
                    keyboardType={"default"}
                    maxLength={12}
                    onChangeText={(text) => this.setState({ keyword: text })} />
            </View>
        </View>);
    }

    /**
     * 获取商品分类
     */
    getCateList() {
        let url = BaseUrl.getCateList()
        HttpUtils.getData(url)
            .then(result => {
                if (result.code === 1) {
                    this.setState({
                        typeArr:result.data,
                    })
                }
            })
    }
    leftDrawView() {
        let views = [];
        this.state.typeArr.forEach((element, index) => {
            views.push(this._renderTypeItem(element,index))
        });

        let listview = <View style={{ backgroundColor: "#fff", width: 120, flex: 1, flexDirection: "column", marginTop: 60 }}>
            {/* <View style={{ backgroundColor:"#fff", flex: 1,}}></View> */}
            {views}
        </View>
        this.drawer = Drawer.open(listview, 'left', "translate");
    }
    /**
     * 分类列表的item
     * @param {*} data 
     */
    _renderTypeItem(data,index) {
        let item = 
        <View style={{flexDirection:"column"}}>
        <TouchableOpacity
            key={index.toString()}
            onPress={() => {
                this.drawer && this.drawer.close()
                //选中的商品分类传到商品的界面 
                this.typeId = data.id;
                this._refreshData()
            }}
        >
            <Text style={{ fontSize: 16, color: "#333", padding: 15, }}>{data.name}</Text>
        </TouchableOpacity>
        <View style={{height:1,backgroundColor:"#eee"}}/>
        </View>
        return item;
    }

      /** 商品
          * 绘制itemView
          * @param data
          * @returns {*}
          * @private
          */
         _getStore(data) {
            return <View
                style={{
                    maxWidth:window_width/2-4,
                    backgroundColor: '#fff',
                    alignItems: 'center',
                    marginBottom: 4,
                    flexDirection: "column",
                    marginLeft: 2,
                    marginRight: 2,
                }}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={{ width: window_w / 2 - 4, height: window_w / 2, }}
                    onPress={(item) => this.goDetails(data.item)}>
                    <Image
                        style={{ width: window_w / 2 - 4, height: window_w / 2, }}
                        source={{uri:this.getImgUrl(data.item.coverPlan)}} />
                </TouchableOpacity>
    
                <View style={{ flexDirection: 'column', padding: 5, height: 60, justifyContent: "center", alignContent: "center" }}>
                    <Text style={{ color: "#333333", fontSize: 18, }} numberOfLines={1}>
                        {data.item ? data.item.goodsName : "name"}</Text>
    
                    <View style={{ flexDirection: 'row', marginTop: 5 }}>
                        <Text style={{
                            color: "#d11",
                            fontSize: 15,
                        }}>￥{data.item.goodsPrice}</Text>
                        <Text style={{
                            color: "#888",
                            fontSize: 15,
                            marginLeft: 30,
                        }}>库存:{data.item.goodsStock}</Text>
                    </View>
                </View>
            </View>
        }
    /**
     * 去商品的详情页
     * @param {*} item 
     */
    goDetails(item) {
        this.props.navigation.navigate('ShopDetails', {
            shopId: item.id,
        });
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