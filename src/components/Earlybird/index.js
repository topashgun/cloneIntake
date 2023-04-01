import React from "react";
import * as API from "../../configuration/apiconfig";
import Skeleton from "react-loading-skeleton";
import Swal from "sweetalert2";

import FnbPickUp from "../../assets/images/ic-fnbPickup.svg";
import FnbDeliveryInSeat from "../../assets/images/ic-fnbDeliveryinseat.svg";

var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var numberOfSkeletonsBeforeLoad = 3;

class Earlybird extends React.Component {
  constructor(props) {
    super(props);
    this.osComponentCategoryList = React.createRef();
    this.state = {
      paramBookingiId: "",
      fnbBookingInfo: {},
      fnbBookingId: "",
      summaryTax: false,
      summarySubTotal: false,
      startorderError: "",
      fnbPickUpAtCounter: false,
      fnbDeliveryToSeat: false,
      fnbBookingCollectedStatus: {},
    };
  }

  componentDidMount = () => {
    document.body.className += " earlybirdPage";

    window.addEventListener("load", this.props.handleFooterSticky);
    window.addEventListener("resize", this.props.handleFooterSticky);

    var self = this;

    const params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop) => searchParams.get(prop),
    });
    this.setState(
      {
        paramBookingiId: params.bookingid,
      },
      () => {
        if (this.state.paramBookingiId !== null && this.state.paramBookingiId != "") {
          this.getFnbBookingInfo(this.state.paramBookingiId);
        }
      }
    );

    //Payment Flow > To add/remove layout class "paymentContent" with class "pageWrapper"
    if (this.props.pwPaymentflow) {
      this.props.handlePaymentFlow(false);
    }

    //Payment Flow > Header > Home Icon
    if (this.props.showHomeIcon) {
      this.props.handleShowHomeIcon(false);
    }
  };

  componentWillUnmount() {
    document.body.className = document.body.className.replace("earlybirdPage", "");
    window.removeEventListener("load", this.props.handleFooterSticky);
    window.removeEventListener("resize", this.props.handleFooterSticky);
  }

  getFnbBookingInfo = (bookingID) => {
    this.props.handleLoader(true);
    //console.log("Earlybird > fnbBookingInfo()");
    //console.log("bookingID: " + bookingID);
    //https://apidevshowplaceicon.influx.co.in/order/v1/bookings?bookingid=&email=
    API.callEndpoint("GET", "Bearer", "/order/v1/bookings?bookingid=" + bookingID + "", "")
      .then((response) => {
        //console.log(response.data);
        this.setState(
          {
            fnbBookingInfo: response.data.length != 0 ? response.data[0] : {},
            fnbBookingId: response.data.length != 0 ? response.data[0].id : "",
          },
          () => {
            //console.log("this.state.fnbBookingInfo:");
            //console.log(this.state.fnbBookingInfo);
            if (Object.keys(this.state.fnbBookingInfo).length !== 0 && this.state.fnbBookingId != "") {
              var self = this;
              setTimeout(() => {
                //Updating Logo based on location.
                var cinemaID = self.state.fnbBookingInfo.cinema.cinemaid;
                if (cinemaID && cinemaID !== null) {
                  var locationIndex = self.props.parentState.locations.findIndex((x) => x.cinemaid == cinemaID);
                  if (locationIndex != -1) {
                    self.props.selectBookingLocation(self.props.parentState.locations[locationIndex]);
                  }
                }
                self.bookingGetCollectedStatus();
                self.calculateTax();
                self.calculateSubTotal();
                self.state.fnbBookingInfo.order_grouping.map((fnbItem) => {
                  if (fnbItem.additionalInfo.inSeatDelivery) {
                    self.setState({
                      fnbDeliveryToSeat: true,
                    });
                  }
                  if (fnbItem.additionalInfo.pickupAtCounter) {
                    self.setState({
                      fnbPickUpAtCounter: true,
                    });
                  }
                });
              }, 1000);
            } else {
              this.props.handleLoader(false);
              Swal.fire({
                title: "Nope",
                icon: "error",
                text: "Invalid Booking ID.",
                width: 600,
                heightAuto: true,
                padding: "30",
                confirmButtonText: "Proceed to order",
                confirmButtonColor: "#B32E34",
              }).then((result) => {
                window.location.href = window.location.origin;
              });
            }
          }
        );
      })
      .catch((error) => {
        //console.log("Error: getFnbBookingInfo()");
        //console.log(error);
      });
  };

  bookingGetCollectedStatus = async () => {
    this.props.handleLoader(true);
    //console.log("bookingGetCollectedStatus()");
    var fnbBookingID = this.state.fnbBookingId;
    //https://apidevshowplaceicon.influx.co.in/order/v1/bookings/getbookingcollectedStatus
    await API.callEndpoint("POST", "Bearer", "order/v1/bookings/getbookingcollectedStatus", {bookingId: fnbBookingID})
      .then((response) => {
        //console.log("Success: bookingGetCollectedStatus()");
        //console.log(response.data);
        this.setState(
          {
            fnbBookingCollectedStatus: response.data,
          },
          () => {
            this.props.handleLoader(false);
            //console.log("this.state.fnbBookingCollectedStatus");
            //console.log(this.state.fnbBookingCollectedStatus);
          }
        );
      })
      .catch((error) => {
        this.props.handleLoader(false);
        //console.log("Error: bookingGetCollectedStatus()");
        //console.log(error);
      });
  };

  populateDate = (showDate) => {
    var actualShowDate = showDate.split("T")[0].split("-");
    var date = actualShowDate[2];
    var month = months[actualShowDate[1] - 1];
    var year = actualShowDate[0];
    return date + " " + month + " " + year;
  };

  populateTime = (showTime) => {
    var actualShowTime = showTime.split("T")[1].split(":");
    var hours = actualShowTime[0];
    hours = hours > 12 ? hours - 12 : hours;
    hours = ("0" + hours).slice(-2);

    var minutes = actualShowTime[1];
    minutes = ("0" + minutes).slice(-2);

    var meridian = actualShowTime[0] >= 12 ? "PM" : "AM";
    return hours + ":" + minutes + " " + meridian;
  };

  formatTime = (time) => {
    var timeArray = time.split("T")[1].split(":");
    var hours = timeArray[0] > 12 ? timeArray[0] - 12 : timeArray[0];
    var minutes = timeArray[1];
    var meridian = timeArray[0] >= 12 ? "PM" : "AM";
    return hours + ":" + minutes + " " + meridian;
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

  populateModifiers = (modifiers) => {
    var modifierText = "";
    if (modifiers.length > 0) {
      modifiers.map((modifier, index) => {
        modifierText += modifier.description;
        if (modifier.quantity > 1) {
          modifierText += "(" + modifier.quantity + ")";
        }
        if (index + 1 != modifiers.length) {
          modifierText += ", ";
        }
      });
    }

    return modifierText.length == 0 ? "" : "With " + modifierText;
  };

  populateSmartModifiers = (smartModifiers, attribute) => {
    var uniqueArray = smartModifiers.filter(function (el) {
      return el.action == attribute;
    });

    var smartModifierText = "";
    uniqueArray.map((smartModifier, index) => {
      smartModifierText += smartModifier.description;
      if (smartModifier.quantity > 1) {
        smartModifierText += "(" + smartModifier.quantity + ")";
      }
      if (index + 1 != uniqueArray.length) {
        smartModifierText += ", ";
      }
    });
    return smartModifierText;
  };

  calculateSubTotal = () => {
    var subTotal = 0;
    this.state.fnbBookingInfo.order_grouping.map((fnbitem) => {
      subTotal += this.calculateItemPrice(fnbitem);
    });
    this.setState(
      {
        //subTotal: subTotal.toFixed(2),
        summarySubTotal: subTotal.toFixed(2),
      },
      () => {
        console.log("summarySubTotal: " + this.state.summarySubTotal);
      }
    );
  };

  calculateTax = () => {
    var tax = 0;

    this.state.fnbBookingInfo.order_grouping.map((fnbitem) => {
      tax += fnbitem.taxValue;
      tax += this.calculateModifersTax(fnbitem.additionalInfo.modifiers);
    });

    if (tax != 0) {
      this.setState({
        //tax: tax.toFixed(2),
        summaryTax: tax.toFixed(2),
      });
    }
  };

  calculateItemPrice = (fnbitem) => {
    return 1 * Number(fnbitem.pricebeforetax).toFixed(2) + Number(this.calculateModifersCost(fnbitem.additionalInfo.modifiers).toFixed(2));
  };

  calculateModifersCost = (modifiers) => {
    var modifierCost = 0;
    modifiers.map((modifier, index) => {
      modifierCost += 1 * Number(modifier.pricebeforetax);
    });
    return modifierCost;
  };

  calculateModifersTax = (modifiers) => {
    var modifierCost = 0;
    modifiers.map((modifier, index) => {
      modifierCost += 1 * Number(modifier.taxValue);
    });
    return modifierCost;
  };

  earlybirdStartOrder = () => {
    this.props.handleLoader(true);
    var fnbBookingID = this.state.fnbBookingId;
    //https://apidevshowplaceicon.influx.co.in/order/v1/bookings/collectedStatus
    API.callEndpoint("POST", "Bearer", "order/v1/bookings/collectedStatus", {bookingId: fnbBookingID})
      .then((response) => {
        this.props.handleLoader(false);
        console.log("Success: earlybirdStartOrder()");
        //console.log(response);
        console.log(response.data);
        this.bookingGetCollectedStatus();
        Swal.fire("Order placed successfully", response.data.message, "success").then((result) => {
          window.location.href = window.location.origin;
        });
      })
      .catch((error) => {
        //console.log("Error: earlybirdStartOrder()");
        //console.log(error);
        this.setState(
          {
            startorderError: error.error,
          },
          () => {
            this.props.handleLoader(false);
          }
        );
      });
  };

  render() {
    return (
      <section className="pageContent">
        <section className="pcPanel">
          {/* Confirm Booking Block */}
          <section id="pcConfirmBooking">
            <section className="pcpBody">
              <section className="container">
                <section className="pcpbInner">
                  <section className="pcpbiColswrap clearfix pcpFnbblock">
                    <section className="pcpbiCols pcpbiColfull">
                      <section className="pcpfnbConfirmbooking">
                        <section className="roundBoxshadowed">
                          <section className="pcpfnbcbInner">
                            <h1 className="welcomeText">
                              {Object.keys(this.state.fnbBookingInfo).length === 0 ? (
                                <Skeleton style={{width: "50%"}} />
                              ) : this.state.fnbBookingInfo.fullname && this.state.fnbBookingInfo.fullname != "" ? (
                                `Welcome, ${this.props.populateFullnameByType("Firstname", this.state.fnbBookingInfo.fullname)}`
                              ) : (
                                `Welcome`
                              )}
                            </h1>

                            <h1>{Object.keys(this.state.fnbBookingInfo).length === 0 ? <Skeleton /> : `So you want to get your food started early?`}</h1>
                            <h2>
                              {Object.keys(this.state.fnbBookingInfo).length === 0 ? (
                                <Skeleton style={{width: "75%"}} />
                              ) : this.state.fnbBookingInfo.film.films_attributes && this.state.fnbBookingInfo.film.films_attributes.length > 0 ? (
                                this.state.fnbBookingInfo.film.films_attributes[0].title
                              ) : (
                                ""
                              )}
                            </h2>
                            {Object.keys(this.state.fnbBookingInfo).length === 0 ? (
                              <Skeleton style={{width: "75%"}} />
                            ) : (
                              <p className="pcpfnbcbiLocation">
                                <span>{Object.keys(this.state.fnbBookingInfo).length === 0 ? "" : this.state.fnbBookingInfo.cinema.cinemas_attributes[0].name}</span>
                              </p>
                            )}

                            {Object.keys(this.state.fnbBookingInfo).length === 0 ? (
                              <>
                                <Skeleton duration={0.75} style={{width: "75%"}} />
                              </>
                            ) : (
                              <p>
                                <span>{Object.keys(this.state.fnbBookingInfo).length === 0 ? "" : this.populateDate(this.state.fnbBookingInfo.showdate)}</span>
                                <span>{Object.keys(this.state.fnbBookingInfo).length === 0 ? "" : this.populateTime(this.state.fnbBookingInfo.showtime)}</span>
                                <span>
                                  {Object.keys(this.state.fnbBookingInfo).length === 0
                                    ? ""
                                    : this.state.fnbBookingInfo.orders_items && this.state.fnbBookingInfo.orders_items.length > 0
                                    ? this.populateNumberOfSeats(this.state.fnbBookingInfo.orders_items)
                                    : this.state.paramSeatrow != null && this.state.paramSeatnumber != null
                                    ? "Seat " + this.state.paramSeatrow + this.state.paramSeatnumber
                                    : ""}
                                </span>
                              </p>
                            )}
                            {/* <h3>{Object.keys(this.state.fnbBookingInfo).length === 0 ? <Skeleton /> : "Is this the visit you're trying to order food for?"}</h3> */}

                            <section className="earlybirdOrderSummary">
                              <section className="orderBreakupWrap">
                                {Object.keys(this.state.fnbBookingInfo).length == 0 ? (
                                  <>
                                    <Skeleton duration={0.75} height={32} width={"30%"} style={{marginBottom: 25}} />
                                    {this.populateSkeletons()}
                                    <ul style={{marginTop: 25}}>
                                      <li style={{display: "flex", marginBottom: 10}}>
                                        <div style={{width: "60%"}}>
                                          <Skeleton duration={0.75} height={20} />
                                        </div>
                                        <div style={{width: "40%", paddingLeft: 50}}>
                                          <Skeleton duration={0.75} height={20} />
                                        </div>
                                      </li>
                                      <li style={{display: "flex"}}>
                                        <div style={{width: "60%"}}>
                                          <Skeleton duration={0.75} height={20} />
                                        </div>
                                        <div style={{width: "40%", paddingLeft: 50}}>
                                          <Skeleton duration={0.75} height={20} />
                                        </div>
                                      </li>
                                      <li style={{display: "flex", marginTop: 20}}>
                                        <div style={{width: "60%"}}>
                                          <Skeleton duration={0.75} height={20} />
                                        </div>
                                        <div style={{width: "40%", paddingLeft: 50}}>
                                          <Skeleton duration={0.75} height={20} />
                                        </div>
                                      </li>
                                    </ul>
                                  </>
                                ) : (
                                  <>
                                    <section className="fnbBreakup">
                                      <h3>
                                        <span>Order Summary</span>
                                      </h3>
                                      {/* fnbPickUpAtCounter: false,
                                      fnbDeliveryToSeat: false, */}
                                      {Object.keys(this.state.fnbBookingInfo).length !== 0 && this.state.fnbPickUpAtCounter ? (
                                        <section className="fnbBreakupWrap pickupItems">
                                          <aside className="fnbBreakupHead">
                                            <img src={FnbPickUp}></img>
                                            <h4>To be picked up</h4>
                                          </aside>
                                          <ul className="fnbBreakupBody">
                                            {this.state.fnbBookingInfo.order_grouping.map((fnbItem, index) => {
                                              return fnbItem.additionalInfo.pickupAtCounter ? (
                                                <li key={`orderItem_${index + "_" + fnbItem.id}`}>
                                                  <h4 className="fnbItemTitle">
                                                    {fnbItem.description}
                                                    {fnbItem.additionalInfo.modifiers.length > 0 ? <span>{this.populateModifiers(fnbItem.additionalInfo.modifiers)}</span> : ""}
                                                    {/* {fnbItem.additionalInfo.smartModifiers.length > 0 ? <span>{this.populateSmartModifiers(fnbItem.additionalInfo.smartModifiers)}</span> : ""} */}
                                                    {fnbItem.additionalInfo.smartModifiers.length != 0 ? (
                                                      <>
                                                        {this.populateSmartModifiers(fnbItem.additionalInfo.smartModifiers, "side").length == 0 ? (
                                                          ""
                                                        ) : (
                                                          <span className="smartModifierText">
                                                            <span className="smartModifierHeading">Added as a side :</span> {this.populateSmartModifiers(fnbItem.additionalInfo.smartModifiers, "side")}
                                                          </span>
                                                        )}

                                                        {this.populateSmartModifiers(fnbItem.additionalInfo.smartModifiers, "remove").length == 0 ? (
                                                          ""
                                                        ) : (
                                                          <span className="smartModifierText">
                                                            <span className="smartModifierHeading">Removed :</span> {this.populateSmartModifiers(fnbItem.additionalInfo.smartModifiers, "remove")}
                                                          </span>
                                                        )}
                                                      </>
                                                    ) : (
                                                      ""
                                                    )}
                                                  </h4>
                                                  <p className="fnbItemCount">{fnbItem.quantity}</p>
                                                  <p className="fnbItemPrice">${this.calculateItemPrice(fnbItem).toFixed(2)}</p>
                                                </li>
                                              ) : (
                                                ""
                                              );
                                            })}
                                          </ul>
                                        </section>
                                      ) : (
                                        ""
                                      )}

                                      {Object.keys(this.state.fnbBookingInfo).length !== 0 && this.state.fnbDeliveryToSeat ? (
                                        <section className="fnbBreakupWrap deliveryToSeatItems">
                                          <aside className="fnbBreakupHead">
                                            <img src={FnbDeliveryInSeat}></img>
                                            <h4>Delivered to your seat</h4>
                                          </aside>
                                          <ul className="fnbBreakupBody">
                                            {this.state.fnbBookingInfo.order_grouping.map((fnbItem, index) => {
                                              return fnbItem.additionalInfo.inSeatDelivery ? (
                                                <li key={`orderItem_${index + "_" + fnbItem.id}`}>
                                                  <h4 className="fnbItemTitle">
                                                    {fnbItem.description}
                                                    {fnbItem.additionalInfo.modifiers.length > 0 ? <span>{this.populateModifiers(fnbItem.additionalInfo.modifiers)}</span> : ""}
                                                    {/* {fnbItem.additionalInfo.smartModifiers.length > 0 ? <span>{this.populateSmartModifiers(fnbItem.additionalInfo.smartModifiers)}</span> : ""} */}
                                                    {fnbItem.additionalInfo.smartModifiers.length != 0 ? (
                                                      <>
                                                        {this.populateSmartModifiers(fnbItem.additionalInfo.smartModifiers, "side").length == 0 ? (
                                                          ""
                                                        ) : (
                                                          <span className="smartModifierText">
                                                            <span className="smartModifierHeading">Added as a side :</span> {this.populateSmartModifiers(fnbItem.additionalInfo.smartModifiers, "side")}
                                                          </span>
                                                        )}

                                                        {this.populateSmartModifiers(fnbItem.additionalInfo.smartModifiers, "remove").length == 0 ? (
                                                          ""
                                                        ) : (
                                                          <span className="smartModifierText">
                                                            <span className="smartModifierHeading">Removed :</span> {this.populateSmartModifiers(fnbItem.additionalInfo.smartModifiers, "remove")}
                                                          </span>
                                                        )}
                                                      </>
                                                    ) : (
                                                      ""
                                                    )}
                                                  </h4>
                                                  <p className="fnbItemCount">{fnbItem.quantity}</p>
                                                  <p className="fnbItemPrice">${this.calculateItemPrice(fnbItem).toFixed(2)}</p>
                                                </li>
                                              ) : (
                                                ""
                                              );
                                            })}
                                          </ul>
                                        </section>
                                      ) : (
                                        ""
                                      )}
                                    </section>
                                    <section className="taxTotalBreakups">
                                      <ul>
                                        <li className="fnbSubTotal">
                                          <h4>Sub Total</h4>
                                          <p>${this.state.summarySubTotal}</p>
                                        </li>
                                        {this.state.summaryTax != false ? (
                                          <li className="fnbTax">
                                            <h4>Tax</h4>
                                            <p>${this.state.summaryTax}</p>
                                          </li>
                                        ) : (
                                          ""
                                        )}

                                        <li className="fnbGrandTotal">
                                          <h4>Total</h4>
                                          <p>{"$" + (Number(this.state.summarySubTotal) + Number(this.state.summaryTax)).toFixed(2)}</p>
                                        </li>
                                      </ul>
                                    </section>
                                  </>
                                )}
                                {Object.keys(this.state.fnbBookingInfo).length === 0 ? (
                                  <div style={{marginTop: 25}}>
                                    <div
                                      style={{
                                        width: "30%",
                                        display: "inline-block",
                                      }}
                                    >
                                      <Skeleton duration={0.75} style={{height: 34}} />
                                    </div>
                                    <div
                                      style={{
                                        width: "30%",
                                        display: "inline-block",
                                        marginLeft: "5%",
                                      }}
                                    >
                                      <Skeleton duration={0.75} style={{height: 34}} />
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    <aside className="btnswrap">
                                      <a title="Close" className="btn btnsecondary" href="javascript:;" onClick={() => (window.location.href = window.location.origin)}>
                                        <span>Close</span>
                                      </a>
                                      {Object.keys(this.state.fnbBookingCollectedStatus).length !== 0 && !this.state.fnbBookingCollectedStatus.data.collectedStatus ? (
                                        <a title="Start Order" className="btn btndefault" href="javascript:;" onClick={() => this.earlybirdStartOrder()}>
                                          <span>Start Order</span>
                                        </a>
                                      ) : (
                                        ""
                                      )}
                                    </aside>
                                    {this.state.startorderError != "" ? <p className="mlfError bookingIdError">{this.state.startorderError}</p> : ""}
                                  </>
                                )}
                              </section>
                            </section>
                          </section>
                        </section>
                      </section>
                      {/* E.O.Confirm Booking */}
                    </section>
                  </section>
                </section>
              </section>
            </section>
          </section>
          {/* E.O.Confirm Booking Block */}
        </section>
      </section>
    );
  }
}

export default Earlybird;
