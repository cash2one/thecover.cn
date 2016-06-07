// 陆欢 ariellushanghai@icloud.com 创建:2016/Mar/17
Helper.$window.on("beforeunload", function () {
  Helper.$window.scrollTop(0)
});
$(document).ready(function () {
  Helper.bindEvents(),
      Comp.page_header.init($(".header-wrapper")),
      Comp.dotdotdot.init(),
      Comp.float_widgets.init(Helper.$body),
      Comp.search_func.init(),
  Helper.atPage("index") && (Comp.scroll_and_load.init($("body"), {
    API: CONFIG.API.INDEX,
    can_scroll_time: 3
  }),
      $.when(Comp.express_news.init($(".responsive-wrapper")), Comp.packery.init($(".packery-container"))).done(function () {
        Comp.slider.init($("#banner_slider_container"))
      })),
  Helper.atPage("video-detail") && Comp.video_player.init($("#video-player-wrapper")),
  Helper.atPage("detail") && Comp.fullscreen_cover_layer.init($("body")),
  Helper.atPage("search-results") && (Comp.packery.init($(".packery-container")),
      Comp.scroll_and_load.init($("body"), {
        API: CONFIG.API.SEARCH,
        can_scroll_time: 3
      })),
  Helper.atPage("channel") && (Comp.packery.init($(".packery-container"), {
    col: 4
  }),
      Comp.scroll_and_load.init($("body"), {
        API: CONFIG.API.CHANNEL,
        can_scroll_time: 3
      })),
  Helper.atPage("more") && Comp.tabs.init($(".index-wrapper")),
  (Helper.atPage("404") || Helper.atPage("maintenance")) && Comp.fixedHeight.init()
});