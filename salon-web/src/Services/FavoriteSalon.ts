import { APIClient } from "./api_helper";

import * as url from "./url_helper";

const api = new APIClient();

// FavoriteSalons-POST
export const CeateFavoriteSalon = (data:any) => api.create(url.POST_FAVORITE_SALON,data);

// FavoriteSalons-GET
export const GetFavoriteSalon = (queryParams:any) => api.get(url.POST_FAVORITE_SALON +`?${queryParams} `);
