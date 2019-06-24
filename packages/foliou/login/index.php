<?php
define("TOKEN", "pengpengzuishuai");

$wechatObj = new CallbackAPI;
$wechatObj->valid();

class CallbackAPI {

    /**
     * 签名验证
     * @return [type] [description]
     */
     public function valid() {
        $echoStr = $_GET["echostr"];
        $signature = $_GET["signature"];
        $timestamp = $_GET["timestamp"];
        $nonce = $_GET["nonce"];
        $token = TOKEN;
        //将token、timestamp、nonce按字典序排序
        $tmpArr = array($token, $timestamp, $nonce);
        sort($tmpArr);      
        $tmpStr = implode($tmpArr);
        //对tmpStr进行sha1加密
        $tmpStr = sha1($tmpStr);
        if($tmpStr == $signature){
            header('content-type:text');
            echo $echoStr;
            exit;
        }
    }
}