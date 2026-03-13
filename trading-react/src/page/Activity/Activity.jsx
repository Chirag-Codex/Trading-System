import React, { use, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useDispatch, useSelector } from 'react-redux';
import { getAllOrdersForUsers } from '@/State/Order/Action';
import { calculateProfit } from '@/utils/calculateProfit';
function Activity() {
  const dispatch=useDispatch()
  useEffect(()=>{
    dispatch(getAllOrdersForUsers({ jwt:localStorage.getItem("jwt")}))
  },[])
  const {order}=useSelector(store=>store)
    const columns = "grid grid-cols-[230px_230px_230px_230px_230px_150px_1fr]";
    return (
        <div className="w-full rounded-xl border border-white/10 bg-black/40 backdrop-blur-md ">
      <h1 className="text-3xl font-bold text-left px-4 py-4 pb-4">Activity</h1>
      <Table className="w-full border">
        <TableHeader>
          <TableRow className={`${columns} border-b border-white/10`}>
            <TableHead className="px-4 py-3 text-xs text-muted-foreground">
              Date & Time
            </TableHead>
            <TableHead className="px-5 py-3 text-xs text-muted-foreground">
              Trading Pair
            </TableHead>
            <TableHead className="px-23 py-3 text-xs text-muted-foreground">
              Buy Price
            </TableHead>
            <TableHead className="px-20 py-3 text-xs text-muted-foreground">
              Selling Price
            </TableHead>
            <TableHead className="px-23 py-3 text-xs text-muted-foreground">
              Order Type
            </TableHead>
            <TableHead className="px-12 py-3 text-xs text-muted-foreground">
              Profit/Loss
            </TableHead>
            <TableHead className="py-3 text-xs text-right">
              Value
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {order.orders.map((item, index) => (
            <TableRow
              key={index}
              className={`${columns} border-b border-white/5 hover:bg-white/5 transition-colors`}
            >
            <TableCell className="px-4 py-3 text-muted-foreground text-left">
                <p>2024-01-01 </p>
                <p className='text-gray-400'>12:30 PM</p>
              </TableCell>
              <TableCell className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-6 w-6 shrink-0">
                    <AvatarImage src={item.orderItem.coin.image}/>
                  </Avatar>
                  <span className="font-medium">{item.orderItem.coin.name}</span>
                </div>
              </TableCell>

              

              <TableCell className="px-3 py-3">{item.orderItem.buyPrice}</TableCell>

              <TableCell className="px-3 py-3">{item.orderItem.sellPrice}</TableCell>

              <TableCell className="px-3 py-3">{item.orderType}</TableCell>
              <TableCell className="px-3 py-3">{calculateProfit(item)}</TableCell>

              <TableCell className="py-3 text-right font-medium">
               {item.price}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
    )
}

export default Activity
