import React from "react";

import img500 from "../../assets/images/errorPage/500.svg";

var errorCode = "404";

class Error500 extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <section className="ss-errorcont">
        <aside className="ss-error-inner">
          <section className="container">
            <section className="error-500page">
              <figure className="error-logo">
                <img src={img500} className="img-responsive" alt="500" title="500" />
              </figure>
              <h2>505 INTERNAL SERVER ERROR</h2>
              <p>You have encountered a problem, Please try again.</p>
              <aside className="btnswrap">
                <p>Let's take you safely back</p>
                <a href="javascript:;" className="btn btndefault" title="Home" onClick={() => (window.location.href = window.location.origin)}>
                  <span>Home</span>
                </a>
              </aside>
            </section>
          </section>
        </aside>
      </section>
    );
  }
}

export default Error500;
