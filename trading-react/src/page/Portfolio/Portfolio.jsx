import React, { useEffect } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { useDispatch, useSelector } from "react-redux"
import { getUserAssets } from "@/State/Asset/Action"

const columns =
  "grid grid-cols-[260px_260px_260px_260px_260px_1fr]"

function Portfolio() {
  const dispatch=useDispatch()
  const {asset}=useSelector((store)=>store)
  useEffect(()=>{
    dispatch(getUserAssets(localStorage.getItem('jwt')))
  },[])
  return (
   <div className="w-full rounded-xl border border-white/10 bg-black/40 backdrop-blur-md ">
          <h1 className="text-3xl font-bold text-left px-4 py-4 pb-4">Portfolio</h1>
        <Table className="w-full border">
          <TableHeader>
            <TableRow
              className={`${columns} border-b border-white/10`}
            >
              <TableHead className="px-4 py-3 text-xs text-muted-foreground">
                Asset
              </TableHead>
              <TableHead className="px-30 py-3 text-xs text-muted-foreground">
                Price
              </TableHead>
              <TableHead className="px-28 py-3 text-xs text-muted-foreground">
                Unit
              </TableHead>
              <TableHead className="px-28 py-3 text-xs text-muted-foreground">
                Change
              </TableHead>
              <TableHead className="px-28 py-3 text-xs text-muted-foreground">
                Change%
              </TableHead>
              <TableHead className="px-4 py-3 text-xs text-muted-foreground text-right">
                Value
              </TableHead>
            </TableRow>
          </TableHeader>
  
          <TableBody>
            {asset?.userAssets.map((item, index) => (
              <TableRow
                key={index}
                className={`${columns} border-b border-white/5 hover:bg-white/5 transition-colors`}
              >
                <TableCell className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-6 w-6 shrink-0">
                      <AvatarImage src={item.coin.image} />
                    </Avatar>
                    <span className="font-medium">{item.coin.name}</span>
                  </div>
                </TableCell>
  
                <TableCell className="px-3 py-3 text-muted-foreground">
                  {item.coin.current_price}
                </TableCell>
  
                <TableCell className="px-3 py-3">
                  {item.quantity}
                </TableCell>
  
                <TableCell className="px-3 py-3">
                  {item.coin.price_change_24h}
                </TableCell>
  
                <TableCell className="px-3 py-3 text-red-400">
                  {item.coin.price_change_percentage_24h}%
                </TableCell>
  
                <TableCell className="px-4 py-3 text-right font-medium">
                  ${item.coin.total_volume}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
  )
}

export default Portfolio
