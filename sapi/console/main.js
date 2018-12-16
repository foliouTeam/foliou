;(function () {
    var src = '//cdnsapi.ztgame.com/site/js/console/eruda.min.js';
    if (!/console=true/.test(window.location) && localStorage.getItem('active-console') != 'true') return;
    document.write('<scr' + 'ipt src="' + src + '"></scr' + 'ipt>');
    document.write('<scr' + 'ipt>eruda.init();</scr' + 'ipt>');
})();
