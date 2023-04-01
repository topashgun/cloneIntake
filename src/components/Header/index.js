import React from "react";
import {NavLink, Link} from "react-router-dom";
import siteLogo from "../../assets/images/bg-sitelogo.png";
import siteLogoOld from "../../assets/images/bg-sitelogo_old_1.png";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCalendarDay, faClapperboard, faClock, faHouse, faLocationDot, faXmark} from "@fortawesome/free-solid-svg-icons";
class Header extends React.Component {
  constructor(props) {
    super(props);
  }

  populateLocations = (locationsData) => {
    ////////console.log("Header > populateLocations()");
    //////////console.log(Object.keys(this.props.bookingInfo).length);
    var locationsHTML = "";
    locationsHTML = locationsData.map((locationItem, index) => {
      if (locationItem.active) {
        // var cinemaLocation = this.formatLocationString(
        //   locationItem.cinemas_locations[0].city
        // );
        var cinemaLocation = locationItem.cinemas_attributes[0].name;
        //////////console.log("cinemaLocation: " + cinemaLocation);
        return (
          <li className={`${index == 0 ? "active" : ""}`} key={"location_" + index}>
            <a href="javascript:;" title={cinemaLocation} onClick={(e) => this.props.handleOnchangeLocationDropdown(e)} data-bs-toggle="modal" data-bs-target="#locationreplaceItem">
              {cinemaLocation}
            </a>
          </li>
        );
      }
    });
    return locationsHTML;
  };
  // formatLocationString = (locatioCity) => {
  //   ////////console.log("formatLocationString() > locatioCity: " + locatioCity);
  //   var cityAr = locatioCity.split(",");
  //   var cityName = cityAr[0];
  //   var cityCodeAr = cityAr[1].split(" ");
  //   var cityCode = cityCodeAr[1];
  //   var cinemaLocation = cityName + ", " + cityCode;
  //   return cinemaLocation;
  // };

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
  render() {
    //////////console.log("ASDF >>> this.props.bookingInfo: ");
    //////////console.log(this.props.bookingInfo);
    //////////console.log( "ASDF >>> this.props.bookingInfo length: " + Object.keys(this.props.bookingInfo).length );
    return (
      <header className="pageHeader">
        <section className="container">
          <section className="phInner">
            <figure
              className={`siteLogo ${this.props.parentState.bookingLocation.cinemaid == "8875" ? "old" : "new"}`}
              onClick={() =>
                (window.location.href =
                  this.props.parentState.debugLocationsURL != "" && this.props.parentState.debugLocationsCinemaIDs.length > 0
                    ? window.location.origin + this.props.parentState.debugLocationsURL
                    : window.location.origin)
              }
            >
              <img src={this.props.parentState.bookingLocation.cinemaid == "8875" ? siteLogoOld : siteLogo} alt="Showplace Icon Theatres" title="Showplace Icon Theatres" className="img-fluid" />
            </figure>
            <aside className="phiRight">
              {this.props.confirmBooking || this.props.pwPaymentflow || this.props.showHomeIcon ? (
                ""
              ) : (
                <section>
                  <p className="headerInformation">
                    <FontAwesomeIcon icon={faLocationDot} className="icon locationIcon"></FontAwesomeIcon>
                    <p>
                      {" "}
                      {Object.keys(this.props.parentState.normalBookingInfoSelected).length === 0
                        ? this.props.bookingInfo && Object.keys(this.props.bookingInfo).length !== 0
                          ? this.props.bookingInfo.cinema.cinemas_attributes[0].name
                          : ""
                        : this.props.parentState.normalBookingInfoSelected.locationName}
                    </p>
                  </p>
                  <p className="headerInformation">
                    <FontAwesomeIcon icon={faClapperboard} className="icon movieIcon"></FontAwesomeIcon>
                    <p>
                      {Object.keys(this.props.parentState.normalBookingInfoSelected).length === 0
                        ? this.props.bookingInfo && Object.keys(this.props.bookingInfo).length !== 0
                          ? Object.keys(this.props.bookingInfo.film).length !== 0 && this.props.bookingInfo.film.films_attributes && this.props.bookingInfo.film.films_attributes.length > 0
                            ? this.props.bookingInfo.film.films_attributes[0].title
                            : this.props.bookingInfo.film.title
                          : ""
                        : this.props.parentState.normalBookingInfoSelected.movie}
                    </p>
                  </p>
                  <p className="headerInformation">
                    <FontAwesomeIcon icon={faCalendarDay} className="icon timeIcon"></FontAwesomeIcon>
                    <p>
                      {Object.keys(this.props.parentState.normalBookingInfoSelected).length === 0
                        ? this.props.bookingInfo && Object.keys(this.props.bookingInfo).length !== 0
                          ? this.formatDate(this.props.bookingInfo.showtime)
                          : ""
                        : this.formatDate(this.props.parentState.normalBookingInfoSelected.date)}
                    </p>

                    <FontAwesomeIcon icon={faClock} className="icon timeIcon" style={{marginLeft: 10}}></FontAwesomeIcon>
                    <p>
                      {Object.keys(this.props.parentState.normalBookingInfoSelected).length === 0
                        ? this.props.bookingInfo && Object.keys(this.props.bookingInfo).length !== 0
                          ? this.formatTime(this.props.bookingInfo.showtime)
                          : ""
                        : this.formatTime(this.props.parentState.normalBookingInfoSelected.time)}
                    </p>
                  </p>
                </section>
              )}

              {this.props.pwPaymentflow && this.props.showHomeIcon === false ? (
                <a className="btnClose" title="Close" onClick={this.props.clearAllItemsInCart} style={{cursor: "pointer"}}>
                  <FontAwesomeIcon icon={faXmark}></FontAwesomeIcon>
                </a>
              ) : (
                ""
              )}
              {this.props.pwPaymentflow && this.props.showHomeIcon ? (
                <a
                  className="btnHome"
                  title="Home"
                  onClick={() =>
                    (window.location.href =
                      this.props.parentState.debugLocationsURL != "" && this.props.parentState.debugLocationsCinemaIDs.length > 0
                        ? window.location.origin + this.props.parentState.debugLocationsURL
                        : window.location.origin)
                  }
                  style={{cursor: "pointer"}}
                >
                  <FontAwesomeIcon icon={faHouse}></FontAwesomeIcon>
                </a>
              ) : (
                ""
              )}
              {this.props.showHomeIconInLandingpage ? (
                <a
                  className="btnHome"
                  title="Home"
                  onClick={() =>
                    (window.location.href =
                      this.props.parentState.debugLocationsURL != "" && this.props.parentState.debugLocationsCinemaIDs.length > 0
                        ? window.location.origin + this.props.parentState.debugLocationsURL
                        : window.location.origin)
                  }
                  style={{cursor: "pointer"}}
                >
                  <FontAwesomeIcon icon={faHouse}></FontAwesomeIcon>
                </a>
              ) : (
                ""
              )}
            </aside>
          </section>
        </section>
      </header>
    );
  }
}

export default Header;
