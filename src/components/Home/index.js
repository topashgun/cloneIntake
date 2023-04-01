import React from "react";
import {NavLink} from "react-router-dom";
import jQuery from "jquery";
import TextLoop from "react-text-loop";
//import {OverlayScrollbarsComponent} from "overlayscrollbars-react";
import Skeleton from "react-loading-skeleton";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleInfo} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import Selectdetails from "../OrderReview/selectdetails";
//import ColumnRight from "../ColumnRight";
import findBookingId from "../../assets/images/findBookingId.png";
import iconExtras from "../../assets/images/logo-spiExtras.png";
import iconExtrasPlus from "../../assets/images/logo-spiExtrasPlus.png";
import CalendarImage from "../../assets/images/ic-calendar29x32.svg";
import iconComingSoon from "../../assets/images/ic-comingSoon.png";

import constant from "../../configuration/config";
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var welcomeTextArray = ["Movie buff", "Optimus prime", "Cinephile", "Moviegoer", "Filmophile", "Terminator", "Captain Jack Sparrow"];
var categoryUpperSkeltonStyleObject = {
  height: 280,
  borderRadius: 12,
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
};
var categoryLowerSkeltonStyleObject = {
  height: 55,
  borderRadius: 12,
  borderTopLeftRadius: 0,
  borderTopRightRadius: 0,
};
var categoryLowerParentDivStyleObject = {marginTop: -2, marginBottom: 30};
var numberOfCategorySkeletons = 5;

var skeletonRcBoxStyleObject = {
  height: 92,
  boxShadow: "none",
  padding: "10px 0",
  display: "flex",
  justifyContent: "center",
};
var numberOfDealSkeletons = 4;
class Home extends React.Component {
  //osComponentCategoryList: RefObject<OverlayScrollbarsComponent>;

  constructor(props) {
    super(props);
    this.osComponentCategoryList = React.createRef();
    this.state = {
      bookingInfo: {},
      bookingLocation: {},
      dealsFlag: false,
      paramBookingiId: "",
      paramCinemaId: "",
      paramScreennumber: "",
      paramSeatrow: "",
      paramSeatnumber: "",
      dealWidth: 0,
      WindowSize: window.innerWidth,
      numberOfDealsToBeShown: 4,
    };
    this.dealsDiv = React.createRef();
    this.todaysDealsH2 = React.createRef();
  }

  componentDidMount = () => {
    //document.getElementsByTagName("body").classList.add("homePage");
    document.body.className += " homePage";

    window.addEventListener("resize", this.handleResize);
    ////////console.log("Home > componentDidMount()");
    //alert(1);
    var self = this;

    const params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop) => searchParams.get(prop),
    });
    this.setState({
      paramBookingiId: params.bookingid,
      paramCinemaId: params.cinemaid,
      paramScreennumber: params.screennumber,
      paramSeatrow: params.seatrow,
      paramSeatnumber: params.seatnumber,
    });

    //Payment Flow > To add/remove layout class "paymentContent" with class "pageWrapper"
    if (this.props.pwPaymentflow) {
      ////////console.log("Home > pwPaymentflow: " + this.props.pwPaymentflow);
      this.props.handlePaymentFlow(false);
    }

    //Payment Flow > Header > Home Icon
    if (this.props.showHomeIcon) {
      ////////console.log("Home > showHomeIcon: " + this.props.showHomeIcon);
      this.props.handleShowHomeIcon(false);
    }

    //Friday Specials > Slick.
    //this.props.handleFridaySpecialsSlick();

    /* Jquery Window Load & Resize */
    jQuery(window).on("load resize", function () {
      //////////console.log("Load & Resize");
      self.props.handleFooterSticky();
    });
    /* Jquery Window Load, Scroll & resize */
    // jQuery(window).on("load scroll resize", function () {
    //   /* F&B Category tab - Sticky */
    //   if (jQuery("#pcpfnbCategorywrapper").length > 0) {
    //     var stopVal = jQuery(this).scrollTop();
    //     var fnbpost = jQuery("#pcpfnbCategorywrapper").offset().top;
    //     var hHeight = jQuery(".pageHeader").outerHeight(true);
    //     var caltrgt = parseInt(fnbpost - hHeight);
    //     //////////console.log("Scroll Top: "+stopVal+" Category Top: "+fnbpost+" Header Height: "+hHeight+" = "+caltrgt);

    //     if (stopVal > caltrgt) {
    //       jQuery("#pcpfnbCategorywrapper").addClass("pcpfnbCategorysticky");
    //       /* setTimeout(() => {
    //         var hHeight1 = jQuery(".pageHeader").outerHeight(true);
    //         jQuery("#pcpfnbCategorywrapper .pcpfnbCategory").css(
    //           "top",
    //           parseInt(hHeight1)
    //         );
    //       }, 100);
    //       Hided08022022-1521*/
    //     } else {
    //       jQuery("#pcpfnbCategorywrapper").removeClass("pcpfnbCategorysticky");
    //       /*jQuery("#pcpfnbCategorywrapper .pcpfnbCategory").css("top", 0); Hided08022022-1521*/
    //     }
    //   }
    //   /* F&B > Tabs Animation */
    //   self.props.handleCategoryTabsUiAnimation();
    // });
    /* Jquery Window Resize & Scroll */
    // jQuery(window).on("resize scroll", function () {
    //   /* F&B > Tabs Animation */
    //   self.props.handleCategoryTabsUiAnimation();
    // });
  };

  componentWillUnmount() {
    document.body.className = document.body.className.replace("homePage", "");
    window.removeEventListener("resize", this.handleResize);
  }
  handleResize = (WindowSize, event) => {
    this.setState({WindowSize: window.innerWidth});
  };
  shuffle = (array) => {
    let currentIndex = array.length,
      randomIndex;
    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
  };
  componentDidUpdate = () => {
    if (!this.props.confirmBooking && this.props.parentState.deals.length > 0) {
      var todaysDealsH2Height = 0;
      if (this.state.WindowSize > 480) {
        todaysDealsH2Height = this.todaysDealsH2.current.offsetWidth;
      }
      var dealWidth = (this.dealsDiv.current.offsetWidth - todaysDealsH2Height - 24) / this.state.numberOfDealsToBeShown;
      ////console.log(this.dealsDiv.current.offsetWidth);
      ////console.log(this.todaysDealsH2.current.offsetWidth);
      var numberOfDealsToBeShown = this.state.numberOfDealsToBeShown;
      if (this.state.WindowSize < 1281 && this.state.WindowSize > 480) {
        numberOfDealsToBeShown = 2;
      } else if (this.state.WindowSize < 481) {
        numberOfDealsToBeShown = 1;
      } else {
        numberOfDealsToBeShown = 4;
      }

      if (numberOfDealsToBeShown != this.state.numberOfDealsToBeShown) {
        this.setState({numberOfDealsToBeShown});
      }
      if (this.state.dealWidth != dealWidth) {
        this.setState({
          dealWidth,
        });
      }
      ////console.log("-----------------------");
    }
    if (this.props.parentState.confirmBooking == false && this.state.dealsFlag == false) {
      this.setState(
        {
          dealsFlag: true,
        },
        () => {
          //////////console.log("Home Component >>> componentDidUpdate()");
          //////////this.props.handleFridaySpecialsSlick();
          // if (this.props.parentState.deals.length > 2) {
          //   this.props.handleFridaySpecialsSlick();
          //   var self = this;
          //   setTimeout(() => {
          //     self.props.handleFridaySpecialsSlick();
          //   }, 2000);
          // }
        }
      );
    }
    //QRCode - Setting the Cinema.
    if (this.state.paramCinemaId != "" && this.props.parentState.locations.length > 0 && Object.keys(this.state.bookingLocation).length === 0) {
      //////console.log("asdf: " + this.props.parentState.locations.length);
      var qrLocation = "";
      this.props.parentState.locations.map((location) => {
        if (this.state.paramCinemaId == location.cinemaid) {
          //////console.log("location");
          //////console.log(location);
          qrLocation = location;
          this.props.selectBookingLocation(location);
        }
      });
      if (qrLocation != "") {
        this.setState({
          bookingLocation: qrLocation,
        });
      }
    }
  };

  handleCbNo = () => {
    jQuery(".pcpfnbConfirmbooking[data-id='withBookingId']").slideUp(function () {
      setTimeout(() => {
        // jQuery(".pcpfnbConfirmbooking[data-id='withoutBookingId']").slideDown();
        jQuery(".tabSelectDetails").slideDown();
      }, 400);
    });
  };

  moveToSelectDetails = () => {
    this.props.handleshowHomeIconInLandingpage(true);
    ////////console.log("Home > moveToSelectDetails()");
    var self = this;
    jQuery(".pcpfnbConfirmbooking[data-id='withoutBookingId']").slideUp(function () {
      setTimeout(() => {
        jQuery(".tabSelectDetails").slideDown(() => {
          self.props.setToggleWithoutBookingId(true);
        });
      }, 200);
    });
  };

  populateDate = (showDate) => {
    ////////console.log("Home > populateDate()");
    var actualShowDate = showDate.split("T")[0].split("-");
    var date = actualShowDate[2];
    var month = months[actualShowDate[1] - 1];
    var year = actualShowDate[0];
    return date + " " + month + " " + year;
  };

  populateTime = (showTime) => {
    ////////console.log("Home > populateTime()");
    var actualShowTime = showTime.split("T")[1].split(":");
    var hours = actualShowTime[0];
    hours = hours > 12 ? hours - 12 : hours;
    hours = ("0" + hours).slice(-2);

    var minutes = actualShowTime[1];
    minutes = ("0" + minutes).slice(-2);

    var meridian = actualShowTime[0] >= 12 ? "PM" : "AM";
    return hours + ":" + minutes + " " + meridian;
  };

  populateNumberOfSeats = (orderItems) => {
    ////////console.log("Home > populateNumberOfSeats()");
    var qtySeats = 0;
    orderItems.map((orderItem) => {
      qtySeats += orderItem.quantity;
    });
    return qtySeats + " Seat" + (qtySeats < 2 ? "" : "s");
  };

  populateCategorySkeletons = () => {
    ////////console.log("Home > populateCategorySkeletons()");
    var categoryDiv = [];
    for (var i = 0; i < numberOfCategorySkeletons; i++) {
      categoryDiv.push(
        <>
          <div>
            <Skeleton duration={0.75} style={categoryUpperSkeltonStyleObject} />
          </div>
          <div style={categoryLowerParentDivStyleObject}>
            <Skeleton duration={0.75} style={categoryLowerSkeltonStyleObject} />
          </div>
        </>
      );
    }
    return categoryDiv;
  };

  populateDealSkeletons = () => {
    var dealDiv = [];
    for (var i = 0; i < numberOfDealSkeletons; i++) {
      dealDiv.push(
        <div className="rcBox" style={{...skeletonRcBoxStyleObject, width: this.state.dealWidth}}>
          <Skeleton duration={0.75} style={{height: 72, width: this.state.dealWidth - 20, borderRadius: 9}} />
        </div>
      );
    }
    return dealDiv;
  };

  validateFindMyBooking = () => {
    this.props.handleLoader(true);
    var locationSelectCount = jQuery(".pcpfnbConfirmbooking .pcpfnbcbInner .btn.locationButton.btn-selected").length;
    var bookingIdVal = jQuery("#fieldBookingId").val().trim();
    if (locationSelectCount >= 1 && bookingIdVal != "") {
      this.props.handleFindMyBookingSubmit();
    } else {
      alert("Select Location & enter your bookingid");
    }
  };

  showInformation = () => {
    Swal.fire({
      title: "<span class='extrasSweetAlertTitle'>Extras Member Pricing</span>",
      html: `<div class='extrasSweetAlert'>
    <div>
      <img class="image" src=${iconExtras}></img>
    </div>
    <div class="description"><span class="primaryColor"><b>Extras</b></span> members receive <b>special pricing on select films every day, free upgrades and no booking fees.</b></div>
  </div>
  <div class='extrasSweetAlert'>
    <div>
      <img class="image" src=${iconExtrasPlus}></img>
    </div>
    <div class="description"><span class="primaryColor"><b>Extras Plus</b></span> members enjoy <b>20% off food and drinks</b> (excluding alcohol and special offers), a free movie ticket a month and special tickets pricing for them and a friend. Join today and save!</div>
  </div>`,
      showCloseButton: false,
      showCancelButton: false,
      focusConfirm: false,
      reverseButtons: true,
      confirmButtonColor: "#b42e34",
      width: 600,
      customClass: {
        confirmButton: "extrasSweetAlertOkButton",
      },
    });
  };

  cancelBookingSwal = async () => {
    const {value: orderId} = await Swal.fire({
      html: `<h5>Enter the order id you want to cancel</h5>`,
      input: "text",
      showCancelButton: true,
      reverseButtons: true,
      confirmButtonColor: "#b42e34",
      customClass: {
        confirmButton: "extrasSweetAlertOkButton",
      },
      inputValidator: (value) => {
        if (!value) {
          return "Please enter your order id";
        }
      },
    });

    if (orderId) {
      Swal.fire(`Your IP address is ${orderId}`);
    }
  };
  populateNumberOfStaticPromotions = () => {
    var parentStateDeals = this.props.parentState.deals.length;
    var numberOfStaticPromotions = 0;

    if (parentStateDeals == 3) {
      numberOfStaticPromotions = 1;
    } else if (parentStateDeals == 2) {
      numberOfStaticPromotions = 2;
    } else if (parentStateDeals == 1) {
      numberOfStaticPromotions = 3;
    }

    if (this.state.numberOfDealsToBeShown == 1) {
      numberOfStaticPromotions = 0;
    } else if (this.state.numberOfDealsToBeShown == 2) {
      if (parentStateDeals > 2) {
        numberOfStaticPromotions = 0;
      } else {
        numberOfStaticPromotions = 1;
      }
    }

    return numberOfStaticPromotions;
  };
  showWhereToFindImage = () => {
    Swal.fire({
      // title: "Sweet!",
      // text: "Modal with a custom image.",
      imageUrl: findBookingId,
      imageAlt: "Custom image",
      width: 600,
      heightAuto: true,
      padding: "0",
      customClass: {
        image: "whereToFindImageClass",
        actions: "whereToFindActionsClass",
        confirmButton: "extrasSweetAlertOkButton",
      },
    });
  };

  populateLocations = (locationsData) => {
    console.log("populateLocations()");
    console.log("locationsData: ");
    console.log(locationsData);

    var locationsList = this.props.parentState.locations.map(
      //paramBookingiId paramCinemaId
      (location, index) => {
        return constant.locationsToShow.findIndex((x) => x == location.cinemaid) != -1 ||
          (this.props.parentState.debugLocationsURL != "" &&
            this.props.parentState.debugLocationsCinemaIDs.length > 0 &&
            this.props.parentState.debugLocationsCinemaIDs.findIndex((x) => x == location.cinemaid) != -1) ? (
          <button
            key={"bidFlow_location_" + index + "_" + location.pid + "_" + location.cinemas_locations[0].id}
            type="button"
            //className={`btn locationButton`}
            className={`btn btndefault locationButton alignItemStretch ${
              Object.keys(this.props.parentState.bookingLocation).length !== 0 && this.props.parentState.bookingLocation.cinemas_locations[0].city == location.cinemas_locations[0].city
                ? "btn-selected"
                : "btn-non-selected"
            }`}
            onClick={() => this.props.selectBookingLocation(location)}
          >
            {location.cinemas_attributes[0].name}
          </button>
        ) : (
          ""
        );
      }
    );

    return locationsList;
  };

  render() {
    return (
      <section className="pageContent">
        <section className="pcPanel">
          {/* Confirm Booking Block */}
          <section id="pcConfirmBooking">
            {this.props.confirmBooking ? (
              <section className="pcpBody">
                <section className="container">
                  <section className="pcpbInner">
                    <section className="pcpbiColswrap clearfix pcpFnbblock">
                      <section className="pcpbiCols pcpbiColfull">
                        <section className="pcpfnbConfirmbooking" data-id="withBookingId" style={{display: this.props.parentState.bookingIdSection == "withoutBookingId" ? "none" : "block"}}>
                          <section className="roundBoxshadowed">
                            <section className="pcpfnbcbInner">
                              <h1 className="welcomeText">
                                {Object.keys(this.props.bookingInfo).length === 0 || this.props.parentState.bookingURLCinemaId == "" ? (
                                  <Skeleton style={{width: "50%"}} />
                                ) : this.props.bookingInfo.fullname && this.props.bookingInfo.fullname != "" ? (
                                  `Welcome, ${this.props.populateFullnameByType("Firstname", this.props.bookingInfo.fullname)}`
                                ) : (
                                  `Welcome`
                                )}
                              </h1>

                              <h1>{Object.keys(this.props.bookingInfo).length === 0 || this.props.parentState.bookingURLCinemaId == "" ? <Skeleton /> : `Let's get some Food & Drinks!`}</h1>
                              <h2>
                                {Object.keys(this.props.bookingInfo).length === 0 || this.props.parentState.bookingURLCinemaId == "" ? (
                                  <Skeleton style={{width: "75%"}} />
                                ) : (
                                  this.props.bookingInfo.film.title
                                )}
                              </h2>
                              {Object.keys(this.props.bookingInfo).length === 0 || this.props.parentState.bookingURLCinemaId == "" ? (
                                <Skeleton style={{width: "75%"}} />
                              ) : (
                                <p className="pcpfnbcbiLocation">
                                  <span>
                                    {Object.keys(this.props.bookingInfo).length === 0 || this.props.parentState.bookingURLCinemaId == ""
                                      ? ""
                                      : this.props.bookingInfo.cinema.cinemas_attributes[0].name}
                                  </span>
                                </p>
                              )}

                              {Object.keys(this.props.bookingInfo).length === 0 || this.props.parentState.bookingURLCinemaId == "" ? (
                                <>
                                  <Skeleton duration={0.75} style={{width: "75%"}} />
                                </>
                              ) : (
                                <p>
                                  <span>
                                    {Object.keys(this.props.bookingInfo).length === 0 || this.props.parentState.bookingURLCinemaId == "" ? "" : this.populateDate(this.props.bookingInfo.showdate)}
                                  </span>
                                  <span>
                                    {Object.keys(this.props.bookingInfo).length === 0 || this.props.parentState.bookingURLCinemaId == "" ? "" : this.populateTime(this.props.bookingInfo.showtime)}
                                  </span>
                                  {/* <span>{Object.keys(this.props.bookingInfo).length === 0 ? "" : this.populateNumberOfSeats(this.props.bookingInfo.orders_items)}</span> */}
                                  <span>
                                    {Object.keys(this.props.bookingInfo).length === 0 || this.props.parentState.bookingURLCinemaId == ""
                                      ? ""
                                      : this.props.bookingInfo.orders_items && this.props.bookingInfo.orders_items.length > 0
                                      ? this.populateNumberOfSeats(this.props.bookingInfo.orders_items)
                                      : this.state.paramSeatrow != null && this.state.paramSeatnumber != null
                                      ? "Seat " + this.state.paramSeatrow + this.state.paramSeatnumber
                                      : ""}
                                  </span>
                                </p>
                              )}
                              <h3>
                                {Object.keys(this.props.bookingInfo).length === 0 || this.props.parentState.bookingURLCinemaId == "" ? (
                                  <Skeleton />
                                ) : (
                                  "Is this the visit you're trying to order food for?"
                                )}
                              </h3>

                              {Object.keys(this.props.bookingInfo).length === 0 || this.props.parentState.bookingURLCinemaId == "" ? (
                                <>
                                  <div
                                    style={{
                                      width: "49%",
                                      display: "inline-block",
                                    }}
                                  >
                                    <Skeleton duration={0.75} style={{height: 34}} />
                                  </div>
                                  <div
                                    style={{
                                      width: "49%",
                                      display: "inline-block",
                                      marginLeft: "2%",
                                    }}
                                  >
                                    <Skeleton duration={0.75} style={{height: 34}} />
                                  </div>
                                </>
                              ) : (
                                <aside className="btnswrap">
                                  {/* <a
                                    href="javascript:;"
                                    className="btn btndefault"
                                    title="That's correct"
                                    //onClick={() => handleConfirmBooking(true)}
                                    onClick={() => this.props.handleConfirmBooking(false)}
                                  >
                                    <span>That's correct</span>
                                  </a> */}
                                  <NavLink to="/fnbmenu" className="btn btndefault" title="That's correct" onClick={() => this.props.handleConfirmBooking(false)}>
                                    That's correct
                                  </NavLink>
                                  <a
                                    href="javascript:;"
                                    className="btn btntext"
                                    title="No, this isn't me"
                                    onClick={() => {
                                      this.props.handleBookingFlowNoThisIsntMe();
                                      this.handleCbNo();
                                    }}
                                  >
                                    <span>No, this isn't me</span>
                                  </a>
                                </aside>
                              )}
                            </section>
                          </section>
                        </section>

                        {/* booking id based Booking starts*/}
                        <section className="pcpfnbConfirmbooking" data-id="withoutBookingId" style={{display: this.props.parentState.bookingIdSection == "withoutBookingId" ? "block" : "none"}}>
                          <section className="roundBoxshadowed">
                            <section className="pcpfnbcbInner">
                              <h1 className="welcomeText">
                                Welcome,{" "}
                                <TextLoop>
                                  {this.shuffle(welcomeTextArray).map((name) => {
                                    return <span>{name}</span>;
                                  })}
                                </TextLoop>
                              </h1>
                              <h1>Let's get some Food &amp; Drinks!</h1>
                              <h2>Where are you watching?</h2>
                              {Object.keys(this.props.parentState.locations).length === 0 ? (
                                <>
                                  <div className="locationButtonSkeleton" style={{width: "33%"}}>
                                    <Skeleton duration={0.75} style={{height: 36}} />
                                  </div>
                                  <div className="locationButtonSkeleton" style={{width: "51.3%"}}>
                                    <Skeleton duration={0.75} style={{height: 36}} />
                                  </div>
                                  <div className="locationButtonSkeleton" style={{width: "25%"}}>
                                    <Skeleton duration={0.75} style={{height: 36}} />
                                  </div>
                                  <div className="locationButtonSkeleton" style={{width: "61.3%"}}>
                                    <Skeleton duration={0.75} style={{height: 36}} />
                                  </div>
                                  <div className="locationButtonSkeleton" style={{width: "40.3%"}}>
                                    <Skeleton duration={0.75} style={{height: 36}} />
                                  </div>
                                  <div className="locationButtonSkeleton" style={{width: "42.3%"}}>
                                    <Skeleton duration={0.75} style={{height: 36}} />
                                  </div>
                                </>
                              ) : (
                                <div className="alignItemStretchParent">
                                  {this.populateLocations(this.props.parentState.locations)}
                                  {/* {this.props.parentState.locations.map(
                                    //paramBookingiId paramCinemaId
                                    (location, index) => {
                                      return constant.locationsToShow.findIndex((x) => x == location.cinemaid) != -1 ? (
                                        <button
                                          key={"bidFlow_location_" + index + "_" + location.pid + "_" + location.cinemas_locations[0].id}
                                          type="button"
                                          //className={`btn locationButton`}
                                          className={`btn btndefault locationButton alignItemStretch ${
                                            Object.keys(this.props.parentState.bookingLocation).length !== 0 &&
                                            this.props.parentState.bookingLocation.cinemas_locations[0].city == location.cinemas_locations[0].city
                                              ? "btn-selected"
                                              : "btn-non-selected"
                                          }`}
                                          onClick={() => this.props.selectBookingLocation(location)}
                                        >
                                          {location.cinemas_attributes[0].name}
                                        </button>
                                      ) : (
                                        ""
                                      );
                                    }
                                  )} */}
                                </div>
                              )}

                              <div className="row">
                                <div className="col-12 d-flex flex-column justify-content-center">
                                  <h2 style={{marginTop: 20}}>Enter your booking ID</h2>
                                  <div className="pageForm">
                                    <input
                                      value={this.props.parentState.bookingId}
                                      id="fieldBookingId"
                                      type="text"
                                      placeholder="Booking ID"
                                      className="form-control"
                                      onChange={(event) => this.props.getBookingId(event)}
                                      style={{
                                        width: "100%",
                                        marginTop: 10,
                                        marginBottom: 2.5,
                                      }}
                                    />
                                  </div>
                                  <p className="bookingIdHelperText">
                                    Your booking ID can be found in your confirmation email.{" "}
                                    <span id="clickToSeeWhere" onClick={this.showWhereToFindImage}>
                                      Click to see where.
                                    </span>
                                  </p>
                                  <p className={`bookingIdHelperText bookingIdError ${this.props.parentState.bookingIdError ? "" : "d-none"}`}>Booking details not found!</p>
                                </div>
                              </div>

                              {Object.keys(this.props.parentState.locations).length === 0 ? (
                                <>
                                  <div
                                    style={{
                                      width: "49%",
                                      display: "inline-block",
                                    }}
                                  >
                                    <Skeleton duration={0.75} style={{height: 34}} />
                                  </div>
                                  <div
                                    style={{
                                      width: "49%",
                                      display: "inline-block",
                                      marginLeft: "2%",
                                    }}
                                  >
                                    <Skeleton duration={0.75} style={{height: 34}} />
                                  </div>
                                </>
                              ) : (
                                <aside className="btnswrap" style={{marginTop: 10}}>
                                  <a
                                    href="javascript:;"
                                    //className="btn btndefault"
                                    className={`btn btndefault ${
                                      Object.keys(this.props.parentState.bookingLocation).length !== 0 && this.props.parentState.bookingId != "" && !this.props.parentState.bookingIdError
                                        ? ""
                                        : "disabled"
                                    }`}
                                    title="That's correct"
                                    onClick={() => this.validateFindMyBooking()}
                                  >
                                    <span>Find My Booking</span>
                                  </a>
                                  <a href="javascript:;" className="btn btntext" title="No, this isn't me" onClick={() => this.moveToSelectDetails()}>
                                    <span>Can't find my booking ID</span>
                                  </a>
                                </aside>
                              )}
                            </section>
                            {constant.cancelOrder ? (
                              <div
                                className="refundOptions"
                                //onClick={this.cancelBookingSwal}
                              >
                                Want to cancel your order ?{" "}
                                <span data-bs-toggle="modal" data-bs-target="#orderCancellation">
                                  Click here
                                </span>
                              </div>
                            ) : (
                              ""
                            )}
                          </section>
                        </section>
                        {/* booking id based Booking ends*/}

                        {/* E.O.Confirm Booking */}
                        <section className="tabSelectDetails" style={{display: "none"}}>
                          <Selectdetails
                            handleConfirmBooking={this.props.handleConfirmBooking}
                            locations={this.props.parentState.locations}
                            dates={this.props.parentState.dates}
                            getDates={this.props.getDates}
                            getSessionByExperience={this.props.getSessionByExperience}
                            movies={this.props.parentState.movies}
                            updateMovieListFlag={this.props.parentState.updateMovieListFlag}
                            setMovieListFlag={this.props.setMovieListFlag}
                            handleSelectDetailsProceed={this.props.handleSelectDetailsProceed}
                            parentState={this.props.parentState}
                            formatTime={this.props.formatTime}
                            setToggleWithoutBookingId={this.props.setToggleWithoutBookingId}
                            selectBookingLocation={this.props.selectBookingLocation}
                          />
                        </section>
                        {/* E.O.Select Details */}

                        {/* Location Coming Soon */}
                        <section className="pcpfnbConfirmbooking locationComingSoon" id="locationComingSoonBlock" style={{display: "none"}}>
                          <section className="roundBoxshadowed">
                            <section className="pcpfnbcbInner">
                              <h1 className="welcomeText">
                                {Object.keys(this.props.bookingInfo).length === 0 ? (
                                  <Skeleton style={{width: "50%"}} />
                                ) : this.props.bookingInfo.fullname && this.props.bookingInfo.fullname != "" ? (
                                  `Welcome, ${this.props.populateFullnameByType("Firstname", this.props.bookingInfo.fullname)}`
                                ) : (
                                  `Welcome`
                                )}
                              </h1>
                              <h2>
                                <img src={iconComingSoon} alt="We're Coming Soon" className="img-fluid"></img>
                                <span>
                                  <em>We're</em>
                                  Coming Soon
                                </span>
                              </h2>
                              <p>
                                <span>Online Ordering</span> is not available at this location.{" "}
                              </p>
                            </section>
                          </section>
                        </section>
                        {/* E.O.Location Coming Soon */}
                      </section>
                    </section>
                  </section>
                </section>
              </section>
            ) : (
              ""
            )}
          </section>
          {/* E.O.Confirm Booking Block */}
        </section>
      </section>
    );
  }
}

export default Home;
