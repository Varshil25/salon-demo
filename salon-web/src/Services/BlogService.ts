import { APIClient } from "./api_helper";

import * as url from "./url_helper";

const api = new APIClient();

// Blogs
export const GetBlogs = () => api.get(url.BLOG);


