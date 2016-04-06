// 陆欢 ariellushanghai@icloud.com 创建:2016/Mar/17
window.Helper = {
  '$window': $(window),
  '$html': $('html'),
  '$body': $('body'),
  'wW': $(window).width(),
  'wH': $(window).height(),
  'docH': $(document).height(),
  'flag_footer_top': $('#footer_flag').offset().top,
  'atPage': function (page_name) {
    return this.$body.prop('class').split(' ').indexOf('pagetype-' + page_name) !== (-1);
  },
  'isElementInViewport': function ($el) {
    $el = $el.get(0);
    var rect = $el.getBoundingClientRect();
    return (rect.top >= 0 && rect.left >= 0 && rect.bottom <= this.wH && rect.right <= this.wW);
  },
  'isElementInViewport_Vertical': function ($el) {
    el = $el.get(0);
    var rect = el.getBoundingClientRect();
    return (rect.top >= 0 && rect.bottom <= this.wH);
  },
  'Timer_Scroll_0': true,
  'Timer_Scroll_1': true,
  'scroll_with_delay': function (timer_id, spec, callback, delay) {
    var timer = this['Timer_Scroll_' + timer_id];
    this.$window.on('scroll.' + spec, function () {
      if (timer) {
        window.clearTimeout(timer);
      }
      timer = window.setTimeout(function () {
        callback();
      }, delay);
    });
  },
  //'Timer_Scroll': true,
  //'scroll_with_delay': function (spec, callback, delay) {
  //  this.$window.on('scroll.' + spec, function () {
  //    if (Helper.Timer_Scroll) {
  //      window.clearTimeout(Helper.Timer_Scroll);
  //    }
  //    Helper.Timer_Scroll = window.setTimeout(function () {
  //      callback();
  //    }, delay);
  //  });
  //},
  'getJson': function (api, payload) {
    var d = $.Deferred();
    $.getJSON(CONFIG.API_BASE_URL + api, payload, function (result) {
      if (result.code === 0) {
        d.resolve(result.data);
      } else {
        d.reject(result.code);
      }
    });
    return d.promise();
  },
  'getHtml': function (api, payload) {
    return $.ajax({
      url: CONFIG.API_BASE_URL + api,
      method: "GET",
      data: payload,
      dataType: "html"
    });
  },
  'getSearchHistory': function () {
    var inValid = /\s/;
    if (!(localStorage.getItem('the_cover'))) {
      return false;
    }
    var arr = localStorage.getItem('the_cover').split('|');
    var new_arr = [];
    $.each(arr, function (idx, ele) {
      if(!ele.match(inValid)) {
        new_arr.push(ele);
      }
    });
    return new_arr.length > 0 ? new_arr : false;
  },
  'setSearchHistory': function (entry) {
    if (this.getSearchHistory()) {
      var ori_arr = this.getSearchHistory();
      if ($.inArray(entry, ori_arr) !== -1) {
        //console.log(entry , 'in Array ',ori_arr);
        return false;
      }
      ori_arr.push(entry);
      localStorage.setItem('the_cover', ori_arr.join('|'));
    } else {
      localStorage.setItem('the_cover', '|' + entry);
    }
  }
};
window.Comp = {
  //初始化slick幻灯片
  'slider': {
    init: function ($container, config) {
      //console.log('幻灯片初始化');
      if ($container.data("initialized") === true) {
        return false;
      }
      var conf = config || {
        loop: true,
        paginationClickable: true,
        autoplay: 3000000,
        speed: 500,
        autoplayDisableOnInteraction: true,
        pagination: $container.find('.swiper-pagination'),
        paginationClickable: true,
        onInit: function (swiper) {
          $container.removeClass('hidden');
        }
      };
      var $slider = new Swiper ('#banner_slider_container', conf);
      $container.data("initialized", true);
      return this.bindEvents($slider);
    },
    bindEvents: function ($slider) {}
  },
  'dotdotdot': {
    init: function () {
      //console.log('点点点初始化');
      //$('.ellipsis').dotdotdot();
      $.each(['#banner_slider_container .each-slide-of-banner figcaption p.des',
        '.grid-item a.link-to-article .description-wrapper h2',
        '.express-news-scroll-area li section h3',
        '.guess-your-interests h3',
        '.express-news-scroll-area li>a .content'
      ], function (idx, ele) {
        if ($(ele)) {
          return $(ele).dotdotdot({});
        }
      });
    }
  },
  //页头
  'page_header': {
    init: function ($container) {
      //console.log('页头初始化');
      var current_page_type = location.pathname.split('/')[1];
      $container.find('.top-nav>li').each(function (inx, el) {
        if ($(el).data('pagetype') === current_page_type) {
          return $(el).addClass('current');
        }
      });
      this.bindEvents($container);
    },
    bindEvents: function ($container) {
      $container.on('click', '.search-icon', function (evt) {
        evt.preventDefault();
        $container.find('.search-form').toggleClass('active');
        $container.find('.search-field').focus();
        if($container.find('.search-form').hasClass('active')) {
          $container.find('.search-history li').addClass('hidden');
        }
        //Helper.$body.fadeOut();
      });
    }
  },
  //首页快讯
  'express_news': {
    'init': function ($container) {
      var self = this;
      var $express_news = $container.find('.express-news');
      self.setPosition($container, true).done(function () {
        $express_news.perfectScrollbar({
          wheelSpeed: 2,
          wheelPropagation: true,
          //swipePropagation: true,
          minScrollbarLength: 20,
          maxScrollbarLength: 150,
          suppressScrollX: true
        });
        $express_news.removeClass('hidden');
        return self.bindEvents($container);
      });
    },
    bindEvents: function ($container) {
      var self = this;
      var $express_news = $container.find('.express-news');
      //
      //var $flag = $('#footer_flag');
      //Helper.$window.on('scroll', function () {
      //  if(Helper.isElementInViewport($flag) && !Helper.$body.hasClass('loading-more-cards')) {
      //      $express_news.addClass('with-wrapper');
      //  } else {
      //    $express_news.removeClass('with-wrapper');
      //  }
      //});
      Helper.$window.on('resize', function () {
        self.setPosition($container, false);
        $express_news.perfectScrollbar('update');
      });
    },
    setPosition: function ($container, fixed) {
      var top = null;
      if (Helper.$window.width() > 960) {
        top = ($('.header-wrapper').height() + 12) + 'px';
      } else {
        top = '0px';
      }
      var $express_news = $container.find('.express-news');
      var right_pos = Helper.$window.width() - $container.offset().left - $container.width();
      var height = Helper.$window.height() - $('.header-wrapper').height() - ($('#footer').height() + 40) - 12 - 1;
      return $express_news.css({
        'top': top,
        'right': right_pos + 'px',
        'height': height + 'px',
        'overflow': 'hidden'
      }).promise();
    }
  },
  //卡片部分
  'packery': {
    init: function ($container, config) {
      //console.log('卡片初始化');
      if (config && config.col) {
        //console.log('每行' + config.col + '个卡片');
        var grid_width = ($container.width() - (config.col - 1) * 10) / config.col;
        $container.find('.grid-item').each(function (inx, el) {
          $(el).css('width', grid_width + 'px');
        });
      }
      $container.packery({
        initLayout: false,
        itemSelector: '.grid-item',
        gutter: 10,
        stamp: ".packery-stamp"
      });
      return this.bindEvents($container);
    },
    'bindEvents': function ($container) {
      $container.on('layoutComplete', function () {
        //console.log('layout is complete');
        $container.removeClass('hidden');
        //Helper.flag_footer_top = $('#footer_flag').offset().top;
      });
      $container.packery();
    }
  },
  //video player
  'video_player': {
    init: function ($container) {
      //console.log('视频播放器初始化');
      videojs.options.flash.swf = "./video-js.swf";
      var video = $container.find('video').get(0);
      return this.bindEvents(videojs(video, {
        inactivityTimeout: 300,
      }, function () {
        setTimeout(function () {
          $container.addClass('show');
        }, 300);
      }));
    },
    'bindEvents': function (player) {
      //console.log(player.userActive());
      //console.log(player.userActive);
      setTimeout(function () {
        player.userActive(true);
        //console.log(player.userActive());
      }, 1500);
      //player.on('mouseout', function(){
      //  controlBar.addClass('vjs-fade-out');
      //});
      //
      //player.on('mouseover', function(){
      //  controlBar.removeClass('vjs-fade-out');
      //});
    }
  },
  'search_func': {
    init: function ($container) {
      //console.log('搜索条初始化');
      var $entrys = $('<ul class="search-history"></ul>');
      if (Helper.$html.hasClass('no-localstorage')) {
        return false;
      }
      if ($container) {
        $container.find('#sc_inp').focus();
      }
      if (Helper.getSearchHistory()) {
        $.each(Helper.getSearchHistory(), function (idx, el) {
          if (el && el !== '' && el !== ' ') {
            $entrys.append('<li class="hidden"><a href="/search?q=' + el + '">' + el + "</a></li>");
          }
        });
        $('.search-form').append($entrys);
      } else {
        Helper.setSearchHistory('');
      }
      return this.bindEvents($entrys);
    },
    'bindEvents': function ($entrys) {
      var inValid = /\s/;
      $('.search-field').on('keyup', function (evt) {
        var char = $(this).val();
        var re = new RegExp('^' + char);
        if (char !== '' && char !== ' ') {
          $entrys.find('li').each(function (idx, el) {
            if ($(this).text().match(re)) {
              $(this).removeClass('hidden');
            } else {
              return $(this).addClass('hidden');
            }
          });
        }
      });
      $('.search-field').on('keydown', function (evt) {
        if (evt.keyCode === 13) {
          if ($(this).val().match(inValid)) {
            return evt.preventDefault();
          } else {
            return Helper.setSearchHistory($(this).val());
          }
        }
      });
    }
  },
  'scroll_and_load': {
    init: function ($container, config) {
      if (!$container.hasClass('scroll-and-load')) {
        return false;
      }
      //console.log('无穷滚动加载初始化');
      var $btn_load_more = $container.find('#btn_load_more').data('counts', {
        'scrolled_time': 0,
        'can_scroll_time': config.can_scroll_time
      });
      return this.bindEvents($btn_load_more, config);
    },
    'bindEvents': function ($btn_load_more, config) {
      var self = this;
      //页面滚动加载
      Helper.scroll_with_delay(0, 'load_more', function () {
        if (Helper.$body.hasClass('loading-more-cards')) {
          return false;
        }
        if (Helper.isElementInViewport_Vertical($btn_load_more)) {
          //console.error('Helper.isElementInViewport_Vertical($btn_load_more)');
          if ($btn_load_more.data('counts').scrolled_time++ === $btn_load_more.data('counts').can_scroll_time) {
            $btn_load_more.removeClass('hidden');
            $('#footer').removeClass('hidden');
            $('#footer_flag').removeClass('hidden');
            return Helper.$window.off('scroll.load_more');
          }
          Helper.$body.addClass('loading-more-cards');
          //$express_news.removeClass('with-wrapper');
          self.fetchMoreCard(config).done(function (data, textStatus, jqXHR) {
            //console.log('加载成功!');
            Helper.$body.removeClass('loading-more-cards');
            self.reRender(data, $('.packery-container'));
            return Helper.docH = $(document).height();
          }).fail(function (jqXHR, textStatus, errorThrown) {
            console.info(jqXHR, textStatus, errorThrown);
          }).always(function () {
            //Helper.flag_footer_top = $('#footer_flag').offset().top;
          });
        }
      }, 100);
      //点击按钮加载
      $btn_load_more.on('click', function (evt) {
        var $btn = $(this);
        if ($btn.hasClass('frozen') || $btn.hasClass('hidden')) {
          return evt.preventDefault();
        }
        $btn.text('加载中 ...').addClass('frozen');
        Helper.$body.addClass('loading-more-cards');
        //$express_news.removeClass('with-wrapper');
        self.fetchMoreCard(config).done(function (data, textStatus, jqXHR) {
          //console.log('加载成功!');
          Helper.$body.removeClass('loading-more-cards');
          $btn.text('加载更多').removeClass('frozen');
          return self.reRender(data, $('.packery-container'));
        }).fail(function (jqXHR, textStatus, errorThrown) {
          console.info(jqXHR, textStatus);
        }).always(function () {});
      });
    },
    'fetchMoreCard': function (config) {
      var payload = $('.packery-container').data('params');
      //console.log('fetchMoreCard() payload: ', payload);
      return Helper.getHtml(config.API, payload);
    },
    'reRender': function (data, $container) {
      //console.log('scroll_and_load.reRender()');
      var $html = $(data);
      $container.append($html).packery('appended', $html); //插件很挑剔,需要jQuery把HTML转换一下
      var $data_div = $container.find('#card_params');
      var new_data = $data_div.data('params');
      $container.data('params', new_data);
      $data_div.removeAttr('id');
    }
  },
  //页面悬浮物体
  'float_widgets': {
    init: function ($container, config) {
      //console.log('页面悬浮物体初始化');
      var $btn_back_to_top_container = $('#btn_back_to_top_container').css({
        'left': ($container.find('.content-wrapper').offset().left + $container.find('.content-wrapper').width()) + 'px',
        'bottom': ($('#footer').height() + 55 * 2) + 'px'
      });
      var $share_icons = $('#share_icons').css({
        'left': ($container.find('.content-wrapper').offset().left - $('#share_icons').width()) + 'px'
      }).promise().done(function () {
        ////console.log($(this));
        $(this).removeClass('hidden');
      });
      return this.bindEvents($btn_back_to_top_container, config);
    },
    'bindEvents': function ($btn_back_to_top_container, config) {
      Helper.$window.on('scroll', function () {
        $(this).scrollTop() > Helper.wH ? $btn_back_to_top_container.addClass('show') : $btn_back_to_top_container.removeClass('show');
      });
      $btn_back_to_top_container.find('#btn_back_to_top').on('click', function () {
        return $('html, body').animate({
          scrollTop: '0px'
        });
      });
      $btn_back_to_top_container.find('.with-hover').hover(function () {
        $btn_back_to_top_container.find('.qr-container').toggleClass('show');
      });
      $('#share_icons').find('#share_to_wechat').hover(function () {
        $(this).siblings('.panel-weixin').toggleClass('show');
      });

    }
  },
  //覆盖层
  'fullscreen_cover_layer': {
    init: function ($body) {
      //console.log('覆盖层初始化');
      this.bindEvents($body);
    },
    'bindEvents': function ($container) {
      var $btn_comment = $container.find('.btn-comment');
      var $cover_layer = $container.find('#cover_layer');
      $container.on('click', '.btn-comment, #cover_layer', function (evt) {
        evt.preventDefault();
        $cover_layer.toggleClass('show');
      });
    }
  },
  //更多页的tab切换机制
  'tabs': {
    init: function ($container) {
      this.showSection(location.hash, $container);
      return this.bindEvents($container);
    },
    'bindEvents': function($container) {
      var self = this;
      Helper.$window.on('hashchange', function() {
        self.showSection(location.hash, $container);
      });
      $container.find('.nav-li').on('click', function (evt) {
        evt.preventDefault();
        self.showSection($(this).data('section'), $container);
      });
    },
    'showSection': function(id, $container) {
      location.hash = id;
      $(id).siblings('.section').addClass('hidden');
      $(id).removeClass('hidden');
      Helper.$window.scrollTop(0)
      $container.find('.nav-li').each(function (idx, el) {
        if($(el).data('section') === id) {
          return $(el).addClass('active');
        } else {
          return $(el).removeClass('active');
        }
      });
    }
  }
};