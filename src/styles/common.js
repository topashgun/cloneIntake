/*
 ** SilverSpot Cinema - F&B Mocrosite > common.js **
 */
var scrlFlag = 0;
jQuery(function () {
  /*jQuery(".itemCounter").each(function () {

        var curParent = jQuery(this);
        curParent.find("a.icControl").on("click", function () {
            var fcEle = curParent.find('.form-control')
            var fcVal = parseInt(fcEle.val());
            ////////console.log("Textbox Val: " + fcVal);
            if (jQuery(this).hasClass('iccDecrement')) {
                fcVal = (fcVal > 0) ? fcVal - 1 : 0;
                //fcEle.val(fcVal);
            } else {
                fcVal = (fcVal < 10) ? fcVal + 1 : 10;
                //fcEle.val(fcVal);
            }
            fcEle.val(fcVal);
            if (fcVal == 0) {
                curParent.find("a.icControl").removeClass('disabled');
                curParent.find("a.icControl.iccDecrement").addClass('disabled');
            } else if (fcVal == 10) {
                curParent.find("a.icControl").removeClass('disabled');
                curParent.find("a.icControl.iccIncrement").addClass('disabled');
            } else {
                curParent.find("a.icControl").removeClass('disabled');
            }
        });

    }); Hided22062020*/

  //tse scroll emulator - Initialization
  if (jQuery(".tsescroll-wrapper").length > 0) {
    jQuery(".tsescroll-wrapper").TrackpadScrollEmulator({
      autoHide: false,
    });
  }

  //mcustomscrollbar - Initialization
  if (jQuery(".pcpFnbblock .pcpfnbCategory .pcpfnbcInner .mcsbWrapper").length > 0) {
    jQuery(".pcpFnbblock .pcpfnbCategory .pcpfnbcInner .mcsbWrapper").mCustomScrollbar({
      axis: "x",
      autoExpandScrollbar: false,
      advanced: {
        autoExpandHorizontalScroll: true,
      },
      scrollButtons: {enable: true},
      scrollbarPosition: "outside",
      //theme:"inset"
      callbacks: {
        onInit: function () {
          jQuery(this).find(".mCSB_buttonLeft").addClass("disabled");
        },
        onScroll: function () {
          jQuery(this).find(".mCSB_buttonLeft").removeClass("disabled");
          jQuery(this).find(".mCSB_buttonRight").removeClass("disabled");
        },
        onTotalScroll: function () {
          jQuery(this).find(".mCSB_buttonRight").addClass("disabled");
        },
        onTotalScrollBack: function () {
          jQuery(this).find(".mCSB_buttonLeft").addClass("disabled");
        },
        whileScrolling: function () {
          jQuery(this).find(".mCSB_buttonLeft").removeClass("disabled");
          jQuery(this).find(".mCSB_buttonRight").removeClass("disabled");
        },
      },
    });
  }
  /*if (jQuery('.pcpCart .roundBoxshadowed').length > 0) {
        jQuery(".pcpCart .roundBoxshadowed").mCustomScrollbar({
            autoHideScrollbar: false,
            theme: "dark"
        });
    } Hided23062020*/

  /* Location Dropdown - Toggle */
  jQuery(".pcpLocation .pcplDropdown:not(.pcplddReadonly) .pcplddHead").on("click", function () {
    jQuery("body").toggleClass("pcplDropdown-open");
    jQuery(this).parent(".pcplDropdown").toggleClass("open");
    jQuery(this).parent(".pcplDropdown").find(".pcplddBody").slideToggle();
  });
  //Location dropdown close - On clicking the menu item & Detect my location.
  jQuery(".pcpLocation .pcplDropdown .pcplddBody .btnswrap .btn.btndefault, .pcpLocation .pcplDropdown .pcplddBody .pclList ul li a").on("click", function () {
    if (jQuery("body").hasClass("pcplDropdown-open") && jQuery(this).parents(".pcplDropdown").hasClass("open")) {
      jQuery("body").toggleClass("pcplDropdown-open");
      jQuery(this).parents(".pcplDropdown").toggleClass("open");
      jQuery(this).parents(".pcplDropdown").find(".pcplddBody").slideUp();
    }
  });
  //Location dropdown close > when click outside
  jQuery(document).on("click", function (event) {
    if (jQuery("body").hasClass("pcplDropdown-open") && $(".pcpLocation .pcplDropdown").hasClass("open")) {
      var $trigger = $(".pcpLocation .pcplDropdown");
      if ($trigger !== event.target && !$trigger.has(event.target).length) {
        jQuery("body").removeClass("pcplDropdown-open");
        jQuery(".pcpLocation .pcplDropdown").removeClass("open");
        jQuery(".pcpLocation .pcplDropdown .pcplddBody").slideUp();
      }
    }
  });
  /* Location Dropdown Toggle(Tab & Mobile) */
  jQuery(".pcpLocation .pcplDropdown .pcplddBody .roundBoxshadowed .pcpcClose a").on("click", function () {
    if (jQuery("body").hasClass("pcplDropdown-open") && jQuery(this).parents(".pcplDropdown").hasClass("open")) {
      jQuery("body").removeClass("pcplDropdown-open");
      jQuery(this).parents(".pcplDropdown").toggleClass("open");
      jQuery(this).parents(".pcplDropdown").find(".pcplddBody").slideUp();
    }
  });

  /* F&B List > Tab - active state update, scrolltop of its respective content block & Toggle its respective menu */
  jQuery("body").on("click", ".pcpFnbblock .pcpfnbCategory ul li a", function (e) {
    e.preventDefault();

    var curLi = jQuery(this).parent("li");
    //curLi.find("a").on("click", function() {
    var curAn = jQuery(this);
    var dtAttr = curAn.attr("data-target");
    //if (!curLi.hasClass('active') && typeof dtAttr !== typeof undefined && dtAttr !== false && dtAttr != '') { //Hided14072020
    if (typeof dtAttr !== typeof undefined && dtAttr !== false && dtAttr != "") {
      if (!curLi.hasClass("active")) {
        /* Active State Update. */
        /////jQuery(".pcpFnbblock .pcpfnbCategory ul li").removeClass('active');
        // setTimeout(function() {
        curLi.addClass("active");
        var curLileft = curLi.position().left;
        jQuery(".pcpFnbblock .pcpfnbCategory .pcpfnbcInner .mcsbWrapper").mCustomScrollbar("scrollTo", curLileft);
        /////jQuery(".pcpFnbblock .pcpfnbCategorylist > ul > li").removeClass('active');

        /* Scrolltop & Toggle */
        /////jQuery(".pcpFnbblock .pcpfnbCategorylist > ul > li > .pcpfnbiBox .pcpfnbibBody").slideUp(500);
        setTimeout(function () {
          jQuery(".pcpFnbblock .pcpfnbCategorylist > ul > li" + dtAttr + "").addClass("active");
          jQuery(".pcpFnbblock .pcpfnbCategorylist > ul > li" + dtAttr + " > .pcpfnbiBox .pcpfnbibBody").slideDown(500);
          /////}, 1500);
        }, 750);
      }

      /////setTimeout(function () {

      var headerHeight = jQuery(".pageHeader").outerHeight(true);
      var catTabheight = jQuery(".pcpFnbblock .pcpfnbCategory").outerHeight(true);
      var targetPadtop = parseInt(jQuery(".pcpFnbblock .pcpfnbCategorylist > ul > li" + dtAttr + "").css("padding-top"));
      //targetPadtop = 0;
      var targetPostop = jQuery(".pcpFnbblock .pcpfnbCategorylist > ul > li" + dtAttr + "").offset().top;
      var gutterSpace = jQuery(window).width() > 992 ? targetPadtop - 20 : 0;
      targetPostop = targetPostop + gutterSpace;
      var caltrgScltop = parseInt(targetPostop - (headerHeight + catTabheight));

      jQuery("html, body").stop().animate(
        {
          scrollTop: caltrgScltop,
        },
        750
      );

      /////}, 500);
    }
    //});
  });

  jQuery("body").on("click", ".pcpFnbblock .pcpfnbCategorylist > ul > li > .pcpfnbiBox .pcpfnbibHead", function () {
    var curLi = jQuery(this).parents("li");
    var curAn = jQuery(this);
    var dtAttr = curLi.attr("id");
    var caltrgScltop = "";
    var wnwScrlt = jQuery(window).scrollTop();
    /////if (!curLi.hasClass('active')) {

    /* Active State Update. */
    /////jQuery(".pcpFnbblock .pcpfnbCategory ul li").removeClass('active');
    /////jQuery("a[data-target='#" + dtAttr + "']").parent("li").addClass('active');
    jQuery("a[data-target='#" + dtAttr + "']")
      .parent("li")
      .toggleClass("active");
    var curLileft = jQuery("a[data-target='#" + dtAttr + "']")
      .parent("li")
      .position().left;
    //jQuery("a[data-target='#" + dtAttr + "']").parent("li").trigger('mouseleave');
    jQuery(".pcpFnbblock .pcpfnbCategory .pcpfnbcInner .mcsbWrapper").mCustomScrollbar("scrollTo", curLileft);
    /////jQuery(".pcpFnbblock .pcpfnbCategorylist > ul > li").removeClass('active');

    /* Scrolltop & Toggle */
    /////jQuery(".pcpFnbblock .pcpfnbCategorylist > ul > li > .pcpfnbiBox .pcpfnbibBody").slideUp(500);
    setTimeout(function () {
      var headerHeight = jQuery(".pageHeader").outerHeight(true);
      //////////console.log("Header Height: "+headerHeight);
      var catTabheight = jQuery(".pcpFnbblock .pcpfnbCategory").outerHeight(true);
      //////////console.log("Category List(Tab) Height: "+catTabheight);
      var targetPadtop = parseInt(curLi.css("padding-top"));
      //targetPadtop = 0;
      //////////console.log("Target Padding Top: "+targetPadtop);
      var targetPostop = curLi.offset().top;
      var gutterSpace = jQuery(window).width() > 992 ? targetPadtop - 20 : 0;
      targetPostop = targetPostop + gutterSpace;
      //////////console.log("Target Top: "+targetPostop);
      caltrgScltop = parseInt(targetPostop - (headerHeight + catTabheight));
      //////////console.log("Calculated Scroll Top: "+caltrgScltop);

      jQuery("html, body").stop().animate(
        {
          scrollTop: caltrgScltop,
        },
        750
      );

      if (caltrgScltop != "" && wnwScrlt == caltrgScltop) {
        ////////console.log("wnwScrlt0:" + wnwScrlt);
        ////////console.log("caltrgScltop0:" + caltrgScltop);
        curLi.toggleClass("active");
        curLi.find("> .pcpfnbiBox .pcpfnbibBody").slideToggle(500);
      }
    }, 500);
    setTimeout(function () {
      if (caltrgScltop == "" || wnwScrlt != caltrgScltop) {
        ////////console.log("wnwScrlt1:" + wnwScrlt);
        ////////console.log("caltrgScltop1:" + caltrgScltop);
        /////curLi.addClass('active');
        /////curLi.find("> .pcpfnbiBox .pcpfnbibBody").slideDown(500);
        curLi.toggleClass("active");
        curLi.find("> .pcpfnbiBox .pcpfnbibBody").slideToggle(500);
      }
    }, 1250);

    /////}
  });

  /* Column Right Toggle */
  jQuery(".pcpbBottomstrap .pcpbbsInner .pcpbsTrigger h2").on("click", function () {
    jQuery("body").toggleClass("pcpbiColright-open");
    jQuery(".pcPanel .pcpBody .pcpbInner .pcpbiColswrap .pcpbiCols.pcpbiColright").slideToggle();
  });
  jQuery(".pcPanel .pcpBody .pcpbInner .pcpbiColswrap .pcpbiCols.pcpbiColright .pcpbicrInner .roundBoxshadowed .pcpcClose").on("click", function () {
    if (jQuery("body").hasClass("pcpbiColright-open")) {
      jQuery("body").toggleClass("pcpbiColright-open");
      jQuery(this).parents(".pcpbiColright").slideToggle();
    }
  });

  //Payment accordian > scroll top position
  $(".payacc-block .panel-group .panel").each(function () {
    var currentAcc = jQuery(this).find(".panel-heading");
    currentAcc.find("a").on("click", function () {
      setTimeout(function () {
        jQuery("html,body").animate(
          {
            scrollTop: currentAcc.offset().top - jQuery("header").outerHeight() - 4,
          },
          800
        );
      }, 500);
    });
  });

  //Payment input > scroll top position
  if (jQuery(window).width() < 768) {
    $(".paymentMethod-cont .pageForm .form-group").each(function () {
      var currentInput = jQuery(this).find("input");
      currentInput.on("click", function () {
        setTimeout(function () {
          jQuery("html,body").animate(
            {
              scrollTop: currentInput.offset().top - jQuery("header").outerHeight() - 4,
            },
            800
          );
        }, 500);
      });
    });
  }

  //Repeat popup > show
  $(".fnbmodifierModal .fnbmmAction .btnswrap .btn.btndefault[data-toggle=modal]").on("click", function (e) {
    $(".fnbmodifierModal .modal").modal("hide");
    var $target = $($(this).data("target"));
    $target.data("triggered", true);
    setTimeout(function () {
      if ($target.data("triggered")) {
        $target.modal("show").data("triggered", false);
      }
    }, 500);
    return false;
  });

  //Add to cart popup > accordian
  $(".fnbmodifierModal .fnbmmRowwrap .fnbmmrwRows ul li.open .subItems ul.view").css("display", "block");
  //$('.fnbmodifierModal .fnbmmRowwrap .fnbmmrwRows ul li .subItems h4').click(function(e) {  //Hided18062020
  $("body").on("click", ".fnbmodifierModal .fnbmmRowwrap .fnbmmrwRows ul li .subItems h4", function (e) {
    //let $this = $(this);
    var $this = $(this);
    if ($this.next("ul").hasClass("view")) {
      $this.parents("li").removeClass("open");
      $this.next("ul").removeClass("view");
      $this.next("ul").slideUp(400);
    } else {
      $this.parents().parents().find("li").removeClass("open");
      $this.parents().parents().find("li .subItems ul").removeClass("view");
      $this.parents().parents().find("li .subItems ul").slideUp(400);
      $this.parents("li").toggleClass("open");
      $this.next("ul").toggleClass("view");
      $this.next("ul").slideToggle(400);
    }
  });

  //Order Review > Bootstrap Select - Mobile.
  jQuery(".pageForm .selectpicker").on("shown.bs.select", function (e, clickedIndex, isSelected, previousValue) {
    jQuery("body").addClass("pfSelectpicker-open");
  });
  jQuery(".pageForm .selectpicker").on("hidden.bs.select", function (e, clickedIndex, isSelected, previousValue) {
    jQuery("body").removeClass("pfSelectpicker-open");
  });
  //Order Review > Add Tips - Toggle active class & Other's block.
  jQuery(".pcbOrderreview .pcborInner .pcborRows.rowAddtips .pcborrBody .ratInner ul li").each(function () {
    var curLi = jQuery(this);
    curLi.find("a").on("click", function () {
      if (!curLi.hasClass("active")) {
        jQuery(".pcbOrderreview .pcborInner .pcborRows.rowAddtips .pcborrBody .ratInner ul li").removeClass("active");
        curLi.addClass("active");
      } else {
        curLi.removeClass("active");
      }
      var attrOthers = jQuery(this).attr("data-value");
      if (curLi.hasClass("active") && typeof attrOthers !== typeof undefined && attrOthers !== false && attrOthers != "") {
        //jQuery('.pcbOrderreview .pcborInner .pcborRows.rowAddtips .pcborrBody .ratInner .ratiOthers').slideDown();
        jQuery(this).parents(".ratInner").find(".ratiOthers").slideDown();
        jQuery("#tipAmount").val("");
      } else {
        //jQuery('.pcbOrderreview .pcborInner .pcborRows.rowAddtips .pcborrBody .ratInner .ratiOthers').slideUp();
        jQuery(this).parents(".ratInner").find(".ratiOthers").slideUp();
      }
    });
  });
  //Order Review > Your Details - Toggle Password block.
  jQuery("#rewardMemberlogin .customCheckbox input").on("change", function () {
    if (jQuery(this).prop("checked")) {
      jQuery(".pcbOrderreview .pcborInner .pcborRows.rowUserdetails .pcborrBody .rudPasswprd").slideDown();
    } else {
      jQuery(".pcbOrderreview .pcborInner .pcborRows.rowUserdetails .pcborrBody .rudPasswprd").slideUp();
    }
  });
  //Order Review > Your Details - Password Submit.
  jQuery("#rewardMembersubmit").on("click", function (e) {
    e.preventDefault();
    jQuery(this).parents(".pcborRows.rowUserdetails").addClass("rewardMemberloggedin");
    jQuery("#rewardMemberform").slideUp();
    setTimeout(function () {
      jQuery("#rmLoggedinsuccess").slideDown();
    }, 450);
    setTimeout(function () {
      jQuery("#memberRewardsblock").slideDown();
    }, 1000);
  });
  //Order Review > Your Details - Edit.
  jQuery(".pcbOrderreview .pcborInner .pcborRows.rowUserdetails .pcborrHead h2 .rudEdit").on("click", function (e) {
    e.preventDefault();
    jQuery("#editSpotReward").css("display", "none");
    jQuery(this).parents(".pcborRows.rowUserdetails").removeClass("rewardMemberloggedin");
    jQuery("#rewardsMember").prop("checked", false);
    jQuery(this).parents(".pcborRows.rowUserdetails").find(".pcborrBody .rudPasswprd").hide();
    jQuery("#rmLoggedinsuccess").slideUp();
    jQuery("#memberRewardsblock").slideUp();
    setTimeout(function () {
      jQuery("#rewardMemberform").slideDown();
    }, 500);
  });

  //Fnb modifier modal > sub item show
  //jQuery('.fnbmodifierModal .fnbmmRowwrap .fnbmmrwRows ul li').hide();
  //jQuery('body').on('change', '.fnbmodifierModal .fnbmmRowwrap .fnbmmrwRows ul#ulflevelcategory > li .customRadio input[type="radio"]', function (e) {
  //    if (jQuery(this).is(':checked')) {
  //        var curObj = jQuery(this);
  //        var subItemlistID = curObj.attr('id');
  //        if (typeof subItemlistID !== typeof undefined && subItemlistID !== false && subItemlistID != '') {
  //            /*jQuery('.fnbmodifierModal .fnbmmRowwrap .fnbmmrwRows.fnbsubItemsrows ul li').slideUp()
  //            jQuery('.fnbmodifierModal .fnbmmRowwrap .fnbmmrwRows.fnbsubItemsrows ul li[data-modifier=' + subItemlistID + ']').slideDown()
  //            jQuery('.fnbmodifierModal .fnbmmRowwrap .fnbmmrwRows.fnbsubItemsrows').slideDown(); Hided21062020*/
  //            curObj.parents('.fnbmmRowwrap').find('.fnbmmrwRows.fnbsubItemsrows').slideDown();
  //            curObj.parents('.fnbmmRowwrap').find(".fnbmmrwRows.fnbsubItemsrows .fnbmmrwrsiWrap").slideUp();
  //            setTimeout(function () {
  //                curObj.parents('.fnbmmRowwrap').find(".fnbmmrwRows.fnbsubItemsrows .fnbmmrwrsiWrap[data-item=" + subItemlistID + "]").slideDown();
  //            }, 400);
  //        }
  //        //$('.fnbmodifierModal .fnbmmRowwrap .fnbmmrwRows.fnbsubItemsrows ul').slideDown();
  //    }
  //});
  jQuery("#fnbmodifierModal").on("shown.bs.modal", function (e) {
    //F&B Modifier modal - Inner Scroll
    /*setTimeout(function () { 
            //fnbmodifierBodyheight(); //Hided25092020
            if (jQuery(window).width() < 768) {
                fnbmodifierBodyheight();
            }
        }, 400) Hided25092020*/
  });
  jQuery("#fnbmodifierModal").on("hidden.bs.modal", function (e) {
    /*jQuery(this).find('.modal-body').css('max-height', ''); Hidden25092020*/
    jQuery(this).find(".modal-body").css("max-height", "");
    //jQuery('.fnbmodifierModal .fnbmmRowwrap .fnbmmrwRows ul .customRadio input[type="radio"]').prop("checked", false);
    jQuery(this).find(".fnbmmRowwrap .fnbmmrwRows.fnbsubItemsrows").slideUp();
    jQuery(this).find(".fnbmmRowwrap .fnbmmrwRows.fnbsubItemsrows .fnbmmrwrsiWrap").slideUp();
  });

  //Fnb modifier modal > sub item hide
  /*jQuery('body').on('click', '.fnbmodifierModal .modal-header .modalClose', function (e) {
        setTimeout(function () {
            $('.fnbmodifierModal .fnbmmRowwrap .fnbmmrwRows.fnbsubItemsrows ul').css('display', 'none');
        });
    }); Hided21062020*/
});
/*E.O.Document Ready Function*/

jQuery(window).on("load", function () {
  //Page loader
  jQuery(".pageloader").fadeOut();

  //jQuery(".pcpFnbblock .pcpfnbCategory ul li").each(function () {
  jQuery("body").on("mouseenter", ".pcpFnbblock00000 .pcpfnbCategory ul li", function () {
    curLi = jQuery(this);
    //curLi.on('mouseenter', function () {
    var eleWidth = jQuery(this).find("a").outerWidth(true);
    var leftPos = jQuery(this).position().left;
    var lGutter = parseInt(jQuery(this).css("padding-left"));
    jQuery(".pcpFnbblock .pcpfnbCategory ul li.animateLi").css({
      width: eleWidth,
      left: leftPos + lGutter,
    });
  });
  jQuery("body").on("mouseleave", ".pcpFnbblock00000 .pcpfnbCategory ul li", function () {
    //.on("mouseleave", function () {
    /////var eleWidth = jQuery(".pcpFnbblock .pcpfnbCategory ul li.active a").outerWidth(true);
    /////var leftPos = jQuery(".pcpFnbblock .pcpfnbCategory ul li.active").position().left;
    /////var lGutter = parseInt(jQuery(".pcpFnbblock .pcpfnbCategory ul li.active").css("padding-left"));
    var eleWidth = jQuery(".pcpFnbblock .pcpfnbCategory ul li.focus a").outerWidth(true);
    var leftPos = jQuery(".pcpFnbblock .pcpfnbCategory ul li.focus").position().left;
    var lGutter = parseInt(jQuery(".pcpFnbblock .pcpfnbCategory ul li.focus").css("padding-left"));
    jQuery(".pcpFnbblock .pcpfnbCategory ul li.animateLi").css({
      width: eleWidth,
      left: leftPos + lGutter,
    });
  });

  //});

  //Form Elements - Interaction.
  if (jQuery(".pageForm .form-group").length > 0) {
    jQuery(".pageForm .form-group").each(function () {
      var cfParent = jQuery(this);
      var curField = jQuery(this).find(".form-control");
      var ffcValue = curField.val();
      ffcValue = $.trim(ffcValue);

      if (ffcValue != "") {
        cfParent.addClass("fcFocused");
      }

      curField
        .on("focus", function () {
          cfParent.addClass("fcFocused");
        })
        .on("blur", function () {
          if ($.trim(curField.val()) == "") {
            cfParent.removeClass("fcFocused");
          }
        });
    });
  }

  if (jQuery(".pageForm .form-group select.selectpicker").length > 0) {
    jQuery(".pageForm .form-group").each(function () {
      /*jQuery(this).find("select.selectpicker").on('loaded.bs.select rendered.bs.select', function (e, clickedIndex, isSelected, previousValue) {
                var trgele = jQuery(this).parents(".btn-group.bootstrap-select").find(".dropdown-menu.inner");
                if (!trgele.hasClass('mCustomScrollbar')) {
                    trgele.mCustomScrollbar({
                        autoHideScrollbar: false,
                        theme: "dark"
                    });
                }
                trgele.mCustomScrollbar('update');
            }); Hided02122020*/
      jQuery(this)
        .find("select.selectpicker")
        .on("shown.bs.select", function (e, clickedIndex, isSelected, previousValue) {
          //var trgele = jQuery(this).parents(".btn-group.bootstrap-select").find("div.dropdown-menu");
          var trgele = jQuery(this).parents(".btn-group.bootstrap-select").find(".dropdown-menu.inner");
          if (trgele.hasClass("mCustomScrollbar") && trgele.find(".mCustomScrollBox").length > 0) {
            trgele.mCustomScrollbar("update");
          } else {
            trgele.mCustomScrollbar({
              autoHideScrollbar: false,
              theme: "dark",
            });
          }
        });

      jQuery(this)
        .find("select.selectpicker")
        .on("hidden.bs.select", function (e, clickedIndex, isSelected, previousValue) {
          var trgele = jQuery(this).parents(".btn-group.bootstrap-select").find(".dropdown-menu.inner");
          setTimeout(function () {
            if (trgele.hasClass("mCustomScrollbar")) {
              trgele.mCustomScrollbar("destroy");
            }
          }, 1000);
        });

      //jQuery(this).find('.bootstrap-select .dropdown-toggle').on('click', function () {
      //    jQuery(this).parent('.bootstrap-select.btn-group').find('.dropdown-menu.inner').mCustomScrollbar({
      //        autoHideScrollbar: false,
      //        theme: "dark"
      //    });
      //    jQuery(this).parent('.bootstrap-select.btn-group').find('.dropdown-menu.inner').mCustomScrollbar('scrollTo', 'top');
      //});

      //jQuery(this).find('div.dropdown-menu').on('click', function () {
      //    jQuery(this).find('.dropdown-menu.inner').mCustomScrollbar('destroy');
      //});
    });
  }
});
/*E.O.Document Load*/

jQuery(window).on("resize", function () {});
/*E.O.Document Resize*/

jQuery(window).on("load resize", function () {
  //jQuery Device & Browser Detector Plugin - jQuery.device.detector
  //deviceDetector(); //For IOS safe-area-insert issue - Hided22012021

  //Category menu item animation
  /*if (jQuery(".pcpFnbblock .pcpfnbCategory ul").length > 0 && jQuery(".pcpFnbblock .pcpfnbCategory ul li").length > 0) {
        if (jQuery(".pcpFnbblock .pcpfnbCategory ul li.animateLi").length <= 0) {
            jQuery(".pcpFnbblock .pcpfnbCategory ul").append('<li class="animateLi">&nbsp;</li>');
        }
        var eleWidth = jQuery(".pcpFnbblock .pcpfnbCategory ul li.active a").outerWidth(true);
        var leftPos = jQuery(".pcpFnbblock .pcpfnbCategory ul li.active").position().left;
        var lGutter = parseInt(jQuery(".pcpFnbblock .pcpfnbCategory ul li.active").css("padding-left"));
        jQuery('.pcpFnbblock .pcpfnbCategory ul li.animateLi').css({
            "width": eleWidth,
            "left": leftPos + lGutter
        });
    } Hided01072020*/

  //Common popup > align centre
  jQuery("#repeatItem").on("shown.bs.modal", function (e) {
    var devheight = jQuery(window).height();
    var modalheight = parseInt(jQuery("#repeatItem.common-popupCont .modal-content").outerHeight(true));
    var caltopval = devheight > modalheight ? (devheight - modalheight) / 2 : 0;
    if (caltopval != 0) {
      jQuery("#repeatItem.common-popupCont .modal-dialog").css("padding-top", caltopval);
    }
  });
  jQuery("#repeatItem").on("hidden.bs.modal", function (e) {
    jQuery("#repeatItem.common-popupCont .modal-dialog").css("padding-top", "");
  });

  //Alcoholic popup > align centre
  jQuery("#allowAlcoholic").on("shown.bs.modal", function (e) {
    var devheight = jQuery(window).height();
    var modalheight = parseInt(jQuery("#allowAlcoholic.common-popupCont .modal-content").outerHeight(true));
    var caltopval = devheight > modalheight ? (devheight - modalheight) / 2 : 0;
    if (caltopval != 0) {
      jQuery("#allowAlcoholic.common-popupCont .modal-dialog").css("padding-top", caltopval);
    }
  });
  jQuery("#allowAlcoholic").on("hidden.bs.modal", function (e) {
    jQuery("#allowAlcoholic.common-popupCont .modal-dialog").css("padding-top", "");
  });

  //Replace cart item popup > align centre
  jQuery("#replaceItem").on("shown.bs.modal", function (e) {
    var devheight = jQuery(window).height();
    var modalheight = parseInt(jQuery("#replaceItem.common-popupCont .modal-content").outerHeight(true));
    var caltopval = devheight > modalheight ? (devheight - modalheight) / 2 : 0;
    if (caltopval != 0) {
      jQuery("#replaceItem.common-popupCont .modal-dialog").css("padding-top", caltopval);
    }
  });
  jQuery("#replaceItem").on("hidden.bs.modal", function (e) {
    jQuery("#replaceItem.common-popupCont .modal-dialog").css("padding-top", "");
  });

  //Error popup > align centre
  jQuery("#errorModal").on("shown.bs.modal", function (e) {
    var devheight = jQuery(window).height();
    var modalheight = parseInt(jQuery("#errorModal.common-popupCont .modal-content").outerHeight(true));
    var caltopval = devheight > modalheight ? (devheight - modalheight) / 2 : 0;
    if (caltopval != 0) {
      jQuery("#errorModal.common-popupCont .modal-dialog").css("padding-top", caltopval);
    }
  });
  jQuery("#errorModal").on("hidden.bs.modal", function (e) {
    jQuery("#errorModal.common-popupCont .modal-dialog").css("padding-top", "");
  });

  //Giftcard popup > align centre
  jQuery("#errorModalGiftcard").on("shown.bs.modal", function (e) {
    var devheight = jQuery(window).height();
    var modalheight = parseInt(jQuery("#errorModalGiftcard.common-popupCont .modal-content").outerHeight(true));
    var caltopval = devheight > modalheight ? (devheight - modalheight) / 2 : 0;
    if (caltopval != 0) {
      jQuery("#errorModalGiftcard.common-popupCont .modal-dialog").css("padding-top", caltopval);
    }
  });
  jQuery("#errorModalGiftcard").on("hidden.bs.modal", function (e) {
    jQuery("#errorModalGiftcard.common-popupCont .modal-dialog").css("padding-top", "");
  });

  /* Footer - Sticky to bottom */
  if (jQuery(".pageFooter").length > 0) {
    //var pwHeight = jQuery('.pageWrapper').outerHeight(true);
    var pcHeight = jQuery(".pageContent").outerHeight(true);
    var dwHeight = jQuery(window).height();
    //if (pwHeight < dwHeight) {
    if (pcHeight < dwHeight) {
      jQuery(".pageWrapper").css("min-height", dwHeight);
      jQuery(".pageWrapper").addClass("pageFooterSticky");

      var bsVisible = jQuery(".pcpbBottomstrap").css("display");
      if (bsVisible != "none" && !jQuery(".pageWrapper").hasClass("pcpbbsVisible")) {
        jQuery(".pageWrapper").addClass("pcpbbsVisible");
      } else {
        jQuery(".pageWrapper").removeClass("pcpbbsVisible");
      }
    } else {
      jQuery(".pageWrapper").css("min-height", "");
      jQuery(".pageWrapper").removeClass("pageFooterSticky");

      if (jQuery(".pageWrapper").hasClass("pcpbbsVisible")) {
        jQuery(".pageWrapper").removeClass("pcpbbsVisible");
      }
    }
  }

  /*if (jQuery('.pcpCart .roundBoxshadowed').length > 0) {

        if (jQuery(window).width() > 992) {
            jQuery(".pcpCart .roundBoxshadowed:not(.mCustomScrollbar)").mCustomScrollbar({
                autoHideScrollbar: false,
                theme: "dark"
            });
        } else {
            jQuery(".pcpCart .roundBoxshadowed.mCustomScrollbar").mCustomScrollbar('destroy');
        }

    } Hided23062020*/
  if (jQuery(".pcpCart.pcpCartfull .pcpBookingsummary .pcpbsInner .pcpbsContainer").length > 0) {
    var devWidth = jQuery(window).width();
    if (devWidth > 992) {
      jQuery(".pcpCart.pcpCartfull .pcpBookingsummary .pcpbsInner .pcpbsContainer:not(.mCustomScrollbar)").mCustomScrollbar({
        autoHideScrollbar: false,
        theme: "dark",
      });
    } else if (jQuery(".pcpCart.pcpCartfull .pcpBookingsummary .pcpbsInner .pcpbsContainer").hasClass("mCustomScrollbar")) {
      jQuery(".pcpCart.pcpCartfull .pcpBookingsummary .pcpbsInner .pcpbsContainer").mCustomScrollbar("destroy");
    }
  }

  //F&B Modifier modal - Inner Scroll
  var fnbModifier = jQuery("#fnbmodifierModal");
  if (fnbModifier.length > 0) {
    fnbmodifierBodyheight();
    /*//setTimeout(function () {
            //Elements
            var devWidth = jQuery(window).width();
            var devHeight = jQuery(window).height();
            var modalDialog = fnbModifier.find('.modal-dialog');
            var modalContent = fnbModifier.find('.modal-content');
            var modalHeader = fnbModifier.find('.modal-header');
            var modalBody = fnbModifier.find('.modal-body');
            var modalFooter = fnbModifier.find('.modal-footer');

            modalBody.css('height', '');
            //Elements - Getting Values
            var mdMtop = modalDialog.css('margin-top');
            var mcHeight = modalContent.outerHeight(true);
            var mdmcHeight = parseInt((parseInt(mdMtop) * 2) + mcHeight);
            var mhHeight = modalHeader.outerHeight(true);
            var mhFooter = modalFooter.outerHeight(true);
            var mbCalhgt = parseInt(devHeight - ((parseInt(mdMtop) * 2) + mhHeight + mhFooter));
            if (mdmcHeight > devHeight || devWidth<768 && devHeight>=480) {
            //if (devWidth < 768 && devHeight>=480) {
                modalBody.css('height', mbCalhgt);
            } else {
                modalBody.css('height', '');
            }
        //}, 300); Hided03072020*/
  }

  //Space Calculation: to fix last(active) & its previous(focus) different classes.
  if (
    jQuery(".pcpFnbblock .pcpfnbCategory ul li:not('.animateLi')").length > 0 &&
    jQuery(".pcpFnbblock .pcpfnbCategorylist > ul > li").length > 0 &&
    jQuery(".pcpFnbblock .pcpfnbCategory ul li:not('.animateLi')").length == jQuery(".pcpFnbblock .pcpfnbCategorylist > ul > li").length
  ) {
    //////////console.log("asdfasdf");
    setTimeout(function () {
      bottomSpacecalculation();
    }, 1000);
  }
});
/*E.O.Document Load & Resize*/

jQuery(window).on("load scroll", function () {
  //Header Sticky
  if (jQuery("header.pageHeader").length > 0) {
    var stopVal = jQuery(this).scrollTop();
    if (stopVal > 0) {
      jQuery("body").addClass("phSticky");
    } else {
      jQuery("body").removeClass("phSticky");
    }
  }

  /* F&B Category tab - Sticky */
  if (jQuery("#pcpfnbCategorywrapper").length > 0) {
    var stopVal = jQuery(this).scrollTop();
    var fnbpost = jQuery("#pcpfnbCategorywrapper").offset().top;
    var hHeight = jQuery(".pageHeader").outerHeight(true);
    var caltrgt = parseInt(fnbpost - hHeight);
    //////////console.log("Scroll Top: "+stopVal+" Category Top: "+fnbpost+" Header Height: "+hHeight+" = "+caltrgt);

    if (stopVal > caltrgt) {
      jQuery("#pcpfnbCategorywrapper").addClass("pcpfnbCategorysticky");
    } else {
      jQuery("#pcpfnbCategorywrapper").removeClass("pcpfnbCategorysticky");
    }
  }
});
/*E.O.Document Load & Scroll*/

jQuery(window).on("load resize scroll", function () {
  var tabList = jQuery(".pcpFnbblock .pcpfnbCategory ul li:not(.animateLi)");
  var tabContent = jQuery(".pcpFnbblock .pcpfnbCategorylist > ul > li");
  //alert(tablistCount+" : "+tabcontentCount);
  if (tabList.length > 0 && tabContent.length > 0 && tabList.length == tabContent.length) {
    if (jQuery(".pcpFnbblock .pcpfnbCategory ul li.animateLi").length <= 0) {
      jQuery(".pcpFnbblock .pcpfnbCategory ul").append('<li class="animateLi">&nbsp;</li>');
    }

    var scrollPos = jQuery(window).scrollTop();
    var headerHeight = jQuery(".pageHeader").outerHeight(true);
    var tabHeight = jQuery(".pcpFnbblock .pcpfnbCategory").outerHeight(true);
    var tcFirstpos = tabContent.eq(0).offset().top;
    var focusStart = parseInt(tcFirstpos - headerHeight - tabHeight);
    if (scrollPos < focusStart) {
      //if (scrollPos < tcFirstpos) { //Hided13072020
      /*
            tabList.removeClass('focus');
            tabList.eq(0).addClass('focus');
                //tabContent.removeClass('active'); //Hided08072020
                //tabContent.eq(0).addClass('active'); //Hided08072020
            var eleWidth = tabList.eq(0).find('a').outerWidth(true);
                //var leftPos = tabList.eq(0).offset().left;
                //var lGutter = parseInt(tabList.eq(0).css("padding-left"));
            jQuery('.pcpFnbblock .pcpfnbCategory ul li.animateLi').css({
                "width": eleWidth,
                //"left": leftPos + lGutter
                "left": 0
            });
            Hided13072020*/
      tabList.removeClass("focus");
      /////jQuery(".pcpFnbblock .pcpfnbCategory ul li.active").addClass('focus');
      jQuery(".pcpFnbblock .pcpfnbCategory ul li:first-child").addClass("focus");
      /////setTimeout(function () {
      /////    if (!jQuery(".pcpFnbblock .pcpfnbCategory ul li:first-child").hasClass('focus')){
      /////        jQuery(".pcpFnbblock .pcpfnbCategory ul li:first-child").addClass('focus');
      /////    }
      /////}, 1000);
      setTimeout(function () {
        /////var eleWidth = jQuery(".pcpFnbblock .pcpfnbCategory ul li.active a").outerWidth(true);
        /////var cpliLeft = jQuery(".pcpFnbblock .pcpfnbCategory ul li.active").position().left;
        /////cpliLeft = cpliLeft + parseInt(jQuery(".pcpFnbblock .pcpfnbCategory ul li.active").css("padding-left"));
        var eleWidth = jQuery(".pcpFnbblock .pcpfnbCategory ul li:first-child a").outerWidth(true);
        var cpliLeft = jQuery(".pcpFnbblock .pcpfnbCategory ul li:first-child").position().left;
        cpliLeft = cpliLeft + parseInt(jQuery(".pcpFnbblock .pcpfnbCategory ul li:first-child").css("padding-left"));
        jQuery(".pcpFnbblock .pcpfnbCategory ul li.animateLi").css({
          width: eleWidth,
          //"left": leftPos + lGutter
          left: cpliLeft,
        });
        /*jQuery(".pcpFnbblock .pcpfnbCategory .pcpfnbcInner .mcsbWrapper.mCustomScrollbar").mCustomScrollbar("scrollTo", jQuery(".pcpFnbblock .pcpfnbCategory ul li.active"));
                jQuery(".pcpFnbblock .pcpfnbCategory .pcpfnbcInner .mcsbWrapper.mCustomScrollbar").mCustomScrollbar("update"); //Hided21082020*/
      }, 500);
    } else {
      jQuery(".pcpFnbblock .pcpfnbCategorylist > ul > li").each(function () {
        var curli = jQuery(this);
        var curliId = curli.attr("id");
        var curliTop = curli.offset().top;

        //////////console.log(curliTop);
        var hdrHeight = jQuery(".pageHeader").outerHeight(true);
        var tabHeight = jQuery(".pcpFnbblock .pcpfnbCategory").outerHeight(true);
        var curliPos = parseInt(curliTop - hdrHeight - tabHeight - 5);
        //////////console.log(curliPos);

        var curAnchor = jQuery(".pcpFnbblock .pcpfnbCategory ul li a[data-target='#" + curliId + "']");
        var caParentli = curAnchor.parent("li");
        if (curliPos <= scrollPos && parseInt(curliPos + jQuery(this).outerHeight(true)) > scrollPos) {
          //jQuery(".pcpFnbblock .pcpfnbCategory ul li").removeClass("active");
          ///jQuery(".pcpFnbblock .pcpfnbCategory ul li").removeClass("focus");
          setTimeout(function () {
            var caWidth = curAnchor.outerWidth(true);
            var cpliLeft = caParentli.position().left;
            var cpliPleft = parseInt(caParentli.css("padding-left"));
            //////////console.log('Left: '+cpliLeft+" Padding Left: "+cpliPleft);
            cpliLeft = cpliLeft + cpliPleft;
            //////////console.log("Total: "+cpliLeft);
            //curli.addClass('active');
            //curli.find('> .pcpfnbiBox .pcpfnbibBody').slideDown();
            jQuery(".pcpFnbblock .pcpfnbCategory ul li").removeClass("focus");
            caParentli.addClass("focus");
            jQuery(".pcpFnbblock .pcpfnbCategory ul li.animateLi").css({
              width: caWidth,
              left: cpliLeft,
            });
          }, 500);
          /////setTimeout(function () {
          /////   if (caParentli.prev('li').length > 0 && caParentli.prev('li').hasClass('focus')) {
          /////       caParentli.prev('li').removeClass('focus');
          /////        caParentli.prevAll('li').removeClass('focus');
          /////        caParentli.nextAll('li').removeClass('focus');
          /////    }
          /////}, 501);
          /////}, 1000);
          setTimeout(function () {
            jQuery(".pcpFnbblock .pcpfnbCategory .pcpfnbcInner .mcsbWrapper.mCustomScrollbar").mCustomScrollbar("update");
            jQuery(".pcpFnbblock .pcpfnbCategory .pcpfnbcInner .mcsbWrapper.mCustomScrollbar").mCustomScrollbar("scrollTo", caParentli);
          }, 600);
        } else {
          //jQuery(".pcpFnbblock .pcpfnbCategory ul li a[data-target='#"+curliId+"']").parent('li').removeClass("active");
          //curli.removeClass('active');
          //curli.find('> .pcpfnbiBox .pcpfnbibBody').hide();
          caParentli.removeClass("focus");
        }
      });
    }
  }

  /* Right Column - Sticky & mcustomScrollbar initialize/destroy */
  if (jQuery(".pcPanel .pcpBody .pcpbInner .pcpbiColswrap .pcpbiCols.pcpbiColleft").length > 0 && jQuery(".pcPanel .pcpBody .pcpbInner .pcpbiColswrap .pcpbiCols.pcpbiColright").length > 0) {
    var lftColheight = jQuery(".pcPanel .pcpBody .pcpbInner .pcpbiColswrap .pcpbiCols.pcpbiColleft").outerHeight(true);
    var rgtColheight = jQuery(".pcPanel .pcpBody .pcpbInner .pcpbiColswrap .pcpbiCols.pcpbiColright").outerHeight(true);
    //////////console.log("Left Height: " + lftColheight + " Right Height: " + rgtColheight);

    /*Left Column height less than right column height*/
    if (rgtColheight > lftColheight && jQuery(window).width() > 992) {
      var wnwHeight = jQuery(window).height();
      var hdrHeight = jQuery(".pageHeader").outerHeight(true);
      //var phdHeight = jQuery(".pcPanel .pcpHead").outerHeight(true);
      var ftrHeight = jQuery(".pageFooter").outerHeight(true);
      //var p0 = jQuery(".pcPanel").css("padding-top");
      var calmrgbtm = parseInt(wnwHeight - (hdrHeight + lftColheight + ftrHeight));
      //////////console.log("calmrgbtm: "+calmrgbtm);
      if (calmrgbtm >= 0) {
        //////////console.log("1 calmrgbtm: True");
        jQuery(".pcPanel .pcpBody .pcpbInner .pcpbiColswrap .pcpbiCols.pcpbiColleft").css("margin-bottom", calmrgbtm);
        jQuery(".pcPanel .pcpBody .pcpbInner .pcpbiColswrap .pcpbiCols.pcpbiColright").css("min-height", wnwHeight - (hdrHeight + ftrHeight));
      } else {
        //////////console.log("1 calmrgbtm: False");
        jQuery(".pcPanel .pcpBody .pcpbInner .pcpbiColswrap .pcpbiCols.pcpbiColleft").css("margin-bottom", "");
        jQuery(".pcPanel .pcpBody .pcpbInner .pcpbiColswrap .pcpbiCols.pcpbiColright").css("min-height", "");
      }
    } else {
      //////////console.log("0 calmrgbtm: False");
      jQuery(".pcPanel .pcpBody .pcpbInner .pcpbiColswrap .pcpbiCols.pcpbiColleft").css("margin-bottom", "");
      jQuery(".pcPanel .pcpBody .pcpbInner .pcpbiColswrap .pcpbiCols.pcpbiColright").css("min-height", "");
    }
    /*E.O. Left Column height less than right column height*/

    //if (lftColheight > rgtColheight) { //Hided24082020

    var stopVal = jQuery(this).scrollTop();
    var fnbpost = jQuery(".pcPanel .pcpBody .pcpbInner .pcpbiColswrap .pcpbiCols.pcpbiColright").offset().top;
    var hHeight = jQuery(".pageHeader").outerHeight(true);
    var tHeight = jQuery("#pcpfnbCategorywrapper").length > 0 ? jQuery("#pcpfnbCategorywrapper").outerHeight(true) : 0;
    //////////console.log("tHeight Length: " + jQuery("#pcpfnbCategorywrapper").length + " tHeight Height: " + tHeight);

    var caltrgt = parseInt(fnbpost - hHeight - tHeight);
    //////////console.log("Scroll Top: "+stopVal+" Category Top: "+fnbpost+" Header Height: "+hHeight+" = "+caltrgt);
    var topGutr = 0; //padding-top value of --> .pcPanel .pcpBody .pcpbInner .pcpbiColswrap .pcpbiCols.pcpbiColright:not(.sticky) .pcpbicrInner.
    if (jQuery(window).width() > 992) {
      topGutr = 10;
    } else if (jQuery(window).width() > 1200) {
      topGutr = 10;
    } else if (jQuery(window).width() > 1920) {
      topGutr = 20;
    } else {
      topGutr = 0;
    }

    //Calculating the from right position.
    var devwidth = jQuery(window).width();
    var devheight = jQuery(window).height();
    var carwidth = jQuery(".container").width();
    var cuepdlft = Math.ceil((devwidth - carwidth) / 2);

    //Calculating the container height.
    var ftrHeight = jQuery(".pageFooter").outerHeight(true);
    var btnHeight = jQuery(".pcpCart .pcpcAction").outerHeight(true);
    var cartHeight = devheight - parseInt(hHeight + tHeight + topGutr * 2 + btnHeight + ftrHeight);
    //var cartHeight = devheight - parseInt(hHeight+tHeight+(topGutr*2));

    if (jQuery(window).width() > 992 && stopVal > caltrgt) {
      jQuery(".pcPanel .pcpBody .pcpbInner .pcpbiColswrap .pcpbiCols.pcpbiColright").addClass("sticky");
      jQuery(".pcPanel .pcpBody .pcpbInner .pcpbiColswrap .pcpbiCols.pcpbiColright .pcpbicrInner").css({
        "padding-top": parseInt(hHeight + tHeight + topGutr + 10),
        right: cuepdlft,
      });
      //jQuery(".pcpCart .roundBoxshadowed").css('max-height', cartHeight);
      jQuery(".pcpCart").css("height", cartHeight);

      //Inner Scroll For Items List.
      if (jQuery(".pcpCart.pcpCartfull .pcpBookingsummary .pcpbsInner .pcpbsContainer").length > 0) {
        //var rbsHeight = jQuery(".pcpCart.pcpCartfull .roundBoxshadowed").outerHeight(true);
        var rbsPadtop = parseInt(jQuery(".pcpCart.pcpCartfull .roundBoxshadowed").css("padding-top"));
        var rbsH3hgt = jQuery(".pcpCart.pcpCartfull h3").outerHeight(true);
        var rbsTtlstr = jQuery(".pcpCart .pcpBookingsummary .pcpbsInner .pcpbsTotalstrap").outerHeight(true);
        var mcsbHeight = parseInt(cartHeight - rbsPadtop * 2 - rbsH3hgt - rbsTtlstr);
        jQuery(".pcpCart.pcpCartfull .pcpBookingsummary .pcpbsInner .pcpbsContainer").css("max-height", mcsbHeight);
        jQuery(".pcpCart.pcpCartfull .pcpBookingsummary .pcpbsInner .pcpbsContainer").mCustomScrollbar("update");
      }
    } else {
      jQuery(".pcPanel .pcpBody .pcpbInner .pcpbiColswrap .pcpbiCols.pcpbiColright").removeClass("sticky");
      jQuery(".pcPanel .pcpBody .pcpbInner .pcpbiColswrap .pcpbiCols.pcpbiColright .pcpbicrInner").css({
        "padding-top": "",
        right: "",
      });
      //jQuery(".pcpCart .roundBoxshadowed").css('max-height', '');
      jQuery(".pcpCart").css("height", "");

      //Inner Scroll For Items List.
      if (jQuery(".pcpCart.pcpCartfull .pcpBookingsummary .pcpbsInner .pcpbsContainer").length > 0) {
        jQuery(".pcpCart.pcpCartfull .pcpBookingsummary .pcpbsInner .pcpbsContainer").css("max-height", "");
        jQuery(".pcpCart.pcpCartfull .pcpBookingsummary .pcpbsInner .pcpbsContainer").mCustomScrollbar("update");
      }
    }
    //} //E.O.if Hided24082020
  }
});
/*E.O.Document Load, Resize & Scroll*/

//jQuery(window).one('scroll', function () {
jQuery(window).on("scroll", function () {
  //Space Calculation: to fix last(active) & its previous(focus) different classes.
  if (
    jQuery(".pcpFnbblock .pcpfnbCategory ul li:not('.animateLi')").length > 0 &&
    jQuery(".pcpFnbblock .pcpfnbCategorylist > ul > li").length > 0 &&
    jQuery(".pcpFnbblock .pcpfnbCategory ul li:not('.animateLi')").length == jQuery(".pcpFnbblock .pcpfnbCategorylist > ul > li").length &&
    scrlFlag == 0
  ) {
    //////////console.log("asdfasdf");
    scrlFlag = 1;
    setTimeout(function () {
      bottomSpacecalculation();
    }, 1000);
  }
});
/*E.O.Scroll(Only Once)*/

function fnbmodifierBodyheight() {
  var fnbModifier = jQuery("#fnbmodifierModal");

  /*var trgele = fnbModifier.find(".modal-body"); Hided01102020*/
  var trgele = fnbModifier.find(".osbWrap");

  /* Overlay Scrollbar*/
  if (fnbModifier.length > 0 && trgele.length > 0) {
    Overlayscrlbar = trgele
      .overlayScrollbars({
        paddingAbsolute: true,
        autoUpdate: true,
        scrollbars: {
          clickScrolling: true,
        },
      })
      .overlayScrollbars();

    //Elements
    var devWidth = jQuery(window).width();
    var devHeight = jQuery(window).height();
    var modalDialog = fnbModifier.find(".modal-dialog");
    var modalContent = fnbModifier.find(".modal-content");
    var modalHeader = fnbModifier.find(".modal-header");
    /*var modalBody = fnbModifier.find('.modal-body'); Hided01102020*/
    var modalBody = fnbModifier.find(".osbWrap");
    var modalFooter = fnbModifier.find(".modal-footer");

    /*modalBody.css('max-height', ''); Hided24092020*/
    modalBody.css("max-height", "");
    setTimeout(function () {
      //Elements - Getting Values
      var mdMtop = modalDialog.css("margin-top");
      var mcHeight = modalContent.outerHeight(true);
      var mdmcHeight = parseInt(parseInt(mdMtop) * 2 + mcHeight);
      var mhHeight = modalHeader.outerHeight(true);
      var mhFooter = modalFooter.outerHeight(true);
      /*var mbCalhgt = parseInt(devHeight - ((parseInt(mdMtop) * 2) + mhHeight + mhFooter)); Hided01102020*/
      var mbCalhgt = parseInt(devHeight - (parseInt(mdMtop) * 2 + mhFooter));
      ////////console.log("devHeight: " + devHeight);
      ////////console.log("mdMtop*2: " + parseInt(mdMtop) * 2);
      ////////console.log("mhFooter: " + mhFooter);
      ////////console.log("mbCalhgt: " + mbCalhgt);

      if (devHeight >= 480) {
        /*modalBody.css('max-height', mbCalhgt); Hided24092020*/
        modalBody.css("max-height", mbCalhgt);
      } else {
        /*modalBody.css('max-height', ''); Hided24092020*/
        modalBody.css("max-height", "");
      }
      /*trgele.mCustomScrollbar('update'); Hided24092020*/
      if (Overlayscrlbar instanceof OverlayScrollbars) {
        /* instance is indeed a OverlayScrollbars instance */
        Overlayscrlbar.update();
      }
      //}, 400); //Hided01102020
    }, 800);
  }
}

function bottomSpacecalculation() {
  var wnwHeight = jQuery(window).outerHeight(true);
  var hdrHeight = jQuery(".pageHeader").outerHeight(true);
  var ftrHeight = jQuery(".pageFooter").outerHeight(true);
  var tabHeight = jQuery(".pcpFnbblock .pcpfnbCategory").outerHeight(true);
  var tbCntlast = jQuery(".pcpFnbblock .pcpfnbCategorylist > ul > li").last();
  var tcnHeight = tbCntlast.find(".pcpfnbiBox .pcpfnbibHead").outerHeight(true);
  tbCntlast.css("margin-bottom", "");
  var bstHeight = jQuery(window).width() < 992 && jQuery(".pcpbBottomstrap").length > 0 ? jQuery(".pcpbBottomstrap").outerHeight(true) : 0;
  var pb0 = parseInt(tbCntlast.css("padding-top"));
  var pb1 = parseInt(jQuery(".pcPanel").css("padding-bottom"));
  var pb2 = parseInt(jQuery(".pcPanel .pcpBody").css("padding-bottom"));
  var pb3 = parseInt(jQuery(".pcPanel .pcpBody .pcpbInner .pcpbiColswrap .pcpbiCols.pcpbiColleft .pcpbiclInner").css("padding-bottom"));

  var calSpace = parseInt(wnwHeight - (hdrHeight + tabHeight + tcnHeight + ftrHeight + bstHeight + pb0 + pb1 + pb2 + pb3));
  ////////console.log("calSpace: " + calSpace);
  if (calSpace >= 0) {
    tbCntlast.css("margin-bottom", calSpace);
  } else {
    tbCntlast.css("margin-bottom", "");
  }
}

/*
//For IOS safe-area-insert issue
function deviceDetector() {

    var jqDd = $.fn.deviceDetector;

    if (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1 && navigator.userAgent.indexOf('CriOS/') == -1 && jqDd.isMobile() && jqDd.isIos() === true && jqDd.isIphone() === true && jqDd.getBrowserId() == 'safari') {

        /-*
            Actual iPhoneX Media Query 
            (window.matchMedia('only screen and (min-width: 360px) and (max-width: 479px) and (min-height: 800px) and (max-height: 900px) and (-webkit-device-pixel-ratio: 2)').matches || window.matchMedia('only screen and (min-width: 360px) and (max-width: 479px) and (min-height: 800px) and (max-height: 900px) and (-webkit-device-pixel-ratio: 3)').matches) && !jQuery("body").hasClass('latest-ios-devices'))

        *-/
        if ( (window.matchMedia('only screen and (min-width: 360px) and (max-width: 479px) and (min-height: 600px) and (max-height: 700px) and (-webkit-device-pixel-ratio: 2)').matches || window.matchMedia('only screen and (min-width: 360px) and (max-width: 479px) and (min-height: 600px) and (max-height: 700px) and (-webkit-device-pixel-ratio: 3)').matches) ) {

            if (!jQuery("body").hasClass('latest-ios-devices')) {
                jQuery("body").addClass('latest-ios-devices');
            }

        } else {

            if (jQuery("body").hasClass('latest-ios-devices')) {
                jQuery("body").removeClass('latest-ios-devices')
            }

        }


    }

}
*/ //For IOS safe-area-insert issue - Hided22012021
