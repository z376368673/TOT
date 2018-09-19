import React, { Component } from 'react';
import {
    Text,
    View,
    ScrollView,
} from 'react-native';
import BaseComponent, { BaseStyles, window_width } from "../BaseComponent";
import NavigationBar from "../../common/NavigationBar";
import HttpUtils from "../../util/HttpUtils";
import DialogUtils from '../../util/DialogUtils';
import BaseUrl from '../../util/BaseUrl';
import HTMLView from 'react-native-htmlview';

const URL = 'https://api.github.com/search/repositories?q=';
export default class NoticDetails extends BaseComponent {
    newsID = 0;
    constructor(props) {
        super(props);
        this.userInfo = this.getUserInfo()
        const { params } = this.props.navigation.state
        this.title = params.title ? params.title : "详情";
        this.newsID = params.id ? params.id : 0;
        this.state = {
            textInfo: "正在加载信息...",
            title: "公告"
        }
    }
    componentDidMount() {
        this.getData(this.newsID)
    }

    /**
   * 获取信息详情
   * @returns {undefined}
   */
    getData(id) {
        DialogUtils.showLoading()
        this.url = BaseUrl.getSystemgNewsDetails(this.userInfo.sessionId, id)
        HttpUtils.getData(this.url)
            .then(result => {
                DialogUtils.hideLoading();
                //alert(JSON.stringify(result.data))
                if (result.code === 1) {
                    this.setState({
                        textInfo: result.data.content,
                        title: result.data.title
                    })
                } else if (result.code === 2||result.code === 4) {
                    DialogUtils.showToast(result.msg)
                    this.goLogin(this.props.navigation)
                }else {
                    DialogUtils.showToast(result.msg)
                }
            })
    }
    render() {
        return (
            <View style={BaseStyles.container_column}>
                <NavigationBar
                    title={this.state.title}
                    navigation={this.props.navigation}
                />
                <ScrollView style={{ margin: 15 }}>
                    <HTMLView
                        value={this.state.textInfo}
                        stylesheet={{ fontSize: 16, color: "#333" }}
                    />
                </ScrollView>
            </View>
        );
    }

}
