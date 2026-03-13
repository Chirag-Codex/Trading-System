import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  BookmarkFilledIcon,
  BookmarkIcon,
  DotIcon,
} from "@radix-ui/react-icons";
import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import TradingForm from "./TradingForm";
import StockChart from "../Home/StockChart";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchCoinDetails } from "@/State/Coin/Action";
import { addItemToWatchList, getUserWatchList } from "@/State/Watchlist/Action";
import { existInWatchlist } from "@/utils/existInWatchlist";
function StockDetails() {
  const {watchlist,coin}=useSelector(store=>store)
  const dispatch = useDispatch();
  const {coinId}=useParams()
  
  useEffect(()=>{
    dispatch(fetchCoinDetails({coinId,jwt:localStorage.getItem("jwt")}))
    dispatch(getUserWatchList(localStorage.getItem('jwt')))
  },[coinId])
  const handleAddToWatchlist=()=>{
    dispatch(addItemToWatchList({coinId: coin.coinDetails?.id,jwt:localStorage.getItem("jwt")}))
  }
  return (
    <div className="p-5 mt-5">
      <div className="flex justify-between">
        <div className="flex gap-5 items-center">
          <div>
            <Avatar>
              <AvatarImage src={coin.coinDetails?.image.large} />
            </Avatar>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p>{coin.coinDetails?.symbol?.toUpperCase()}</p>
              <DotIcon className="text-gray-400" />
              <p className="text-gray-400">{coin.coinDetails?.name}</p>
            </div>
            <div className="flex items-end gap-2">
              <p className="text-xl font-bold">${coin.coinDetails?.market_data.current_price.usd}</p>
              <p className="text-red-600">
                <span>{coin.coinDetails?.market_data.market_cap_change_24h}</span>
                <span>({coin.coinDetails?.market_data.market_cap_change_percentage_24h}%)</span>
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-5">
          <Button variant="outline" onClick={handleAddToWatchlist}>
            {existInWatchlist(watchlist.items||[],coin.coinDetails) ? (
              <BookmarkFilledIcon className="h-6 w-6" />
            ) : (
              <BookmarkIcon className="h-6 w-6" />
            )}
          </Button>
          <Dialog className="px-1">
            <DialogTrigger><Button size="lg" variant="outline">Trade</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>How much do you want to spend</DialogTitle>
              </DialogHeader>
              <TradingForm/>
            </DialogContent>
          </Dialog>
        </div>
      </div>
     <div className="mt-10">
         <StockChart coinId={coinId}/>
     </div>
    </div>
  );
}

export default StockDetails;
