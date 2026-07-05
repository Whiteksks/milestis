import {setGlobalOptions} from "firebase-functions/v2/options";

setGlobalOptions({
	region: "europe-west4",
});

import {createUser} from "./users/createUser";
import {deleteUserAccount, exportProjectContent, exportUserData} from "./users/account";
import {resizeAvatar, resizeProjectImage} from "./storage";
import {createProject} from "./projects/createProject";
import {forceDeleteProject} from "./projects/forceDeleteProject";
import {purgeDeletedProjects} from "./projects/purgeDeletedProjects";
import {unpublishProject} from "./projects/unpublishProject";
import {republishProject} from "./projects/republishProject";
import {publishProject} from "./projects/publish";
import {analyzeProject} from "./projects/publish/analyzeProject";
import {analyzeRepublish} from "./projects/publish/analyzeRepublish";
import {webhookPolar} from "./transactions/triggers/polar";

export {
	createUser,
	exportUserData,
	exportProjectContent,
	deleteUserAccount,
	resizeAvatar,
	resizeProjectImage,
	createProject,
	forceDeleteProject,
	purgeDeletedProjects,
	unpublishProject,
	republishProject,
	publishProject,
	analyzeProject,
	analyzeRepublish,
	webhookPolar,
};
