import React, { useEffect } from 'react'
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
import { TrashIcon } from "@radix-ui/react-icons";
import { useDispatch, useSelector } from 'react-redux';
import { getWithdrawalRequest } from '@/State/Withdrawal/Action';
function Withdrawal() {
     const dispatch=useDispatch();
      const {withdrawal}=useSelector(store=>store)

    useEffect(()=>{
      dispatch(getWithdrawalRequest(localStorage.getItem('jwt')))
    },[])
     const columns = "grid grid-cols-[230px_500px_500px_1fr]";
    return (
       <div className="w-full rounded-xl border border-white/10 bg-black/40 backdrop-blur-md ">
      <h1 className="text-3xl font-bold text-left px-4 py-4 pb-4">Withdrawal</h1>
      <Table className="w-full border">
        <TableHeader>
          <TableRow className={`${columns} border-b border-white/10`}>
            <TableHead className="px-4 py-3 text-xs text-muted-foreground">
              Date
            </TableHead>
            <TableHead className="px-57 py-3 text-xs text-muted-foreground">
              Method
            </TableHead>
            <TableHead className="px-55 py-3 text-xs text-muted-foreground">
              Account
            </TableHead>
            <TableHead className="py-3 text-xs text-right">
              Status
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {withdrawal.history.map((item ,index) => (
            <TableRow
              key={index}
              className={`${columns} border-b border-white/5 hover:bg-white/5 transition-colors`}
            >
            <TableCell className="px-4 py-3 text-muted-foreground text-left">
                <p>{item.date.toString()} </p>
              </TableCell>
              <TableCell className=" py-3">
                Bank
              </TableCell>
              <TableCell className="px-3 py-3">${item.amount}</TableCell>
              <TableCell className="py-3 text-right font-medium">
                {item.status}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
    )
}

export default Withdrawal
