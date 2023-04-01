import React from "react";
// import LoaderSVG from "../../assets/images/loader.svg";
import {ReactComponent as LoaderSVG} from "../../assets/images/loader.svg";
class Loader extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <section className={`pageloader ${this.props.loaderToggle ? "show d-flex justify-content-center align-items-center" : "d-none"}`}>
        {/* <aside className="loader"></aside> */}
        {/* <img src={LoaderSVG} ></img> */}
        <LoaderSVG className="loaderClass"></LoaderSVG>
      </section>
    );
  }
}

export default Loader;
