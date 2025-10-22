import { APIClient } from "./api_helper";

import * as url from "./url_helper";

const api = new APIClient();

// Blogs
export const CeateContactus = (data:any) => api.create(url.CONTACTUS,data);
