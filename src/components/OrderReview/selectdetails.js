import React, {useState} from "react";
import PropTypes from "prop-types";
import Swal from "sweetalert2";
import {withStyles} from "@material-ui/core/styles";
import SwipeableViews from "react-swipeable-views";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircle} from "@fortawesome/free-solid-svg-icons";
import moment from "moment-timezone";
import Skeleton from "react-loading-skeleton";
import constant from "../../configuration/config";
import closeButton from "../../assets/images/ic-modalClose16x16.png";
import iconXVipWhite from "../../assets/images/iconXVipWhite.png";
import iconXVipWhiteRed from "../../assets/images/iconXVipWhiteRed.png";
import iconXVipDark from "../../assets/images/iconXVipDark.png";

import iconXWhite from "../../assets/images/iconXWhite.png";
import iconXWhiteRed from "../../assets/images/iconXWhiteRed.png";
import iconXDark from "../../assets/images/iconXDark.png";
var datesSkeletonArray = ["22%", "24%", "25%", "23%", "25%", "22%", "26%", "21%", "23%", "21%", "23%", "25%"];
var moviesSkeletonArray = ["40%", "24%", "25%", "23%", "25%", "22%", "26%", "51%", "23%", "21%", "23%", "25%"];
var staticDatesArray = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var staticMonthsArray = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function TabContainer({children, dir, state, tabNum, updateSelectedData, showSweetAlert, tabName, selectBookingLocation}) {
  const [experience, setexperience] = useState(null);
  const [updatedFirstTime, setUpdatedFirstTime] = useState(false);
  const populateExperiences = () => {
    var experienceArray = [];
    experienceArray[0] = "All";
    // state.timeList.map((cinemas) => {
    //   cinemas.showtimes.map((stItem) => {
    //     if (state.selected.location == cinemas.cinemas_locations[0].city && state.selected.movie == stItem.film.films_attributes[0].title) {
    //       if (stItem.sessionsbyexperience && stItem.sessionsbyexperience.length > 0) {
    //         stItem.sessionsbyexperience.map((sbeItem) => {
    //           experienceArray.push(sbeItem.experiences.experienceid.code);
    //         });
    //       }
    //     }
    //   });
    // });
    state.timeList.map((tlItem) => {
      state.experienceList.map((experienceItem) => {
        var curExperienceIndex = experienceArray.findIndex((x) => x == experienceItem.code);
        if (state.selected.locationId == tlItem.cinemaid && state.selected.movieId == tlItem.filmid && tlItem.experienceid[0] == experienceItem.id && curExperienceIndex == -1) {
          experienceArray.push(experienceItem.code);
        }
      });
    });
    //console.log("experienceArray");
    //console.log(experienceArray);

    var orderArray = ["All", "VIP", "ICON-X", "Standard"];
    let uniqueExperienceArray = [...new Set(experienceArray)];
    uniqueExperienceArray.sort((a, b) => orderArray.indexOf(a) - orderArray.indexOf(b));
    if (experience != uniqueExperienceArray[0] && experience == null && updatedFirstTime == false) {
      setexperience(uniqueExperienceArray[0]);
      setUpdatedFirstTime(true);
    }
    var returnArray = [];
    uniqueExperienceArray.map((uniqueExperience) => {
      var expClass = "";
      if (uniqueExperience == "All") {
        expClass = "experienceAll";
      } else if (uniqueExperience == "VIP") {
        expClass = "experienceVIP";
      } else if (uniqueExperience == "ICON-X") {
        expClass = "experienceIconx";
      } else if (uniqueExperience == "Standard") {
        expClass = "experienceStandard";
      } else {
        expClass = "";
      }
      returnArray.push(
        <button
          className={`btn experienceButton ${expClass != "" ? expClass : ""}  ${experience == uniqueExperience ? "activeExperienceButton" : ""}`}
          type="button"
          onClick={() => {
            let selected = state.selected;
            selected.time = "";
            selected.experienceCode = "";
            selected.sessionId = "";
            updateSelectedData(selected);
            setexperience(uniqueExperience);
          }}
        >
          {expClass == "experienceVIP" ? (
            <img
              src={experience == uniqueExperience ? iconXVipDark : iconXVipWhite}
              onMouseOver={(e) => (e.currentTarget.src = experience == uniqueExperience ? iconXVipDark : iconXVipWhiteRed)}
              onMouseOut={(e) => (e.currentTarget.src = experience == uniqueExperience ? iconXVipDark : iconXVipWhiteRed)}
              alt={uniqueExperience}
              className="img-fluid"
            />
          ) : expClass == "experienceIconx" ? (
            <img
              src={experience == uniqueExperience ? iconXDark : iconXWhite}
              onMouseOver={(e) => (e.currentTarget.src = experience == uniqueExperience ? iconXDark : iconXWhiteRed)}
              onMouseOut={(e) => (e.currentTarget.src = experience == uniqueExperience ? iconXDark : iconXWhite)}
              alt={uniqueExperience}
              className="img-fluid"
            />
          ) : (
            uniqueExperience
          )}
        </button>
      );
    });
    return returnArray;
  };

  // const populateTimes = () => {
  //   return state.timeList.map((cinemas) => {
  //     return (
  //       <div className="row">
  //         <div className="stExperience col-12 col-sm-3 col-md-2">
  //           <div className="d-grid">{populateExperiences()}</div>
  //         </div>
  //         <div className="col-12 col-sm-9 col-md-10 alignItemStretchParent">
  //           {cinemas.showtimes.map((stItem) => {
  //             if (state.selected.location == cinemas.cinemas_locations[0].city && state.selected.movie == stItem.film.films_attributes[0].title) {
  //               return (
  //                 <>
  //                   {stItem.sessionsbyexperience && stItem.sessionsbyexperience.length > 0
  //                     ? stItem.sessionsbyexperience.map((sbeItem) => {
  //                         var experienceCode = sbeItem.experiences.experienceid.code;
  //                         return sbeItem.experiences.sessions.map((sessionItem) => {
  //                           return (
  //                             <button
  //                               type="button"
  //                               className={`alignItemStretch btn ${
  //                                 state.selected.time === sessionItem.showtime && state.selected.experienceCode == sbeItem.experiences.experienceid.code ? `btn-selected` : `btn-non-selected`
  //                               } ${sbeItem.experiences.experienceid.code == "VIP" ? "experienceIcon eiVIP" : sbeItem.experiences.experienceid.code == "ICON-X" ? "experienceIcon eiIconx" : ""} ${
  //                                 experience == "All" ? "" : experience == sbeItem.experiences.experienceid.code ? "" : "d-none"
  //                               }`}
  //                               onClick={() => {
  //                                 let selected = state.selected;
  //                                 selected.time = sessionItem.showtime;
  //                                 selected.experienceCode = sbeItem.experiences.experienceid.code;
  //                                 selected.sessionId = sessionItem.id;
  //                                 selected.screenNumber = sessionItem.screen[0].number;
  //                                 updateSelectedData(selected);
  //                               }}
  //                             >
  //                               {formatTime(sessionItem.showtime)}
  //                               {experienceCode == "VIP" ? (
  //                                 <>
  //                                   <img src={iconXVipDark} alt={sbeItem.experiences.experienceid.code} className="img-fluid defaultImage" />
  //                                   <img src={iconXVipWhite} alt={sbeItem.experiences.experienceid.code} className="img-fluid onHoverImage" />
  //                                 </>
  //                               ) : experienceCode == "ICON-X" ? (
  //                                 <>
  //                                   <img src={iconXDark} alt={sbeItem.experiences.experienceid.code} className="img-fluid defaultImage" />
  //                                   <img src={iconXWhite} alt={sbeItem.experiences.experienceid.code} className="img-fluid onHoverImage" />
  //                                 </>
  //                               ) : (
  //                                 ""
  //                               )}
  //                             </button>
  //                           );
  //                         });
  //                       })
  //                     : ""}
  //                 </>
  //               );
  //             }
  //           })}
  //         </div>
  //       </div>
  //     );
  //   });
  // };

  const populateTimes = () => {
    return (
      <div className="row">
        <div className="stExperience col-12 col-sm-3 col-md-2">
          <div className="d-grid">{populateExperiences()}</div>
        </div>
        <div className="col-12 col-sm-9 col-md-10 alignItemStretchParent">
          {state.timeList.map((tlItem) => {
            return (
              <>
                {state.experienceList.map((experienceItem) => {
                  var experienceCode = experienceItem.code;
                  //// console.log("experience: " + experience);
                  //// console.log("experienceItem.code: " + experienceItem.code);
                  //state.selected.locationId == tlItem.cinemaid
                  return state.selected.date == tlItem.showdate && state.selected.movieId == tlItem.filmid && tlItem.experienceid[0] == experienceItem.id ? (
                    <button
                      type="button"
                      className={`alignItemStretch movieTimeButton btn ${
                        state.selected.time === tlItem.showtime && state.selected.experienceCode == experienceItem.code ? `btn-selected` : `btn-non-selected`
                      } ${experienceItem.code == "VIP" ? "experienceIcon eiVIP" : experienceItem.code == "ICON-X" ? "experienceIcon eiIconx" : ""} ${
                        experience == "All" ? "" : experience == experienceItem.code ? "" : "d-none"
                      }`}
                      onClick={() => {
                        let selected = state.selected;
                        selected.time = tlItem.showtime;
                        selected.experienceCode = experienceItem.code;
                        selected.experienceId = experienceItem.id;
                        selected.sessionId = tlItem.id;
                        selected.screenNumber = tlItem.screens.length > 0 ? tlItem.screens[0].number : "";
                        updateSelectedData(selected);
                      }}
                    >
                      {formatTime(tlItem.showtime)}
                      {experienceCode == "VIP" ? (
                        <>
                          <img src={iconXVipDark} alt={experienceItem.code} className="img-fluid defaultImage" />
                          <img src={iconXVipWhite} alt={experienceItem.code} className="img-fluid onHoverImage" />
                        </>
                      ) : experienceCode == "ICON-X" ? (
                        <>
                          <img src={iconXDark} alt={experienceItem.code} className="img-fluid defaultImage" />
                          <img src={iconXWhite} alt={experienceItem.code} className="img-fluid onHoverImage" />
                        </>
                      ) : (
                        ""
                      )}
                    </button>
                  ) : (
                    ""
                  );
                })}
              </>
            );
          })}
        </div>
      </div>
    );
  };

  const formatTime = (time) => {
    var timeArray = time.split("T")[1].split(":");
    var hours = timeArray[0] > 12 ? timeArray[0] - 12 : timeArray[0];
    var minutes = timeArray[1];
    var meridian = timeArray[0] >= 12 ? "PM" : "AM";
    return hours + ":" + minutes + " " + meridian;
  };

  const formatDate = (date) => {
    var dateArray = date.split("T")[0].split("-");
    return staticMonthsArray[dateArray[1] - 1] + " " + parseInt(dateArray[2]);
  };

  const populateMovies = () => {
    var moviesList = [];
    state.movieList.map((movieItem) => {
      state.timeList.map((timeItem) => {
        var curMovieItemIndex = moviesList.findIndex((x) => x.id == movieItem.id && x.title == movieItem.films_attributes[0].title);
        if (state.selected.date == timeItem.showdate && movieItem.id == timeItem.filmid && curMovieItemIndex == -1) {
          var mObj = new Object();
          mObj.id = movieItem.id;
          mObj.title = movieItem.films_attributes[0].title;
          moviesList.push(mObj);
        }
      });
    });
    //console.log("moviesList");
    //console.log(moviesList);
    return moviesList.map((movieItem) => {
      return (
        <button
          type="button"
          className={`alignItemStretch btn ${state.selected.movie === movieItem.title && state.selected.movieId === movieItem.id ? `btn-selected` : `btn-non-selected`}`}
          onClick={() => {
            let selected = state.selected;
            selected.movieId = movieItem.id;
            selected.movie = movieItem.title;
            updateSelectedData(selected);
          }}
        >
          {movieItem.title}
        </button>
      );
    });
  };

  return (
    <Typography className={tabName} component="div" dir={dir}>
      <div className={`${state.value === tabNum ? "tab-data" : "tab-data1"}`}>
        {/* Location Tab */}
        {tabNum === 0 ? (
          <div className="alignItemStretchParent">
            {state.locationList.map((location, index) => {
              return constant.locationsToShow.findIndex((x) => x == location.cinemaid) != -1 ||
                (state.debugLocationsURL != "" && state.debugLocationsCinemaIDs.length > 0 && state.debugLocationsCinemaIDs.findIndex((x) => x == location.cinemaid) != -1) ? (
                <button
                  key={"tc_location_" + index + "_" + location.cinemas_locations[0].pid + "_" + location.cinemas_locations[0].id}
                  id={"tcLocation_" + location.cinemas_locations[0].pid + "_" + location.cinemas_locations[0].id}
                  type="button"
                  className={`btn alignItemStretch ${state.selected.location === location.cinemas_locations[0].city ? `btn-selected` : `btn-non-selected`}`}
                  onClick={() => {
                    let selected = state.selected;
                    selected.location = location.cinemas_locations[0].city;
                    selected.locationName = location.cinemas_attributes[0].name;
                    selected.locationId = location.cinemas_locations[0].pid;
                    ////selected.id = location.cinemas_locations[0].id; //ChangedOn22062022 - Change from location.cinemas_locations[0].id to location.id
                    selected.id = location.id;
                    selectBookingLocation(location);
                    updateSelectedData(selected);
                  }}
                >
                  {location.cinemas_attributes[0].name}
                </button>
              ) : (
                ""
              );
            })}
          </div>
        ) : null}
        {/* Date Tab */}
        {tabNum === 1 ? (
          state.dateList.length == 0 ? (
            <div className="alignItemStretchParent">
              {datesSkeletonArray.map((dateSkeleton) => {
                return (
                  <button type="button" className={`alignItemStretch btn btn-non-selected DateButtonSkeleton`} style={{width: dateSkeleton}}>
                    <Skeleton duration={0.75} style={{height: 40}} />
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="alignItemStretchParent">
              {state.dateList.slice(0, 10).map((date) => {
                return (
                  <button
                    type="button"
                    className={`alignItemStretch btn ${state.selected.date === date.groupValue ? `btn-selected` : `btn-non-selected`}`}
                    onClick={() => {
                      let selected = state.selected;
                      selected.date = date.groupValue;
                      updateSelectedData(selected);
                    }}
                  >
                    {formatDate(date.groupValue)}
                  </button>
                );
              })}

              <button
                type="button"
                className={`alignItemStretch btn btn-selected`}
                data-bs-toggle="modal"
                data-bs-target="#moreDatesCalendarModal"
                onClick={() => showSweetAlert(state.dateList.slice(10, state.dateList.length))}
              >
                More
              </button>
            </div>
          )
        ) : null}
        {/* Movie Tab */}
        {tabNum === 2 ? (
          state.movieList.length == 0 ? (
            <div className="alignItemStretchParent">
              {moviesSkeletonArray.map((dateSkeleton) => {
                return (
                  <button type="button" className={`alignItemStretch btn btn-non-selected DateButtonSkeleton`} style={{width: dateSkeleton}}>
                    <Skeleton duration={0.75} style={{height: 40}} />
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="alignItemStretchParent">
              {/* {state.movieList.map((cinemas) => {
                return (
                  <>
                    {cinemas.showtimes.map((stItem) => {
                      if (state.selected.location == cinemas.cinemas_locations[0].city) {
                        return (
                          <button
                            type="button"
                            className={`alignItemStretch btn ${state.selected.movie === stItem.film.films_attributes[0].title ? `btn-selected` : `btn-non-selected`}`}
                            onClick={() => {
                              let selected = state.selected;
                              selected.movie = stItem.film.films_attributes[0].title;
                              updateSelectedData(selected);
                            }}
                          >
                            {stItem.film.films_attributes[0].title}
                          </button>
                        );
                      }
                    })}
                  </>
                );
              })} */}
              {populateMovies()}
            </div>
          )
        ) : null}
        {/* Time Tab */}
        {tabNum === 3 ? populateTimes() : null}
      </div>
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
  dir: PropTypes.string.isRequired,
};

const styles = (theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: 500,
  },
});

class Selectdetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      locationList: [],
      dateList: [],
      movieList: [],
      timeList: [],
      experienceList: [],
      moreDatesArray: [],
      //deliveryList: [],
      selected: {
        location: "",
        locationId: "",
        date: "",
        movie: "",
        movieId: "",
        time: "",
        experienceCode: "", //this.props.parentState.movies > experienceList > code
        experienceId: "",
        sessionId: "", //this.props.parentState.movies > showTimes > sessionid
        //delivery: "",
      },
      maxTabOpened: 0,
      debugLocationsURL: "",
      debugLocationsCinemaIDs: [],
    };
  }

  handleChange = (event, value) => {
    ////////console.log("selectdetails > handleChange()");
    this.setState({value});
  };

  handleChangeIndex = (index) => {
    ////////console.log("selectdetails > handleChangeIndex()");
    this.setState({value: index});
  };

  updateSelectedData = (selected) => {
    let value = this.state.value;
    let maxTabOpened = this.state.maxTabOpened;
    if (value < 3) {
      value += 1;
    }
    if (value > maxTabOpened) {
      maxTabOpened = value;
    }
    if (value <= 1) {
      selected.date = "";
      selected.movie = "";
      selected.time = "";
      selected.sessionId = "";
      this.setState(
        {
          selected,
          value,
          maxTabOpened,
          dateList: [],
          movieList: [],
          timeList: [],
        },
        () => {
          this.props.getDates(selected.locationId);
        }
      );
    } else if (value == 2 && this.state.value < 2) {
      selected.movie = "";
      selected.time = "";
      selected.sessionId = "";
      this.setState(
        {
          selected,
          value,
          maxTabOpened,
          movieList: [],
          timeList: [],
        },
        () => {
          this.props.getSessionByExperience(selected.locationId, selected.date);
        }
      );
    } else if (value == 3 && this.state.value < 3) {
      selected.time = "";
      selected.sessionId = "";
      this.setState({selected, value, maxTabOpened, timeList: []});
    } else {
      this.setState({selected, value, maxTabOpened});
    }
    //this.setState({ selected, value, maxTabOpened });
    //this.setState({ movieList: [], selected, value, maxTabOpened });
  };

  componentDidUpdate = () => {
    ////////console.log("selectdetails > componentDidUpdate()");
    //Location List.
    if (this.state.locationList.length <= 0 && this.props.locations && this.props.locations.length > 0) {
      this.setState({locationList: this.props.locations});
    }

    //Date List.
    if (this.state.dateList.length <= 0 && this.props.dates && this.props.dates.length > 0) {
      this.setState({dateList: this.props.dates});
    } else if (this.props.dates.length == 0 && this.state.dateList.length != 0) {
      this.setState({dateList: []});
    }

    //Movies List.
    if (this.state.movieList.length <= 0 && this.props.movies && this.props.movies.length > 0) {
      this.setState({movieList: this.props.movies[0].filmList}, () => {
        this.props.setMovieListFlag(false);
      });
    } else if (this.props.updateMovieListFlag) {
      this.setState({movieList: this.props.movies[0].filmList, timeList: this.props.movies[0].showTimes, experienceList: this.props.movies[0].experienceList}, () => {
        this.props.setMovieListFlag(false);
      });
    } else if (this.props.movies && this.props.movies.length == 0 && this.state.movieList.length != 0) {
      this.setState({movieList: []});
    }

    //Time List.
    if (this.state.timeList.length <= 0 && this.props.movies && this.props.movies.length > 0) {
      this.setState({timeList: this.props.movies[0].showTimes});
    } else if (this.props.movies && this.props.movies.length == 0 && this.state.timeList.length != 0) {
      this.setState({timeList: []});
    }

    //Experiences List.
    if (this.state.experienceList.length <= 0 && this.props.movies && this.props.movies.length > 0) {
      this.setState({experienceList: this.props.movies[0].experienceList});
    } else if (this.props.movies && this.props.movies.length == 0 && this.state.experienceList.length != 0) {
      this.setState({experienceList: []});
    }

    //Booking using bookingId.
    if (
      Object.keys(this.props.parentState.bookingLocation).length !== 0 &&
      this.props.parentState.bookingLocation.cinemas_locations[0].city != this.state.selected.location &&
      this.props.parentState.toggleWithoutBookingId
    ) {
      this.props.setToggleWithoutBookingId(false);
      //// //this.props.parentState.bookingLocation.cinemaId!=this.state.selected.locationId
      //// let selected = this.state.selected;
      //// selected.location = this.props.parentState.bookingLocation.cinemas_locations[0].city;
      //// //selected.location = this.props.parentState.bookingLocation.cinemas_locations[0].id;
      //// selected.location = this.props.parentState.bookingLocation.cinemas_locations[0].pid;
      //// //this.updateSelectedData(selected);
      var locationElement = document.getElementById(
        "tcLocation_" + this.props.parentState.bookingLocation.cinemas_locations[0].pid + "_" + this.props.parentState.bookingLocation.cinemas_locations[0].id
      );
      //// //////////console.log(locationElement);
      //// setTimeout(() => {
      ////   locationElement.click();
      //// }, 200);
      locationElement.click();
    }

    //debugLocationsURL & debugLocationsCinemaIDs,
    if (this.props.parentState.debugLocationsURL != "" && this.props.parentState.debugLocationsCinemaIDs.length > 0 && this.state.debugLocationsURL != this.props.parentState.debugLocationsURL) {
      this.setState({debugLocationsURL: this.props.parentState.debugLocationsURL, debugLocationsCinemaIDs: this.props.parentState.debugLocationsCinemaIDs});
    }
  };

  showSweetAlert = (dates) => {
    ////////console.log("selectdetails > showSweetAlert()");
    var Datesrray = [];

    dates.map((date) => {
      var dateObject = new Object();
      dateObject.dateToShow = moment(date.groupValue).format("dddd:MMMM:D");
      dateObject.dateToClick = date.groupValue;
      dateObject.date = moment(date.groupValue).format("D");
      Datesrray.push(dateObject);
    });
    this.setState({
      moreDatesArray: Datesrray,
    });

    //Swal.fire({title: "Are you sure?", html: "", type: "warning", showConfirmButton: false, showCancelButton: false});
  };

  populateMonths = () => {
    var monthsArray = [];
    if (this.state.moreDatesArray.length != 0) {
      this.state.moreDatesArray.map((moreDate, index) => {
        monthsArray.push(moreDate.dateToShow.split(":")[1]);
      });
    }
    let uniqueMonths = [...new Set(monthsArray)].splice(0, 2); // to show only 2 months
    monthsArray = [];
    uniqueMonths.map((month) => {
      monthsArray.push(
        <div className="col-12 p-0 wholeMonthDiv">
          <div className="monthAlert">{month}</div>
          <div className="daysArray">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>
          <div className="moreDateArray">{this.populateMoreDates(month)}</div>
        </div>
      );
    });
    return monthsArray;
  };

  populateMoreDates = (populateMoreDatesForMonth) => {
    var getDatesForThisMonth = [];
    this.state.moreDatesArray.map((moreDate) => {
      if (moreDate.dateToShow.split(":")[1] == populateMoreDatesForMonth) {
        getDatesForThisMonth.push(moreDate);
      }
    });

    //console.log("getDatesForThisMonth -----------");
    //console.log(getDatesForThisMonth);

    for (var i = 0; i < getDatesForThisMonth.length - 1; i++) {
      var getCurrentDate = getDatesForThisMonth[i].dateToShow.split(":")[2];
      var getNextDate = getDatesForThisMonth[i + 1].dateToShow.split(":")[2];
      //console.log(getCurrentDate + " : " + getNextDate);
    }
    //console.log("---------------------");
    //     getDatesForThisMonth.map((date, index) => {
    //       if (index + 1 != getDatesForThisMonth.length){
    // var getCurrentDate = date.dateToShow.split(":")[2];
    // var getCurrentDate = date.dateToShow.split(":")[2];
    //       }
    //     });

    var returnDateArray = [];
    var index = staticDatesArray.indexOf(getDatesForThisMonth[0].dateToShow.split(":")[0]);
    for (var i = 0; i < index; i++) {
      returnDateArray.push(<div className="emptyDate"></div>);
    }

    var maxDate = Math.max.apply(
      Math,
      getDatesForThisMonth.map(function (o) {
        return o.date;
      })
    );

    for (var i = 0; i < getDatesForThisMonth.length; i++) {
      var curDateToClick = getDatesForThisMonth[i].dateToClick;
      returnDateArray.push(
        <div
          className="moreDate"
          onClick={() => {
            let selected = this.state.selected;
            //selected.date = getDatesForThisMonth[i].dateToClick;
            selected.date = curDateToClick;
            this.updateSelectedData(selected);
          }}
          data-bs-dismiss="modal"
          aria-label="Close"
        >
          {getDatesForThisMonth[i].dateToShow.split(":")[2]}
        </div>
      );
      if (getDatesForThisMonth.length - 1 != i) {
        var currentDate = getDatesForThisMonth[i].date;
        var nextDate = getDatesForThisMonth[i + 1].date;
        var difference = nextDate - currentDate;
        for (var j = 0; j < difference - 1; j++) {
          returnDateArray.push(
            <div className="emptyDate">
              <FontAwesomeIcon className="inbetweenDateDot" icon={faCircle}></FontAwesomeIcon>
            </div>
          );
        }
      }
    }
    // getDatesForThisMonth.map((moreDate) => {
    //   returnDateArray.push(
    //     <div
    //       className="moreDate"
    //       onClick={() => {
    //         let selected = this.state.selected;
    //         selected.date = moreDate.dateToClick;
    //         this.updateSelectedData(selected);
    //       }}
    //       data-bs-dismiss="modal"
    //       aria-label="Close"
    //     >
    //       {moreDate.dateToShow.split(":")[2]}
    //     </div>
    //   );
    // });
    return returnDateArray;
  };

  populateDate = (showDate) => {
    ////////console.log("OrderReview > populateDate()");
    //// Days as staticDatesArray
    //// months as staticMonthsArray
    var actualShowDate = showDate.split("T")[0].split("-");
    var date = actualShowDate[2];
    //var month = months[actualShowDate[1] - 1];
    var month = staticMonthsArray[actualShowDate[1] - 1];
    var year = actualShowDate[0];
    var day = new Date(`${date}-${month}-${year}`).getDay();
    //return Days[day] + ", " + month + " " + date;
    return staticDatesArray[day] + ", " + month + " " + date;
  };

  render() {
    const {theme} = this.props;
    const {selected} = this.state;

    return (
      <div className="row">
        <div className="col-12">
          <div className="tsdSelection">
            <h2 className={`${selected.location ? "d-none" : ""}`}>When are you coming?</h2>
            {/* On Tuesday, February 1, you are watching The Gentleman at 06:15PM. */}
            <p className={`${selected.location == false ? "d-none" : ""}`}>
              {selected.location ? (
                <span>
                  At&nbsp;<b>{selected.locationName}</b>
                </span>
              ) : null}
              {selected.date ? (
                <span>
                  , On&nbsp;
                  {/* <b>{moment(selected.date).format("dddd, MMMM D")}</b> */}
                  <b>{this.populateDate(selected.date)}</b>
                </span>
              ) : null}
              {selected.movie ? (
                <span>
                  , you're watching&nbsp;<b>{selected.movie}&nbsp;</b>
                </span>
              ) : (
                ""
              )}
              {selected.time ? (
                <span>
                  at&nbsp;
                  <b>{this.props.formatTime(selected.time)}</b>
                </span>
              ) : (
                ""
              )}
            </p>
            {selected.date && selected.movie && selected.time ? (
              <aside className="btnswrap d-none d-lg-block">
                <a href="javascript:;" className="btn btndefault" onClick={() => this.props.handleSelectDetailsProceed(this.state.selected)}>
                  Proceed
                </a>
              </aside>
            ) : (
              ""
            )}
            <aside className="btnswrap btnswrapStickyBottom d-block d-lg-none">
              <a
                href="javascript:;"
                className={`${selected.date && selected.movie && selected.time ? "btn btndefault" : "btn btndefault disabled"}`}
                onClick={() => this.props.handleSelectDetailsProceed(this.state.selected)}
              >
                Proceed
              </a>
            </aside>
          </div>
        </div>
        {/* Tab view  */}
        <div className="tsdTabs col-12">
          <section className="roundBoxshadowed">
            <div className="container-margin1">
              <AppBar position="static" color="default">
                <Tabs value={this.state.value} onChange={this.handleChange} indicatorColor="primary" textColor="primary" variant="fullWidth">
                  <Tab label="Location" key={0} />
                  <Tab label="Date" key={1} disabled={!(this.state.maxTabOpened >= 1)} className={`${!(this.state.maxTabOpened >= 1) ? "tab-bg" : ""}`} />
                  <Tab label="Movie" key={2} disabled={!(this.state.maxTabOpened >= 2)} className={`${!(this.state.maxTabOpened >= 2) ? "tab-bg" : ""}`} />
                  <Tab label="Time" key={3} disabled={!(this.state.maxTabOpened >= 3)} className={`${!(this.state.maxTabOpened >= 3) ? "tab-bg" : ""}`} />
                  {/* <Tab
                  label="Delivery"
                  key={3}
                  disabled={!(this.state.maxTabOpened >= 3)}
                  className={`${
                    !(this.state.maxTabOpened >= 3) ? "tab-bg" : ""
                  }`}
                /> */}
                </Tabs>
              </AppBar>
              {/* Tab Content */}
              <SwipeableViews axis={theme.direction === "rtl" ? "x-reverse" : "x"} index={this.state.value} onChangeIndex={this.handleChangeIndex}>
                <TabContainer
                  dir={theme.direction}
                  state={this.state}
                  tabNum={0}
                  updateSelectedData={this.updateSelectedData}
                  key={0}
                  showSweetAlert={this.showSweetAlert}
                  tabName={"tabContentLocation"}
                  selectBookingLocation={this.props.selectBookingLocation}
                ></TabContainer>
                <TabContainer
                  dir={theme.direction}
                  state={this.state}
                  tabNum={1}
                  updateSelectedData={this.updateSelectedData}
                  key={1}
                  showSweetAlert={this.showSweetAlert}
                  tabName={"tabContentDate"}
                ></TabContainer>
                <TabContainer
                  dir={theme.direction}
                  state={this.state}
                  tabNum={2}
                  updateSelectedData={this.updateSelectedData}
                  key={2}
                  showSweetAlert={this.showSweetAlert}
                  tabName={"tabContentMovie"}
                ></TabContainer>
                <TabContainer
                  dir={theme.direction}
                  state={this.state}
                  tabNum={3}
                  updateSelectedData={this.updateSelectedData}
                  key={3}
                  showSweetAlert={this.showSweetAlert}
                  tabName={"tabContentShowtime"}
                ></TabContainer>
                {/* <TabContainer
                dir={theme.direction}
                state={this.state}
                tabNum={3}
                updateSelectedData={this.updateSelectedData}
                key={3}
              ></TabContainer> */}
              </SwipeableViews>
            </div>
          </section>
        </div>

        <div className="modal fade" id="moreDatesCalendarModal" tabIndex="-1" aria-labelledby="moreDatesCalendarModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content" style={{background: "transparent", border: "none"}}>
              <div className="modal-body p-0">
                <div className="col-12 d-flex justify-content-center">
                  <button type="button" className="btn moreCalendarCloseButton" data-bs-dismiss="modal">
                    <img src={closeButton} className=""></img>
                  </button>
                </div>
                <div className="col-12" id="moreCalenDar">
                  <div className="row moreCalendarRow">{this.populateMonths()}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Selectdetails.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, {withTheme: true})(Selectdetails);
