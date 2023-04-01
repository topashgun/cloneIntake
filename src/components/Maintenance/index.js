import React from "react";

import {FaFacebookF, FaTwitter, FaInstagram, FaYoutube} from "react-icons/fa";

import imgMaintenance from "../../assets/images/maintenancePage/maintenance.svg";
import iconFacebook from "../../assets/images/maintenancePage/ic-FB.svg";
import iconTwitter from "../../assets/images/maintenancePage/ic-TW.svg";
import iconInstagram from "../../assets/images/maintenancePage/ic-IG.svg";
import iconYoutube from "../../assets/images/maintenancePage/ic-YT.svg";
import iconTiktok from "../../assets/images/maintenancePage/ic-TK.svg";

class Maintenance extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <section className="ss-errorcont">
        <aside className="ss-error-inner">
          <section className="container">
            <section className="error-500page maintanence-page">
              <figure className="error-logo">
                <img src={imgMaintenance} className="img-responsive" alt="Maintenance" title="Maintenance" />
              </figure>
              <h2>Sorry! please bear with us!</h2>
              <p>We're working on enhancing your online experience.</p>

              <aside className="social-blk">
                <p>Connect with us</p>
                {/*<ul>
                   <li className="fb">
                    <a href="javascript:;" target="_blank" title="Facebook">
                      &nbsp;
                    </a>
                  </li>
                  <li className="tw">
                    <a href="javascript:;" target="_blank" title="Twitter">
                      &nbsp;
                    </a>
                  </li>

                  <li className="igm">
                    <a href="javascript:;" target="_blank" title="Instagram">
                      &nbsp;
                    </a>
                  </li>
                  <li className="ytube">
                    <a href="javascript:;" target="_blank" title="Youtube">
                      &nbsp;
                    </a>
                  </li>
                </ul> */}
                {/* <ul className="iconsFontAwesome">
                  <li className="iconFacebook">
                    <a href="javascript::" target="_blank" title="Facebbok">
                      <FaFacebookF />
                    </a>
                  </li>
                  <li className="iconTwitter">
                    <a href="javascript::" target="_blank" title="Twitter">
                      <FaTwitter />
                    </a>
                  </li>
                  <li className="iconInstagram">
                    <a href="javascript::" target="_blank" title="Instagram">
                      <FaInstagram />
                    </a>
                  </li>
                  <li className="iconYoutube">
                    <a href="javascript::" target="_blank" title="Youtube">
                      <FaYoutube />
                    </a>
                  </li>
                  <li className="iconTiktok">
                    <a href="javascript::" target="_blank" title="Youtube">
                      <FaYoutube />
                    </a>
                  </li>
                </ul> */}
                <ul className="iconsAsSVG">
                  <li className="iconFacebook d-none">
                    <a href="javascript:;" target="_blank" title="Facebbok">
                      <img src={iconFacebook} alt="Facebook" className="img-fluid" />
                    </a>
                  </li>
                  <li className="iconTwitter">
                    <a href="https://twitter.com/ShowPlaceICON" target="_blank" title="Twitter">
                      <img src={iconTwitter} alt="Twitter" className="img-fluid" />
                    </a>
                  </li>
                  <li className="iconInstagram">
                    <a href="https://www.instagram.com/showplaceicon/" target="_blank" title="Instagram">
                      <img src={iconInstagram} alt="Instagram" className="img-fluid" />
                    </a>
                  </li>
                  <li className="iconYoutube d-none">
                    <a href="javascript:;" target="_blank" title="YouTube">
                      <img src={iconYoutube} alt="YouTube" className="img-fluid" />
                    </a>
                  </li>
                  <li className="iconTiktok">
                    <a href="https://www.tiktok.com/@showplaceicontheatres" target="_blank" title="TikTok">
                      <img src={iconTiktok} alt="TikTok" className="img-fluid" />
                    </a>
                  </li>
                </ul>
              </aside>
            </section>
          </section>
        </aside>
      </section>
    );
  }
}

export default Maintenance;
