import React from "react";
import {NavLink, Link} from "react-router-dom";
import jQuery from "jquery";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleLeft, faCaretLeft} from "@fortawesome/free-solid-svg-icons";
import InputMask from "react-input-mask";
import ColumnRight from "../ColumnRight";
import flagUSA from "../../assets/images/bg-flag_usa.png";
import "../../OrderReview.css";
import Skeleton from "react-loading-skeleton";
import * as API from "../../configuration/apiconfig";
import SeatIcon from "../../assets/images/ic-fnbDeliveryinseat.svg";
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var Days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

class OrderReview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deliver: "",
      inSeatDeliveryItemsCount: 0,
      asapDelivery: "none",
      only15MinsDelivery: false,
      onlyatShowTimeDelivery: false,
      ageRestrictioncurrenttime: "",
      checkOutDisabled: false,
      showBannerForAlcoholicItems: false,
      validEmailId: false,
      validMobileNum: false,
    };
  }
  checkPhoneNumberAndEmailValidity = () => {
    let createOrderData = this.props.parentState.createOrderData;
    if (createOrderData.phonenumber.length > 0 && createOrderData.phonenumber.length < 10) {
      this.setState({validMobileNum: true});
    } else {
      this.setState({validMobileNum: false});
    }
    if (
      createOrderData.email.length > 0 &&
      !createOrderData.email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
    ) {
      this.setState({validEmailId: true});
    } else {
      this.setState({validEmailId: false});
    }
  };

  setCheckOutDisabled = () => {
    let createOrderData = this.props.parentState.createOrderData;
    let afterLoginToken = this.props.parentState.afterLoginToken;
    let selectedInseatDeliverSlot = this.props.parentState.selectedInseatDeliverSlot;
    let checkOutDisabled = this.state.checkOutDisabled;

    if (
      createOrderData.firstname === "" ||
      createOrderData.firstname === undefined ||
      createOrderData.firstname === null ||
      createOrderData.firstname.trim().length === 0 ||
      createOrderData.lastname === "" ||
      createOrderData.lastname === undefined ||
      createOrderData.lastname === null ||
      createOrderData.lastname.trim().length === 0 ||
      createOrderData.email === "" ||
      createOrderData.email === undefined ||
      createOrderData.email === null ||
      !createOrderData.email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) ||
      createOrderData.phonenumber === "" ||
      createOrderData.phonenumber === undefined ||
      createOrderData.phonenumber === null ||
      createOrderData.phonenumber.length < 10 ||
      !createOrderData.termsAndConditions
    ) {
      if (
        afterLoginToken.firstname !== "" &&
        afterLoginToken.lastname !== "" &&
        afterLoginToken.phonenumber !== "" &&
        afterLoginToken.email &&
        createOrderData.termsAndConditions &&
        createOrderData.firstname !== "" &&
        createOrderData.lastname !== "" &&
        createOrderData.phonenumber.length === 10 &&
        createOrderData.email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
      ) {
        //createOrderData.seatNumber === "" || createOrderData.seatNumber === null || createOrderData.seatNumber === undefined ||  // Change of key seatNumber to deliveryseat
        if (
          !this.state.inSeatDeliveryItemsCount <= 0 &&
          (createOrderData.deliveryseat === "" ||
            createOrderData.deliveryseat === null ||
            createOrderData.deliveryseat === undefined ||
            selectedInseatDeliverSlot === "" ||
            selectedInseatDeliverSlot === null ||
            selectedInseatDeliverSlot === undefined)
        ) {
          checkOutDisabled = false;
        } else {
          checkOutDisabled = true;
          this.checkPhoneNumberAndEmailValidity();
        }
      } else {
        checkOutDisabled = false;
      }
    } else {
      //createOrderData.seatNumber === "" || createOrderData.seatNumber === null || createOrderData.seatNumber === undefined ||  // Change of key seatNumber to deliveryseat
      if (
        !this.state.inSeatDeliveryItemsCount <= 0 &&
        (createOrderData.deliveryseat === "" ||
          createOrderData.deliveryseat === null ||
          createOrderData.deliveryseat === undefined ||
          selectedInseatDeliverSlot === "" ||
          selectedInseatDeliverSlot === null ||
          selectedInseatDeliverSlot === undefined)
      ) {
        checkOutDisabled = false;
      } else {
        checkOutDisabled = true;
        this.checkPhoneNumberAndEmailValidity();
      }
    }

    this.setState({checkOutDisabled}, () => {
      //Validation.
      //console.log("selectedInseatDeliverSlot: " + selectedInseatDeliverSlot);
      //var dtEle = document.getElementById("errorDeliveryTimings");
      if (selectedInseatDeliverSlot != "" && document.getElementById("errorDeliveryTimings")) {
        document.getElementById("errorDeliveryTimings").style.display = "none";
      }
      //console.log("createOrderData.deliveryseat: " + createOrderData.deliveryseat);
      if (createOrderData.deliveryseat !== "" && createOrderData.deliveryseat !== null && createOrderData.deliveryseat !== undefined && document.getElementById("errorSeatNo")) {
        document.getElementById("errorSeatNo").style.display = "none";
      }
      //console.log("createOrderData.firstname: " + createOrderData.firstname);
      if (createOrderData.firstname !== "" && createOrderData.firstname !== null && createOrderData.firstname !== undefined && document.getElementById("errorFirstname")) {
        document.getElementById("errorFirstname").style.display = "none";
      }
      //console.log("createOrderData.lastname: " + createOrderData.lastname);
      if (createOrderData.lastname !== "" && createOrderData.lastname !== null && createOrderData.lastname !== undefined && document.getElementById("errorLastname")) {
        document.getElementById("errorLastname").style.display = "none";
      }
      //console.log("createOrderData.phonenumber: " + createOrderData.phonenumber);
      if (
        createOrderData.phonenumber !== "" &&
        createOrderData.phonenumber !== null &&
        createOrderData.phonenumber !== undefined &&
        createOrderData.phonenumber &&
        createOrderData.phonenumber.length >= 10 &&
        document.getElementById("errorMobileNo")
      ) {
        document.getElementById("errorMobileNo").style.display = "none";
      }
      //console.log("createOrderData.email: " + createOrderData.email);
      var emailIsValid = createOrderData.email
        ? createOrderData.email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
        : false;
      if (createOrderData.email !== "" && createOrderData.email !== null && createOrderData.email !== undefined && emailIsValid && document.getElementById("errorEmailID")) {
        document.getElementById("errorEmailID").style.display = "none";
      }
      //console.log("createOrderData.termsAndConditions: " + createOrderData.termsAndConditions);
      if (createOrderData.termsAndConditions && document.getElementById("errorTnC")) {
        document.getElementById("errorTnC").style.display = "none";
      }
    });
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.parentState !== this.props.parentState) {
      let cartData = this.props.parentState.cartData;
      let showBannerForAlcoholicItems = false;
      cartData.map((item) => {
        if (item.ageRestriction) {
          showBannerForAlcoholicItems = true;
        }
      });
      this.setState({showBannerForAlcoholicItems});
      this.setCheckOutDisabled();
    }
  };

  componentDidMount = async () => {
    if (Object.keys(this.props.parentState.bookingInfo).length != 0 || Object.keys(this.props.parentState.normalBookingInfoSelected).length != 0) {
      await localStorage.setItem("parentState", JSON.stringify(this.props.parentState));
    } else {
      await this.props.setParentState(JSON.parse(localStorage.getItem("parentState")));
    }

    let cartData = this.props.parentState.cartData;
    let showBannerForAlcoholicItems = false;
    cartData.map((item) => {
      if (item.ageRestriction) {
        showBannerForAlcoholicItems = true;
      }
    });
    this.setState({showBannerForAlcoholicItems});
    document.body.className = document.body.className.replace("homePage", "");
    //document.body.className = document.body.className.replace("homePage", "");
    document.body.className += " orderReviewPage";

    /* 
    //For Sessionid from this.state.bookingInfo/this.state.normalBookingInfoSelected:
      #1) Movie booking flow => this.state.bookingInfo.sessionid 
      #2) Seat QR Scan flow => this.state.bookingInfo.id 
      #3) Manual selection flow => this.state.normalBookingInfoSelected.sessionId
    */
    var sessionId =
      Object.keys(this.props.parentState.normalBookingInfoSelected).length !== 0
        ? this.props.parentState.normalBookingInfoSelected.sessionId
        : Object.keys(this.props.parentState.bookingInfo).length !== 0
        ? this.props.parentState.bookingInfo.sessionid
          ? this.props.parentState.bookingInfo.sessionid
          : this.props.parentState.bookingInfo.id
        : "";

    this.props.populateOrderPayload();
    this.calInseatDeliveryCount();
    this.checkIfSeatSelectionIsMandatory();

    //Populate Delivery Timings.
    this.props.getDeliveryTimings(sessionId);
    //Commented the manul calculation, currently using this.props.getDeliveryTimings for populating deliveryTimings
    //// var bookingTz = "";
    //// const params = new Proxy(new URLSearchParams(window.location.search), {
    ////   get: (searchParams, prop) => searchParams.get(prop),
    //// });
    //// if (params.bookingid != null && params.cinemaid != null && Object.keys(this.props.parentState.bookingInfo).length !== 0) {
    ////   bookingTz = this.props.bookingInfo.tz;
    //// } else if (Object.keys(this.props.parentState.bookingLocation).length !== 0) {
    ////   bookingTz = this.props.parentState.bookingLocation.tz;
    //// }
    //// API.callEndpoint("POST", "Bearer", "cms/v1/currenttime", {tz: bookingTz})
    ////   .then((response) => {
    ////     this.setState(
    ////       {
    ////         ageRestrictioncurrenttime: response.data.currenttime,
    ////       },
    ////       () => {
    ////         this.calculateAsap();
    ////       }
    ////     );
    ////   })
    ////   .catch((error) => {
    ////     //////console.log("Error: setFnbItemModifierData() > Age Restriction Calculation.");
    ////     //////console.log(error);
    ////   });

    //Remove RedeemedGiftCard if redeemed.
    if (this.props.parentState.redeemedGiftcards.length > 0) {
      this.props.parentState.redeemedGiftcards[0].orders_paymenttypes.map((optItem) => {
        if (optItem.type == "giftcard") {
          this.props.removeRedemeedGiftcard(optItem.cardinformation.cardNumber);
        }
      });
    }

    //var self = this;

    //Payment Flow > To add/remove layout class "paymentContent" with class "pageWrapper"
    if (this.props.pwPaymentflow === false) {
      this.props.handlePaymentFlow(true);
    }

    //Payment Flow > Header > Home Icon
    if (this.props.showHomeIcon) {
      this.props.handleShowHomeIcon(false);
    }

    // jQuery(function () {
    //   jQuery(".selectpicker").selectpicker();
    // });

    /* Jquery Window Load & Resize */
    // jQuery(window).on("load resize", function () {
    //   self.props.handleFooterSticky();
    // });
    this.setCheckOutDisabled();
    this.props.handleFooterSticky();

    window.addEventListener("popstate", (event) => {
      //Remove RedeemedGiftCard if redeemed.
      if (this.props.parentState.redeemedGiftcards.length > 0) {
        this.props.parentState.redeemedGiftcards[0].orders_paymenttypes.map((optItem) => {
          if (optItem.type == "giftcard") {
            this.props.removeRedemeedGiftcard(optItem.cardinformation.cardNumber);
          }
        });
      }
    });
  };

  componentWillUnmount = () => {
    document.body.className = document.body.className.replace("orderReviewPage", "");
    window.addEventListener("popstate", null);
  };

  checkIfSeatSelectionIsMandatory = () => {
    API.callEndpoint("GET", "Bearer", "cms/v1/settings?type=pickupLocation", "")
      .then((response) => {
        //console.log(JSON.stringify(response.data[0].configs));
        //console.log(this.props.parentState.normalBookingInfoSelected.id);
        //console.log(this.props.parentState.normalBookingInfoSelected.screenNumber);
        var index = response.data[0].configs.findIndex((x) => x.cinema === this.props.parentState.normalBookingInfoSelected.id);
        if (index != -1) {
          var mandatorySeatNumberAuditoriums = response.data[0].configs[index].auditorium;
          var checkIfSeatNumberIsMandatory = mandatorySeatNumberAuditoriums.includes(Number(this.props.parentState.normalBookingInfoSelected.screenNumber));
          if (checkIfSeatNumberIsMandatory) {
            this.props.setSeatNumberMandatory(true);
          } else {
            this.props.setSeatNumberMandatory(false);
          }
        }
        //console.log("ID ---->>>" + index);
        //console.log("------------------------------");
      })
      .catch((error) => {
        //console.log(error);
      });
  };
  calculateAsap = () => {
    var showDate, showTime;
    if (Object.keys(this.props.parentState.normalBookingInfoSelected).length == 0) {
      showDate = this.props.parentState.bookingInfo.showdate.split("T")[0];
      showTime = this.props.parentState.bookingInfo.showtime.split("T")[1];
    } else {
      showDate = this.props.parentState.normalBookingInfoSelected.date.split("T")[0];
      showTime = this.props.parentState.normalBookingInfoSelected.time.split("T")[1];
    }
    if (this.formatShowDateToMatchCurrentTime(showDate) == this.state.ageRestrictioncurrenttime.split(" ")[0]) {
      var checkASAPShowTime = this.checkASAPShowTime(showTime);
      //console.log(checkASAPShowTime);
      if (checkASAPShowTime.beforeAfterShowtime == "before" && checkASAPShowTime.minutes <= 14) {
        this.setState(
          {
            asapDelivery: false,
            onlyatShowTimeDelivery: true,
            only15MinsDelivery: false,
          },
          () => {
            this.props.updateInseatDeliverSlot("at showtime");
          }
        );
      } else if (checkASAPShowTime.beforeAfterShowtime == "after" && checkASAPShowTime.minutes <= 45) {
        this.makeAsapDeliveryTrue();
      } else {
        this.setState({
          asapDelivery: false,
        });
      }
    } else {
      this.setState({
        asapDelivery: false,
      });
    }
  };

  checkASAPShowTime = (showTime) => {
    var availableMinutes, beforeAfterShowtime;
    var currentTime = this.state.ageRestrictioncurrenttime.split(" ")[1];
    //sample data
    // currentTime = "23:46:00";
    // showTime = "23:30:00.000Z";

    //actual data
    // ////console.log(currentTime);
    // ////console.log(showTime);
    if (currentTime.split(":")[0] > showTime.split(":")[0] || (currentTime.split(":")[0] == showTime.split(":")[0] && currentTime.split(":")[1] > showTime.split(":")[1])) {
      beforeAfterShowtime = "after";
      if (currentTime.split(":")[0] == showTime.split(":")[0]) {
        availableMinutes = currentTime.split(":")[1] - showTime.split(":")[1];
      } else if (currentTime.split(":")[0] == Number(showTime.split(":")[0]) + 1) {
        availableMinutes = 60 - Number(showTime.split(":")[1]) + Number(currentTime.split(":")[1]);
      } else {
        beforeAfterShowtime = false;
        availableMinutes = false;
      }
    } else if (currentTime.split(":")[0] <= showTime.split(":")[0]) {
      beforeAfterShowtime = "before";
      if (currentTime.split(":")[0] == showTime.split(":")[0]) {
        availableMinutes = showTime.split(":")[1] - currentTime.split(":")[1];
      } else if (currentTime.split(":")[0] == Number(showTime.split(":")[0]) - 1) {
        availableMinutes = 60 - Number(currentTime.split(":")[1]) + Number(showTime.split(":")[1]);
      } else {
        beforeAfterShowtime = false;
        availableMinutes = false;
      }
    }

    // ////console.log("-----------------------------");
    // ////console.log(beforeAfterShowtime);
    // ////console.log(availableMinutes);
    return {beforeAfterShowtime: beforeAfterShowtime, minutes: availableMinutes};
  };

  formatShowDateToMatchCurrentTime = (showDate) => {
    var showDateSplit = showDate.split("-");
    return showDateSplit[2] + "-" + showDateSplit[1] + "-" + showDateSplit[0];
  };

  makeAsapDeliveryTrue = () => {
    this.setState(
      {
        asapDelivery: true,
      },
      () => {
        this.props.updateInseatDeliverSlot("ASAP");
      }
    );
  };
  calInseatDeliveryCount = () => {
    ////////console.log("OrderReview > calInseatDeliveryCount()");
    var inSeatDeliveryCount = 0;
    var cartData = this.props.parentState.cartData;
    cartData.map((cdItem) => {
      if (cdItem.inSeatDelivery && cdItem.itemInCartFlag) {
        inSeatDeliveryCount = inSeatDeliveryCount + 1;
      }
    });
    this.setState({
      inSeatDeliveryItemsCount: inSeatDeliveryCount,
    });
  };

  populateDate = (showDate) => {
    ////////console.log("OrderReview > populateDate()");
    var actualShowDate = showDate.split("T")[0].split("-");
    var date = actualShowDate[2];
    var month = months[actualShowDate[1] - 1];
    var year = actualShowDate[0];
    var day = new Date(`${date}-${month}-${year}`).getDay();
    return Days[day] + ", " + month + " " + date;
  };

  populateTime = (showTime) => {
    ////////console.log("OrderReview > populateTime()");
    var actualShowTime = showTime.split("T")[1].split(":");
    var hours = actualShowTime[0];
    hours = hours > 12 ? hours - 12 : hours;
    hours = ("0" + hours).slice(-2);

    var minutes = actualShowTime[1];
    minutes = ("0" + minutes).slice(-2);

    var meridian = actualShowTime[0] >= 12 ? "PM" : "AM";
    return hours + ":" + minutes + " " + meridian;
  };

  checkIfSeatNumberExists = (props) => {
    if (props.bookingInfo && Object.keys(props.bookingInfo).length !== 0 && props.bookingInfo.orders_items && props.bookingInfo.orders_items[0].seats != "") {
      return "seatNumberExists";
    } else if (props.bookingInfo.seatNumber && props.bookingInfo.seatNumber != "") {
      return "seatNumberExists";
    }
  };

  checkIfSeatNumberExistsForLabel = (props) => {
    if (props.bookingInfo && Object.keys(props.bookingInfo).length !== 0 && props.bookingInfo.orders_items && props.bookingInfo.orders_items[0].seats != "") {
      return "Your seat number";
    } else if (props.bookingInfo.seatNumber && props.bookingInfo.seatNumber != "") {
      return "Your seat number";
    } else {
      return "Please enter your seat number";
    }
  };

  handleOrderReviewValidation = () => {
    console.log("handleOrderReviewValidation()");
    var self = this;

    //Deliver To Seat > Delivery Timings. errorDeliveryTimings
    if (self.props.parentState.deliveryTimings.length > 0 && jQuery(".dtListWrap ul.ul li").length > 0 && self.props.parentState.deliveryTimings.length == jQuery(".dtListWrap ul.ul li").length) {
      var dtIsSelected = 0;
      jQuery(".dtListWrap ul.ul li").each(function () {
        if (jQuery(this).hasClass("active") && self.props.parentState.selectedInseatDeliverSlot != "") {
          dtIsSelected = dtIsSelected + 1;
        }
      });
      if (dtIsSelected == 0) {
        document.getElementById("errorDeliveryTimings").style.display = "block";
      } else {
        document.getElementById("errorDeliveryTimings").style.display = "none";
      }
    }

    //Deliver To Seat > Seat Number. orPageValidateSeatNo/errorSeatNo
    var seatNoEle = document.getElementById("orPageValidateSeatNo");
    if (seatNoEle !== null && seatNoEle !== undefined) {
      var seatNoEleVal = seatNoEle.value;
      if (seatNoEleVal == "") {
        document.getElementById("errorSeatNo").style.display = "block";
      } else {
        document.getElementById("errorSeatNo").style.display = "none";
      }
    }

    //Member Login > Form Fields
    //Firstname. orPageValidateFirstname/errorFirstname
    var firstnameEle = document.getElementById("orPageValidateFirstname");
    if (firstnameEle !== null && firstnameEle !== undefined) {
      var firstnameEleVal = firstnameEle.value;
      if (firstnameEleVal == "" || firstnameEleVal.trim().length === 0) {
        document.getElementById("errorFirstname").style.display = "block";
      } else {
        document.getElementById("errorFirstname").style.display = "none";
      }
    }
    //Lastname. orPageValidateLastname/errorLastname
    var lastnameEle = document.getElementById("orPageValidateLastname");
    if (lastnameEle !== null && lastnameEle !== undefined) {
      var lastnameEleVal = lastnameEle.value;
      if (lastnameEleVal == "" || lastnameEleVal.trim().length === 0) {
        document.getElementById("errorLastname").style.display = "block";
      } else {
        document.getElementById("errorLastname").style.display = "none";
      }
    }
    //Mobile Number. orPageValidateMobileno/errorMobileNo
    var mobilenoEle = document.getElementById("orPageValidateMobileno");
    if (mobilenoEle !== null && mobilenoEle !== undefined) {
      var mobilenoEleVal = mobilenoEle.value;
      if (mobilenoEleVal == "" && mobilenoEleVal.length < 8) {
        document.getElementById("errorMobileNo").style.display = "block";
      } else {
        document.getElementById("errorMobileNo").style.display = "none";
      }
    }
    //EmailID. orPageValidateEmailID/errorEmailID
    var emailidEle = document.getElementById("orPageValidateEmailID");
    if (emailidEle !== null && emailidEle !== undefined) {
      var emailidEleVal = emailidEle.value;
      if (emailidEleVal == "") {
        document.getElementById("errorEmailID").style.display = "block";
      } else {
        document.getElementById("errorEmailID").style.display = "none";
      }
    }
    //Accept Terms & Conditions. acceptTNC/errorTnC
    var tncEle = document.getElementById("acceptTNC");
    if (tncEle !== null && tncEle !== undefined) {
      if (tncEle.checked) {
        document.getElementById("errorTnC").style.display = "none";
      } else {
        document.getElementById("errorTnC").style.display = "block";
      }
    }
  };

  render() {
    let {validEmailId, validMobileNum} = this.state;
    const {bookingInfo, parentState} = this.props;
    return (
      <section className="pageContent">
        <section className="pcPanel">
          <section className="container d-flex justify-content-between">
            <NavLink to="/fnbmenu" title="Back" className="btnBack" onClick={() => this.props.handleConfirmBooking(false)}>
              <FontAwesomeIcon icon={faAngleLeft} className="orderReviewBackButton"></FontAwesomeIcon>
            </NavLink>
            <h3 className="movieDeatils">
              At{" "}
              <span className="themeColor">
                {/* {Object.keys(bookingInfo).length === 0
                  ? Object.keys(parentState.normalBookingInfoSelected).length !== 0
                    ? parentState.normalBookingInfoSelected.location
                    : ""
                  : bookingInfo.cinema.cinemas_locations[0].city} */}
                {Object.keys(bookingInfo).length === 0
                  ? Object.keys(parentState.normalBookingInfoSelected).length !== 0
                    ? parentState.normalBookingInfoSelected.locationName
                    : ""
                  : bookingInfo.cinema.cinemas_attributes[0].name}
              </span>{" "}
              On{" "}
              <span className="themeColor">
                {" "}
                {Object.keys(bookingInfo).length === 0
                  ? Object.keys(parentState.normalBookingInfoSelected).length !== 0
                    ? this.populateDate(parentState.normalBookingInfoSelected.date)
                    : ""
                  : this.populateDate(bookingInfo.showdate)}
              </span>
              , you're watching{" "}
              <span className="themeColor">
                {Object.keys(bookingInfo).length === 0 ? (Object.keys(parentState.normalBookingInfoSelected).length !== 0 ? parentState.normalBookingInfoSelected.movie : "") : bookingInfo.film.title}
              </span>{" "}
              at{" "}
              <span className="themeColor">
                {Object.keys(bookingInfo).length === 0
                  ? Object.keys(parentState.normalBookingInfoSelected).length !== 0
                    ? this.populateTime(parentState.normalBookingInfoSelected.time)
                    : ""
                  : this.populateTime(bookingInfo.showtime)}
              </span>
              {/* .<br></br>We'll deliver your order{" "}
              <span className="themeColor">{this.state.deliver}</span>. */}
            </h3>
            <span style={{width: 15}}></span>
          </section>

          {/* E.O.F&B Panelhead(pcfnbPanelhead) */}
          <section className="pcpBody">
            <section className="container">
              <section className="pcpbInner">
                <section className="pcpbiColswrap clearfix pcbOrderreviewwrap">
                  <section className="pcpbiCols pcpbiColleft">
                    <section className="pcpbiclInner">
                      <section className="pcbOrderreview">
                        <section className="pcborInner">
                          {this.state.inSeatDeliveryItemsCount <= 0 ? (
                            this.props.parentState.seatNumberMandatory ? (
                              <div className="seatNumberDiv">
                                <img src={SeatIcon} alt="Seat Icon" className="seatIcon" />
                                <div className="enterSeatNumber">
                                  <h5>{this.checkIfSeatNumberExistsForLabel(this.props)}</h5>
                                  <input
                                    id="orPageValidateSeatNo"
                                    type="text"
                                    placeholder="E.g. C8"
                                    className={`form-control seatNumberTextBox ${this.checkIfSeatNumberExists(this.props)}`}
                                    onChange={(e) => this.props.updateCreateOrderFields(e, "fieldSeatno")}
                                    defaultValue={
                                      this.props.bookingInfo &&
                                      Object.keys(this.props.bookingInfo).length !== 0 &&
                                      this.props.bookingInfo.orders_items &&
                                      this.props.bookingInfo.orders_items[0].seats != ""
                                        ? this.props.bookingInfo.orders_items[0].seats
                                        : this.props.bookingInfo.seatNumber && this.props.bookingInfo.seatNumber != ""
                                        ? this.props.bookingInfo.seatNumber
                                        : ""
                                    }
                                  />
                                  <p className="error-text" id="errorSeatNo" style={{display: "none"}}>
                                    Enter your seat number.
                                  </p>
                                </div>
                              </div>
                            ) : (
                              ""
                            )
                          ) : (
                            <section className="pcborRows rowAddtips">
                              <aside className="pcborrHead">
                                <h2 className="whenShouldWeBringItemsHeading">When should we bring out your delivery items ?</h2>
                              </aside>
                              <section className="pcborrBody">
                                <section className="ratInner">
                                  <aside className="dtListWrap">
                                    <ul className="ul">
                                      {this.props.parentState.deliveryTimings.length == 0 ? (
                                        <>
                                          <div style={{width: 125, marginRight: 15}}>
                                            <Skeleton duration={0.75} height={48} style={{borderRadius: 12}} />
                                          </div>
                                          <div style={{width: 200, marginRight: 15}}>
                                            <Skeleton duration={0.75} height={48} style={{borderRadius: 12}} />
                                          </div>
                                        </>
                                      ) : (
                                        <>
                                          {this.props.parentState.deliveryTimings.map((dtItem, index) => {
                                            return (
                                              <li
                                                className={
                                                  this.props.parentState.selectedInseatDeliverSlot == "at showtime" && dtItem.additionalinfo.time == "0"
                                                    ? "active"
                                                    : this.props.parentState.selectedInseatDeliverSlot == "15 mins before showtime" && dtItem.additionalinfo.time == "-15"
                                                    ? "active"
                                                    : this.props.parentState.selectedInseatDeliverSlot == "ASAP" && dtItem.additionalinfo.time == "45"
                                                    ? "active"
                                                    : ""
                                                }
                                                key={"deliveryTimings_" + index + "_" + dtItem.descriptionAlt[0].text + ""}
                                              >
                                                <a
                                                  href="javascript:;"
                                                  className={`roundBoxshadowed`}
                                                  data-value="18%"
                                                  onClick={(event) => {
                                                    this.props.updateInseatDeliverSlot(
                                                      dtItem.additionalinfo.time == "0"
                                                        ? "at showtime"
                                                        : dtItem.additionalinfo.time == "-15"
                                                        ? "15 mins before showtime"
                                                        : dtItem.additionalinfo.time == "45"
                                                        ? "ASAP"
                                                        : "",
                                                      dtItem.id
                                                    );
                                                    //this.props.handleTipsSelection(dtItem.descriptionAlt[0].text === "showtime" ? "at showtime" : "15 mins before showtime");
                                                  }}
                                                >
                                                  {dtItem.additionalinfo.time == "0"
                                                    ? "At Showtime"
                                                    : dtItem.additionalinfo.time == "-15"
                                                    ? "15 mins Before Showtime"
                                                    : dtItem.additionalinfo.time == "45"
                                                    ? "ASAP"
                                                    : ""}
                                                </a>
                                              </li>
                                            );
                                          })}
                                        </>
                                      )}
                                    </ul>
                                    {/*
                                      //Manual populate & calculations for deliveryTimings.
                                      <ul className="ul">
                                        {this.state.asapDelivery == "none" ? (
                                          <>
                                            <div style={{width: 125, marginRight: 15}}>
                                              <Skeleton duration={0.75} height={48} style={{borderRadius: 12}} />
                                            </div>
                                            <div style={{width: 200, marginRight: 15}}>
                                              <Skeleton duration={0.75} height={48} style={{borderRadius: 12}} />
                                            </div>
                                          </>
                                        ) : this.state.asapDelivery ? (
                                          <li className="active">
                                            <a href="javascript:;" className="roundBoxshadowed" style={{width: 150, pointerEvents: "none"}}>
                                              ASAP
                                            </a>
                                          </li>
                                        ) : (
                                          <>
                                            {this.state.only15MinsDelivery ? (
                                              <li className={this.props.parentState.selectedInseatDeliverSlot == "15 mins before showtime" ? "active" : ""}>
                                                <a
                                                  href="javascript:;"
                                                  className={`roundBoxshadowed`}
                                                  data-value="18%"
                                                  onClick={(event) => {
                                                    this.props.updateInseatDeliverSlot("15 mins before showtime");
                                                    this.props.handleTipsSelection("15 mins before showtime");
                                                  }}
                                                >
                                                  15 mins Before Showtime
                                                </a>
                                              </li>
                                            ) : this.state.onlyatShowTimeDelivery ? (
                                              <li className={this.props.parentState.selectedInseatDeliverSlot == "at showtime" ? "active" : ""}>
                                                <a
                                                  href="javascript:;"
                                                  className={`roundBoxshadowed`}
                                                  data-value="15%"
                                                  onClick={async (event) => {
                                                    await this.props.updateInseatDeliverSlot("at showtime");
                                                    await this.props.handleTipsSelection("at showtime");
                                                    this.setCheckOutDisabled();
                                                  }}
                                                >
                                                  At Showtime
                                                </a>
                                              </li>
                                            ) : (
                                              <>
                                                <li className={this.props.parentState.selectedInseatDeliverSlot == "at showtime" ? "active" : ""}>
                                                  <a
                                                    href="javascript:;"
                                                    className={`roundBoxshadowed`}
                                                    data-value="15%"
                                                    onClick={(event) => {
                                                      this.props.updateInseatDeliverSlot("at showtime");
                                                      this.props.handleTipsSelection("at showtime");
                                                    }}
                                                  >
                                                    At Showtime
                                                  </a>
                                                </li>
                                                <li className={this.props.parentState.selectedInseatDeliverSlot == "15 mins before showtime" ? "active" : ""}>
                                                  <a
                                                    href="javascript:;"
                                                    className={`roundBoxshadowed`}
                                                    data-value="18%"
                                                    onClick={(event) => {
                                                      this.props.updateInseatDeliverSlot("15 mins before showtime");
                                                      this.props.handleTipsSelection("15 mins before showtime");
                                                    }}
                                                  >
                                                    15 mins Before Showtime
                                                  </a>
                                                </li>
                                              </>
                                            )}
                                          </>
                                        )}
                                      </ul>
                                    */}
                                    <p className="error-text" id="errorDeliveryTimings" style={{display: "none"}}>
                                      Please select a delivery timing.
                                    </p>
                                  </aside>
                                  <div className="seatNumberDiv">
                                    <img src={SeatIcon} alt="Seat Icon" className="seatIcon" />
                                    <div className="enterSeatNumber">
                                      <h5>{this.checkIfSeatNumberExistsForLabel(this.props)}</h5>
                                      <input
                                        id="orPageValidateSeatNo"
                                        type="text"
                                        placeholder="E.g. C8"
                                        className={`form-control seatNumberTextBox ${this.checkIfSeatNumberExists(this.props)}`}
                                        onChange={(e) => {
                                          this.props.updateCreateOrderFields(e, "fieldSeatno");
                                          this.setCheckOutDisabled();
                                        }}
                                        //value={this.props.parentState.createOrderData.seatNumber}
                                        value={this.props.parentState.createOrderData.deliveryseat} // Change of key seatNumber to deliveryseat
                                        // defaultValue={
                                        //   this.props.bookingInfo &&
                                        //   Object.keys(this.props.bookingInfo).length !== 0 &&
                                        //   this.props.bookingInfo.orders_items &&
                                        //   this.props.bookingInfo.orders_items[0].seats != ""
                                        //     ? this.props.bookingInfo.orders_items[0].seats
                                        //     : this.props.bookingInfo.seatNumber && this.props.bookingInfo.seatNumber != ""
                                        //     ? this.props.bookingInfo.seatNumber
                                        //     : ""
                                        // }
                                      />
                                      <p className="error-text" id="errorSeatNo" style={{display: "none"}}>
                                        Enter your seat number.
                                      </p>
                                    </div>
                                  </div>
                                </section>
                              </section>
                            </section>
                          )}

                          <section className="pcborRows rowUserdetails">
                            <aside className="pcborrHead">
                              <h2>
                                Your details
                                <a href="javascript:;" className="rudEdit" title="Edit Your Details" onClick={(event) => this.props.handleEditUserDetails(event)}>
                                  Edit Your Details
                                </a>
                              </h2>
                            </aside>
                            <section className="pcborrBody">
                              <section id="rewardMemberform" className="pageForm row">
                                <aside className="form-group col-xs-6 col-sm-6 col-md-6 col-lg-6">
                                  <label className="visually-hidden">First name</label>
                                  <input
                                    id="orPageValidateFirstname"
                                    type="text"
                                    placeholder="First name"
                                    value={this.props.parentState.createOrderData.firstname}
                                    className="form-control"
                                    onChange={(e) => {
                                      this.props.updateCreateOrderFields(e, "fieldFirstname");
                                      this.setCheckOutDisabled();
                                    }}
                                    // defaultValue={
                                    //   this.props.bookingInfo && Object.keys(this.props.bookingInfo).length !== 0 && this.props.bookingInfo.fullname && this.props.bookingInfo.fullname != ""
                                    //     ? this.props.populateFullnameByType("Firstname", this.props.bookingInfo.fullname)
                                    //     : Object.keys(this.props.parentState.afterLoginToken).length !== 0 && this.props.parentState.afterLoginToken.firstname != ""
                                    //     ? this.props.parentState.afterLoginToken.firstname
                                    //     : ""
                                    // }
                                    // readOnly={
                                    //   this.props.bookingInfo &&
                                    //   Object.keys(this.props.bookingInfo)
                                    //     .length !== 0 &&
                                    //   this.props.bookingInfo.fullname != ""
                                    //     ? true
                                    //     : false
                                    // }
                                  />
                                  <p className="error-text" id="errorFirstname" style={{display: "none"}}>
                                    Enter your First name.
                                  </p>
                                </aside>
                                <aside className="form-group col-xs-6 col-sm-6 col-md-6 col-lg-6">
                                  <label className="visually-hidden">Last name</label>
                                  <input
                                    id="orPageValidateLastname"
                                    type="text"
                                    placeholder="Last name"
                                    value={this.props.parentState.createOrderData.lastname}
                                    className="form-control"
                                    onChange={(e) => {
                                      this.props.updateCreateOrderFields(e, "fieldLastname");
                                      this.setCheckOutDisabled();
                                    }}
                                    // defaultValue={
                                    //   this.props.bookingInfo && Object.keys(this.props.bookingInfo).length !== 0 && this.props.bookingInfo.fullname && this.props.bookingInfo.fullname != ""
                                    //     ? this.props.populateFullnameByType("Lastname", this.props.bookingInfo.fullname)
                                    //     : Object.keys(this.props.parentState.afterLoginToken).length !== 0 && this.props.parentState.afterLoginToken.lastname != ""
                                    //     ? this.props.parentState.afterLoginToken.lastname
                                    //     : ""
                                    // }
                                    // readOnly={
                                    //   this.props.bookingInfo &&
                                    //   Object.keys(this.props.bookingInfo)
                                    //     .length !== 0 &&
                                    //   this.props.bookingInfo.fullname != ""
                                    //     ? true
                                    //     : false
                                    // }
                                  />
                                  <p className="error-text" id="errorLastname" style={{display: "none"}}>
                                    Enter your Last name.
                                  </p>
                                </aside>
                                <aside className="form-group col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                  <aside className="fgMobile">
                                    <InputMask
                                      id="orPageValidateMobileno"
                                      placeholder="Mobile number"
                                      className="form-control"
                                      onChange={(e) => {
                                        this.props.updateCreateOrderFields(e, "fieldMobileno");
                                        this.setCheckOutDisabled();
                                      }}
                                      value={this.props.parentState.createOrderData.phonenumber}
                                      // defaultValue={
                                      //   this.props.bookingInfo && Object.keys(this.props.bookingInfo).length !== 0 && this.props.bookingInfo.phonenumber != ""
                                      //     ? this.props.bookingInfo.phonenumber
                                      //     : Object.keys(this.props.parentState.afterLoginToken).length !== 0 && this.props.parentState.afterLoginToken.phonenumber != ""
                                      //     ? this.props.parentState.afterLoginToken.phonenumber
                                      //     : ""
                                      // }
                                      {...this.props}
                                      mask="(999) 999-9999"
                                      maskChar=""
                                    />
                                    {/* <input type="text" /> */}
                                    <aside className="fgCountrycode">
                                      <figure>
                                        <img src={flagUSA} alt="USA" title="USA" className="img-fluid" />
                                      </figure>
                                      <p>+1</p>
                                    </aside>
                                  </aside>
                                  <p className="error-text" id="errorMobileNo" style={{display: "none"}}>
                                    Enter your Mobile number.
                                  </p>
                                  {validMobileNum ? <p className="error-text-1">Enter a Valid Mobile number.</p> : null}
                                </aside>
                                <aside className="form-group col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                  <label className="visually-hidden">Email ID</label>
                                  <input
                                    id="orPageValidateEmailID"
                                    type="text"
                                    placeholder="Email ID"
                                    //value=""
                                    className="form-control"
                                    onChange={(e) => {
                                      this.props.updateCreateOrderFields(e, "fieldEmailid");
                                      this.setCheckOutDisabled();
                                    }}
                                    value={this.props.parentState.createOrderData.email}
                                    // defaultValue={
                                    //   this.props.bookingInfo && Object.keys(this.props.bookingInfo).length !== 0 && this.props.bookingInfo.email != ""
                                    //     ? this.props.bookingInfo.email
                                    //     : Object.keys(this.props.parentState.afterLoginToken).length !== 0 && this.props.parentState.afterLoginToken.email != ""
                                    //     ? this.props.parentState.afterLoginToken.email
                                    //     : ""
                                    // }
                                  />
                                  <p className="error-text" id="errorEmailID" style={{display: "none"}}>
                                    Enter your Email ID.
                                  </p>
                                  {validEmailId ? <p className="error-text-1">Enter a Valid Email ID.</p> : null}
                                </aside>
                                {/* <aside id="rewardMemberlogin" className="form-group col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                  <aside className="customCheckbox">
                                    <input type="checkbox" id="rewardsMember" name="rewardsMember" onChange={(event) => this.props.handlePasswordToggle(event)} />
                                    <label htmlFor="rewardsMember">
                                      I'm an <b>Extras</b> member<i></i>
                                    </label>
                                  </aside>
                                </aside> 
                                <aside className="col-xs-12 col-sm-12 col-md-12 col-lg-12 rudPasswprd">
                                  <aside className="form-group">
                                    <label>
                                      Enter your <b>Extras</b> membership password
                                    </label>
                                    <input type="password" placeholder="Password" className="form-control" />
                                    <aside className="btnswrap">
                                      <a href="javascript:;" className="btn btndefault" title="Apply" id="rewardMembersubmit" onClick={(event) => this.props.handlePasswordOnclick(event)}>
                                        <span>Apply</span>
                                      </a>
                                    </aside>
                                  </aside>
                                </aside>*/}
                              </section>
                            </section>
                          </section>
                          {/* E.O.Your Details */}
                          {/* <section
                            id="memberRewardsblock"
                            className="pcborRows rowRewards"
                          >
                            <aside className="pcborrHead">
                              <h2>Rewards</h2>
                            </aside>
                            <section className="pcborrBody">
                              <section className="roundBoxshadowed">
                                <section className="rrInner">
                                  <p>
                                    Use your reward points for discounts{" "}
                                    <span>
                                      Points available:{" "}
                                      <strong>4000 Pts</strong>
                                    </span>
                                  </p>
                                  <aside className="btnswrap clearfix">
                                    <p>
                                      Value: <strong>$40</strong>
                                    </p>
                                    <a
                                      href="javascript:;"
                                      className="btn btndefault"
                                      title="Apply"
                                    >
                                      <span>Apply</span>
                                    </a>
                                  </aside>
                                </section>
                              </section>
                            </section>
                          </section> */}
                          {/* E.O.Rewards */}
                          <section className="pcborRows rowBottom">
                            <section className="pcborrBody" style={{padding: 0}}>
                              <section className={`rbAlcoholinfo ${!this.state.showBannerForAlcoholicItems ? "d-none" : ""}`}>
                                <h4>
                                  <span>We see you've ordered an alcoholic beverage. Please make sure to bring ID to the cinema as we are required by law to check for proof of age.</span>
                                </h4>
                              </section>
                              <aside className="customCheckbox">
                                <input
                                  type="checkbox"
                                  id="acceptTNC"
                                  name="acceptTNC"
                                  checked={this.props.parentState.createOrderData.termsAndConditions}
                                  onChange={async (e) => {
                                    await this.props.updateCreateOrderFields(e, "termsAndConditions");
                                    this.setCheckOutDisabled();
                                  }}
                                />
                                <label htmlFor="acceptTNC">
                                  I accept the{" "}
                                  <span className="termsAndConditions" onClick={() => window.open("https://www.showplaceicon.com/Ticketing/_ICON/TermsOfUse.aspx", "_blank")}>
                                    terms &amp; conditions
                                  </span>
                                  <i></i>
                                </label>
                              </aside>
                              <p className="error-text" id="errorTnC" style={{display: "none"}}>
                                Please accept terms &amp; conditions.
                              </p>
                            </section>
                          </section>
                          {/* E.O.Rewards */}
                        </section>
                      </section>
                    </section>
                  </section>
                  {/* E.O.Columns Wrap > Left Column(pcpbiCols pcpbiColleft) */}
                  <aside className="pcpbiCols pcpbiColright">
                    <ColumnRight
                      continueCTA={"/payment"}
                      handleRightColumnMobileToggle={this.props.handleRightColumnMobileToggle}
                      parentState={this.props.parentState}
                      deliver={this.state.deliver}
                      populateItemModifierItems={this.props.populateItemModifierItems}
                      populateItemSmartModifierItems={this.props.populateItemSmartModifierItems}
                      calculateItemRowTotal={this.props.calculateItemRowTotal}
                      calculateCartSubtotal={this.props.calculateCartSubtotal}
                      calculateCartTax={this.props.calculateCartTax}
                      calculateCartGrandTotal={this.props.calculateCartGrandTotal}
                      deleteItemFromCart={this.props.deleteItemFromCart}
                      handleOrderCreate={this.props.handleOrderCreate}
                      checkOutDisabled={this.state.checkOutDisabled}
                      disableItemDelete={false}
                      calculateRedemeedGiftcardTotal={this.props.calculateRedemeedGiftcardTotal}
                      handleOrderReviewValidation={this.handleOrderReviewValidation}
                      checkPhoneNumberAndEmailValidity={this.checkPhoneNumberAndEmailValidity}
                    />
                  </aside>
                  {/* E.O.Columns Wrap > Right Column(pcpbiCols pcpbiColrigh) */}
                </section>
                {/* E.O.Columns Wrap(pcpbiColswrap) */}

                <section
                  //className={`pcpbBottomstrap ${this.state.checkOutDisabled ? "" : "overviewCheckoutBtnDisabled"}`}
                  className="pcpbBottomstrap"
                >
                  <section className="pcpbbsInner clearfix">
                    <aside className="pcpbsTrigger" onClick={() => this.props.handleRightColumnMobileToggle()}>
                      <h2>
                        <span>View Cart</span>
                        <strong>{`${this.props.parentState.cartData.length > 0 ? this.props.calculateCartGrandTotal(this.props.parentState.cartData) : "$0.00"}`}</strong>
                      </h2>
                    </aside>
                    <aside className="btnswrap">
                      {/* <a
                        href="payment.html"
                        className="btn btntext"
                        title="Continue"
                      >
                        Continue
                      </a> */}
                      {/* <NavLink to="/payment" className="btn btntext" title="Checkout">
                        Checkout
                      </NavLink> */}
                      {/* <a
                        href="javascript:;"
                        title="Checkout"
                        className={`btn btntext ${this.props.parentState.cartData.length > 0 && this.state.checkOutDisabled ? "" : "overviewCheckoutBtnDisabled"}`}
                        onClick={() => {
                          this.props.handleOrderCreate();
                        }}
                      >
                        Checkout
                      </a> */}

                      {this.props.parentState.cartData.length > 0 && this.state.checkOutDisabled ? (
                        <a
                          href="javascript:;"
                          title="Checkout"
                          className="btn btntext"
                          onClick={() => {
                            this.props.handleOrderCreate();
                          }}
                        >
                          Checkout
                        </a>
                      ) : (
                        <a
                          href="javascript:;"
                          title="Checkout"
                          className="btn btntext btnValidation"
                          onClick={() => {
                            this.checkPhoneNumberAndEmailValidity();
                            this.handleOrderReviewValidation();
                          }}
                        >
                          Checkout
                        </a>
                      )}
                    </aside>
                  </section>
                </section>
                {/* E.O.Bottom Strap(pcpbBottomstrap) */}
              </section>
            </section>
          </section>
          {/* E.O.F&B Panelbody(pcfnbPanelBody) */}
        </section>
        {/* E.O.F&B Panel(pcfnbPanel) */}
      </section>
    );
  }
}

export default OrderReview;
