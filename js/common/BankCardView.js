
import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity
} from 'react-native';
import BaseComponent ,{BaseStyles}from "../page/BaseComponent";
import bankCardModel from "../model/BankCardModel";
import ViewUtils from "../util/ViewUtils";



export  default class BankCardView extends BaseComponent {
    constructor(props){
        super(props);
        this.state={
            country:"中国",
            bankCard:null,
        }
    }

    render() {
        return (
            <View style={{backgroundColor: "#fff",flexDirection: 'column'}}>
                {/*绑定银行卡*/}
                <View style={{flexDirection: 'column',  marginTop: 8}}>
                    <View style={{
                        flexDirection: 'row', padding: 10, backgroundColor: "#fff", alignItems: 'center'
                    }}>
                        <Text style={{color: '#999', fontSize: 16, flex: 1}}> 绑定银行卡</Text>
                        <Text style={{fontSize:14,color:"#fff",backgroundColor:"#00BB00",paddingLeft:6,paddingRight:6,paddingTop:3,paddingBottom:3}}
                              onPress={()=>this.selectCountry()}
                        >{this.state.country}</Text>
                        <Image
                            style={{tintColor: "#999",}}
                            source={require('../../res/images/ic_tiaozhuan.png')}/>
                    </View>
                </View>
                {ViewUtils.getLineView()}
                <TouchableOpacity  onPress={() => this.selectBankCard()}>
                <View style={{flexDirection: 'column',paddingLeft:15,paddingRight:15,paddingBottom:15,paddingTop:15}}>
                    <Text style={styles.text}>{this.state.bankCard?this.state.bankCard.holdName:""}</Text>
                    <Text style={styles.text}>{this.state.bankCard?this.state.bankCard.banqGenre:"请选择"+this.state.country+"银行卡"}</Text>
                    <Text style={styles.text}>{this.state.bankCard?this.state.bankCard.cardNumber:""}</Text>
                </View>
                </TouchableOpacity>
            </View>
        );
    }
    
    selectCountry(){
        this.props.navigation.navigate("Country", {
            country:this.state.country,
            selectCountry: (country) => {
                this.setState({
                    country:country,
                })
            }
        })
    }
     /**
    * 选择银行卡
    */
   selectBankCard() {
    this.props.navigation.navigate("BankCardList", {
        selectBank: (bankCard) => {
            //alert(JSON.stringify(bankCard))
            this.props.selechBankCard(bankCard)
            this.setState({
                bankCard:bankCard,
            })
        }
    })
}
}
export const styles = StyleSheet.create({
    text: {
        // flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        // position:"absolute",  //绝对布局
        color:"#333333",
        fontSize:15,
        marginTop:5
    },
});


