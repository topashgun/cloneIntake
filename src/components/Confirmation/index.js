import React from "react";
import * as API from "../../configuration/apiconfig";
import constant from "../../configuration/config";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleCheck, faCircleXmark, faLocationDot, faMapLocationDot, faMapMarker} from "@fortawesome/free-solid-svg-icons";
import Skeleton from "react-loading-skeleton";
import FnbPickUp from "../../assets/images/ic-fnbPickup.svg";
import FnbDeliveryInSeat from "../../assets/images/ic-fnbDeliveryinseat.svg";
import {useNavigate} from "react-router-dom";
import {NavLink} from "react-router-dom";
var numberOfSkeletonsBeforeLoad = 3;
class Confirmation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orderDetails: {},
      tips: false,
      tax: false,
      subTotal: false,
      savings: 0,
      populatePickUpAtCounter: false,
      populateInSeatDelivery: false,
      paymentMethod: [],
      orderCollectedStatus: {},
      alcoholOnlyItems: true,
    };
  }

  componentDidMount = () => {
    this.props.handleBrowserBackButton();
    document.body.className += " confirmationPage";
    this.getOrderDetails();
    //Payment Flow > To add/remove layout class "paymentContent" with class "pageWrapper"
    if (this.props.pwPaymentflow === false) {
      this.props.handlePaymentFlow(true);
    }
    //Payment Flow > Header > Home Icon
    if (this.props.showHomeIcon === false) {
      this.props.handleShowHomeIcon(true);
    }

    window.onpopstate = (e) => {
      e.preventDefault();
      this.props.handleLoader(true);
      if (localStorage.getItem("bookingURL") !== null) {
        this.props.navigate(localStorage.getItem("bookingURL"));
        window.location.reload();
      } else {
        this.props.navigate("/");
      }
      window.location.reload();
    };
  };

  componentWillUnmount = () => {
    document.body.className = document.body.className.replace("confirmationPage", "");
  };

  populatePaymentMethod = (status) => {
    let orderDetails = status !== "failure" ? this.state.orderDetails.bookings_paymenttypes : this.state.orderDetails.orders_paymenttypes;
    let paymentMethod = orderDetails
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
    this.setState({paymentMethod});
  };

  getOrderDetails = () => {
    const params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop) => searchParams.get(prop),
    });
    this.setState(
      {
        orderId: params.id,
        orderStatus: params.status,
      },
      () => {
        //console.log("<=== getOrderDetails ===>");
        var endPointUrl = params.status == "failure" ? `order/v1/orders?id=${params.id}` : "order/v1/bookings?id=" + params.id + "";
        API.callEndpoint("GET", "Bearer", endPointUrl, "")
          .then((response) => {
            //console.log("endPointUrl: " + endPointUrl);
            //console.log("endPointUrl: " + endPointUrl);
            this.props.handleLoader(false);
            this.setState(
              {
                orderDetails: response.data[0],
              },
              () => {
                this.populatePaymentMethod(params.status);
                this.populateTips();
                this.populateTax();
                this.populateSubTotal();
                this.populateSavings();
                this.state.orderDetails.order_grouping.map((fnbItem) => {
                  if (fnbItem.additionalInfo.inSeatDelivery) {
                    this.setState({
                      populateInSeatDelivery: true,
                    });
                  }
                  if (fnbItem.additionalInfo.pickupAtCounter) {
                    this.setState({
                      populatePickUpAtCounter: true,
                    });
                  }
                });
                //S-1-T131: Confirmation screen - Start order button for order booked 30mins before showtime.
                //params.status == "failure" ? `order/v1/orders?id=${params.id}` : "order/v1/bookings?id=" + params.id + ""
                if (params.status == "success" && this.state.orderId) {
                  this.orderStartEarly(this.state.orderId);
                }
              }
            );
          })
          .catch((error) => {
            this.props.handleLoader(false);
            ////////console.log("Confirmation > getOrderDetails() > error:");
            ////////console.log(error);
          });
      }
    );
  };

  populateSubTotal = (deliveryType) => {
    var subTotal = 0;
    this.state.orderDetails.order_grouping.map((fnbitem) => {
      subTotal += this.populateItemPrice(fnbitem);
    });
    this.setState({
      subTotal: subTotal.toFixed(2),
    });
  };

  populateTips = () => {
    this.state.orderDetails.order_grouping.map((orderItem) => {
      if (orderItem.additionalInfo.istipitem) {
        this.setState({
          tips: orderItem.price,
        });
      }
    });
  };

  populateTax = () => {
    var tax = 0;

    this.state.orderDetails.order_grouping.map((fnbitem) => {
      tax += fnbitem.taxValue;
      tax += this.populateModifersTax(fnbitem.additionalInfo.modifiers);
    });

    if (tax != 0) {
      this.setState({
        tax: tax.toFixed(2),
      });
    }
  };

  populateSkeletons = () => {
    var skeletons = [];
    for (var i = 0; i < numberOfSkeletonsBeforeLoad; i++) {
      skeletons.push(
        <div style={{display: "flex", marginBottom: 10}}>
          <div style={{width: "60%"}}>
            <Skeleton duration={0.75} height={20} />
          </div>
          <div style={{width: "20%", paddingLeft: 10}}>
            <Skeleton duration={0.75} height={20} />
          </div>
          <div style={{width: "20%", paddingLeft: 10}}>
            <Skeleton duration={0.75} height={20} />
          </div>
        </div>
      );
    }
    return skeletons;
  };

  formatTime = (time) => {
    var timeArray = time.split("T")[1].split(":");
    var hours = timeArray[0] > 12 ? timeArray[0] - 12 : timeArray[0];
    var minutes = timeArray[1];
    var meridian = timeArray[0] >= 12 ? "PM" : "AM";
    return hours + ":" + minutes + " " + meridian;
  };

  formatDate = (date) => {
    var dateArray = date.split("T")[0].split("-");
    return dateArray[1] + "/" + dateArray[2];
  };

  populateQtyForOrderSummary = (id) => {
    //console.log("id - >" + id);
    let orderGrouping = this.state.orderDetails.order_grouping;
    var index = orderGrouping.findIndex((x) => x.code == id);
    if (index != -1) {
      return Number(orderGrouping[index].quantity);
    } else {
      return 1;
    }
  };

  populateModifiers = (modifiers) => {
    var modifierText = "";
    modifiers.map((modifier, index) => {
      modifierText += modifier.description;
      if (modifier.quantity > 1) {
        modifierText += "(" + modifier.quantity + ")";
      }
      if (index + 1 != modifiers.length) {
        modifierText += ", ";
      }
    });

    return modifierText.length == 0 ? "" : "With " + modifierText;
  };

  populateSmartModifiers = (smartModifiers, attribute) => {
    var uniqueArray = smartModifiers.filter(function (el) {
      return el.action == attribute;
    });

    var modifierText = "";
    uniqueArray.map((smartModifier, index) => {
      modifierText += smartModifier.description;
      if (smartModifier.quantity > 1) {
        modifierText += "(" + smartModifier.quantity + ")";
      }
      if (index + 1 != uniqueArray.length) {
        modifierText += ", ";
      }
    });
    return modifierText;
  };

  populateModifersCost = (modifiers) => {
    var modifierCost = 0;
    modifiers.map((modifier, index) => {
      modifierCost += 1 * Number(modifier.pricebeforetax);
    });
    return modifierCost;
  };

  populateModifersTax = (modifiers) => {
    var modifierCost = 0;
    modifiers.map((modifier, index) => {
      modifierCost += 1 * Number(modifier.taxValue);
    });
    return modifierCost;
  };

  populateItemPrice = (fnbitem) => {
    return 1 * Number(fnbitem.pricebeforetax).toFixed(2) + Number(this.populateModifersCost(fnbitem.additionalInfo.modifiers).toFixed(2));
  };

  populateLi = (fnbitem) => {
    return (
      <li className="clearfix">
        <h5 className="pcpbscrulCollft">
          {fnbitem.description}
          <span className="smartModifierText">{this.populateModifiers(fnbitem.additionalInfo.modifiers)}</span>
          {fnbitem.additionalInfo.smartModifiers.length != 0 ? (
            <>
              {this.populateSmartModifiers(fnbitem.additionalInfo.smartModifiers, "side").length == 0 ? (
                ""
              ) : (
                <span className="smartModifierText">
                  <span className="smartModifierHeading">Added as a side :</span> {this.populateSmartModifiers(fnbitem.additionalInfo.smartModifiers, "side")}
                </span>
              )}

              {this.populateSmartModifiers(fnbitem.additionalInfo.smartModifiers, "remove").length == 0 ? (
                ""
              ) : (
                <span className="smartModifierText">
                  <span className="smartModifierHeading">Removed :</span> {this.populateSmartModifiers(fnbitem.additionalInfo.smartModifiers, "remove")}
                </span>
              )}
            </>
          ) : (
            ""
          )}
        </h5>
        <section className="pcpbscrulColrgt">
          <aside className="itemCounter">
            <input type="text" value={fnbitem.quantity} className="form-control" readonly />
          </aside>
          <p className="pcpPrice">${this.populateItemPrice(fnbitem).toFixed(2)}</p>
        </section>
      </li>
    );
  };

  // populateSavings = () => {
  //   var vbtTotal = 0;
  //   var svbtTotal = 0;
  //   this.state.orderDetails.fnb.map((item) => {
  //     var index = this.state.orderDetails.orderinfo.fnb.findIndex((x) => x.id === item.id);
  //     console.log("populateSavings() > index: " + index);
  //     if (index != -1) {
  //       var itemQuantity = this.state.orderDetails.orderinfo.fnb[index].quantity;
  //       vbtTotal = vbtTotal + item.amount * itemQuantity;
  //       svbtTotal = svbtTotal + item.strikeprice * itemQuantity;
  //       ////console.log((vbtTotal - svbtTotal).toFixed(2));
  //       //var modifierIndex = this.state.orderDetails.order_grouping.findIndex((x) => x.id === item.code);
  //       var modifierIndex = this.state.orderDetails.order_grouping.findIndex((x) => x.code === item.id);
  //       if (modifierIndex != -1) {
  //         var modifiers = this.state.orderDetails.order_grouping[modifierIndex].additionalInfo.modifiers;
  //         modifiers.map((modifier) => {
  //           vbtTotal = vbtTotal + modifier.amount;
  //           svbtTotal = svbtTotal + modifier.strikeprice;
  //         });
  //       }
  //       ////console.log((vbtTotal - svbtTotal).toFixed(2));
  //     }
  //   });

  //   var cartSavings = (vbtTotal - svbtTotal).toFixed(2);
  //   ////console.log("cartSavings ---------------------->>>>>>>>>>>>>>> " + cartSavings);
  //   this.setState({
  //     savings: cartSavings,
  //   });
  // };

  populateSavings = () => {
    var vbtTotal = 0;
    var svbtTotal = 0;
    var alcoholOnlyItems = true;
    //console.log("populateSavings() > vbtTotal: " + vbtTotal);
    //console.log("populateSaving1() > svbtTotal: " + svbtTotal);
    this.state.orderDetails.order_grouping.map((item, index) => {
      var itemQuantity = this.state.orderDetails.orderinfo.fnb[index].quantity;
      var fnbItemIndex = this.state.orderDetails.fnb.findIndex((x) => x.id === item.code);
      //console.log("populateSavings() > item > itemQuantity: " + itemQuantity);
      //console.log("populateSavings() > item > fnbItemIndex: " + fnbItemIndex);
      if (fnbItemIndex !== -1) {
        var fnbItemData = this.state.orderDetails.fnb[fnbItemIndex];
        if (fnbItemData.strikeprice != null) {
          vbtTotal = vbtTotal + fnbItemData.amount * itemQuantity;
          svbtTotal = svbtTotal + fnbItemData.strikeprice * itemQuantity;
          alcoholOnlyItems = false;
        }
        //console.log("populateSavings() > item > vbtTotal: " + vbtTotal);
        //console.log("populateSavings() > item > svbtTotal: " + svbtTotal);
        if (item.additionalInfo.modifiers.length > 0) {
          item.additionalInfo.modifiers.map((itemModifier) => {
            var modifierQuantity = itemModifier.quantity;
            var modifierItemIndex = this.state.orderDetails.fnb.findIndex((x) => x.modifierid === itemModifier.modifierid);
            //console.log("populateSavings() > modifier > modifierQuantity: " + modifierQuantity);
            //console.log("populateSavings() > modifier > modifierItemIndex: " + modifierItemIndex);
            if (modifierItemIndex !== -1) {
              var modifierItem = this.state.orderDetails.fnb[modifierItemIndex];
              vbtTotal = vbtTotal + modifierItem.amount;
              svbtTotal = svbtTotal + (modifierItem.strikeprice > 0 && modifierItem.strikeprice != null ? modifierItem.strikeprice : 0);
              //console.log("populateSavings() > modifier > vbtTotal: " + vbtTotal);
              //console.log("populateSavings() > modifier > svbtTotal: " + svbtTotal);
            }
          });
        }
      }
    });

    var cartSavings = (vbtTotal - svbtTotal).toFixed(2);

    this.setState({
      savings: cartSavings,
      alcoholOnlyItems: alcoholOnlyItems,
    });
  };

  formatPhoneNumber = (phonenumber) => {
    phonenumber = phonenumber.replace(/[^0-9]/g, "");
    const phoneNumberArray = phonenumber.split("");
    return "(" + phoneNumberArray.splice(0, 3).join("") + ")" + " " + phoneNumberArray.splice(0, 3).join("") + "-" + phoneNumberArray.splice(0, 4).join("");
  };

  returnSavingsTypeAmount = (type) => {
    var savings = this.state.orderDetails.savings;
    return Number(savings[savings.findIndex((x) => x.type === type)].amount).toFixed(2);
  };

  pickUpLocationPopulate = () => {
    var pickUpLocation = <span>Counter</span>;
    this.state.orderDetails.order_grouping.map((item) => {
      if (item.additionalInfo.pickupAtCounter) {
        if (item.additionalInfo.pickUpLocation.length != 0) {
          pickUpLocation = <span className="themeColor">{item.additionalInfo.pickUpLocation}</span>;
        } else {
          pickUpLocation = <span>Counter</span>;
        }
      }
    });
    return pickUpLocation;
  };

  populatePaymentType = (item) => {
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

  populateSavingsText = () => {
    var savingsText = "";
    if (this.state.orderDetails.savings.length != 0) {
      if (this.state.orderDetails.savings.length == 1) {
        savingsText =
          this.state.orderDetails.savings[0].type == "deals" ? (
            <p>
              With Today's Special, you saved <span className="priceColor">${this.returnSavingsTypeAmount("deals")}</span> on today's order!
            </p>
          ) : (
            <p>
              As an ExtrasPlus Member, you saved <span className="priceColor">${this.returnSavingsTypeAmount("explus")}</span> on today's order!
            </p>
          );
      } else {
        if (this.state.orderDetails.savings[0].amount == 0 && this.state.orderDetails.savings[1].amount == 0 && !this.state.alcoholOnlyItems) {
          savingsText = (
            <>
              <p>
                As an ExtrasPlus Member, You could have saved <span className="priceColor">${this.state.savings}</span> on today's order!{" "}
              </p>
              <p className="mt-0">
                <a href="https://www.showplaceicon.com/Ticketing/_ICON/extraspluslanding.aspx" target="_blank" className="themeColor text-decoration-underline">
                  Sign Up
                </a>{" "}
                as Extra plus member.
              </p>
            </>
          );
        } else {
          if (this.state.orderDetails.savings[0].amount != 0 && this.state.orderDetails.savings[1].amount != 0) {
            savingsText = (
              <p>
                {" "}
                With Today's Special, you saved <span className="priceColor">${this.returnSavingsTypeAmount("deals")}</span> and as an ExtrasPlus Member, you saved{" "}
                <span className="priceColor">${this.returnSavingsTypeAmount("explus")}</span> on today's order!
              </p>
            );
          } else {
            if (this.returnSavingsTypeAmount("deals") != 0.0) {
              savingsText = (
                <p>
                  With Today's Special, you saved <span className="priceColor">${this.returnSavingsTypeAmount("deals")}</span> on today's order!
                </p>
              );
            } else if (this.returnSavingsTypeAmount("explus") != 0.0) {
              savingsText = (
                <p>
                  {" "}
                  As an ExtrasPlus Member, you saved <span className="priceColor">${this.returnSavingsTypeAmount("explus")}</span> on today's order!
                </p>
              );
            }
          }
        }
      }
    }
    return savingsText;
  };

  populateDeliveryTime = () => {
    if (this.state.orderDetails.additionalinfo.deliverytime.length != 0) {
      // if (this.state.orderDetails.additionalinfo.deliverytime[0].description.toLowerCase() == "showtime") {
      //   return "Your food order will be delivered at the movie showtime";
      // } else if (
      //   this.state.orderDetails.additionalinfo.deliverytime[0].description.toLowerCase() == "15" ||
      //   this.state.orderDetails.additionalinfo.deliverytime[0].description.toLowerCase() == "15mins Before Showtime"
      // ) {
      //   return "Your food order will be delivered 15 minutes before showtime";
      // } else {
      //   return "Please give us 15 minutes to deliver your food order";
      // }
      return this.state.orderDetails.additionalinfo.deliverytime[0].additionalinfo.deliveryText;
    }
  };

  populateMultipleLocationsPickUp = () => {
    var pickUpLocationsArray = [];
    this.state.orderDetails.order_grouping.map((fnbitem) => {
      if (fnbitem.additionalInfo.pickupAtCounter) {
        pickUpLocationsArray.push(fnbitem.additionalInfo.pickUpLocation);
      }
    });
    let uniquePickUpLocations = [...new Set(pickUpLocationsArray)];

    return uniquePickUpLocations.map((uniquePickUpLocation) => {
      return (
        <div className="eachPickUpLocationDiv">
          <h6 className="eachPickUpLocation">
            at the <span className="themeColor">{uniquePickUpLocation}</span>
          </h6>
          {this.state.orderDetails.order_grouping.map((fnbitem) => {
            if (fnbitem.additionalInfo.pickUpLocation == uniquePickUpLocation && fnbitem.additionalInfo.pickupAtCounter) {
              return <ul>{this.populateLi(fnbitem)}</ul>;
            }
          })}
        </div>
      );
    });
  };

  orderStartEarly = async (orderNumber) => {
    console.log("showStartOrder()");
    console.log("orderNumber: " + orderNumber);
    //orderCollectedStatus
    //Object.keys(this.state.fnbBookingCollectedStatus).length !== 0 && !this.state.fnbBookingCollectedStatus.data.collectedStatus
    await API.callEndpoint("POST", "Bearer", "order/v1/bookings/getbookingcollectedStatus", {bookingId: orderNumber})
      .then((response) => {
        this.setState(
          {
            orderCollectedStatus: response.data,
          },
          () => {
            console.log("this.state.orderCollectedStatus");
            console.log(this.state.orderCollectedStatus);
          }
        );
      })
      .catch((error) => {
        //console.log("Error: earlybirdStartOrder()");
        //console.log(error);
      });
  };

  render() {
    let {orderDetails} = this.state;
    return (
      <section className="pageContent">
        <section className="payment-headBody">
          <section className="">
            <aside className="pcplddHead">
              {Object.keys(this.state.orderDetails).length === 0 ? (
                <>
                  <Skeleton duration={0.75} circle={true} height={80} width={80} />
                  <Skeleton duration={0.75} width={`60%`} height={30} style={{marginTop: 15}} />
                </>
              ) : (
                <>
                  {this.state.orderStatus == "failure" ? (
                    <>
                      <FontAwesomeIcon icon={faCircleXmark} className="faCircle circleXmark"></FontAwesomeIcon>
                      <h2>Order failed</h2>
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faCircleCheck} className="faCircle circleCheck"></FontAwesomeIcon>
                      <h2>Order placed successfully</h2>
                    </>
                  )}
                </>
              )}
              {this.state.orderStatus == "failure" ? (
                ""
              ) : (
                <h5>
                  {Object.keys(this.state.orderDetails).length === 0 ? (
                    <Skeleton duration={0.75} width={`50%`} />
                  ) : (
                    <>
                      {this.state.orderDetails.bookingid !== null ? (
                        <React.Fragment>
                          <span>Order no.</span> {this.state.orderDetails.bookingid}
                        </React.Fragment>
                      ) : (
                        ""
                      )}
                    </>
                  )}
                </h5>
              )}

              <p className="orderUpdateInfo" style={{background: "#e4e4e4", padding: "20px 0", marginTop: this.state.orderStatus == "failure" ? 10 : 0}}>
                {Object.keys(this.state.orderDetails).length === 0 ? (
                  <Skeleton baseColor="white" highlightColor="#ebebeb" duration={0.75} width={`75%`} />
                ) : (
                  <>
                    Updates to this order will be sent to <b>{orderDetails.email}</b> and <b style={{whiteSpace: "nowrap"}}>{this.formatPhoneNumber(orderDetails.phonenumber)}</b>
                  </>
                )}
              </p>
              <p className="movieDetailsConfirmation" style={{marginTop: 10}}>
                {Object.keys(this.state.orderDetails).length === 0 ? (
                  <Skeleton duration={0.75} width={`50%`} />
                ) : (
                  <>
                    <span className="highlightColor">{orderDetails.film.films_attributes[0].title}</span> at <span className="highlightColor">{orderDetails.cinema.cinemas_attributes[0].name}</span>,
                  </>
                )}
              </p>
              <p className="movieDetailsConfirmation">
                {Object.keys(this.state.orderDetails).length === 0 ? (
                  <Skeleton duration={0.75} width={`50%`} />
                ) : (
                  <>
                    on <span className="highlightColor">{this.formatDate(orderDetails.showdate)}</span> at <span className="highlightColor">{this.formatTime(orderDetails.showtime)}</span>
                  </>
                )}
              </p>
              {Object.keys(this.state.orderDetails).length === 0 ? (
                <Skeleton duration={0.75} width={`50%`} />
              ) : Object.keys(this.state.orderCollectedStatus).length !== 0 && !this.state.orderCollectedStatus.data.collectedStatus ? (
                <>
                  <p className="orderStartEarly">You will be able to start the order 30mins before &amp; upto the Showtime</p>
                  <aside class="btnswrap">
                    <NavLink to={`${"/earlybird?bookingid=" + this.state.orderDetails.bookingid + ""}`} title="Click here to start your order" className="btn btndefault">
                      <span>Click here to start your order</span>
                    </NavLink>
                  </aside>
                </>
              ) : (
                ""
              )}
            </aside>
          </section>
        </section>
        <section className="price-detailBody">
          <section className="container">
            <section className="pcPrice-detailsblk">
              <section className="pricepdng-cont">
                <section className="pcpCart">
                  <section className="roundBoxshadowed">
                    <section className="pcpBookingsummary pcpconfirmation">
                      <aside className="pcpbsInner">
                        {/* <h3>Booking Summary</h3> */}
                        <section className="pcpbsContainer">
                          {/* <h2>{Object.keys(this.state.orderDetails).length === 0 ? <Skeleton duration={0.75} /> : "Food & Beverages"}</h2> */}
                          {Object.keys(this.state.orderDetails).length === 0 ? (
                            <>
                              <section className="pcpbscRows pcpbscrFNB fnbPickup">
                                <Skeleton duration={0.75} height={32} width={"75%"} style={{marginBottom: 25}} />
                                {this.populateSkeletons()}
                              </section>
                              <section className="pcpbscRows pcpbscrFNB fnbPickcup">
                                <Skeleton duration={0.75} height={32} width={"75%"} style={{marginBottom: 25}} />
                                {this.populateSkeletons()}
                              </section>
                            </>
                          ) : (
                            <>
                              {Object.keys(this.state.orderDetails).length > 0 && this.state.populatePickUpAtCounter ? (
                                <section className={`pcpbscRows pcpbscrFNB`}>
                                  <div className=" fnbPickup">
                                    <div className="orderHeadingDiv" style={{marginBottom: 0}}>
                                      <img src={FnbPickUp}></img>
                                      <h4>To be picked up</h4>
                                    </div>
                                    {this.populateMultipleLocationsPickUp()}
                                    {/* <ul>
                                      {this.state.orderDetails.order_grouping.map((fnbitem) => {
                                        {
                                          return fnbitem.additionalInfo.pickupAtCounter ? this.populateLi(fnbitem) : "";
                                        }
                                      })}
                                    </ul> */}
                                  </div>
                                </section>
                              ) : null}

                              {Object.keys(this.state.orderDetails).length > 0 && this.state.populateInSeatDelivery ? (
                                <section className={`pcpbscRows pcpbscrFNB`}>
                                  <div className="fnbDeliveryinseat">
                                    <div className="orderHeadingDiv" style={{marginBottom: 10}}>
                                      <img src={FnbDeliveryInSeat}></img>
                                      <h4>Delivered to your seat</h4>
                                    </div>
                                    <h6 className="deliveryText">
                                      <span class="themeColor">{this.populateDeliveryTime()}</span>
                                    </h6>
                                    <ul>
                                      {this.state.orderDetails.order_grouping.map((fnbitem) => {
                                        {
                                          return fnbitem.additionalInfo.inSeatDelivery ? this.populateLi(fnbitem) : "";
                                        }
                                      })}
                                    </ul>
                                  </div>
                                </section>
                              ) : null}
                            </>
                          )}

                          <section className="pcpbscRows pcpbscrFNT" style={{paddingTop: 0}}>
                            {Object.keys(this.state.orderDetails).length === 0 ? (
                              <div style={{paddingLeft: 35, paddingRight: 35}}>
                                <Skeleton height={32} duration={0.75} style={{marginBottom: 15, marginTop: 35}} />
                                <Skeleton height={32} duration={0.75} style={{marginBottom: 15}} />
                              </div>
                            ) : (
                              <ul>
                                <li className="fnbSubtotal clearfix pb-0">
                                  <h5 className="pcpbscrulCollft">Sub Total</h5>
                                  <section className="pcpbscrulColrgt">
                                    <p></p>
                                    <p className="pcpPrice">${Number(this.state.subTotal).toFixed(2)}</p>
                                  </section>
                                </li>
                                {this.state.tax != false ? (
                                  <li className="fnbSubtotal clearfix">
                                    <h5 className="pcpbscrulCollft">Tax</h5>
                                    <section className="pcpbscrulColrgt">
                                      <p className="pcpPrice">${Number(this.state.tax).toFixed(2)}</p>
                                    </section>
                                  </li>
                                ) : (
                                  <></>
                                )}

                                {this.state.tips != false ? (
                                  <li className="fnbSubtotal clearfix">
                                    <h5 className="pcpbscrulCollft">Tips</h5>
                                    <section className="pcpbscrulColrgt">
                                      <p className="pcpPrice">${this.state.tips}</p>
                                    </section>
                                  </li>
                                ) : (
                                  <></>
                                )}
                              </ul>
                            )}
                          </section>
                          <section className="pcpbsTotalstrap clearfix">
                            <h5>{Object.keys(this.state.orderDetails).length === 0 ? <Skeleton duration={0.75} height={32} /> : "Total"}</h5>
                            <p>
                              {Object.keys(this.state.orderDetails).length === 0 ? <Skeleton duration={0.75} height={32} /> : "$" + (Number(this.state.subTotal) + Number(this.state.tax)).toFixed(2)}
                            </p>
                          </section>
                          {Object.keys(this.state.orderDetails).length === 0 ? (
                            ""
                          ) : (
                            <section className="savingsSection">
                              {this.state.orderDetails.savings == null ? (
                                <>
                                  <p>
                                    As an ExtrasPlus Member, You could have saved <span className="priceColor">${this.state.savings}</span> on today's order!{" "}
                                  </p>
                                  <p className="mt-0">
                                    <a href="https://www.showplaceicon.com/Ticketing/_ICON/extraspluslanding.aspx" target="_blank" className="themeColor text-decoration-underline">
                                      Sign Up
                                    </a>{" "}
                                    as Extra plus member.
                                  </p>
                                </>
                              ) : this.state.orderDetails.savings.length == 0 ? (
                                <>
                                  <p>
                                    As an ExtrasPlus Member, You could have saved <span className="priceColor">${this.state.savings}</span> on today's order!{" "}
                                  </p>
                                  <p className="mt-0">
                                    <a href="https://www.showplaceicon.com/Ticketing/_ICON/extraspluslanding.aspx" target="_blank" className="themeColor text-decoration-underline">
                                      Sign Up
                                    </a>{" "}
                                    as Extra plus member.
                                  </p>
                                </>
                              ) : (
                                this.populateSavingsText()
                              )}
                            </section>
                          )}
                          <section className="confirmPay-container">
                            <div className="confirmpay-title-1">Payment Method</div>
                            <section className="pcpbscRows pcpbscrFNT" style={{paddingTop: 0}}>
                              {Object.keys(this.state.paymentMethod).length === 0 ? (
                                <div style={{paddingLeft: 35, paddingRight: 35}}>
                                  <Skeleton height={32} duration={0.75} style={{marginBottom: 15, marginTop: 35}} />
                                  <Skeleton height={32} duration={0.75} style={{marginBottom: 15}} />
                                </div>
                              ) : (
                                <ul>
                                  {this.state.paymentMethod.map((item, index) => {
                                    if (item.type === null) {
                                      return null;
                                    }
                                    return (
                                      <li className="fnbSubtotal clearfix pb-0" key={index}>
                                        <h5 id="confirmpay-title-2" className="pcpbscrulCollft">
                                          {this.populatePaymentType(item)}
                                          {/* {item.type} <span>ending {item.cardNumber.substr(item.cardNumber.length - 4)}</span> */}
                                        </h5>
                                        <section className="pcpbscrulColrgt">
                                          <p></p>
                                          <p id="confirmpay-title-2" className="pcpPrice">
                                            ${Number(item.amount).toFixed(2)}
                                          </p>
                                        </section>
                                        <div className="confirmpay-title-3">
                                          {item.type === constant.giftCardText ? (
                                            this.state.paymentMethod.length === 1 ? (
                                              <span className="">Balance after this transaction : ${item.balance.toFixed(2)}</span>
                                            ) : (
                                              <span className="">Balance after this transaction : ${item.balance.toFixed(2)}</span>
                                            )
                                          ) : (
                                            // item.cardNumber
                                            ""
                                          )}
                                        </div>
                                      </li>
                                    );
                                  })}
                                </ul>
                              )}
                            </section>
                          </section>
                        </section>
                      </aside>
                    </section>
                  </section>
                </section>
              </section>
            </section>
          </section>
        </section>
      </section>
    );
  }
}

export default function (props) {
  const navigation = useNavigate();
  return <Confirmation {...props} navigate={navigation} />;
}
