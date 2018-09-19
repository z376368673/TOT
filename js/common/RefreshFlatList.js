/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    FlatList,
    StyleSheet,
    Text,
    View,
    RefreshControl,
    ActivityIndicator,
} from 'react-native';

export default class RefreshFlatList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "java",
            isRefresh: false,//刷新
            isDownLoad: this.props.isDownLoad,//,是否显示底部加载更多,和触发加载更多事件
            dataArray: [],
            isFrist: true,
        }
    }
    static defaultProps = {
        footerView: PropTypes.element,
    }
    static defaultProps = {
        onRefreshs: () => {
        },
        onLoadData: () => {
        },
        isDownLoad: false,
        minLength: 15,//最少要15条数据 才会显示底部加载更多，防止不满一页时 onLoadData 自动执行
        defauValue:0.1,
    }

    refreshStar() {
        this.setState({
            isRefresh: true,
        });
    }
    //删除数据，通过下标来删除数据
    delData(index) {
        this.state.dataArray.splice(index, 1)
        let data = this.state.dataArray;
        this.setState({
            dataArray: data,
        });
    }


    //修改数据，通过下标来确定数据
    upData(index, item) {
        this.state.dataArray[index] = item
        let data = this.state.dataArray;
        this.setState({
            dataArray: data,
        });
    }

    /**
     * 初次设置数据
     * @param data
     */
    setData(data) {
        //flatlist公用的时候 先把数据清空再添加数据
        this.setState({
            dataArray: [],
        });
        this.setState({
            isFrist: false,
            isRefresh: false,
            isDownLoad: !data ? false : data.length < this.props.minLength ? false : this.props.isDownLoad,
            dataArray: data,
        });
    }

    /**
     * 在原数据的基础上添加数据
     * @param data
     */
    addData(data) {
        if (!data || data.length < 1) {
            this.setState({
                isDownLoad: false,
            });
            return
        }
        let arr = []
        for (let i = 0; i < data.length; i++) {
            arr.push(data[i])
        }
        arr = this.state.dataArray.concat(arr)
        this.setState({
            dataArray: arr,
        });
    }

    getKeys() {
        var keys = [];
        this.state.dataArray.map((index) => {
            keys.push(index)
        })
        return keys;
    }
    render() {
        const { onRefreshs, onLoadData, ...other } = this.props

        return <View style={styles.container}>
            <FlatList
                {...other}

                //renderItem={other.renderItem}
                //设置数据
                data={this.state.dataArray}
                keyExtractor={(item, index) => index.toString()}
                //  renderItem={(items) => this.props.renderRow(items)}
                refreshControl={
                    <RefreshControl
                        //Android下只有一个 colors 是转圈的颜色
                        colors={['#d11', '#000']}
                        //ios 下 可以设置标题，转圈颜色，标题颜色
                        title={'Loading...'}
                        tintColor={'#d11'}
                        titleColor={'#d11'}
                        //刷新状态 false:隐藏，true:显示
                        refreshing={this.state.isRefresh}
                        //刷新触发的后执行的方法
                        onRefresh={() => onRefreshs()}
                    />
                }
                //定义加载更多控件
                ListFooterComponent={() => this.getIndicator()}
                //设置触发 onEndReached 的距离
                onEndReachedThreshold={this.props.defauValue}
                //触发加载更多的后执行的方法
                onEndReached={() => this.state.isDownLoad ? onLoadData() : {}}
            />
        </View>
    }

    //定义加载更多样式
    getIndicator() {
        if (this.state.isDownLoad && !this.state.isFrist) {
            return <View style={styles.indicatorContainer}>
                <ActivityIndicator
                    size={'large'}
                    animating={true}
                />
                <Text style={{ color: '#d11', fontSize: 15, margin: 10 }}>加载更多</Text>
            </View>;
        } else {
            return <View />
            // return <View style={styles.indicatorContainer}>
            //     <Text style={{color: '#d11', fontSize: 15, margin: 10}}>{this.state.dataArray ? "" : "没有数据了"}</Text>
            // </View>;
        }
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
    },

    indicatorContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
