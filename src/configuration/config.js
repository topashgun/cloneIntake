//dev url - https://apidevvista.muvicinemas.com/frontend/
//prod url - https://apiprod.muvicinemas.com/frontend/v1/

const environment = "prod"; //dev,prod
const constant = {
  baseUrl: environment == "prod" ? "https://injin.showplaceicon.com/" : "https://apidevshowplaceicon.influx.co.in/",
  username: environment == "prod" ? "fnbms@injin.com" : "showplaceicon.website@injin.com",
  password: environment == "prod" ? "8m#eGV*fJCeQgX/D7" : "u[iS{c[+&9/Ov[X",
  today_deals: true,
  static_promotions: true,
  login: true,
  cancelOrder: true,
  giftCardText: "Gift Card",
  locationsToShow: ["8146", "8863", "8857", "8859", "8875", "8877"],
};

//Locations & its cinemaid.
//Chicago => 8146 | Minneapolis => 8863 | Mountain View => 8859 | San Jose => 8857 | Secaucus Kerasotes => 8875 | Tysons => 8877
//locationsToShow: ["8146", "8863", "8859", "8857", "8875", "8877"]

export default constant;
