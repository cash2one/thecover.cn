// 陆欢 ariellushanghai@icloud.com 创建:2016/Mar/17

Helper.$window.on('beforeunload', function () {
  Helper.$window.scrollTop(0);
});
$(document).ready(function () {
  Helper.bindEvents();
  Comp.page_header.init($('.header-wrapper'));
  Comp.dotdotdot.init();
  Comp.float_widgets.init(Helper.$body);
  Comp.search_func.init();

  //首页
  if (Helper.atPage('index')) {
    console.log('@首页');
    //Comp.slider.init($('#banner_slider_container'));
    //Comp.express_news.init($('.responsive-wrapper'));
    //Comp.packery.init($('.packery-container'));
    Comp.scroll_and_load.init($('body'), {
      'API': CONFIG.API.INDEX,
      'can_scroll_time': 3
    });
    $.when(Comp.express_news.init($('.responsive-wrapper')), Comp.packery.init($('.packery-container'))).done(function () {
      console.log('main.js: L24 done');
      Comp.slider.init($('#banner_slider_container'))
    });
  }
  //视频详情页
  if (Helper.atPage('video-detail')) {
    console.log('@视频详情页');
    Comp.video_player.init($('#video-player-wrapper'));
  }
  //详情页
  if (Helper.atPage('detail')) {
    console.log('@详情页');
    Comp.fullscreen_cover_layer.init($('body'));
  }
  //搜索结果页
  if (Helper.atPage('search-results')) {
    console.log('@搜索结果页');
    Comp.packery.init($('.packery-container'));
    Comp.scroll_and_load.init($('body'), {
      'API': CONFIG.API.SEARCH,
      'can_scroll_time': 3
    });
  }
  //频道页
  if (Helper.atPage('channel')) {
    console.log('@频道页');
    Comp.packery.init($('.packery-container'), {
      'col': 4
    });
    Comp.scroll_and_load.init($('body'), {
      'API': CONFIG.API.INDEX,
      'can_scroll_time': 3
    });
  }
  //更多
  if (Helper.atPage('more')) {
    console.log('@更多页');
    Comp.tabs.init($('.index-wrapper'));
  }
});