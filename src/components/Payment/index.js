import React from "react";
import {NavLink, Link} from "react-router-dom";
import jQuery from "jquery";
import { IoInformationCircle } from "react-icons/io5";
//import "bootstrap-select/dist/js/bootstrap-select.min.js";
import bootstrapSelect from "bootstrap-select";
//import BootstrapSelect from "react-bootstrap-select";
import Skeleton from "react-loading-skeleton";
import InputMask from "react-input-mask";

import ColumnRight from "../ColumnRight";

import imgApplePay from "../../assets/images/apple-paylogo.png";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrashCan} from "@fortawesome/free-solid-svg-icons";

class Payment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orderId: "",
      paymentId: "",
      giftcardNumber: "",
      nameOnCardErrorCheck: false,
      nameonCardValid: false,
      giftCardWarning:false
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.parentState.giftCardResponse !== this.props.parentState.giftCardResponse) {
      this.setState({ giftCardWarning: this.props.parentState.giftCardResponse !== "" });
    }
  }

  componentDidMount = async () => {
    if (this.props.parentState.orderId != "" && this.props.parentState.orderId != undefined && this.props.parentState.orderId != null) {
      await localStorage.setItem("parentState", JSON.stringify(this.props.parentState));
    } else {
      await this.props.setParentState(JSON.parse(localStorage.getItem("parentState")));
    }

    //////console.log("Payment > componentDidMount()");
    ////document.body.className = document.body.className.replace("homePage", "");
    document.body.className += "paymentPage";
    //this.props.populateOrderPayload();

    var orderId = this.props.parentState.orderId;
    this.props.handleOrderGetPaymentId(orderId);
    this.props.addMessageListener();
    this.props.setNameOnCard("");
    var self = this;
    //Payment Types Accordion.
    // var myCollapsible = document.getElementById("accordion");
    // myCollapsible.addEventListener("shown.bs.collapse", function () {
    //   // do something...
    //   //console.log("ASDF");
    //   if (self.state.orderId != "" && self.state.paymentId != "") {
    //     self.props.handleOrderPaymentInit(self.state.orderId, self.state.paymentId);
    //   }
    // });

    //Payment Flow > To add/remove layout class "paymentContent" with class "pageWrapper"
    if (this.props.pwPaymentflow === false) {
      ////////console.log("Payment > pwPaymentflow: " + this.props.pwPaymentflow);
      this.props.handlePaymentFlow(true);
    }
    //Payment Flow > Header > Home Icon
    if (this.props.showHomeIcon) {
      ////////console.log("Payment > showHomeIcon: " + this.props.showHomeIcon);
      this.props.handleShowHomeIcon(false);
    }
    /* Jquery Window Load & Resize */
    // jQuery(window).on("load resize", function () {
    //   ////////console.log("Load & Resize");
    //   self.props.handleFooterSticky();
    // });
    this.props.handleFooterSticky();
  };

  componentWillUnmount = () => {
    document.body.className = document.body.className.replace("paymentPage", "");
  };

  // componentDidUpdate = () => {
  //   // var iframeEle = document.getElementsByTagName("iframe");
  //   // if (iframeEle.length > 0) {
  //   //   iframeEle.style.height = iframeEle.contentWindow.document.body.scrollHeight + "px";
  //   // }
  //   var iframeEle = document.getElementsByTagName("myIFrame");
  //   //console.log("iframeEle Length: " + iframeEle.length);
  //   if (iframeEle.length > 0) {
  //     //console.log("iframeEle.length > 0: " + iframeEle.length);
  //     iframeEle.contentWindow.body.addEventListener("click", this.props.handleMessage);
  //   }
  // };

  validateGiftcard = (e) => {
    //console.log("validateGiftcard()");
    var giftcardIsValid = false;
    var gifdcardVal = e.target.value;
    //const gifdcardNumber = gifdcardVal.replace(/-/g, "");
    const gifdcardNumber = gifdcardVal.trim();
    //console.log("gifdcardNumber: " + gifdcardNumber);
    var gfValidateBtn = document.getElementById("giftCardApplyBtn");
    var isDisabled = gfValidateBtn.classList.contains("disabled");

    if (gifdcardNumber.length == 16 && isDisabled) {
      gfValidateBtn.classList.remove("disabled");
      giftcardIsValid = true;
    }
    // else if (gifdcardNumber.length == 24 && isDisabled) {
    // 	gfValidateBtn.classList.remove("disabled")
    // }
    // else if (gifdcardNumber.length >= 21 && isDisabled) {
    // 	gfValidateBtn.classList.remove("disabled")
    // }
    else {
      gfValidateBtn.classList.add("disabled");
      giftcardIsValid = false;
    }

    this.setState({
      giftcardNumber: giftcardIsValid ? gifdcardNumber : "",
    });
    this.props.handleGiftCardResponse("")
  };

  //Cart - Giftcard Total.
  // calculateRedemeedGiftcardTotal = (redeemedGiftcards) => {
  //   //console.log("calculateRedemeedGiftcardTotal()");
  //   //console.log(redeemedGiftcards);
  //   var gfTotal = 0;
  //   redeemedGiftcards.map((giftcartItem) => {
  //     if (giftcartItem.orders_paymenttypes.length > 0)
  //       giftcartItem.orders_paymenttypes.map((ptItem, index) => {
  //         if (ptItem.type == "giftcard") {
  //           gfTotal = gfTotal + ptItem.amount;
  //         }
  //       });
  //   });
  //   return "- $" + gfTotal.toFixed(2) + "";
  // };

  render() {
    let {giftCardWarning} = this.state
    return (
      <section className="pageContent">
        <section className="pcPanel">
          <aside className="pcpHead">
            <section className="container">
              <aside className="pcphInner">
                <h1>
                  {/* <a href="order-review.html" className="btnBack" title="Back">
                    Back
                  </a> */}
                  <NavLink
                    //exact
                    to="/orderreview"
                    title="Back"
                    className="btnBack"
                  >
                    Back
                  </NavLink>
                  Payment
                </h1>
                <section className="pcpLocation d-none">
                  <section className="pcplDropdown pcplddReadonly">
                    <aside className="pcplddHead">
                      <a href="javascript:;">
                        <span>Brookfield, Wl</span>
                      </a>
                    </aside>
                  </section>
                </section>
              </aside>
            </section>
          </aside>
          {/* E.O.F&B Panelhead(pcfnbPanelhead) */}
          <section className="pcpBody">
            <section className="container">
              <section className="pcpbInner">
                <section className="pcpbiColswrap clearfix pcbOrderreviewwrap">
                  <section className="pcpbiCols pcpbiColleft">
                    <section className="paymentMethod-cont">
                      {/* <h4>Payment info</h4> */}
                      <section className="paymentType-list">
                        {/* Applepay */}
                        {/* <section className="panel panel-default withoutAcc">
                          <figure>
                            <a href="javascript:;" className="apple-pay" title="Apple Pay">
                              <img src={imgApplePay} className="img-fluid" alt="Apple Pay" title="Apple Pay" />
                            </a>
                          </figure>
                        </section> */}
                        <section className="payacc-block">
                          <section className="panel-group" id="accordion">
                            {/* Giftcard */}
                            <section className="panel panel-default">
                              <section className="panel-heading">
                                <a
                                  data-bs-toggle="collapse"
                                  className="collapsed"
                                  //data-parent="#accordion"
                                  data-bs-target="#collapseGiftcard"
                                  href="javascript:;"
                                  title="Gift card"
                                >
                                  Gift card
                                </a>
                              </section>
                              <section id="collapseGiftcard" className="panel-collapse accordion-collapse collapse" data-bs-parent="#accordion">
                                <section className="panel-body giftCard-body">
                                  <section className="pageForm">
                                    {this.props.parentState.redeemedGiftcards.length > 0 ? (
                                      <ul className="redeemedGiftcards">
                                        {this.props.parentState.redeemedGiftcards.map((giftcartItem) => {
                                          return giftcartItem.orders_paymenttypes.length > 0
                                            ? giftcartItem.orders_paymenttypes.map((ptItem, index) => {
                                                return ptItem.type == "giftcard" ? (
                                                  <li key={`${"redemeedGiftCard-" + index + "_" + ptItem.cardinformation.cardNumber + ""}`}>
                                                    <p>
                                                      <b>{ptItem.cardinformation.cardNumber}</b> has been applied
                                                      <span>Card Balance: $0.00</span>
                                                    </p>
                                                    <a href="javascript:;" onClick={() => this.props.removeRedemeedGiftcard(ptItem.cardinformation.cardNumber)}>
                                                      <FontAwesomeIcon icon={faTrashCan} className="fa-solid fa-trash-can"></FontAwesomeIcon>
                                                    </a>
                                                  </li>
                                                ) : (
                                                  ""
                                                );
                                              })
                                            : "";
                                        })}
                                      </ul>
                                    ) : (
                                      ""
                                    )}

                                    {this.props.parentState.redeemedGiftcards.length == 0 ? (
                                      <>
                                        <section className="form-group giftCardFormGroup-1" >
                                          <p className="success-txt">Your Gift Card was successfully applied.</p>
                                          <label className="visually-hidden">Gift card number</label>
                                          <input
                                            type="text"
                                            className="form-control"
                                            id="textboxGiftcard"
                                            placeholder="Enter the gift card number"
                                            autocomplete="off"
                                            inputmode="numeric"
                                            onDrag="return false"
                                            onDrop="return false"
                                            onkeyup=""
                                            onkeypress=""
                                            onfocusout=""
                                            maxlength="24"
                                            onChange={(e) => {this.validateGiftcard(e);
                                            this.setState({giftCardWarning:false})
                                            }}
                                          />
                                          {/* <InputMask
                                        type="text"
                                        className="form-control"
                                        id="textboxGiftcard"
                                        placeholder="Enter the gift card number"
                                        autocomplete="off"
                                        inputmode="numeric"
                                        onDrag="return false"
                                        onDrop="return false"
                                        onkeyup=""
                                        onkeypress=""
                                        onfocusout=""
                                        maxlength="24"
                                        // {...this.props}
                                        mask="9999-9999-9999-9999"
                                        maskChar=""
                                        onChange={(e) => this.validateGiftcard(e)}
                                      /> */}
                                          <p className="error-text giftCardApplyErrorMessage-1" id="giftCardApplyError"></p>
                                          <p className={`bookingIdHelperText bookingIdError giftCardInfoMessage-1 ${giftCardWarning ? "" : "d-none"}`} >
                                            {this.props.parentState.giftCardResponse === "Gift card has no balance. Please use a different card."? 
                                           <><IoInformationCircle size={18}/> {"Gift card not applied as the balance in this gift card is $0.00"}</>:
                                            this.props.parentState.giftCardResponse}</p>
                                        </section>
                                        <aside className="btnswrap">
                                          <a
                                            href="javascript:;"
                                            id="giftCardApplyBtn"
                                            onClick={() =>{ 
                                               this.props.handleGiftcardApply(this.state.giftcardNumber)
                                            }}
                                            className="btn btndefault disabled"
                                            title="Apply"
                                            style={{width: "100%"}}
                                          >
                                            <span>Apply</span>
                                          </a>
                                        </aside>
                                      </>
                                    ) : (
                                      ""
                                    )}
                                  </section>
                                </section>
                                {/* <section className="panel-body">
                                  <section className="pageForm">
                                    <section className="form-group">
                                      <input type="text" className="form-control" id="giftcardNumber" placeholder="Gift card number" />
                                      <p className="error-text"></p>
                                    </section>
                                  </section>
                                </section> */}
                              </section>
                            </section>

                            {/* Other Payment Types */}
                            {this.props.parentState.paymentTypes.length == 0 ? (
                              ""
                            ) : (
                              <>
                                {this.props.parentState.paymentTypes.sort((a,b) =>{
                                  if(a.name > b.name && !a.name.startsWith("C")){
                                    return 1;
                                  }
                                  if(a.name < b.name  && !a.name.startsWith("C")){
                                    return -1;
                                  }
                                  return 0;
                                }).map((ptItem, index) => {
                                  if (ptItem.name === "Apple pay" && window.ApplePaySession === undefined) {
                                    return null;
                                  }
                                  return ptItem.show ? (
                                    <section
                                      //className="panel panel-default"
                                      className={`panel panel-default ${
                                        ptItem.name === "Credit / Debit card"
                                          ? "panelCreditDebitCard"
                                          : ptItem.name === "Googlepay"
                                          ? "panelGooglePay"
                                          : ptItem.name === "Apple pay"
                                          ? "panelApplePay"
                                          : ""
                                      }`}
                                      key={"paymentType-" + index + "-" + ptItem.method_name + ""}
                                    >
                                      <section className="panel-heading">
                                        <a
                                          data-bs-toggle="collapse"
                                          //data-parent="#accordion"
                                          data-bs-target={"#paymentCollapse" + index + ""}
                                          href="javascript:;"
                                          title="Credit or Debit card"
                                          onClick={() => {this.props.handleOrderPaymentInit(this.props.parentState.orderId, ptItem.id)
                                            this.setState({nameOnCardErrorCheck: false, nameonCardValid: false});
                                            this.props.setNameOnCard("");
                                          }}
                                          className={`${window.ApplePaySession === undefined ? (index == 1 ? "" : "collapsed") : index == 0 ? "" : "collapsed"}`}
                                        >
                                          {ptItem.name}
                                        </a>
                                      </section>
                                      <section
                                        id={"paymentCollapse" + index + ""}
                                        className={`${
                                          window.ApplePaySession === undefined
                                            ? index == 1
                                              ? "panel-collapse accordion-collapse collapse show"
                                              : "panel-collapse accordion-collapse collapse"
                                            : index == 0
                                            ? "panel-collapse accordion-collapse collapse show"
                                            : "panel-collapse accordion-collapse collapse"
                                        }`}
                                        data-bs-parent="#accordion"
                                      >
                                        {/* <section className="panel-body">
                                          <section className="pageForm">
                                            <section className="form-group">
                                              <input type="text" className="form-control" id="cardNumber" placeholder="Card number" />
                                              <p className="error-text"></p>
                                            </section>
                                            <section className="form-group datepick">
                                              <input type="text" className="form-control datepicker" id="cardExp" placeholder="MM / YYYY" readOnly />
                                              <p className="error-text"></p>
                                            </section>
                                            <section className="form-group cvvno">
                                              <input type="text" className="form-control" id="cvvNumber" placeholder="CVV" />
                                              <p className="error-text"></p>
                                            </section>
                                          </section>
                                        </section> */}
                                        <section className="panel-body">
                                          {/* {this.props.parentState.paymentIframe == null
                                            ? // <section className="pageForm">
                                              //   <section className="form-group">
                                              //     <Skeleton duration={0.75} style={{height: 36}} />
                                              //   </section>
                                              //   <section className="form-group datepick">
                                              //     <Skeleton duration={0.75} style={{height: 36}} />
                                              //   </section>
                                              //   <section className="form-group cvvno">
                                              //     <Skeleton duration={0.75} style={{height: 36}} />
                                              //   </section>
                                              // </section>
                                              ""
                                            : this.handleIframeParse()} */}
                                          {Object.keys(this.props.parentState.paymentIframe).length !== 0 && ptItem.id == this.props.parentState.paymentIframe.paymentId ? (
                                            <>
                                              {ptItem.name === "Credit / Debit card" ? (
                                                <>
                                                  <div className="creditcardNameOnCardContainer">
                                                    <div className="creditCardNameOnCardLabel">NAME ON CARD</div>
                                                    <input
                                                      id ="creditCardNameOnCardInputId"
                                                      className={
                                                        this.state.nameOnCardErrorCheck && this.props.nameOnCard === ""
                                                          ? `creditCardNameOnCardInputError`
                                                          : this.state.nameonCardValid
                                                          ? `creditCardNameOnCardInputGreen`
                                                          : `creditCardNameOnCardInput`
                                                      }
                                                      maxlength="50"
                                                      placeholder="Name on Card"
                                                      value={this.props.nameOnCard}
                                                      onChange={(e) => {
                                                        this.setState({nameOnCardErrorCheck: true, nameonCardValid: false});
                                                        this.props.setNameOnCard(e.target.value);
                                                      }}
                                                      onBlur={(e) => {
                                                        if (this.props.nameOnCard !== "") {
                                                          this.setState({nameonCardValid: true});
                                                        }
                                                        if(this.props.nameOnCard.trim().length === 0){
                                                          this.props.setNameOnCard("");
                                                        }
                                                      }}
                                                    ></input>
                                                  </div>
                                                </>
                                              ) : null}
                                              {this.state.nameOnCardErrorCheck && this.props.nameOnCard === "" ? <div className="creditcardNameOnCardError">Name on Card is incomplete</div> : null}
                                              <div className="iframWrapper" dangerouslySetInnerHTML={{__html: this.props.parentState.paymentIframe.iframe.replace(/\\/g, "")}}></div>
                                            </>
                                          ) : (
                                            <section className="pageForm">
                                              <section className="form-group">
                                                <Skeleton duration={0.75} style={{height: 36}} />
                                              </section>
                                              {/* <section className="form-group datepick">
                                                <Skeleton duration={0.75} style={{height: 36}} />
                                              </section>
                                              <section className="form-group cvvno">
                                                <Skeleton duration={0.75} style={{height: 36}} />
                                              </section> */}
                                            </section>
                                          )}
                                        </section>
                                      </section>
                                    </section>
                                  ) : (
                                    ""
                                  );
                                })}
                              </>
                            )}
                            {/* HTML Payment Accordion */}
                            {/* <section className="panel panel-default">
                              <section className="panel-heading">
                                <a
                                  data-bs-toggle="collapse"
                                  //data-parent="#accordion"
                                  data-bs-target="#collapse1"
                                  href="javascript:;"
                                  title="Credit or Debit card"
                                >
                                  Credit or Debit card
                                </a>
                              </section>
                              <section id="collapse1" className="panel-collapse accordion-collapse collapse show" data-bs-parent="#accordion">
                                <section className="panel-body">
                                  <section className="pageForm">
                                    <section className="form-group">
                                      <input type="text" className="form-control" id="cardNumber" placeholder="Card number" />
                                      <p className="error-text"></p>
                                    </section>
                                    <section className="form-group datepick">
                                      <input type="text" className="form-control datepicker" id="cardExp" placeholder="MM / YYYY" readOnly />
                                      <p className="error-text"></p>
                                    </section>
                                    <section className="form-group cvvno">
                                      <input type="text" className="form-control" id="cvvNumber" placeholder="CVV" />
                                      <p className="error-text"></p>
                                    </section>
                                  </section>
                                </section>
                              </section>
                            </section> */}
                            {/* Vouchers */}
                            {/* <section className="panel panel-default">
                              <section className="panel-heading">
                                <a
                                  data-bs-toggle="collapse"
                                  className="collapsed"
                                  //data-parent="#accordion"
                                  data-bs-target="#collapse3"
                                  href="javascript:;"
                                  title="Vouchers"
                                >
                                  Vouchers
                                </a>
                              </section>
                              <section
                                id="collapse3"
                                className="panel-collapse accordion-collapse collapse"
                                data-bs-parent="#accordion"
                              >
                                <section className="panel-body">
                                  <section className="pageForm">
                                    <section className="form-group">
                                      <input
                                        type="text"
                                        className="form-control"
                                        id="voucherCode"
                                        placeholder="Voucher code"
                                      />
                                      <p className="error-text"></p>
                                    </section>
                                  </section>
                                </section>
                              </section>
                            </section> */}
                          </section>
                        </section>
                      </section>
                    </section>
                  </section>
                  {/* E.O.Columns Wrap > Left Column(pcpbiCols pcpbiColleft) */}
                  <aside className="pcpbiCols pcpbiColright">
                    <ColumnRight
                      continueCTA={""}
                      // handleOrderCreate={this.props.handleOrderCreate}
                      handleRightColumnMobileToggle={this.props.handleRightColumnMobileToggle}
                      parentState={this.props.parentState}
                      populateItemModifierItems={this.props.populateItemModifierItems}
                      populateItemSmartModifierItems={this.props.populateItemSmartModifierItems}
                      calculateItemRowTotal={this.props.calculateItemRowTotal}
                      calculateCartSubtotal={this.props.calculateCartSubtotal}
                      calculateCartTax={this.props.calculateCartTax}
                      calculateCartGrandTotal={this.props.calculateCartGrandTotal}
                      calculateRedemeedGiftcardTotal={this.props.calculateRedemeedGiftcardTotal}
                      disableItemDelete={true}
                    />
                  </aside>
                  {/* E.O.Columns Wrap > Right Column(pcpbiCols pcpbiColrigh) */}
                </section>
                {/* E.O.Columns Wrap(pcpbiColswrap) */}
                <section className="pcpbBottomstrap">
                  <section className="pcpbbsInner clearfix">
                    <aside className="pcpbsTrigger" onClick={() => this.props.handleRightColumnMobileToggle()}>
                      <h2>
                        <span>View Cart</span>
                        <strong>{`${this.props.parentState.cartData.length > 0 ? this.props.calculateCartGrandTotal(this.props.parentState.cartData) : "$0.00"}`}</strong>
                      </h2>
                    </aside>
                    <aside className="btnswrap d-none">
                      {/* <a
                        href="booking-confirmation.html"
                        className="btn btntext"
                        title="Continue"
                      >
                        Continue
                      </a> */}
                      <NavLink to="/confirmation" className="btn btntext" title="Checkout">
                        Checkout
                      </NavLink>
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

export default Payment;
