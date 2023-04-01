import React from "react";
import jQuery from "jquery";
import Header from "../Header";
import Footer from "../Footer";
import Loader from "../Loader";
import ConfirmBooking from "../ConfirmBooking";
import Home from "../Home";

class Layout extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount = () => {
    //Window Load & Resize
    jQuery(window).on("load resize", function () {
      ////////console.log("Load & Resize");
      /* Footer - Sticky to bottom */
      if (jQuery(".pageFooter").length > 0) {
        //var pwHeight = jQuery('.pageWrapper').outerHeight(true);
        var pcHeight = jQuery(".pageContent").outerHeight(true);
        var dwHeight = jQuery(window).height();
        if (pcHeight < dwHeight) {
          jQuery(".pageWrapper").css("min-height", dwHeight);
          jQuery(".pageWrapper").addClass("pageFooterSticky");
          jQuery(".pageWrapper").addClass("pageFooterSticky");
        } else {
          jQuery(".pageWrapper").css("min-height", "");
          jQuery(".pageWrapper").removeClass("pageFooterSticky");
        }
      }
    });
  };

  render() {
    return <>{this.props.confirmBooking ? <ConfirmBooking handleLoader={this.props.handleLoader} /> : <Home handleLoader={this.props.handleLoader} />}</>;
  }
}

export default Layout;
