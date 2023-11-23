import React, { Suspense, lazy } from "react";
import { Routes, Route, Outlet, Link, Navigate } from "react-router-dom";
import axios from "axios";
import jQuery, { data, param } from "jquery";
import { useNavigate } from "react-router-dom";
import * as API from "../../configuration/apiconfig";
import constant from "../../configuration/config";
import { Modal } from "bootstrap";
import Swal from "sweetalert2";
import "react-loading-skeleton/dist/skeleton.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Loader from "../../components/Loader";
import DeliveredInSeat from "../../assets/images/ic-fnbDeliveryinseat.svg";
import PickUpDelivery from "../../assets/images/ic-fnbPickup.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaShoppingCart, FaBox } from "react-icons/fa";
import { faCheck, faCommentDollar, faDollarSign, faIdBadge, faMoneyCheckDollar, faPause, faPlus, faSackDollar } from "@fortawesome/free-solid-svg-icons";
const Home = lazy(() => import("../../components/Home"));
const Menu = lazy(() => import("../../components/Menu"));
const OrderReview = lazy(() => import("../../components/OrderReview"));
const Payment = lazy(() => import("../../components/Payment"));
const Confirmation = lazy(() => import("../../components/Confirmation"));

const Error404 = lazy(() => import("../../components/Error/Error404"));
const Error500 = lazy(() => import("../../components/Error/Error500"));
const Maintenance = lazy(() => import("../../components/Maintenance"));

const Earlybird = lazy(() => import("../../components/Earlybird"));

var accessTokenExpiry = 300;
var scrlFlag = 0;
var modifierGroupsArray = [];
var smartModifiersArray = [];

var modifierModal = null;
var membersLoginModal = null;
var ageRestrictionModal = null;
var orderCancellationModal = null;

class Routing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //selectedLocation:"",
      memberLogin: false,
      isExtraPlusMember: false,
      loaderToggle: false,
      confirmBooking: true,
      pwPaymentflow: false,
      showHomeIcon: false,
      fnbMenuItems: [],
      cartFlag: false,
      cartData: [],
      fnbItemModifierData: "",
      bookingInfo: {},
      tempModifierModalTotal: 0,
      //tempModifierGroupsArray: [],
      createOrderData: {
        firstname: "",
        lastname: "",
        fullname: "",
        email: "",
        phonenumber: "",
        //seatNumber: "", // Change of key seatNumber to deliveryseat
        deliveryseat: "",
        termsAndConditions: false,
      },
      redirect: false,
      orderId: "",
      locations: [],
      dates: [],
      movies: [],
      deals: [],
      ////todaysDealsCount: 0, // All days Deals.
      staticPromotions: [],
      updateMovieListFlag: false,
      normalBookingInfoSelected: {},
      selectedInseatDeliverSlot: "",
      selectedInseatDeliverSlotId: "",
      bookingLocation: {},
      bookingId: "",
      repeatItemData: {},
      loginUserName: "",
      loginPassword: "",
      afterLoginToken: {},
      ageRestrictioncurrenttime: "",
      ageRestrictionMonth: "",
      ageRestrictionDate: "",
      ageRestrictionYear: "",
      ageRestrictionValidationDone: false,
      alcholBeverageCheckFNBData: {
        fnbItemData: [],
        tabId: "",
        tabName: "",
        dealsFlag: "",
      },
      //qrScanFromSeat: {},
      selectDetailsProceed: false,
      selectDetailsSelected: {},
      orderId: "",
      paymentRedirect: "",
      paymentTypes: [],
      paymentIframe: {},
      paymentKeys: "",
      confirmationRedirectURL: "",
      bookingIdError: false,
      repeatItemIndex: false,
      toggleWithoutBookingId: false,
      //giftCards: [],
      redeemedGiftcards: [],
      bookingIdSection: "",
      seatNumberMandatory: false,
      nameOnCard: "",
      deliveryTimings: [],
      refundInitBookingId: "",
      //refundInitBookingInfo: false,
      refundInitBookingInfo: {},
      refundBookingOrderID: "",
      refundSummaryTips: false,
      refundSummaryTax: false,
      refundSummarySubTotal: false,
      refundSummaryPaymentMethod: [],
      cancelOrderError: "",
      showHomeIconInLandingpage: false,
      giftCardResponse: "",
      debugLocationsURL: "",
      debugLocationsCinemaIDs: [],
      bookingURLCinemaId: "",
    };
  }

  handleGiftCardResponse = (text) => {
    this.setState({ giftCardResponse: text });
  };

  handleBrowserBackButton = () => {
    let createOrderData = {
      firstname: this.state.createOrderData.firstname,
      lastname: this.state.createOrderData.lastname,
      fullname: this.state.createOrderData.fullname,
      email: this.state.createOrderData.email,
      phonenumber: this.state.createOrderData.phonenumber,
      deliveryseat: "",
      termsAndConditions: false,
    };

    this.setState({
      confirmBooking: true,
      cartData: [],
      createOrderData,
      paymentTypes: [],
    });
  };

  setNameOnCard = (value) => {
    value = value
      .split("")
      .filter((item) => item.match(/^[a-zA-Z ]*$/i))
      .join("");
    localStorage.setItem("creditCardNameOnCard", value);
    this.setState({ nameOnCard: value });
  };

  setParentState = (parentState) => {
    this.setState(parentState);
  };

  componentDidMount = () => {
    var self = this;

    try {
      if (JSON.parse(localStorage.getItem("stateData")) !== null) {
        let bookingId = JSON.parse(localStorage.getItem("stateData")).bookingId;
        let bookingLocation = JSON.parse(localStorage.getItem("stateData")).bookingLocation;
        this.setState({ bookingId, bookingLocation });
      }
    } catch (e) {
      console.log(e);
    }

    if (API.getValueFromCookie("loggedin")) {
      let parentState = this.state;
      // parentState.afterLoginToken = JSON.parse(localStorage.getItem("parentState")).afterLoginToken;
      parentState.afterLoginToken = JSON.parse(localStorage.getItem("afterLoginToken"));
      parentState.memberLogin = true;
      let createOrderData = parentState.createOrderData;
      createOrderData.firstname = parentState.afterLoginToken.firstname;
      createOrderData.lastname = parentState.afterLoginToken.lastname;
      createOrderData.fullname = parentState.afterLoginToken.firstname + " " + parentState.afterLoginToken.lastname;
      createOrderData.email = parentState.afterLoginToken.email;
      createOrderData.phonenumber = parentState.afterLoginToken.phonenumber;
      this.setState(parentState);
    }

    this.handleFooterSticky();
    if (window.location.pathname == "/fnbmenu") {
      this.setState(JSON.parse(localStorage.getItem("stateData")), () => {
        this.checkIfUserLoggedin();
      });
    } else {
      localStorage.removeItem("stateData");
      localStorage.removeItem("dealWidth");
    }

    this.getLocations();

    //Modifiers Modal
    const modifierModalEle = document.getElementById("modalFnbModifier");
    modifierModal = new Modal(document.getElementById("modalFnbModifier"));

    //Memberlogin.
    const memberLoginEle = document.getElementById("membersLogin");
    membersLoginModal = new Modal(memberLoginEle);

    //Age Restriction Modal.
    const ageRestrictedEle = document.getElementById("allowAlcoholic");
    ageRestrictionModal = new Modal(ageRestrictedEle);

    //Order Cancellation Modal
    const orderCancellationEle = document.getElementById("orderCancellation");
    orderCancellationModal = new Modal(orderCancellationEle);
    orderCancellationEle.addEventListener("hidden.bs.modal", function (event) {
      self.setState(
        {
          refundInitBookingId: "",
          //refundInitBookingInfo: false,
          refundInitBookingInfo: {},
          refundBookingOrderID: "",
          refundSummaryTips: false,
          refundSummaryTax: false,
          refundSummarySubTotal: false,
          refundSummaryPaymentMethod: [],
          cancelOrderError: "",
        },
        () => {
          jQuery("#orderCancellation #fieldOrderId").val("");
          jQuery("#orderCancellation #fieldOrderId").attr("readonly", false);
          //jQuery("#orderCancellation .btnswrap.mlfAction").removeClass("d-none");
          jQuery("#orderCancellation #btnRefundBookingOkay").addClass("disabled");
          jQuery("#orderCancellationInitForm").show();
          jQuery("#orderCancellationInitFnbSummary").hide();
          document.getElementById("orderCancellationInitFnbSummary").style.display = "none";
          document.getElementById("errorInvlidBookingId").style.display = "none";
        }
      );
    });

    document.body.addEventListener("click", (event) => this.handleLocationDropdownCollapse(event));

    //Modifier Modal > Height Calculation.
    //var modifierModalEle = document.getElementById("modalFnbModifier");
    modifierModalEle.addEventListener("shown.bs.modal", function (event) {
      self.fnbmodifierBodyheight();
    });
    modifierModalEle.addEventListener("hidden.bs.modal", function (event) {
      self.setState(
        {
          tempModifierModalTotal: 0,
        },
        () => {
          var tempCartData = self.state.cartData;
          if (tempCartData.length > 0) {
            tempCartData.map((tcdItem, index) => {
              if (tcdItem.itemInCartFlag == false) {
                tempCartData.splice(index, 1);
              }
            });
            self.setState(
              {
                cartData: tempCartData,
              },
              () => {
                modifierGroupsArray = []; //Flushing global modifierGroupsArray varible.
                smartModifiersArray = []; //Flushing global smartModifiersArray varible.
              }
            );
          }
        }
      );
      //Flush.

      //Form Reset.
      jQuery(".fnbmodifierModal .fnbmmRowwrap .fnbmmrwRows ul li .itemCounter .form-control").val(0);
      jQuery(".fnbmodifierModal .fnbmmRowwrap .fnbmmrwRows ul li .itemCounter.icZero").addClass("iczActive");
      jQuery(".fnbmodifierModal .fnbmmRowwrap .fnbmmrwRows ul li .itemCounter.icZero .icControl.iccDecrement").addClass("disabled");
      jQuery(".fnbmodifierModal .fnbmmRowwrap .fnbmmrwRows ul li .customCheckbox input, .fnbmodifierModal .fnbmmRowwrap .fnbmmrwRows ul li .customRadio input").prop("checked", false);
      var fcEle = document.getElementById("modalFnbModifierQuantity");
      fcEle.value = 1;
      var CounterEle = document.getElementById("modalFnbItemQuantity");
      CounterEle.querySelector(".itemCounter.icLarge .icControl.iccDecrement").classList.add("disabled");
      //Resetting ItemCounter & Checkbox.
      jQuery(".fnbmodifierModal .modal-body .fnbmmRowwrap .fnbmmrwRows ul li").each(() => {
        //Item Counters
        var modifierItemcounters = jQuery(this).find(".itemCounter:not(.icLarge)");
        ////console.log("modifierItemcounters.length: " + modifierItemcounters.length);
        if (modifierItemcounters.length > 0) {
          modifierItemcounters.find("input[type=text]").val(0);
          modifierItemcounters.find(".icControl.iccIncrement").removeClass("disabled");
        }
        //Checkbox
        var modifierCheckbox = jQuery(this).find(".customCheckbox");
        if (modifierCheckbox.length > 0) {
          modifierCheckbox.find("input[type=checkbox]").removeAttr("disabled");
        }
      });
      // var itemCountersAll = document.querySelectorAll(".fnbmodifierModal .modal-body .fnbmmRowwrap .fnbmmrwRows ul li .itemCounter");
      // //console.log("itemCountersAll.length: " + itemCountersAll.length);
      // for (var a = 0; a < itemCountersAll.length; a++) {
      //   document.querySelector(".fnbmodifierModal .modal-body .fnbmmRowwrap .fnbmmrwRows ul li:nth-child(" + a + ") .itemCounter input[type=text]").value = 0;
      //   document.querySelector(".fnbmodifierModal .modal-body .fnbmmRowwrap .fnbmmrwRows ul li:nth-child(" + a + ") .itemCounter .icControl.iccIncrement").classList.remove("disabled");
      //   //a[0].querySelector("input[type=text]").value = 0;
      //   //a[0].querySelector(".icControl.iccIncrement").classList.remove("disabled");
      // }
    });

    //RepeatItem Modal data flush.
    //var modifierModalEle = document.getElementById("modalFnbModifier");
    // modifierModalEle.addEventListener("hidden.bs.modal", function (event) {
    //   self.fnbmodifierBodyheight();
    // });

    //Extras Member Login.
    ////var modifierModalEle = document.getElementById("membersLogin");
    ////var memberLoginEle = document.getElementById("membersLogin");memberLoginEle
    memberLoginEle.addEventListener("hidden.bs.modal", function (event) {
      //document.getElementById("membersLogin").getElementsByClassNametsByName('form-control').value = "";
      jQuery("#membersLogin .form-control").val("");
    });

    /* Jquery Window Load & Resize */
    jQuery(window).on("load resize", function () {
      //Space Calculation: to fix last(active) & its previous(focus) different classes.
      if (
        jQuery(".pcpFnbblock .pcpfnbCategory ul li:not('.animateLi')").length > 0 &&
        jQuery(".pcpFnbblock .pcpfnbCategorylist > ul > li").length > 0 &&
        jQuery(".pcpFnbblock .pcpfnbCategory ul li:not('.animateLi')").length == jQuery(".pcpFnbblock .pcpfnbCategorylist > ul > li").length
      ) {
        //////////console.log("asdfasdf");
        setTimeout(function () {
          self.bottomSpacecalculation();
        }, 1000);
      }
    });
    /* Jquery Window Load & Resize */
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
          self.bottomSpacecalculation();
        }, 1000);
      }
    });
    /* Jquery Window Load & Scroll */
    jQuery(window).on("load scroll", function () {
      //Header Sticky
      if (jQuery("header.pageHeader").length > 0 && !jQuery("body").hasClass("noStickyHeader")) {
        var stopVal = jQuery(this).scrollTop();
        if (stopVal > 0) {
          jQuery("body").addClass("phSticky");
        } else {
          jQuery("body").removeClass("phSticky");
        }
      }
    });
    /* Jquery Window Load, Resize & Scroll */
    jQuery(window).on("load resize scroll", function () {
      //////console.log("Jquery Window Load, Resize & Scroll");
      /* Right Column - Sticky & mcustomScrollbar initialize/destroy */
      if (jQuery(".pcPanel .pcpBody .pcpbInner .pcpbiColswrap .pcpbiCols.pcpbiColleft").length > 0 && jQuery(".pcPanel .pcpBody .pcpbInner .pcpbiColswrap .pcpbiCols.pcpbiColright").length > 0) {
        var lftColheight = jQuery(".pcPanel .pcpBody .pcpbInner .pcpbiColswrap .pcpbiCols.pcpbiColleft").outerHeight(true);
        var rgtColheight = jQuery(".pcPanel .pcpBody .pcpbInner .pcpbiColswrap .pcpbiCols.pcpbiColright").outerHeight(true);

        /*Left Column height less than right column height*/
        if (rgtColheight > lftColheight && jQuery(window).width() > 992) {
          var wnwHeight = jQuery(window).height();
          var hdrHeight = jQuery(".pageHeader").outerHeight(true);
          hdrHeight = 0; //***Option to remove fixed header.
          var ftrHeight = jQuery(".pageFooter").outerHeight(true);
          var calmrgbtm = parseInt(wnwHeight - (hdrHeight + lftColheight + ftrHeight + 20));
          if (calmrgbtm >= 0) {
            jQuery(".pcPanel .pcpBody .pcpbInner .pcpbiColswrap .pcpbiCols.pcpbiColleft").css("margin-bottom", calmrgbtm);
            jQuery(".pcPanel .pcpBody .pcpbInner .pcpbiColswrap .pcpbiCols.pcpbiColright").css("min-height", wnwHeight - (hdrHeight + ftrHeight));
          } else {
            jQuery(".pcPanel .pcpBody .pcpbInner .pcpbiColswrap .pcpbiCols.pcpbiColleft").css("margin-bottom", "");
            jQuery(".pcPanel .pcpBody .pcpbInner .pcpbiColswrap .pcpbiCols.pcpbiColright").css("min-height", "");
          }
        } else {
          jQuery(".pcPanel .pcpBody .pcpbInner .pcpbiColswrap .pcpbiCols.pcpbiColleft").css("margin-bottom", "");
          jQuery(".pcPanel .pcpBody .pcpbInner .pcpbiColswrap .pcpbiCols.pcpbiColright").css("min-height", "");
        }
        /*E.O. Left Column height less than right column height*/

        var stopVal = jQuery(this).scrollTop();
        var fnbpost = jQuery(".pcPanel .pcpBody .pcpbInner .pcpbiColswrap .pcpbiCols.pcpbiColright").offset().top;
        var hHeight = jQuery(".pageHeader").outerHeight(true);
        hHeight = 0; //***Option to remove fixed header.
        var tHeight = jQuery("#pcpfnbCategorywrapper").length > 0 ? jQuery("#pcpfnbCategorywrapper").outerHeight(true) : 0;

        var caltrgt = parseInt(fnbpost - hHeight - tHeight);
        var topGutr = 0; //padding-top value of --> .pcPanel .pcpBody .pcpbInner .pcpbiColswrap .pcpbiCols.pcpbiColright:not(.sticky) .pcpbicrInner.
        if (jQuery(window).width() > 992) {
          topGutr = 10;
        } else if (jQuery(window).width() > 1200) {
          topGutr = 10;
          topGutr = 15;
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
        if (jQuery(window).width() > 992 && stopVal > caltrgt) {
          jQuery(".pcPanel .pcpBody .pcpbInner .pcpbiColswrap .pcpbiCols.pcpbiColright").addClass("sticky");
          jQuery(".pcPanel .pcpBody .pcpbInner .pcpbiColswrap .pcpbiCols.pcpbiColright .pcpbicrInner").css({
            "padding-top": parseInt(hHeight + tHeight + topGutr + 10),
            right: cuepdlft,
          });
          jQuery(".pcpCart").css("height", cartHeight);

          //Inner Scroll For Items List.
          if (jQuery(".pcpCart.pcpCartfull .pcpBookingsummary .pcpbsInner .pcpbsContainer").length > 0) {
            var rbsPadtop = parseInt(jQuery(".pcpCart.pcpCartfull .roundBoxshadowed").css("padding-top"));
            var rbsH3hgt = jQuery(".pcpCart.pcpCartfull h3").outerHeight(true);
            var rbsTtlstr = jQuery(".pcpCart .pcpBookingsummary .pcpbsInner .pcpbsTotalstrap").outerHeight(true);
            var savingsHeight =
              jQuery(".pcpCart .pcpBookingsummary .pcpbsInner .pcpbsTotalstrap + .pcpbsContainer").length > 0
                ? jQuery(".pcpCart .pcpBookingsummary .pcpbsInner .pcpbsTotalstrap + .pcpbsContainer").outerHeight(true)
                : 0; //Newly added.

            //var mcsbHeight = parseInt(cartHeight - rbsPadtop * 2 - rbsH3hgt - rbsTtlstr);
            var mcsbHeight = parseInt(cartHeight - rbsPadtop * 2 - rbsH3hgt - rbsTtlstr - savingsHeight - topGutr * 2);
            jQuery(".pcpCart.pcpCartfull .pcpBookingsummary .pcpbsInner .pcpbsContainer").css("max-height", mcsbHeight);
            // jQuery(
            //   ".pcpCart.pcpCartfull .pcpBookingsummary .pcpbsInner .pcpbsContainer"
            // ).mCustomScrollbar("update");
          }
        } else {
          jQuery(".pcPanel .pcpBody .pcpbInner .pcpbiColswrap .pcpbiCols.pcpbiColright").removeClass("sticky");
          jQuery(".pcPanel .pcpBody .pcpbInner .pcpbiColswrap .pcpbiCols.pcpbiColright .pcpbicrInner").css({
            "padding-top": "",
            right: "",
          });
          jQuery(".pcpCart").css("height", "");

          //Inner Scroll For Items List.
          if (jQuery(".pcpCart.pcpCartfull .pcpBookingsummary .pcpbsInner .pcpbsContainer").length > 0) {
            jQuery(".pcpCart.pcpCartfull .pcpBookingsummary .pcpbsInner .pcpbsContainer").css("max-height", "");
            // jQuery(
            //   ".pcpCart.pcpCartfull .pcpBookingsummary .pcpbsInner .pcpbsContainer"
            // ).mCustomScrollbar("update");
          }
        }
      }
    });

    window.onpopstate = (e) => {
      e.preventDefault();
      if (localStorage.getItem("bookingURL") !== null && window.location.href.endsWith(localStorage.getItem("bookingURL"))) {
        this.props.navigate(localStorage.getItem("bookingURL"));
        window.location.reload();
      } else {
        if (window.location.href.endsWith("/")) {
          this.props.navigate("/");
          window.location.reload();
        }
      }
    };

    //URL > debug_locations
    const params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop) => searchParams.get(prop),
    });
    if (params.debug_locations != null) {
      this.setState(
        {
          debugLocationsURL: "?debug_locations=" + params.debug_locations,
          debugLocationsCinemaIDs: params.debug_locations.split(","),
        },
        () => {
          // console.log("Routing > componentDidMound() > URL > debug_locations");
          // console.log("this.state.debugLocationsCinemaIDs");
          // console.log(this.state.debugLocationsCinemaIDs);
        }
      );
    }
  };

  componentWillUnmount = () => {
    document.body.removeEventListener("click", (event) => this.handleLocationDropdownCollapse(event));
  };

  setSeatNumberMandatory = (value) => {
    this.setState({
      seatNumberMandatory: value,
    });
  };

  clearAllItemsInCart = () => {
    var self = this;
    Swal.fire({
      title: "Clear cart?",
      text: "Are you sure you want to clear all the items in your cart ?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "No",
      confirmButtonText: "Yes",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.setState(
          {
            cartData: [],
            createOrderData: {},
            fnbItemModifierData: "",
            orderId: "",
            selectDetailsProceed: true,
            selectedInseatDeliverSlot: "",
            selectedInseatDeliverSlotId: "",
          },
          () => {
            this.props.navigate("/fnbmenu");
            //Remove RedeemedGiftCard if redeemed.
            if (this.state.redeemedGiftcards.length > 0) {
              this.state.redeemedGiftcards[0].orders_paymenttypes.map((optItem) => {
                if (optItem.type == "giftcard") {
                  this.removeRedemeedGiftcard(optItem.cardinformation.cardNumber);
                }
              });
            }
            self.loadStateData();
          }
        );
      }
    });
  };

  logoutUser = () => {
    this.handleLoader(true);
    //////console.log("Routing > logoutUser()");
    document.cookie = "accessToken=''";
    document.cookie = "refreshToken=;max-age=0";
    document.cookie = "firstname=;max-age=0";
    document.cookie = "lastname=;max-age=0";
    document.cookie = "loggedin=false;max-age=0";
    var stateData = JSON.parse(localStorage.getItem("stateData"));
    stateData.afterLoginToken = {};
    stateData.memberLogin = false;
    localStorage.setItem("stateData", JSON.stringify(stateData));
    let createOrderData = this.state.createOrderData;
    createOrderData.firstname =
      this.state.bookingInfo && Object.keys(this.state.bookingInfo).length !== 0 && this.state.bookingInfo.fullname != "" ? this.state.bookingInfo.fullname.split(" ")[0] : "";
    createOrderData.lastname = this.state.bookingInfo && Object.keys(this.state.bookingInfo).length !== 0 && this.state.bookingInfo.fullname != "" ? this.state.bookingInfo.fullname.split(" ")[1] : "";
    createOrderData.fullname = this.state.bookingInfo && Object.keys(this.state.bookingInfo).length !== 0 && this.state.bookingInfo.fullname != "" ? this.state.bookingInfo.fullname : "";
    createOrderData.phonenumber = this.state.bookingInfo && Object.keys(this.state.bookingInfo).length !== 0 && this.state.bookingInfo.phonenumber != "" ? this.state.bookingInfo.phonenumber : "";
    createOrderData.email = this.state.bookingInfo && Object.keys(this.state.bookingInfo).length !== 0 && this.state.bookingInfo.email != "" ? this.state.bookingInfo.email : "";
    this.setState(
      {
        createOrderData,
        fnbMenuItems: [],
        deals: [],
      },
      () => {
        this.setMemberLoginState(false);
        var cinemaId = Object.keys(this.state.normalBookingInfoSelected).length !== 0 ? this.state.normalBookingInfoSelected.locationId : this.state.bookingInfo.cinema.cinemas_locations[0].pid;
        //var sessionId = Object.keys(this.state.normalBookingInfoSelected).length !== 0 ? this.state.normalBookingInfoSelected.sessionId : this.state.bookingInfo.sessionid;
        /* 
        //For Sessionid from this.state.bookingInfo/this.state.normalBookingInfoSelected:
          #1) Movie booking flow => this.state.bookingInfo.sessionid 
          #2) Seat QR Scan flow => this.state.bookingInfo.id 
          #3) Manual selection flow => this.state.normalBookingInfoSelected.sessionId
        */
        var sessionId =
          Object.keys(this.state.normalBookingInfoSelected).length !== 0
            ? this.state.normalBookingInfoSelected.sessionId
            : Object.keys(this.state.bookingInfo).length !== 0
            ? this.state.bookingInfo.sessionid
              ? this.state.bookingInfo.sessionid
              : this.state.bookingInfo.id
            : "";
        this.getMenuItems(cinemaId, sessionId);
        if (constant.today_deals) {
          this.getDeals(cinemaId);
        }
      }
    );
  };

  deleteItemFromCart = (index) => {
    let cartData = this.state.cartData;
    cartData.splice(index, 1);
    let createOrderData = this.state.createOrderData;
    createOrderData.fnb = cartData;
    this.setState({ cartData, createOrderData }, () => {
      this.loadStateData();
      //Remove Redemeed Giftcard.
      if (this.state.cartData.length == 0 && this.state.redeemedGiftcards.length > 0) {
        var redemeedGiftcard = "";
        //this.state.redeemedGiftcards.map((giftcartItem) => {
        if (this.state.redeemedGiftcards[0].orders_paymenttypes.length > 0) {
          this.state.redeemedGiftcards[0].orders_paymenttypes.map((ptItem) => {
            if (ptItem.type == "giftcard") {
              redemeedGiftcard = ptItem.cardinformation.cardNumber;
            }
          });
        }
        //});
        console.log("redemeedGiftcard: " + redemeedGiftcard);
        if (redemeedGiftcard != "") {
          this.removeRedemeedGiftcard(redemeedGiftcard);
        }
      }
    });
  };
  checkIfUserLoggedin = () => {
    var loggedInValue = API.getValueFromCookie("loggedin");
    if (loggedInValue) {
      this.setMemberLoginState(true);
      var afterLoginToken = new Object();
      afterLoginToken.firstname = API.getValueFromCookie("firstname");
      afterLoginToken.lastname = API.getValueFromCookie("lastname");
      this.setState({
        afterLoginToken: { ...this.state.afterLoginToken, ...afterLoginToken },
      });
    } else {
      ////console.log("user logged out");
    }
  };

  getBookingInfo = () => {
    ////////console.log("Routing > getBookingInfo()");
    const params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop) => searchParams.get(prop),
    });
    //bookingLocation: {},
    //bookingId: "",
    // var cinemaId = this.state.bookingLocation.cinemaid;
    // var bookingId = this.state.bookingId;
    var paramBookingId = params.bookingid != null ? params.bookingid : this.state.bookingId;
    //var blCinemaId = Object.keys(this.state.bookingLocation).length !== 0 ? this.state.bookingLocation.cinemaId : "";
    //var paramCinemaId = params.cinemaid != null && blCinemaId == "" ? params.cinemaid : this.state.bookingLocation.cinemaid;
    var paramCinemaId = params.cinemaid != null ? params.cinemaid : this.state.bookingLocation.cinemaid;
    //if (params.cinema != null && typeof paramCinemaId === "undefined") {
    if (params.bookingid != null && params.cinemaid == null && params.cinema != null) {
      var cinemaIndex = this.state.locations.findIndex((x) => x.cinemas_attributes[0].name == params.cinema);
      if (cinemaIndex != -1) {
        paramCinemaId = this.state.locations[cinemaIndex].cinemaid;
      }
    }
    this.setState({ bookingId: paramBookingId });
    if (params.bookingid != null) {
      localStorage.setItem("bookingURL", "/?bookingid=" + paramBookingId + "&cinemaid=" + paramCinemaId, "");
    }
    API.callEndpoint("GET", "Bearer", "order/v1/bookings/ticketing?bookingid=" + paramBookingId + "&cinemaid=" + paramCinemaId, "")
      .then((response) => {
        let createOrderData = this.state.createOrderData;
        try {
          createOrderData.firstname = response.data.firstname;
          createOrderData.lastname = response.data.lastname;
          createOrderData.fullname = response.data.fullname;
          createOrderData.email = response.data.email;
          createOrderData.phonenumber = response.data.phonenumber;
        } catch (e) {
          console.log(e);
        }

        //Check Location Enabled
        var isLocationEnabled = constant.locationsToShow.findIndex((x) => x == paramCinemaId);
        // console.log("isLocationEnabled: " + isLocationEnabled);
        if (isLocationEnabled == -1) {
          jQuery(".pcpfnbConfirmbooking[data-id='withBookingId']").slideUp(function () {
            setTimeout(() => {
              jQuery(".pcpfnbConfirmbooking#locationComingSoonBlock").slideDown();
            }, 200);
          });
        }

        this.setState(
          {
            createOrderData,
            bookingInfo: {
              ...response.data,
              bookingid: paramBookingId,

              cinemaid: paramCinemaId,
            },
            bookingURLCinemaId: isLocationEnabled != -1 ? paramCinemaId : "",
          },
          () => {
            if (Object.keys(this.state.bookingLocation).length !== 0 && this.state.bookingId != "" && this.state.bookingURLCinemaId != "") {
              jQuery(".pcpfnbConfirmbooking[data-id='withoutBookingId']").slideUp(function () {
                setTimeout(() => {
                  jQuery(".pcpfnbConfirmbooking[data-id='withBookingId']").slideDown();
                }, 200);
              });
            }
            if (Object.keys(this.state.bookingInfo).length !== 0 && this.state.bookingURLCinemaId != "") {
              ////////console.log("componentDidUpdate() >>> Object Keys > 0: ");
              var cinemaId = this.state.bookingInfo.cinema.cinemas_locations[0].pid;
              var sessionId = this.state.bookingInfo.sessionid;
              this.getMenuItems(cinemaId, sessionId);
              if (constant.today_deals) {
                this.getDeals(cinemaId);
              }
            }
            this.handleLoader(false);
          }
        );
      })
      .catch((ex) => {
        this.handleLoader(false);
        Swal.fire({
          title: "Sorry",
          icon: "error",
          text: `${
            ex.error === '500 - "Booking details not found. error -> Cannot find booking with specified identifiers."'
              ? "The specified booking ID cannot be found. We apologize for the inconvenience."
              : ex.error
          } `,
          width: 600,
          heightAuto: true,
          padding: "30",
          confirmButtonText: "Proceed to order",
          confirmButtonColor: "#B32E34",
        }).then((result) => {
          this.setState(
            {
              bookingIdError: true,
            },
            () => {
              this.handleLoader(false);
            }
          );
          window.location.href = window.location.origin;
        });
      });
  };

  //Get F&B Menu Items.
  getMenuItems = (cinemaId, sessionId) => {
    //////console.log("Routing > getMenuItems()");
    API.callEndpoint("GET", "Bearer", "cms/v1/fnbtabs/v2?cinemaid=" + cinemaId + "&sessionid=" + sessionId + "", "")
      .then((response) => {
        this.setState(
          {
            fnbMenuItems: response.data,
          },
          () => {
            var isLoggedin = API.getValueFromCookie("loggedin");
            /* Checking Extras Members. */
            var tempFnbData = this.state.fnbMenuItems;
            var negativestrikeprice = 0;
            tempFnbData.map((fnbMenu) => {
              if (fnbMenu.fnbtabs_items.length > 0) {
                fnbMenu.fnbtabs_items.map((fnbItem) => {
                  var isDealItem = this.state.deals.findIndex((x) => fnbItem.id == x.id);
                  if (isDealItem == -1) {
                    negativestrikeprice = negativestrikeprice + parseInt(fnbItem.strikeprice == -1 ? 1 : 0);
                  } else {
                    //////console.log("fnbItem.id: " + fnbItem.id);
                    //////console.log("isDealItem: " + isDealItem);
                  }
                });
              }
            });
            console.log(
              "negativestrikeprice: negativestrikeprice: negativestrikeprice: negativestrikeprice: negativestrikeprice: negativestrikeprice: negativestrikeprice: negativestrikeprice: negativestrikeprice: negativestrikeprice: negativestrikeprice: negativestrikeprice: "
            );
            console.log("negativestrikeprice: " + negativestrikeprice);
            this.setState(
              {
                isExtraPlusMember: negativestrikeprice == 0 ? true : false,
              },
              () => {
                console.log("--------------->>>>> isExtraPlusMember" + this.state.isExtraPlusMember);
              }
            );
            /* E.O.Checking Extras Members. */

            if (this.state.deals.length == 0) {
              //////console.log("0");
              var stateData = JSON.parse(localStorage.getItem("stateData"));
              stateData.fnbMenuItems = this.state.fnbMenuItems;
              localStorage.setItem("stateData", JSON.stringify(stateData));
              if (typeof isLoggedin != "undefined" && isLoggedin != null && isLoggedin) {
                //////console.log("0 0");
                this.afterLoginUpdateCart();
              } else {
                //////console.log("0 1");
                //// this.state.cartData.map((cartItem, index) => {
                ////   var cartItemId = cartItem.id;
                ////   this.state.fnbMenuItems.map((fnbMenuItem) => {
                ////     fnbMenuItem.fnbtabs_items.map((fnbItem) => {
                ////       if (cartItemId == fnbItem.id) {
                ////         this.state.cartData[index].strikeprice = fnbItem.strikeprice;
                ////         this.state.cartData[index].strikeValueBeforeTax = fnbItem.strikeValueBeforeTax;
                ////         this.state.cartData[index].strikeTaxValue = fnbItem.strikeTaxValue;
                ////       }
                ////     });
                ////   });
                //// });
                var tCartdata = this.state.cartData;
                tCartdata.map((cartItem, index) => {
                  var cartItemId = cartItem.id;
                  this.state.fnbMenuItems.map((fnbMenuItem) => {
                    fnbMenuItem.fnbtabs_items.map((fnbItem) => {
                      if (cartItem.dealItem == false) {
                        if (cartItemId == fnbItem.id) {
                          tCartdata[index].strikeprice = fnbItem.strikeprice;
                          tCartdata[index].strikeValueBeforeTax = fnbItem.strikeValueBeforeTax;
                          tCartdata[index].strikeTaxValue = fnbItem.strikeTaxValue;
                        } else {
                          var fnbAlternateItems = fnbItem.fnbs_alternateitems;
                          if (fnbAlternateItems && fnbAlternateItems.length > 0) {
                            var altItemIndex = fnbAlternateItems.findIndex((x) => x.id == cartItemId);
                            console.log("altItemIndex: " + altItemIndex);
                            if (altItemIndex != -1) {
                              //fnbItemIndex = index;
                              //console.log("fnbItemIndex: " + fnbItemIndex);
                              //tcdItem.strikeprice = fnbMenuItems[menuTabIndex].fnbtabs_items[fnbItemIndex].fnbs_alternateitems[altItemIndex].strikeprice;
                              tCartdata[index].strikeprice = fnbItem.strikeprice;
                              tCartdata[index].strikeValueBeforeTax = fnbItem.strikeValueBeforeTax;
                              tCartdata[index].strikeTaxValue = fnbItem.strikeTaxValue;
                            }
                          }
                        }
                      }
                    });
                  });
                });
                this.setState(
                  {
                    cartData: tCartdata,
                  },
                  () => {
                    //////console.log("0 1 CartData Update.");
                  }
                );
              }
            } else {
              //////console.log("1");
              this.state.deals.map((dealItem) => {
                var dealItemId = dealItem.id;
                var fnbMenuItems = this.state.fnbMenuItems;
                fnbMenuItems.map((fnbMenuItem) => {
                  var index = fnbMenuItem.fnbtabs_items.findIndex((x) => x.id == dealItemId);
                  if (index != -1) {
                    fnbMenuItem.fnbtabs_items.splice(0, 0, fnbMenuItem.fnbtabs_items.splice(index, 1)[0]);
                  }
                });
                this.setState(
                  {
                    fnbMenuItems,
                  },
                  () => {
                    var stateData = JSON.parse(localStorage.getItem("stateData"));
                    stateData.fnbMenuItems = this.state.fnbMenuItems;
                    localStorage.setItem("stateData", JSON.stringify(stateData));
                    //console.log("setting data");
                    if (typeof isLoggedin != "undefined" && isLoggedin != null && isLoggedin) {
                      //////console.log("1 0");
                      this.afterLoginUpdateCart();
                    } else {
                      //////console.log("1 1");
                      //// this.state.cartData.map((cartItem, index) => {
                      ////   var cartItemId = cartItem.id;
                      ////   this.state.fnbMenuItems.map((fnbMenuItem) => {
                      ////     fnbMenuItem.fnbtabs_items.map((fnbItem) => {
                      ////       if (cartItemId == fnbItem.id) {
                      ////         this.state.cartData[index].strikeprice = fnbItem.strikeprice;
                      ////         this.state.cartData[index].strikeValueBeforeTax = fnbItem.strikeValueBeforeTax;
                      ////         this.state.cartData[index].strikeTaxValue = fnbItem.strikeTaxValue;
                      ////       }
                      ////     });
                      ////   });
                      //// });
                      var tCartdata = this.state.cartData;
                      tCartdata.map((cartItem, index) => {
                        var cartItemId = cartItem.id;
                        this.state.fnbMenuItems.map((fnbMenuItem) => {
                          fnbMenuItem.fnbtabs_items.map((fnbItem) => {
                            if (cartItemId == fnbItem.id && cartItem.dealItem == false) {
                              tCartdata[index].strikeprice = fnbItem.strikeprice;
                              tCartdata[index].strikeValueBeforeTax = fnbItem.strikeValueBeforeTax;
                              tCartdata[index].strikeTaxValue = fnbItem.strikeTaxValue;
                            }
                          });
                        });
                      });
                      this.setState(
                        {
                          cartData: tCartdata,
                        },
                        () => {
                          //////console.log("1 1 CartData Update.");
                        }
                      );
                    }
                  }
                );
              });
            }
            this.handleLoader(false);
          }
        );
      })
      .catch((ex) => {
        ////////console.log("Error: getMenuItems()");
        ////////console.log(ex);
      });
  };

  //Get Locations List.
  getLocations = () => {
    ////////console.log("Routing > getLocations()");
    const params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop) => searchParams.get(prop),
    });
    API.callEndpoint("GET", "Bearer", "cms/v1/cinemas", "")
      .then((response) => {
        //////////console.log(response.data);
        this.setState(
          {
            locations: response.data,
          },
          () => {
            if (params.bookingid != null && params.cinemaid != null && params.screennumber == null && params.seatrow == null && params.seatnumber == null) {
              //console.log("inside if");
              this.getBookingInfo();
            } else if (params.bookingid != null && params.cinemaid == null && params.cinema != null && params.screennumber == null && params.seatrow == null && params.seatnumber == null) {
              //console.log("inside else if 1");
              this.getBookingInfo();
            } else if (params.bookingid == null && params.cinemaid != null && params.screennumber == null && params.seatrow == null && params.seatnumber == null) {
              //console.log("inside else if 2");
              this.setState({
                bookingIdSection: "withoutBookingId",
              });
              // jQuery(".pcpfnbConfirmbooking[data-id='withBookingId']").hide();
              // jQuery(".pcpfnbConfirmbooking[data-id='withoutBookingId']").fadeIn();
            } else if (params.cinemaid != null && params.screennumber != null && params.seatrow != null && params.seatnumber != null) {
              //console.log("inside else if 3");
              this.handleQrScanFromSeat();
            } else {
              //console.log("inside else");
              this.setState({
                bookingIdSection: "withoutBookingId",
              });
              // jQuery(".pcpfnbConfirmbooking[data-id='withBookingId']").hide();
              // jQuery(".pcpfnbConfirmbooking[data-id='withoutBookingId']").fadeIn();
            }
          }
        );
      })
      .catch((ex) => {
        ////////console.log("Error: getLocations()");
        ////////console.log(ex);
      });
  };

  //Get Dates.
  getDates = (cinemaId) => {
    ////////console.log("Routing > getDates()");
    this.setState(
      {
        dates: [],
      },
      () => {
        var gdUrl = cinemaId && cinemaId != "" ? "cinemas/" + cinemaId + "" : "sessionsbyexperience";
        API.callEndpoint(
          "GET",
          "Bearer",
          //"/cms/v1/sessionsbyexperience/distinctshowdates",
          //"/cms/v1/cinemas/825897fc-9e01-45a7-a7ed-5c69f77b9132/distinctshowdates",
          "/cms/v1/" + gdUrl + "/distinctshowdates",
          ""
        )
          .then((response) => {
            //////////console.log(" ----- getDates ------- ");
            //////////console.log(response.data);
            this.setState({
              dates: response.data,
            });
          })
          .catch((ex) => {
            ////////console.log("Error: getDates()");
            ////////console.log(ex);
          });
      }
    );
  };

  //Get Movies & Showtime.
  getSessionByExperience = (cinemaId, selectedDate) => {
    ////////console.log("Routing > getSessionByExperience()");
    //////////console.log("selectedDate: " + selectedDate);
    var dateValue = selectedDate.split("T");
    this.setState(
      {
        movies: [],
      },
      () => {
        /*API.callEndpoint("GET", "Bearer", "/cms/v1/sessionsbyexperience?cinemaid=" + cinemaId + "&showdate=" + dateValue[0], "") //oldEndPoint|Commented-04052022*/
        /* cms/v1/showtimes?showdate=2022-04-25&cinemaid=db1b00cf-5dca-4e8a-8334-566abb5af4a8&filmid=c0ecdef5-867b-4db2-a4b4-6e2d83579989 //NewEndPoint|Added-04052022*/
        API.callEndpoint("GET", "Bearer", "cms/v1/showtimes?showdate=" + dateValue[0] + "&cinemaid=" + cinemaId, "")
          .then((response) => {
            console.log(" ----- getSessionByExperience ------- ");
            console.log(response.data);
            this.setState(
              {
                movies: response.data,
                updateMovieListFlag: true,
              },
              () => {
                // console.log("movies[0].filmList");
                // console.log(this.state.movies[0].filmList);
                // console.log("movies[0].experienceList");
                // console.log(this.state.movies[0].experienceList);
                // console.log("movies[0].showTimes");
                // console.log(this.state.movies[0].showTimes);
              }
            );
          })
          .catch((ex) => {
            ////////console.log("Error: getSessionByExperience()");
            ////////console.log(ex);
          });
      }
    );
  };

  setMovieListFlag = (mlflag) => {
    ////////console.log("Routing > setMovieListFlag()");
    this.setState({
      updateMovieListFlag: mlflag,
    });
  };

  //Get Deals
  getDeals = (cinemaId) => {
    API.callEndpoint("GET", "Bearer", "cms/v1/deals?cinemaid=" + cinemaId + "", "")
      .then((response) => {
        this.setState(
          {
            deals: response.data,
          },
          () => {
            this.getStaticPromotions();
          }
        );
      })
      .catch((ex) => {});
  };
  reOrderArray = (from, to) => {
    this.splice(to, 0, this.splice(from, 1)[0]);
  };
  //Get Static Promotions
  getStaticPromotions = (cinemaId) => {
    API.callEndpoint("GET", "Bearer", "/promo/v1/promotions", "")
      .then((response) => {
        this.setState({
          staticPromotions: response.data,
        });
      })
      .catch((ex) => {
        ////////console.log(ex);
      });
  };

  //Friday Specials > Slick
  handleFridaySpecialsSlick = () => {
    ////////console.log("Routing > handleFridaySpecialsSlick()");
    if (jQuery("#specialsWrapper").hasClass("slick-initialized")) {
      jQuery("#specialsWrapper").slick("setPosition");
      //////////console.log("handleFridaySpecialsSlick() >>> Slick setPosition");
    } else {
      //////////console.log("handleFridaySpecialsSlick() >>> Slick init");
      //jQuery(".specialsStrap .ssCols#specialsWrapper").not(".slick-initialized")
      jQuery("#specialsWrapper").slick({
        //dots: true,
        //infinite: false,
        speed: 800,
        slidesToShow: 3,
        slidesToScroll: 3,
        responsive: [
          {
            breakpoint: 1200,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2,
            },
          },
          {
            breakpoint: 992,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
            },
          },
        ],
      });
    }
  };

  handleLoader = (loaderState) => {
    this.setState(
      {
        loaderToggle: loaderState,
      },
      () => {
        this.loadStateData();
      }
    );
  };

  setMemberLoginState = (stateFlag) => {
    if (stateFlag === false) {
      jQuery("#switchMemberPricing").prop("disabled", false).prop("checked", false);
      this.setState({
        afterLoginToken: {},
      });
    } else {
      jQuery("#switchMemberPricing").prop("checked", true).prop("disabled", true);
    }
    this.setState({
      memberLogin: stateFlag,
    });
  };

  handleConfirmBooking = (cbFlag) => {
    this.setState({
      confirmBooking: cbFlag,
    });
  };

  handlePaymentFlow = (pfFlag) => {
    ////////console.log("Routing > handlePaymentFlow()");
    this.setState({
      pwPaymentflow: pfFlag,
    });
  };

  handleShowHomeIcon = (shiFlag) => {
    ////////console.log("Routing > handleShowHomeIcon()");
    this.setState({
      showHomeIcon: shiFlag,
    });
  };

  handleshowHomeIconInLandingpage = (flag) => {
    this.setState({
      showHomeIconInLandingpage: flag,
    });
  };

  fnbmodifierBodyheight = () => {
    ////////console.log("Routing > fnbmodifierBodyheight()");
    //////////console.log("fnbmodifierBodyheight");
    //var fnbModifier = jQuery("#fnbmodifierModal");
    var fnbModifier = jQuery("#modalFnbModifier");

    /*var trgele = fnbModifier.find(".modal-body"); Hided01102020*/
    var trgele = fnbModifier.find(".osbWrap");
    //////////console.log("fnbModifier.length: " + fnbModifier.length);
    //////////console.log("trgele.length: " + trgele.length);

    /* Overlay Scrollbar*/
    if (fnbModifier.length > 0 && trgele.length > 0) {
      // Overlayscrlbar = trgele
      //   .overlayScrollbars({
      //     paddingAbsolute: true,
      //     autoUpdate: true,
      //     scrollbars: {
      //       clickScrolling: true,
      //     },
      //   })
      //   .overlayScrollbars();

      //Elements
      var devWidth = jQuery(window).width();
      var devHeight = jQuery(window).height();
      var modalDialog = fnbModifier.find(".modal-dialog");
      var modalContent = fnbModifier.find(".modal-content");
      var modalHeader = fnbModifier.find(".modal-header");

      var modalBody = fnbModifier.find(".osbWrap");
      var modalFooter = fnbModifier.find(".modal-footer");

      modalBody.css("max-height", "");
      setTimeout(function () {
        //Elements - Getting Values
        var mdMtop = modalDialog.css("margin-top");
        var mcHeight = modalContent.outerHeight(true);
        var mdmcHeight = parseInt(parseInt(mdMtop) * 2 + mcHeight);
        var mhHeight = modalHeader.outerHeight(true);
        var mhFooter = modalFooter.outerHeight(true);
        var mbCalhgt = parseInt(devHeight - (parseInt(mdMtop) * 2 + mhFooter));
        //////////console.log("devHeight: " + devHeight);
        //////////console.log("mdMtop*2: " + parseInt(mdMtop) * 2);
        //////////console.log("mhFooter: " + mhFooter);
        //////////console.log("mbCalhgt: " + mbCalhgt);

        if (devHeight >= 480) {
          modalBody.css("max-height", mbCalhgt);
        } else {
          modalBody.css("max-height", "");
        }
        // if (Overlayscrlbar instanceof OverlayScrollbars) {
        //   /* instance is indeed a OverlayScrollbars instance */
        //   Overlayscrlbar.update();
        // }
        //}, 800);
      }, 0);
    }
  };

  bottomSpacecalculation = () => {
    ////////console.log("Routing > bottomSpacecalculation()");
    var wnwHeight = jQuery(window).outerHeight(true);
    var hdrHeight = jQuery(".pageHeader").outerHeight(true);
    hdrHeight = 0; //***Option to remove fixed header.
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
    //////////console.log("calSpace: " + calSpace);
    if (calSpace >= 0) {
      tbCntlast.css("margin-bottom", calSpace);
    } else {
      tbCntlast.css("margin-bottom", "");
    }
  };

  /* Footer - Sticky to bottom */
  handleFooterSticky = () => {
    ////////console.log("Routing > handleFooterSticky()");
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
  };
  /* Location Dropdown - Toggle */
  handleLocationDropdown = (e) => {
    ////////console.log("Routing > handleLocationDropdown()");
    //////////console.log(e.target);
    var targetElement = e.target;
    jQuery("body").toggleClass("pcplDropdown-open");
    jQuery(targetElement).parents(".pcplDropdown").toggleClass("open");
    jQuery(targetElement).parents(".pcplDropdown").find(".pcplddBody").slideToggle();
  };
  //Location dropdown close > when click outside
  handleLocationDropdownCollapse = (event) => {
    if (jQuery("body").hasClass("pcplDropdown-open") && jQuery(".pcpLocation .pcplDropdown").hasClass("open")) {
      var $trigger = jQuery(".pcpLocation .pcplDropdown");
      if ($trigger !== event.target && !$trigger.has(event.target).length) {
        jQuery("body").removeClass("pcplDropdown-open");
        jQuery(".pcpLocation .pcplDropdown").removeClass("open");
        jQuery(".pcpLocation .pcplDropdown .pcplddBody").slideUp();
      }
    }
  };

  //Location dropdown close - On clicking the menu item & Detect my location.
  handleOnchangeLocationDropdown = (event) => {
    ////////console.log("Routing > handleOnchangeLocationDropdown()");
    var curObj = jQuery(event.target);
    var selecterLocation = curObj.text();
    //////////console.log("handleOnchangeLocationDropdown > selecterLocation: "+selecterLocation);
    // this.setState({
    //   selectedLocation: selecterLocation
    // }, () => {
    //   if (
    //     jQuery("body").hasClass("pcplDropdown-open") &&
    //     curObj.parents(".pcplDropdown").hasClass("open")
    //   ) {
    //     jQuery("body").toggleClass("pcplDropdown-open");
    //     curObj.parents(".pcplDropdown").toggleClass("open");
    //     curObj.parents(".pcplDropdown").find(".pcplddBody").slideUp();
    //   }
    // })
    if (jQuery("body").hasClass("pcplDropdown-open") && curObj.parents(".pcplDropdown").hasClass("open")) {
      jQuery("body").toggleClass("pcplDropdown-open");
      curObj.parents(".pcplDropdown").toggleClass("open");
      if (curObj.parent("li").length > 0) {
        curObj.parents(".pcplDropdown").find(".pcplddHead a span").text(selecterLocation);
      }
      curObj.parents(".pcplDropdown").find(".pcplddBody").slideUp();
    }
  };

  handleCategoryTabsUiAnimation = () => {
    ////////console.log("Routing > handleCategoryTabsUiAnimation()");
    /* Category List */
    var tabList = jQuery(".pcpFnbblock .pcpfnbCategory ul li:not(.animateLi)");
    var tabContent = jQuery(".pcpFnbblock .pcpfnbCategorylist > ul > li");
    //////////console.log("tabList: " + tabList.length + " tabContent: " + tabContent.length);
    if (tabList.length > 0 && tabContent.length > 0 && tabList.length == tabContent.length) {
      if (jQuery(".pcpFnbblock .pcpfnbCategory ul li.animateLi").length <= 0) {
        jQuery(".pcpFnbblock .pcpfnbCategory ul").append('<li class="animateLi">&nbsp;</li>');
      }

      var scrollPos = jQuery(window).scrollTop();
      var headerHeight = jQuery(".pageHeader").outerHeight(true);
      headerHeight = 0; //***Option to remove fixed header.
      var tabHeight = jQuery(".pcpFnbblock .pcpfnbCategory").outerHeight(true);
      var tcFirstpos = tabContent.eq(0).offset().top;
      var focusStart = parseInt(tcFirstpos - headerHeight - tabHeight);
      if (scrollPos < focusStart) {
        tabList.removeClass("focus");

        jQuery(".pcpFnbblock .pcpfnbCategory ul li:first-child").addClass("focus");
        setTimeout(function () {
          var eleWidth = jQuery(".pcpFnbblock .pcpfnbCategory ul li:first-child a").outerWidth(true);
          var cpliLeft = jQuery(".pcpFnbblock .pcpfnbCategory ul li:first-child").position().left;
          cpliLeft = cpliLeft + parseInt(jQuery(".pcpFnbblock .pcpfnbCategory ul li:first-child").css("padding-left"));
          jQuery(".pcpFnbblock .pcpfnbCategory ul li.animateLi").css({
            width: eleWidth,
            left: cpliLeft,
          });
        }, 400);
      } else {
        jQuery(".pcpFnbblock .pcpfnbCategorylist > ul > li").each(function () {
          var curli = jQuery(this);
          var curliId = curli.attr("id");
          var curliTop = curli.offset().top;

          //////////console.log(curliTop);
          var hdrHeight = jQuery(".pageHeader").outerHeight(true);
          hdrHeight = 0; //***Option to remove fixed header.
          var tabHeight = jQuery(".pcpFnbblock .pcpfnbCategory").outerHeight(true);
          var curliPos = parseInt(curliTop - hdrHeight - tabHeight - 5);
          //////////console.log(curliPos);

          var curAnchor = jQuery(".pcpFnbblock .pcpfnbCategory ul li a[data-target='#" + curliId + "']");
          var caParentli = curAnchor.parent("li");
          if (curliPos <= scrollPos && parseInt(curliPos + jQuery(this).outerHeight(true)) > scrollPos) {
            setTimeout(function () {
              var caWidth = curAnchor.outerWidth(true);
              var cpliLeft = caParentli.position().left;
              var cpliPleft = parseInt(caParentli.css("padding-left"));
              //////////console.log('Left: '+cpliLeft+" Padding Left: "+cpliPleft);
              cpliLeft = cpliLeft + cpliPleft;
              //////////console.log("Total: "+cpliLeft);
              jQuery(".pcpFnbblock .pcpfnbCategory ul li").removeClass("focus");
              caParentli.addClass("focus");
              jQuery(".pcpFnbblock .pcpfnbCategory ul li.animateLi").css({
                width: caWidth,
                left: cpliLeft,
              });
            }, 400);
            setTimeout(function () {
              //   jQuery(
              //     ".pcpFnbblock .pcpfnbCategory .pcpfnbcInner .mcsbWrapper.mCustomScrollbar"
              //   ).mCustomScrollbar("update");
              //   jQuery(
              //     ".pcpFnbblock .pcpfnbCategory .pcpfnbcInner .mcsbWrapper.mCustomScrollbar"
              //   ).mCustomScrollbar("scrollTo", caParentli);
              jQuery(caParentli)[0].scrollIntoView();
              //}, 500);
            }, 0);
          } else {
            caParentli.removeClass("focus");
          }
        });
      }
    }
  };

  handleOnclickCategoryItem = (e) => {
    ////////console.log("Routing > handleOnclickCategoryItem()");
    //handleOnclickCategoryItem = (e, osRef) => {
    //////////console.log(e.target);
    //////////console.log(osRef.osInstance());
    //var osInstance = osRef.osInstance();
    var curLi = jQuery(e.target).parent("li");
    var curAn = jQuery(e.target);
    var dtAttr = curAn.attr("data-target");
    //////////console.log("dtAttr: " + dtAttr);
    if (typeof dtAttr !== typeof undefined && dtAttr !== false && dtAttr != "") {
      if (!curLi.hasClass("active")) {
        /* Active State Update. */
        curLi.addClass("active");
        var curLileft = curLi.position().left;
        // jQuery(
        //   ".pcpFnbblock .pcpfnbCategory .pcpfnbcInner .mcsbWrapper"
        // ).mCustomScrollbar("scrollTo", curLileft);

        jQuery(curLi)[0].scrollIntoView();
        // jQuery(".pcpFnbblock .pcpfnbCategory .pcpfnbcInner .mcsbWrapper.oshost")
        //   .stop()
        //   .animate(
        //     {
        //       scrollLeft: curLileft,
        //     },
        //     2000
        //   );
        // setTimeout(() => {
        //   jQuery(
        //     ".pcpFnbblock .pcpfnbCategory .pcpfnbcInner .mcsbWrapper.oshost"
        //   ).scrollLeft(curLileft);
        // }, 0);

        /* Scrolltop & Toggle */
        setTimeout(function () {
          jQuery(".pcpFnbblock .pcpfnbCategorylist > ul > li" + dtAttr + "").addClass("active");
          jQuery(".pcpFnbblock .pcpfnbCategorylist > ul > li" + dtAttr + " > .pcpfnbiBox .pcpfnbibBody").slideDown(500);
          // jQuery(
          //   ".pcpFnbblock .pcpfnbCategorylist > ul > li" +
          //     dtAttr +
          //     " .pcpfnbiBox .pcpfnbibHead"
          // ).removeClass("collapsed");
          // // jQuery(
          // //   ".pcpFnbblock .pcpfnbCategorylist > ul > li" +
          // //     dtAttr +
          // //     " > .pcpfnbiBox .pcpfnbibBody"
          // // ).slideDown(function () {
          // //   // jQuery(
          // //   //   ".pcpFnbblock .pcpfnbCategorylist > ul > li" +
          // //   //     dtAttr +
          // //   //     " .pcpfnbiBox .pcpfnbibBody"
          // //   // ).addClass("show");
          // // });
          // jQuery(
          //   ".pcpFnbblock .pcpfnbCategorylist > ul > li" +
          //     dtAttr +
          //     " .pcpfnbiBox .pcpfnbibBody"
          // ).addClass("show");
        }, 750);
      }

      var headerHeight = jQuery(".pageHeader").outerHeight(true);
      headerHeight = 0; //***Option to remove fixed header.
      var catTabheight = jQuery(".pcpFnbblock .pcpfnbCategory").outerHeight(true);
      var targetPadtop = parseInt(jQuery(".pcpFnbblock .pcpfnbCategorylist > ul > li" + dtAttr + "").css("padding-top"));
      var targetPostop = jQuery(".pcpFnbblock .pcpfnbCategorylist > ul > li" + dtAttr + "").offset().top;
      var gutterSpace = jQuery(window).width() > 992 ? targetPadtop - 20 : 0;
      targetPostop = targetPostop + gutterSpace;
      var caltrgScltop = parseInt(targetPostop - (headerHeight + catTabheight));

      // jQuery("html, body").stop().animate({
      //   scrollTop: caltrgScltop,
      // }, 750);
      jQuery("html, body").scrollTop(caltrgScltop);
    }
  };

  handleCategoryThumbOnclick = (e) => {
    ////////console.log("Routing > handleCategoryThumbOnclick()");
    //return false;
    var curAn = jQuery(e.target);
    var curLi = curAn.parents("li");
    //var curAn = jQuery(this);
    var dtAttr = curLi.attr("id");
    var caltrgScltop = "";
    var wnwScrlt = jQuery(window).scrollTop();

    /* Active State Update. */
    jQuery("a[data-target='#" + dtAttr + "']")
      .parent("li")
      .toggleClass("active");
    var curLileft = jQuery("a[data-target='#" + dtAttr + "']")
      .parent("li")
      .position().left;
    // jQuery(
    //   ".pcpFnbblock .pcpfnbCategory .pcpfnbcInner .mcsbWrapper"
    // ).mCustomScrollbar("scrollTo", curLileft);
    jQuery(".pcpFnbblock .pcpfnbCategory ul li a[data-target='#" + dtAttr + "']")
      .parent("li")[0]
      .scrollIntoView();

    /* Scrolltop & Toggle */
    setTimeout(function () {
      var headerHeight = jQuery(".pageHeader").outerHeight(true);
      headerHeight = 0; //***Option to remove fixed header.
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

      // jQuery("html, body").stop().animate(
      //   {
      //     scrollTop: caltrgScltop,
      //   },
      //   750
      // );
      jQuery("html, body").scrollTop(caltrgScltop);

      if (caltrgScltop != "" && wnwScrlt == caltrgScltop) {
        //////////console.log("wnwScrlt0:" + wnwScrlt);
        //////////console.log("caltrgScltop0:" + caltrgScltop);
        curLi.toggleClass("active");
        curLi.find("> .pcpfnbiBox .pcpfnbibBody").slideToggle(500);
      }
    }, 500);
    setTimeout(function () {
      if (caltrgScltop == "" || wnwScrlt != caltrgScltop) {
        //////////console.log("wnwScrlt1:" + wnwScrlt);
        //////////console.log("caltrgScltop1:" + caltrgScltop);
        curLi.toggleClass("active");
        curLi.find("> .pcpfnbiBox .pcpfnbibBody").slideToggle(500);
      }
    }, 1250);
  };

  handleRightColumnMobileToggle = () => {
    ////////console.log("Routing > handleRightColumnMobileToggle()");
    jQuery("body").toggleClass("pcpbiColright-open");
    jQuery(".pcPanel .pcpBody .pcpbInner .pcpbiColswrap .pcpbiCols.pcpbiColright").slideToggle();
  };

  //Order Review > Add Tips - Toggle active class & Other's block.
  handleTipsSelection = (e) => {};

  //Order Review > Your Details - Toggle Password block.
  handlePasswordToggle = (e) => {
    ////////console.log("Routing > handlePasswordToggle()");
    var curObj = jQuery(e.target);
    if (curObj.prop("checked")) {
      jQuery(".pcbOrderreview .pcborInner .pcborRows.rowUserdetails .pcborrBody .rudPasswprd").slideDown();
    } else {
      jQuery(".pcbOrderreview .pcborInner .pcborRows.rowUserdetails .pcborrBody .rudPasswprd").slideUp();
    }
  };

  //Order Review > Your Details - Password Submit.
  // handlePasswordOnclick = (e) => {
  //   var curObj = jQuery(e.target);
  //   curObj
  //     .parents(".pcborRows.rowUserdetails")
  //     .addClass("rewardMemberloggedin");
  //   jQuery("#rewardMemberform").slideUp();
  //   setTimeout(function () {
  //     jQuery("#rmLoggedinsuccess").slideDown();
  //   }, 450);
  //   setTimeout(function () {
  //     jQuery("#memberRewardsblock").slideDown();
  //   }, 1000);
  // };
  //Order Review > Your Details - Edit.
  handleEditUserDetails = (e) => {
    ////////console.log("Routing > handleEditUserDetails()");
    var curObj = jQuery(e.target);
    jQuery("#editSpotReward").css("display", "none");
    curObj.parents(".pcborRows.rowUserdetails").removeClass("rewardMemberloggedin");
    jQuery("#rewardsMember").prop("checked", false);
    curObj.parents(".pcborRows.rowUserdetails").find(".pcborrBody .rudPasswprd").hide();
    jQuery("#rmLoggedinsuccess").slideUp();
    jQuery("#memberRewardsblock").slideUp();
    setTimeout(function () {
      jQuery("#rewardMemberform").slideDown();
    }, 500);
  };

  /* Populating F&B Menu Tabs */
  populateMenuItemTabs = () => {
    ////////console.log("Routing > populateMenuItemTabs()");
    var menuTabs = "";
    if (this.state.fnbMenuItems.length > 0) {
      menuTabs = this.state.fnbMenuItems.map((menuItem, index) => {
        return (
          <li key={"menuItemTab_" + index + "_" + menuItem.tabid}>
            <a
              href="javascript:;"
              title={menuItem.tabName}
              data-target={"#category" + menuItem.tabName.replace(/\/|\s/g, "_")}
              //onClick={(event) => this.handleOnclickCategoryItem(event, this.osComponentCategoryList.current ) }
              onClick={(event) => this.handleOnclickCategoryItem(event)}
            >
              {menuItem.tabName}
            </a>
          </li>
        );
      });
    }
    return menuTabs;
  };

  populateTodaysDealFlag = (itemId) => {
    var index = this.state.deals.findIndex((x) => x.id == itemId);
    return index == -1 ? false : true;
  };

  populateDealPrice = (itemId) => {
    if (this.state.deals.length != 0) {
      var index = this.state.deals.findIndex((x) => x.id == itemId);
      if (index != -1) {
        return Number(this.state.deals[index].strikeValueBeforeTax).toFixed(2);
      }
    }
  };
  /* Populating F&B Menu Tab Content */
  populateMenuItemTabContent = () => {
    ////////console.log("Routing > populateMenuItemTabContent()");
    var menuTabContent = "";
    if (this.state.fnbMenuItems.length > 0) {
      menuTabContent = this.state.fnbMenuItems.map((menuItem, index) => {
        return (
          <li id={"category" + menuItem.tabName.replace(/\/|\s/g, "_")} key={"menuItemTabContent_" + index + "_" + menuItem.tabid}>
            <section className="pcpfnbiBox roundBoxshadowed cardThumblarge">
              <aside
                className="pcpfnbibHead"
                //className="pcpfnbibHead collapsed"
                //data-bs-toggle="collapse"
                //data-bs-target="#collapse-categoryRecommended"
                onClick={(event) => this.handleCategoryThumbOnclick(event)}
              >
                <figure>
                  <img src={menuItem.fnbtabs_images.length > 0 ? menuItem.fnbtabs_images[0].imageurl : ""} className="img-fluid" title={menuItem.tabName} alt={menuItem.tabName} />
                </figure>
                <h2>
                  <span>{menuItem.tabName}</span>
                </h2>
              </aside>
              <section id="collapse-categoryRecommended" className="pcpfnbibBody">
                <section className="pcpfnbItemlist">
                  {menuItem.fnbtabs_items.length > 0 ? (
                    <ul>
                      {menuItem.fnbtabs_items.map((fnbItem, index) => {
                        fnbItem.ageRestriction = menuItem.ageRestriction;
                        return (
                          <li
                            className={`itemLiClass ${fnbItem.pickupAtCounter ? "fnbPickup" : "fnbDeliveryInSeat"} ${this.populateTodaysDealFlag(fnbItem.id) ? "todaysDealItem" : ""}`}
                            key={menuItem.id + " _ " + fnbItem.fnbItem + "_" + index}
                            onClick={() =>
                              (fnbItem.active && fnbItem.show) || this.populateTodaysDealFlag(fnbItem.id)
                                ? this.setFnbItemModifierData(fnbItem, menuItem.id, menuItem.tabName, false, menuItem.ageRestriction)
                                : ""
                            }
                          >
                            <figure className="itemLiFigure">
                              <img src={fnbItem.fnbs_images.length > 0 ? fnbItem.fnbs_images[0].imageurl : ""} className="img-fluid" title="Classics Popcorn" alt="Classics Popcorn" />
                              {this.populateTodaysDealFlag(fnbItem.id) ? <span className="badge bg-primary todaysDealItemBadge">Today's Deal</span> : ""}
                            </figure>
                            <section className="itemDetailsSection">
                              <aside className="itemDetailsAside">
                                <h3 className={`itemName ${this.populateTodaysDealFlag(fnbItem.id) ? "todaysDealItem" : ""}`}>{fnbItem.itemName}</h3>
                                <p className="itemDetails">{fnbItem.itemDetails}</p>
                              </aside>
                              <aside className="btnPriceAside">
                                <p className="itemPrice">
                                  {/* {`$${
                                    fnbItem.strikeprice == -1 || fnbItem.strikeprice == null
                                      ? this.populateTodaysDealFlag(fnbItem.id)
                                        ? this.populateDealPrice(fnbItem.id)
                                        : Number(fnbItem.valuebeforetax).toFixed(2)
                                      : this.populateTodaysDealFlag(fnbItem.id)
                                      ? this.populateDealPrice(fnbItem.id)
                                      : Number(fnbItem.strikeValueBeforeTax).toFixed(2)
                                  }`} */}
                                  {`${
                                    fnbItem.fnbs_alternateitems && fnbItem.fnbs_alternateitems.length > 0
                                      ? this.populateAlternateItemsPrice(fnbItem.fnbs_alternateitems)
                                      : fnbItem.strikeprice == -1 || fnbItem.strikeprice == null
                                      ? this.populateTodaysDealFlag(fnbItem.id)
                                        ? "$" + this.populateDealPrice(fnbItem.id)
                                        : "$" + Number(fnbItem.valuebeforetax).toFixed(2)
                                      : this.populateTodaysDealFlag(fnbItem.id)
                                      ? "$" + this.populateDealPrice(fnbItem.id)
                                      : "$" + Number(fnbItem.strikeValueBeforeTax).toFixed(2)
                                  }`}
                                  {fnbItem.strikeprice == -1 ? (
                                    this.populateTodaysDealFlag(fnbItem.id) ? (
                                      <span className="strikethrough">{`$${Number(fnbItem.valuebeforetax).toFixed(2)}`}</span>
                                    ) : (
                                      ""
                                    )
                                  ) : fnbItem.strikeprice == null ? (
                                    ""
                                  ) : (
                                    <span className="strikethrough">{`$${Number(fnbItem.valuebeforetax).toFixed(2)}`}</span>
                                  )}
                                </p>
                                {(fnbItem.active && fnbItem.show) || this.populateTodaysDealFlag(fnbItem.id) ? (
                                  <div className="d-flex flex-column">
                                    <div className="d-flex align-items-end position-relative">
                                      <img src={fnbItem.pickupAtCounter ? PickUpDelivery : DeliveredInSeat} className="deliveryPickUpImage"></img>
                                      {/* <button type="button" className="btn btn-primary addButton" title="Add">
                                        Add <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
                                      </button> */}
                                      <button className="btn addButton1 " title="Add" id={`button-${fnbItem.id}`}>
                                        {/* Added <FontAwesomeIcon icon={faCheck}></FontAwesomeIcon> */}
                                        <span className="add-to-cart">
                                          Add <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
                                        </span>
                                        <FaShoppingCart size={20} className="fas fa-shopping-cart" />
                                        <FaBox size={13} className="fas fa-box" />
                                      </button>
                                    </div>
                                    <p className="noteDeliveryMode">{fnbItem.pickupAtCounter ? "To be Picked-up" : "Delivered in-seat"}</p>
                                  </div>
                                ) : (
                                  <a href="javascript:;" className="btn btnunavail" title="Unavailable">
                                    Unavailable
                                  </a>
                                )}
                              </aside>
                            </section>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    ""
                  )}
                </section>
              </section>
            </section>
          </li>
        );
      });
    }
    return menuTabContent;
  };

  handleAgeRestrictionFieldsOnChanges = (event, fieldFlag) => {
    const { maxLength, value, name } = event.target;
    const [fieldName, fieldIndex] = name.split("-");

    let fieldIntIndex = parseInt(fieldIndex, 10);

    // Check if no of char in field == maxlength
    if (value.length >= maxLength) {
      // It should not be last input field
      if (fieldIntIndex < 3) {
        // Get the next input field using it's name
        const nextfield = document.querySelector(`input[name=field-${fieldIntIndex + 1}]`);

        // If found, focus the next field
        if (nextfield !== null) {
          nextfield.focus();
        }
      }
    }

    this.setState(
      {
        [fieldFlag]: event.target.value,
      },
      () => {
        this.calculateAge(this.state.ageRestrictioncurrenttime);
      }
    );
  };
  ageRestrictionValidationTrue = () => {
    this.setState({
      ageRestrictionValidationDone: true,
    });
  };
  calculateAge = (currentTime) => {
    var currentDateTime = currentTime.split(" ");
    var currentDate = currentDateTime[0].split("-");

    if (this.state.ageRestrictionDate != "" && this.state.ageRestrictionMonth != "" && this.state.ageRestrictionYear != "" && this.state.ageRestrictionYear.length == 4) {
      var age = currentDate[2] - this.state.ageRestrictionYear;
      var m = currentDate[1] - this.state.ageRestrictionMonth;
      if (m < 0 || (m === 0 && currentDate[0] < this.state.ageRestrictionDate)) {
        age--;
      }
      //////console.log("Age: " + age);
      var btnEle = document.getElementById("ageRestrictionBtn");
      if (
        !(this.state.ageRestrictionDate > 0 && this.state.ageRestrictionDate < 32 && this.state.ageRestrictionMonth > 0 && this.state.ageRestrictionMonth < 13 && this.state.ageRestrictionYear > 0)
      ) {
        btnEle.classList.add("disabled");
        return null;
      }
      if (age >= 21) {
        btnEle.classList.remove("disabled");
      } else {
        btnEle.classList.add("disabled");
      }
    } else {
      var btnEle = document.getElementById("ageRestrictionBtn");
      if (!btnEle.classList.contains("disabled")) {
        btnEle.classList.add("disabled");
      }
    }
    //return age;
  };

  setFnbItemModifierData = (fnbItemData, tabId, tabName, dealsFlag, ageRestrictionFlag) => {
    // console.log("setFnbItemModifierData() > ageRestrictionFlag: " + ageRestrictionFlag);
    if (document.getElementById("button-" + fnbItemData.id) != null && document.getElementById("button-" + fnbItemData.id).classList[2] === "clicked1") {
      return;
    }
    //Adding a deal item from common listing.
    var dealsData = this.state.deals;
    var dealItemIndex = dealsData.findIndex((x) => x.id == fnbItemData.id);
    if (dealItemIndex != -1) {
      dealsFlag = true;
      fnbItemData = dealsData[dealItemIndex];
    }

    if (ageRestrictionFlag == true && this.state.ageRestrictionValidationDone == false) {
      this.setState({
        alcholBeverageCheckFNBData: {
          fnbItemData,
          tabId,
          tabName,
          dealsFlag,
        },
      });
      var tempCartdata = this.state.cartData;
      //Getting the timezone.
      const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
      });
      if (tempCartdata.length > 0) {
        var ageRestrictionCount = 0;
        tempCartdata.map((tcdItem) => {
          if (tcdItem.ageRestriction) {
            ageRestrictionCount = ageRestrictionCount + 1;
          }
        });
        if (ageRestrictionCount == 0) {
          var bookingTz = "";
          if (params.bookingid != null && params.cinemaid != null && Object.keys(this.state.bookingInfo).length !== 0) {
            bookingTz = this.state.bookingInfo.tz;
            //////console.log("tempCartdata.length>0 > bookingTz: " + bookingTz);
          } else if (Object.keys(this.state.bookingLocation).length !== 0) {
            bookingTz = this.state.bookingLocation.tz;
          }
          API.callEndpoint("POST", "Bearer", "cms/v1/currenttime", { tz: bookingTz })
            .then((response) => {
              this.setState({
                ageRestrictioncurrenttime: response.data.currenttime,
              });
            })
            .catch((error) => {
              //////console.log("Error: setFnbItemModifierData() > Age Restriction Calculation.");
              //////console.log(error);
            });
          ageRestrictionModal.show();
        }
      } else {
        var bookingTz = "";
        if (params.bookingid != null && params.cinemaid != null && Object.keys(this.state.bookingInfo).length !== 0) {
          bookingTz = this.state.bookingInfo.tz;
          //////console.log("tempCartdata.length>0 > bookingTz: " + bookingTz);
        } else if (Object.keys(this.state.bookingLocation).length !== 0) {
          bookingTz = this.state.bookingLocation.tz;
        }
        API.callEndpoint("POST", "Bearer", "cms/v1/currenttime", { tz: bookingTz })
          .then((response) => {
            ////console.log("response.data.currenttime: " + response.data.currenttime);
            this.setState({
              ageRestrictioncurrenttime: response.data.currenttime,
            });
          })
          .catch((error) => {
            //////console.log("Error: setFnbItemModifierData() > Age Restriction Calculation.");
            //////console.log(error);
          });
        ageRestrictionModal.show();
      }
      return false;
    }

    var stateCartData = this.state.cartData;
    if ((fnbItemData.fnbs_alternateitems && fnbItemData.fnbs_alternateitems.length == 0) || typeof fnbItemData.fnbs_alternateitems === "undefined") {
      //console.log(">>>>> +++++ <<<<<");
      var cartDataObject = new Object();
      cartDataObject.tabId = tabId;
      cartDataObject.tabName = tabName;
      // if (fnbItemData.fnbs_alternateitems.length == 0 && fnbItemData.modifierGroups.length == 0 && fnbItemData.smartModifiers.length == 0) {
      if (fnbItemData.fnbs_alternateitems && fnbItemData.fnbs_alternateitems.length == 0 && fnbItemData.modifierGroups.length == 0 && fnbItemData.smartModifiers.length == 0) {
        //console.log(">>>>> inside if <<<<<");
        cartDataObject.itemInCartFlag = true;
        cartDataObject.itemUniqueIdentifier = fnbItemData.id;
        document.getElementById("button-" + fnbItemData.id).classList.add("clicked1");
        setTimeout(() => {
          document.getElementById("button-" + fnbItemData.id).classList.remove("clicked1");
        }, 1500);
      } else {
        //console.log(">>>>> inside else <<<<<");
        cartDataObject.itemInCartFlag = false;
      }

      cartDataObject.id = fnbItemData.id;
      cartDataObject.itemName = fnbItemData.itemName;
      cartDataObject.valuebeforetax = fnbItemData.valuebeforetax;
      cartDataObject.taxValue = fnbItemData.taxValue;
      cartDataObject.strikeprice = fnbItemData.strikeprice;
      //if (fnbItemData.strikeprice != -1) {
      cartDataObject.strikeValueBeforeTax = fnbItemData.strikeValueBeforeTax;
      cartDataObject.strikeTaxValue = fnbItemData.strikeTaxValue;
      //}
      cartDataObject.quantity = 1;
      if (typeof fnbItemData.fnbs_alternateitems === "undefined") {
        var alternateItemIndex = null;
        var inSeatDelivery = "";
        var pickupAtCounter = "";
        var tempAgeRestriction = "";
        this.state.fnbMenuItems.map((menuItem) => {
          menuItem.fnbtabs_items.map((fnbItem) => {
            if (fnbItem.fnbs_alternateitems.length > 0) {
              alternateItemIndex = fnbItem.fnbs_alternateitems.findIndex((x) => x.id == fnbItemData.id);
              if (alternateItemIndex != null && alternateItemIndex != -1) {
                inSeatDelivery = fnbItem.inSeatDelivery;
                pickupAtCounter = fnbItem.pickupAtCounter;
                tempAgeRestriction = fnbItem.ageRestriction;
              }
            }
          });
        });
        cartDataObject.pickupAtCounter = pickupAtCounter;
        cartDataObject.inSeatDelivery = inSeatDelivery;
        cartDataObject.ageRestriction = tempAgeRestriction;
      } else {
        cartDataObject.pickupAtCounter = fnbItemData.pickupAtCounter;
        cartDataObject.inSeatDelivery = fnbItemData.inSeatDelivery;
        cartDataObject.ageRestriction = fnbItemData.ageRestriction;
      }

      //cartDataObject.isAlternateitem = {};
      cartDataObject.modifierGroups = [];
      cartDataObject.smartModifiers = [];
      cartDataObject.dealItem = dealsFlag;
      //cartDataObject.ageRestriction = fnbItemData.ageRestriction;
      cartDataObject.specialinstructions = "";

      var index = stateCartData.findIndex((x) => x.itemUniqueIdentifier === cartDataObject.itemUniqueIdentifier);
      if (index == -1) {
        stateCartData.push(cartDataObject);
      } else {
        stateCartData[index].quantity = stateCartData[index].quantity + 1;
      }
    }

    this.setState(
      {
        fnbItemModifierData:
          this.state.fnbItemModifierData == ""
            ? fnbItemData
            : (fnbItemData.fnbs_alternateitems && fnbItemData.fnbs_alternateitems.length == 0) ||
              (fnbItemData.fnbs_alternateitems && fnbItemData.fnbs_alternateitems.length > 0 && fnbItemData.id != this.state.fnbItemModifierData.id)
            ? fnbItemData
            : { ...this.state.fnbItemModifierData, modifierGroups: fnbItemData.modifierGroups },
        cartData: stateCartData,
        repeatItemIndex: false,
      },
      () => {
        if (((fnbItemData.fnbs_alternateitems && fnbItemData.fnbs_alternateitems.length == 0) || fnbItemData.fnbs_alternateitems == "undefined") && cartDataObject.itemInCartFlag) {
          this.loadStateData();
        }
        //if (fnbItemData.fnbs_alternateitems.length != 0 || fnbItemData.modifierGroups.length != 0 || fnbItemData.smartModifiers.length != 0) {
        if ((fnbItemData.fnbs_alternateitems && fnbItemData.fnbs_alternateitems.length != 0) || fnbItemData.modifierGroups.length != 0 || fnbItemData.smartModifiers.length != 0) {
          var requiredModifierGroup = false;
          fnbItemData.modifierGroups.map((mgItem) => {
            if (mgItem.minQty >= 1 && mgItem.maxQty >= 1 && (mgItem.minQty == mgItem.maxQty || mgItem.maxQty > mgItem.minQty)) {
              requiredModifierGroup = true;
            }
          });

          //AlternateItems.
          if (fnbItemData.fnbs_alternateitems && fnbItemData.fnbs_alternateitems.length > 0) {
            requiredModifierGroup = true;
            document.getElementById("modiferModalIncrementBtn").classList.add("disabled");
          } else {
            document.getElementById("modiferModalIncrementBtn").classList.remove("disabled");
          }

          if (requiredModifierGroup) {
            document.getElementById("modifierModalBtn").classList.add("disabled");
          } else {
            document.getElementById("modifierModalBtn").classList.remove("disabled");
          }
          modifierModal.show();
        }
      }
    );
  };

  // add special instructions only to each item
  modifierModalFnbItemSpecialInstructions = (event) => {
    let tempCartData = this.state.cartData;
    tempCartData[tempCartData.length - 1].specialinstructions = event.target.value;
    this.setState({ cartData: tempCartData });
  };

  //modifierItemQuantity = (event, counterFlag, itemId) => {
  modifierModalFnbItemQuantity = (event, counterFlag, fnbItem) => {
    var curObj = jQuery(event.target);
    var parentObj = curObj.parents(".itemCounter");
    var counterQuantity = parseInt(parentObj.find("input[type=text][readonly]").val());
    if (counterFlag == "countIncrement") {
      counterQuantity = counterQuantity + 1;
      if (counterQuantity > 1) {
        parentObj.find(".icControl.iccDecrement").removeClass("disabled");
        if (counterQuantity >= fnbItem.maximumqty) {
          parentObj.find(".icControl.iccIncrement").addClass("disabled");
        }
      }
    } else {
      counterQuantity = counterQuantity > 1 ? counterQuantity - 1 : 1;
      if (counterQuantity == 1) {
        parentObj.find(".icControl.iccDecrement").addClass("disabled");
      } else if (counterQuantity < fnbItem.maximumqty) {
        parentObj.find(".icControl.iccIncrement").removeClass("disabled");
      }
    }
    parentObj.find("input[type=text][readonly]").val(counterQuantity);
    var tempCartData = this.state.cartData;
    tempCartData[this.state.cartData.length - 1].quantity = counterQuantity;

    var paramFnbItemId = fnbItem.id;
    // console.log("paramFnbItemId: " + paramFnbItemId);
    //ALternateItem.
    var cartLastItem = tempCartData[this.state.cartData.length - 1];
    if (fnbItem.fnbs_alternateitems && fnbItem.fnbs_alternateitems.length > 0 && fnbItem.id != cartLastItem.id) {
      // console.log("fnbItem.id: " + fnbItem.id);
      // console.log("cartLastItem.id: " + cartLastItem.id);
      var altItemIndex = fnbItem.fnbs_alternateitems.findIndex((x) => x.id == cartLastItem.id);
      if (altItemIndex != -1) {
        paramFnbItemId = fnbItem.fnbs_alternateitems[altItemIndex].id;
      }
    }
    // console.log("paramFnbItemId > altItem: " + paramFnbItemId);

    this.setState(
      {
        cartData: tempCartData,
      },
      () => {
        //this.handleCalculateMenuItemTotal(fnbItem.id);
        this.handleCalculateMenuItemTotal(paramFnbItemId);
      }
    );
  };

  modifierItemCounter = (
    event,
    counterFlag,
    itemId,
    modifierGroupId,
    modifierTabid,
    modifierGroupMinQty,
    modifierGroupMaxQty,
    modifierItemId,
    modifierItemName,
    modifierItemAmount,
    modifierItemTax,
    modifierItemStrikeprice,
    modifierItemStrikeValueBeforeTax,
    modifierItemStrikeTaxValue
  ) => {
    ////////console.log("Routing > modifierItemCounter():");
    //counterFlag  > countIncrement | countDecrement
    var curObj = jQuery(event.target);
    var parentObj = curObj.parents(".itemCounter");
    var counterQuantity = parseInt(parentObj.find("input[type=text][readonly]").val());
    if (counterFlag == "countIncrement") {
      counterQuantity = counterQuantity + 1;
      if (counterQuantity > 0 && parentObj.hasClass("iczActive")) {
        parentObj.removeClass("iczActive");
        parentObj.find(".icControl.iccDecrement").removeClass("disabled");
      }
    } else {
      counterQuantity = counterQuantity > 0 ? counterQuantity - 1 : 0;
      if (counterQuantity <= 0 && !parentObj.hasClass("iczActive")) {
        parentObj.addClass("iczActive");
        parentObj.find(".icControl.iccDecrement").addClass("disabled");
      }
    }
    parentObj.find("input[type=text][readonly]").val(counterQuantity);

    /**variable "modifierGroupsArray" ==> Declared global.**/
    var modifierGroupIndex = modifierGroupsArray.findIndex((x) => x.modifierGroupId == modifierGroupId);
    //////////console.log("modifierGroupIndex: " + modifierGroupIndex);
    var modifierGroupsObj = new Object();
    var modifierItemsObj = new Object();
    // modifierGroupsObj.modifierGroupId = modifierGroupId;
    // modifierGroupsObj.modifierItems = [];
    if (modifierGroupIndex != -1) {
      var modifierItemIndex = modifierGroupsArray[modifierGroupIndex].modifierItems.findIndex((x) => x.modifierItemId == modifierItemId);
      if (modifierItemIndex != -1) {
        if (counterQuantity == 0) {
          modifierGroupsArray[modifierGroupIndex].modifierItems.splice(modifierItemIndex, 1);
          if (modifierGroupsArray[modifierGroupIndex].modifierItems.length == 0) {
            modifierGroupsArray.splice(modifierGroupIndex, 1);
          }
        } else {
          modifierGroupsArray[modifierGroupIndex].modifierItems[modifierItemIndex].modifierItemQuantity = counterQuantity;
        }
      } else {
        modifierGroupsObj.modifierItems = [];
        modifierItemsObj.modifierTabid = modifierTabid;
        modifierItemsObj.modifierItemId = modifierItemId;
        modifierItemsObj.modifierItemName = modifierItemName;
        modifierItemsObj.modifierItemAmount = modifierItemAmount;
        modifierItemsObj.modifierItemTax = modifierItemTax;
        modifierItemsObj.modifierItemQuantity = counterQuantity;
        modifierItemsObj.modifierItemStrikeprice = modifierItemStrikeprice;
        modifierItemsObj.modifierItemStrikeValueBeforeTax = modifierItemStrikeValueBeforeTax;
        modifierItemsObj.modifierItemStrikeTaxValue = modifierItemStrikeTaxValue;
        modifierGroupsArray[modifierGroupIndex].modifierItems.push(modifierItemsObj);
      }
    } else {
      modifierGroupsObj.modifierGroupId = modifierGroupId;
      modifierGroupsObj.modifierItems = [];
      modifierItemsObj.modifierTabid = modifierTabid;
      modifierItemsObj.modifierItemId = modifierItemId;
      modifierItemsObj.modifierItemName = modifierItemName;
      modifierItemsObj.modifierItemAmount = modifierItemAmount;
      modifierItemsObj.modifierItemTax = modifierItemTax;
      modifierItemsObj.modifierItemStrikeprice = modifierItemStrikeprice;
      modifierItemsObj.modifierItemStrikeValueBeforeTax = modifierItemStrikeValueBeforeTax;
      modifierItemsObj.modifierItemStrikeTaxValue = modifierItemStrikeTaxValue;
      modifierItemsObj.modifierItemQuantity = counterQuantity;
      modifierGroupsObj.modifierItems.push(modifierItemsObj);
      modifierGroupsArray.push(modifierGroupsObj);
    }

    //Push Modifier Group Data to this.state.cartData.
    var tempCartData = this.state.cartData;
    tempCartData[tempCartData.length - 1].modifierGroups = [];
    if (modifierGroupsArray.length > 0) {
      tempCartData[tempCartData.length - 1].modifierGroups.push(modifierGroupsArray);
    }
    //////////console.log("tempCartData: ");
    //////////console.log(tempCartData);
    this.setState(
      {
        cartData: tempCartData,
      },
      () => {
        //////////console.log("Cart Data After Modifier Groups Added.");
        //////////console.log(this.state.cartData);
        //Validate Modifier Group min/max Quantity.
        this.validateModifierMinMaxQty(itemId, modifierGroupId, modifierGroupMinQty, modifierGroupMaxQty);
        //Update Total.
        this.handleCalculateMenuItemTotal(itemId);
      }
    );
  };

  modifierItemCheckboxOnchange = (
    event,
    itemId,
    modifierGroupId,
    modifierTabid,
    modifierGroupMinQty,
    modifierGroupMaxQty,
    modifierItemId,
    modifierItemName,
    modifierItemAmount,
    modifierItemTax,
    modifierItemStrikeprice,
    modifierItemStrikeValueBeforeTax,
    modifierItemStrikeTaxValue
  ) => {
    ////////console.log("Routing > modifierItemCheckboxOnchange()");
    //checkedFlag  > true | false
    var checkedFlag = event.target.checked;

    /**variable "modifierGroupsArray" ==> Declared global.**/
    var modifierGroupIndex = modifierGroupsArray.findIndex((x) => x.modifierGroupId == modifierGroupId);

    var modifierGroupsObj = new Object();
    var modifierItemsObj = new Object();
    //if (modifierGroupIndex != -1 && checkedFlag == false) {
    if (modifierGroupIndex != -1) {
      var modifierItemIndex = modifierGroupsArray[modifierGroupIndex].modifierItems.findIndex((x) => x.modifierItemId == modifierItemId);
      if (modifierItemIndex != -1) {
        if (checkedFlag == false) {
          modifierGroupsArray[modifierGroupIndex].modifierItems.splice(modifierItemIndex, 1);
          if (modifierGroupsArray[modifierGroupIndex].modifierItems.length <= 0) {
            modifierGroupsArray.splice(modifierGroupIndex, 1);
          }
        }
      } else {
        modifierGroupsObj.modifierItems = [];
        modifierItemsObj.modifierTabid = modifierTabid;
        modifierItemsObj.modifierItemId = modifierItemId;
        modifierItemsObj.modifierItemName = modifierItemName;
        modifierItemsObj.modifierItemAmount = modifierItemAmount;
        modifierItemsObj.modifierItemTax = modifierItemTax;
        modifierItemsObj.modifierItemStrikeprice = modifierItemStrikeprice;
        modifierItemsObj.modifierItemStrikeValueBeforeTax = modifierItemStrikeValueBeforeTax;
        modifierItemsObj.modifierItemStrikeTaxValue = modifierItemStrikeTaxValue;
        modifierItemsObj.modifierItemQuantity = 1;
        modifierGroupsArray[modifierGroupIndex].modifierItems.push(modifierItemsObj);
      }
    } else {
      modifierGroupsObj.modifierGroupId = modifierGroupId;
      modifierGroupsObj.modifierItems = [];
      modifierItemsObj.modifierTabid = modifierTabid;
      modifierItemsObj.modifierItemId = modifierItemId;
      modifierItemsObj.modifierItemName = modifierItemName;
      modifierItemsObj.modifierItemAmount = modifierItemAmount;
      modifierItemsObj.modifierItemTax = modifierItemTax;
      modifierItemsObj.modifierItemStrikeprice = modifierItemStrikeprice;
      modifierItemsObj.modifierItemStrikeValueBeforeTax = modifierItemStrikeValueBeforeTax;
      modifierItemsObj.modifierItemStrikeTaxValue = modifierItemStrikeTaxValue;
      modifierItemsObj.modifierItemQuantity = 1;
      modifierGroupsObj.modifierItems.push(modifierItemsObj);
      modifierGroupsArray.push(modifierGroupsObj);
    }

    //Push Modifier Group Data to this.state.cartData.
    var tempCartData = this.state.cartData;
    tempCartData[tempCartData.length - 1].modifierGroups = [];
    if (modifierGroupsArray.length > 0) {
      tempCartData[tempCartData.length - 1].modifierGroups.push(modifierGroupsArray);
    }
    this.setState(
      {
        cartData: tempCartData,
      },
      () => {
        //Validate Modifier Group min/max Quantity.
        this.validateModifierMinMaxQty(itemId, modifierGroupId, modifierGroupMinQty, modifierGroupMaxQty);
        //Update Total.
        this.handleCalculateMenuItemTotal(itemId);
      }
    );
  };

  modifierItemRadioOnchange = (
    event,
    itemId,
    modifierGroupId,
    modifierTabid,
    modifierGroupMinQty,
    modifierGroupMaxQty,
    modifierItemId,
    modifierItemName,
    modifierItemAmount,
    modifierItemTax,
    modifierItemStrikeprice,
    modifierItemStrikeValueBeforeTax,
    modifierItemStrikeTaxValue
  ) => {
    ////////console.log("Routing > modifierItemRadioOnchange()");
    //checkedFlag  > true | false
    var checkedFlag = event.target.checked;

    /**variable "modifierGroupsArray" ==> Declared global.**/
    var modifierGroupIndex = modifierGroupsArray.findIndex((x) => x.modifierGroupId == modifierGroupId);

    var modifierGroupsObj = new Object();
    var modifierItemsObj = new Object();
    if (modifierGroupIndex != -1) {
      var modifierItemIndex = modifierGroupsArray[modifierGroupIndex].modifierItems.findIndex((x) => x.modifierItemId == modifierItemId);
      if (modifierItemIndex != -1) {
        //No action.
        // if (checkedFlag == false) {
        //   modifierGroupsArray[modifierGroupIndex].modifierItems.splice(modifierItemIndex, 1);
        //   if (modifierGroupsArray[modifierGroupIndex].modifierItems.length <= 0) {
        //     modifierGroupsArray.splice(modifierGroupIndex, 1);
        //   }
        // }
      } else {
        modifierGroupsObj.modifierItems = [];
        modifierItemsObj.modifierTabid = modifierTabid;
        modifierItemsObj.modifierItemId = modifierItemId;
        modifierItemsObj.modifierItemName = modifierItemName;
        modifierItemsObj.modifierItemAmount = modifierItemAmount;
        modifierItemsObj.modifierItemTax = modifierItemTax;
        modifierItemsObj.modifierItemStrikeprice = modifierItemStrikeprice;
        modifierItemsObj.modifierItemStrikeValueBeforeTax = modifierItemStrikeValueBeforeTax;
        modifierItemsObj.modifierItemStrikeTaxValue = modifierItemStrikeTaxValue;
        modifierItemsObj.modifierItemQuantity = 1;
        modifierGroupsArray[modifierGroupIndex].modifierItems = [];
        modifierGroupsArray[modifierGroupIndex].modifierItems.push(modifierItemsObj);
      }
    } else {
      modifierGroupsObj.modifierGroupId = modifierGroupId;
      modifierGroupsObj.modifierItems = [];
      modifierItemsObj.modifierTabid = modifierTabid;
      modifierItemsObj.modifierItemId = modifierItemId;
      modifierItemsObj.modifierItemName = modifierItemName;
      modifierItemsObj.modifierItemAmount = modifierItemAmount;
      modifierItemsObj.modifierItemTax = modifierItemTax;
      modifierItemsObj.modifierItemStrikeprice = modifierItemStrikeprice;
      modifierItemsObj.modifierItemStrikeValueBeforeTax = modifierItemStrikeValueBeforeTax;
      modifierItemsObj.modifierItemStrikeTaxValue = modifierItemStrikeTaxValue;
      modifierItemsObj.modifierItemQuantity = 1;
      modifierGroupsObj.modifierItems.push(modifierItemsObj);
      modifierGroupsArray.push(modifierGroupsObj);
    }

    //Push Modifier Group Data to this.state.cartData.
    var tempCartData = this.state.cartData;
    tempCartData[tempCartData.length - 1].modifierGroups = [];
    if (modifierGroupsArray.length > 0) {
      tempCartData[tempCartData.length - 1].modifierGroups.push(modifierGroupsArray);
    }
    this.setState(
      {
        cartData: tempCartData,
      },
      () => {
        //Validate Modifier Group min/max Quantity.
        this.validateModifierMinMaxQty(itemId, modifierGroupId, modifierGroupMinQty, modifierGroupMaxQty);
        //Update Total.
        this.handleCalculateMenuItemTotal(itemId);
      }
    );
  };

  smartModifierItemCheckboxOnchange = (event, itemId, smartModifierItemId, smartModifierItemName, optionType) => {
    ////////console.log("Routing > smartModifierItemCheckboxOnchange()");
    //checkedFlag  > true | false
    var eTarget = event.target;
    var checkedFlag = eTarget.checked;
    var cbEle = eTarget.parentNode;
    var liEle = cbEle.parentNode;

    if (checkedFlag) {
      var altCBEle = liEle.querySelector(".customCheckbox input:not(:checked)");
      altCBEle.setAttribute("disabled", "disabled");
    } else {
      //console.log("checkedFlag: " + checkedFlag);
      // var disabledEle = liEle.querySelector(".customCheckbox input:disabled");
      // //console.log("disabledEle.length: " + disabledEle.length);
      // liEle.querySelector(".customCheckbox input").disabled = false;
      //jQuery(liEle).find(".customCheckbox input:disabled").removeAttr("disabled");
      liEle.querySelector(".customCheckbox input:disabled").removeAttribute("disabled");
    }

    /**variable "smartModifiersArray" ==> Declared global.**/
    var smartModifierIndex = smartModifiersArray.findIndex((x) => x.smartModifierItemId == smartModifierItemId);

    var smartModifierObj = new Object();
    smartModifierObj.smartModifierItemId = smartModifierItemId;
    smartModifierObj.smartModifierItemName = smartModifierItemName;
    if (smartModifierIndex != -1 && checkedFlag == false) {
      smartModifiersArray.splice(smartModifierIndex, 1);
    } else {
      smartModifierObj.smartModifierItemId = smartModifierItemId;
      smartModifierObj.smartModifierItemName = smartModifierItemName;
      smartModifierObj.smartModifierItemQuantity = 1;
      smartModifierObj.type = optionType;
      smartModifiersArray.push(smartModifierObj);
    }

    //Push Smartmodifiers Data to this.state.cartData.
    var tempCartData = this.state.cartData;
    tempCartData[tempCartData.length - 1].smartModifiers = [];
    if (smartModifiersArray.length > 0) {
      tempCartData[tempCartData.length - 1].smartModifiers.push(smartModifiersArray);
    }
    this.setState(
      {
        cartData: tempCartData,
      },
      () => {
        //Update Total.
        this.handleCalculateMenuItemTotal(itemId);
      }
    );
  };

  validateModifierMinMaxQty = (fnbItemId, modifierGroupId, modifierGroupMinQty, modifierGroupMaxQty) => {
    ////////console.log("Routing > validateModifierMinMaxQty()");
    var mgQuantityTotal = 0;
    //jQuery("#fnbmmrwrsiWrap_" + fnbItemId + "_" + modifierGroupId + " ul li")
    mgQuantityTotal = jQuery("#fnbmmrwrsiWrap_" + fnbItemId + "_" + modifierGroupId).find(".customCheckbox input:checked").length;
    //////////console.log( "validateModifierMinMaxQty() >>> Selected(Checkbox): " + mgQuantityTotal );
    jQuery("#fnbmmrwrsiWrap_" + fnbItemId + "_" + modifierGroupId)
      .find("ul li .itemCounter input")
      .each(function () {
        var curFcVal = parseInt(jQuery(this).val());
        //////////console.log( "validateModifierMinMaxQty() >>> .itemCounter: " + curFcVal );
        mgQuantityTotal = mgQuantityTotal + curFcVal;
      });
    //////////console.log( "validateModifierMinMaxQty() >>> Selected(itemCounter): " + mgQuantityTotal );
    if (modifierGroupMinQty == 0 && modifierGroupMaxQty == 0) {
      //itemModifierGroupTitle = itemModifierGroupTitle + " (optional)";
    } else if (modifierGroupMinQty == 0 && modifierGroupMaxQty == 1) {
      //optional select upto 1
      if (mgQuantityTotal == 1 && mgQuantityTotal == modifierGroupMaxQty) {
        jQuery("#fnbmmrwrsiWrap_" + fnbItemId + "_" + modifierGroupId)
          .find(".customCheckbox input:not(:checked)")
          .prop("disabled", true);
        //jQuery("#fnbmmrwrsiWrap_" + fnbItemId + "_" + modifierGroupId) .find(".customCheckbox input:not(:checked) + label") .addClass("disabled");
        jQuery("#fnbmmrwrsiWrap_" + fnbItemId + "_" + modifierGroupId)
          .find("ul li .itemCounter .icControl.iccIncrement")
          .addClass("disabled");
      } else {
        jQuery("#fnbmmrwrsiWrap_" + fnbItemId + "_" + modifierGroupId)
          .find(".customCheckbox input:not(:checked)")
          .prop("disabled", false);
        //jQuery("#fnbmmrwrsiWrap_" + fnbItemId + "_" + modifierGroupId) .find(".customCheckbox input:not(:checked) + label") .removeClass("disabled");
        jQuery("#fnbmmrwrsiWrap_" + fnbItemId + "_" + modifierGroupId)
          .find("ul li .itemCounter .icControl.iccIncrement")
          .removeClass("disabled");
      }
    } else if (modifierGroupMinQty == 1 && modifierGroupMaxQty == 1) {
      //Required
      if (mgQuantityTotal == 1 && mgQuantityTotal == modifierGroupMinQty && mgQuantityTotal == modifierGroupMaxQty) {
        //Previous checkbox layout.
        //// jQuery("#fnbmmrwrsiWrap_" + fnbItemId + "_" + modifierGroupId)
        ////   .find(".customCheckbox input:not(:checked)")
        ////   .prop("disabled", true);
        //// //jQuery("#fnbmmrwrsiWrap_" + fnbItemId + "_" + modifierGroupId) .find(".customCheckbox input:not(:checked) + label") .addClass("disabled");
        //// jQuery("#fnbmmrwrsiWrap_" + fnbItemId + "_" + modifierGroupId)
        ////   .find("ul li .itemCounter .icControl.iccIncrement")
        ////   .addClass("disabled");
        //Current radio layout.
        document.getElementById("modifierModalBtn").classList.add("disabled");
      } else {
        //Previous checkbox layout.
        //// jQuery("#fnbmmrwrsiWrap_" + fnbItemId + "_" + modifierGroupId)
        ////   .find(".customCheckbox input:not(:checked)")
        ////   .prop("disabled", false);
        //// //jQuery("#fnbmmrwrsiWrap_" + fnbItemId + "_" + modifierGroupId) .find(".customCheckbox input:not(:checked) + label") .removeClass("disabled");
        //// jQuery("#fnbmmrwrsiWrap_" + fnbItemId + "_" + modifierGroupId)
        ////   .find("ul li .itemCounter .icControl.iccIncrement")
        ////   .removeClass("disabled");
        //Current radio layout.
        document.getElementById("modifierModalBtn").classList.remove("disabled");
      }
    } else if (modifierGroupMinQty == 0 && modifierGroupMaxQty > 1 && modifierGroupMaxQty > modifierGroupMinQty) {
      //optional select upto maxQty
      if (mgQuantityTotal > 1 && mgQuantityTotal > modifierGroupMinQty && mgQuantityTotal == modifierGroupMaxQty) {
        jQuery("#fnbmmrwrsiWrap_" + fnbItemId + "_" + modifierGroupId)
          .find(".customCheckbox input:not(:checked)")
          .prop("disabled", true);
        //jQuery("#fnbmmrwrsiWrap_" + fnbItemId + "_" + modifierGroupId) .find(".customCheckbox input:not(:checked) + label") .addClass("disabled");
        jQuery("#fnbmmrwrsiWrap_" + fnbItemId + "_" + modifierGroupId)
          .find("ul li .itemCounter .icControl.iccIncrement")
          .addClass("disabled");
      } else {
        jQuery("#fnbmmrwrsiWrap_" + fnbItemId + "_" + modifierGroupId)
          .find(".customCheckbox input:not(:checked)")
          .prop("disabled", false);
        //jQuery("#fnbmmrwrsiWrap_" + fnbItemId + "_" + modifierGroupId) .find(".customCheckbox input:not(:checked) + label") .removeClass("disabled");
        jQuery("#fnbmmrwrsiWrap_" + fnbItemId + "_" + modifierGroupId)
          .find("ul li .itemCounter .icControl.iccIncrement")
          .removeClass("disabled");
      }
    } else if (modifierGroupMinQty > 0 && modifierGroupMaxQty > 1 && modifierGroupMaxQty == modifierGroupMinQty) {
      //Required select maxQty
      if (mgQuantityTotal > 1 && mgQuantityTotal == modifierGroupMinQty && mgQuantityTotal == modifierGroupMaxQty) {
        jQuery("#fnbmmrwrsiWrap_" + fnbItemId + "_" + modifierGroupId)
          .find(".customCheckbox input:not(:checked)")
          .prop("disabled", true);
        //jQuery("#fnbmmrwrsiWrap_" + fnbItemId + "_" + modifierGroupId) .find(".customCheckbox input:not(:checked) + label") .addClass("disabled");
        jQuery("#fnbmmrwrsiWrap_" + fnbItemId + "_" + modifierGroupId)
          .find("ul li .itemCounter .icControl.iccIncrement")
          .addClass("disabled");
      } else {
        jQuery("#fnbmmrwrsiWrap_" + fnbItemId + "_" + modifierGroupId)
          .find(".customCheckbox input:not(:checked)")
          .prop("disabled", false);
        //jQuery("#fnbmmrwrsiWrap_" + fnbItemId + "_" + modifierGroupId) .find(".customCheckbox input:not(:checked) + label") .removeClass("disabled");
        jQuery("#fnbmmrwrsiWrap_" + fnbItemId + "_" + modifierGroupId)
          .find("ul li .itemCounter .icControl.iccIncrement")
          .removeClass("disabled");
      }
    } else if (modifierGroupMinQty > 0 && modifierGroupMaxQty > 1 && modifierGroupMaxQty > modifierGroupMinQty) {
      //Required select minQty upto maxQty
      if (mgQuantityTotal > 0 && mgQuantityTotal >= modifierGroupMinQty && mgQuantityTotal <= modifierGroupMaxQty) {
        jQuery("#fnbmmrwrsiWrap_" + fnbItemId + "_" + modifierGroupId)
          .find(".customCheckbox input:not(:checked)")
          .prop("disabled", true);
        //jQuery("#fnbmmrwrsiWrap_" + fnbItemId + "_" + modifierGroupId) .find(".customCheckbox input:not(:checked) + label") .addClass("disabled");
        jQuery("#fnbmmrwrsiWrap_" + fnbItemId + "_" + modifierGroupId)
          .find("ul li .itemCounter .icControl.iccIncrement")
          .addClass("disabled");
      } else {
        jQuery("#fnbmmrwrsiWrap_" + fnbItemId + "_" + modifierGroupId)
          .find(".customCheckbox input:not(:checked)")
          .prop("disabled", false);
        //jQuery("#fnbmmrwrsiWrap_" + fnbItemId + "_" + modifierGroupId) .find(".customCheckbox input:not(:checked) + label") .removeClass("disabled");
        jQuery("#fnbmmrwrsiWrap_" + fnbItemId + "_" + modifierGroupId)
          .find("ul li .itemCounter .icControl.iccIncrement")
          .removeClass("disabled");
      }
    }
  };

  alternateItemRadioOnchange = (alternateItemData, itemAgeRestrictionFlag) => {
    var itemTabId = "";
    var itemTabName = "";
    var itemDealsFlag = false;
    var itemAgeRestrictionFlag = "";
    var alternateItemIndex = null;
    this.state.fnbMenuItems.map((menuItem) => {
      menuItem.fnbtabs_items.map((fnbItem) => {
        if (fnbItem.fnbs_alternateitems.length > 0) {
          alternateItemIndex = fnbItem.fnbs_alternateitems.findIndex((x) => x.id == alternateItemData.id);
          if (alternateItemIndex != null && alternateItemIndex != -1) {
            itemTabId = menuItem.id;
            itemTabName = menuItem.tabName;
            itemAgeRestrictionFlag = fnbItem.ageRestriction;
          }
        }
      });
    });

    var tempCartData = this.state.cartData;
    var cartLastItemIndex = tempCartData.length - 1;
    if (tempCartData.length > 0 && tempCartData[cartLastItemIndex].itemInCartFlag == false) {
      tempCartData.splice(cartLastItemIndex, 1);
      this.setState(
        {
          cartData: tempCartData,
        },
        () => {
          modifierGroupsArray = []; //Flushing global modifierGroupsArray varible.
          smartModifiersArray = []; //Flushing global smartModifiersArray varible.
          //this.setFnbItemModifierData(fnbItem, menuItem.id, menuItem.tabName, false, menuItem.ageRestriction)
          this.setFnbItemModifierData(alternateItemData, itemTabId, itemTabName, itemDealsFlag, itemAgeRestrictionFlag);
          document.getElementById("modalFnbModifierQuantity").value = 1;
          document.getElementById("modiferModalDecrementBtn").classList.add("disabled");
          document.getElementById("modifierModalBtn").classList.remove("disabled");
          document.getElementById("modiferModalIncrementBtn").classList.remove("disabled");
        }
      );
    } else {
      this.setFnbItemModifierData(alternateItemData, itemTabId, itemTabName, itemDealsFlag, itemAgeRestrictionFlag);
      document.getElementById("modalFnbModifierQuantity").value = 1;
      document.getElementById("modiferModalDecrementBtn").classList.add("disabled");
      document.getElementById("modifierModalBtn").classList.remove("disabled");
      document.getElementById("modiferModalIncrementBtn").classList.remove("disabled");
    }
    this.setState({
      tempModifierModalTotal:
        alternateItemData.strikeprice == -1 || alternateItemData.strikeprice == null ? alternateItemData.valuebeforetax.toFixed(2) : alternateItemData.strikeValueBeforeTax.toFixed(2),
    });
  };

  handleCalculateMenuItemTotal = (itemId) => {
    ////////console.log("Routing > handleCalculateMenuItemTotal()");
    var cartData = this.state.cartData;
    var modifierMenuItemTotal = 0;

    //cartData.map((menuItem) => {
    var menuItem = cartData[cartData.length - 1];
    if (menuItem.id == itemId) {
      //modifierMenuItemTotal = modifierMenuItemTotal + (menuItem.strikeprice == -1 ? menuItem.valuebeforetax * menuItem.quantity : menuItem.strikeprice * menuItem.quantity);
      //modifierMenuItemTotal = modifierMenuItemTotal + menuItem.valuebeforetax * menuItem.quantity;
      modifierMenuItemTotal =
        modifierMenuItemTotal + (menuItem.strikeprice == -1 || menuItem.strikeprice == null ? menuItem.valuebeforetax * menuItem.quantity : menuItem.strikeValueBeforeTax * menuItem.quantity);
      if (menuItem.modifierGroups.length > 0) {
        menuItem.modifierGroups.map((modifierGroups) => {
          if (modifierGroups.length > 0) {
            modifierGroups.map((modifierGroup) => {
              if (modifierGroup.modifierItems.length > 0) {
                modifierGroup.modifierItems.map((modifierItem) => {
                  //modifierMenuItemTotal = modifierMenuItemTotal + modifierItem.modifierItemAmount * modifierItem.modifierItemQuantity * menuItem.quantity;
                  modifierMenuItemTotal =
                    modifierMenuItemTotal +
                    (modifierItem.modifierItemStrikeprice == -1 || menuItem.dealItem
                      ? modifierItem.modifierItemAmount * modifierItem.modifierItemQuantity * menuItem.quantity
                      : modifierItem.modifierItemStrikeValueBeforeTax * modifierItem.modifierItemQuantity * menuItem.quantity);
                });
              }
            });
          }
        });
      }
    }
    //});

    modifierMenuItemTotal = modifierMenuItemTotal.toFixed(2);
    this.setState(
      {
        tempModifierModalTotal: modifierMenuItemTotal,
      },
      () => {
        //////////console.log("modifierMenuItemTotal: " + modifierMenuItemTotal.toFixed(2));
        //////////console.log( "this.state.tempModifierModalTotal: " + this.state.tempModifierModalTotal );
      }
    );
  };

  areArraysEqual = (array1, array2) => {
    if (array1.length === array2.length) {
      return array1.every((element, index) => {
        if (element === array2[index]) {
          return true;
        }

        return false;
      });
    }

    return false;
  };

  addItemToCart = (itemId) => {
    var justIncreaseQtyIndex = 0;
    var tempCartData = this.state.cartData;
    var menuItemIndex = tempCartData.length - 1;
    var itemUniqueIdentifier = tempCartData[menuItemIndex].id;
    if (tempCartData[menuItemIndex].modifierGroups.length != 0) {
      var modiferGroupArray = [];
      tempCartData[menuItemIndex].modifierGroups[0][0].modifierItems.map((cartItemModifier) => {
        modiferGroupArray.push(cartItemModifier.modifierItemId + cartItemModifier.modifierItemQuantity);
      });
      itemUniqueIdentifier += modiferGroupArray.sort().join("");
    }
    if (tempCartData[menuItemIndex].smartModifiers.length != 0) {
      var smartModiferGroupArray = [];
      tempCartData[menuItemIndex].smartModifiers[0].map((cartItemSmartModifier) => {
        smartModiferGroupArray.push(cartItemSmartModifier.smartModifierItemId + cartItemSmartModifier.smartModifierItemQuantity + cartItemSmartModifier.type);
      });
      itemUniqueIdentifier += smartModiferGroupArray.sort().join("");
    }

    var justIncreaseQtyIndex = this.state.cartData.findIndex((x) => x.itemUniqueIdentifier == itemUniqueIdentifier);
    if (justIncreaseQtyIndex != -1) {
      tempCartData[justIncreaseQtyIndex].specialinstructions = this.state.cartData[this.state.cartData.length - 1].specialinstructions;
      tempCartData[justIncreaseQtyIndex].quantity = tempCartData[justIncreaseQtyIndex].quantity + 1;
    } else {
      var menuItemIndex = tempCartData.length - 1;
      tempCartData[menuItemIndex].itemInCartFlag = true;
      tempCartData[menuItemIndex].itemUniqueIdentifier = itemUniqueIdentifier;
    }

    this.setState(
      {
        cartData: tempCartData,
        tempModifierModalTotal: 0,
      },
      () => {
        modifierGroupsArray = []; //Flushing global modifierGroupsArray varible.
        smartModifiersArray = []; //Flushing global smartModifiersArray varible.
        this.loadStateData();
      }
    );
  };

  populateOrderPayload = (sessionId) => {
    const params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop) => searchParams.get(prop),
    });
    ////////console.log("Routing > populateOrderPayload()");
    var tempCartData = this.state.cartData;
    var bookingInfo = this.state.bookingInfo;
    //////////console.log("populateOrderPayload >>> bookingInfo: ");
    //////////console.log(bookingInfo);
    //////////console.log(tempCartData);
    //////////console.log(bookingInfo);
    var populatefnb = [];
    var fnbModifiers = [];
    tempCartData.map((tcData) => {
      if (tcData.itemInCartFlag) {
        //////////console.log(tcData);
        var fnbObj = new Object();
        fnbObj.id = tcData.id;
        fnbObj.quantity = tcData.quantity;
        fnbObj.tabId = tcData.tabId;
        fnbObj.modifiers = [];
        if (tcData.modifierGroups.length > 0) {
          tcData.modifierGroups.map((mgsItem) => {
            if (mgsItem.length > 0) {
              mgsItem.map((mgItem) => {
                if (mgItem.modifierItems.length > 0) {
                  mgItem.modifierItems.map((mItem) => {
                    //////////console.log("mItemObj.tabid: " + mItem.modifierTabid);
                    var mItemObj = new Object();
                    mItemObj.id = mItem.modifierItemId;
                    mItemObj.tabid = mItem.modifierTabid;
                    mItemObj.quantity = mItem.modifierItemQuantity;
                    fnbObj.modifiers.push(mItemObj);
                  });
                }
              });
            }
          });
        } else {
          fnbObj.modifiers = [];
        }

        fnbObj.smartModifiers = [];
        if (tcData.smartModifiers.length > 0) {
          tcData.smartModifiers[0].map((smartModiferItem) => {
            var smItemObj = new Object();
            smItemObj.id = smartModiferItem.smartModifierItemId;
            smItemObj.name = smartModiferItem.smartModifierItemName;
            smItemObj.quantity = smartModiferItem.smartModifierItemQuantity;
            smItemObj.type = smartModiferItem.type;
            fnbObj.smartModifiers.push(smItemObj);
          });
        } else {
          fnbObj.smartModifiers = [];
        }
        fnbObj.promotionid = null;
        fnbObj.specialinstructions = tcData.specialinstructions;
        fnbObj.variablepriceincents = null;
        fnbObj.type = tcData.dealItem ? "deals" : "concession";
        populatefnb.push(fnbObj);
      }
    });

    var dataObj = this.state.createOrderData;
    dataObj.id = "";
    // dataObj.sessionid = Object.keys(this.state.normalBookingInfoSelected).length !== 0 && Object.keys(this.state.bookingInfo).length === 0 ? this.state.normalBookingInfoSelected.sessionId : bookingInfo.sessionid;
    /* 
    //For Sessionid from this.state.bookingInfo/this.state.normalBookingInfoSelected:
      #1) Movie booking flow => this.state.bookingInfo.sessionid 
      #2) Seat QR Scan flow => this.state.bookingInfo.id 
      #3) Manual selection flow => this.state.normalBookingInfoSelected.sessionId
    */
    dataObj.sessionid =
      Object.keys(this.state.normalBookingInfoSelected).length !== 0
        ? this.state.normalBookingInfoSelected.sessionId
        : Object.keys(bookingInfo).length !== 0
        ? bookingInfo.sessionid
          ? bookingInfo.sessionid
          : bookingInfo.id
        : "";
    dataObj.fnb = populatefnb;
    dataObj.seats = [];
    dataObj.addons = [];
    dataObj.tickettypes = [];
    dataObj.version = "en-US";
    dataObj.requestdata = [];
    dataObj.deliverytime = this.state.selectedInseatDeliverSlotId;
    console.log("this.state.selectedInseatDeliverSlotId: " + this.state.selectedInseatDeliverSlotId);
    dataObj.ticketingpayload = {
      id: "",
      optionalFields: [],
    };
    dataObj.linkedbookingid = bookingInfo.linkedbookingid ? bookingInfo.linkedbookingid : null;
    //dataObj.seatNumber = this.state.bookingInfo && Object.keys(this.state.bookingInfo).length !== 0 && this.state.bookingInfo.orders_items[0].seats != "" ? this.state.bookingInfo.orders_items[0].seats : "";
    // dataObj.seatNumber =
    //   this.state.bookingInfo && Object.keys(this.state.bookingInfo).length !== 0 && this.state.bookingInfo.orders_items && this.state.bookingInfo.orders_items[0].seats != ""
    //     ? this.state.bookingInfo.orders_items[0].seats
    //     : this.state.bookingInfo.seatNumber && this.state.bookingInfo.seatNumber != ""
    //     ? this.state.bookingInfo.seatNumber
    //     : dataObj.seatNumber;
    /* Changes seatNumber with deliveryseat(as per discussion with Faheen) */
    dataObj.deliveryseat =
      this.state.bookingInfo && Object.keys(this.state.bookingInfo).length !== 0 && this.state.bookingInfo.orders_items && this.state.bookingInfo.orders_items[0].seats != ""
        ? this.state.bookingInfo.orders_items[0].seats
        : this.state.bookingInfo.seatNumber && this.state.bookingInfo.seatNumber != ""
        ? this.state.bookingInfo.seatNumber
        : dataObj.deliveryseat;
    console.log("dataObj: ");
    console.log(dataObj);
    this.setState({
      createOrderData: dataObj,
    });
  };

  updateCreateOrderFields = (e, type) => {
    var fieldValue = e.target.value;
    var coData = this.state.createOrderData; //Create Order Data.
    if (type == "fieldSeatno") {
      //coData.seatNumber = fieldValue; // Change of key seatNumber to deliveryseat
      coData.deliveryseat = fieldValue;
    } else if (type == "fieldFirstname") {
      coData.firstname = fieldValue
        .split("")
        .filter((item) => item.match(/^[a-zA-Z ]*$/i))
        .join("");
    } else if (type == "fieldLastname") {
      coData.lastname = fieldValue
        .split("")
        .filter((item) => item.match(/^[a-zA-Z ]*$/i))
        .join("");
    } else if (type == "fieldMobileno") {
      coData.phonenumber = fieldValue.replace(/[^0-9]/g, "");
    } else if (type == "fieldEmailid") {
      coData.email = fieldValue;
    } else if ((type = "termsAndConditions")) {
      coData.termsAndConditions = e.target.checked;
    }
    coData.fullname = (coData.firstname !== undefined ? coData.firstname : "") + " " + (coData.lastname !== undefined ? coData.lastname : "");
    this.setState(
      {
        createOrderData: coData,
      },
      () => {}
    );
  };

  handleOrderCreate = async () => {
    this.handleLoader(true);
    var dataOrderObj = this.state.createOrderData;
    await API.callEndpoint("POST", "Bearer", "/order/v1/orders", dataOrderObj)
      .then((response) => {
        //console.log(response.data[0].id);
        this.setState({
          orderId: response.data[0].id,
          paymentRedirect: true,
        });
        this.handleLoader(false);
      })
      .catch((error) => {
        this.handleLoader(false);
        var errorMsg = error.error;
        //var errorMsg = "Sorry, One or more of the items in your cart are no longer available. Please remove these items from your cart and checkout. \nToll House Chocolate Chip Cookie\nLrg Drink & Megatub\nKids Pack 2";
        var errorMsg0 = errorMsg.substring(0, errorMsg.indexOf("\n"));
        errorMsg0 = errorMsg0 != "" ? errorMsg0 + "<br><br>" : errorMsg0;
        var errorMsg1 = errorMsg.substring(errorMsg.indexOf("\n") + 1);
        errorMsg1 = errorMsg1.replace(/(?:\r\n|\r|\n)/g, "<br>");
        errorMsg = errorMsg0 + errorMsg1;
        Swal.fire({
          title: "Sorry",
          icon: "error",
          //text: error.error,
          html: errorMsg,
          width: 600,
          heightAuto: true,
          padding: "30",
          confirmButtonText: "Ok",
          confirmButtonColor: "#B32E34",
        });
      });
  };

  handleOrderGetPaymentId = (orderId) => {
    //console.log("Routing > handleOrderGetPaymentId()");
    API.callEndpoint("GET", "Bearer", `checkout/v1/payment-types?orderid=${orderId}`)
      .then((response) => {
        //////console.log(" payment id  ");
        //////console.log(response.data[0].id);
        //this.handleOrderCheckOut(orderId, response.data[0].id);
        //console.log(response.data);
        this.setState(
          {
            paymentTypes: response.data,
          },
          () => {
            this.handleLoader(false);
            //update apple pay payment id if apple pay is available in the browser [safari - default payment method - apple pay]
            if (window.ApplePaySession !== undefined) {
              this.handleOrderPaymentInit(orderId, this.state.paymentTypes[0].id);
            } else {
              this.handleOrderPaymentInit(orderId, this.state.paymentTypes[1].id);
            }
          }
        );
      })
      .catch((ex) => {
        //////console.log("Error");
        //////console.log(ex);
      });
  };

  handleOrderPaymentInit = (orderId, paymentId) => {
    //console.log("Routing > handleOrderPaymentInit()");
    //console.log("orderId: " + orderId);
    //console.log("paymentId: " + paymentId);
    //this.handleLoader(true);
    API.callEndpoint("POST", "Bearer", `checkout/v1/checkout/init`, {
      paymentid: [
        {
          id: `${paymentId}`,
        },
      ],
      orderid: `${orderId}`,
    })
      .then((response) => {
        //console.log(" Payment Init: ");
        //console.log(response.data);

        //this.setState({redirect: true, orderId});
        const strResponseData = JSON.stringify(response.data.response);
        // // //console.log("strResponseData");
        // // //console.log(strResponseData);
        // // const jsnResponseData = JSON.parse(strResponseData);
        // // //console.log("jsnResponseData");
        // // //console.log(jsnResponseData);
        this.setState(
          {
            paymentIframe: { paymentId: paymentId, iframe: strResponseData },
          },
          () => {
            this.handleLoader(false);
          }
        );
      })
      .catch((ex) => {
        this.handleLoader(false);
        ////////console.log("Error");
        ////////console.log(ex);
      });
  };

  addMessageListener = () => {
    window.addEventListener("message", this.handleMessage);
  };

  // handleMessage = (e) => {
  //   //console.log("handleMessage()");
  //   var message = e.data;
  //   //console.log("message: ");
  //   //console.log(message);
  //   var data = message.data;
  //   //console.log("data: ");
  //   //console.log(data);
  //   var iframeURL = JSON.parse(this.state.paymentIframe.iframe);
  //   //console.log("iframeURL: ");
  //   //console.log(iframeURL);
  //   var splitSrc = iframeURL.split('src="');
  //   //console.log(splitSrc[1]);
  //   var getSrc = splitSrc[1].split('">');
  //   //console.log(getSrc);
  //   var sessionKey = getSrc[0].split("sessionKey=");
  //   //console.log("sessionKey: " + sessionKey[1]);
  //   window.addEventListener("message", null);
  // };
  handleMessage = (e) => {
    var message = e.data,
      data = message.data;

    switch (message.type) {
      case 1:
        //// handleErrors(data);
        break;
      case 2:
        //// setFrameHeight(data);
        break;
      case 3:
        //// submitPayment(data);
        //console.log(data);
        //console.log(data.paymentKeys[0]);
        console.log("-------------------------------- handleMessage() ------------------------------");
        console.log("-------------------------------- handleMessage() ------------------------------");
        console.log(e);
        console.log("---------------------");
        var iframeURL = JSON.parse(this.state.paymentIframe.iframe);
        var splitSrc = iframeURL.split('src="');
        var getSrc = splitSrc[1].split('">');
        var sessionKey = getSrc[0].split("sessionKey=");
        let nameOnCard = "";
        try {
          if (data.paymentType === "GooglePay") {
            nameOnCard = data.attributes[0].Value.paymentMethodData.info.billingAddress.name;
          }
        } catch (e) {
          console.log(e);
        }
        this.setState(
          {
            paymentKeys: data.paymentKeys[0],
            sessionKey: sessionKey[1],
            nameOnCard,
          },
          () => {
            window.removeEventListener("message", this.handleMessage);
            this.handleOrderCheckOut();
          }
        );
        ////this.submitPaymentForm();
        break;
      case 4:
        //// handleValidityChange(data);
        break;
      case 15:
        //this.handleLegalClick(data);
        break;
    }
  };

  //handleOrderCheckOut = (orderId, paymentId) => {
  handleOrderCheckOut = () => {
    this.handleLoader(true);
    this.setState({ nameOnCard: " " });
    ////////console.log("Routing > handleOrderCheckOut()");
    //console.log("Routing > handleOrderCheckOut()");
    //console.log("this.state.paymentIframe.paymentId: " + this.state.paymentIframe.paymentId);
    //console.log("this.state.orderId: " + this.state.orderId);
    //console.log("this.state.sessionKey: " + this.state.sessionKey);
    //console.log("this.state.paymentKeys: " + this.state.paymentKeys);
    API.callEndpoint("POST", "Bearer", `checkout/v1/checkout`, {
      paymentid: [
        {
          //id: `${paymentId}`,
          id: this.state.paymentIframe.paymentId,
        },
      ],
      ////orderid: `${orderId}`,
      nameOnCard: this.state.nameOnCard === "" ? localStorage.getItem("creditCardNameOnCard") : this.state.nameOnCard,
      orderid: this.state.orderId,
      sessionKey: this.state.sessionKey,
      paymentKey: this.state.paymentKeys,
    })
      .then((response) => {
        this.handleLoader(false);
        var confirmationUrl = response.data.url;
        var redirectParams = confirmationUrl.split("/confirmation?");
        this.setState({ redirect: true, confirmationRedirectURL: redirectParams[1] });
      })
      .catch((ex) => {
        this.handleLoader(false);
        ////////console.log("Error");
        ////////console.log(ex);
      });
  };

  populateFullnameByType = (type, bookingFullname) => {
    ////////console.log("Routing > populateFullnameByType()");
    var valFullname = bookingFullname.split(" ");
    var returnVal = "";
    if (type == "Firstname") {
      returnVal = valFullname[0];
    } else {
      returnVal = valFullname[1];
    }
    return returnVal;
  };

  // Normal Flow(Without bookingId) > On Proceed
  handleSelectDetailsProceed = (selectedState) => {
    var self = this;
    this.setState(
      {
        loaderToggle: true,
        selectDetailsProceed: true,
        normalBookingInfoSelected: selectedState,
      },
      () => {
        this.props.navigate("/fnbmenu");
        this.setState(
          {
            loaderToggle: false,
          },
          () => {
            this.handleConfirmBooking(false);
          }
        );
      }
    );
  };

  updateInseatDeliverSlot = (slot, dtId) => {
    this.setState(
      {
        selectedInseatDeliverSlot: slot,
        selectedInseatDeliverSlotId: dtId,
      },
      () => {
        this.populateOrderPayload();
        var dtErrorEle = document.getElementById("errorDeliveryTimings");
        if (dtErrorEle !== null && dtErrorEle.style.display == "block") {
          dtErrorEle.style.display = "none";
        }
      }
    );
  };

  setSelectDetailsProceedFalse = () => {
    this.setState({
      selectDetailsProceed: false,
    });
  };

  selectBookingLocation = (location) => {
    ////////console.log("Routing > selectBookingLocation()");
    this.setState(
      {
        bookingLocation: location,
      },
      () => {
        //////////console.log( "selectBookingLocation() >>> after bookingLocation state set: " );
        //////////console.log(this.state.bookingLocation);
      }
    );
  };

  getBookingId = (event) => {
    var bookingIdVal = event.target.value;
    this.setState(
      {
        bookingId: bookingIdVal,
      },
      () => {
        if (this.state.bookingIdError) {
          this.setState({
            bookingIdError: false,
          });
        }
      }
    );
  };

  handleFindMyBookingSubmit = () => {
    ////////console.log("Routing > handleFindMyBookingSubmit()");
    //////////console.log("handleFindMyBookingSubmit() >>> Location: ");
    //////////console.log(this.state.bookingLocation);
    //////////console.log("handleFindMyBookingSubmit() >>> BookingId: ");
    //////////console.log(this.state.bookingId);
    //var cinemaId = this.state.bookingLocation.cinemaid;
    //var bookingId = this.state.bookingId;
    this.getBookingInfo();
  };

  populateItemModifierItems = (mgData, smData) => {
    ////////console.log("Routing > populateItemModifierItems()");
    ////////console.log(mgData);
    ////////console.log(smData);
    var modifierItemsAr = [];
    var modifierItemsSt = "";
    if (mgData.length > 0) {
      mgData.map((mgsItem) => {
        if (mgsItem.length > 0) {
          mgsItem.map((mgItem) => {
            if (mgItem.modifierItems.length > 0) {
              mgItem.modifierItems.map((miItem) => {
                //////////console.log(miItem.modifierItemName);
                //modifierItemsAr.push(miItem.modifierItemName);
                var minStr = miItem.modifierItemQuantity == 1 ? miItem.modifierItemName : miItem.modifierItemName + "(" + miItem.modifierItemQuantity + ")";
                modifierItemsAr.push(minStr);
              });
            }
          });
        }
      });
    }
    if (modifierItemsAr.length > 0) {
      //////////console.log("modifierItemsAr");
      //////////console.log(modifierItemsAr);
      modifierItemsSt = modifierItemsAr.join(", ");
      modifierItemsSt = smData.length > 0 ? modifierItemsSt + ", " : modifierItemsSt;
      //////////console.log("modifierItemsSt: " + modifierItemsSt);
    }
    return modifierItemsSt;
  };

  populateItemSmartModifierItems = (smgData) => {
    ////////console.log("Routing > populateItemSmartModifierItems()");
    //////////console.log(smgData);
    var smartModifierItemsAr = [];
    var smartModifierItemsSt = "";
    if (smgData.length > 0) {
      smgData.map((smgItem) => {
        if (smgItem.length > 0) {
          smgItem.map((smItem) => {
            //////////console.log(miItem.modifierItemName);
            //modifierItemsAr.push(miItem.modifierItemName);
            //////var minStr = smItem.smartModifierItemQuantity == 1 ? smItem.smartModifierItemName : smItem.smartModifierItemName + "(" + smItem.smartModifierItemQuantity + ")";
            var minStr = smItem.type == "side" ? smItem.smartModifierItemName + "(Add as Side)" : smItem.type == "remove" ? smItem.smartModifierItemName + "(Remove)" : smItem.smartModifierItemName;
            smartModifierItemsAr.push(minStr);
          });
        }
      });
    }
    if (smartModifierItemsAr.length > 0) {
      //////////console.log("smartModifierItemsAr");
      //////////console.log(smartModifierItemsAr);
      smartModifierItemsSt = smartModifierItemsAr.join(", ");
      //////////console.log("smartModifierItemsSt: " + smartModifierItemsSt);
    }
    return smartModifierItemsSt;
  };

  //Cart > Item(Per Row) Total Calculation.
  calculateItemRowTotal = (itemStrikeprice, itemVBT, itemQty, modifierGroupsData, dealItemFlag) => {
    var tempItemTotal = 0;
    tempItemTotal = tempItemTotal + itemVBT * itemQty;
    modifierGroupsData.map((mgsItem) => {
      if (mgsItem.length > 0) {
        mgsItem.map((mgItem) => {
          if (mgItem.modifierItems.length > 0) {
            mgItem.modifierItems.map((mItem, index) => {
              //var modifierItemTotal = mItem.modifierItemAmount * mItem.modifierItemQuantity * itemQty;
              /**
                //For after login strikeprice calculation: 
                //Instead of "this.state.cartData > item > modifierItemStrikeprice" used "this.state.cartData > item > Strikeprice" 
                //to calculate the modifier group > modifier item tax

                //For dealsItem > modifierItems we are not considering the following:
                //strikeprice(modifierItemStrikeprice), strikeValueBeforeTax(modifierItemStrikeValueBeforeTax) & strikeTaxValue(modifierItemStrikeTaxValue). 
              **/
              // var modifierItemTotal =
              //   itemStrikeprice == -1 || dealItemFlag
              //     ? mItem.modifierItemAmount * mItem.modifierItemQuantity * itemQty
              //     : mItem.modifierItemStrikeValueBeforeTax
              //     ? mItem.modifierItemStrikeValueBeforeTax * mItem.modifierItemQuantity * itemQty
              //     : 0;
              var modifierItemTotal =
                itemStrikeprice == -1 || dealItemFlag
                  ? mItem.modifierItemAmount * mItem.modifierItemQuantity * itemQty
                  : mItem.strikeprice != -1 || mItem.strikeprice != null
                  ? mItem.modifierItemStrikeValueBeforeTax * mItem.modifierItemQuantity * itemQty
                  : 0;
              tempItemTotal = tempItemTotal + modifierItemTotal;
            });
          }
        });
      }
    });
    tempItemTotal = "$" + parseFloat(tempItemTotal).toFixed(2) + "";
    return tempItemTotal;
  };

  //Cart - SubTotal Calculation.
  calculateCartSubtotal = (cData) => {
    ////////console.log("ColumnRight > calculateCartSubtotal()");
    //////////console.log(cData);
    var subTotal = 0;
    if (cData.length > 0) {
      cData.map((item) => {
        if (item.itemInCartFlag) {
          //subTotal = subTotal + item.valuebeforetax * item.quantity;
          subTotal = subTotal + (item.strikeprice == -1 || item.strikeprice == null ? item.valuebeforetax * item.quantity : item.strikeValueBeforeTax * item.quantity);
          if (item.modifierGroups.length > 0) {
            item.modifierGroups.map((mgsItem) => {
              if (mgsItem.length > 0) {
                mgsItem.map((mgItem) => {
                  if (mgItem.modifierItems.length > 0) {
                    mgItem.modifierItems.map((mItem) => {
                      //subTotal = subTotal + mItem.modifierItemAmount * mItem.modifierItemQuantity * item.quantity;
                      /**
                        //For after login strikeprice calculation: 
                        //Instead of "this.state.cartData > item > modifierItemStrikeprice" used "this.state.cartData > item > Strikeprice" 
                        //to calculate the modifier group > modifier item tax

                        //For dealsItem > modifierItems we are not considering the following:
                        //strikeprice(modifierItemStrikeprice), strikeValueBeforeTax(modifierItemStrikeValueBeforeTax) & strikeTaxValue(modifierItemStrikeTaxValue). 
                      **/
                      // subTotal =
                      //   subTotal +
                      //   (item.strikeprice == -1 || item.dealItem
                      //     ? mItem.modifierItemAmount * mItem.modifierItemQuantity * item.quantity
                      //     : mItem.modifierItemStrikeValueBeforeTax
                      //     ? mItem.modifierItemStrikeValueBeforeTax * mItem.modifierItemQuantity * item.quantity
                      //     : 0);
                      subTotal =
                        subTotal +
                        (item.strikeprice == -1 || item.strikeprice == null || item.dealItem
                          ? mItem.modifierItemAmount * mItem.modifierItemQuantity * item.quantity
                          : mItem.strikeprice != -1 || mItem.strikeprice != null
                          ? mItem.modifierItemStrikeValueBeforeTax * mItem.modifierItemQuantity * item.quantity
                          : 0);
                    });
                  }
                });
              }
            });
          }
        }
      });
    }
    subTotal = subTotal.toFixed(2);
    return "$" + subTotal;
  };

  //Cart - Tax Calculation.
  calculateCartTax = (cData) => {
    ////////console.log("ColumnRight > calculateCartTax()");
    //////////console.log(cData);
    var taxTotal = 0;
    if (cData.length > 0) {
      cData.map((item) => {
        if (item.itemInCartFlag) {
          //taxTotal = taxTotal + item.taxValue * item.quantity;
          taxTotal = taxTotal + (item.strikeprice == -1 || item.strikeprice == null ? item.taxValue * item.quantity : item.strikeTaxValue * item.quantity);
          if (item.modifierGroups.length > 0) {
            item.modifierGroups.map((mgsItem) => {
              if (mgsItem.length > 0) {
                mgsItem.map((mgItem) => {
                  if (mgItem.modifierItems.length > 0) {
                    mgItem.modifierItems.map((mItem) => {
                      //taxTotal = taxTotal + mItem.modifierItemTax * mItem.modifierItemQuantity * item.quantity;
                      /**
                        //For after login strikeprice calculation: 
                        //Instead of "this.state.cartData > item > modifierItemStrikeprice" used "this.state.cartData > item > Strikeprice" 
                        //to calculate the modifier group > modifier item tax

                        //For dealsItem > modifierItems we are not considering the following:
                        //strikeprice(modifierItemStrikeprice), strikeValueBeforeTax(modifierItemStrikeValueBeforeTax) & strikeTaxValue(modifierItemStrikeTaxValue). 
                      **/
                      // taxTotal =
                      //   taxTotal +
                      //   (item.strikeprice == -1 || item.dealItem
                      //     ? mItem.modifierItemTax * mItem.modifierItemQuantity * item.quantity
                      //     : mItem.modifierItemStrikeTaxValue
                      //     ? mItem.modifierItemStrikeTaxValue * mItem.modifierItemQuantity * item.quantity
                      //     : 0);
                      taxTotal =
                        taxTotal +
                        (item.strikeprice == -1 || item.dealItem
                          ? mItem.modifierItemTax * mItem.modifierItemQuantity * item.quantity
                          : mItem.strikeprice != -1 || mItem.strikeprice != null
                          ? mItem.modifierItemStrikeTaxValue * mItem.modifierItemQuantity * item.quantity
                          : 0);
                    });
                  }
                });
              }
            });
          }
        }
      });
    }
    taxTotal = taxTotal.toFixed(2);
    return "$" + taxTotal;
  };

  //Cart - Grand Total Calculation.
  calculateCartGrandTotal = (cData) => {
    ////////console.log("ColumnRight > calculateCartGrandTotal()");
    //////////console.log(cData);
    var grandTotal = 0;
    var taxTotal = 0;
    var cartGrandTotal = 0;
    if (cData.length > 0) {
      cData.map((item) => {
        if (item.itemInCartFlag) {
          //grandTotal = grandTotal + item.valuebeforetax * item.quantity;
          grandTotal = grandTotal + (item.strikeprice == -1 || item.strikeprice == null ? item.valuebeforetax * item.quantity : item.strikeValueBeforeTax * item.quantity);
          //////////console.log("grandTotal: " + grandTotal);
          if (item.modifierGroups.length > 0) {
            item.modifierGroups.map((mgsItem) => {
              if (mgsItem.length > 0) {
                mgsItem.map((mgItem) => {
                  if (mgItem.modifierItems.length > 0) {
                    mgItem.modifierItems.map((mItem) => {
                      //grandTotal = grandTotal + mItem.modifierItemAmount * mItem.modifierItemQuantity * item.quantity + mItem.modifierItemTax * mItem.modifierItemQuantity * item.quantity;
                      /**
                        //For after login strikeprice calculation: 
                        //Instead of "this.state.cartData > item > modifierItemStrikeprice" used "this.state.cartData > item > Strikeprice" 
                        //to calculate the modifier group > modifier item tax

                        //For dealsItem > modifierItems we are not considering the following:
                        //strikeprice(modifierItemStrikeprice), strikeValueBeforeTax(modifierItemStrikeValueBeforeTax) & strikeTaxValue(modifierItemStrikeTaxValue). 
                      **/
                      // var modifierItemTotal =
                      //   item.strikeprice == -1 || item.dealItem
                      //     ? mItem.modifierItemAmount * mItem.modifierItemQuantity * item.quantity
                      //     : mItem.modifierItemStrikeValueBeforeTax
                      //     ? mItem.modifierItemStrikeValueBeforeTax * mItem.modifierItemQuantity * item.quantity
                      //     : 0;
                      // var modifierItemTaxTotal =
                      //   item.strikeprice == -1 || item.dealItem
                      //     ? mItem.modifierItemTax * mItem.modifierItemQuantity * item.quantity
                      //     : mItem.modifierItemStrikeTaxValue
                      //     ? mItem.modifierItemStrikeTaxValue * mItem.modifierItemQuantity * item.quantity
                      //     : 0;
                      var modifierItemTotal =
                        item.strikeprice == -1 || item.dealItem
                          ? mItem.modifierItemAmount * mItem.modifierItemQuantity * item.quantity
                          : mItem.strikeprice != -1 || mItem.strikeprice != null
                          ? mItem.modifierItemStrikeValueBeforeTax * mItem.modifierItemQuantity * item.quantity
                          : 0;
                      var modifierItemTaxTotal =
                        item.strikeprice == -1 || item.dealItem
                          ? mItem.modifierItemTax * mItem.modifierItemQuantity * item.quantity
                          : mItem.strikeprice != -1 || mItem.strikeprice != null
                          ? mItem.modifierItemStrikeTaxValue * mItem.modifierItemQuantity * item.quantity
                          : 0;
                      grandTotal = grandTotal + modifierItemTotal + modifierItemTaxTotal;
                      //////////console.log("grandTotal: " + grandTotal);
                    });
                  }
                });
              }
            });
          }
          taxTotal = taxTotal + (item.strikeprice == -1 || item.strikeprice == null ? item.taxValue * item.quantity : item.strikeTaxValue * item.quantity);
        }
      });
    }
    //////////console.log("grandTotal: " + grandTotal);
    //////////console.log("taxTotal: " + taxTotal);
    cartGrandTotal = grandTotal + taxTotal;
    //////////console.log("cartGrandTotal: " + cartGrandTotal);
    cartGrandTotal = cartGrandTotal.toFixed(2);

    //On Partial Giftcard.
    if (this.state.redeemedGiftcards.length > 0) {
      //console.log("cartGrandTotal before giftcard: " + cartGrandTotal);
      var gfTotal = 0;
      var redeemedGiftcards = this.state.redeemedGiftcards;
      redeemedGiftcards.map((giftcartItem) => {
        if (giftcartItem.orders_paymenttypes.length > 0)
          giftcartItem.orders_paymenttypes.map((ptItem, index) => {
            if (ptItem.type == "giftcard") {
              gfTotal = gfTotal + ptItem.amount;
            }
          });
      });
      cartGrandTotal = (cartGrandTotal - gfTotal).toFixed(2);
      //console.log("cartGrandTotal after giftcard: " + cartGrandTotal);
    }

    return "$" + cartGrandTotal;
  };

  handleInCartFnbItemQuantity = (event, counterFlag, fnbItem, index) => {
    var curObj = jQuery(event.target);
    var parentObj = curObj.parents(".itemCounter");
    var counterQuantity = parseInt(parentObj.find("input[type=text][readonly]").val());
    var tempCartData = this.state.cartData;
    if (counterFlag == "countIncrement") {
      fnbItem.repeatIndex = index;
      this.setState(
        {
          repeatItemData: fnbItem,
          repeatItemIndex: index,
        },
        () => {
          var getTabIndex = this.state.fnbMenuItems.findIndex((x) => x.id === fnbItem.tabId);
          /*Find tab index for deal items*/
          if (getTabIndex == -1 && fnbItem.dealItem == true) {
            this.state.fnbMenuItems.map((fnbTabItem, index) => {
              var fnbMenuItems = fnbTabItem.fnbtabs_items;
              var fnbMenuItemsIndex = fnbMenuItems.findIndex((x) => x.id === fnbItem.id);
              if (fnbMenuItemsIndex != -1) {
                getTabIndex = index;
              }
            });
          }
          /*E.O.Find tab index for deal items*/
          var getItemIndex = this.state.fnbMenuItems[getTabIndex].fnbtabs_items.findIndex((x) => x.id === fnbItem.id);
          var selectedItemOriginalData = this.state.fnbMenuItems[getTabIndex].fnbtabs_items[getItemIndex];

          if (getItemIndex == -1) {
            this.state.fnbMenuItems[getTabIndex].fnbtabs_items.map((fnbTabItem, index) => {
              if (fnbTabItem.fnbs_alternateitems && fnbTabItem.fnbs_alternateitems.length > 0) {
                var altItemIndex = fnbTabItem.fnbs_alternateitems.findIndex((x) => x.id === fnbItem.id);
                if (altItemIndex != -1) {
                  console.log("if > altItemIndex: " + altItemIndex);
                  getItemIndex = index;
                  console.log("if > altItemIndex > getItemIndex: " + getItemIndex);
                  selectedItemOriginalData = this.state.fnbMenuItems[getTabIndex].fnbtabs_items[getItemIndex].fnbs_alternateitems[altItemIndex];
                } else {
                  console.log("else > altItemIndex1: " + altItemIndex);
                }
              }
            });
          }

          if (selectedItemOriginalData.modifierGroups.length == 0 && selectedItemOriginalData.smartModifiers.length == 0) {
            this.handleRepeatPreviousSelection();
          } else {
            var repeatModalEl = document.getElementById("repeatItem");
            var myModal = new Modal(repeatModalEl);
            myModal.show();
          }
        }
      );
    } else {
      counterQuantity = counterQuantity > 0 ? counterQuantity - 1 : 0;
      //////* if (counterQuantity <= 0 && !parentObj.hasClass("iczActive")) {
      //////   parentObj.addClass("iczActive");
      //////   parentObj.find(".icControl.iccDecrement").addClass("disabled");
      ////// }*/
      parentObj.find("input[type=text][readonly]").val(counterQuantity);
      if (index != -1) {
        if (counterQuantity <= 0) {
          tempCartData.splice(index, 1);
        } else {
          tempCartData[index].quantity = counterQuantity;
        }
      }

      this.setState({ cartData: tempCartData }, () => {
        this.loadStateData();
      });
    }

    //this.setState({ cartData: tempCartData, });
  };
  handleRepeatillChoose = (event) => {
    var tempCartData = this.state.cartData;
    var tempRepeatItemData = this.state.repeatItemData;
    var tempRepeatItemDataId = tempRepeatItemData.id;
    ////////console.log("tempRepeatItemDataId: " + tempRepeatItemDataId);
    //Find tabId(Fnb tabId from cartData).
    // var cartFnbTabIndex = tempCartData.findIndex((x) => x.id == tempRepeatItemDataId);
    var cartFnbTabIndex = tempRepeatItemData.repeatIndex;
    ////////console.log("cartFnbTabIndex: " + cartFnbTabIndex);
    if (cartFnbTabIndex != -1) {
      var cartFnbTabId = tempCartData[cartFnbTabIndex].tabId;

      //Find the tab index from this.state.fnbMenuItems.
      var fnbTabIndex = this.state.fnbMenuItems.findIndex((x) => x.id == cartFnbTabId);
      ////////console.log("fnbTabIndex: " + fnbTabIndex);

      /*Find tab index for deal items*/
      if (fnbTabIndex == -1 && tempRepeatItemData.dealItem == true) {
        this.state.fnbMenuItems.map((fnbTabItem, index) => {
          var fnbMenuItems = fnbTabItem.fnbtabs_items;
          var fnbMenuItemsIndex = fnbMenuItems.findIndex((x) => x.id === tempRepeatItemDataId);
          if (fnbMenuItemsIndex != -1) {
            fnbTabIndex = index;
          }
        });
      }

      if (fnbTabIndex !== -1) {
        //Find the fnb item index from this.state.fnbMenuItems[fnbTabIndex].
        var tabData = this.state.fnbMenuItems[fnbTabIndex].fnbtabs_items;
        ////////console.log("tabData: " + tabData);
        var fnbItemIndex = tabData.findIndex((x) => x.id == tempRepeatItemDataId);
        ////////console.log("fnbItemIndex: " + fnbItemIndex);
        if (fnbItemIndex != -1) {
          var fnbItem = this.state.fnbMenuItems[fnbTabIndex].fnbtabs_items[fnbItemIndex];
          var tabId = this.state.fnbMenuItems[fnbTabIndex].id;
          var tabName = this.state.fnbMenuItems[fnbTabIndex].tabName;
          var dealItemFlag = this.state.fnbMenuItems[fnbTabIndex].dealItem;
          var ageRestrictionFlag = this.state.fnbMenuItems[fnbTabIndex].dealItem;
          setTimeout(() => {
            this.setFnbItemModifierData(fnbItem, tabId, tabName, dealItemFlag, ageRestrictionFlag);
          }, 500);
        }
      }
    }
  };

  handleRepeatPreviousSelection = (event) => {
    var tempRepeatItemData = this.state.repeatItemData;
    var tempRepeatItemDataQty = tempRepeatItemData.quantity;

    var tempCartData = this.state.cartData;
    var findRepeatItemIndex = tempRepeatItemData.repeatIndex;
    if (findRepeatItemIndex != -1) {
      tempCartData[findRepeatItemIndex].quantity = tempRepeatItemDataQty + 1;
      this.setState(
        {
          cartData: tempCartData,
        },
        () => {
          //console.log("setting data");
          this.loadStateData();
        }
      );
    }
  };

  handleRepeatItemDataFlush = () => {
    this.setState({
      repeatItemData: {},
    });
  };

  handleMembersLoginModal = (toggleFlag) => {
    ////console.log("Routing > handleMembersLoginModal");
    // const containerEle = document.getElementById("membersLogin");
    // const membersLoginModal = new Modal(containerEle);
    ////console.log("toggleFlag: " + toggleFlag);
    if (toggleFlag == "modalShow") {
      ////console.log("toggleFlag == modalShow");
      membersLoginModal.show();
    }
    if (toggleFlag == "modalHide") {
      ////console.log("toggleFlag == modalHide");
      membersLoginModal.hide();
    }
  };

  handleOnchangeMemberPricing = (e) => {
    ////console.log("Routing > handleOnchangeMemberPricing()");
    //////console.log(e.target.checked);
    if (e.target.checked) {
      var targetElement = e.target;
      jQuery(targetElement).prop("disabled", true);
      //var myModal = new Modal(document.getElementById("membersLogin"));
      //myModal.show();
      this.handleMembersLoginModal("modalShow");
      document.getElementById("memberLoginError").value = "";
      document.getElementById("memberLoginError").style.display = "none";
      document.getElementById("loginModalLoginButtonDiv").style.paddingTop = "40px";
    } else {
      return false;
    }
  };

  handleLoginFieldsOnChanges = (event, type) => {
    var fieldValue = event.target.value;
    var userNameEle = document.getElementById("fieldUsername");
    var passwordEle = document.getElementById("fieldPassword");
    if (type == "loginUserName" && userNameEle.classList.contains("validationError")) {
      userNameEle.classList.remove("validationError");
    }
    if (type == "loginPassword" && passwordEle.classList.contains("validationError")) {
      passwordEle.classList.remove("validationError");
    }
    this.setState(
      {
        [type]: fieldValue,
      },
      () => {
        document.getElementById("memberLoginError").style.display = "none";
        document.getElementById("loginModalLoginButtonDiv").style.paddingTop = "40px";
      }
    );
  };

  handleUserLogin = () => {
    //////console.log("Routing > handleUserLogin()");
    var data = new Object();
    data.accessTokenExpiry = accessTokenExpiry;
    data.keepMeSignedIn = true;
    data.getUserInfo = true;
    if (this.state.loginUserName == "") {
      document.getElementById("fieldUsername").classList.add("validationError");
      return false;
    } else if (this.state.loginUserName != "") {
      //Don't remember from where i copied this code, but this works.
      let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (re.test(this.state.loginUserName)) {
        document.getElementById("fieldUsername").classList.remove("validationError");
        this.handleLoader(true);
      } else {
        document.getElementById("fieldUsername").classList.add("validationError");
        return false;
      }
    } else {
      document.getElementById("fieldUsername").classList.remove("validationError");
      this.handleLoader(true);
    }

    if (this.state.loginPassword == "") {
      document.getElementById("fieldPassword").classList.add("validationError");
      return false;
    } else {
      document.getElementById("fieldPassword").classList.remove("validationError");
      this.handleLoader(true);
    }

    axios({
      url: process.env.REACT_APP_baseurl + "user/v1/token",
      method: "POST",
      data: data,
      auth: {
        username: this.state.loginUserName,
        password: this.state.loginPassword,
      },
    })
      .then((response) => {
        document.cookie = "accessToken=" + response.data.accessToken;
        document.cookie = "refreshToken=" + response.data.refreshToken;
        document.cookie = "firstname=" + response.data.firstname;
        document.cookie = "lastname=" + response.data.lastname;
        document.cookie = "loggedin=true";
        localStorage.setItem("afterLoginToken", JSON.stringify(response.data));
        var cinemaId = Object.keys(this.state.normalBookingInfoSelected).length !== 0 ? this.state.normalBookingInfoSelected.locationId : this.state.bookingInfo.cinema.cinemas_locations[0].pid;
        //var sessionId = Object.keys(this.state.normalBookingInfoSelected).length !== 0 ? this.state.normalBookingInfoSelected.sessionId : this.state.bookingInfo.sessionid;
        /* 
        //For Sessionid from this.state.bookingInfo/this.state.normalBookingInfoSelected:
          #1) Movie booking flow => this.state.bookingInfo.sessionid 
          #2) Seat QR Scan flow => this.state.bookingInfo.id 
          #3) Manual selection flow => this.state.normalBookingInfoSelected.sessionId
        */
        var sessionId =
          Object.keys(this.state.normalBookingInfoSelected).length !== 0
            ? this.state.normalBookingInfoSelected.sessionId
            : Object.keys(this.state.bookingInfo).length !== 0
            ? this.state.bookingInfo.sessionid
              ? this.state.bookingInfo.sessionid
              : this.state.bookingInfo.id
            : "";

        let createOrderData = this.state.createOrderData;
        try {
          createOrderData.firstname = response.data.firstname;
          createOrderData.lastname = response.data.lastname;
          createOrderData.fullname = response.data.firstname + " " + response.data.lastname;
          createOrderData.email = response.data.email;
          createOrderData.phonenumber = response.data.phonenumber;
        } catch (e) {
          console.log(e);
        }
        this.setState(
          {
            createOrderData,
            afterLoginToken: response.data,
            loginUserName: "",
            loginPassword: "",
            // fnbMenuItems: [],
            // deals: [],
          },
          () => {
            this.handleMembersLoginModal("modalHide");
            this.setMemberLoginState(true);
            this.getMenuItems(cinemaId, sessionId);
            if (constant.today_deals) {
              this.getDeals(cinemaId);
            }
          }
        );
      })
      .catch((error) => {
        if (error.response) {
          document.getElementById("memberLoginError").innerText = error.response.data.message;
        }
        // this.setMemberLoginState(false);
        document.getElementById("memberLoginError").style.display = "block";
        document.getElementById("loginModalLoginButtonDiv").style.paddingTop = "20px";

        this.handleLoader(false);
      });
  };

  loadStateData = () => {
    localStorage.setItem("stateData", JSON.stringify(this.state));
  };
  formatTime = (time) => {
    var timeArray = time.split("T")[1].split(":");
    var hours = timeArray[0] > 12 ? timeArray[0] - 12 : timeArray[0];
    var minutes = timeArray[1];
    var meridian = timeArray[0] >= 12 ? "PM" : "AM";
    return hours + ":" + minutes + " " + meridian;
  };

  afterLoginUpdateCart = () => {
    //console.log("Routing > afterLoginUpdateCart()");
    var tempCartData = this.state.cartData;
    ////console.log(tempCartData);
    var fnbMenuItems = this.state.fnbMenuItems;
    tempCartData.map((tcdItem) => {
      if (tcdItem.dealItem == false) {
        var menuTabIndex = fnbMenuItems.findIndex((x) => x.id === tcdItem.tabId);
        //////console.log("menuTabIndex: " + menuTabIndex);
        if (menuTabIndex != -1) {
          var tabFnbItems = fnbMenuItems[menuTabIndex].fnbtabs_items;
          //////console.log("tabFnbItems: ");
          //////console.log(tabFnbItems);
          var fnbItemIndex = tabFnbItems.findIndex((x) => x.id == tcdItem.id);
          //////console.log("fnbItemIndex: " + fnbItemIndex);
          if (fnbItemIndex != -1) {
            tcdItem.strikeprice = fnbMenuItems[menuTabIndex].fnbtabs_items[fnbItemIndex].strikeprice;
          } else {
            console.log(">>>>>>>>>> ========== <<<<<<<<<<");
            console.log("fnbItemIndex: " + fnbItemIndex);
            console.log("tabFnbItems: ");
            console.log(tabFnbItems);
            tabFnbItems.map((fnbItem, index) => {
              var fnbAlternateItems = fnbItem.fnbs_alternateitems;
              if (fnbAlternateItems && fnbAlternateItems.length > 0) {
                var altItemIndex = fnbAlternateItems.findIndex((x) => x.id == tcdItem.id);
                console.log("altItemIndex: " + altItemIndex);
                if (altItemIndex != -1) {
                  fnbItemIndex = index;
                  console.log("fnbItemIndex: " + fnbItemIndex);
                  tcdItem.strikeprice = fnbMenuItems[menuTabIndex].fnbtabs_items[fnbItemIndex].fnbs_alternateitems[altItemIndex].strikeprice;
                }
              }
            });
            console.log(">>>>>>>>>> ========== <<<<<<<<<<");
          }
        }
      }
    });
    //////console.log("Routing > afterLoginUpdateCart() > tempCartData");
    //////console.log(tempCartData);
    this.setState({
      cartData: tempCartData,
    });
  };

  handleQrScanFromSeat = () => {
    ////console.log("Routing > handleQrScanFromSeat()");
    const params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop) => searchParams.get(prop),
    });
    //API.callEndpoint("GET", "Bearer", "cms/v1/sessionbyattributes?cinemaid=8859&screenname=%239&screennumber=9&scantime=2022-03-24 14:00", "")
    //API.callEndpoint("GET", "Bearer", "cms/v1/sessionbyattributes?cinemaid=8859&screennumber=9", "")
    API.callEndpoint("GET", "Bearer", "cms/v1/sessionbyattributes?cinemaid=" + params.cinemaid + "&screennumber=" + params.screennumber, "")
      .then((response) => {
        var locationIndex = this.state.locations.findIndex((x) => x.cinemaid == params.cinemaid);
        if (locationIndex == -1) {
          jQuery(".pcpfnbConfirmbooking[data-id='withBookingId']").slideUp(function () {
            setTimeout(() => {
              jQuery(".pcpfnbConfirmbooking#locationComingSoonBlock").slideDown();
            }, 200);
          });
        }
        this.setState(
          {
            bookingInfo: {
              ...response.data,
              //cinemaid: params.cinemaid,
              cinema: locationIndex != -1 ? this.state.locations[locationIndex] : {},
              seatNumber: params.seatrow + params.seatnumber,
            },
            bookingURLCinemaId: locationIndex != -1 ? params.cinemaid : "",
          },
          () => {
            if (Object.keys(this.state.bookingInfo).length !== 0) {
              ////////console.log("componentDidUpdate() >>> Object Keys > 0: ");
              var cinemaId = this.state.bookingInfo.cinemaid;
              var sessionId = this.state.bookingInfo.id;
              this.getMenuItems(cinemaId, sessionId);
              if (constant.today_deals) {
                this.getDeals(cinemaId);
              }
            }
            this.handleLoader(false);
          }
        );
      })
      .catch((error) => {
        ////console.log("Error: handleQrScanFromSeat()");
        ////console.log(error.error);
        //alert(error.error)
        Swal.fire({
          title: "Sorry",
          icon: "error",
          // text: `${
          //   error.error === "Sorry the ordering window for this session is currently unavailable. Proceed to order anyway?"
          //     ? "The ordering window for this showtime is currently unavailable now."
          //     : error.error
          // } `,
          text: `${
            error.error === "Sorry the ordering window for this session is currently unavailable. Proceed to order anyway?"
              ? "Ordering is applicable within 30 minutes before & 45 minutes after Showtime."
              : error.error
          } `,
          width: 600,
          heightAuto: true,
          padding: "30",
          confirmButtonText: "Proceed to order",
          confirmButtonColor: "#B32E34",
        }).then((result) => {
          window.location.href = window.location.origin;
        });
      });
  };

  setToggleWithoutBookingId = (toggleFlag) => {
    //////console.log("setToggleWithoutBookingId()");
    this.setState(
      {
        toggleWithoutBookingId: toggleFlag,
      },
      () => {
        //console.log("this.state.toggleWithoutBookingId: " + this.state.toggleWithoutBookingId);
      }
    );
  };

  //Giftcard Payment.
  handleGiftcardApply = (giftcardNumber) => {
    //console.log("handleGiftcardApply()");
    window.removeEventListener("message", this.handleMessage);
    //Reset Error.
    var displErrorEl = document.getElementById("giftCardApplyError");
    displErrorEl.innerHTML = "";
    displErrorEl.style.display = "";
    this.handleLoader(true);
    API.callEndpoint("GET", "Bearer", "order/v1/giftcard?cardno=" + giftcardNumber, "")
      .then((response) => {
        //console.log("<=== handleGiftcardApply > response.data ===>");
        //console.log(response.data);
        var giftcardData = response.data;
        if (giftcardData.cardNumber && giftcardData.cardNumber == giftcardNumber) {
          var orderId = this.state.orderId;
          API.callEndpoint("POST", "Bearer", "order/v1/orders/" + orderId + "/giftcard", { giftcardno: giftcardNumber })
            .then((response) => {
              //console.log("handleGiftcardApply > Giftcard - Payment:");
              //console.log(response.data);
              //console.log("response.data.remainingOrderValue: " + response.data.remainingOrderValue);
              var tempredeemedGiftcards = this.state.redeemedGiftcards;
              tempredeemedGiftcards.push(response.data);
              this.setState(
                {
                  redeemedGiftcards: tempredeemedGiftcards,
                },
                () => {
                  if (response.data.remainingOrderValue == 0) {
                    //console.log("this.state.redeemedGiftcards: ");
                    //console.log(this.state.redeemedGiftcards);
                    //order/v1/orders/:orderid/commitzerovalueorder
                    API.callEndpoint("POST", "Bearer", "order/v1/orders/" + orderId + "/commitzerovalueorder", "")
                      .then((response) => {
                        //console.log("handleGiftcardApply > Giftcard - Payment > commitzerovalueorder");
                        var resData = response.data;
                        //console.log(resData);
                        //console.log("Code: " + resData.code);
                        if (resData.data[0].status == "success") {
                          //http://localhost:3000/confirmation?id=2b6d5dae-9781-415e-86f6-61e43d3ebebe&status=success
                          var redirectParams = "id=" + orderId + "&status=success";
                          //console.log("redirectParams: " + redirectParams);
                          this.setState({ redirect: true, confirmationRedirectURL: redirectParams });
                        }
                      })
                      .catch((error) => {
                        //console.log("Error: handleGiftcardApply() > Giftcard - Payment > commitzerovalueorder");
                        //console.log(error);
                      });
                  } else {
                    //console.log("After Giftcard Applied - Split Payment.");
                    this.handleLoader(false);
                    //document.getElementById("textboxGiftcard").value = "";
                    //document.getElementById("giftCardApplyBtn").classList.add("disabled");
                    window.addEventListener("message", this.handleMessage);
                  }
                }
              );
            })
            .catch((error) => {
              this.handleLoader(false);
              this.setState({ giftCardResponse: error.error });
              window.addEventListener("message", this.handleMessage);
            });
        }
      })
      .catch((error) => {
        //////console.log("Error: handleGiftcardApply()");
        //////console.log(error);
        displErrorEl.innerHTML = error.error;
        displErrorEl.style.display = "block";
        this.handleLoader(false);
        window.addEventListener("message", this.handleMessage);
      });
  };

  //Cart - Remove Redeemed Giftcard.
  removeRedemeedGiftcard = (giftcardNumber) => {
    //console.log("removeRedemeedGiftcard()");
    //console.log("giftcardNumber: " + giftcardNumber);
    this.handleLoader(true);
    //{{order-service}}/orders/{{orderid}}/giftcard
    var orderId = this.state.orderId;
    API.callEndpoint("DELETE", "Bearer", "order/v1/orders/" + orderId + "/giftcard", "")
      .then((response) => {
        //console.log("Success: removeRedemeedGiftcard()");
        //console.log(response.data);
        this.setState(
          {
            redeemedGiftcards: [],
          },
          () => {
            this.handleLoader(false);
          }
        );
      })
      .catch((error) => {
        //console.log("Error: removeRedemeedGiftcard()");
        //console.log(error);
      });
  };

  //Cart - Giftcard Total.
  calculateRedemeedGiftcardTotal = (redeemedGiftcards) => {
    //console.log("calculateRedemeedGiftcardTotal()");
    //console.log(redeemedGiftcards);
    var gfTotal = 0;
    redeemedGiftcards.map((giftcartItem) => {
      if (giftcartItem.orders_paymenttypes.length > 0)
        giftcartItem.orders_paymenttypes.map((ptItem, index) => {
          if (ptItem.type == "giftcard") {
            gfTotal = gfTotal + ptItem.amount;
          }
        });
    });
    return "- $" + gfTotal.toFixed(2) + "";
  };

  //Populate deliveryTimings.
  getDeliveryTimings = (sessionId) => {
    //console.log("Routing > getDeliveryTimings()");
    // this.setState(
    //   {
    //     deliveryTimings: [],
    //   },
    //   () => {
    //     API.callEndpoint("GET", "Bearer", "/cms/v1/deliverytimings?sessionid=" + sessionId + "", "")
    //       .then((response) => {
    //         this.setState({
    //           deliveryTimings: response.data,
    //         });
    //       })
    //       .catch((error) => {
    //         console.log("Error: getDeliveryTimings()");
    //         console.log(error);
    //       });
    //   }
    // );
    API.callEndpoint("GET", "Bearer", "/cms/v1/deliverytimings?sessionid=" + sessionId + "", "")
      .then((response) => {
        this.setState(
          {
            deliveryTimings: response.data,
          },
          () => {
            if (this.state.deliveryTimings.length == 1) {
              var dtData = this.state.deliveryTimings[0];
              var dtText = "";
              if (dtData.additionalinfo.time == "0") {
                dtText = "at showtime";
              } else if (dtData.additionalinfo.time == "-15") {
                dtText = "15 mins before showtime";
              } else if (dtData.additionalinfo.time == "45") {
                dtText = "ASAP";
              }
              if (dtText != "") {
                this.updateInseatDeliverSlot(dtText, dtData.id);
              }
            }
          }
        );
      })
      .catch((error) => {
        //console.log("Error: getDeliveryTimings()");
        //console.log(error);
      });
  };

  refundInitGetBookingId = (event) => {
    var fieldValue = event.target.value.trim();
    var refundSubmitEle = document.getElementById("btnRefundBookingOkay");
    if (fieldValue != this.state.refundInitBookingId && refundSubmitEle != null && refundSubmitEle.classList.contains("disabled")) {
      refundSubmitEle.classList.remove("disabled");
    }
    //if (fieldValue != "") {
    this.setState(
      {
        refundInitBookingId: fieldValue,
      },
      () => {
        var errorInvlidBookingIdEleDisp = document.getElementById("errorInvlidBookingId").style.display;
        if (errorInvlidBookingIdEleDisp == "block") {
          document.getElementById("errorInvlidBookingId").style.display = "none";
        }
      }
    );
    //}
  };

  refundInitGetOrderInfo = () => {
    this.handleLoader(true);
    var bookingId = this.state.refundInitBookingId;
    ////console.log("bookingId: " + bookingId);
    //https://apidevshowplaceicon.influx.co.in/order/v1/bookings?bookingid=&email=
    API.callEndpoint("GET", "Bearer", "/order/v1/bookings?bookingid=" + bookingId + "", "")
      .then((response) => {
        ////console.log(response.data);
        this.setState(
          {
            refundInitBookingInfo: response.data.length != 0 ? response.data[0] : {},
            refundBookingOrderID: response.data.length != 0 ? response.data[0].id : "",
          },
          () => {
            ////console.log("this.state.refundInitBookingInfo:");
            ////console.log(this.state.refundInitBookingInfo);
            if (Object.keys(this.state.refundInitBookingInfo).length != 0) {
              this.refundPopulatePaymentMethod();
              //this.refundCalculateTips();
              this.refundCalculateTax();
              this.refundCalculateSubTotal();

              document.getElementById("orderCancellationInitFnbSummary").style.display = "";
              document.getElementById("errorInvlidBookingId").style.display = "none";
              /*document.getElementById("fieldOrderId").setAttribute("readonly", true);*/
              document.getElementById("btnRefundBookingOkay").classList.add("disabled");
              jQuery("#orderCancellationInitFnbSummary").slideDown(() => {
                this.handleLoader(false);
              });
            } else {
              this.setState({
                refundSummaryTips: false,
                refundSummaryTax: false,
                refundSummarySubTotal: false,
                refundSummaryPaymentMethod: [],
              });
              document.getElementById("orderCancellationInitFnbSummary").style.display = "none";
              document.getElementById("errorInvlidBookingId").style.display = "block";
              this.handleLoader(false);
            }
          }
        );

        // this.setState(
        //   {
        //     refundInitBookingInfo: true,
        //   },
        //   () => {
        //     jQuery("#orderCancellation #fieldOrderId").attr("readonly", true);
        //     //jQuery("#orderCancellation .btnswrap.mlfAction").addClass("d-none");
        //     jQuery("#orderCancellation #btnRefundBookingOkay").addClass("disabled");
        //     jQuery("#orderCancellationInitFnbSummary").slideDown();
        //     // jQuery("#orderCancellationInitForm").slideUp(() => {
        //     //   setTimeout(() => {
        //     //     jQuery("#orderCancellationInitFnbSummary").slideDown();
        //     //   }, 200);
        //     // });
        //   }
        // );
      })
      .catch((error) => {
        //console.log("Error: refundInitGetOrderInfo()");
        //console.log(error);
      });
  };

  cancelOrder = async () => {
    this.handleLoader(true);
    //orderCancellationModal.hide();
    //https://apidevshowplaceicon.influx.co.in/order/v1/bookings/cancelbooking
    //WGWLLT6 => a90895d4-efcc-4a18-936c-eebb13c62cbb
    var bookingOrderID = this.state.refundBookingOrderID;
    API.callEndpoint("POST", "Bearer", "order/v1/bookings/cancelbooking", { id: bookingOrderID })
      .then((response) => {
        this.handleLoader(false);
        orderCancellationModal.hide();
        Swal.fire("Order Cancelled", "Your order has been cancelled and your refund is being processed", "success");
      })
      .catch((error) => {
        this.handleLoader(false);
        console.log("Error: cancelOrder()");
        console.log(error);
        this.setState({
          cancelOrderError: error.error,
        });
      });

    // setTimeout(() => {
    //   Swal.fire({
    //     html: `<h5>Order Cancellation Successfull.</h5>`,
    //     confirmButtonColor: "#b42e34",
    //     customClass: {
    //       confirmButton: "extrasSweetAlertOkButton",
    //     },
    //   });
    // }, 600);
  };

  //populateItemPrice => refundCalculateItemPrice
  refundCalculateItemPrice = (fnbitem) => {
    return 1 * Number(fnbitem.pricebeforetax).toFixed(2) + Number(this.refundCalculateModifersCost(fnbitem.additionalInfo.modifiers).toFixed(2));
  };
  //populateModifersCost => refundCalculateModifersCost
  refundCalculateModifersCost = (modifiers) => {
    var modifierCost = 0;
    modifiers.map((modifier, index) => {
      modifierCost += 1 * Number(modifier.pricebeforetax);
    });
    return modifierCost;
  };
  //populateModifersTax => refundCalculateModifersTax
  refundCalculateModifersTax = (modifiers) => {
    var modifierCost = 0;
    modifiers.map((modifier, index) => {
      modifierCost += 1 * Number(modifier.taxValue);
    });
    return modifierCost;
  };
  //populateSubTotal => refundCalculateSubTotal
  refundCalculateSubTotal = () => {
    var subTotal = 0;
    this.state.refundInitBookingInfo.order_grouping.map((fnbitem) => {
      subTotal += this.refundCalculateItemPrice(fnbitem);
    });
    this.setState(
      {
        //subTotal: subTotal.toFixed(2),
        refundSummarySubTotal: subTotal.toFixed(2),
      },
      () => {
        console.log("refundSummarySubTotal: " + this.state.refundSummarySubTotal);
      }
    );
  };
  //populateTax => refundCalculateTax
  refundCalculateTax = () => {
    var tax = 0;

    this.state.refundInitBookingInfo.order_grouping.map((fnbitem) => {
      tax += fnbitem.taxValue;
      tax += this.refundCalculateModifersTax(fnbitem.additionalInfo.modifiers);
    });

    if (tax != 0) {
      this.setState({
        //tax: tax.toFixed(2),
        refundSummaryTax: tax.toFixed(2),
      });
    }
  };
  /*
  //populateTips => refundCalculateTips
  refundCalculateTips = () => {
    this.state.refundInitBookingInfo.order_grouping.map((orderItem) => {
      if (orderItem.additionalInfo.istipitem) {
        this.setState({
          //tips: orderItem.price,
          refundSummaryTips: orderItem.price,
        });
      }
    });
  };
  */
  //populatePaymentMethod => refundPopulatePaymentMethod
  refundPopulatePaymentMethod = () => {
    let refundInitBookingInfo = this.state.refundInitBookingInfo;
    let refundSummaryPaymentMethod = refundInitBookingInfo.bookings_paymenttypes
      .map((item) => {
        return {
          type: item.cardinformation !== null ? (item.type == "giftcard" ? constant.giftCardText : item.type) : null,
          amount: item.amount,
          cardNumber: item.cardinformation !== null ? item.cardinformation.cardNumber : null,
          balance: item.cardinformation !== null ? Number(item.cardinformation.balance) - Number(item.cardinformation.amountToDeduct) : null,
        };
      })
      .sort((a, b) => {
        if (a.type < b.type) {
          return -1;
        } else if (a.type > b.type) {
          return 1;
        } else {
          return 0;
        }
      })
      .filter((item) => {
        return item.type !== null;
      });
    this.setState({ refundSummaryPaymentMethod });
  };
  //populatePaymentType => refundPopulatePaymentType
  refundPopulatePaymentType = (item) => {
    if (item.cardNumber != undefined) {
      return (
        <>
          {item.type} <span>ending {item.cardNumber.substr(item.cardNumber.length - 4)}</span>
        </>
      );
    } else {
      return <>{item.type}</>;
    }
  };

  handleBookingFlowNoThisIsntMe = () => {
    ////console.log("handleBookingFlowNoThisIsntMe()");
    this.setState({
      bookingInfo: {},
      createOrderData: {
        firstname: "",
        lastname: "",
        fullname: "",
        email: "",
        phonenumber: "",
        deliveryseat: "",
        termsAndConditions: false,
      },
    });
  };

  populateAlternateItemsPrice = (altItems) => {
    //console.log("populateAlternateItemsPrice()");
    //console.log(altItems);
    var priceArray = [];
    altItems.map((altItem) => {
      var altItemPrice = altItem.strikeprice == -1 || altItem.strikeprice == null ? altItem.valuebeforetax.toFixed(2) : altItem.strikeValueBeforeTax.toFixed(2);
      //console.log("altItem.itemName: " + altItem.itemName + " altItemPrice: " + altItemPrice);
      priceArray.push(altItemPrice);
    });
    priceArray.sort(function (a, b) {
      return a - b;
    });
    return "From $" + priceArray[0] + "";
  };

  render() {
    let { redirect, orderId, selectDetailsProceed, paymentRedirect } = this.state;

    return (
      <>
        {/* Navigate from Payment to Confirmation  */}
        {redirect ? (
          <span>
            {this.setState({ redirect: true })}
            {/* <Navigate to={`/confirmation?id=${orderId}`} replace={true} /> */}
            <Navigate to={`/confirmationcheck?${this.state.confirmationRedirectURL}`} replace={true} />
            <Navigate to={`/confirmationcheck123?${this.state.confirmationRedirectURL}`} replace={true} />
            <Navigate to={`/confirmationcheckabc?${this.state.confirmationRedirectURL}`} replace={true} />
          </span>
        ) : null}
        {/* Navigate from Home(Manual Selection Flow) to Menu  */}
        {/* {selectDetailsProceed ? (
          <span>
            <Navigate to="/fnbmenu" replace={false} />
          </span>
        ) : null} */}
        {/* Navigate from Orderreview to Payment  */}
        {paymentRedirect ? (
          <span>
            {this.setState({ paymentRedirect: false })}
            <Navigate to="/payment" replace={false} />
          </span>
        ) : null}

        <Loader loaderToggle={this.state.loaderToggle} />
        <section className={`${this.state.pwPaymentflow ? "pageWrapper paymentContent" : "pageWrapper"}`}>
          <Header
            confirmBooking={this.state.confirmBooking}
            pwPaymentflow={this.state.pwPaymentflow}
            showHomeIcon={this.state.showHomeIcon}
            showHomeIconInLandingpage={this.state.showHomeIconInLandingpage}
            handleConfirmBooking={this.handleConfirmBooking}
            handleLocationDropdown={this.handleLocationDropdown}
            handleOnchangeLocationDropdown={this.handleOnchangeLocationDropdown}
            locations={this.state.locations}
            bookingInfo={this.state.bookingInfo}
            parentState={this.state}
            clearAllItemsInCart={this.clearAllItemsInCart}
          />
          <Routes>
            {/* <Route
              path="*"
              element={
                <React.Suspense fallback={<>...</>}>
                  <Error />
                </React.Suspense>
              }
            /> */}
            <Route
              path="/"
              element={
                <React.Suspense fallback={<>...</>}>
                  <Home
                    //loaderToggle={this.state.loaderToggle}
                    staticPromotions={this.state.staticPromotions}
                    handleLoader={this.handleLoader}
                    confirmBooking={this.state.confirmBooking}
                    handleConfirmBooking={this.handleConfirmBooking}
                    handleFooterSticky={this.handleFooterSticky}
                    pwPaymentflow={this.state.pwPaymentflow}
                    handlePaymentFlow={this.handlePaymentFlow}
                    showHomeIcon={this.state.showHomeIcon}
                    handleShowHomeIcon={this.handleShowHomeIcon}
                    handleshowHomeIconInLandingpage={this.handleshowHomeIconInLandingpage}
                    handleCategoryThumbOnclick={this.handleCategoryThumbOnclick}
                    handleCategoryTabsUiAnimation={this.handleCategoryTabsUiAnimation}
                    handleOnclickCategoryItem={this.handleOnclickCategoryItem}
                    handleRightColumnMobileToggle={this.handleRightColumnMobileToggle}
                    memberLogin={this.state.memberLogin}
                    setMemberLoginState={this.setMemberLoginState}
                    parentState={this.state}
                    populateMenuItemTabs={this.populateMenuItemTabs}
                    populateMenuItemTabContent={this.populateMenuItemTabContent}
                    handleFridaySpecialsSlick={this.handleFridaySpecialsSlick}
                    getBookingInfo={this.getBookingInfo}
                    bookingInfo={this.state.bookingInfo}
                    populateFullnameByType={this.populateFullnameByType}
                    getDates={this.getDates}
                    getSessionByExperience={this.getSessionByExperience}
                    setMovieListFlag={this.setMovieListFlag}
                    setFnbItemModifierData={this.setFnbItemModifierData}
                    handleSelectDetailsProceed={this.handleSelectDetailsProceed}
                    selectBookingLocation={this.selectBookingLocation}
                    getBookingId={this.getBookingId}
                    handleFindMyBookingSubmit={this.handleFindMyBookingSubmit}
                    populateItemModifierItems={this.populateItemModifierItems}
                    populateItemSmartModifierItems={this.populateItemSmartModifierItems}
                    calculateItemRowTotal={this.calculateItemRowTotal}
                    calculateCartSubtotal={this.calculateCartSubtotal}
                    calculateCartTax={this.calculateCartTax}
                    calculateCartGrandTotal={this.calculateCartGrandTotal}
                    handleInCartFnbItemQuantity={this.handleInCartFnbItemQuantity}
                    handleOnchangeMemberPricing={this.handleOnchangeMemberPricing}
                    formatTime={this.formatTime}
                    handleQrScanFromSeat={this.handleQrScanFromSeat}
                    setToggleWithoutBookingId={this.setToggleWithoutBookingId}
                    handleBookingFlowNoThisIsntMe={this.handleBookingFlowNoThisIsntMe}
                  />
                </React.Suspense>
              }
            />
            <Route
              path="/fnbmenu"
              element={
                <React.Suspense fallback={<>...</>}>
                  <Menu
                    //loaderToggle={this.state.loaderToggle}
                    staticPromotions={this.state.staticPromotions}
                    handleLoader={this.handleLoader}
                    confirmBooking={this.state.confirmBooking}
                    handleConfirmBooking={this.handleConfirmBooking}
                    handleFooterSticky={this.handleFooterSticky}
                    pwPaymentflow={this.state.pwPaymentflow}
                    handlePaymentFlow={this.handlePaymentFlow}
                    showHomeIcon={this.state.showHomeIcon}
                    handleShowHomeIcon={this.handleShowHomeIcon}
                    handleshowHomeIconInLandingpage={this.handleshowHomeIconInLandingpage}
                    handleCategoryThumbOnclick={this.handleCategoryThumbOnclick}
                    handleCategoryTabsUiAnimation={this.handleCategoryTabsUiAnimation}
                    handleOnclickCategoryItem={this.handleOnclickCategoryItem}
                    handleRightColumnMobileToggle={this.handleRightColumnMobileToggle}
                    memberLogin={this.state.memberLogin}
                    setMemberLoginState={this.setMemberLoginState}
                    parentState={this.state}
                    populateMenuItemTabs={this.populateMenuItemTabs}
                    populateMenuItemTabContent={this.populateMenuItemTabContent}
                    handleFridaySpecialsSlick={this.handleFridaySpecialsSlick}
                    getBookingInfo={this.getBookingInfo}
                    bookingInfo={this.state.bookingInfo}
                    populateFullnameByType={this.populateFullnameByType}
                    getDates={this.getDates}
                    getSessionByExperience={this.getSessionByExperience}
                    setMovieListFlag={this.setMovieListFlag}
                    setFnbItemModifierData={this.setFnbItemModifierData}
                    handleSelectDetailsProceed={this.handleSelectDetailsProceed}
                    selectBookingLocation={this.selectBookingLocation}
                    getBookingId={this.getBookingId}
                    handleFindMyBookingSubmit={this.handleFindMyBookingSubmit}
                    populateItemModifierItems={this.populateItemModifierItems}
                    populateItemSmartModifierItems={this.populateItemSmartModifierItems}
                    calculateItemRowTotal={this.calculateItemRowTotal}
                    calculateCartSubtotal={this.calculateCartSubtotal}
                    calculateCartTax={this.calculateCartTax}
                    calculateCartGrandTotal={this.calculateCartGrandTotal}
                    handleInCartFnbItemQuantity={this.handleInCartFnbItemQuantity}
                    handleOnchangeMemberPricing={this.handleOnchangeMemberPricing}
                    formatTime={this.formatTime}
                    logoutUser={this.logoutUser}
                    setSelectDetailsProceedFalse={this.setSelectDetailsProceedFalse}
                    getDeals={this.getDeals}
                    getMenuItems={this.getMenuItems}
                    deleteItemFromCart={this.deleteItemFromCart}
                    //
                    calculateRedemeedGiftcardTotal={this.calculateRedemeedGiftcardTotal}
                    removeRedemeedGiftcard={this.removeRedemeedGiftcard}
                  />
                </React.Suspense>
              }
            />
            <Route
              path="/orderreview"
              element={
                <React.Suspense fallback={<>...</>}>
                  <OrderReview
                    setSeatNumberMandatory={this.setSeatNumberMandatory}
                    loaderToggle={this.state.loaderToggle}
                    handleLoader={this.handleLoader}
                    pwPaymentflow={this.state.pwPaymentflow}
                    handlePaymentFlow={this.handlePaymentFlow}
                    showHomeIcon={this.state.showHomeIcon}
                    handleShowHomeIcon={this.handleShowHomeIcon}
                    handleRightColumnMobileToggle={this.handleRightColumnMobileToggle}
                    handleTipsSelection={this.handleTipsSelection}
                    handlePasswordToggle={this.handlePasswordToggle}
                    handlePasswordOnclick={this.handlePasswordOnclick}
                    handleEditUserDetails={this.handleEditUserDetails}
                    handleFooterSticky={this.handleFooterSticky}
                    bookingInfo={this.state.bookingInfo}
                    parentState={this.state}
                    setParentState={this.setParentState}
                    populateOrderPayload={this.populateOrderPayload}
                    updateCreateOrderFields={this.updateCreateOrderFields}
                    populateFullnameByType={this.populateFullnameByType}
                    updateInseatDeliverSlot={this.updateInseatDeliverSlot}
                    populateItemModifierItems={this.populateItemModifierItems}
                    populateItemSmartModifierItems={this.populateItemSmartModifierItems}
                    calculateItemRowTotal={this.calculateItemRowTotal}
                    calculateCartSubtotal={this.calculateCartSubtotal}
                    calculateCartTax={this.calculateCartTax}
                    calculateCartGrandTotal={this.calculateCartGrandTotal}
                    formatTime={this.formatTime}
                    handleOrderCreate={this.handleOrderCreate}
                    deleteItemFromCart={this.deleteItemFromCart}
                    //
                    calculateRedemeedGiftcardTotal={this.calculateRedemeedGiftcardTotal}
                    removeRedemeedGiftcard={this.removeRedemeedGiftcard}
                    getDeliveryTimings={this.getDeliveryTimings}
                  />
                </React.Suspense>
              }
            />
            <Route
              path="/payment"
              element={
                <React.Suspense fallback={<>...</>}>
                  <Payment
                    loaderToggle={this.state.loaderToggle}
                    handleLoader={this.handleLoader}
                    pwPaymentflow={this.state.pwPaymentflow}
                    handlePaymentFlow={this.handlePaymentFlow}
                    showHomeIcon={this.state.showHomeIcon}
                    handleShowHomeIcon={this.handleShowHomeIcon}
                    handleRightColumnMobileToggle={this.handleRightColumnMobileToggle}
                    handleFooterSticky={this.handleFooterSticky}
                    parentState={this.state}
                    setParentState={this.setParentState}
                    populateItemModifierItems={this.populateItemModifierItems}
                    populateItemSmartModifierItems={this.populateItemSmartModifierItems}
                    calculateItemRowTotal={this.calculateItemRowTotal}
                    calculateCartSubtotal={this.calculateCartSubtotal}
                    calculateCartTax={this.calculateCartTax}
                    calculateCartGrandTotal={this.calculateCartGrandTotal}
                    nameOnCard={this.state.nameOnCard}
                    setNameOnCard={this.setNameOnCard}
                    handleOrderPaymentInit={this.handleOrderPaymentInit}
                    handleOrderGetPaymentId={this.handleOrderGetPaymentId}
                    addMessageListener={this.addMessageListener}
                    handleGiftcardApply={this.handleGiftcardApply}
                    removeRedemeedGiftcard={this.removeRedemeedGiftcard}
                    calculateRedemeedGiftcardTotal={this.calculateRedemeedGiftcardTotal}
                    handleGiftCardResponse={this.handleGiftCardResponse}
                  />
                </React.Suspense>
              }
            />
            <Route
              path="/confirmation"
              element={
                <React.Suspense fallback={<>...</>}>
                  <Confirmation
                    loaderToggle={this.state.loaderToggle}
                    handleLoader={this.handleLoader}
                    pwPaymentflow={this.state.pwPaymentflow}
                    handlePaymentFlow={this.handlePaymentFlow}
                    showHomeIcon={this.state.showHomeIcon}
                    handleShowHomeIcon={this.handleShowHomeIcon}
                    handleBrowserBackButton={this.handleBrowserBackButton}
                  />
                </React.Suspense>
              }
            />
            <Route
              path="/404"
              element={
                <React.Suspense fallback={<>...</>}>
                  <Error404 />
                </React.Suspense>
              }
            />
            <Route
              path="/500"
              element={
                <React.Suspense fallback={<>...</>}>
                  <Error500 />
                </React.Suspense>
              }
            />
            <Route
              path="/maintenance"
              element={
                <React.Suspense fallback={<>...</>}>
                  <Maintenance />
                </React.Suspense>
              }
            />
            <Route
              path="/earlybird"
              element={
                <React.Suspense fallback={<>...</>}>
                  <Earlybird
                    handleFooterSticky={this.handleFooterSticky}
                    handleShowHomeIcon={this.handleShowHomeIcon}
                    handlePaymentFlow={this.handlePaymentFlow}
                    populateFullnameByType={this.populateFullnameByType}
                    refundCalculateItemPrice={this.refundCalculateItemPrice}
                    handleLoader={this.handleLoader}
                    parentState={this.state}
                    selectBookingLocation={this.selectBookingLocation}
                  />
                </React.Suspense>
              }
            />
          </Routes>
          <Footer
            cartData={this.state.cartData}
            fnbmodifierBodyheight={this.fnbmodifierBodyheight}
            setMemberLoginState={this.setMemberLoginState}
            fnbItemModifierData={this.state.fnbItemModifierData}
            //modifierItemQuantity={this.modifierItemQuantity}
            modifierModalFnbItemSpecialInstructions={this.modifierModalFnbItemSpecialInstructions}
            modifierModalFnbItemQuantity={this.modifierModalFnbItemQuantity}
            modifierItemCounter={this.modifierItemCounter}
            modifierItemCheckboxOnchange={this.modifierItemCheckboxOnchange}
            modifierItemRadioOnchange={this.modifierItemRadioOnchange}
            smartModifierItemCheckboxOnchange={this.smartModifierItemCheckboxOnchange}
            tempModifierModalTotal={this.state.tempModifierModalTotal}
            addItemToCart={this.addItemToCart}
            handleRepeatPreviousSelection={this.handleRepeatPreviousSelection}
            handleRepeatillChoose={this.handleRepeatillChoose}
            parentState={this.state}
            populateItemModifierItems={this.populateItemModifierItems}
            populateItemSmartModifierItems={this.populateItemSmartModifierItems}
            handleLoginFieldsOnChanges={this.handleLoginFieldsOnChanges}
            handleUserLogin={this.handleUserLogin}
            handleAgeRestrictionFieldsOnChanges={this.handleAgeRestrictionFieldsOnChanges}
            alcholBeverageCheckFNBData={this.state.alcholBeverageCheckFNBData}
            setFnbItemModifierData={this.setFnbItemModifierData}
            ageRestrictionValidationTrue={this.ageRestrictionValidationTrue}
            populateTodaysDealFlag={this.populateTodaysDealFlag}
            refundInitGetBookingId={this.refundInitGetBookingId}
            refundInitGetOrderInfo={this.refundInitGetOrderInfo}
            cancelOrder={this.cancelOrder}
            refundCalculateItemPrice={this.refundCalculateItemPrice}
            //refundCalculateModifersCost={this.refundCalculateModifersCost}
            //refundCalculateModifersTax={this.refundCalculateModifersTax}
            //refundCalculateSubTotal={this.refundCalculateSubTotal}
            //refundCalculateTax={this.refundCalculateTax}
            //refundCalculateTips={this.refundCalculateTips}
            refundPopulatePaymentType={this.refundPopulatePaymentType}
            alternateItemRadioOnchange={this.alternateItemRadioOnchange}
          />
        </section>
      </>
    );
  }
}

export default function (props) {
  const navigation = useNavigate();
  return <Routing {...props} navigate={navigation} />;
}
