
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import { ScrollArea } from "@/components/ui/scroll-area"
function AssetTable({ coin, category, loading, error }) {
  const navigate = useNavigate();
  if (loading) {
    return (
      <div className="flex justify-center items-center p-10">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
        <span className="ml-3">Loading coins...</span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-5 text-center text-red-500">
        <p>Error: {error}</p>
        <p className="text-sm text-gray-400 mt-2">Please try again later</p>
      </div>
    );
  }

  if (!coin || coin.length === 0) {
    return (
      <div className="p-5 text-center text-gray-500">
        No coins available for {category} category
      </div>
    );
  }
  const formatNumber = (num) => {
    if (!num) return 'N/A';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return num.toString();
  };
  const formatPriceChange = (change) => {
    if (!change && change !== 0) return 'N/A';
    const numChange = parseFloat(change);
    const formatted = numChange.toFixed(2) + '%';
    return (
      <span className={numChange >= 0 ? 'text-green-600' : 'text-red-600'}>
        {numChange >= 0 ? '+' : ''}{formatted}
      </span>
    );
  };

  return (
    <div className="overflow-x-auto">
      <Table>
       <ScrollArea className={`${category=="all"?"h-[77vh]":"h-[82vh]"}`}>
         <TableHeader>
          <TableRow>
            <TableHead className="w-[180px] px-2 py-2">Coin</TableHead>
            <TableHead className="w-[80px] px-2 py-2">Symbol</TableHead>
            <TableHead className="w-[120px] px-2 py-2">Volume</TableHead>
            <TableHead className="w-[120px] px-2 py-2">Market Cap</TableHead>
            <TableHead className="w-[80px] px-2 py-2">24h</TableHead>
            <TableHead className="w-[120px] text-right px-2 py-2">Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {coin.map((item) => (
            <TableRow 
              key={item.id} 
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => navigate(`/market/${item.id}`)}
            >
              <TableCell className="w-[180px] p-2 font-medium">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={item.image} alt={item.name} />
                  </Avatar>
                  <span className="truncate">{item.name}</span>
                </div>
              </TableCell>
              <TableCell className="w-[80px] p-2 uppercase">
                {item.symbol}
              </TableCell>
              <TableCell className="w-[120px] p-2">
                {formatNumber(item.total_volume)}
              </TableCell>
              <TableCell className="w-[120px] p-2">
                {formatNumber(item.market_cap)}
              </TableCell>
              <TableCell className="w-[80px] p-2">
                {formatPriceChange(item.price_change_percentage_24h)}
              </TableCell>
              <TableCell className="w-[120px] text-right p-2 font-medium">
                ${item.current_price?.toLocaleString() || 'N/A'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
       </ScrollArea>
      </Table>
    </div>
  );
}

export default AssetTable;