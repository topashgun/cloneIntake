import React from "react";

import img404 from "../../assets/images/errorPage/404.svg";

class Error404 extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <section className="ss-errorcont">
        <aside className="ss-error-inner">
          <section className="container">
            <section className="">
              <figure className="error-logo">
                <img src={img404} className="img-responsive" alt="404" title="404" />
              </figure>
              <h2>ERROR 404</h2>
              <p>
                Something went wrong... <span>We love to improve, but we can't find the page you're looking for.</span>
              </p>
              <aside className="btnswrap">
                <a href="javascript:;" className="btn btndefault" title="Go Home" onClick={() => (window.location.href = window.location.origin)}>
                  <span>Go Home</span>
                </a>
              </aside>
            </section>
          </section>
        </aside>
      </section>
    );
  }
}

export default Error404;
