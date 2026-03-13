import api from "@/config/api";
import {
  GET_ASSET_DETAIL_FAILURE,
  GET_ASSET_DETAIL_REQUEST,
  GET_ASSET_DETAIL_SUCCESS,
  GET_ASSET_FAILURE,
  GET_ASSET_REQUEST,
  GET_ASSET_SUCCESS,
  GET_USER_ASSETS_FAILURE,
  GET_USER_ASSETS_REQUEST,
  GET_USER_ASSETS_SUCCESS,
} from "./ActionType";

export const getAssetById =
  ({ assetId, jwt }) =>
  async (dispatch) => {
    dispatch({ type: GET_ASSET_REQUEST });
    try {
      const response = await api.get(`/api/asset/${assetId}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      console.log("Assets----", response.data);
      dispatch({ type: GET_ASSET_SUCCESS, payload: response.data });

      return response.data;
    } catch (error) {
      dispatch({ type: GET_ASSET_FAILURE, payload: error.message });
    }
  };

export const getAssetDetails =
  ({ coinId, jwt }) =>
  async (dispatch) => {
    dispatch({ type: GET_ASSET_DETAIL_REQUEST });
    try {
      const response = await api.get(`/api/asset/coin/${coinId}/user`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      console.log("Asset Details----", response.data);
      dispatch({ type: GET_ASSET_DETAIL_SUCCESS, payload: response.data });

      return response.data;
    } catch (error) {
      dispatch({ type: GET_ASSET_DETAIL_FAILURE, payload: error.message });
    }
  };

export const getUserAssets = (jwt) => async (dispatch) => {
  dispatch({ type: GET_USER_ASSETS_REQUEST });
  try {
    const response = await api.get(`/api/asset`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    console.log("User Assets----", response.data);
    dispatch({ type: GET_USER_ASSETS_SUCCESS, payload: response.data });

    return response.data;
  } catch (error) {
    dispatch({ type: GET_USER_ASSETS_FAILURE, payload: error.message });
  }
};
