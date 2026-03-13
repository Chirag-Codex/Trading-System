import React from 'react'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DragHandleHorizontalIcon, MagnifyingGlassIcon } from '@radix-ui/react-icons'
import logo from '@/assets/logo.png'
import Sidebar from './Sidebar'
import { useSelector } from 'react-redux'
function Navbar() {
  const {auth}=useSelector(store=>store)
    return (
       <div className='w-full'>
         <div className='px-2 py-3 border-b z-50 bg-background bg-opacity-0 sticky top-0
        left-0 right-0 flex justify-between items-center w-full'>
            <div className='flex items-center gap-3'>
                <Sheet>
  <SheetTrigger><Button variant="ghost" size="icon" className="rounded-full h-15 w-15"><DragHandleHorizontalIcon/>
    </Button></SheetTrigger>
  <SheetContent side='left' className='w-72 border-r-0 flex flex-col justify-center'>
    <SheetHeader>
      <div className='text-2xl flex justify-center items-center
      gap-1'>

        <Avatar>
          <AvatarImage src={logo} alt="avatar"/>
        </Avatar>
        <div>
          <span className="font-bold text-red-500">Trading</span>
          <span className='text-yellow-400'>Platform</span>
        </div>
      </div>
    </SheetHeader>
    <Sidebar/>
  </SheetContent>
</Sheet>
<p className='text-sm lg:text-base cursor-pointer'>
  Trading Platform</p>
  <div className='p-0 ml-9'>
    <Button variant='outline' className='flex items-center gap-3'>
      <MagnifyingGlassIcon/>
      <span>Search</span>
    </Button>
  </div>
            </div>
            <div>
              <Avatar>
                <AvatarFallback>{auth.user?.fullName[0].toUpperCase()}</AvatarFallback>
              </Avatar>
            </div>
        </div>
       </div>
    )
}

export default Navbar
