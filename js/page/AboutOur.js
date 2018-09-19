import React, { Component } from 'react';
import {
    StyleSheet,
    Platform,
    View, Text,
    ScrollView

} from 'react-native';
import BaseComponent, { BaseStyles } from "./BaseComponent";
import HTMLView from 'react-native-htmlview';
import SplashScreen from "react-native-splash-screen"
import NavigationBar from '../common/NavigationBar';

export default class AboutOur extends BaseComponent {
    constructor(props) {
        super(props);

    }
    componentDidMount() {
       // SplashScreen.hide();
    }
    render() {
        return (
            <View>
                <NavigationBar
                    title='关于我们'
                    navigation={this.props.navigation}
                />
                <ScrollView style={{ marginBottom: 100 }}>
                    <View style={{ margin:15 }}>
                        <Text style={styles.title}>
                            全球顶尖的区块链技术团队，TOT支付结合市场八大优势，融入成一个系统，实现完全去中心化，会员间点对点流通，打造全球跨境支付平台以及全球数字货币交易平台。
                    </Text>
                        <View style={{ flexDirection: "row", marginTop: 8, }}>
                            <Text style={styles.redText}>1. </Text>
                            <Text style={styles.text}> 拆分(原始发行1000万)</Text>
                        </View>
                        <View style={{ flexDirection: "row", marginTop: 8, }}>
                            <Text style={styles.redText}>2. </Text>
                            <Text style={styles.text}> 互助(买进卖出点对点匹配打款)</Text>
                        </View>
                        <View style={{ flexDirection: "row", marginTop: 8, }}>
                            <Text style={styles.redText}>3. </Text>
                            <Text style={styles.text}> 分红(每天最底2‰释放)</Text>
                        </View>
                        <View style={{ flexDirection: "row", marginTop: 8, }}>
                            <Text style={styles.redText}>4. </Text>
                            <Text style={styles.text}> 复利(放大倍增)</Text>
                        </View>
                        <View style={{ flexDirection: "row", marginTop: 8, }}>
                            <Text style={styles.redText}>5. </Text>
                            <Text style={styles.text}> 虚拟币(区块链挖矿机制)</Text>
                        </View>
                        <View style={{ flexDirection: "row", marginTop: 8, }}>
                            <Text style={styles.redText}>6. </Text>
                            <Text style={styles.text}> 数字资产(低进高出炒币)</Text>
                        </View>
                        <View style={{ flexDirection: "row", marginTop: 8, }}>
                            <Text style={styles.redText}>7. </Text>
                            <Text style={styles.text}>资产证券化(最高释放完再复投)</Text>
                        </View>
                        <View style={{ flexDirection: "row", marginTop: 8, }}>
                            <Text style={styles.redText}>6. </Text>
                            <Text style={styles.text}> 数字资产(低进高出炒币)</Text>
                        </View>
                        <View style={{ flexDirection: "row", marginTop: 8, }}>
                            <Text style={styles.redText}>8. </Text>
                            <Text style={styles.text}>消费返利（落地商家扫码支付）</Text>
                        </View>
                        <View style={{ flexDirection: "row", marginTop: 8, }}>
                            <Text style={styles.redText}>● TOT的核心 </Text>
                        </View>
                        <Text style={styles.title}>
                            基于区链块分布式智能合约技术，实现货币的去中心化、点对点无损无痕流通，让流通产生价值，让快速流通增加哈希算力，最终加速价值的释放。名词释意：
                    </Text>
                        <View style={{ flexDirection:"row", marginTop: 8, }}>
                            <Text style={styles.redText}>【余额】：</Text>
                            <Text style={styles.text}>法定货币现金，也可以称之为现金币，简称钱。</Text>
                        </View>
                        <View style={{ flexDirection: "row", marginTop: 8, }}>
                            <Text style={styles.redText}>【积分】：</Text>
                            <Text style={styles.text}>余额每流通（转出、支付）一次，TOT系统会赠送80%的积分，积分是余额流通产生的价值。。</Text>
                        </View>
                        <View style={{ flexDirection: "row", marginTop: 8, }}>
                            <Text style={styles.redText}>【转出】：</Text>
                            <Text style={styles.text}>余额在两个账户或者多个账户之间的流通</Text>
                        </View>
                        <View style={{ flexDirection: "row", marginTop: 8, }}>
                            <Text style={styles.redText}>【转入】：</Text>
                            <Text style={styles.text}>收款（生成二维码）</Text>
                        </View>
                        <View style={{ flexDirection: "row", marginTop: 8, }}>
                            <Text style={styles.redText}>【买入】：</Text>
                            <Text style={styles.text}>在线挂单求购余额</Text>
                        </View>
                        <View style={{ flexDirection: "row", marginTop: 8, }}>
                            <Text style={styles.redText}>【卖出】：</Text>
                            <Text style={styles.text}>在线挂单出售余额</Text>
                        </View>

                        <View style={{ flexDirection: "row", marginTop: 8, }}>
                            <Text style={styles.redText}>● TOT资产</Text>
                        </View>
                        <Text style={styles.title}>
                            基于区快链技术，OPEN COIN开源算法开发的数字加密货币，运用此算法的数字加密货币还有谷歌公司投资的瑞波币。TOT数字资产总发行量3.65亿，首发1000万，剩余3.55亿由TOT钱包用户通过流通增加算力挖取
                    </Text>

                        <View style={{ flexDirection: "row", marginTop: 8, }}>
                            <Text style={styles.redText}>● 分享</Text>
                        </View>
                        <Text style={styles.text}>
                            分享链接或二维码，推广给其他用户使用。通过分享，被分享者在使用TOT的过程能加速分享者的积分释放速度。使用规则；
                    </Text>
                        <View style={{ flexDirection: "row", marginTop: 8, }}>
                            <Text style={styles.redText}>● 转出规则</Text>
                        </View>
                        <Text style={styles.text}>
                            通过“转账”或“扫码支付”，转账方转出多少余额就收多少余额就收多少现金，同时获得80%的积分，收款方需支付相应的现金给转账方，收款方获得转账额80%余额和20%的积分，如转账方是首次转账给收款方则速通宝系统会另赠送20%的积分给收款方。如：A转账给B→10000余额，那么B支付10000的现金给A，A得到10000的现金和8000的积分，B得到8000余额和2000的积分，如A是首次转账给B，那么系统另外获赠2000积分
                    </Text>

                        <View style={{ flexDirection: "row", marginTop: 8, }}>
                            <Text style={styles.redText}>● 收款规则</Text>
                        </View>
                        <Text style={styles.text}>
                            同上
                    </Text>
                        <View style={{ flexDirection: "row", marginTop: 8, }}>
                            <Text style={styles.redText}>● 卖出规则</Text>
                        </View>
                        <Text style={styles.text}>
                            自由，无限制，挂单卖出后得到85%的现金，系统不再赠送积分。
                    </Text>

                        <View style={{ flexDirection: "row", marginTop: 8, }}>
                            <Text style={styles.redText}>● 加速释放规则</Text>
                        </View>
                        <Text style={styles.text}>
                            用户积分按2‰的速度释放积分到余额，在用户不断分享其他用户使用TOT钱包的情况下，其他用户的转账流通额度和速度可加速其积分释放速度，用户积分释放的速度将有可能是10%、20%、50%、100%。
                    </Text>

                        <View style={{ flexDirection: "row", marginTop: 8, }}>
                            <Text style={styles.redText}>● 会员级别规则</Text>
                        </View>
                        <Text style={styles.text}>
                            用户免费注册，注册成功为普通用户，分享用户后可加速积分释放，当普通用户积分账户满100万时，自动升级“VIP会员”
                    </Text>

                        <View style={{ flexDirection: "row", marginTop: 8, }}>
                            <Text style={styles.redText}>● VIP 会员</Text>
                        </View>
                        <Text style={styles.text}>
                            享受15代余额流通的8%加入到积分账户
                    </Text>
                    </View>
                </ScrollView>
            </View>
        );
    }
}
const styles = StyleSheet.create({

    title: {
        color: "#333", fontSize: 16, marginTop: 10,
    },
    text: {
        color: "#333", fontSize: 14,
    },
    redText: {
        color: "#d11", fontSize: 16
    },
});
