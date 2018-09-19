const url = 'http://wp.wepay168.com/wepay'  //正式服务器
//const url = 'http://192.168.0.10:8081/wepay'
//const url = 'http://121.201.46.206/wepay'      //测试服务器
//const url = 'http://103.206.121.128:8080/wepay'


export default class BaseUrl {

    /**
     * 登陆接口
     *
     * @param {*} phone
     * @param {*} pwd
     *
     * @return
        "userid": 26536,
     "account": "13923044417",
     "mobile": "13923044417",
     "username": "刘丶丶",
     "sessionId": "07978ff98dc14660a42a751ca4145c70",
     "userCredit": 5,
     "useGrade": 0,
     "imgHead": "http://tz.hxksky.com/wepay/upload/toux-icon.png",
     "isReward": 1,
     "walletAdd": "41QdCdW46NNV0Ymm3zmzTyghUe16v0a0cP",
     "cangkuNum": 14.2282,
     "fengmiNum": 501.996,
     "todayReleas": 1.004
     */
    static loginUrl(phone, pwd,appVersion) {
        return url + "/user/login?account=" + phone + "&password=" + pwd+ "&appVersion=" + appVersion
    }

    /**
     *  获取设置界面是否有新消息  其他字段几乎没用
     *
     * @returns
        1    code    是    状态码
     2    msg    是    错误信息
     3    data    是    数据(code=1返回数据)
     3.1    userid        用户id
     3.2    mobile        手机号/账号
     3.3    username        用户名
     3.4    userCredit        用户星级
     3.5    imgHead        头像网络地址
     3.6    newMessage        是否有新消息1.是，0.否
     * @param {*} sessionId
     */
    static getuserInfoUrl(sessionId) {
        return url + "/user/userCenter?sessionId=" + sessionId;
    }

    /**
     * 2.获取首页轮播图
     *
     * @return 数组
     "id": 4,
     "pic": "banner/1536560148298.png",
     "bannerType": 1,
     "uid": 11337,
     "shopId": 60,
     "describe": null

     "id": 4,
     "pic": "mallBanner/1536572997156.png",
     "bannerType": 3,
     "goodsId": 65,
     "shopId": 26,
     "uid": 2520
     */
    static getBanner() {
        return url + "/user/getBanner"
    }

    /**
     * 2.获取商城首页轮播图
     * @return 数组
     "id": 4,
     "pic": "mallBanner/1536572997156.png",
     "bannerType": 3,
     "goodsId": 65,
     "shopId": 26,
     "uid": 2520
     */
    static getMallBanner() {
        return url + "/goods/getMallBanner"
    }


    /**
     *
     * 获取用户信息
     *
     * @param {*} sessionId
     * @return   "userid": 26536,
     "account": "13923044417",
     "mobile": "13923044417",
     "username": "刘丶丶",
     "sessionId": "07978ff98dc14660a42a751ca4145c70",
     "userCredit": 5, 用户星级
     "useGrade": 0,
     "imgHead": "http://tz.hxksky.com/wepay/upload/toux-icon.png",
     "isReward": 1,  //0->未领取奖金,1->已经领取积分释放
     "walletAdd": "41QdCdW46NNV0Ymm3zmzTyghUe16v0a0cP",//钱包地址
     "cangkuNum": 14.2282,   //余额
     "fengmiNum": 501.996,   //积分
     "todayReleas": 1.004

     */
    static getUserInfoBy(sessionId) {
        return url + "/user/getIndexUser?sessionId=" + sessionId
    }

    /**
     * 修改用户昵称
     * @param {*} sessionId
     * @param {*} userName
     *
     * @return  1
     */
    static updateUserName(sessionId, userName) {
        return url + "/user/updateUserName?sessionId=" + sessionId + "&userName=" + userName;
    }

    /**
     * 获取验证码
     * @param {*} mobile
     * @returns     "code": 1,
     "msg": "",
     "data": 537461
     */
    static getVerificationCodeUrl(mobile) {
        return url + "/user/sendCode?mobile=" + mobile
    }

    /**
     * 用户注册
     *
     * POST
     * @param {*} mobile
     * @param {*} username 用户昵称
     * @param {*} referrer 推荐人UID/手机号
     * @param {*} loginPwd 登录密码
     * @param {*} safetyPwd 交易密码
     * @return  1
     */
    static getRegisterUrl() {
        return url + "/user/register"
    }

    /**
     * 用户上传头像url
     * POST
     *
     * sessionId    是    token    String
     * file    是    File图片文件    file
     */
    static getUpdataHeadUrl() {
        return url + "/user/updateImgHead"
    }

    /**
     * 提交建议的 url
     * POST
     *
     * sessionId    是    token                String
     * file        是    File图片文件          file
     * contents    是    投诉内容（100字以内）    String
     */
    static getComplaintUrl() {
        return url + "/opinions/add"
    }

    /**
     * 忘记密码
     *
     * POST
     * @param {*} mobile
     * @param {*} newPwd
     * @return  1
     */
    static getForgotPwdUrl() {
        return url + "/user/forgotPwd"
    }

    /**
     * 忘记支付密码
     *
     * POST
     * @param {*} mobile
     * @param {*} newPwd
     * @return  1
     */
    static getForgotPayPwdUrl() {
        return url + "/user/forgotPayPwd"
    }

    /**
     * 修改支付密码
     *
     * POST
     * @param {*} sessionId
     * @param {*} oldPwd 旧密码
     * @param {*} newPwd 新密码
     * @return  1
     */
    static getUpdatePayPwdUrl() {
        return url + "/user/updatePayPwd"
    }

    /**
     * 修改登录密码
     *
     * POST
     * @param {*} sessionId
     * @param {*} oldPwd 旧密码
     * @param {*} newPwd 新密码
     * @return  1
     */
    static getUpdateLoginPwdUrl() {
        return url + "/user/updateLoginPwd"
    }

    /**
     * 获取银行卡列表
     * @param {*} sessionId
     * @return
     *     "id": 58,
     "cardId": 3,
     "userId": 3058,
     "isDefault": 0,
     "addTime": "1524528135",
     "holdName": "杨稳",
     "cardNumber": "6222084000007207445",
     "openCard": "中国工商银行兴东支行",
     "banqGenre": "中国工商银行",
     "banqImg": "http://tz.hxksky.com/wepay/upload/zggsyh.png"
     */
    static getUserBankListUrl(sessionId) {
        return url + "/bank/userBank?sessionId=" + sessionId;
    }

    /**
     * 删除银行卡
     *
     * @param {*} sessionId
     * @param {*} id
     * @returns  code 1
     */
    static delBankCardUrl(sessionId, id) {
        return url + "/bank/deleteBank?sessionId=" + sessionId + "&id=" + id;
    }

    /**
     * 添加银行卡
     * @param {*} sessionId
     * @param {*} cardId 银行类型id
     * @param {*} holdName 持卡人姓名
     * @param {*} openCard 开户支行
     * @param {*} cardNumber 银行卡号
     * @param {*} isDefault 是否默认绑定 0  是  ， 1  不是
     *
     */
    static addBankCardUrl(sessionId, cardId, holdName, openCard, cardNumber, isDefault) {
        return url + "/bank/addBank?sessionId=" + sessionId + "&cardId=" + cardId + "&holdName=" + holdName + "&openCard=" + openCard + "&cardNumber=" + cardNumber + "&isDefault=" + isDefault;
    }

    /**
     * 银行类型列表
     *  @return    "pid": 3, //暂时没用 只要用qid
     "banqGenre": "中国工商银行",
     "banqImg": "http://tz.hxksky.com/wepay/upload/zggsyh.png",
     "qid": 3

     */
    static getBankListUrl() {
        return url + "/bank/bankNameList"
    }

    /**
     * 获取系统公告列表
     *
     * @param {*} sessionId
     * @param {*} pageIndex 分页码
     * @returns
     *  "id": 90,
     "title": "众筹公告1",
     "addtime": 1526389977
     */
    static getSystemNews(sessionId, pageIndex) {
        return url + "/news/list?sessionId=" + sessionId + "&pageIndex=" + pageIndex;
    }

    /**
     * 获取系统公告详情
     * @param {*} sessionId
     * @param {*} id
     * @returns
     * "id": 90,
     * "title": "11",
     * "addtime": 1526389977,
     * "content": "11"
     */
    static getSystemgNewsDetails(sessionId, id) {
        return url + "/news/detail?sessionId=" + sessionId + "&id=" + id;
    }


    /**
     * 获取个人消息列表
     * @param {*} sessionId
     * @param {*} id
     * @returns
     *  "id": 10,
     "sendName": "平台",             发送人名称
     "receiverUid": 26536,           接受者id
     "content": "测试", 内容
     "title": "平台向用户发送消息9",      标题
     "createTime": 1531297710,           发送时间
     "status": 1    未读：0，已读：1
     */
    static getNews(sessionId, pageIndex) {
        return url + "/message/list?sessionId=" + sessionId + "&pageIndex=" + pageIndex;
    }

    /**
     * 获取个人消息详情
     * @param {*} sessionId
     * @param {*} id
     * @returns
     *  "id": 10,
     "sendName": "平台",             发送人名称
     "receiverUid": 26536,           接受者id
     "content": "测试", 内容
     "title": "平台向用户发送消息9",      标题
     "createTime": 1531297710,           发送时间
     "status": 1    未读：0，已读：1
     */
    static getNewsDetails(sessionId, id) {
        return url + "/message/detail?sessionId=" + sessionId + "&id=" + id;
    }

    /**
     * 获取收货地址列表
     * @param {*} sessionId
     * @param {*} id
     * @returns
        "addressId": 36,
     "memberId": "1870",
     "name": "阮先生",
     "telephone": "18975978788",
     "address": "城东南工业园高速公路桥底顺风洗车",
     "cityId": "邵阳市",
     "countryId": "隆回县",
     "provinceId": "湖南",
     "zt": 1
     */
    static getAddressList(sessionId) {
        return url + "/address/list?sessionId=" + sessionId
    }

    /**
     * 删除银行卡
     *
     * @param {*} sessionId
     * @param {*} addressId
     * @returns  code 1
     */
    static delAddressUrl(sessionId, addressId) {
        return url + "/address/delete?sessionId=" + sessionId + "&addressId=" + addressId;
    }

    /**
     * 添加地址
     *
     * @param {*} sessionId
     * @param {*} memberId   用户id
     * @param {*} name
     * @param {*} telephone    电话号
     * @param {*} provinceId   省
     * @param {*} cityId       市
     * @param {*} countryId   区/县
     * @param {*} address   详细地址
     * @param {*} zt
     */
    static putAddress(sessionId, memberId, name, telephone, provinceId, cityId, countryId, address, zt) {
        return url + "/address/add?sessionId=" + sessionId
            + "&memberId=" + memberId
            + "&name=" + name
            + "&telephone=" + telephone
            + "&provinceId=" + provinceId
            + "&cityId=" + cityId
            + "&countryId=" + countryId
            + "&address=" + address
            + "&zt=" + zt;
    }

    /**
     * 编辑地址
     *
     * @param {*} sessionId
     * @param {*} addressId   地址id
     * @param {*} memberId   用户id
     * @param {*} name
     * @param {*} telephone    电话号
     * @param {*} provinceId   省
     * @param {*} cityId       市
     * @param {*} countryId   区/县
     * @param {*} address   详细地址
     * @param {*} zt
     */
    static editAddress(sessionId, addressId, memberId, name, telephone, provinceId, cityId, countryId, address, zt) {
        return url + "/address/update?sessionId=" + sessionId
            + "&addressId=" + addressId
            + "&memberId=" + memberId
            + "&name=" + name
            + "&telephone=" + telephone
            + "&provinceId=" + provinceId
            + "&cityId=" + cityId
            + "&countryId=" + countryId
            + "&address=" + address
            + "&zt=" + zt;
    }

    /**
     *  获取默认地址信息
     *
     * @returns
        3.1    addressId        地址id
     3.2    memberId        用户id
     3.3    name        收货人姓名
     3.4    telephone        收货人手机号
     3.5    address        收货人详细地址
     3.6    cityId        市
     3.7    countryId        县
     3.8    provinceId        省
     3.9    zt        是否默认1是默认收货地址，0为不勾选
     * @param {*} sessionId
     */
    static getDefaultAddressUrl(sessionId) {
        return url + "/address/default?sessionId=" + sessionId;
    }


    /**
     * 分享记录
     * @param {*} sessionId
     * @param {*} pageIndex
     3.1    userid        用户id
     3.2    mobile        用户手机号
     3.3    username        用户名
     3.4    regDate        注册时间
     3.5    useGrade        用户等级0为初始会员，3为VIP
     3.6    imgHead        用户头像
     */
    static shareRecord(sessionId, pageIndex, keyword) {
        return url + "/user/shareRecord?sessionId=" + sessionId
            + "&pageIndex=" + pageIndex
            + "&keyword=" + keyword
    }

    /**
     * 转出-获取转入用户的信息
     *
     * @param {*} sessionId
     * @param {*} account  对方账户 手机号
     *
     * @returns
     *  1    code    是    状态码
     2    msg        是    错误信息
     3    data    是    数据(code=1返回数据)
     3.1    userid            用户id
     3.2    mobile            手机号
     3.3    username        用户名
     3.4    userCredit        用户星级
     3.5    imgHead            头像地址
     3.6    newMessage        暂时没用
     */

    static getUserBy(sessionId, account) {
        return url + "/tranMoney/getUser?sessionId=" + sessionId + "&account=" + account
    }


    /**
     * 转出-余额转出
     * POST
     * @param {*} sessionId
     * @param {*} payId   支付会员id
     * @param {*} getId   收入方id
     * @param {*} getNums    转出数
     * @param {*} mobile   手机后4位
     * @param {*} safetyPwd       交易密码
     *
     * @returns code 1,0
     */
    static tranOutMoney() {
        return url + "/store/outMoney"
    }


    /**
     * 获取转出-获取转出记录
     * @param {*} sessionId
     * @param {*} pageIndex
     *  // 1    code    是    状态码
     // 2    msg    是    错误信息
     // 3    data    是    数据(code=1返回集合数据)
     // 3.1    id        转出记录id
     // 3.2    payId        支付人id
     // 3.3    getId        对方id
     // 3.4    getNums        转账总金额
     // 3.5    getTime        转账时间
     // 3.6    getType        类型 0-转账
     // 3.7    username        对方用户名
     // 3.8    imgHead        对方头像（需要添加前缀如：如http://tz.hxksky.com/wepay/upload/
     */
    static getOutRecord(sessionId, pageIndex) {
        return url + "/tranMoney/outRecord?sessionId=" + sessionId
            + "&pageIndex=" + pageIndex;
    }

    /**
     * 转入-获取转入记录
     *
     * @param {*} sessionId
     * @param {*} pageIndex
     * 返回参数与转出一样
     */
    static getInRecord(sessionId, pageIndex) {
        return url + "/tranMoney/inRecord?sessionId=" + sessionId
            + "&pageIndex=" + pageIndex;
    }


    /**
     * 积分兑换
     * @param {*} sessionId
     * @param {*} exchangeMoney 需要兑换余额
     * @param {*} safetyPwd 交易密码
     * 请求方式:POST
     */
    static creditsExchange() {
        return url + "/store/creditsExchange?"
    }

    /**
     * 获取积分兑换的数量
     * @param {*} sessionId
     * @param {*} exchangeMoney 需要兑换余额
     * 请求方式:POST/GET
     *
     * @returns data 实际获得积分 , "data": 720
     */
    static getExchangeIntegral(sessionId, exchangeMoney) {
        return url + "/store/actualGetIntegral?sessionId=" + sessionId
            + "&exchangeMoney=" + exchangeMoney;
    }


    /**
     * 积分兑换记录
     * @param {*} sessionId
     * @param {*} pageIndex
     */
    static getExchangeRecord(sessionId, pageIndex) {
        return url + "/tranMoney/exchangeRecord?sessionId=" + sessionId
            + "&pageIndex=" + pageIndex;
    }

    /**
     * 积分记录
     * @param {*} sessionId
     * @param {*} pageIndex
     */
    static getExchangeRecordJ(sessionId, pageIndex) {
        return url + "/tranMoney/integralRecord?sessionId=" + sessionId
            + "&pageIndex=" + pageIndex;
    }

    /**
     * 余额记录
     * @param {*} sessionId
     * @param {*} pageIndex
     */
    static getExchangeRecordY(sessionId, pageIndex) {
        return url + "/tranMoney/balanceRecord?sessionId=" + sessionId
            + "&pageIndex=" + pageIndex;
    }


    /**
     * 卖出-创建卖出订单
     *
     * POST
     *
     * @param:
     * sessionId    是    token    String
     * exchangeMoney 是    需要卖出余额    int
     * safetyPwd     是    交易密码    String
     * describe     是    描述    String
     * bankId      是    银行卡id    int
     *
     *
     */
    static createOutOrder() {
        return url + "/trans/createOutOrder";
    }


    /**
     * 卖出-未完成订单-未选择打款人
     * @param {*} sessionId
     * @returns
        序号    参数名称    一定会返回    描述
     1    code    是    状态码
     2    msg    是    错误信息
     3    data    是    数据(code=1返回集合数据)
     3.1    id        挂单id
     3.2    payoutId        转出余额会员id
     3.3    payinId        转入会员id
     3.4    payNums        挂出金额
     3.5    payState        订单状态:0->默认上架,1->有人买入,2->已打款,3->确认到款(已完成)
     3.6    payTime        订单生成时间
     3.7    payNo        订单编号
     3.8    cardId        会员银行卡id
     3.9    tradeNotes        订单备注
     3.10    transType        0->卖出,1->买入
     3.11    transImg        打款凭证
     3.12    getMoneytime        收到款时间
     3.13    feeNums        手续费
     */
    static getOutUndoneUnselectedUrl(sessionId, pageIndex) {
        return url + "/trans/outUndoneUnselected?sessionId=" + sessionId + "&pageIndex=" + pageIndex;
        ;
    }

    /**
     * 卖出-未完成订单-已选择打款人
     * @param {*} sessionId
     * @returns
        序号    参数名称    一定会返回    描述
     1    code    是    状态码
     2    msg    是    错误信息
     3    data    是    数据(code=1返回集合数据)
     3.1    id        挂单id
     3.2    payoutId    转出余额会员id
     3.3    payinId        转入会员id
     3.4    payNums        转出数量
     3.5    payState    订单状态:0->默认上架,1->有人买入,2->已打款,3->确认到款(已完成)
     3.6    payTime        订单生成时间
     3.7    payNo        订单编号
     3.8    userName    打款人姓名
     3.9    mobile        手机号
     */
    static getOutUndoneSelectedUrl(sessionId, pageIndex) {
        return url + "/trans/outUndoneSelected?sessionId=" + sessionId + "&pageIndex=" + pageIndex;
    }


    /**
     * 卖出-确认收款-记录
     * @param {*} sessionId
     * @returns
        序号    参数名称    一定会返回    描述
     1    code    是    状态码
     2    msg    是    错误信息
     3    data    是    数据(code=1返回集合数据)
     3.1    id        挂单id
     3.2    payoutId        转出余额会员id
     3.3    payinId        转入会员id
     3.4    payNums        卖出金额
     3.5    payState        订单状态:0->默认上架,1->有人买入,2->已打款,3->确认到款(已完成)
     3.6    payTime        订单生成时间
     3.7    payNo        订单编号
     3.8    userName        打款人姓名
     3.9    mobile        手机号
     3.10    transImg        打款截图（需要添加前缀如：如http://tz.hxksky.com/wepay/upload/
     ）
     */
    static getOutAffirmProceeds(sessionId, pageIndex) {
        return url + "/trans/outAffirmProceeds?sessionId=" + sessionId + "&pageIndex=" + pageIndex;
    }


    /**
     * 卖出-已完成订单
     * @param {*} sessionId
     * @returns
        序号    参数名称    一定会返回    描述
     1    code    是    状态码
     2    msg    是    错误信息
     3    data    是    数据
     3.1    id        挂单id
     3.2    payoutId        转出余额会员id
     3.3    payinId        转入会员id
     3.4    payNums        买入金额
     3.5    payState        订单状态:0->默认上架,1->有人买入,2->已打款,3->确认到款(已完成)
     3.6    payTime        订单生成时间
     3.7    payNo        订单编号
     3.8    userName        收款人（打款人姓名）
     3.9    mobile        手机号
     3.10    transImg        打款截图（需要添加前缀如：如http://tz.hxksky.com/wepay/upload/）
     */
    static getOutCompleteOrder(sessionId, pageIndex) {
        return url + "/trans/outCompleteOrder?sessionId=" + sessionId + "&pageIndex=" + pageIndex;
    }


    /**
     *  卖出-确认收款-修改状态为确认收款
     * @param {*} sessionId
     * @id {*} id  挂单id
     */
    static getOutAPUpdate(sessionId, id) {
        return url + "/trans/outAPUpdate?sessionId=" + sessionId + "&id=" + id;
    }

    /**
     *  卖出-卖出中心
     * @param {*} sessionId
     * @param {*} pageIndex
     * @param {*} amount 匹配金额
     *
     1        code    是    状态码
     2        msg        是    错误信息
     3        data    是    数据（code=1返回集合）
     3.1    id            挂单id
     3.2    userName    求购者用户名
     3.3    payinId        求购者id
     3.4    payNums        交易金额
     3.5    imgHead        求购者头像
     3.6    userCredit    求购者信用
     3.7    banqGenre    支付方式
     *
     * @id {*} id  挂单id
     */
    static getOutSalesCenter(sessionId, pageIndex, amount) {
        return url + "/trans/outSalesCenter?sessionId=" + sessionId + "&pageIndex=" + pageIndex + "&amount=" + amount;
    }


    /**卖出-卖出中心-卖出
     *
     * POST
     *
     * @param {*} sessionId
     * @param {*} id          挂单id
     * @param {*} safetyPwd   交易密码
     *
     * @returns 数据 data （code=1}
     */
    static getSalesCenterSaleUrl() {
        return url + "/trans/salesCenterSale?";
    }

    /**
     *  取消订单
     * @param {*} sessionId
     * @id {*} id  挂单id
     */
    static getCncelBalanceOrder(sessionId, id) {
        return url + "/trans/cancelBalanceOrder?sessionId=" + sessionId + "&id=" + id;
    }


    /**
     * 卖出-创建卖出订单
     *
     * POST
     *
     * @param:
     * sessionId    是    token    String
     * exchangeMoney 是    需要卖出余额    int
     * safetyPwd     是    交易密码    String
     * describe     是    描述    String
     * bankId      是    银行卡id    int
     *
     *
     */
    static createInOrder() {
        return url + "/trans/createInOrder";
    }


    /**
     *  买入-未完成订单-未选择打款人
     * @param {*} sessionId
     * @param {*} pageIndex
     1    code    是    状态码
     2    msg    是    错误信息
     3    data    是    数据(code=1返回集合数据)
     3.1    id        挂单id
     3.2    payoutId        转出余额会员id
     3.3    payinId        转入会员id
     3.4    payNums        买入金额
     3.5    payState        订单状态:0->默认上架,1->有人买入,2->已打款,3->确认到款(已完成)
     3.6    payTime        订单生成时间
     3.7    payNo        订单编号
     3.8    cardId        会员银行卡id
     3.9    tradeNotes        订单备注
     3.10    transType        0->卖出,1->买入
     3.11    transImg        打款凭证
     3.12    getMoneytime        收到款时间
     3.13    feeNums        手续费
     3.14    outCard        买入会员银行卡id
     *
     */
    static getInUndoneUnselectedUrl(sessionId, pageIndex) {
        return url + "/trans/inUndoneUnselected?sessionId=" + sessionId + "&pageIndex=" + pageIndex;
    }

    /**
     * 买入-未完成订单-未选择打款人
     * @param {*} sessionId
     * @param {*} pageIndex
     1    code    是    状态码
     2    msg    是    错误信息
     3    data    是    数据(code=1返回集合数据)
     3.1    id        挂单id
     3.2    payoutId        转出余额会员id
     3.3    payinId        转入会员id
     3.4    payNums        买入金额
     3.5    payState        订单状态:0->默认上架,1->有人买入,2->已打款,3->确认到款(已完成)
     3.6    payTime        订单生成时间
     3.7    payNo        订单编号
     3.8    cardId        会员银行卡id
     3.9    tradeNotes        订单备注
     3.10    transType        0->卖出,1->买入
     3.11    transImg        打款凭证
     3.12    getMoneytime        收到款时间
     3.13    feeNums        手续费
     3.14    outCard        买入会员银行卡id
     *
     */
    static getInUndoneSelectedUrl(sessionId, pageIndex) {
        return url + "/trans/inUndoneSelected?sessionId=" + sessionId + "&pageIndex=" + pageIndex;
    }

    /**买入-确认打款 列表
     *
     * @param {*} sessionId
     * @param {*} pageIndex
     *
     1    code    是    状态码
     2    msg    是    错误信息
     3    data    是    数据(code=1返回集合数据)
     3.1    id        挂单id
     3.2    payoutId        转出余额会员id
     3.3    payinId        转入会员id
     3.4    payNums        买入金额
     3.5    payState        订单状态:0->默认上架,1->有人买入,2->已打款,3->确认到款(已完成)
     3.6    payTime        订单生成时间
     3.7    payNo        订单编号
     3.8    holdName        收款人姓名
     3.9    mobile        手机号码
     3.10    transImg        打款截图
     3.11    banqGenre        开户银行
     3.12    cardNumber        银行卡号
     3.13    openCard        开户支行
     3.14    getMoneyTime        订单完成时间
     3.15    userName        收款人
     *
     */
    static getInAffirmProceeds(sessionId, pageIndex) {
        return url + "/trans/inAffirmProceeds?sessionId=" + sessionId + "&pageIndex=" + pageIndex;
    }


    /**
     * .买入-确认打款-修改打款
     *
     * POST
     *
     参数名称    是否必须    描述       格式
     sessionId    是        token        String
     id            是        挂单id         int
     file        是        打款截图      file
     */
    static getInAPUpdateUrl() {
        return url + "/trans/inAPUpdate"
    }

    /*买入-已完成订单
     * 
     * @param {*} sessionId 
     * @param {*} pageIndex 
     * 
     1	code	是	状态码 
     2	msg	是	错误信息
     3	data	是	数据(code=1返回集合数据)
     3.1	id		挂单id
     3.2	payoutId		转出余额会员id
     3.3	payinId		转入会员id
     3.4	payNums		买入金额
     3.5	payState		订单状态:0->默认上架,1->有人买入,2->已打款,3->确认到款(已完成)
     3.6	payTime		订单生成时间
     3.7	payNo		订单编号
     3.8	holdName		收款人姓名
     3.9	mobile		手机号码
     3.10	transImg		打款截图
     3.11	banqGenre		开户银行
     3.12	cardNumber		银行卡号
     3.13	openCard		开户支行
     3.14	getMoneyTime		订单完成时间
     * 
     */
    static getInCompleteOrder(sessionId, pageIndex) {
        return url + "/trans/inCompleteOrder?sessionId=" + sessionId + "&pageIndex=" + pageIndex;
    }

    /**
     *  买入-买入中心
     * @param {*} sessionId
     * @param {*} pageIndex
     * @param {*} amount 匹配金额
     *
     1        code    是        状态码
     2        msg        是        错误信息
     3        data    是        数据（code=1返回集合）
     3.1    id                挂单id
     3.2    userName        出售者用户名
     3.3    payoutId        出售者id
     3.4    payNums            交易金额
     3.5    imgHead            出售者头像
     3.6    userCredit        出售者信用
     3.7    banqGenre        支付方式
     *
     *
     */
    static getCallCenter(sessionId, pageIndex, amount) {
        return url + "/trans/callCenter?sessionId=" + sessionId + "&pageIndex=" + pageIndex + "&amount=" + amount;
    }


    /**买入-买入中心-买入
     *
     * POST
     *
     * @param {*} sessionId
     * @param {*} id          挂单id
     * @param {*} safetyPwd   交易密码
     *
     * @returns 数据 data （code=1}
     */
    static getCallCenterBuyUrl() {
        return url + "/trans/callCenterBuy"
    }


    /**
     *   买入-买入记录
     * @param {*} sessionId
     * @param {*} pageIndex
     *
     1        code    是    状态码
     2        msg        是    错误信息
     3        data    是    数据（code=1返回集合）
     3.1    id            挂单id
     3.2    userName        卖出账号用户名
     3.3    payinId        卖出账号会员id
     3.4    payNums        买入金额
     3.5    getMoneyTime        买入时间
     *
     */
    static getInBuyRecords(sessionId, pageIndex) {
        return url + "/trans/inBuyRecords?sessionId=" + sessionId + "&pageIndex=" + pageIndex;
    }


    /**
     *   卖出-卖出记录
     * @param {*} sessionId
     * @param {*} pageIndex
     *
     1        code    是    状态码
     2    msg    是    错误信息
     3        data    是    数据（code=1返回集合）
     3.1    id            挂单id
     3.2    userName        买入账号用户名
     3.3    payinId        买入账号会员id
     3.4    payNums        卖出金额
     3.5    getMoneyTime        卖出时间
     *
     */
    static getOutSellRecords(sessionId, pageIndex) {
        return url + "/trans/outSellRecords?sessionId=" + sessionId + "&pageIndex=" + pageIndex;
    }


    /**
     *  积分释放到余额
     * @param {*} sessionId
     * @returns code  1,0
     */
    static integralRelease(sessionId) {
        return url + "/store/integralRelease?sessionId=" + sessionId;
    }


    /**
     *  申请店铺-店铺状态
     *  描述:    判断是否有店铺，是否申请中
     * @return data    是    数据0.申请中,1.已通过,2.去申请
     * @param {*} sessionId
     */
    static getStoreStatus(sessionId) {
        return url + "/verify/status?sessionId=" + sessionId;
    }


    /**
     * .申请店铺-获取店铺类型列表（商品分类）
     * @param {*} sessionId
     * @param {*} pageIndex
     *
     序号    参数名称    一定会返回    描述
     1    code    是    状态码
     2    msg    是    错误信息
     3    data    是    数据（返回集合）
     3.1    id        分类id
     3.2    name        分类名称
     3.3    serialNumber        序号（暂时没用）
     3.4    createTime        创建时间
     3.5    pid        上级分类id（暂时没用）
     3.6    status        状态（1.在客户端显示,0.不显示）暂时没用
     3.7    pic        分类图片（暂时没用）
     *
     */
    static getCateList() {
        return url + "/verify/cateList";
    }

    /**
     * 申请店铺
     * post
     序号    参数名称    是否必须    描述    格式
     1    sessionId    是    token    String
     2    file    是    身份证正反照    file
     3    typeId
     是    店铺分类id    int
     4    realname
     是    真实姓名    String
     5    idcard
     是    身份证号    String
     6    phone
     是    手机号    String
     7    shopName
     是    店铺名称    String
     8    shopAddress
     是    店铺地址    String
     */
    static applyStore() {
        return url + "/verify/add";
    }

    /**
     * 添加商品
     *
     * post
     *
     1    sessionId    是    token    String
     2    file       是    商品封面图    file
     3    goodsName  是    商品名称    String
     4    goodsPrice 是    商品价格  double
     5    goodsStock 是    商品库存 int
     */
    static getAddShopUrl() {
        return url + "/goods/add";
    }

    /**
     * 删除商品
     * @param sessionId
     * @param goodsId
     * @returns {string}
     */
    static deleteShopUrl(sessionId, goodsId,) {
        return url + "/goods/delete?sessionId=" + sessionId + "&goodsId=" + goodsId
    }


    /**
     * 添加商品
     *
     * post
     *
     1    sessionId    是    token    String
     2    file       是    商品封面图    file
     3    goodsName  是    商品名称    String
     4    goodsPrice 是    商品价格  double
     5    goodsStock 是    商品库存 int
     6  id    是    商品id    int
     */
    static getUpdateShopUrl() {
        return url + "/goods/update";
    }


    /**
     * 商城 -商品列表 /搜索/分类
     * @param {*} sessionId
     * @param {*} pageIndex
     * @param {*} keyword  可选  搜索关键字
     * @param {*} typeId   可选  分类id
     *
     3.1    id        商品id
     3.2    goodsName        商品名称
     3.3    goodsPrice        商品价格
     3.4    goodsStock        商品库存
     3.5    coverPlan        商品封面图
     3.6    shopId        店铺id
     *
     */

    static getShopBySearch(sessionId, pageIndex, keyword, typeId) {
        var path = url + "/goods/all?sessionId=" + sessionId + "&pageIndex=" + pageIndex;
        if (keyword) {
            path += "&keyword=" + keyword
        }
        if (typeId) {
            path += "&typeId=" + typeId
        }
        return path
    }

    static getHomeShop(sessionId, pageIndex,typeId) {
        var path = url + "/goods/all?sessionId=" + sessionId + "&pageIndex=" + pageIndex +"&typeId=" + typeId;
        return path
    }



    /**
     * 商城 -商品列表 /搜索/分类
     * @param {*} sessionId
     * @param {*} pageIndex
     * @param {*} keyword  可选  搜索关键字
     * @param {*} typeId   可选  分类id
     *
     3.1    id        商品id
     3.2    goodsName        商品名称
     3.3    goodsPrice        商品价格
     3.4    goodsStock        商品库存
     3.5    coverPlan        商品封面图
     3.6    shopId        店铺id
     *
     */

    static getShopByType(sessionId, pageIndex, goodsType) {
        var path = url + "/special/goods?sessionId=" + sessionId + "&pageIndex=" + pageIndex;
        return path+"&goodsType=" + goodsType
    }


    /**
     *  商城 -店铺列表
     * @param {*} sessionId
     * @param {*} pageIndex
     *
     3.1    id        商品id
     3.2    goodsName        商品名称
     3.3    goodsPrice        商品价格
     3.4    goodsStock        商品库存
     3.5    coverPlan        商品封面图
     3.6    shopId        店铺id
     *
     */
    static getStoreList(sessionId, pageIndex, lng, lat) {
        return url + "/shop/nearby?sessionId=" + sessionId
            + "&pageIndex=" + pageIndex
            + "&lng=" + lng
            + "&lat=" + lat
    }

    /**
     *  我的店铺 - 商品列表
     * @param {*} sessionId
     * @param {*} pageIndex
     *
     3.1    id        商品id
     3.2    goodsName        商品名称
     3.3    goodsPrice        商品价格
     3.4    goodsStock        商品库存
     3.5    coverPlan        商品封面图
     3.6    goodsPic2        暂时没用
     3.7    goodsPic3        暂时没用
     3.8    goodsPic4        暂时没用
     3.9    goodsPic5        暂时没用
     3.10    goodsPic6        暂时没用
     3.11    goodsStatus        商品状态1.未上架，2.已上架
     3.12    createTime        创建时间
     3.13    shopId        店铺id
     3.14    show        是否显示1.显示，0.不显示
     3.15    classifyId        分类id
     3.16    uid        用户id
     *
     */
    static getMyStoreShop(sessionId, pageIndex) {
        return url + "/shop/indexGoods?sessionId=" + sessionId + "&pageIndex=" + pageIndex;
    }

    /**
     *  我的店铺 - 店铺收益
     * @param {*} sessionId
     *
     3.1    todayEarnings        今日收益
     3.2    totalRevenue        总收益
     *
     */
    static getMyStoreEarnings(sessionId) {
        return url + "/shop/earnings?sessionId=" + sessionId
    }


    /**
     * 修改商品状态 1.未上架  2.上架，3.下架
     * @param {*} sessionId
     * @param {*} pageIndex
     *
     1    sessionId    是    token    String
     2    id            是    商品id    int
     3    goodsStatus 是    商品状态。1.未上架，2.已上架，3.下架 int
     *
     */
    static updateStatus(sessionId, id, goodsStatus) {
        return url + "/goods/updateStatus?sessionId=" + sessionId + "&id=" + id + "&goodsStatus=" + goodsStatus
    }


    /**
     * 获取商品详情
     * @param {*} sessionId
     * @param {*} id   商品id
     *
     * goodsDtos 是商品中的一个属性
     *
     3.1    id        商品id
     3.2    goodsName        商品名称
     3.3    goodsPrice        商品价格
     3.4    goodsStock        商品库存
     3.5    coverPlan        商品封面图
     3.6    goodsPic2        暂时没用
     3.7    goodsPic3        暂时没用
     3.8    goodsPic4        暂时没用
     3.9    goodsPic5        暂时没用
     3.10    goodsPic6        暂时没用
     3.11    goodsStatus        商品状态
     3.12    createTime        创建时间
     3.13    shopId            店铺id
     3.14    show            是否显示1.显示，0.不显示
     3.15    classifyId        分类id
     3.16    uid        用户id
     */

    static getShopDetail(sessionId, goodsId) {
        var path = url + "/goods/particulars?sessionId=" + sessionId + "&goodsId=" + goodsId;
        return path
    }


    /**
     * 获取店铺详情
     * @param {*} sessionId
     * @param {*} id   商品id
     *
     *
     *
     3.1    goodsDtos        商品集合

     3.1.1    id        商品id
     3.1.2    goodsName        商品名称
     3.1.3    goodsPrice        商品价格
     3.1.4    goodsStock        商品库存
     3.1.5    coverPlan        商品封面图

     以上的goodsDtos 是商品中的一个属性

     3.1.6    shopId           店铺id
     3.2    shopName        店铺名称
     3.3    shopAddress        店铺地址
     3.4    shopPhone        商家电话
     3.5    imgHead            用户头像
     */

    static getStoreDetail(sessionId, shopId) {
        var path = url + "/shop/goods?sessionId=" + sessionId + "&shopId=" + shopId;
        return path
    }


    /**
     * 我的订单
     * @param {*} sessionId
     * @param {*} pageIndex
     * @param {*} orderStatus 订单状态1已支付（待发货）， 2已发货（待收货），  3交易完成(已收货)
     *
     3.1    id        订单id
     3.2    orderNo        订单号
     3.3    buyUid        买家id
     3.4    sellUid        卖家id
     3.5    goodsId        商品id
     3.6    payMoney        订单金额
     3.7    createTime        创建时间
     3.8    buyTime        付款时间
     3.9    deliveryTime        发货时间
     3.10    dealTime        收货时间（完成时间）
     3.11    goodsName        商品名称
     3.12    goodsNum        商品数量
     3.13    goodsImg        商品图片
     3.14    buyIntegral        买家获得积分
     3.15    sellerIncomeBalance        卖家获得余额
     3.16    sellerIncomeIntegral        卖家获得积分
     3.17    phone        商家电话
     *
     */
    static getMyOrderBy(sessionId, pageIndex, orderStatus) {
        return url + "/order/myOrder?sessionId=" + sessionId + "&pageIndex=" + pageIndex + "&orderStatus=" + orderStatus
    }

    /**
     * 店铺订单
     * @param {*} sessionId
     * @param {*} pageIndex
     * @param {*} orderStatus 订单状态1已支付（待发货）， 2已发货（待收货），  3交易完成(已收货)
     *
     3.1    id        订单id
     3.2    orderNo        订单号
     3.3    buyUid        买家id
     3.4    sellUid        卖家id
     3.5    goodsId        商品id
     3.6    payMoney        订单金额
     3.7    show        是否显示1.显示0.不显示
     3.8    createTime        创建时间
     3.9    buyTime        付款时间
     3.10    deliveryTime        发货时间
     3.11    dealTime        收货时间（完成时间）
     3.12    goodsName        商品名称
     3.13    goodsNum        商品数量
     3.14    goodsImg        商品图片
     3.15    status        状态1已支付（待发货）， 2已发货（待收货），  3交易完成(已收货)
     3.16    buyName        买家姓名
     3.17    buyPhone        买家电话
     3.18    buyAddress        买家地址
     3.19    kdName        快递名称（暂时没用）
     3.20    kdNo        快递单号（暂时没用）
     3.21    buyIntegral        买家获得积分
     3.22    sellerIncomeBalance        卖家获得余额
     3.23    sellerIncomeIntegral        卖家获得积分
     *
     */
    static getStoreOrderBy(sessionId, pageIndex, orderStatus) {
        return url + "/order/shopOrder?sessionId=" + sessionId + "&pageIndex=" + pageIndex + "&orderStatus=" + orderStatus
    }


    /**修改订单状态
     *
     * @param {*} sessionId
     * @param {*} id          订单id
     * @param {*} orderStatus 订单状态 2已发货（待收货），  3交易完成(已收货)
     */
    static updateOrderStatus(sessionId, id, orderStatus) {
        return url + "/order/updateStatus?sessionId=" + sessionId + "&orderId=" + id + "&orderStatus=" + orderStatus;
    }


    /**
     * 创建商城订单
     *
     * POST
     *
     * @param:
     1    sessionId    是    token    String
     2    addressId   是    地址id    int
     3    goodsId    是    商品id    int
     4    goodsNum   是    商品数量    int
     5    safetyPwd  是    交易密码    String
     *
     *
     */
    static createShopOrder() {
        return url + "/order/create";
    }


    /**
     * 获取转出-获取转出记录
     * @param {*} sessionId
     * @param {*} pageIndex
     *  // 1    code    是    状态码
     // 2    msg    是    错误信息
     // 3    data    是    数据(code=1返回集合数据)
     // 3.1    id        转出记录id
     // 3.2    payId        支付人id
     // 3.3    getId        对方id
     // 3.4    getNums        转账总金额
     // 3.5    getTime        转账时间
     // 3.6    getType        类型 0-转账
     // 3.7    username        对方用户名
     // 3.8    imgHead        对方头像（需要添加前缀如：如http://tz.hxksky.com/wepay/upload/
     */
    static getOutRecord(sessionId, pageIndex) {
        return url + "/tranMoney/outRecord?sessionId=" + sessionId
            + "&pageIndex=" + pageIndex;
    }


    //数字货币

    /**
     * 用于输入交易密码显示对方用户名
     * @param {*} transferAddress
     *  // 1    code    是    状态码
     // 2    msg    是    错误信息
     //data    是    数据(对方用户名)
     */
    static getUserName(transferAddress) {
        return url + "/coin/getUserName?transferAddress=" + transferAddress
    }

    /**
     * 转出wepay币给对方
     *
     * POST
     *
     * @param:
     1    sessionId 是    用户标识    string
     2    transferNum 是    转出数量    double
     3    transferAddress 是    转出地址（UID/手机号/钱包地址）    String
     4    safetyPwd 是    交易密码    int
     *
     */
    static transfer() {
        return url + "/coin/transfer";
    }


    /**
     * 原为交易记录需要修改为转账记录
     * @param {*} sessionId
     * @param {*} pageIndex
     *  // 1    code    是    状态码
     // 2    msg    是    错误信息
     // 3    data    是    数据(code=1返回集合数据)
     "getNums": 0.22,
     "getTime": "1534322728",
     "userName": "零零8"
     */
    static tradingRecord(sessionId, pageIndex, recordType) {
        return url + "/wetrans/tradingRecord?sessionId=" + sessionId
            + "&pageIndex=" + pageIndex + "&recordType=" + recordType;
    }

    /**
     * 数字资产首页
     * @param {*} sessionId
     序号    参数名称    一定会返回    描述
     1    code    是    状态码
     2    msg    是    错误信息
     3    data    是    数据
     3.1    currPrice        当前价格
     3.2    num        Wepay资产
     3.3    walletAddress        钱包地址
     3.4    coinVos        货币信息集合
     3.4.1    cid        货币id
     3.4.2    num        货币数量
     3.4.3    coinPrice        当前价格
     3.4.5    coinName        货币名称
     */
    static numberIndex(sessionId) {
        return url + "/coin/index?sessionId=" + sessionId
    }

    /**
     * .订单
     * @param sessionId
     * @param pageIndex
     * @param status 订单状态（0.进行中，1.已完成）
     * @param cid  币种id
     * @returns {
        3.1	id		订单id
        3.2	num		订单剩余数量
        3.3	sellId		用户id
        3.4	feeNum		手续费
        3.5	createTime		订单创建时间
        3.6	status		订单状态（0.进行中，1.已完成）
        3.7	cid		币种id
        3.8	type		1,出售 2,购买
        3.9	tprice		总价
        3.10	dprice		单价
        3.11	ynum		数量
     * }
     */
    static orderRecord(sessionId, pageIndex, status, cid) {
        return url + "/deal/order?sessionId=" + sessionId
            + "&pageIndex=" + pageIndex + "&status=" + status + "&cid=" + cid
    }

    /**
     *  取消订单
     * @param {*} sessionId
     * @id {*} id  挂单id
     */
    static cancelOrder(sessionId, orderId) {
        return url + "/deal/cancelOrder?sessionId=" + sessionId + "&orderId=" + orderId;
    }

    /**
     * W宝首页所有数据
     * @param sessionId
     * @param pageIndex
     * @param recordType
     * @returns {string}
     */
    static getWBIndex(sessionId, pageIndex, recordType) {
        return url + "/wbao/index?sessionId=" + sessionId
            + "&pageIndex=" + pageIndex + "&recordType=" + recordType
    }

    /**
     * 锁定
     * @param sessionId
     * @param num
     * @param safetyPwd
     * @returns {string}
     */
    static lockAssetWb() {
        return url + "/wbao/lockAsset"
    }

    /**
     * 转入
     * @param sessionId
     * @param num
     * @param safetyPwd
     * @returns {string}
     */
    static rollInWb() {
        return url + "/wbao/rollIn"
    }

    /**
     * 转出
     * @param sessionId
     * @param num
     * @param safetyPwd
     * @returns {string}
     */
    static rollOut() {
        return url + "/wbao/rollOut"
    }


    /**
     * 众筹记录
     * @param {*} sessionId
     * @param {*} pageIndex
     *  // 1    code    是    状态码
     // 2    msg    是    错误信息
     // 3    data    是    数据(code=1返回集合数据)
     "getNums": 0.22,
     "getTime": "1534322728",
     "userName": "零零8"
     */
    static zhongchouRecord(sessionId, pageIndex, recordType) {
        return url + "/crowdsDetail/record?sessionId=" + sessionId
            + "&pageIndex=" + pageIndex + "&recordType=" + recordType;
    }

    /**
     * 数字资产交易中心数据
     * @param sessionId
     * @param coinId 货币id
     * @returns {string}
     *
     * 3.1    coinPrice        当前价格
     3.2    coinId        货币id
     3.3    walletBalance        钱包余额
     3.4    coinBalance        货币余额
     3.5    maxPrice        最高价
     3.6    minPrice        最低价
     3.7    oneHour        1小时数据
     3.8    fiveHour        5小时数据
     3.9    dateLine        1天数据

     coinPrice        价格
     coinAddtime        时间
     */
    static coinDeal(sessionId, coinId) {
        return url + "/coin/deal?sessionId=" + sessionId + "&coinId=" + coinId;
    }

    /**数字资产交易中心订单列表
     *
     * @param sessionId
     * @param pageIndex
     * @param coinId  货币id
     * @param orderType 订单类型1.购买，2.出售
     * @returns {string}
     */
    static dealOrder(sessionId, pageIndex, orderType, coinId) {
        return url + "/coin/dealOrder?sessionId=" + sessionId + "&pageIndex=" + pageIndex + "&orderType=" + orderType + "&coinId=" + coinId;
    }


    /**
     * 数字资产交易中心购买
     * 1    sessionId  是    用户标识    string
     2    safetyPwd    是    交易密码    String
     3    id    是    订单id    int
     4    num    是    购买数量    double
     */
    static dealBuy() {
        return url + "/deal/buy"
    }

    /**
     * 数字资产交易中心出售
     * 1    sessionId  是    用户标识    string
     2    safetyPwd    是    交易密码    String
     3    id    是    订单id    int
     4    num    是    购买数量    double
     */
    static dealSell() {
        return url + "/deal/sell"
    }


    /**
     * .订单
     * @param sessionId
     * @param pageIndex
     * @param status 订单状态（0.进行中，1.已完成）
     * @param cid  币种id
     * @returns {
        3.1	id		订单id
        3.2	num		订单剩余数量
        3.3	sellId		用户id
        3.4	feeNum		手续费
        3.5	createTime		订单创建时间
        3.6	status		订单状态（0.进行中，1.已完成）
        3.7	cid		币种id
        3.8	type		1,出售 2,购买
        3.9	tprice		总价
        3.10	dprice		单价
        3.11	ynum		数量
     * }
     */
    static teadeRecord(sessionId, pageIndex, cid) {
        return url + "/dealDetail/record?sessionId=" + sessionId
            + "&pageIndex=" + pageIndex + "&cid=" + cid
    }


    /**
     * 发布出售订单
     *
     * POST
     *
     1    sessionId
     是    用户标识    string
     2    cid
     是    币种id    int
     3    num    是    出售数量    double
     4    price    是    出售价格    double
     5    safetyPwd    是    交易密码    String
     *
     *
     */
    static createSellOrder() {
        return url + "/deal/createOutOrder";
    }

    /**
     * 发布求购订单
     *
     * POST
     *
     1    sessionId
     是    用户标识    string
     2    cid
     是    币种id    int
     3    num    是    出售数量    double
     4    price    是    出售价格    double
     5    safetyPwd    是    交易密码    String
     *
     *
     */
    static createBuyOrder() {
        return url + "/deal/createInOrder";
    }


    /**
     * 商家联盟首页-获取条件
     *
     * get
     *
     code    是    状态码
     msg    是    错误信息
     data    是    数据
     remark        备注
     status        用户当前状态（是否是代理）1.可申请，2.未达到条件，3.正在审核，4已经是代理
     condition        申请条件（List集合）
     *
     *
     */
    static getUnion(sessionId) {
        return url + "/engoy/index?sessionId=" + sessionId;
    }

    /**
     * .商家联盟-添加申请
     *
     * POST
     sessionId    是    token    String
     file    是    图片123张为办公图片，4为营业执照    file
     realname    是    代理人姓名    String
     phone    是    联系方式    String
     agencyArea    是    代理区域    String
     businessScope    是    经营范围    String
     workAddress    是    办公地址    String
     */
    static engoyApply() {
        return url + "/engoyApply/add"
    }


    /**
     * .商家联盟-搜索代理
     *
     sessionId    是    token    String
     keyword    是    代理区域    String
     pageIndex    是    页码    int

     * @returns {
        3.1	id
        3.2	uid		用户id
        3.3	realname		代理人姓名
        3.4	phone		联系方式
        3.5	status		代理状态
        3.6	agencyArea		代理区域
        3.7	businessScope		经营范围
        3.8	workAddress		办公地址
        3.9	workImg1		办公图片1
        3.10	workImg2		办公图片2
        3.11	workImg3		办公图片3
        3.12	createTime		创建时间
        3.13	imgHead		用户头像
     * }
     */
    static searchUnion(sessionId, pageIndex, keyword) {
        return url + "/engoy/search?sessionId=" + sessionId
            + "&pageIndex=" + pageIndex + "&keyword=" + keyword
    }

    /**商家联盟-代理主页
     *
     * @param sessionId
     */
    static agency(sessionId) {
        return url + "/engoy/agency?sessionId=" + sessionId

    }

}