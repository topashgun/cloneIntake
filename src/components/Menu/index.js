import React from "react";
import {NavLink} from "react-router-dom";
import jQuery, {parseHTML} from "jquery";
import * as API from "../../configuration/apiconfig";
//import TextLoop from "react-text-loop";
import {OverlayScrollbarsComponent} from "overlayscrollbars-react";
import Skeleton from "react-loading-skeleton";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleLeft, faAngleRight, faCaretLeft, faCaretRight, faCircleInfo} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
//import Selectdetails from "../OrderReview/selectdetails";
import ColumnRight from "../ColumnRight";
import findBookingId from "../../assets/images/findBookingId.png";
import iconExtras from "../../assets/images/logo-spiExtras.png";
import iconExtrasPlus from "../../assets/images/logo-spiExtrasPlus.png";
import CalendarImage from "../../assets/images/ic-calendar29x32.svg";

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
class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.osComponentCategoryList = React.createRef();
    this.state = {
      bookingInfo: {},
      bookingLocation: {},
      dealsFlag: false,
      dealWidth: localStorage.getItem("dealWidth") == null ? 0 : Number(localStorage.getItem("dealWidth")),
      dealEllipsisCount: 0,
      WindowSize: window.innerWidth,
      numberOfDealsToBeShown: 4,
      overlayScrollbarHasArrows: false,
    };
    this.dealsDiv = React.createRef();
    this.todaysDealsH2 = React.createRef();
  }

  componentDidMount = async () => {
    this.props.handleshowHomeIconInLandingpage(false);
    ////document.body.className = document.body.className.replace("homePage", "");
    document.body.className += " menuPage";
    const parentStateData = this.props.parentState;
    localStorage.setItem("stateData", JSON.stringify(parentStateData));
    if (this.props.parentState.selectDetailsProceed) {
      this.props.setSelectDetailsProceedFalse();
      var selectedState = this.props.parentState.normalBookingInfoSelected;
      var bookingInfo = this.props.parentState.bookingInfo;
      if (constant.today_deals) {
        if(selectedState.locationId !== undefined ){
          this.props.getDeals(selectedState.locationId);
        }else{
          this.props.getDeals(bookingInfo.cinema.id);
        }
      }
      if(selectedState.locationId !== undefined && selectedState.sessionId !== undefined){
        this.props.getMenuItems(selectedState.locationId, selectedState.sessionId);
      }else {
        this.props.getMenuItems(bookingInfo.cinema.id, bookingInfo.sessionid);
      }
     // this.props.getMenuItems(selectedState.locationId, selectedState.sessionId);
      this.props.handleCategoryTabsUiAnimation();
      this.props.handleFooterSticky();
    }

    await window.addEventListener("resize", this.handleResize);
    var self = this;
    if (this.props.pwPaymentflow) {
      this.props.handlePaymentFlow(false);
    }
    if (this.props.showHomeIcon) {
      this.props.handleShowHomeIcon(false);
    }
    jQuery(window).on("load resize", function () {
      self.props.handleFooterSticky();
    });
    jQuery(window).on("load scroll resize", function () {
      if (jQuery("#pcpfnbCategorywrapper").length > 0) {
        var stopVal = jQuery(this).scrollTop();
        var fnbpost = jQuery("#pcpfnbCategorywrapper").offset().top;
        var hHeight = jQuery(".pageHeader").outerHeight(true);
        hHeight = 0; //***Option to remove fixed header.
        var caltrgt = parseInt(fnbpost - hHeight);
        if (stopVal > caltrgt) {
          jQuery("#pcpfnbCategorywrapper").addClass("pcpfnbCategorysticky");
        } else {
          jQuery("#pcpfnbCategorywrapper").removeClass("pcpfnbCategorysticky");
        }
      }
      self.props.handleCategoryTabsUiAnimation();
    });
    this.updateDealsHeight();

    //Deals Scoll to left on click of ellipsis
    jQuery("body").on("click", ".specialsStrap .ssColsEllisis li", function (event) {
      event.stopPropagation();
      var curIndex = jQuery(this).index();
      ////console.log("curIndex: " + curIndex);
      jQuery(".specialsStrap .ssColsEllisis li").removeClass("active");
      jQuery(this).addClass("active");
      var scrollLeftVal = 0;
      if (curIndex >= 1) {
        scrollLeftVal = curIndex * self.state.dealWidth * self.state.numberOfDealsToBeShown;
      } else {
        scrollLeftVal = 0;
      }
      ////console.log("Pagination: " + parseInt((curIndex - 1) * self.state.numberOfDealsToBeShown + 1));
      ////console.log("scrollLeftVal: " + scrollLeftVal);
      jQuery("#specialsWrapper").animate(
        {
          scrollLeft: scrollLeftVal,
        },
        600
      );
    });
    var specialsWrapperEle = document.getElementById("specialsWrapper");
    if (specialsWrapperEle !== null) {
      specialsWrapperEle.addEventListener("scroll", (event) => this.handleSpecialsWrapperScroll(event));
    }

    // jQuery("#specialsWrapper").on("scroll", function (e) {
    //   var scrollLeftVal = jQuery(this).scrollLeft();
    //   var ellipsesActive = parseInt(scrollLeftVal / self.state.dealWidth);
    //   ////console.log("ellipsesActive 0: " + ellipsesActive);
    //   ellipsesActive = ellipsesActive / self.state.numberOfDealsToBeShown;
    //   ////console.log("ellipsesActive 1: " + ellipsesActive);
    //   var curActive = jQuery(".specialsStrap .ssColsEllisis li.active").index();
    //   if (curActive != ellipsesActive) {
    //     jQuery(".specialsStrap .ssColsEllisis li").removeClass("active");
    //     jQuery(".specialsStrap .ssColsEllisis li:nth-child(" + parseInt(ellipsesActive + 1) + ")").addClass("active");
    //   }
    // });
  };

  componentWillUnmount() {
    document.body.className = document.body.className.replace("menuPage", "");
    window.removeEventListener("resize", this.handleResize);
    var specialsWrapperEle = document.getElementById("specialsWrapper");
    if (specialsWrapperEle !== null) {
      specialsWrapperEle.removeEventListener("scroll", (event) => this.handleSpecialsWrapperScroll(event));
    }
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
  updateDealsHeight = () => {
    if (!this.props.confirmBooking && this.props.parentState.deals.length > 0) {
      var todaysDealsH2Height = 0;
      if (this.state.WindowSize > 480) {
        todaysDealsH2Height = this.todaysDealsH2.current.offsetWidth;
      }
      var dealWidth = (this.dealsDiv.current.offsetWidth - todaysDealsH2Height - 24) / this.state.numberOfDealsToBeShown;
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
        this.setState(
          {
            dealWidth,
          },
          () => {
            localStorage.setItem("dealWidth", Number(this.state.dealWidth));
          }
        );
      }
      ////console.log("-----------------------");
      //dealEllipsisCount
      var tempDealEllipsisCount = this.state.dealEllipsisCount;
      var calDealEllipsisCount = this.props.parentState.deals.length / this.state.numberOfDealsToBeShown;
      //////console.log("calDealEllipsisCount: " + calDealEllipsisCount);
      if (tempDealEllipsisCount != calDealEllipsisCount) {
        this.setState({dealEllipsisCount: calDealEllipsisCount});
      }
    }
  };
  componentDidUpdate = () => {
    this.updateDealsHeight();
    if (this.props.parentState.confirmBooking == false && this.state.dealsFlag == false) {
      this.setState({
        dealsFlag: true,
      });
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
    ////////console.log("Home > moveToSelectDetails()");
    jQuery(".pcpfnbConfirmbooking[data-id='withoutBookingId']").slideUp(function () {
      setTimeout(() => {
        jQuery(".tabSelectDetails").slideDown();
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

    ////console.log(this.state.numberOfDealsToBeShown);
    ////console.log(numberOfStaticPromotions);
    ////console.log(parentStateDeals);
    ////console.log("--------------------------------------");
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
  generateDealsEllipsis = (ellipsisCount) => {
    //////console.log("Menu > generateDealsEllipsis()");
    //////console.log("ellipsisCount: " + ellipsisCount);
    var liHtml = "";
    for (var i = 0; i < ellipsisCount; i++) {
      if (i == 0) {
        liHtml += "<li class='active'></li>";
      } else {
        liHtml += "<li></li>";
      }
    }
    //////console.log("liHtml:");
    //////console.log(liHtml);
    return liHtml;
  };
  handleCustomArrowClick = (arrowFlag, osRefFlag) => {
    // //console.log("Menu > handleCustomArrowClick()");
    // //console.log("arrowFlag: " + arrowFlag);
    // // var osHostEle = document.getElementsByClassName("mcsbWrapper");
    // // var osHostWidth = osHostEle[0].offsetWidth;
    // // console.log("osHostWidth: " + osHostWidth);
    // //console.log(osViewportEle.offsetWidth);
    // if (arrowFlag == "scrollLeft") {
    //   osViewportEle.scrollBy(-200, 0);
    //   // jQuery(".pcpFnbblock .pcpfnbCategory ul").scrollRight(100);
    // } else {
    //   osViewportEle.scrollBy(200, 0);
    // }
    var osEle = document.getElementById("categoryOverlayScrollbar");
    var osViewportEle = osEle.querySelector(".os-viewport");
    var scrollValue = arrowFlag == "scrollLeft" ? "-=" + osViewportEle.offsetWidth + "" : "+=" + osViewportEle.offsetWidth + "";
    if (osRefFlag && osRefFlag.current && osRefFlag.current != null) {
      const osInstance = osRefFlag.current.osInstance();
      if (osInstance) {
        //osInstance.scrollStop().scroll( { x: Math.floor(Math.random() * osInstance.scroll().max.x + 0), y: Math.floor(Math.random() * osInstance.scroll().max.y + 0), }, 1000, "easeOutElastic" );
        osInstance.scroll({x: scrollValue, y: "0"}, 400);
      }
    }
  };

  handleSpecialsWrapperScroll = (event) => {
    var self = this;
    //////var scrollLeftVal = jQuery(this).scrollLeft();
    var scrollLeftVal = jQuery(event.target).scrollLeft();
    ////console.log("scrollLeftVal: " + scrollLeftVal);
    var ellipsesActive = parseInt(scrollLeftVal / self.state.dealWidth);
    ////console.log("ellipsesActive 0: " + ellipsesActive);
    ellipsesActive = ellipsesActive / self.state.numberOfDealsToBeShown;
    ////console.log("ellipsesActive 1: " + ellipsesActive);
    ellipsesActive = ellipsesActive < 1 && ellipsesActive >= 0.5 ? 1 : ellipsesActive;
    ////console.log("ellipsesActive 2: " + ellipsesActive);
    var curActive = jQuery(".specialsStrap .ssColsEllisis li.active").index();
    ////console.log("curActive: " + curActive);
    if (curActive != ellipsesActive) {
      jQuery(".specialsStrap .ssColsEllisis li").removeClass("active");
      jQuery(".specialsStrap .ssColsEllisis li:nth-child(" + parseInt(ellipsesActive + 1) + ")").addClass("active");
    }
  };

  handleOverlayScrollbarArrows = (arrowFlag) => {
    console.log("handleOverlayScrollbarArrows()");
    console.log("arrowFlag: " + arrowFlag);
  };

  render() {
    return (
      <section className="pageContent">
        <section className={`pcPanel ${this.props.parentState.deals.length == 0 ? "pt-0" : ""}`}>
          {/* Food & Beverages Block */}
          <section id="pcMainContent">
            <>
              {/* E.O.Panel Head */}
              <section className="pcpBody">
                {constant.today_deals ? (
                  this.props.parentState.deals.length == 0 ? (
                    ""
                  ) : (
                    <section className="specialsStrap">
                      <section className="container">
                        <section className="row">
                          <section className="col-12 d-flex align-items-center" ref={this.dealsDiv} id="dealsDiv">
                            <div className="todaysSpecialDiv" ref={this.todaysDealsH2}>
                              <img src={CalendarImage} className="todaysSpecialsCalendarImage"></img>
                              <div className="todaysSpecialsheadingDiv">
                                <h2 className="ssH2">Today's</h2>
                                <h2 className="ssH2 specialsHeading">Specials</h2>
                              </div>
                            </div>
                            <section className="ssCols" id="specialsWrapper" onScroll={this.handleSpecialsWrapperScroll.bind(this)}>
                              {/* {this.props.parentState.deals.length == 0 || this.props.staticPromotions.length == 0} */}
                              {this.props.parentState.deals.length == 0
                                ? this.populateDealSkeletons()
                                : this.props.parentState.deals.map((dealItem) => {
                                    return (
                                      <section
                                        className="ssCol"
                                        onClick={() => this.props.setFnbItemModifierData(dealItem, "", "", true, "")}
                                        style={{width: this.state.dealWidth}}
                                        key={`specials_${dealItem.id}`}
                                      >
                                        <aside className="rcBox" title={dealItem.itemName}>
                                          <h3>{dealItem.itemName}</h3>
                                          <p className="rcDiscount">
                                            <span>
                                              {dealItem.discountType == 3
                                                ? dealItem.discountValue + "%"
                                                : dealItem.discountType == 2
                                                ? "$" + dealItem.discountValue / 100
                                                : "No such discountType available."}
                                              <em>off</em>
                                            </span>
                                          </p>
                                          <p className="priceInfo">
                                            <span className="specialPrice">{`$${Number(dealItem.strikeValueBeforeTax).toFixed(2)}`}</span>
                                            <span className="actualPrice">{`$${Number(dealItem.valuebeforetax).toFixed(2)}`}</span>
                                          </p>
                                        </aside>
                                      </section>
                                    );
                                  })}
                              {/*  All days Deals. */}
                              {/* {this.props.parentState.deals.length == 0 || this.props.parentState.todaysDealsCount == 0 || this.props.staticPromotions.length == 0
                              ? this.populateDealSkeletons()
                              : this.props.parentState.deals.map((dealItem) => {
                                  return dealItem.isTodayDeal ? (
                                    <section className="ssCol" onClick={() => this.props.setFnbItemModifierData(dealItem.dealInfo[0], "", "", true, "")} style={{width: this.state.dealWidth}}>
                                      <aside className="rcBox" data-bs-toggle="modal" data-bs-target="#modalFnbModifier" titl={dealItem.dealInfo[0].itemName}>
                                        <h3>{dealItem.dealInfo[0].itemName}</h3>
                                        <p className="rcDiscount">
                                          <span>
                                            {dealItem.dealInfo[0].discountType == 3
                                              ? dealItem.dealInfo[0].discountValue + "%"
                                              : dealItem.dealInfo[0].discountType == 2
                                              ? "$" + dealItem.dealInfo[0].discountValue / 100
                                              : "No such discountType available."}
                                            <em>off</em>
                                          </span>
                                        </p>
                                        <p className="priceInfo">
                                          <span className="specialPrice">{`$${Number(dealItem.dealInfo[0].strikeValueBeforeTax).toFixed(2)}`}</span>
                                          <span className="actualPrice">{`$${Number(dealItem.dealInfo[0].valuebeforetax).toFixed(2)}`}</span>
                                        </p>
                                      </aside>
                                    </section>
                                  ) : (
                                    ""
                                  );
                                })} */}
                              {/* {this.props.parentState.deals.length > 0 && this.state.dealEllipsisCount > 1 ? (
                              <ul className="ssColsEllisis" dangerouslySetInnerHTML={{__html: this.generateDealsEllipsis(this.state.dealEllipsisCount)}}></ul>
                            ) : (
                              ""
                            )} */}
                            </section>
                            {this.props.staticPromotions.length != 0
                              ? this.props.staticPromotions.slice(0, this.populateNumberOfStaticPromotions()).map((staticPromotion) => {
                                  return (
                                    <div style={{width: this.state.dealWidth}} className="statiPromotionsDiv">
                                      <aside className="rcBox rcbColumn">
                                        <h2>{staticPromotion.promotions_attributes[0].title}</h2>
                                        <p>{staticPromotion.promotions_attributes[0].shortdescription}</p>
                                      </aside>
                                    </div>
                                  );
                                })
                              : ""}
                          </section>
                          <section className="col-12">
                            {this.props.parentState.deals.length > 0 && this.state.dealEllipsisCount > 1 ? (
                              <ul className="ssColsEllisis" dangerouslySetInnerHTML={{__html: this.generateDealsEllipsis(this.state.dealEllipsisCount)}}></ul>
                            ) : (
                              ""
                            )}
                          </section>
                        </section>
                      </section>
                    </section>
                  )
                ) : (
                  ""
                )}

                {constant.login ? (
                  <section className="switchStrap">
                    <section className="switchMemberLogin">
                      <section className="container">
                        <section className="smlInner">
                          <aside className="smliCols">
                            {this.props.memberLogin ? (
                              <p className="afterLogin">
                                <span className="userInfo">
                                  {Object.keys(this.props.parentState.afterLoginToken).length !== 0
                                    ? this.props.parentState.afterLoginToken.firstname + " " + this.props.parentState.afterLoginToken.lastname
                                    : ""}
                                </span>
                                <a href="javascript:;" className="sessionLogout" onClick={this.props.logoutUser}>
                                  Log Out
                                </a>
                              </p>
                            ) : (
                              <p className="beforeLogin">
                                Non-member
                                <span>pricing</span>
                              </p>
                            )}
                          </aside>
                          <aside className="form-check form-switch">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="switchMemberPricing"
                              onChange={(e) => this.props.handleOnchangeMemberPricing(e)}
                              checked={Object.keys(this.props.parentState.afterLoginToken).length !== 0 ? true : false}
                            />
                            <label className="form-check-label" htmlFor="switchMemberPricing">
                              Default switch checkbox input
                            </label>
                          </aside>
                          <aside className="smliCols">
                            <p>
                              <b>Extras</b> Member <FontAwesomeIcon icon={faCircleInfo} size="20px" onClick={() => this.showInformation()} color="#453135" style={{cursor: "pointer"}} />
                              <span>Pricing</span>
                            </p>
                          </aside>
                        </section>
                      </section>
                    </section>
                  </section>
                ) : (
                  ""
                )}

                {/* E.O.Member/Non-Member Login */}
                <section className="container">
                  <section className="pcpbInner">
                    <section className="pcpbiColswrap clearfix pcpFnbblock">
                      <section className="pcpbiCols pcpbiColfull withOverlayScrollbar">
                        <section id="pcpfnbCategorywrapper">
                          <aside className="pcpfnbCategory">
                            <aside className="pcpfnbcInner">
                              {/* <a href="javascript:;" className="osCustomArrows osCustomArrowLeft" onClick={() => this.handleCustomArrowClick("scrollLeft")}>
                                Scroll Left
                              </a> */}
                              {this.props.parentState.fnbMenuItems.length > 0 ? (
                                <a href="javascript:;" className="osCustomArrows osCustomArrowLeft" onClick={() => this.handleCustomArrowClick("scrollLeft", this.osComponentCategoryList)}>
                                  {/* <FontAwesomeIcon icon={faAngleLeft} onClick={() => this.handleCustomArrowClick("scrollLeft")} className="scrollCaret" style={{paddingRight: 5}} /> */}
                                  <FontAwesomeIcon icon={faAngleLeft} className="scrollCaret" />
                                </a>
                              ) : (
                                ""
                              )}
                              <OverlayScrollbarsComponent
                                ref={this.osComponentCategoryList}
                                options={{
                                  paddingAbsolute: true,
                                  autoUpdate: true,
                                  scrollbars: {
                                    clickScrolling: true,
                                  },
                                  callbacks: {
                                    onInitialized: function () {
                                      //console.log("OverlayScrollbarsComponent > onInitialized:");
                                      var osComEle = document.getElementById("categoryOverlayScrollbar");
                                      if (osComEle !== null) {
                                        if (osComEle.classList.contains("os-host-scrollbar-horizontal-hidden")) {
                                          var arrowsEle = document.getElementsByClassName("osCustomArrows");
                                          for (var i = 0; i < arrowsEle.length; i++) {
                                            arrowsEle[i].classList.add("d-none");
                                          }
                                        } else {
                                          var arrowsEle = document.getElementsByClassName("osCustomArrows");
                                          for (var i = 0; i < arrowsEle.length; i++) {
                                            arrowsEle[i].classList.remove("d-none");
                                          }
                                        }
                                      }
                                    },
                                    onUpdated: function () {
                                      //console.log("OverlayScrollbarsComponent > onUpdated:");
                                      var osComEle = document.getElementById("categoryOverlayScrollbar");
                                      if (osComEle !== null) {
                                        if (osComEle.classList.contains("os-host-scrollbar-horizontal-hidden")) {
                                          var arrowsEle = document.getElementsByClassName("osCustomArrows");
                                          for (var i = 0; i < arrowsEle.length; i++) {
                                            arrowsEle[i].classList.add("d-none");
                                          }
                                        } else {
                                          var arrowsEle = document.getElementsByClassName("osCustomArrows");
                                          for (var i = 0; i < arrowsEle.length; i++) {
                                            arrowsEle[i].classList.remove("d-none");
                                          }
                                        }
                                      }
                                    },
                                    onOverflowChanged: function (eventArgs) {
                                      //console.log("OverlayScrollbarsComponent > onOverflowChanged > eventArgs:");
                                      //console.log(eventArgs);
                                      if (eventArgs.xScrollable === true) {
                                        var arrowsEle = document.getElementsByClassName("osCustomArrows");
                                        for (var i = 0; i < arrowsEle.length; i++) {
                                          arrowsEle[i].classList.remove("d-none");
                                        }
                                      } else {
                                        var arrowsEle = document.getElementsByClassName("osCustomArrows");
                                        for (var i = 0; i < arrowsEle.length; i++) {
                                          arrowsEle[i].classList.add("d-none");
                                        }
                                      }
                                    },
                                  },
                                }}
                                className="mcsbWrapper"
                                id="categoryOverlayScrollbar"
                              >
                                {this.props.parentState.fnbMenuItems.length > 0 ? <ul>{this.props.populateMenuItemTabs()}</ul> : <Skeleton duration={1} style={{height: 40, borderRadius: 6}} />}
                              </OverlayScrollbarsComponent>
                              {this.props.parentState.fnbMenuItems.length > 0 ? (
                                <a href="javascript:;" className="osCustomArrows osCustomArrowRight" onClick={() => this.handleCustomArrowClick("scrollRight", this.osComponentCategoryList)}>
                                  {/* <FontAwesomeIcon icon={faAngleRight} onClick={() => this.handleCustomArrowClick("scrollRight")} className="scrollCaret" style={{paddingLeft: 8}} /> */}
                                  <FontAwesomeIcon icon={faAngleRight} className="scrollCaret" />
                                </a>
                              ) : (
                                ""
                              )}
                              {/* <a href="javascript:;" className="osCustomArrows osCustomArrowRight" onClick={() => this.handleCustomArrowClick("scrollRight")}>
                                Scroll Right
                              </a> */}
                            </aside>
                          </aside>
                        </section>
                      </section>
                      {/* E.O.Category List */}
                      <section className="pcpbiCols pcpbiColleft">
                        <section className="pcpbiclInner">
                          <section className="pcpfnbCategorylist">
                            {this.props.parentState.fnbMenuItems.length > 0 ? <ul id="categoryList">{this.props.populateMenuItemTabContent()}</ul> : this.populateCategorySkeletons()}
                          </section>
                        </section>
                      </section>
                      {/* E.O.Category Accordion List */}
                      <aside className="pcpbiCols pcpbiColright">
                        <ColumnRight
                          continueCTA={"/orderreview"}
                          handleRightColumnMobileToggle={this.props.handleRightColumnMobileToggle}
                          parentState={this.props.parentState}
                          handleInCartFnbItemQuantity={this.props.handleInCartFnbItemQuantity}
                          handleFindMyBookingSubmit={this.props.handleFindMyBookingSubmit}
                          populateItemModifierItems={this.props.populateItemModifierItems}
                          populateItemSmartModifierItems={this.props.populateItemSmartModifierItems}
                          calculateItemRowTotal={this.props.calculateItemRowTotal}
                          calculateCartSubtotal={this.props.calculateCartSubtotal}
                          calculateCartTax={this.props.calculateCartTax}
                          calculateCartGrandTotal={this.props.calculateCartGrandTotal}
                          deleteItemFromCart={this.props.deleteItemFromCart}
                          disableItemDelete={false}
                          calculateRedemeedGiftcardTotal={this.props.calculateRedemeedGiftcardTotal}
                        />
                      </aside>
                    </section>

                    <section className="pcpbBottomstrap">
                      <section className="pcpbbsInner clearfix">
                        <aside className="pcpbsTrigger" onClick={() => this.props.handleRightColumnMobileToggle()}>
                          <h2>
                            <span>View Cart</span>
                            <strong>{`${this.props.parentState.cartData.length > 0 ? this.props.calculateCartGrandTotal(this.props.parentState.cartData) : "$0.00"}`}</strong>
                          </h2>
                        </aside>
                        <aside className="btnswrap">
                          {/* <a
                              href="fnb-item-incart.html"
                              className="btn btntext"
                              title="Continue"
                            >
                              Continue
                            </a> */}
                          <NavLink to="/orderreview" className={`${this.props.parentState.cartData.length > 0 ? "btn btntext" : "btn btntext disabled"}`} title="Checkout">
                            Checkout
                          </NavLink>
                        </aside>
                      </section>
                    </section>
                  </section>
                </section>
                {/* E.O.Category tab & content list */}
              </section>
              {/* E.O.Panel Body */}
            </>
          </section>
          {/* E.O.Food & Beverages Block */}
        </section>
      </section>
    );
  }
}

export default Menu;
