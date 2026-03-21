import {setGlobalOptions} from "firebase-functions/v2/options";

setGlobalOptions({
	region: "europe-west4",
});

import {createUser} from "./users/createUser";
import {resizeAvatar, resizeProjectImage} from "./storage";
import {createProject} from "./projects/createProject";
import {forceDeleteProject} from "./projects/forceDeleteProject";
import {purgeDeletedProjects} from "./projects/purgeDeletedProjects";
import {publishProject} from "./projects/publishProject";
import {unpublishProject} from "./projects/unpublishProject";

export {
	createUser,
	resizeAvatar,
	resizeProjectImage,
	createProject,
	forceDeleteProject,
	purgeDeletedProjects,
	publishProject,
	unpublishProject,
};
