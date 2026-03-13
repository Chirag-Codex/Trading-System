package com.chirag.trading.service;

import com.chirag.trading.Model.Asset;
import com.chirag.trading.Model.Coin;
import com.chirag.trading.Model.User;

import java.util.List;

public interface AssetService {

    Asset createAsset(User user, Coin coin, double quantity);

    Asset getAssetById(long assetId) throws Exception;

    Asset getAssetByUserIdAndId(long userId, Long assetId);

    List<Asset> getUsersAssets(long userId);

    Asset updateAsset(long assetId, double quantity) throws Exception;

    Asset findAssetByUserIdAndCoinId(Long userId, String coinId);

    void deleteAsset(long assetId);
}