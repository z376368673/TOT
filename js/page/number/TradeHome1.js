import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    Image,
    ScrollView,
    Platform,
    View, TextInput, Modal, RefreshControl
} from 'react-native';
import BaseComponent, {mainColor, upDataUserInfo} from "../BaseComponent";
import RefreshFlatList from "../../common/RefreshFlatList"
import Colors from "../../util/Colors"
import {Button, Overlay} from 'teaset';
import Echarts from 'native-echarts';
import DialogUtils from "../../util/DialogUtils";
import BaseUrl from "../../util/BaseUrl";
import HttpUtils from "../../util/HttpUtils";
import Utils from "../../util/Utils";
import PassWordInput from "../../common/PassNumInput";
import Values from "../../model/CurrencyValues"

//交易中心首页

export default class TradeHome1 extends BaseComponent {
    constructor(props) {
        super(props);

        const cid = this.props.navigation.state.params.cid
            this.state = {
            isRefresh: false, //scrollview 的刷新按钮
            cid:cid,  //1.TOT 2.比特币 3.莱特币  4.以太坊  5.狗狗币
            title:this.getTitleByCid(cid),

            coinBalance: "0.00", //TOT资产
            walletBalance: "0.00", //余额

            coinPrice:"0.00",//当前价格
            maxPrice:"0.00",//最高价
            minPrice:"0.00",//最低价

            echartsType: 0,  //0：5分钟 ， 1：5小时 ，2：日线
            xdata:[],
            ydata:[],
            activeIndex: 0,//0余额购买 ，1余额出售

            modalVisible:false,
            unitPrice:"0.00",//单价
            number:"0.00",//数量

        }
        this.userInfo = this.getUserInfo()

        this.cid = cid;
        this.activeIndex = 0;

        this.oneHour = [];
        this.fiveHour = [];
        this.dateLine = [];

    }

    componentDidMount() {
       // SplashScreen.hide();
        this.refreshAllData()
    }

    refreshAllData(){
        this.setState({isRefresh:true,})
        this.geTopData(this.cid)
        this._refreshData()
    }

    geTopData(){
        let url = BaseUrl.coinDeal(this.userInfo.sessionId,this.cid)
        HttpUtils.getData(url)
            .then(result => {
                this.setState({isRefresh:false,})
                if (result.code === 1) {
                    //alert(JSON.stringify(result.data))
                    this.setState({
                        coinBalance: result.data.coinBalance,
                        walletBalance: result.data.walletBalance,
                        coinPrice: result.data.coinPrices,//当前价格
                        maxPrice: result.data.maxPrice,//最高价
                        minPrice: result.data.minPrice,//最低价
                    })
                    Values.coinBalance=result.data.coinBalance
                    Values.walletBalance=result.data.walletBalance
                    Values.coinPrice=result.data.coinPrices
                    this.oneHour = result.data.oneHour;
                    this.fiveHour = result.data.fiveHour;
                    this.dateLine = result.data.dateLine;
                    this.getEchartsData(this.state.echartsType)
                }  else if (result.code === 2||result.code === 4) {
                    DialogUtils.showToast(result.msg)
                    this.goLogin(this.props.navigation)
                } else {
                    DialogUtils.showToast(result.msg)
                }

            })
    }

    getEchartsData(i){
        let data
        if (i===0){
            data = this.oneHour;
        }else if (i===1){
            data = this.fiveHour;
        }else if (i===2){
            data = this.dateLine;
        }
        var dateArr = []
        var dataArr = []
        for (let i = 0; i <data.length; i++) {
            let obj = data[i]
           let dates  = Utils.formatDateGetHour(obj.coinAddtime*1000)
            dateArr.push(dates)
            dataArr.push(obj.coinPrice)
        }
       // alert(JSON.stringify(dateArr))
        this.setState({
            xdata:dateArr.reverse(),
            ydata:dataArr.reverse(),
        })

    }
    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }
    creatHeadView(){
        let { activeIndex } = this.state;
        // 指定图表的配置项和数据
        var min =  Math.min.apply(Math, this.state.ydata);
        var options = {
            //点击某一个点的数据的时候，显示出悬浮窗
            tooltip: {
                trigger: 'axis'
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data:this.state.xdata,
                // axisLabel:{
                //     //showMinLabel: true,
                //     showMaxLabel: true,
                // },
            },
            yAxis: {
                //offset:-String(min).length*2+5, //y轴偏移位置
                type: 'value',
                name:"y",
                min:"dataMin",//min,
                // axisLabel: { //格式化y轴数据，奈何数字长短 太不规律 格式化了也没用
                //     margin: 2,
                //     formatter: function (value, index) {
                //         if (value >= 1000) {
                //             value =  new Number(value / 1000) + "k";
                //         }
                //         return value;
                //     }
                // },
            },
            grid: { //设置折线图与周边的距离
                left: 45,
                right:20,
                // top:10,
                // bottom:10,
            },
            show:false,
            color: ["#d15"],
            animation:false,
            series: [{
                name: this.state.title,
                data: this.state.ydata,
                type: 'line',
            }]
        };

        return (
            <View style={{ backgroundColor: Colors.bgColor }}>

                {/* 顶部布局  资产  余额*/}
                <View style={[{
                    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around',
                    padding: 10, backgroundColor: mainColor
                }]}>
                    <TouchableOpacity
                        activeOpacity={0.8} >
                        <View style={{ flexDirection: 'column', alignItems: "center", width: Utils.getWidth() / 2 }}>
                            <Text style={{ fontSize: 16, color: '#fff' }}>{this.state.title}资产</Text>
                            <Text style={{ fontSize: 16, color: '#fff' }}>{this.state.coinBalance}</Text>
                        </View></TouchableOpacity>
                    <View style={{ height: 30, width: 0.5, backgroundColor: '#fff' }} />
                    <TouchableOpacity activeOpacity={0.8}>
                        <View style={{ flexDirection: 'column', alignItems: "center", width: Utils.getWidth() / 2 }}>
                            <Text style={{ fontSize: 16, color: '#fff' }}>余  额</Text>
                            <Text style={{ fontSize: 16, color: '#fff' }}>{this.state.walletBalance}</Text>
                        </View></TouchableOpacity>
                </View>
                <View style={{ padding: 15, flexDirection: "row", backgroundColor: Colors.white }}>
                    <View style={{ flexDirection: "row", flex: 1, justifyContent: "center" }}>
                        <Text style={{ fontSize: 14, color: Colors.text8, }}>当前价格</Text>
                        <Text style={{ fontSize: 14, color: Colors.black, }}>{this.state.coinPrice}</Text>
                    </View>
                    <View style={{ flexDirection: "row", flex: 1, justifyContent: "center" }}>
                        <Text style={{ fontSize: 14, color: Colors.text8, }}>高</Text>
                        <Text style={{ fontSize: 14, color: Colors.black, }}>{this.state.maxPrice}</Text>
                    </View>
                    <View style={{ flexDirection: "row", flex: 1, justifyContent: "center" }}>
                        <Text style={{ fontSize: 14, color: Colors.text8, }}>低</Text>
                        <Text style={{ fontSize: 14, color: Colors.black, }}>{this.state.minPrice}</Text>
                    </View>
                </View>

                <View style={{ flexDirection: "row", alignItems: "center", paddingTop: 15, paddingBottom: 15, backgroundColor: Colors.white, marginTop: 1 }}>

                    <TouchableOpacity onPress={() => this.onClick(1)} style={{ flex: 1 }}>
                        <View style={{ alignItems: "center", justifyContent: "center" }}>
                            <Image source={require("../../../res/images/fabuchushou.png")} style={{ height: 40, width: 40, }} />
                            <Text style={{ color: this.state.selectIndex === 0 ? Colors.mainColor : Colors.text6, fontSize: 13, marginTop: 5 }}>发布出售订单</Text>
                        </View></TouchableOpacity>
                    <TouchableOpacity onPress={() => this.onClick(2)} style={{ flex: 1 }}>
                        <View style={{ alignItems: "center", justifyContent: "center" }}>
                            <Image source={require("../../../res/images/fabugoumai.png")} style={{ height: 40, width: 40, }} />
                            <Text style={{ color: this.state.selectIndex === 1 ? Colors.mainColor : Colors.text6, fontSize: 13, marginTop: 5 }}>发布购买订单</Text>
                        </View></TouchableOpacity>
                    <TouchableOpacity onPress={() => this.onClick(3)} style={{ flex: 1 }}>
                        <View style={{ alignItems: "center", justifyContent: "center", }}>
                            <Image source={require("../../../res/images/dingdan-shu.png")} style={{ height: 40, width: 40, }} />
                            <Text style={{ color: this.state.selectIndex === 2 ? Colors.mainColor : Colors.text6, fontSize: 13, marginTop: 5 }}>订单</Text>
                        </View></TouchableOpacity>
                    <TouchableOpacity onPress={() => this.onClick(4)} style={{ flex: 1 }}>
                        <View style={{ alignItems: "center", justifyContent: "center", }}>
                            <Image source={require("../../../res/images/jiaoyijilu-shu.png")} style={{ height: 40, width: 40, }} />
                            <Text style={{ color: this.state.selectIndex === 2 ? Colors.mainColor : Colors.text6, fontSize: 13, marginTop: 5 }}>交易记录</Text>
                        </View></TouchableOpacity>
                </View>
                <View style={{ backgroundColor: Colors.bgColor, height: 10 }} />
                {/* 折线统计图 */}
                <View style={{ flexDirection: "row", backgroundColor: Colors.white }}>
                    <Text style={{
                        borderColor: Colors.blue1, flex: 1, padding: 10, textAlign: "center", borderWidth: 0.5,
                        backgroundColor: this.state.echartsType === 0 ? Colors.blue1 : Colors.white,
                        color: this.state.echartsType !== 0 ? Colors.blue1 : Colors.white
                    }}
                          onPress={() => this.magicType(0)}
                    >一小时</Text>
                    <Text style={{
                        borderColor: Colors.blue1, flex: 1, padding: 10, textAlign: "center", borderWidth: 0.5,
                        backgroundColor: this.state.echartsType === 1 ? Colors.blue1 : Colors.white,
                        color: this.state.echartsType !== 1 ? Colors.blue1 : Colors.white
                    }}
                          onPress={() => this.magicType(1)}
                    >5小时</Text>
                    <Text style={{
                        borderColor: Colors.blue1, flex: 1, padding: 10, textAlign: "center", borderWidth: 0.5,
                        backgroundColor: this.state.echartsType === 2 ? Colors.blue1 : Colors.white,
                        color: this.state.echartsType !== 2 ? Colors.blue1 : Colors.white
                    }}
                          onPress={() => this.magicType(2)}
                    >日线</Text>
                </View>
                {/* 折线统计图 */}
                <View style={{ marginTop: -50, zIndex: -1, backgroundColor: Colors.white }}>
                    <Echarts option={options} height={240} width={Utils.getWidth()} />
                </View>

                <View style={{ flexDirection: "row", backgroundColor: Colors.bgColor, justifyContent: "center", padding: 10, marginTop: -30 }}>
                    <TouchableOpacity
                        onPress={() => this.selectIndex(0)}
                        style={{
                            borderColor: Colors.r1, borderWidth: 1, borderTopLeftRadius: 20, borderBottomLeftRadius: 20,
                            justifyContent: "center", alignItems: "center", backgroundColor: activeIndex ? Colors.white : Colors.red,
                            paddingLeft:35,paddingRight:20,paddingTop:10,paddingBottom:10
                        }}>
                        <Text style={{ color: activeIndex ? Colors.red : Colors.white }}>购买</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => this.selectIndex(1)}
                        style={{
                            borderColor: Colors.r1, borderWidth: 1, borderTopRightRadius: 20, borderBottomRightRadius: 20,
                            justifyContent: "center", alignItems: "center", backgroundColor: activeIndex ? Colors.red : Colors.white,
                            paddingLeft:20,paddingRight:35,paddingTop:10,paddingBottom:10
                        }} >
                        <Text style={{ color: activeIndex ? Colors.white : Colors.red }}>出售</Text>
                    </TouchableOpacity>
                </View>

            </View>
        )
    }


    render() {
        return (
            <View style={styles.container}>

                <View style={{
                    flexDirection: "row", justifyContent: "center", alignItems: "center",
                    backgroundColor: Colors.mainColor, height: 45, marginTop: Platform.OS === "ios" ? 20 : 0
                }}>
                    <TouchableOpacity
                        style={[{ paddingRight: 20, paddingTop: 10, paddingBottom: 10, position: "absolute", left: 10 },]}
                        onPress={() => this.props.navigation.goBack(null)} >
                        <Image source={require('../../../res/images/fanhui.png')} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        ref={title => this.title = title}
                        onPress={() => this.showPopover(this.title)}
                    >
                        <View style={{ alignItems: "center" }}>
                            <Text style={{ fontSize: 18, color: Colors.white, marginBottom: 3 }}>{this.state.title}</Text>
                            <Image source={require("../../../res/images/sanjiao.png")} />
                        </View></TouchableOpacity>

                </View>
                <View style={{ backgroundColor: Colors.bgColor }}>
                    <RefreshFlatList
                        ref={refList => this.refList = refList}
                        renderItem={(items) => this._getItem(items)}
                        onRefreshs={() => this._refreshData()}
                        onLoadData={()=>this._onLoadData()}
                        isDownLoad = {true}
                       // ListHeaderComponent={this.creatHeadView()}
                    />
                </View>

                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        alert("Modal has been closed.");
                    }}
                >
                    <View style={{backgroundColor:'rgba(0,0,0,0.4)',flex:1,height:Utils.getHeight(),justifyContent:"center"}}>
                    <View style={{backgroundColor: "#fff",marginLeft:20,marginRight:20, padding: 20, borderRadius: 8,justifyContent:"center", alignItems: 'center'}}>

                        <Text style={{fontSize:15,color:Colors.text6, alignSelf:"center"}}>像[{this.data?this.data.item.username:"xx"}]{!this.state.activeIndex?"购买":"出售"}{this.state.title}</Text>

                        <View style={{flexDirection:"row",width: Utils.getWidth()-80}}>
                            <Text style={{fontSize:15,color:Colors.text6, alignSelf:"center"}}>限 额:</Text>
                            <TextInput
                                style={{ flex:1,height:40,fontSize: 15, color: '#333',backgroundColor: "#fff"}}
                                placeholderTextColor={'#999'}
                                underlineColorAndroid='transparent'
                                keyboardType={"numeric"}
                                editable={false}
                                value={this.data?this.data.item.num+"":"1"}
                                maxLength={10}
                            />
                            <Text  style={{fontSize:15,color:Colors.text6, alignSelf:"center"}}>TOT</Text>
                        </View>
                        <View style={{backgroundColor:Colors.red,height: 1,width: Utils.getWidth()-80}}></View>

                        <View style={{flexDirection:"row",width: Utils.getWidth()-80}}>
                            <Text style={{fontSize:15,color:Colors.text6, alignSelf:"center"}}>价 格:</Text>
                            <TextInput
                                style={{ flex:1,height:40,fontSize: 15, color: '#333',backgroundColor: "#fff"}}
                                placeholder={'请输入出售价格'}
                                placeholderTextColor={'#999'}
                                underlineColorAndroid='transparent'
                                keyboardType={"numeric"}
                                editable={false}
                                value={this.data?this.data.item.dprice+"":""}
                                maxLength={12}
                                onChangeText={(text)=>{
                                    this.setState({unitPrice:text})
                                }}
                            />
                            <Text  style={{fontSize:15,color:Colors.text6, alignSelf:"center"}}></Text>
                        </View>
                        <View style={{backgroundColor:Colors.red,height: 1,width: Utils.getWidth()-80}}></View>

                        <View style={{flexDirection:"row",width: Utils.getWidth()-80,alignItems:"center"}}>
                            <Text style={{fontSize:15,color:Colors.text6, alignSelf:"center"}}>数 量:</Text>
                            <TextInput
                                style={{ flex:1,height:40,fontSize: 15, color: '#333',backgroundColor: "#fff"}}
                                placeholder={'请输入数量'}
                                placeholderTextColor={'#999'}
                                underlineColorAndroid='transparent'
                                keyboardType={"numeric"}
                                editable={true}
                                maxLength={12}
                                value={this.state.number+""}
                                onChangeText={(text)=>{
                                    //限额
                                    var num = this.data?this.data.item.num:0.00;
                                    if(text>num){
                                        text = num
                                    }
                                    this.setState({number:text,unitPrice:this.data?this.data.item.dprice+"":""})
                                }}
                            />
                            <Text
                                onPress={()=>{
                                    var text = this.data?this.data.item.num:0.00;
                                    this.setState({number:text,unitPrice:this.data?this.data.item.dprice+"":""})
                                }}
                                style={{fontSize:13,color:Colors.white,paddingLeft:8,paddingRight:8,
                                backgroundColor:Colors.red,borderRadius:5,height:25,paddingTop:4,paddingBottom:4,}}>全额</Text>
                        </View>
                        <View style={{backgroundColor:Colors.red,height: 1,width: Utils.getWidth()-80}}></View>

                        <View style={{flexDirection:"row",width: Utils.getWidth()-80}}>
                            <Text style={{fontSize:15,color:Colors.text6, alignSelf:"center"}}>余 额:</Text>
                            <TextInput
                                style={{ flex:1,height:40,fontSize: 15, color: '#333',backgroundColor: "#fff"}}
                                placeholderTextColor={'#999'}
                                underlineColorAndroid='transparent'
                                keyboardType={"numeric"}
                                editable={false}
                                value={Utils.formatNumBer(this.state.number* this.state.unitPrice,4)}
                                maxLength={12}
                            />
                            {/*<Text  style={{fontSize:15,color:Colors.text6, alignSelf:"center"}}>{Utils.formatNumBer(this.state.number* this.state.unitPrice,4)}</Text>*/}
                        </View>
                        <View style={{backgroundColor:Colors.red,height: 1,width: Utils.getWidth()-80}}></View>

                        <TouchableOpacity
                            onPress={() => this.setModalVisible(false)}
                            style={{position:"absolute", left:0,top:0,padding:10}} >
                            <Image source={require('../../../res/images/close.png')}/>
                        </TouchableOpacity>
                        <Button style={{marginTop:20}} title='确认交易' onPress={() =>{
                            if(Utils.regNumber(this.state.number)&&this.state.number>0){
                                this.setModalVisible(false)
                                var des = this.activeIndex?"出售":"购买"
                                //单价
                                var dprice   = this.data?this.data.item.dprice:0.00;
                                //描述
                                des =  des +this.state.number +" "+ this.state.title+", 单价:"+dprice
                                //总价
                                var total = Utils.formatNumBer(dprice*this.state.number,4)
                                PassWordInput.showPassWordInput((safetyPwd)=>{
                                    this.trade(safetyPwd,this.state.number)

                                },des,total)
                            }else {
                                DialogUtils.showToast("请输入正确的数量")
                            }
                            }}/>
                    </View>
                    </View>
                </Modal>
            </View>
        );
    }
    onClick(i) {
        this.action = i
        switch (i) {
            case 1:
            case 2:
                this.props.navigation.navigate('CreateBSOrder', {
                    cid: this.state.cid,
                    //title: this.state.title,
                    type: i,
                });
                break;
            case 3:
                this.props.navigation.navigate('OrderRecord',{cid:this.cid})
                break;
            case 4:
                this.props.navigation.navigate('TeadeRecord',{cid:this.cid})
                break;
                break;
        }
    }
    //选择折线图类型
    magicType(i) {
        //alert(i)
        this.setState({ echartsType: i })
        this.getEchartsData(i)
    }
    indedd = 1
    //购买 出售 订单
    selectIndex(index) {
        this.setState({ activeIndex: index })
        this.activeIndex = index;
        this._refreshData()
        this.indedd += 1
        alert(this.indedd)
    }

    /**
     * 绘制itemView
     * @param data
     * @returns {*}
     * @private
     */
    _getItem(data) {
        // return <View style={{ flex: 1 }}>
        //     <Text style={{ padding: 15, fontSize: 15, color: Colors.black }}>{this.state.activeIndex ? "购买" : "出售"}</Text>
        // </View>
        return <TouchableOpacity >
            <View
                key={data.item.index}
                style={{
                    backgroundColor: '#fff', alignItems: 'center',
                    justifyContent: "center", marginBottom: 1,
                    flexDirection: 'row', padding: 10,
                }}>
                <Image
                    style={{ width: 45, height: 45, borderWidth: 1, borderRadius: 23, borderColor: "#666" }}
                    source={data.item?{uri:this.getImgUrl(data.item.imgHead)}:require("../../../res/images/touxiang-xiao.png")}
                />

                <View style={{ flexDirection: 'column', justifyContent: "center", flex: 1, marginLeft: 10, marginRight: 10 }}>
                    <Text
                        style={{ color: "#333333", fontSize: 16 }}>{data.item.username}</Text>

                    <Text style={{ color: "#888", fontSize: 14, marginTop: 5 }}
                        numberOfLines={1}
                    >限 额:{data.item.num}</Text>
                </View>

                <View style={{ flexDirection: 'column', justifyContent: "center", alignItems:"flex-end",marginLeft: 10, marginRight: 10 }}>
                    <Text
                        style={{ color: Colors.blue, fontSize: 16, textAlign: "right" }}>{data.item.dprice}</Text>
                    <Text
                        onPress={()=>{
                            this.data = data
                            this.setState({number:"0.00"})
                            this.setModalVisible(true)
                        }}
                        style={{ width:50,
                        paddingLeft: 8, paddingRight: 8, paddingTop: 3, paddingBottom: 3, color: Colors.r1,
                        fontSize: 13, textAlign: "center", borderWidth: 1, borderColor: Colors.r1, borderRadius: 5
                    }} numberOfLines={1}>{!this.state.activeIndex ? "购买" : "卖出"}</Text>
                </View>
            </View>
        </TouchableOpacity>
    }

    /**
     * 交易
     */
    trade(safetyPwd,num){
             DialogUtils.showLoading();
             this.url = !this.state.activeIndex ?BaseUrl.dealBuy():BaseUrl.dealSell();
             // alert(this.data.item.id)
            HttpUtils.postData(this.url,
                {   sessionId: this.userInfo.sessionId,
                    id: this.data.item.id,
                    num: num,
                    safetyPwd: safetyPwd,
                })
                .then(result => {
                    DialogUtils.hideLoading()
                    if (result.code === 1) {
                        this.refList.delData(this.data.index)
                        let tip  = !this.state.activeIndex ? "购买" : "出售"
                        DialogUtils.showToast(tip+ "成功")
                        this.geTopData(this.cid)
                    } else {
                        DialogUtils.showToast(result.msg)
                    }

                })
    }

    //刷新数据
    _refreshData() {
        //this.refList.refreshStar()
        this.pageIndex = 1;
        this.getData(true)
    }
    //加载更多数据
    _onLoadData() {
        this.getData(false)
    }

    getData(isRefesh) {
        if (this.activeIndex === 0) { //购买
            this.url = BaseUrl.dealOrder(this.userInfo.sessionId, this.pageIndex,1,this.cid)
        } else if (this.activeIndex === 1) {//出售
            this.url = BaseUrl.dealOrder(this.userInfo.sessionId, this.pageIndex,2,this.cid)
        }
        //alert(this.url)
        HttpUtils.getData(this.url)
            .then(result => {
                if (result.code === 1) {
                     //alert(JSON.stringify(result.data))
                    if (isRefesh) {
                        this.refList.setData(result.data)
                        if (result.data.length < 1) {
                            DialogUtils.showToast("暂无记录")
                        }
                    } else {
                        this.refList.addData(result.data)
                    }
                    this.pageIndex += 1

                } else if (result.code === 2||result.code === 4) {
                    DialogUtils.showToast(result.msg)
                    this.goLogin(this.props.navigation)
                } else {
                    DialogUtils.showToast(result.msg)
                }
            })
    }

    //选择币种  cid 各种货币id
    //1.TOT 2.比特币 3.莱特币  4.以太坊  5.狗狗币
    selectCid(cid,title){
        this.cid = cid
        this.setState({cid:cid, title :title})
        this.geTopData()
        this._refreshData()
    }
    /**
     * onPress={() => this.showPopover(this.refs['downcenter'], 'down', 'center')}
     * @param {*} view
     * @param {*} direction
     * @param {*} align
     */
    showPopover(view) {
        let { black, shadow, showArrow } = this.state;
        let blackStyle = {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            //   paddingTop: 1,
            //   paddingBottom: 1,
            paddingLeft: 12,
            paddingRight: 12,
        };
        let whiteStyle = {
            ...blackStyle,
            backgroundColor: Colors.white,
        };
        let shadowStyle = {
            shadowColor: '#777',
            shadowOffset: { width: 1, height: 1 },
            shadowOpacity: 0.5,
            shadowRadius: 2,
        };
        let popoverStyle = [].concat(black ? blackStyle : whiteStyle).concat(shadow ? shadowStyle : null);

        view.measure((x, y, width, height, pageX, pageY) => {
            let fromBounds = { x: pageX, y: pageY, width, height };
            let overlayView = (
                <Overlay.PopoverView popoverStyle={popoverStyle}
                    fromBounds={fromBounds} direction={"down"} align={"center"}
                    directionInsets={4} showArrow={showArrow}
                    ref={v => this.view = v}>
                    <View>
                        <Text
                            onPress={() => {
                                this.view.close()
                                this.selectCid(1,"TOT")
                            }}
                            style={{ fontSize: 14, color: Colors.text3, paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 10 }}>
                            Wepay</Text>
                        <View style={{ backgroundColor: Colors.lineColor, height: 0.5 }} />
                        <Text
                            onPress={() => {
                                this.view.close()
                                this.selectCid(2,"比特币")
                            }}
                            style={{ fontSize: 14, color: Colors.text3, paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 10 }}>
                            比特币</Text>
                        <View style={{ backgroundColor: Colors.lineColor, height: 0.5 }} />
                        <Text
                            onPress={() => {
                                this.view.close()
                                this.selectCid(3,"莱特币")
                            }}
                            style={{ fontSize: 14, color: Colors.text3, paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 10 }}>
                            莱特币</Text>
                        <View style={{ backgroundColor: Colors.lineColor, height: 0.5 }} />
                        <Text
                            onPress={() => {
                                this.view.close()
                                this.selectCid(4,"以太坊")
                            }}
                            style={{ fontSize: 14, color: Colors.text3, paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 10 }}>
                            以太坊</Text>
                        <View style={{ backgroundColor: Colors.lineColor, height: 0.5 }} />
                        <Text
                            onPress={() => {
                                this.view.close()
                                this.selectCid(5,"狗狗币")
                            }}
                            style={{ fontSize: 14, color: Colors.text3, paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 10 }}>
                            狗狗币</Text>
                    </View>
                </Overlay.PopoverView>
            );
            Overlay.show(overlayView);
        });
    }
 getTitleByCid(cid){
     let title
     if (cid===2){
         title = "比特币"

     } else  if (cid===3){
         title = "莱特币"

     }else  if (cid===4){
         title = "以太坊"

     }else  if (cid===5){
         title = "狗狗币"

     }else {
          title = "TOT"
     }
     return title ;
 }
}


export const styles = StyleSheet.create({
    container_center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // position:"absolute",  //绝对布局
    },
    container: {
        flex: 1,
    },

    titleView: {
        height: Platform.OS == 'ios' ? 64 : 44,
        paddingTop: Platform.OS == 'ios' ? 14 : 0,
        backgroundColor: '#ff6400',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        color: 'white',
        fontSize: 20,
        textAlign: 'center',
    },

});