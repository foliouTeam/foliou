requirejs(['weixin/set'],function(setShare){
    var shareConfig = {
        appid: 'wxf1eab88438c29e1f',
        title: '2018《球球大作战》城市挑战赛报名开启',
        desc: '不服就去战斗，球球城市挑战赛即刻开启',
        imgUrl: 'images/share.jpg',
        success: function() {
            
        }
    }
    setShare(shareConfig);
});