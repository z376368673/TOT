
export  default  class BankCardModel{
    //'户主','银行卡卡名称','卡号'
    userName = '户主';
    bankName = '银行';
    bankNum = '123456789';
}

export var bankCarkArr=[
    "交通银行",
    "中国光大银行",
    "中信银行",
    "中国工商银行",
    "中国农业银行",
    "中国银行",
    "中国建行",
    "中国民生银行",
    "招商银行",
    "兴业银行",
    "中国邮政储蓄银行",
    "中国农业发展银行",
    "广东发展银行",
]
export var getBankCardIcon=(bankName)=>{
    var icon = require("../../res/images/yinghangka.png")
    //switch (bankName) {
    switch (bankCarkArr[bankName]) {
        case "交通银行":
            icon = require("../../res/bank_card_icon/jiaotong.png")
            break
        case "中国光大银行":
            icon = require("../../res/bank_card_icon/guangda.png")
            break
        case "中信银行":
            icon = require("../../res/bank_card_icon/zhongxin.png")
            break
        case "中国工商银行":
            icon = require("../../res/bank_card_icon/gongshang.png")
            break
        case "中国农业银行":
            icon = require("../../res/bank_card_icon/nongye.png")
            break
        case "中国银行":
            icon = require("../../res/bank_card_icon/zhongguo.png")
            break
        case "中国建行":
            icon = require("../../res/bank_card_icon/jianshe.png")
            break
        case "中国民生银行":
            icon = require("../../res/bank_card_icon/mingsheng.png")
            break
        case "招商银行":
            icon = require("../../res/bank_card_icon/zhaoshang.png")
            break
        case "兴业银行":
            icon = require("../../res/bank_card_icon/xinye.png")
            break
        case "中国邮政储蓄银行":
            icon = require("../../res/bank_card_icon/youzheng.png")
            break
        case "中国农业发展银行":
            icon = require("../../res/bank_card_icon/nongye.png")
            break
        case "广东发展银行":
            icon = require("../../res/bank_card_icon/gongdongfazan.png")
            break
        default:
            break
    }
    return icon;
}