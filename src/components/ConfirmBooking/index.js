import React from "react";
import { NavLink, Link } from "react-router-dom";
import jQuery from "jquery";

class ConfirmBooking extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount = () => {
    this.props.handleLoader(true);
    var self = this;
    setTimeout(() => {
      var self = this;
      self.props.handleLoader(false);
    }, 500);
  };

  render() {
    return (
      <section className="pageContent">
        <section className="pcPanel">
          <section className="pcpBody">
            <section className="container">
              <section className="pcpbInner">
                <section className="pcpbiColswrap clearfix pcpFnbblock">
                  <section className="pcpbiCols pcpbiColfull">
                    <section className="pcpfnbConfirmbooking">
                      <section className="roundBoxshadowed">
                        <section className="pcpfnbcbInner">
                          <h1>Wonder Woman 1984</h1>
                          <p className="pcpfnbcbiLocation">
                            <span>Brookfield, Wl</span>
                          </p>
                          <p>
                            <span>20 June 2020</span>
                            <span>3:20pm</span>
                            <span>2 Seats</span>
                          </p>
                          <aside className="btnswrap">
                            <NavLink
                              //exact
                              to="/fandb"
                              className="btn btndefault"
                              title="Confirm booking"
                              //activeClassName="active"
                            >
                              <span>Confirm booking</span>
                            </NavLink>
                            <a
                              href="javascript:;"
                              className="btn btntext"
                              title="No, not my booking"
                            >
                              <span>No, not my booking</span>
                            </a>
                          </aside>
                        </section>
                      </section>
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

export default ConfirmBooking;
