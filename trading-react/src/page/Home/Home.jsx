// import { Button } from "@/components/ui/button";
// import React, { useEffect } from "react";
// import AssetTable from "./AssetTable";
// import StockChart from "./StockChart";
// import { Avatar, AvatarImage } from "@/components/ui/avatar";
// import { Cross1Icon, DotIcon } from "@radix-ui/react-icons";
// import { MessageCircle } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import { useDispatch, useSelector } from "react-redux";
// import { getCoinList, getTop50CoinList } from "@/State/Coin/Action";
// import {
//   Pagination,
//   PaginationContent,
//   PaginationEllipsis,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// } from "@/components/ui/pagination";
// import axios from "axios";
// function Home() {
//   const [category, setCategory] = React.useState("all");
//   const handleCategoryChange = (value) => {
//     setCategory(value);
//   };
//   const [response, setResponse] = React.useState([]);
//   const [loading, setLoading] = React.useState(false);
//   const handleFetchCoinDetails=async(prompt)=>{
//     setLoading(true);
//     try {
//       const {data}=await axios.post("http://localhost:5454/ai/chat",{
//         prompt
//       })
//       const response={message:data.message,role:"model"}
//        const userPrompt={message:prompt,role:"user"}
//      setResponse(prev=>[...prev,userPrompt,response]);
//      console.log("Success",data);
//     } catch (error) {
//       console.log("error",error);
      
//     }
//     setLoading(false);
//   }
//   const { coin } = useSelector((store) => store);
//   const {auth}=useSelector(store=>store)
//   const [inputValue, setInputValue] = React.useState("");
//   const [isBotRelease, setIsBotRelease] = React.useState(false);
//   const handleBotRelease = () => {
//     setIsBotRelease(!isBotRelease);
//   };

//   const handleChange = (e) => {
//     setInputValue(e.target.value);
//   };
//   const handleKeyPress = (e) => {
//     if (e.key === "Enter") {
//       console.log("User input:", inputValue);
//     }
//     setInputValue("");
//   };
//   const dispatch = useDispatch();
//   useEffect(() => {
//     dispatch(getCoinList(1));
//   }, []);
//   useEffect(() => {
//     if (category == "top50") {
//       dispatch(getTop50CoinList());
//     }
//   }, [category, dispatch]);
//   return (
//     <div className="relative">
//       <div className="lg:flex">
//         <div className="lg:w-[50%] lg:border-r">
//           <div className="flex items-center gap-5 p-5">
//             <Button
//               onClick={() => handleCategoryChange("all")}
//               variant={category == "all" ? "default" : "outline"}
//               className="rounded-full"
//             >
//               All
//             </Button>
//             <Button
//               onClick={() => handleCategoryChange("top50")}
//               variant={category == "top50" ? "default" : "outline"}
//               className="rounded-full"
//             >
//               Top 50
//             </Button>
//             <Button
//               onClick={() => handleCategoryChange("topGainers")}
//               variant={category == "topGainers" ? "default" : "outline"}
//               className="rounded-full"
//             >
//               Top Gainers
//             </Button>
//             <Button
//               onClick={() => handleCategoryChange("topLosers")}
//               variant={category == "topLosers" ? "default" : "outline"}
//               className="rounded-full"
//             >
//               Top Losers
//             </Button>
//           </div>
//           <AssetTable
//             coin={category == "all" ? coin.coinList : coin.top50}
//             category={category}
//           />
//           <div>
//             <Pagination>
//               <PaginationContent>
//                 <PaginationItem>
//                   <PaginationPrevious href="#" />
//                 </PaginationItem>
//                 <PaginationItem>
//                   <PaginationLink href="#">1</PaginationLink>
//                 </PaginationItem>
//                 <PaginationItem>
//                   <PaginationLink href="#" isActive>
//                     2
//                   </PaginationLink>
//                 </PaginationItem>
//                 <PaginationItem>
//                   <PaginationLink href="#">3</PaginationLink>
//                 </PaginationItem>
//                 <PaginationItem>
//                   <PaginationEllipsis />
//                 </PaginationItem>
//                 <PaginationItem>
//                   <PaginationNext href="#" />
//                 </PaginationItem>
//               </PaginationContent>
//             </Pagination>
//           </div>
//         </div>
//         <div className="hidden lg:block lg:w-[50%] p-5">
//           <StockChart coinId="bitcoin" />
//           <div className="flex gap-5 items-center">
//             <div>
//               <Avatar>
//                 <AvatarImage
//                   src={
//                     "https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=023"
//                   }
//                 />
//               </Avatar>
//             </div>
//             <div>
//               <div className="flex items-center gap-2">
//                 <p>BTC</p>
//                 <DotIcon className="text-gray-400" />
//                 <p className="text-gray-400">Bitcoin</p>
//               </div>
//               <div className="flex items-end gap-2">
//                 <p className="text-xl font-bold">5464</p>
//                 <p className="text-red-600">
//                   <span>-1319049822.578</span>
//                   <span>(-0.29803%)</span>
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <section
//         className="absolute bottom-5 right-5 z-40 flex flex-col
//          justify-end items-end gap-2"
//       >
//         {isBotRelease && (
//           <div
//             className="rounded-md w-[20rem] md:w-[25rem] lg:w-[25rem]
//             h-[70vh] bg-slate-900"
//           >
//             <div
//               className="flex justify-between items-center
//                 border-b px-6 h-[12%]"
//             >
//               <p>Chat Bot</p>
//               <Button onClick={handleBotRelease} variant="ghost" size="icon">
//                 <Cross1Icon />
//               </Button>
//             </div>
//             <div
//               className="h-[76%] flex flex-col overflow-y-auto gap-5
//                 px-5 py-2 scroll-container"
//             >
//               <div className="self-start pb-5 w-auto">
//                 <div
//                   className="justify-end self-end px-5 py-2
//                     rounded-md bg-slate-800 w-auto"
//                 >
//                   <p>Hi,I am your crypto assistant</p>
//                   <p>you can ask crypto related any question</p>
//                   <p>like price, market cap, etc from me</p>
//                 </div>
//               </div>
//               {response.map((item, index) => (
//                 <div
//                   key={index}
//                   className={
//                     item.role === "user"
//                       ? "self-end pb-5 w-auto"
//                       : "self-start pb-5 w-auto"
//                   }
//                 >
//                   {item.role === "user" ? (
//                     <div
//                       className="justify-end self-end px-5 py-2
//                     rounded-md bg-slate-800 w-auto"
//                     >
//                       <p>{item.message}</p>
//                     </div>
//                   ) : (
//                     <div
//                       className="justify-end self-end px-5 py-2
//                     rounded-md bg-slate-800 w-auto"
//                     >
//                       <p>{item.message}</p>
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//             <div className="h-[12%] border-t border-slate-700">
//               <Input
//                 className="w-full h-full order-0 outline-none"
//                 placeholder="Type your message here..."
//                 onChange={handleChange}
//                 value={inputValue}
//                 onKeyPress={(e) => {
//                   if (e.key === "Enter") {
//                     const data={message:inputValue,role:"user"}
//                     setResponse(prev=>[...prev,data]);
//                     handleFetchCoinDetails(inputValue);
//                   }
//                 }}
//               />
//             </div>
//           </div>
//         )}
//         <div className="relative w-[10rem] cursor-pointer group">
//           <Button
//             onClick={handleBotRelease}
//             className="w-full h-[3rem] gap-2 items-center"
//           >
//             <MessageCircle
//               size={80}
//               className="fill-[#1e293b] -rotate-90 stroke-none
//                     group-hover:fill-amber-100"
//             />
//             <span className="text-2xl">ChatBot</span>
//           </Button>
//         </div>
//       </section>
//     </div>
//   );
// }

// export default Home;




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
      const { data } = await axios.post("http://localhost:5454/ai/chat", {
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
        {/* Main Content Sections (Table/Chart) */}
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