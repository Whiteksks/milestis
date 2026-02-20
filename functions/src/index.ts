import {setGlobalOptions} from "firebase-functions/v2/options";

import {createUser} from "./users/createUser";
import { webhookCloudPayments } from "./transactions/triggers/cloudpayments";
import { createPhotobook } from "./transactions/triggers/createPhotobook";
import { adminManualAdjustment } from "./transactions/triggers/adminManualAdjustment";
import { expireCreditsCron } from "./transactions/triggers/expireCreditsCron";

setGlobalOptions({
	region: "europe-west4",
});

export {createUser};
export { webhookCloudPayments, createPhotobook, adminManualAdjustment, expireCreditsCron };
