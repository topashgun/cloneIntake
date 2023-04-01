import React from "react";
import {NavLink} from "react-router-dom";
import {OverlayScrollbarsComponent} from "overlayscrollbars-react";
import FnbPickUp from "../../assets/images/ic-fnbPickup.svg";
import FnbDeliveryInSeat from "../../assets/images/ic-fnbDeliveryinseat.svg";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleCheck, faCircleXmark} from "@fortawesome/free-solid-svg-icons";
var itemInCartFlagCount = 0;

class ColumnRight extends React.Component {
  constructor(props) {
    super(props);
    this.osComponentRef0 = React.createRef();
  }

  populateItemspickupAtCounter = () => {
    var pickupAtCounterCount = 0;
    this.props.parentState.cartData.map((cdItems) => {
      if (cdItems.pickupAtCounter && cdItems.itemInCartFlag) {
        pickupAtCounterCount = pickupAtCounterCount + 1;
      }
    });
    return pickupAtCounterCount > 0 ? (
      <>
        <div className="orderHeadingDiv">
          <img src={FnbPickUp}></img>
          {/* <h4>Picked-up by you</h4> */}
          <h4 className="childSpanWrap">
            <span>Picked-up by you</span>
          </h4>
        </div>

        <ul>
          {/* <ul id="fooditems"> */}
          {this.props.parentState.cartData.map((cdItems, index) => {
            return cdItems.pickupAtCounter && cdItems.itemInCartFlag ? (
              <li className="clearfix" key={"cartItem_" + index + "_" + cdItems.id}>
                <h5 className="pcpbscrulCollft">
                  {cdItems.itemName}
                  <span className={(cdItems.modifierGroups && cdItems.modifierGroups.length > 0) || (cdItems.smartModifiers && cdItems.smartModifiers.length > 0) ? "" : "d-none"}>
                    {cdItems.modifierGroups && cdItems.modifierGroups.length > 0 ? this.props.populateItemModifierItems(cdItems.modifierGroups, cdItems.smartModifiers) : ""}
                    {cdItems.smartModifiers && cdItems.smartModifiers.length > 0 ? this.props.populateItemSmartModifierItems(cdItems.smartModifiers) : ""}
                  </span>
                </h5>
                <section className="pcpbscrulColrgt">
                  <aside className="itemCounter">
                    <a href="javascript:;" className="icControl iccDecrement" title="-" onClick={(event) => this.props.handleInCartFnbItemQuantity(event, "countDecrement", cdItems, index)}>
                      <span>Decrement</span>
                    </a>
                    <input
                      type="text"
                      //defaultValue={cdItems.quantity}
                      value={cdItems.quantity}
                      className="form-control"
                      readOnly
                    />
                    <a href="javascript:;" className="icControl iccIncrement" title="+" onClick={(event) => this.props.handleInCartFnbItemQuantity(event, "countIncrement", cdItems, index)}>
                      <span>Increment</span>
                    </a>
                  </aside>
                  <p className="pcpPrice">
                    {cdItems.modifierGroups.length > 0
                      ? this.props.calculateItemRowTotal(
                          cdItems.strikeprice,
                          cdItems.strikeprice == -1 || cdItems.strikeprice == null ? cdItems.valuebeforetax : cdItems.strikeValueBeforeTax,
                          cdItems.quantity,
                          cdItems.modifierGroups,
                          cdItems.dealItem
                        )
                      : cdItems.strikeprice == -1 || cdItems.strikeprice == null
                      ? "$" + parseFloat(cdItems.valuebeforetax * cdItems.quantity).toFixed(2) + ""
                      : "$" + parseFloat(cdItems.strikeValueBeforeTax * cdItems.quantity).toFixed(2) + ""}
                    {this.props.disableItemDelete ? (
                      ""
                    ) : (
                      <FontAwesomeIcon
                        color="#A9A9A9"
                        icon={faCircleXmark}
                        className="faCircle circleXmark deleteItem"
                        // data-bs-toggle="modal"
                        // data-bs-target="#modalDeleteConfirmation"
                        onClick={() => this.props.deleteItemFromCart(index)}
                      ></FontAwesomeIcon>
                    )}
                  </p>
                </section>
              </li>
            ) : (
              ""
            );
          })}
        </ul>
      </>
    ) : (
      ""
    );
  };
  populateItemsinSeatDelivery = () => {
    var pickupAtCounterCount = 0;
    this.props.parentState.cartData.map((cdItems) => {
      if (cdItems.pickupAtCounter && cdItems.itemInCartFlag) {
        pickupAtCounterCount = pickupAtCounterCount + 1;
      }
    });
    var inSeatDeliveryCount = 0;
    this.props.parentState.cartData.map((cdItems) => {
      if (cdItems.inSeatDelivery && cdItems.itemInCartFlag) {
        inSeatDeliveryCount = inSeatDeliveryCount + 1;
      }
    });
    //////////console.log("populateItemsinSeatDelivery() >>> inSeatDeliveryCount: " + inSeatDeliveryCount);
    return inSeatDeliveryCount > 0 ? (
      <>
        <div className="orderHeadingDiv" style={{paddingTop: pickupAtCounterCount == 0 ? 0 : 30}}>
          <img src={FnbDeliveryInSeat}></img>
          {/* <h4>
            Delivered to your seat{" "}
            {this.props.parentState.selectedInseatDeliverSlot && this.props.parentState.selectedInseatDeliverSlot != "" ? (
              <span className="themeColor">{this.props.parentState.selectedInseatDeliverSlot}</span>
            ) : (
              ""
            )}
          </h4> */}
          <h4 className="childSpanWrap">
            <span>
              Delivered to your seat{" "}
              {this.props.parentState.selectedInseatDeliverSlot && this.props.parentState.selectedInseatDeliverSlot != "" ? (
                <span className="themeColor">{this.props.parentState.selectedInseatDeliverSlot}</span>
              ) : (
                ""
              )}
            </span>
          </h4>
        </div>

        <ul>
          {/* <ul id="fooditems"> */}
          {this.props.parentState.cartData.map((cdItems, index) => {
            return cdItems.inSeatDelivery && cdItems.itemInCartFlag ? (
              <li className="clearfix">
                <h5 className="pcpbscrulCollft">
                  {cdItems.itemName}
                  <span className={(cdItems.modifierGroups && cdItems.modifierGroups.length > 0) || (cdItems.smartModifiers && cdItems.smartModifiers.length > 0) ? "" : "d-none"}>
                    {cdItems.modifierGroups && cdItems.modifierGroups.length > 0 ? this.props.populateItemModifierItems(cdItems.modifierGroups, cdItems.smartModifiers) : ""}
                    {cdItems.smartModifiers && cdItems.smartModifiers.length > 0 ? this.props.populateItemSmartModifierItems(cdItems.smartModifiers) : ""}
                  </span>
                </h5>
                <section className="pcpbscrulColrgt">
                  <aside className="itemCounter">
                    <a href="javascript:;" className="icControl iccDecrement" title="-" onClick={(event) => this.props.handleInCartFnbItemQuantity(event, "countDecrement", cdItems, index)}>
                      <span>Decrement</span>
                    </a>
                    <input
                      type="text"
                      //defaultValue={cdItems.quantity}
                      value={cdItems.quantity}
                      className="form-control"
                      readOnly
                    />
                    <a
                      href="javascript:;"
                      className="icControl iccIncrement"
                      title="+"
                      //data-bs-toggle="modal"
                      //data-bs-target="#repeatItem"
                      onClick={(event) => this.props.handleInCartFnbItemQuantity(event, "countIncrement", cdItems, index)}
                    >
                      <span>Increment</span>
                    </a>
                  </aside>
                  <p className="pcpPrice">
                    {cdItems.modifierGroups.length > 0
                      ? this.props.calculateItemRowTotal(
                          cdItems.strikeprice,
                          cdItems.strikeprice == -1 || cdItems.strikeprice == null ? cdItems.valuebeforetax : cdItems.strikeValueBeforeTax,
                          cdItems.quantity,
                          cdItems.modifierGroups,
                          cdItems.dealItem
                        )
                      : //"$" + parseFloat( cdItems.valuebeforetax * cdItems.quantity ).toFixed(2) + ""
                      cdItems.strikeprice == -1 || cdItems.strikeprice == null
                      ? "$" + parseFloat(cdItems.valuebeforetax * cdItems.quantity).toFixed(2) + ""
                      : "$" + parseFloat(cdItems.strikeValueBeforeTax * cdItems.quantity).toFixed(2) + ""}
                    {this.props.disableItemDelete ? (
                      ""
                    ) : (
                      <FontAwesomeIcon
                        color="#A9A9A9"
                        icon={faCircleXmark}
                        className="faCircle circleXmark deleteItem"
                        // data-bs-toggle="modal"
                        // data-bs-target="#modalDeleteConfirmation"
                        onClick={() => this.props.deleteItemFromCart(index)}
                      ></FontAwesomeIcon>
                    )}
                  </p>
                </section>
              </li>
            ) : (
              ""
            );
          })}
        </ul>
      </>
    ) : (
      ""
    );
  };

  calculateCartMemberSavings = (cData) => {
    console.log("cd bd data");
    console.log("------------------------------------");
    console.log(cData);
    var vbtTotal = 0;
    var svbtTotal = 0;
    if (cData.length > 0) {
      cData.map((item) => {
        //if (item.itemInCartFlag && item.dealItem == false) {
        if (item.strikeprice != null && item.itemInCartFlag && item.dealItem !== true) {
          console.log("++++++++++++++");
          console.log("++++++++++++++");
          console.log("inside");
          console.log(item.strikeprice);
          //vbtTotal = vbtTotal + item.valuebeforetax * item.quantity;
          //svbtTotal = svbtTotal + item.strikeValueBeforeTax * item.quantity;
          vbtTotal = vbtTotal + (item.valuebeforetax + item.taxValue) * item.quantity;
          svbtTotal = svbtTotal + item.strikeprice * item.quantity; //item.strikeprice = item.strikeValueBeforeTax + item.strikeTaxValue
          if (item.modifierGroups.length > 0) {
            item.modifierGroups.map((mgsItem) => {
              if (mgsItem.length > 0) {
                mgsItem.map((mgItem) => {
                  if (mgItem.modifierItems.length > 0) {
                    mgItem.modifierItems.map((mItem) => {
                      // vbtTotal = vbtTotal + mItem.modifierItemAmount * mItem.modifierItemQuantity * item.quantity;
                      // svbtTotal = svbtTotal + mItem.modifierItemAmount * mItem.modifierItemQuantity * item.quantity;
                      vbtTotal = vbtTotal + (mItem.modifierItemAmount + mItem.modifierItemTax) * mItem.modifierItemQuantity * item.quantity;
                      svbtTotal =
                        svbtTotal +
                        (mItem.strikeprice != -1 || mItem.strikeprice != null
                          ? (mItem.modifierItemStrikeValueBeforeTax + mItem.modifierItemStrikeTaxValue) * mItem.modifierItemQuantity * item.quantity
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
    //vbtTotal = vbtTotal.toFixed(2);
    var cartSavings = (vbtTotal - svbtTotal).toFixed(2);
    return cartSavings;
  };
  calculateCartDealsSavings = (cData) => {
    ////console.log("ColumnRight > calculateCartDealsSavings()");
    var vbtTotal = 0;
    var svbtTotal = 0;
    if (cData.length > 0) {
      cData.map((item) => {
        if (item.itemInCartFlag && item.dealItem) {
          //vbtTotal = vbtTotal + item.valuebeforetax * item.quantity;
          vbtTotal = vbtTotal + (item.valuebeforetax + item.taxValue) * item.quantity;
          //svbtTotal = svbtTotal + item.strikeValueBeforeTax * item.quantity;
          svbtTotal = svbtTotal + (item.strikeValueBeforeTax + item.strikeTaxValue) * item.quantity;
          if (item.modifierGroups.length > 0) {
            item.modifierGroups.map((mgsItem) => {
              if (mgsItem.length > 0) {
                mgsItem.map((mgItem) => {
                  if (mgItem.modifierItems.length > 0) {
                    mgItem.modifierItems.map((mItem) => {
                      //vbtTotal = vbtTotal + mItem.modifierItemAmount * mItem.modifierItemQuantity * item.quantity;
                      vbtTotal = vbtTotal + (mItem.modifierItemAmount + mItem.modifierItemTax) * mItem.modifierItemQuantity * item.quantity;
                      /**
                        //For dealsItem > modifierItems we are not considering the following:
                        //strikeprice(modifierItemStrikeprice), strikeValueBeforeTax(modifierItemStrikeValueBeforeTax) & strikeTaxValue(modifierItemStrikeTaxValue). 
                      **/
                      //svbtTotal = svbtTotal + mItem.modifierItemAmount * mItem.modifierItemQuantity * item.quantity;
                      svbtTotal = svbtTotal + (mItem.modifierItemAmount + mItem.modifierItemTax) * mItem.modifierItemQuantity * item.quantity;
                    });
                  }
                });
              }
            });
          }
        }
      });
    }
    //vbtTotal = vbtTotal.toFixed(2);
    var cartSavings = (vbtTotal - svbtTotal).toFixed(2);
    return cartSavings;
  };
  listDealItemsInCart = (cData) => {
    ////console.log("ColumnRight > listDealItemsInCart()");
    var dealItems = "";
    if (cData.length > 0) {
      cData.map((item, index) => {
        if (item.itemInCartFlag && item.dealItem) {
          dealItems =
            dealItems + index == 0
              ? item.quantity > 1
                ? item.itemName + "(" + item.quantity + ")"
                : item.itemName
              : ", " + item.quantity > 1
              ? item.itemName + "(" + item.quantity + ")"
              : item.itemName;
        }
      });
    }
    return dealItems;
  };

  populateSavingsText = () => {
    var returnText = "";
    var todaysSpecials = false;
    var extrasMember = false;

    if (this.props.parentState.cartData.findIndex((x) => x.dealItem == true) != -1) {
      todaysSpecials = true;
    }

    if (Object.keys(this.props.parentState.afterLoginToken).length !== 0 && this.props.parentState.isExtraPlusMember) {
      extrasMember = true;
    }

    console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
    console.log("extrasMember----------->>>> " + extrasMember);
    console.log("this.props.parentState.isExtraPlusMember----------->>>> " + this.props.parentState.isExtraPlusMember);
    if (todaysSpecials && !extrasMember) {
      returnText = (
        <span>
          With Today's Special, you saved <span className="priceColor">${this.calculateCartDealsSavings(this.props.parentState.cartData)}</span> on today's order
        </span>
      );
    } else if (!todaysSpecials && extrasMember && parseInt(this.calculateCartMemberSavings(this.props.parentState.cartData)) != 0) {
      returnText = (
        <span>
          As an ExtrasPlus Member, you saved <span className="priceColor">${this.calculateCartMemberSavings(this.props.parentState.cartData)}</span> on today's order
        </span>
      );
    } else if (todaysSpecials && extrasMember) {
      returnText = (
        <span>
          With Today's Special, you saved <span className="priceColor">${this.calculateCartDealsSavings(this.props.parentState.cartData)}</span>{" "}
          {parseInt(this.calculateCartMemberSavings(this.props.parentState.cartData)) != 0
            ? `and as an ExtrasPlus Member, you saved <span className='priceColor'>${this.calculateCartMemberSavings(this.props.parentState.cartData)}</span> on today's order`
            : ""}
        </span>
      );
    }

    return returnText;
  };

  render() {
    var cDataItemInCartFlag = 0;
    if (this.props.parentState.cartData.length > 0) {
      this.props.parentState.cartData.map((cdItem) => {
        if (cdItem.itemInCartFlag) {
          cDataItemInCartFlag = cDataItemInCartFlag + 1;
        }
      });
      ////////console.log("cDataItemInCartFlag: " + cDataItemInCartFlag);
    }
    return (
      <section className="pcpbicrInner">
        {this.props.parentState.cartData.length > 0 && cDataItemInCartFlag > 0 ? (
          <section className="pcpCart pcpCartfull">
            <section className="roundBoxshadowed">
              <section className="pcpBookingsummary">
                <aside className="pcpbsInner">
                  <aside className="pcpcClose d-lg-none">
                    <a href="javascript:;" title="Close" onClick={() => this.props.handleRightColumnMobileToggle()}>
                      Close
                    </a>
                  </aside>
                  <h3>Order Summary</h3>
                  <OverlayScrollbarsComponent
                    ref={this.osComponentRef0}
                    options={{
                      paddingAbsolute: true,
                      autoUpdate: true,
                      scrollbars: {
                        clickScrolling: true,
                      },
                    }}
                    className="pcpbsContainer"
                  >
                    {/* List of pickupAtCounter Items */}
                    <section className="pcpbscRows pcpbscrFNB fnbPickup">
                      {/* <h4>Picked-up by you</h4> */}
                      {this.populateItemspickupAtCounter(this.props.parentState.cartData)}
                    </section>
                    {/* List of inSeatDelivery Items */}
                    <section className="pcpbscRows pcpbscrFNB fnbDeliveryinseat" style={{paddingTop: 0}}>
                      {/* <h4>Delivered to your seat</h4> */}
                      {this.populateItemsinSeatDelivery(this.props.parentState.cartData)}
                    </section>

                    <section className="pcpbscRows pcpbscrSubtotal">
                      <ul>
                        <li className="clearfix border-bottom-0">
                          <h5 className="pcpbscrulCollft">Sub Total</h5>
                          <aside className={`pcpbscrulColrgt ${this.props.disableItemDelete ? "pr-0" : ""}`}>
                            <p></p>
                            <p id="subtotal" className="pcpPrice">
                              {this.props.calculateCartSubtotal(this.props.parentState.cartData)}
                            </p>
                          </aside>
                        </li>
                        <li className="clearfix border-0 pt-0">
                          <h5 className="pcpbscrulCollft">Tax</h5>
                          <aside className={`pcpbscrulColrgt ${this.props.disableItemDelete ? "pr-0" : ""}`}>
                            <p></p>
                            <p id="subtotal" className="pcpPrice">
                              {this.props.calculateCartTax(this.props.parentState.cartData)}
                            </p>
                          </aside>
                        </li>
                        {this.props.parentState.redeemedGiftcards.length > 0 ? (
                          <li className="clearfix redeemedGiftcardTotal">
                            <h5 className="pcpbscrulCollft">Giftcard</h5>
                            <aside className={`pcpbscrulColrgt ${this.props.disableItemDelete ? "pr-0" : ""}`}>
                              <p></p>
                              <p id="subtotal" className="pcpPrice">
                                {this.props.calculateRedemeedGiftcardTotal(this.props.parentState.redeemedGiftcards)}
                              </p>
                            </aside>
                          </li>
                        ) : (
                          ""
                        )}
                      </ul>
                    </section>
                  </OverlayScrollbarsComponent>
                  <section className={`pcpbsTotalstrap clearfix ${this.props.disableItemDelete ? "pr-0" : ""}`}>
                    <h5>Total</h5>
                    <p>{this.props.calculateCartGrandTotal(this.props.parentState.cartData)}</p>
                  </section>
                  {Object.keys(this.props.parentState.afterLoginToken).length !== 0 || this.props.parentState.cartData.findIndex((x) => x.dealItem == true) != -1 ? (
                    <section className="pcpbsContainer" style={{paddingRight: 0}}>
                      <section className="pcpbscRows pcpbscrSavings">{this.populateSavingsText()}</section>
                    </section>
                  ) : (
                    ""
                  )}
                </aside>
              </section>
            </section>
            <section className="pcpcAction">
              <aside className="btnswrap">
                {this.props.continueCTA != "" ? (
                  this.props.continueCTA == "/payment" ? (
                    // <a
                    //   href="javascript:;"
                    //   title="Checkout"
                    //   className={`btn btndefault ${this.props.checkOutDisabled ? "" : "overviewCheckoutBtnDisabled"}`}
                    //   onClick={() => {
                    //     this.props.handleOrderCreate();
                    //   }}
                    // >
                    //   <span>Checkout</span>
                    // </a>
                    this.props.parentState.cartData.length > 0 && this.props.checkOutDisabled ? (
                      <a
                        href="javascript:;"
                        title="Checkout"
                        className="btn btndefault"
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
                        className="btn btndefault btnValidation"
                        onClick={() => {
                          this.props.checkPhoneNumberAndEmailValidity();
                          this.props.handleOrderReviewValidation();
                        }}
                      >
                        Checkout
                      </a>
                    )
                  ) : (
                    <NavLink
                      //exact
                      to={this.props.continueCTA}
                      title="Checkout"
                      //activeClassName="active"
                      className="btn btndefault"
                    >
                      <span>Checkout</span>
                    </NavLink>
                  )
                ) : (
                  ""
                  // <a
                  //   href="javascript:;"
                  //   title="Checkout"
                  //   className="btn btndefault"
                  //   onClick={() => {
                  //     this.props.handleOrderCreate();
                  //   }}
                  // >
                  //   <span>Checkout</span>
                  // </a>
                )}
              </aside>
            </section>
          </section>
        ) : (
          <section className="pcpCart pcpCartempty">
            <section className="roundBoxshadowed">
              <aside className="pcpcClose d-lg-none">
                <a href="javascript:;" title="Close" onClick={() => this.props.handleRightColumnMobileToggle()}>
                  Close
                </a>
              </aside>
              <section className="pcpCartempty">
                <aside className="pcpceInner">
                  <h3>Your Cart</h3>
                  <p>Cart is empty. Select a category to add food.</p>
                </aside>
              </section>
            </section>
            <section className="pcpcAction d-none">
              <aside className="btnswrap">
                <a href="javascript:;" className="btn btndefault" title="Continue">
                  <span>Continue</span>
                </a>
              </aside>
            </section>
          </section>
        )}
      </section>
    );
  }
}

export default ColumnRight;
