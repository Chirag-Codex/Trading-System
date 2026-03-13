import { Button } from "@/components/ui/button";
import React, { useEffect } from "react";
import AssetTable from "./AssetTable";
import StockChart from "./StockChart";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Cross1Icon, DotIcon } from "@radix-ui/react-icons";
import { MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDispatch, useSelector } from "react-redux";
import { getCoinList, getTop50CoinList } from "@/State/Coin/Action";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
function Home() {
  const [category, setCategory] = React.useState("all");
  const handleCategoryChange = (value) => {
    setCategory(value);
  };
  const { coin } = useSelector((store) => store);
  const [inputValue, setInputValue] = React.useState("");
  const [isBotRelease, setIsBotRelease] = React.useState(false);
  const handleBotRelease = () => {
    setIsBotRelease(!isBotRelease);
  };

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      console.log("User input:", inputValue);
    }
    setInputValue("");
  };
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getCoinList(1));
  }, []);
  useEffect(() => {
    if (category == "top50") {
      dispatch(getTop50CoinList());
    }
  }, [category, dispatch]);
  return (
    <div className="relative">
      <div className="lg:flex">
        <div className="lg:w-[50%] lg:border-r">
          <div className="flex items-center gap-5 p-5">
            <Button
              onClick={() => handleCategoryChange("all")}
              variant={category == "all" ? "default" : "outline"}
              className="rounded-full"
            >
              All
            </Button>
            <Button
              onClick={() => handleCategoryChange("top50")}
              variant={category == "top50" ? "default" : "outline"}
              className="rounded-full"
            >
              Top 50
            </Button>
            <Button
              onClick={() => handleCategoryChange("topGainers")}
              variant={category == "topGainers" ? "default" : "outline"}
              className="rounded-full"
            >
              Top Gainers
            </Button>
            <Button
              onClick={() => handleCategoryChange("topLosers")}
              variant={category == "topLosers" ? "default" : "outline"}
              className="rounded-full"
            >
              Top Losers
            </Button>
          </div>
          <AssetTable
            coin={category == "all" ? coin.coinList : coin.top50}
            category={category}
          />
          <div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>
                    2
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
        <div className="hidden lg:block lg:w-[50%] p-5">
          <StockChart coinId="bitcoin" />
          <div className="flex gap-5 items-center">
            <div>
              <Avatar>
                <AvatarImage
                  src={
                    "https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=023"
                  }
                />
              </Avatar>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p>BTC</p>
                <DotIcon className="text-gray-400" />
                <p className="text-gray-400">Bitcoin</p>
              </div>
              <div className="flex items-end gap-2">
                <p className="text-xl font-bold">5464</p>
                <p className="text-red-600">
                  <span>-1319049822.578</span>
                  <span>(-0.29803%)</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <section
        className="absolute bottom-5 right-5 z-40 flex flex-col
         justify-end items-end gap-2"
      >
        {isBotRelease && (
          <div
            className="rounded-md w-[20rem] md:w-[25rem] lg:w-[25rem]
            h-[70vh] bg-slate-900"
          >
            <div
              className="flex justify-between items-center
                border-b px-6 h-[12%]"
            >
              <p>Chat Bot</p>
              <Button onClick={handleBotRelease} variant="ghost" size="icon">
                <Cross1Icon />
              </Button>
            </div>
            <div
              className="h-[76%] flex flex-col overflow-y-auto gap-5
                px-5 py-2 scroll-container"
            >
              <div className="self-start pb-5 w-auto">
                <div
                  className="justify-end self-end px-5 py-2
                    rounded-md bg-slate-800 w-auto"
                >
                  <p>Hi,Chirag</p>
                  <p>you can ask crypto related any question</p>
                  <p>like price, market cap, etc...</p>
                </div>
              </div>
              {[1, 1, 1, 1, 1, 1, 1, 1].map((item, index) => (
                <div
                  key={index}
                  className={
                    index % 2 === 0
                      ? "self-end pb-5 w-auto"
                      : "self-start pb-5 w-auto"
                  }
                >
                  {index % 2 === 0 ? (
                    <div
                      className="justify-end self-end px-5 py-2
                    rounded-md bg-slate-800 w-auto"
                    >
                      <p>who are you</p>
                    </div>
                  ) : (
                    <div
                      className="justify-end self-end px-5 py-2
                    rounded-md bg-slate-800 w-auto"
                    >
                      <p>Hi, I am your trading assistant</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="h-[12%] border-t border-slate-700">
              <Input
                className="w-full h-full order-0 outline-none"
                placeholder="Type your message here..."
                onChange={handleChange}
                value={inputValue}
                onKeyPress={handleKeyPress}
              />
            </div>
          </div>
        )}
        <div className="relative w-[10rem] cursor-pointer group">
          <Button
            onClick={handleBotRelease}
            className="w-full h-[3rem] gap-2 items-center"
          >
            <MessageCircle
              size={80}
              className="fill-[#1e293b] -rotate-90 stroke-none
                    group-hover:fill-amber-100"
            />
            <span className="text-2xl">ChatBot</span>
          </Button>
        </div>
      </section>
    </div>
  );
}

export default Home;
