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
    var el = $el.get(0);
    var rect = el.getBoundingClientRect();
    return (rect.top >= 0 && rect.left >= 0 && rect.bottom <= this.wH && rect.right <= this.wW);
  },
  'isElementInViewport_Vertical': function (el) {
    var rect = el.getBoundingClientRect();
    return (rect.top >= 0 && rect.bottom <= this.wH);
  },
  'update_dimensions': function () {
    return {
      'wW': this.wW = this.$window.width(),
      'wH': this.wH = this.$window.height(),
      'docH': this.docH = $(document).height(),
      'flag_footer_top': this.flag_footer_top = $('#footer_flag').offset().top
    }
  },
  'promise_img': function ($container) {
    var d = $.Deferred();
    var src = $container.data('src');
    var $tempImg = $('<img>');
    $tempImg.attr('src', src);
    $tempImg.on('load', function () {
      d.resolve($container);
    });
    $tempImg.on('error', function () {
      d.reject($container);
    });
    return d.promise();
  },
  'load_img': function(img) {
    $(img).removeClass('hidden');
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
      if (!ele.match(inValid)) {
        new_arr.push(ele);
      }
    });
    return new_arr.length > 0 ? new_arr : false;
  },
  'setSearchHistory': function (entry) {
    if (this.getSearchHistory()) {
      var ori_arr = this.getSearchHistory();
      if ($.inArray(entry, ori_arr) !== -1) {
        //console.log(entry, 'in Array ', ori_arr);
        return false;
      }
      ori_arr.push(entry);
      localStorage.setItem('the_cover', ori_arr.join('|'));
    } else {
      localStorage.setItem('the_cover', '|' + entry);
    }
  },
  'bindEvents': function () {
    var self = this;
    self.$window.on('resize', function () {
      self.update_dimensions();
    });
  }
};
window.Comp = {
  //初始化k幻灯片
  'slider': {
    init: function ($container, config) {
      //console.log('幻灯片初始化');
      var d = $.Deferred();
      if($container.length === 0) {
        d.resolve(Helper.$body.removeClass('hidden'));
        return d.promise();
      }
      if ($container.data("initialized") === true) {
        return d.resolve();
      }
      var $slides = $container.find('.each-slide-of-banner-a-container');
      var conf = config || {
            loop: true,
            autoplay: 4000,
            speed: 500,
            autoplayDisableOnInteraction: true,
            effect: 'fade',
            pagination: $container.find('.swiper-pagination'),
            paginationClickable: true,
            onInit: function () {
              Helper.$body.removeClass('hidden');
              return d.promise();
            }
          };
      $.when(Helper.promise_img($slides.eq(0))).done(function () {
        $slides.each(function () {
          $(this).css({
            'background-image': 'url(' + $(this).data('src') + ')'
          });
        });
        new Swiper('#banner_slider_container', conf);
        $container.data("initialized", true);
      });
    }
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
      var $form = $container.find('.search-form');
      $container.on('click', '.search-icon', function (evt) {
        //console.log('clicked', $(this));
        evt.preventDefault();
        var $icon = $(this);
        $form.css({
          'left': 180 + $('.top-nav').width() + 'px',
          'margin-left': (20 - 100) + 'px'
        }).promise().then(function () {
          $form.toggleClass('active');
          $icon.toggleClass('focus');
          $form.find('.search-field').focus();
          if ($form.hasClass('active')) {
            $form.find('.search-history li').addClass('hidden');
          }
        });
      });
    }
  },
  //首页快讯
  'express_news': {
    'init': function ($container) {
      var self = this;
      var $express_news = $container.find('#express_news');
      return self.setPosition($container, $express_news).done(function () {
        $express_news.perfectScrollbar({
          wheelSpeed: 2,
          wheelPropagation: true,
          //swipePropagation: true,
          minScrollbarLength: 20,
          maxScrollbarLength: 150,
          suppressScrollX: true
        });
        $express_news.removeClass('hidden');
        return self.bindEvents($container, $express_news);
      });
    },
    bindEvents: function ($container, $express_news) {
      var d = $.Deferred();
      var self = this;
      Helper.$window.on('scroll', function () {
        self.changeStyle($express_news);
      });
      Helper.$window.on('resize', function () {
        self.setPosition($container, $express_news).then(function () {
          $express_news.perfectScrollbar('update');
        });
      });
      return d.promise();
    },
    changeStyle: function ($express_news) {
      var flag = $('#footer_flag').get(0);
      var $footer = $('#footer');
      if (Helper.isElementInViewport_Vertical(flag) && !$footer.hasClass('hidden')) {
        $express_news.addClass('go-with-parent');
      } else {
        $express_news.removeClass('go-with-parent');
      }
    },
    setPosition: function ($container, $express_news) {
      var right_pos = Helper.wW - $container.offset().left - $container.width();
      var height = Helper.wH - $('.header-wrapper').height() - 15 * 2 - 1;
      return $express_news.css({
        'top': '85px',
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
        //var grid_width = ($container.width() - (config.col - 1) * 10) / config.col;
        //$container.find('.grid-item').each(function (inx, el) {
        //  $(el).css('width', grid_width + 'px');
        //});
      }
      $container.packery({
        initLayout: false,
        itemSelector: '.grid-item',
        gutter: 10,
        stamp: ".packery-stamp",
        transitionDuration: '0.2s'
      });
      return this.bindEvents($container);
    },
    'bindEvents': function ($container) {
      var d = $.Deferred();
      var $express_news = $('#express_news');
      $container.on('layoutComplete', function () {
        $container.removeClass('hidden');
        $express_news.removeClass('with-parent');
        return d.resolve();
      });
      return $container.packery() && d.promise();
    }
  },
  //video player
  'video_player': {
    init: function ($container) {
      //console.log('视频播放器初始化');
      videojs.options.flash.swf = "./video-js.swf";
      var video = $container.find('video').get(0);
      return this.bindEvents(videojs(video, {
        inactivityTimeout: 600
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
            $entrys.append('<li class="hidden"><a href="http://170.240.110.243/fmWeb-web/search?q=' + el + '&pageindex=1' + '">' + el + "</a></li>");
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
      $('.search-field').on('keyup', function () {
        var char = $(this).val();
        var re = new RegExp('^' + char);
        if (char !== '' && char !== ' ') {
          $entrys.find('li').each(function () {
            if ($(this).text().match(re)) {
              $(this).removeClass('hidden');
            } else {
              return $(this).addClass('hidden');
            }
          });
        }
      }).on('keydown', function (evt) {
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
      var d = $.Deferred();
      if (!$container.hasClass('scroll-and-load')) {
        return d.reject();
      }
      //console.log('无穷滚动加载初始化');
      var $btn_load_more = $container.find('#btn_load_more').data('counts', {
        'scrolled_time': 0,
        'can_scroll_time': config.can_scroll_time
      });
      if($btn_load_more) {
        d.resolve();
      }
      return this.bindEvents($btn_load_more, config) && d.promise();
    },
    'bindEvents': function ($btn_load_more, config) {
      var self = this;
      var $express_news = $('#express_news');
      var btn_load_more = $btn_load_more.get(0);
      //页面滚动加载
      Helper.scroll_with_delay(0, 'load_more', function () {
        if (Helper.$body.hasClass('loading-more-cards')) {
          return false;
        }
        if (Helper.isElementInViewport_Vertical(btn_load_more)) {
          // console.error('Helper.isElementInViewport_Vertical(btn_load_more)');
          if ($btn_load_more.data('counts').scrolled_time++ === $btn_load_more.data('counts').can_scroll_time) {
            $btn_load_more.removeClass('hidden');
            $('#footer').removeClass('hidden');
            Comp.express_news.changeStyle($express_news);
            return Helper.$window.off('scroll.load_more');
          }
          Helper.$body.addClass('loading-more-cards');
          self.fetchMoreCard(config, $express_news).done(function (data, textStatus, jqXHR) {
            //console.log('加载成功!');
            Helper.$body.removeClass('loading-more-cards');
            self.reRender(data, $('.packery-container'), $btn_load_more);
            return Helper.docH = $(document).height();
          }).fail(function (jqXHR, textStatus, errorThrown) {
            //console.log(jqXHR, textStatus, errorThrown);
          });
        }
      }, 100);
      //点击按钮加载
      $btn_load_more.on('click', function (evt) {
        var $btn = $(this);
        if ($btn.hasClass('frozen') || $btn.hasClass('hidden')) {
          return evt.preventDefault();
        }
        $btn.html('<span>加载中 </span><em class="blink-0 blink">。</em><em class="blink-1 blink">。</em><em class="blink-2 blink">。</em>').addClass('frozen');
        Helper.$body.addClass('loading-more-cards');
        self.fetchMoreCard(config, $express_news).done(function (data, textStatus, jqXHR) {
          //console.log('加载成功!');
          Helper.$body.removeClass('loading-more-cards');
          $btn.html('<span>加载更多</span>').removeClass('frozen');
          return self.reRender(data, $('.packery-container'), $btn);
        }).fail(function (jqXHR, textStatus, errorThrown) {
          //console.log('XHR对象: ', jqXHR.toString(), 'textStatus: ', textStatus);
        });
      });
    },
    'fetchMoreCard': function (config, $express_news) {
      var payload = $('.packery-container').data('params');
      //console.log('fetchMoreCard() payload: ', payload);
      $express_news.removeClass('go-with-parent');
      return Helper.getHtml(config.API, payload);
    },
    'reRender': function (data, $container, $btn) {
      //console.log('scroll_and_load.reRender()');
      var $html = $(data);
      $container.append($html).packery('appended', $html); //插件很挑剔,需要jQuery把HTML转换一下
      var $data_div = $container.find('#card_params');
      $container.data('params', $data_div.data('params'));
      $data_div.removeAttr('id');
      if($container.data('params').lastid == '-1') {
        //console.log('last ID: ', -1);
        $('#footer').removeClass('hidden');
        //Comp.express_news.changeStyle($express_news);
        Helper.$window.off('scroll.load_more');
        return $btn.html('<span>没有更多了~ </span>').removeClass('hidden').addClass('frozen').off('click');
      }
    }
  },
  //页面悬浮物体
  'float_widgets': {
    init: function ($container) {
      //console.log('页面悬浮物体初始化');
      var $btn = $container.find('#btn_back_to_top_container').css({
        'bottom': ($('#footer').height() + 55 * 2) + 'px'
      });
      var $wrapper = $('.content-wrapper');
      this.setPosition(Helper.wW, $btn, $wrapper);
      var $share_icons = $('#share_icons').css({
        'left': ($container.find('.content-wrapper').offset().left - $('#share_icons').width()) + 'px'
      }).promise().done(function () {
        $(this).removeClass('hidden');
      });
      return this.bindEvents($btn);
    },
    'bindEvents': function ($btn) {
      var self = this;
      var $wrapper = $('.content-wrapper');
      Helper.$window.on('scroll', function () {
        $(this).scrollTop() > Helper.wH ? $btn.addClass('show') : $btn.removeClass('show');
      });
      Helper.$window.on('resize', function () {
        self.setPosition(Helper.wW, $btn, $wrapper);
      });
      $btn.find('#btn_back_to_top').on('click', function () {
        return $('html, body').animate({
          scrollTop: '0px'
        });
      });
      $btn.find('.with-hover').hover(function () {
        $btn.find('.qr-container').toggleClass('show');
      });
      $('.share-icons').find('.share-to-wechat').each(function () {
        $(this).hover(function () {
          $(this).siblings('.panel-weixin').toggleClass('show');
        });
      });
    },
    'setPosition': function (w, $btn, $wrapper) {
      if (w > 1350) {
        $btn.css({
          'left': ($wrapper.offset().left + $wrapper.width()) + 'px',
          'right': 'unset'
        });
      } else if (w > 1200) {
        $btn.css({
          'left': 'unset',
          'right': '0px'
        });
      } else if (w > 1065) {
        $btn.css({
          'left': ($wrapper.offset().left + $wrapper.width()) + 'px',
          'right': 'unset'
        })
      } else {
        $btn.css({
          'left': 'unset',
          'right': '0px'
        });
      }
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
    'bindEvents': function ($container) {
      var self = this;
      Helper.$window.on('hashchange', function () {
        self.showSection(location.hash, $container);
      });
      $container.find('.nav-li').on('click', function (evt) {
        evt.preventDefault();
        self.showSection($(this).data('section'), $container);
      });
    },
    'showSection': function (id, $container) {
      location.hash = id;
      $(id).siblings('.section').addClass('hidden');
      $(id).removeClass('hidden');
      Helper.$window.scrollTop(0);
      $container.find('.nav-li').each(function (idx, el) {
        if ($(el).data('section') === id) {
          return $(el).addClass('active');
        } else {
          return $(el).removeClass('active');
        }
      });
    }
  },
  // fixedHeight
  'fixedHeight': {
    init: function () {
      // console.log('fixedHeight init()')
      Helper.$body.height(Helper.wH - 82);
    }
  }
};