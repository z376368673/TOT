import DialogUtils from './DialogUtils';
import BaseUrl from './BaseUrl';
export default class HttpUtils {
    /**
     * 
     * @param {*} url 
     */
    static getData(url) {
        // console.warn(url)
        return new Promise((resolve, reject) => {
            fetch(url)
                .then(response => response.json())
                .then(result => {
                   // console.log(JSON.stringify(result))
                    resolve(result);
                })
                .catch(error => {
                   this.errorMsg(error)
                   reject(error);
                })
        })
    }

    /**错误信息解析
     * 
     * @param {*} error 
     */
    static errorMsg(error ){
        DialogUtils.hideLoading()
        //console.error(error.message)
       // console.warn(error.message)
        var message  = JSON.stringify(error.message)
        if(message.startsWith("Network")&&message.endsWith("failed")){
            DialogUtils.showToast("网络异常，请检查网络")
        }else{
            DialogUtils.showToast("网络状态不佳，请检查网络")
        }
    }
    /**
     * 
     * @param {*} url 
     * @param {*} data 
     */
    static postData(url, data) {
       // console.warn(url + JSON.stringify(data))
        var formData = new FormData();
        for (const key in data) {
            formData.append(key,data[key]);
        }
        return new Promise((resolve, reject) => {
            fetch(url, {
                method: 'POST',
                header: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    //'charset':'UTF-8'
                },
                 body: formData,
             
            })
                .then(response => response.json())
                .then(result => {
                    console.log(JSON.stringify(result))
                    resolve(result);
                })
                .catch(error => {
                    reject(error);
                    this.errorMsg(error)
                    DialogUtils.hideLoading()
                })
        })
    }

    /**
     * 上传文件
     * 
     * @param {*} obj obj型键值对
     * @param {*} imgAry 文件数组
     * @param {*} callback 成功回调方法
     */
    static uploadImage(url,obj,imgAry,callback) {
        DialogUtils.showLoading()
        let formData = new FormData();       //因为需要上传多张图片,所以需要遍历数组,把图片的路径数组放入formData中
        for (var i = 0; i < imgAry.length; i++) {
            //截取获取文件名
            var a = imgAry[i].uri;
            var arr = a.split('/');
            // 获取文件名end
            // 判断文件的类型(视频-图片等)end
            //let file = { uri: imgAry[i].uri, type: imgAry[i].mime, name: arr[arr.length - 1] };   //这里的key(uri和type和name)不能改变,
            let uri =  imgAry[i].uri
            let starIndex =  uri.lastIndexOf(".")
            let suffix  =  uri. substring(starIndex,uri.length).toLocaleLowerCase()
            if(suffix===".jpg"||suffix===".png"||suffix===".jpeg"){
                let file = { uri: imgAry[i].uri, type: "application/octet-stream", name: arr[arr.length - 1] };   //这里的key(uri和type和name)不能改变,
                formData.append("file", file);   //这里的files就是后台需要的key
            }else{
                DialogUtils.hideLoading()
                DialogUtils.showMsg("只支持png或jpg格式图片....")
                return;
            }
        }
        for (const key in obj) {
            formData.append(key, obj[key]);  
        }
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            body: formData,
        })
        .then((response) => response.json())
        .then(result=>{
            DialogUtils.hideLoading()
            callback(result)
        })
        .catch((error) => {
                DialogUtils.hideLoading()
                //DialogUtils.showToast("上传失败"+error.message)
            });
    }


    // /**
    //  * 上传文件
    //  * 
    //  * @param {*} obj obj型键值对
    //  * @param {*} imgAry 文件数组
    //  * @param {*} callback 成功回调方法
    //  */
    // static uploadImage(url,obj,imgAry,callback) {
    //     DialogUtils.showLoading()
    //     let formData = new FormData();       //因为需要上传多张图片,所以需要遍历数组,把图片的路径数组放入formData中
    //     for (var i = 0; i < imgAry.length; i++) {
    //         //截取获取文件名
    //         var a = imgAry[i].uri;
    //         var arr = a.split('/');
    //         // 获取文件名end
    //         // 判断文件的类型(视频-图片等)end
    //         let file = { uri: imgAry[i].uri, type: imgAry[i].mime, name: arr[arr.length - 1] };   //这里的key(uri和type和name)不能改变,
    //         formData.append("file", file);   //这里的files就是后台需要的key
    //         //这里的files就是后台需要的key
    //     }
    //     for (const key in obj) {
    //         formData.append(key, obj[key]);  
    //     }
    //     fetch(url, {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'multipart/form-data',
    //         },
    //         body: formData,
    //     })
    //     .then((response) => response.json())
    //     .then(result=>{
    //         DialogUtils.hideLoading()
    //         callback(result)
    //     })
    //     .catch((error) => {
    //             DialogUtils.hideLoading()
    //             DialogUtils.showToast("上传失败"+error.message)
    //             alert("error:"+error.message)
    //         });
    // }


    //使用案例
    componentDidMount() {
        HttpUtils.getData('https://www.baidu.com')
            .then(result => {
                this.setState({
                    result: 'result',
                    // result:JSON.stringify(result),
                })
            })
            .catch(error => {
                this.setState({
                    result: error.toString()
                })
            })
    }
}