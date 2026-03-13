package com.chirag.trading.service;

import com.chirag.trading.Model.Asset;
import com.chirag.trading.Model.Coin;
import com.chirag.trading.Model.User;
import com.chirag.trading.Repository.AssetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AssetServiceImpl implements AssetService{

    @Autowired
    private AssetRepository assetRepository;
    @Override
    public Asset createAsset(User user, Coin coin, double quantity) {
        Asset asset=new Asset();
        asset.setUser(user);
        asset.setCoin(coin);
        asset.setQuantity(quantity);
        asset.setBuyPrice(coin.getCurrentPrice().doubleValue());
        return assetRepository.save(asset);
    }

    @Override
    public Asset getAssetById(long assetId) throws Exception {
        return assetRepository.findById(assetId).orElseThrow(()->new Exception("Asset Not Found"));
    }

    @Override
    public Asset getAssetByUserIdAndId(long userId, Long assetId) {
        return null;
    }

    @Override
    public List<Asset> getUsersAssets(long userId) {
        return assetRepository.findByUserId(userId);
    }

    @Override
    public Asset updateAsset(long assetId, double quantity) throws Exception {
        Asset oldAsset=getAssetById(assetId);
        oldAsset.setQuantity(quantity+oldAsset.getQuantity());
        return assetRepository.save(oldAsset);
    }

    @Override
    public Asset findAssetByUserIdAndCoinId(Long userId, String coinId) {
        return assetRepository.findByUserIdAndCoinId(userId,coinId);
    }

    @Override
    public void deleteAsset(long assetId) {
        assetRepository.deleteById(assetId);

    }
}
