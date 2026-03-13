import React, { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { BookmarkFilledIcon, TrashIcon } from "@radix-ui/react-icons";
import { useDispatch, useSelector } from "react-redux";
import { addItemToWatchList, getUserWatchList } from "@/State/Watchlist/Action";
function Watchlist() {
  const dispatch = useDispatch();
  const {watchlist}=useSelector(store=>store)
  useEffect(()=>{
    dispatch(getUserWatchList(localStorage.getItem('jwt')))
  },[])
    const handleRemoveToWatchlist = (Value) => {
        dispatch(addItemToWatchList({coinId: Value,jwt:localStorage.getItem("jwt")}))
        console.log("Remove from watchlist", Value);
    };
  const columns = "grid grid-cols-[230px_230px_230px_230px_230px_150px_1fr]";
  return (
    <div className="w-full rounded-xl border border-white/10 bg-black/40 backdrop-blur-md ">
      <h1 className="text-3xl font-bold text-left px-4 py-4 pb-4">Watchlist</h1>
      <Table className="w-full border">
        <TableHeader>
          <TableRow className={`${columns} border-b border-white/10`}>
            <TableHead className="px-4 py-3 text-xs text-muted-foreground">
              Coin
            </TableHead>
            <TableHead className="px-25 py-3 text-xs text-muted-foreground">
              Symbol
            </TableHead>
            <TableHead className="px-23 py-3 text-xs text-muted-foreground">
              Volume
            </TableHead>
            <TableHead className="px-23 py-3 text-xs text-muted-foreground">
              Market Cap
            </TableHead>
            <TableHead className="px-23 py-3 text-xs text-muted-foreground">
              24h
            </TableHead>
            <TableHead className="px-15 py-3 text-xs text-muted-foreground">
              Price
            </TableHead>
            <TableHead className="py-3 text-xs text-red-400 text-right">
              Remove
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {watchlist.items.map((item, index) => (
            <TableRow
              key={index}
              className={`${columns} border-b border-white/5 hover:bg-white/5 transition-colors`}
            >
              <TableCell className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-6 w-6 shrink-0">
                    <AvatarImage src={item.image} />
                  </Avatar>
                  <span className="font-medium">{item.name}</span>
                </div>
              </TableCell>

              <TableCell className="px-3 py-3 text-muted-foreground">
                {item.symbol}
              </TableCell>

              <TableCell className="px-3 py-3">{item.total_volume}</TableCell>

              <TableCell className="px-3 py-3">{item.market_cap}</TableCell>

              <TableCell className="px-3 py-3 text-red-400">{item.price_change_percentage_24h}</TableCell>
              <TableCell className="px-3 py-3 text-red-400">{item.current_price}</TableCell>

              <TableCell className="py-3 text-right font-medium">
                <Button
                  variant="ghost"
                  onClick={() => handleRemoveToWatchlist(item.id)}
                  className="h-10 w-10"
                  size="icon"
                >
                  <TrashIcon className="w-8 h-8"/>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default Watchlist;
