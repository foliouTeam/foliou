'use strict';

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css = ".swiper-slide {\n  position: relative;\n  width: 100%;\n  top: 0;\n  overflow: hidden; }\n\n.swiper-wrapper {\n  position: relative;\n  overflow: hidden; }\n\n.swiper-container {\n  position: relative; }\n\n.swiper-pagination {\n  position: absolute;\n  width: 100%;\n  bottom: 10px;\n  text-align: center; }\n\n.swiper-pagination span {\n  display: inline-block;\n  width: 12px;\n  height: 12px;\n  border-radius: 6px;\n  background: #000;\n  opacity: 0.5;\n  margin: 0 5px; }\n\n.swiper-pagination span.cur {\n  background: #4390EE;\n  opacity: 1; }\n";
styleInject(css);

var assets = {};
assets["main.scss"]=css;

module.exports = assets;
