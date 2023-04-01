import React from "react";
import constant from "../../configuration/config";
import {OverlayScrollbarsComponent} from "overlayscrollbars-react";

import influxLogo from "../../assets/images/bg-logo-influx.png";
import modalBanner from "../../assets/images/fnb-items/bg-item680x680-01.png";
import iconExtras from "../../assets/images/logo-spiExtras.png";
import iconExtrasPlus from "../../assets/images/logo-spiExtrasPlus.png";
import foodOrderCancel from "../../assets/images/foodOrderCancel.png";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faX} from "@fortawesome/free-solid-svg-icons";
import Skeleton from "react-loading-skeleton";

import FnbPickUp from "../../assets/images/ic-fnbPickup.svg";
import FnbDeliveryInSeat from "../../assets/images/ic-fnbDeliveryinseat.svg";
import {object} from "prop-types";

var numberOfSkeletonsBeforeLoad = 3;

class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.osComponentRef1 = React.createRef();
  }

  populateModifierGroupTitle = (mgTitle, minQty, maxQty) => {
    ////////console.log("Footer > populateModifierGroupTitle()");
    var itemModifierGroupTitle = mgTitle;
    if (minQty == 0 && maxQty == 0) {
      itemModifierGroupTitle = itemModifierGroupTitle + " (optional)";
    } else if (minQty == 0 && maxQty == 1) {
      itemModifierGroupTitle = itemModifierGroupTitle + " (optional select upto 1)";
    } else if (minQty == 1 && maxQty == 1) {
      itemModifierGroupTitle = itemModifierGroupTitle + " (Required)";
    } else if (minQty == 0 && maxQty > 1 && maxQty > minQty) {
      itemModifierGroupTitle = itemModifierGroupTitle + " (optional select upto " + maxQty + ")";
    } else if (minQty > 0 && maxQty > 1 && maxQty == minQty) {
      itemModifierGroupTitle = itemModifierGroupTitle + " (Required select " + maxQty + ")";
    } else if (minQty > 0 && maxQty > 1 && maxQty > minQty) {
      itemModifierGroupTitle = itemModifierGroupTitle + " (Required select " + minQty + " upto " + maxQty + ")";
    }
    return itemModifierGroupTitle;
  };

  handleMaxLength = (event) => {
    ////console.log("handleMaxLength()");
    var value = event.target.value;
    var maxLength = event.target.maxLength;
    ////console.log("handleMaxLength() > value: " + value);
    ////console.log("handleMaxLength() > maxLength: " + maxLength);
    if (value.length > maxLength) event.target.value = value.slice(0, maxLength);
  };

  addItemToCart = () => {
    var alcholBeverageCheckFNBData = this.props.alcholBeverageCheckFNBData;
    //// this.props.setFnbItemModifierData(alcholBeverageCheckFNBData.fnbItemData, alcholBeverageCheckFNBData.tabId, alcholBeverageCheckFNBData.tabName, alcholBeverageCheckFNBData.dealsFlag, false);
    //// this.props.ageRestrictionValidationTrue();
    var self = this;
    setTimeout(() => {
      self.props.setFnbItemModifierData(alcholBeverageCheckFNBData.fnbItemData, alcholBeverageCheckFNBData.tabId, alcholBeverageCheckFNBData.tabName, alcholBeverageCheckFNBData.dealsFlag, false);
      self.props.ageRestrictionValidationTrue();
    }, 400);
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

    // var smartModifierText = "";
    // smartModifiers.map((smartModifier, index) => {
    //   smartModifierText += smartModifier.description;
    //   if (smartModifier.quantity > 1) {
    //     smartModifierText += "(" + smartModifier.quantity + ")";
    //   }
    //   if (index + 1 != smartModifiers.length) {
    //     smartModifierText += ", ";
    //   }
    // });

    // return smartModifierText.length == 0 ? "" : smartModifierText;
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

  render() {
    return (
      <>
        <footer className="pageFooter">
          <section className="container">
            <figure className="poweredBy">
              <span>Powered by</span>
              <a href="javascript:;" title="Influx Worldwide">
                <img src={influxLogo} alt="Influx Worldwide" title="Influx Worldwide" />
              </a>
            </figure>
          </section>
        </footer>
        {/* E.O.Footer */}
        <section id="membersLogin" className="modal fade" role="dialog" data-bs-keyboard="false" data-bs-backdrop="static">
          <section className="modal-dialog">
            <section className="modal-content">
              <section className="modal-body">
                <section className="mbHead">
                  <a href="javascript:;" className="btnBack" data-bs-dismiss="modal" title="Back" onClick={() => this.props.setMemberLoginState(false)}>
                    Back
                  </a>
                  <a href="javascript:;" className="modalClose" data-bs-dismiss="modal" title="Close" onClick={() => this.props.setMemberLoginState(false)}>
                    Close
                  </a>
                </section>
                <section className="mbBody">
                  <section className="mlFormWrap">
                    <aside className="mlfLogos">
                      <figure>
                        <img src={iconExtras} alt="Show Place Icon Extras" className="img-fluid" />
                      </figure>
                      <div className="logosSeparator"></div>
                      <figure>
                        <img src={iconExtrasPlus} alt="Show Place Icon Extras Plus" className="img-fluid" />
                      </figure>
                    </aside>
                    <aside className="mlForm">
                      <h2>
                        <span>Login to</span>Extras program
                      </h2>
                      <aside className="mlfGroup">
                        <label htmlFor="fieldUsername" className="form-label visually-hidden">
                          Username
                        </label>
                        <input type="email" className="form-control" id="fieldUsername" placeholder="Username" onChange={(event) => this.props.handleLoginFieldsOnChanges(event, "loginUserName")} />
                      </aside>
                      <aside className="mlfGroup">
                        <label htmlFor="fieldPassword" className="form-label visually-hidden">
                          Password
                        </label>
                        <input type="password" className="form-control" id="fieldPassword" placeholder="Password" onChange={(event) => this.props.handleLoginFieldsOnChanges(event, "loginPassword")} />
                      </aside>
                      <p className="mlfError bookingIdError" id="memberLoginError" style={{display: "none"}}>
                        Invalid credentials. Please try again.
                      </p>
                      <aside className="mlfAction btnswrap" id="loginModalLoginButtonDiv">
                        <a
                          title="Log in"
                          className={`btn btndefault ${this.props.parentState.loginUserName == "" || this.props.parentState.loginPassword == "" ? "disabled" : ""}`}
                          href="javascript:;"
                          onClick={() => this.props.handleUserLogin()}
                        >
                          <span>Log in</span>
                        </a>
                      </aside>
                    </aside>
                  </section>
                </section>
              </section>
            </section>
          </section>
        </section>
        {/* E.O.Modal Popup | Repeat Item */}
        <section className="fnbmodifierModal">
          <section
            //id="fnbmodifierModal"
            id="modalFnbModifier"
            className="modal fade"
            tabIndex="-1"
            role="dialog"
            data-bs-keyboard="false"
            data-bs-backdrop="static"
          >
            <section className="modal-dialog" role="document">
              <section className="modal-content">
                <OverlayScrollbarsComponent
                  ref={this.osComponentRef1}
                  options={{
                    paddingAbsolute: true,
                    autoUpdate: true,
                    scrollbars: {
                      clickScrolling: true,
                    },
                  }}
                  className="osbWrap"
                >
                  {this.props.fnbItemModifierData != "" ? (
                    <>
                      <section
                        className="modal-header"
                        style={{
                          backgroundImage: "url(" + this.props.fnbItemModifierData.fnbs_images[0].imageurl + ")",
                          // height: 175,
                        }}
                      >
                        <img src={this.props.fnbItemModifierData.fnbs_images[0].imageurl} alt={this.props.fnbItemModifierData.itemName} className="img-fluid d-md-none" />
                        <div className="todaysDealCloseDiv">
                          {this.props.populateTodaysDealFlag(this.props.fnbItemModifierData.id) ? (
                            <button type="button" className="btn btn-primary todaysDealPill">
                              Today's Deal
                            </button>
                          ) : (
                            <span></span>
                          )}

                          <a href="javascript:;" className="modalClose" title="Close" data-bs-dismiss="modal" aria-label="Close">
                            Modal Close
                          </a>
                        </div>
                      </section>
                      <section className="modal-body">
                        <section className="fnbItemdesc">
                          <h2>
                            {this.props.fnbItemModifierData.itemName}
                            {this.props.fnbItemModifierData.fnbs_alternateitems && this.props.fnbItemModifierData.fnbs_alternateitems.length > 0 ? (
                              ""
                            ) : (
                              <span>{`$${
                                this.props.fnbItemModifierData.strikeprice == -1 || this.props.fnbItemModifierData.strikeprice == null
                                  ? Number(this.props.fnbItemModifierData.valuebeforetax).toFixed(2)
                                  : Number(this.props.fnbItemModifierData.strikeValueBeforeTax).toFixed(2)
                              }`}</span>
                            )}
                          </h2>
                          <p>{this.props.fnbItemModifierData.itemDetails}</p>
                        </section>
                        <section className="fnbmmRowwrap">
                          {/* Alternate Items */}
                          {this.props.fnbItemModifierData.fnbs_alternateitems && this.props.fnbItemModifierData.fnbs_alternateitems.length > 0 ? (
                            <section
                              //className="fnbmmrwRows fnbsubItemsrows"
                              className="fnbmmrwRows fnbAlternateItems"
                            >
                              <section className="fnbmmrwrsiWrap">
                                <h3>Select an option</h3>
                                <ul>
                                  {this.props.fnbItemModifierData.fnbs_alternateitems.map((alternateItem, index) => {
                                    return (
                                      <li key={"alternateItemKey" + this.props.fnbItemModifierData.id + "_" + alternateItem.id + "_" + index}>
                                        <aside className="customRadio">
                                          <input
                                            type="radio"
                                            id={"alternateItemRadio" + this.props.fnbItemModifierData.id + "_" + alternateItem.id + "_" + index}
                                            name="selectFnbsAlternateitems"
                                            onChange={(e) => this.props.alternateItemRadioOnchange(alternateItem, this.props.fnbItemModifierData.ageRestriction)}
                                          />
                                          <label htmlFor={"alternateItemRadio" + this.props.fnbItemModifierData.id + "_" + alternateItem.id + "_" + index}>
                                            {alternateItem.itemName}
                                            <span>{`$${
                                              alternateItem.strikeprice == -1 || alternateItem.strikeprice == null
                                                ? alternateItem.valuebeforetax.toFixed(2)
                                                : alternateItem.strikeValueBeforeTax.toFixed(2)
                                            }`}</span>
                                            <i></i>
                                          </label>
                                        </aside>
                                      </li>
                                    );
                                  })}
                                </ul>
                              </section>
                            </section>
                          ) : (
                            ""
                          )}
                          {/* E.O.Alternate Items */}
                          {/* Modifier Groups */}
                          {this.props.fnbItemModifierData.modifierGroups.length > 0 ? (
                            <section className="fnbmmrwRows fnbsubItemsrows">
                              {this.props.fnbItemModifierData.modifierGroups.map((modifierGroup, index) => {
                                return (
                                  <section
                                    className="fnbmmrwrsiWrap"
                                    key={"modifierGroups" + this.props.fnbItemModifierData.id + "_" + modifierGroup.id + "_" + index}
                                    //tabId
                                    id={"fnbmmrwrsiWrap_" + this.props.fnbItemModifierData.id + "_" + modifierGroup.id}
                                  >
                                    {/* <h3>{modifierGroup.tabName}</h3> */}
                                    <h3>{this.populateModifierGroupTitle(modifierGroup.tabName, modifierGroup.minQty, modifierGroup.maxQty)}</h3>
                                    {modifierGroup.modifier_items.length > 0 ? (
                                      modifierGroup.minQty == 1 && modifierGroup.maxQty == 1 ? (
                                        <ul>
                                          {modifierGroup.modifier_items.map((modifierItem, index) => {
                                            return (
                                              <li key={"modifierItem" + this.props.fnbItemModifierData.id + "_" + modifierGroup.id + "_" + modifierItem.id + "_" + index}>
                                                <aside className="customRadio">
                                                  <input
                                                    type="radio"
                                                    id={"cb" + this.props.fnbItemModifierData.id + "_" + modifierGroup.id + "_" + modifierItem.id + "_" + index}
                                                    name="selectOptions"
                                                    onChange={(e) =>
                                                      this.props.modifierItemRadioOnchange(
                                                        e,
                                                        this.props.fnbItemModifierData.id,
                                                        modifierGroup.id,
                                                        modifierGroup.tabid,
                                                        modifierGroup.minQty,
                                                        modifierGroup.maxQty,
                                                        modifierItem.id,
                                                        modifierItem.itemName,
                                                        modifierItem.valuebeforetax,
                                                        modifierItem.taxValue,
                                                        modifierItem.strikeprice,
                                                        modifierItem.strikeValueBeforeTax,
                                                        modifierItem.strikeTaxValue
                                                      )
                                                    }
                                                  />
                                                  <label htmlFor={"cb" + this.props.fnbItemModifierData.id + "_" + modifierGroup.id + "_" + modifierItem.id + "_" + index}>
                                                    {modifierItem.itemName}
                                                    <i></i>
                                                  </label>
                                                </aside>
                                              </li>
                                            );
                                          })}
                                        </ul>
                                      ) : (
                                        <ul>
                                          {modifierGroup.modifier_items.map((modifierItem, index) => {
                                            return modifierItem.valuebeforetax > 0 ? (
                                              <li key={"modifierItem" + this.props.fnbItemModifierData.id + "_" + modifierGroup.id + "_" + modifierItem.id + "_" + index}>
                                                <section className="additionalItems">
                                                  <h4>
                                                    {modifierItem.itemName}{" "}
                                                    <span>{`+ $${
                                                      modifierItem.strikeprice == -1 || this.props.populateTodaysDealFlag(this.props.fnbItemModifierData.id)
                                                        ? modifierItem.valuebeforetax.toFixed(2)
                                                        : modifierItem.strikeprice != -1 && modifierItem.strikeValueBeforeTax
                                                        ? modifierItem.strikeValueBeforeTax.toFixed(2)
                                                        : modifierItem.strikeprice.toFixed(2)
                                                    }`}</span>
                                                    {/* <span> {"+ $" + (this.props.fnbItemModifierData.strikeprice == -1 ? modifierItem.valuebeforetax.toFixed(2) : modifierItem.strikeValueBeforeTax.toFixed(2))} </span> */}
                                                  </h4>
                                                  {/* <span>
                                                      {"$" +
                                                        modifierItem.valuebeforetax}
                                                    </span> */}
                                                  <aside className="itemCounter icZero iczActive">
                                                    <a
                                                      href="javascript:;"
                                                      className="icControl iccDecrement disabled"
                                                      title="-"
                                                      onClick={(e) =>
                                                        this.props.modifierItemCounter(
                                                          e,
                                                          "countDecrement",
                                                          this.props.fnbItemModifierData.id,
                                                          modifierGroup.id,
                                                          modifierGroup.tabid,
                                                          modifierGroup.minQty,
                                                          modifierGroup.maxQty,
                                                          modifierItem.id,
                                                          modifierItem.itemName,
                                                          ////this.props.fnbItemModifierData.strikeprice == -1 ? modifierItem.valuebeforetax : modifierItem.strikeValueBeforeTax,
                                                          ////this.props.fnbItemModifierData.strikeprice == -1 ? modifierItem.taxValue : modifierItem.strikeTaxValue
                                                          modifierItem.valuebeforetax,
                                                          modifierItem.taxValue,
                                                          modifierItem.strikeprice,
                                                          modifierItem.strikeValueBeforeTax,
                                                          modifierItem.strikeTaxValue
                                                        )
                                                      }
                                                    >
                                                      <span>Decrement</span>
                                                    </a>
                                                    <input
                                                      type="text"
                                                      //value="0"
                                                      defaultValue="0"
                                                      className="form-control"
                                                      readOnly
                                                    />
                                                    <a
                                                      href="javascript:;"
                                                      className="icControl iccIncrement"
                                                      title="+"
                                                      onClick={(e) =>
                                                        this.props.modifierItemCounter(
                                                          e,
                                                          "countIncrement",
                                                          this.props.fnbItemModifierData.id,
                                                          modifierGroup.id,
                                                          modifierGroup.tabid,
                                                          modifierGroup.minQty,
                                                          modifierGroup.maxQty,
                                                          modifierItem.id,
                                                          modifierItem.itemName,
                                                          ////this.props.fnbItemModifierData.strikeprice == -1 ? modifierItem.valuebeforetax : modifierItem.strikeValueBeforeTax,
                                                          ////this.props.fnbItemModifierData.strikeprice == -1 ? modifierItem.taxValue : modifierItem.strikeTaxValue
                                                          modifierItem.valuebeforetax,
                                                          modifierItem.taxValue,
                                                          modifierItem.strikeprice,
                                                          modifierItem.strikeValueBeforeTax,
                                                          modifierItem.strikeTaxValue
                                                        )
                                                      }
                                                    >
                                                      <span>Increment</span>
                                                    </a>
                                                  </aside>
                                                </section>
                                              </li>
                                            ) : (
                                              <li key={"modifierItem" + this.props.fnbItemModifierData.id + "_" + modifierGroup.id + "_" + modifierItem.id + "_" + index}>
                                                <aside className="customCheckbox">
                                                  <input
                                                    type="checkbox"
                                                    id={"cb" + this.props.fnbItemModifierData.id + "_" + modifierGroup.id + "_" + modifierItem.id + "_" + index}
                                                    name="selectOptions"
                                                    onChange={(e) =>
                                                      this.props.modifierItemCheckboxOnchange(
                                                        e,
                                                        this.props.fnbItemModifierData.id,
                                                        modifierGroup.id,
                                                        modifierGroup.tabid,
                                                        modifierGroup.minQty,
                                                        modifierGroup.maxQty,
                                                        modifierItem.id,
                                                        modifierItem.itemName,
                                                        modifierItem.valuebeforetax,
                                                        modifierItem.taxValue,
                                                        modifierItem.strikeprice,
                                                        modifierItem.strikeValueBeforeTax,
                                                        modifierItem.strikeTaxValue
                                                      )
                                                    }
                                                  />
                                                  <label htmlFor={"cb" + this.props.fnbItemModifierData.id + "_" + modifierGroup.id + "_" + modifierItem.id + "_" + index}>
                                                    {modifierItem.itemName}
                                                    <i></i>
                                                  </label>
                                                </aside>
                                              </li>
                                            );
                                          })}
                                        </ul>
                                      )
                                    ) : (
                                      ""
                                    )}
                                  </section>
                                );
                              })}
                            </section>
                          ) : (
                            ""
                          )}
                          {/* E.O.Modifier Groups */}
                          {/* Smart Modifiers */}
                          {this.props.fnbItemModifierData.smartModifiers.length > 0 ? (
                            <section className="fnbmmrwRows fnbsubItemsrows rowSmartModifiers">
                              <section className="fnbmmrwrsiWrap">
                                <aside className="rsmHead">
                                  <h3>Optional</h3>
                                  <p>Remove</p>
                                  <p>Add as Side</p>
                                </aside>
                                <ul>
                                  {this.props.fnbItemModifierData.smartModifiers.map((smartModifier, index) => {
                                    return (
                                      <li key={"smartModifier" + this.props.fnbItemModifierData.id + "_" + smartModifier.id + "_" + index}>
                                        <h4>{smartModifier.itemName}</h4>
                                        <aside className="customCheckbox">
                                          <input
                                            type="checkbox"
                                            id={"remove_cb" + this.props.fnbItemModifierData.id + "_" + smartModifier.id + "_" + index}
                                            name="selectOptions"
                                            onChange={(e) => this.props.smartModifierItemCheckboxOnchange(e, this.props.fnbItemModifierData.id, smartModifier.id, smartModifier.itemName, "remove")}
                                          />
                                          <label htmlFor={"remove_cb" + this.props.fnbItemModifierData.id + "_" + smartModifier.id + "_" + index}>
                                            {/* {smartModifier.itemName} */}
                                            <i></i>
                                          </label>
                                        </aside>
                                        <aside className="customCheckbox">
                                          <input
                                            type="checkbox"
                                            id={"addAsSide_cb" + this.props.fnbItemModifierData.id + "_" + smartModifier.id + "_" + index}
                                            name="selectOptions"
                                            onChange={(e) => this.props.smartModifierItemCheckboxOnchange(e, this.props.fnbItemModifierData.id, smartModifier.id, smartModifier.itemName, "side")}
                                          />
                                          <label htmlFor={"addAsSide_cb" + this.props.fnbItemModifierData.id + "_" + smartModifier.id + "_" + index}>
                                            {/* {smartModifier.itemName} */}
                                            <i></i>
                                          </label>
                                        </aside>
                                      </li>
                                    );
                                  })}
                                </ul>
                              </section>
                            </section>
                          ) : (
                            ""
                          )}
                          {/* E.O.Smart Modifiers */}
                          <section className="fnbmmrwRows">
                            <h3>Special Instructions</h3>
                            <section className="form-group">
                              <label className="visually-hidden">Special Instructions</label>
                              <textarea
                                className="form-control"
                                placeholder="Enter your instructions here"
                                value={this.props.cartData[this.props.cartData.length - 1] === undefined ? "" : this.props.cartData[this.props.cartData.length - 1].specialinstructions}
                                onChange={(e) => this.props.modifierModalFnbItemSpecialInstructions(e)}
                              ></textarea>
                            </section>
                          </section>
                        </section>
                      </section>
                    </>
                  ) : (
                    ""
                  )}
                </OverlayScrollbarsComponent>
                <section className="modal-footer">
                  <section className="fnbQuantity clearfix" id="modalFnbItemQuantity">
                    <h5>Quantity</h5>
                    <aside className="itemCounter icLarge">
                      <a
                        href="javascript:;"
                        id="modiferModalDecrementBtn"
                        className="icControl iccDecrement disabled"
                        title="-"
                        onClick={(e) => this.props.modifierModalFnbItemQuantity(e, "countDecrement", this.props.fnbItemModifierData)}
                      >
                        <span>Decrement</span>
                      </a>
                      <input type="text" defaultValue="1" className="form-control" readOnly id="modalFnbModifierQuantity" />
                      <a
                        href="javascript:;"
                        id="modiferModalIncrementBtn"
                        className="icControl iccIncrement"
                        title="+"
                        onClick={(e) => this.props.modifierModalFnbItemQuantity(e, "countIncrement", this.props.fnbItemModifierData)}
                      >
                        <span>Increment</span>
                      </a>
                    </aside>
                  </section>
                  <section className="fnbmmAction">
                    <aside className="btnswrap">
                      {this.props.fnbItemModifierData.fnbs_alternateitems && this.props.fnbItemModifierData.fnbs_alternateitems.length > 0 ? (
                        <a
                          href="javascript:;"
                          className="btn btndefault"
                          title={`Add to cart${this.props.tempModifierModalTotal > 0 ? " &" + this.props.tempModifierModalTotal + "" : ""}`}
                          data-bs-dismiss="modal"
                          aria-label="Close"
                          onClick={() => this.props.addItemToCart(this.props.fnbItemModifierData.id)}
                          id="modifierModalBtn"
                        >
                          {`Add to cart${this.props.tempModifierModalTotal > 0 ? " $" + this.props.tempModifierModalTotal + "" : ""}`}
                        </a>
                      ) : (
                        <a
                          href="javascript:;"
                          className="btn btndefault"
                          title={`Add to cart $${
                            this.props.tempModifierModalTotal > 0
                              ? this.props.tempModifierModalTotal
                              : this.props.fnbItemModifierData.strikeprice == -1 || this.props.fnbItemModifierData.strikeprice == null
                              ? Number(this.props.fnbItemModifierData.valuebeforetax).toFixed(2)
                              : Number(this.props.fnbItemModifierData.strikeValueBeforeTax).toFixed(2)
                          }`}
                          data-bs-dismiss="modal"
                          aria-label="Close"
                          onClick={() => this.props.addItemToCart(this.props.fnbItemModifierData.id)}
                          id="modifierModalBtn"
                        >
                          {`Add to cart $${
                            this.props.tempModifierModalTotal > 0
                              ? this.props.tempModifierModalTotal
                              : this.props.fnbItemModifierData.strikeprice == -1 || this.props.fnbItemModifierData.strikeprice == null
                              ? Number(this.props.fnbItemModifierData.valuebeforetax).toFixed(2)
                              : Number(this.props.fnbItemModifierData.strikeValueBeforeTax).toFixed(2)
                          }`}
                        </a>
                      )}
                    </aside>
                  </section>
                </section>
              </section>
            </section>
          </section>
        </section>
        {/* E.O.Modal Popup | FnB Modifier */}
        <section id="allowAlcoholic" className="common-popupCont res-btmCont alcoholicCont modal fade" role="dialog" data-bs-keyboard="false" data-bs-backdrop="static">
          <section className="modal-dialog">
            <section className="modal-content">
              <section className="modal-body">
                <a href="javascript:;" className="modalClose" data-bs-dismiss="modal" title="Close">
                  Close
                </a>
                <p>You must be of Legal Drinking Age</p>
                <section className="dobPageform">
                  <h2>Enter Your Date of Birth</h2>
                  <section className="pageForm">
                    <aside className="form-group">
                      <label>Month</label>
                      <input
                        name="field-1"
                        type="number"
                        placeholder="MM"
                        className="form-control"
                        maxLength={2}
                        onInput={(event) => this.handleMaxLength(event, 2)}
                        onChange={(event) => this.props.handleAgeRestrictionFieldsOnChanges(event, "ageRestrictionMonth")}
                      />
                    </aside>
                    <aside className="form-group">
                      <label>Date</label>
                      <input
                        name="field-2"
                        type="number"
                        placeholder="DD"
                        className="form-control"
                        maxLength={2}
                        onInput={(event) => this.handleMaxLength(event, 2)}
                        onChange={(event) => this.props.handleAgeRestrictionFieldsOnChanges(event, "ageRestrictionDate")}
                      />
                    </aside>
                    <aside className="form-group fgYear">
                      <label>Year</label>
                      <input
                        name="field-3"
                        type="number"
                        placeholder="YYYY"
                        className="form-control"
                        maxLength={4}
                        onInput={(event) => this.handleMaxLength(event, 4)}
                        onChange={(event) => this.props.handleAgeRestrictionFieldsOnChanges(event, "ageRestrictionYear")}
                      />
                    </aside>
                  </section>
                  <p>You will need to produce a valid state-issued identification card at the time of pick-up of the items, to support the date of birth entered.</p>
                </section>
                {/* <aside className="form-group">
                  <input type="checkbox" id="accAge" name="" value="" />
                  <label htmlFor="accAge" className="gpara">
                    I confirm that I am 21 years old and over
                  </label>
                </aside> */}
                <aside className="btnswrap">
                  <a href="javascript:;" className="btn btndefault disabled" id="ageRestrictionBtn" title="Ok" data-bs-dismiss="modal" onClick={this.addItemToCart}>
                    <span>Ok</span>
                  </a>
                </aside>
              </section>
            </section>
          </section>
        </section>
        {/* E.O.Modal Popup | Allow Alcoholic */}
        <section id="errorModal" className="common-popupCont errorCont modal fade" role="dialog" data-bs-keyboard="false" data-bs-backdrop="static">
          <section className="modal-dialog">
            <section className="modal-content">
              <section className="modal-body">
                <a href="javascript:;" className="modalClose" data-bs-dismiss="modal" title="Close">
                  Close
                </a>
                <h2>Error</h2>
                <p>
                  Sorry! Something went wrong. Please try
                  <br /> again later!
                </p>
                <aside className="btnswrap clearfix">
                  <a href="javascript:;" className="btn btndefault" data-bs-dismiss="modal" title="Ok">
                    <span>Ok</span>
                  </a>
                </aside>
              </section>
            </section>
          </section>
        </section>
        {/* E.O.Modal Popup | Error */}
        <section className="common-popup-modal">
          <section id="repeatItem" className="common-popupCont res-btmCont modal fade" role="dialog" data-bs-keyboard="false" data-bs-backdrop="static">
            <section className="modal-dialog">
              <section className="modal-content">
                <section className="modal-body">
                  <FontAwesomeIcon icon={faX} className="modalClose fontAwesomeClose" data-bs-dismiss="modal"></FontAwesomeIcon>
                  {/* <a href="javascript:;" className="modalClose" data-bs-dismiss="modal" title="Close">
                    Close
                  </a> */}
                  {/* <h2>Classic Popcorn</h2> */}
                  <h2 id="repeatItemTitle">
                    You made it your way!<p className="howAboutThisTime">How about this time?</p>
                  </h2>

                  <p className="repeatItemName">
                    {Object.keys(this.props.parentState.repeatItemData) !== 0 && this.props.parentState.repeatItemData.itemName ? this.props.parentState.repeatItemData.itemName : ""}
                  </p>
                  {(Object.keys(this.props.parentState.repeatItemData) !== 0 &&
                    this.props.parentState.repeatItemData.modifierGroups &&
                    this.props.parentState.repeatItemData.modifierGroups.length > 0) ||
                  (this.props.parentState.repeatItemData.smartModifiers && this.props.parentState.repeatItemData.smartModifiers.length > 0) ? (
                    <>
                      {/* <p className="gpara"> White chocolate chips, Milk chocolate chips, <br /> Popped popcorn plain </p>  */}
                      <p className="gpara" id="repeatItemModifiers">
                        {this.props.populateItemModifierItems(this.props.parentState.repeatItemData.modifierGroups, this.props.parentState.repeatItemData.smartModifiers)}
                        {this.props.populateItemSmartModifierItems(this.props.parentState.repeatItemData.smartModifiers)}
                      </p>
                    </>
                  ) : (
                    ""
                  )}

                  <aside className="btnswrap">
                    <a href="javascript:;" className="btn btnprimary" title="I'll Choose" data-bs-dismiss="modal" onClick={(event) => this.props.handleRepeatillChoose(event)}>
                      <span>Let me choose</span>
                    </a>
                    <a href="javascript:;" className="btn btndefault" title="Repeat" data-bs-dismiss="modal" onClick={(event) => this.props.handleRepeatPreviousSelection(event)}>
                      <span>Repeat, please</span>
                    </a>
                  </aside>
                </section>
              </section>
            </section>
          </section>
        </section>
        {/* E.O.Modal Popup | Repeat Item */}
        <section id="modalDeleteConfirmation" className="common-popupCont errorCont modal fade" role="dialog" data-bs-keyboard="false" data-bs-backdrop="static">
          <section className="modal-dialog">
            <section className="modal-content">
              <section className="modal-body">
                <h2>Alert</h2>
                <p>Are you sure you want to delete?</p>
                <aside className="btnswrap clearfix">
                  <a href="javascript:;" className="btn btndefault" title="Yes">
                    <span>Yes</span>
                  </a>
                  <a href="javascript:;" data-bs-dismiss="modal" className="btn btnprimary" title="No">
                    <span>No</span>
                  </a>
                </aside>
              </section>
            </section>
          </section>
        </section>
        {/* E.O.Modal Popup | Item Delete Confirmation */}
        <section className="common-popup-modal">
          <section id="locationreplaceItem" className="common-popupCont modal fade" role="dialog" data-bs-keyboard="false" data-bs-backdrop="static">
            <section className="modal-dialog">
              <section className="modal-content">
                <section className="modal-body">
                  <a href="javascript:;" className="modalClose" data-dismiss="modal" title="Close">
                    Close
                  </a>
                  <h2>Replace cart item?</h2>
                  <p>Your cart contains dishes from Brookfield, WI. Do you want to discard the selections and add dishes from Mountain View, CA.?</p>
                  <aside className="btnswrap">
                    <a href="javascript:;" className="btn btnprimary" data-dismiss="modal" title="Cancel">
                      <span>Cancel</span>
                    </a>
                    <a href="javascript:;" className="btn btndefault" data-bs-toggle="modal" data-bs-target="#errorModal" title="Yes">
                      <span>Yes</span>
                    </a>
                  </aside>
                </section>
              </section>
            </section>
          </section>
        </section>

        <section id="orderCancellation" className="modal fade" role="dialog" data-bs-keyboard="false" data-bs-backdrop="static">
          <section className="modal-dialog">
            <section className="modal-content">
              <section className="modal-body">
                {/* <section className="mbHead">
                  <a href="javascript:;" className="modalClose" data-bs-dismiss="modal" title="Close">
                    Close
                  </a>
                </section> */}
                <div className="modalBodyHeaderStripe">
                  <div className="orderCancellationImageDiv">
                    <img src={foodOrderCancel}></img>
                  </div>
                </div>
                <section className="mbBody">
                  <section className="mlFormWrap">
                    <aside className="mlForm">
                      <h2>
                        <span>Order</span>
                        Cancellation
                      </h2>
                      <section id="orderCancellationInitForm">
                        <aside className="mlfGroup">
                          <label htmlFor="fieldOrderId" className="form-label">
                            Enter your fnb order id you want to cancel
                          </label>
                          <input type="text" className="form-control" id="fieldOrderId" placeholder="Enter your order id" onChange={(e) => this.props.refundInitGetBookingId(e)} />
                          <p className="mlfError bookingIdError" id="errorInvlidBookingId" style={{display: "none"}}>
                            Invalid booking ID.
                          </p>
                        </aside>
                        <aside className="mlfAction btnswrap">
                          {Object.keys(this.props.parentState.refundInitBookingInfo).length !== 0 ? (
                            ""
                          ) : (
                            <a title="Close" className="btn btnsecondary" href="javascript:;" data-bs-dismiss="modal">
                              <span>Close</span>
                            </a>
                          )}
                          <a
                            title="Submit"
                            className={`btn btndefault ${this.props.parentState.refundInitBookingId == "" ? "disabled" : ""}`}
                            href="javascript:;"
                            onClick={() => this.props.refundInitGetOrderInfo()}
                            id="btnRefundBookingOkay"
                          >
                            <span>Submit</span>
                          </a>
                        </aside>
                      </section>
                    </aside>
                  </section>
                  <section className="refundInitOrderSummary" id="orderCancellationInitFnbSummary" style={{display: "none"}}>
                    <section className="orderBreakupWrap">
                      {/* <section className="fnbBreakup fnbPickup">
                        <aside className="fnbBreakupHead">
                          <img src={FnbPickUp} />
                          <h3>Picked-up by you</h3>
                        </aside>
                        <ul className="fnbBreakupBody">
                          <li>
                            <h4 className="fnbItemTitle">
                              Kettle Corn<span className="d-none"></span>
                            </h4>
                            <p className="fnbItemCount">1</p>
                            <p className="fnbItemPrice">$9.00</p>
                          </li>
                        </ul>
                      </section>
                      <section className="fnbBreakup fnbDeliveryinseat">
                        <aside className="fnbBreakupHead">
                          <img src={FnbDeliveryInSeat} />
                          <h3>Delivered to your seat </h3>
                        </aside>
                        <ul className="fnbBreakupBody">
                          <li>
                            <h4 className="fnbItemTitle">
                              Beef Sliders<span>Bread, Hawaiian Rolls(Add as Side), Parmesan Cheese(Remove), Bacon Jam(Add as Side), Provolone Cheese(Remove)</span>
                            </h4>
                            <p className="fnbItemCount">1</p>
                            <p className="fnbItemPrice">$9.00</p>
                          </li>
                        </ul>
                      </section> */}

                      {Object.keys(this.props.parentState.refundInitBookingInfo).length == 0 ? (
                        <>
                          <Skeleton duration={0.75} height={32} width={"75%"} style={{marginBottom: 25}} />
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
                            <li style={{display: "flex", marginTop: 10}}>
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
                            <ul className="fnbBreakupBody">
                              {this.props.parentState.refundInitBookingInfo.order_grouping.map((fnbItem) => {
                                return (
                                  <li>
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
                                    <p className="fnbItemPrice">${this.props.refundCalculateItemPrice(fnbItem).toFixed(2)}</p>
                                  </li>
                                );
                              })}
                              {/* <li>
                                <h4 className="fnbItemTitle">
                                  Kettle Corn<span className="d-none"></span>
                                </h4>
                                <p className="fnbItemCount">1</p>
                                <p className="fnbItemPrice">$9.00</p>
                              </li>
                              <li>
                                <h4 className="fnbItemTitle">
                                  Beef Sliders<span>Bread, Hawaiian Rolls(Add as Side), Parmesan Cheese(Remove), Bacon Jam(Add as Side), Provolone Cheese(Remove)</span>
                                </h4>
                                <p className="fnbItemCount">1</p>
                                <p className="fnbItemPrice">$9.00</p>
                              </li> */}
                            </ul>
                          </section>
                          <section className="taxTotalBreakups">
                            <ul>
                              <li className="fnbSubTotal">
                                <h4>Sub Total</h4>
                                <p>${this.props.parentState.refundSummarySubTotal}</p>
                              </li>
                              {this.props.parentState.refundSummaryTax != false ? (
                                <li className="fnbTax">
                                  <h4>Tax</h4>
                                  <p>${this.props.parentState.refundSummaryTax}</p>
                                </li>
                              ) : (
                                ""
                              )}

                              <li className="fnbGrandTotal">
                                <h4>Total</h4>
                                <p>{"$" + (Number(this.props.parentState.refundSummarySubTotal) + Number(this.props.parentState.refundSummaryTax)).toFixed(2)}</p>
                              </li>
                            </ul>
                          </section>
                          {/* <section className="taxTotalBreakups">
                            <ul>
                              <li className="fnbSubTotal">
                                <h4>Sub Total</h4>
                                <p>$17.48</p>
                              </li>

                              <li className="fnbTax">
                                <h4>Tax</h4>
                                <p>$0.78</p>
                              </li>

                              <li className="fnbGrandTotal">
                                <h4>Total</h4>
                                <p>$18.26</p>
                              </li>
                            </ul>
                          </section> */}
                          <section className="paymentInfo">
                            <h3>
                              <span>Payment Method</span>
                            </h3>
                            {/* <ul>
                              <li className="fnbSubTotal">
                                <h4>
                                  Credit / Debit card <span>ending 1111</span>
                                </h4>
                                <p>$18.26</p>
                              </li>
                            </ul> */}
                            {Object.keys(this.props.parentState.refundSummaryPaymentMethod).length === 0 ? (
                              <div>
                                <Skeleton height={32} duration={0.75} style={{marginBottom: 10}} />
                                <Skeleton height={32} duration={0.75} />
                              </div>
                            ) : (
                              <ul>
                                {this.props.parentState.refundSummaryPaymentMethod.map((item, index) => {
                                  if (item.type === null) {
                                    return null;
                                  }
                                  return (
                                    <li className="fnbSubtotal" key={index}>
                                      <h4>
                                        {this.props.refundPopulatePaymentType(item)}
                                        {/* {item.type} <span>ending {item.cardNumber.substr(item.cardNumber.length - 4)}</span> */}

                                        {item.type === constant.giftCardText ? (
                                          this.props.parentState.refundSummaryPaymentMethod.length === 1 ? (
                                            <span className="gfBalance">Balance after this transaction : ${item.balance.toFixed(2)}</span>
                                          ) : (
                                            <span className="gfBalance">Balance after this transaction : ${item.balance.toFixed(2)}</span>
                                          )
                                        ) : (
                                          // item.cardNumber
                                          ""
                                        )}
                                      </h4>
                                      <p>
                                        ${Number(item.amount).toFixed(2)} <span></span>
                                      </p>
                                    </li>
                                  );
                                })}
                              </ul>
                            )}
                          </section>
                        </>
                      )}
                    </section>
                    {Object.keys(this.props.parentState.refundInitBookingInfo).length == 0 ? (
                      ""
                    ) : (
                      <section class="btnswrap">
                        <a title="Close" class="btn btnsecondary" href="javascript:;" data-bs-dismiss="modal">
                          <span>Close</span>
                        </a>
                        <a
                          title="Cancel Order"
                          class="btn btndefault"
                          href="javascript:;"
                          onClick={() => this.props.cancelOrder(this.props.parentState.refundBookingOrderID)}
                          //data-bs-dismiss="modal"
                        >
                          <span>Cancel Order</span>
                        </a>
                      </section>
                    )}

                    {this.props.parentState.cancelOrderError != "" ? (
                      <p class="bookingIdError" id="cancelOrderError">
                        {this.props.parentState.cancelOrderError}
                      </p>
                    ) : (
                      ""
                    )}
                  </section>
                </section>
              </section>
            </section>
          </section>
        </section>
        {/* E.O.Modal Popup | Repeat Item */}
      </>
    );
  }
}

export default Footer;
