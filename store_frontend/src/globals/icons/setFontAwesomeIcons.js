import { library } from '@fortawesome/fontawesome-svg-core';

import {
  faLink,
  faCircleInfo,
  faEnvelopeOpenText,
  faHouseChimney,
  faUtensils,
} from '@fortawesome/free-solid-svg-icons';
import {
  faAnglesUp,
  faAnglesLeft,
  faAnglesRight,
  faAnglesDown,
  faDiagramProject,
} from '@fortawesome/free-solid-svg-icons';
import {
  faRightToBracket,
  faRightFromBracket,
  faIdBadge,
  faAddressBook,
  faHeart,
  faListCheck,
} from '@fortawesome/free-solid-svg-icons';
import {
  faFacebook,
  faGithub,
  faLinkedin,
  faTwitter,
  faWordpress,
  faYoutube,
  faGoogle,
} from '@fortawesome/free-brands-svg-icons';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
// it is set in the GlobalsProdvider
const setFontAwesomeIcons = () => {
  library.add(faLink, faCircleInfo, faEnvelopeOpenText, faHouseChimney, faUtensils);
  library.add(faAnglesUp, faAnglesLeft, faAnglesRight, faAnglesDown, faDiagramProject);
  library.add(faRightToBracket, faRightFromBracket, faIdBadge, faAddressBook, faHeart, faListCheck);
  library.add(faFacebook, faGithub, faLinkedin, faTwitter, faWordpress, faYoutube, faGoogle);
  library.add(faCartShopping);
};

export default setFontAwesomeIcons;
