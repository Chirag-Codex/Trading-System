
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
import axios from "axios";

function Home() {
  const [category, setCategory] = React.useState("all");
  const [response, setResponse] = React.useState([]); 
  const [loading, setLoading] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const [isBotRelease, setIsBotRelease] = React.useState(false);

  const { coin } = useSelector((store) => store);
  const dispatch = useDispatch();

  const handleCategoryChange = (value) => {
    setCategory(value);
  };

  const handleFetchCoinDetails = async (prompt) => {
    setLoading(true);
    try {
      const { data } = await axios.post("https://faithful-youth-production.up.railway.app/ai/chat", {
        prompt,
      });

      const userMessage = { message: prompt, role: "user" };
      const botMessage = { message: data.message || data.response, role: "model" };

      setResponse((prev) => [...prev, userMessage, botMessage]);
    } catch (error) {
      console.error("Chat Error:", error);
    }
    setLoading(false);
  };

  const handleBotRelease = () => {
    setIsBotRelease(!isBotRelease);
  };

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    handleFetchCoinDetails(inputValue);
    setInputValue(""); 
  };

  useEffect(() => {
    dispatch(getCoinList(1));
  }, [dispatch]);

  useEffect(() => {
    if (category === "top50") {
      dispatch(getTop50CoinList());
    }
  }, [category, dispatch]);

  return (
    <div className="relative">
      <div className="lg:flex">
        <div className="lg:w-[50%] lg:border-r">
          <div className="flex items-center gap-5 p-5">
            {["all", "top50", "topGainers", "topLosers"].map((cat) => (
              <Button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                variant={category === cat ? "default" : "outline"}
                className="rounded-full capitalize"
              >
                {cat.replace(/([A-Z])/g, ' $1')}
              </Button>
            ))}
          </div>
          <AssetTable
            coin={category === "all" ? coin.coinList : coin.top50}
            category={category}
          />
          <div className="p-5">
            <Pagination>
              <PaginationContent>
                <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
                <PaginationItem><PaginationLink href="#" isActive>1</PaginationLink></PaginationItem>
                <PaginationItem><PaginationNext href="#" /></PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>

        <div className="hidden lg:block lg:w-[50%] p-5">
          <StockChart coinId="bitcoin" />
          <div className="flex gap-5 items-center mt-5">
            <Avatar>
              <AvatarImage src="https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=023" />
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-bold">BTC</p>
                <DotIcon className="text-gray-400" />
                <p className="text-gray-400">Bitcoin</p>
              </div>
              <p className="text-xl font-bold">$54,640</p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Chat Bot Section */}
      <section className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2">
        {isBotRelease && (
          <div className="rounded-md w-[20rem] md:w-[25rem] h-[70vh] bg-slate-900 border border-slate-700 flex flex-col">
            <div className="flex justify-between items-center border-b border-slate-700 px-6 h-[12%]">
              <p className="font-semibold">Crypto AI Assistant</p>
              <Button onClick={handleBotRelease} variant="ghost" size="icon">
                <Cross1Icon />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4 scroll-container">
              {/* Default Welcome Message */}
              <div className="self-start bg-slate-800 p-3 rounded-lg max-w-[80%]">
                <p className="text-sm">Hi! I am your crypto assistant. Ask me about prices, market caps, or trends.</p>
              </div>

              {/* Dynamic Messages */}
              {response.map((item, index) => (
                <div
                  key={index}
                  className={`flex ${item.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`px-4 py-2 rounded-lg max-w-[85%] text-sm ${
                      item.role === "user" 
                        ? "bg-blue-600 text-white" 
                        : "bg-slate-800 text-slate-100"
                    }`}
                  >
                    {item.message}
                  </div>
                </div>
              ))}
              {loading && <p className="text-xs text-slate-400 animate-pulse">Assistant is searching...</p>}
            </div>

            <div className="h-[15%] border-t border-slate-700 p-3">
              <Input
                className="w-full h-full bg-slate-800 border-none focus-visible:ring-1"
                placeholder="Type your message..."
                onChange={handleChange}
                value={inputValue}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSendMessage();
                }}
              />
            </div>
          </div>
        )}

        <Button
          onClick={handleBotRelease}
          className="rounded-full h-14 w-14 shadow-xl"
          size="icon"
        >
          <MessageCircle size={30} />
        </Button>
      </section>
    </div>
  );
}

export default Home;