import {setGlobalOptions} from "firebase-functions/v2/options";

setGlobalOptions({
	region: "europe-west4",
});

import {createUser} from "./users/createUser";
import {resizeAvatar, resizeProjectImage} from "./storage";
import {createProject} from "./projects/createProject";

export {createUser, resizeAvatar, resizeProjectImage, createProject};
