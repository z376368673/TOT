/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React, {Component} from 'react';
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
            dataArray: [],
        }
    }
    static defaultProps={
        footerView: PropTypes.element,
    }
    static defaultProps = {
        onRefreshs: () => {
        },
        isDownLoad: false,
        footerView: () => {
        },
    }
    
    refreshStar() {
        this.setState({
            isRefresh: true,
        });
    }
    
    //删除数据，通过下标来删除数据
    delData(index){
       this.state.dataArray.splice(index,1)
       let data =  this.state.dataArray;
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

    render() {
        const {onRefreshs,footerView,...other} = this.props
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
                ListFooterComponent={footerView()}
            />
        </View>
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
