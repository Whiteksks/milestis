import {setGlobalOptions} from "firebase-functions/v2/options";

setGlobalOptions({
	region: "europe-west4",
});

import {createUser} from "./users/createUser";
import {resizeAvatar, resizeProjectImage} from "./storage";
import {createProject} from "./projects/createProject";
import {forceDeleteProject} from "./projects/forceDeleteProject";
import {purgeDeletedProjects} from "./projects/purgeDeletedProjects";
import {unpublishProject} from "./projects/unpublishProject";
import {exportProject} from "./projects/export";
import {publishExportedProject} from "./projects/publishExportedProject";

export {
	createUser,
	resizeAvatar,
	resizeProjectImage,
	createProject,
	forceDeleteProject,
	purgeDeletedProjects,
	unpublishProject,
	exportProject,
	publishExportedProject,
};
