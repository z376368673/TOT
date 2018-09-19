import React, { Component } from 'react';
import {
    Text,
    View,
    Dimensions,
    TouchableOpacity,
    Image,
    Keyboard, TextInput,
} from 'react-native';
import { Theme, Overlay, Button } from 'teaset';
import Utils from "../util/Utils";
import Colors from "../util/Colors";



const { height, width } = Dimensions.get('window');
const pwdLength = 6; //密码长度 ，建议最长不要超过9
class PassNumInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pwdArr: []
        }
        this.numArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, "清空", 0, "删除",]
    }
    componentWillMount(){
          //强制隐藏键盘
        Keyboard .dismiss();
    }
    static defaultProps = {
        onClose: () => { }, //关闭
        onChangePassWord: () => { },//当密码改变时调用
        onComplete: () => { },// 当密码长度等于6时调用， 也就是说 当密码输入完成时
        des:"", //支付描述
        price:0,//支付价格
    }
    /**
     * 生成密码框布局
     */
    creatPwd() {
        var views = [];
        for (var i = 0; i < pwdLength; i++) {
            views.push(
                <View key={i} style={{
                    padding: 5, width: 45, height: 40, borderColor: "#555",
                    borderTopWidth: 1, borderBottomWidth: 1, borderLeftWidth: i === 0 ? 1 : 0, borderRightWidth: i === pwdLength - 1 ? 1 : 0.5
                }}>
                    <Text
                        style={{
                            width: 30, height: 30,
                            fontSize: 30, color: "#000",
                            borderColor: "#333",
                            borderRadius: 15,
                            borderWidth: this.state.pwdArr[i] + 1 ? 15 : 0
                        }}
                    />
                </View>
            )
        }
        return views;
    }

    onClick(key) {
        switch (key) {
            case "删除":
                this._delPassword()
                this.onChangePassWord()
                break;
            case "清空":
                this.setState({
                    pwdArr: [],
                })
                break;
            default:
                this._setPassword(key)
                this.onChangePassWord()
                break;
        }
    }
    onChangePassWord() {
        let len = this.state.pwdArr.length
        this.props.onChangePassWord(this.state.pwdArr, len)
        if (len === pwdLength) {
            var pwd = ""
            this.state.pwdArr.forEach(element => {
                pwd += element;
            });
            this.props.onComplete(pwd)
            this.props.onClose()
        }
    }
    _delPassword() {
        if (this.state.pwdArr.length > 0) {
            var pwd = this.state.pwdArr
            pwd.pop()
            this.setState({
                pwdArr: pwd,
            })
        }
    }
    _setPassword(num) {
        if (this.state.pwdArr.length < pwdLength) {
            var pwd = this.state.pwdArr
            pwd.push(num)
            this.setState({
                pwdArr: pwd,
            })
        }
    }
    /**
     * 生成键盘布局
     */
    creatJianPan() {
        var views = []
        this.numArr.map((num, index) => {
            views.push(
                <TouchableOpacity
                    style={{ width: width / 3, height: width / 3 / 2 + 10, borderColor: "#999", borderWidth: 0.3, justifyContent: "center", alignItems: "center" }}
                    key={index}
                    onPress={() => this.onClick(num)}>
                    <Text style={{ fontSize: 20, color: "#333", }}>{num}</Text>
                </TouchableOpacity>
            )
        })
        return views
    }
    render() {
        return (
            <View style={{ flex: 1, flexDirection: "column", alignItems: "center" }}>
                <View style={{
                    flexDirection: "column", padding: 20,
                    borderColor: "#666", borderWidth: 1,
                    backgroundColor: "#fff", marginTop: this.props.price!==0?100:140,
                }}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <TouchableOpacity onPress={() => this.props.onClose()}>
                            <Image style={{ marginRight: 8 }} source={require("../../res/images/close.png")} />
                        </TouchableOpacity>
                        <Text style={{ fontSize: 16, color: "#000", }}>请输入{pwdLength}位支付密码</Text>
                    </View>
                    <View style={{ backgroundColor: "#aaa", height: 0.5, flexDirection: 'column', marginTop: 10, marginBottom: 5, }} />
                   {this.props.price!==0?<View style={{ alignItems: "center" ,marginTop:10,marginLeft:-10}}>
                        <Text style={{ fontSize: 14, color: "#000", }}> {this.props.des}</Text>
                        <Text style={{ fontSize: 22, color: "#000", }}>￥{ new Number(this.props.price).toFixed(2)}</Text>
                    </View>:null
                } 
                    <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 20 }}>
                        {this.creatPwd()}
                    </View>
                </View>

                {/* 数字键盘  */}
                <View style={{ backgroundColor: "#fff", justifyContent: "center", alignItems: "center", flexDirection: "column", position: "absolute", zIndex: 1, bottom: 0 }}>
                    <TouchableOpacity
                        style={{ padding: 10 }}
                        onPress={() => this.props.onClose()}>
                        <Image source={require("../../res/images/down.png")} />
                    </TouchableOpacity>
                    <View style={{
                        flexDirection: "row", flexWrap: "wrap",
                    }}>
                        {this.creatJianPan()}
                    </View>
                </View>
            </View>
        );
    }

}

// var PassWordInput = {
//     showPassWordInput(onComplete) {
//         let width = require('Dimensions').get('window').width
//         let height = require('Dimensions').get('window').height
//         let overlayView = (         //"left"
//             <Overlay.PullView side={'bottom'} modal={true} ref={v => this.overlayPullView = v}>
//                 <View style={{ minWidth: width, minHeight: height, justifyContent: 'center', alignItems: 'center' }}>
//                     <PassNumInput
//                         onClose={() => this.overlayPullView ? this.overlayPullView.close() : null}
//                         onComplete={pwd => {
//                             onComplete(pwd)
//                         }}
//                         onChangePassWord={(pwd, len) => { }}
//                     />
//                 </View>
//             </Overlay.PullView>
//         );
//         if (!overlayView.isShow)
//             Overlay.show(overlayView);
//     }
// }

var PassWordInput = {
    showPassWordInput(onComplete,des,price) {
        let width = require('Dimensions').get('window').width
        let height = require('Dimensions').get('window').height
        let overlayView = (         //"left"
            <Overlay.PopView
                style={{ alignItems: 'center', justifyContent: 'center', padding: 40 }}
                type={"zoomOut"}//动画效果
                modal={true}//点击任意区域消失 
                ref={v => this.overlayPullView = v}
            >
                <View style={{ minWidth: width, minHeight: height, justifyContent: 'center', alignItems: 'center' }}>
                    <PassNumInput
                        onClose={() => this.overlayPullView ? this.overlayPullView.close() : null}
                        onComplete={pwd => {
                            onComplete(pwd)
                        }}
                        onChangePassWord={(pwd, len) => { }}
                        des = {des}
                        price = {price}
                        {...this.props}
                    />
                </View>
            </Overlay.PopView>
        );
        if (!overlayView.isShow) {
            Overlay.show(overlayView);
        }
    }
}
 class PayInfoView extends Component {
     constructor(props) {
         super(props);
         this.state = {
         }
     }

    static defaultProps = {
        overView:null,
        onClose: () => { }, //关闭
        onChangePassWord: () => { },//当密码改变时调用
        onComplete: () => { },// 当密码长度等于6时调用， 也就是说 当密码输入完成时
        data:"", //支付描述
        type:0,//支付价格
    }


    render() {
        return (
            <View style={{backgroundColor: "#fff",marginTop:20, padding: 20, borderRadius: 8, alignItems: 'center'}}>
                <View style={{flexDirection:"row",width: Utils.getWidth()-80}}>
                    <Text style={{fontSize:15,color:Colors.text6, alignSelf:"center"}}>限 额:</Text>
                    <TextInput
                        style={{ flex:1,height:40,fontSize: 15, color: '#333',backgroundColor: "#fff"}}
                        placeholderTextColor={'#999'}
                        underlineColorAndroid='transparent'
                        keyboardType={"numeric"}
                        editable={false}
                        value={"1"}
                        maxLength={10}
                    />
                    <Text  style={{fontSize:15,color:Colors.text6, alignSelf:"center"}}>Wepay</Text>
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
                        maxLength={12}
                    />
                    <Text  style={{fontSize:15,color:Colors.text6, alignSelf:"center"}}>Wepay</Text>
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
                    />
                    <Text  style={{fontSize:13,color:Colors.white,paddingLeft:8,paddingRight:8,
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
                        maxLength={12}
                    />
                    <Text  style={{fontSize:15,color:Colors.text6, alignSelf:"center"}}>Wepay</Text>
                </View>
                <View style={{backgroundColor:Colors.red,height: 1,width: Utils.getWidth()-80}}></View>

                <TouchableOpacity
                    onPress={() => this.props.overView&& this.overView.close()}
                    style={{position:"absolute", left:0,top:0,padding:10}} >
                    <Image source={require('../../res/images/close.png')}/>
                </TouchableOpacity>
                <Button title='确认交易' onPress={() =>
                    PassWordInput.showPassWordInput((safetyPwd)=>{
                    },"出售1 wepay,单价:18.31","18.31")} />

            </View>
        )}
}
/**
 * 交易中心的购买 出售 弹框
 *
 * @param payCall  回调方法
 * @param data  数据
 * @param type  0 购买 或者 1 出售
 */
export var payInfoDialog = (payCall,data,type) => {
    let overlayView = (
        <Overlay.View
            style={{alignItems: 'center', justifyContent: 'flex-start'}}
            modal={true}
            overlayOpacity={false ? 0 : null}
            ref={v => this.overView1 = v}
        >
            <PayInfoView
                overView ={this.overView1}
                data = {data}
                type = {type}
                {...this.props}
            />
        </Overlay.View>
    );
    Overlay.show(overlayView);
}



export default PassWordInput;

