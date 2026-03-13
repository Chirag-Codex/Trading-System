import { Input } from '@/components/ui/input'
import React, { useEffect } from 'react'
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { DotIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { getUserWalletRequest } from '@/State/Wallet/Action';
import { getAssetDetails } from '@/State/Asset/Action';
import { payOrder } from '@/State/Order/Action';
function TradingForm() {
     const [orderType,setOrderType]=React.useState("BUY")
     const [amount,setAmount]=React.useState(0)
     const [quantity,setQuantity]=React.useState(0)
     const {coin,wallet,asset}=useSelector((store)=>store)
     const calculateBuyCost=(amount,price)=>{
       let volume=amount/price
       let decimalPlaces=Math.max(2,price.toString().split(".")[0]?.length)
       return volume.toFixed(decimalPlaces)
    }
    const dispatch=useDispatch()
    const handleChange=(e)=>{
        const amount=e.target.value
        setAmount(amount)
        const volume=calculateBuyCost(amount,coin.coinDetails.market_data.current_price.usd)
        console.log("Amount");
        setQuantity(volume)

    }
   useEffect(()=>{
    dispatch(getUserWalletRequest(localStorage.getItem('jwt')))
    dispatch(getAssetDetails({coinId: coin.coinDetails.id ,jwt:localStorage.getItem("jwt")}))
   },[])

   const handleBuyCrypto=()=>{
    dispatch(payOrder({
      jwt:localStorage.getItem('jwt'),
     orderData:{
       coinId:coin.coinDetails.id,
      quantity,
      orderType
    }}))
   }
    return (
        <div className='space-y-10 p-5 '>
            <div>
                <div className='flex gap-4 items-center justify-between'>
                    <Input className='py-7 focus:outline-none'
                    placeholder='Enter the amount you want to spend'
                    onChange={handleChange}
                    type='number'
                    />
                    <div>
                        <p className='border text-2xl flex justify-center
                        items-center w-36 h-14 rounded-md'>{quantity}</p>
                    </div>
                </div>
                {false&&<h1 className='text-red-600 text-center p-4'>
                    Insufficeint Wallet Balance to Buy</h1>}
            </div>
             <div className="flex gap-5 items-center">
          <div>
            <Avatar>
              <AvatarImage src={coin.coinDetails?.image.large} />
            </Avatar>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p>{coin.coinDetails.symbol.toUpperCase()}</p>
              <DotIcon className="text-gray-400" />
              <p className="text-gray-400">{coin.coinDetails.name}</p>
            </div>
            <div className="flex items-end gap-2">
              <p className="text-xl font-bold">${coin.coinDetails?.market_data.current_price.usd.toFixed(2)}</p>
              <p className="text-red-600">
                <span>{coin.coinDetails?.price_change_24h}</span>
                <span>({coin.coinDetails?.price_change_percentage_24h}%)</span>
              </p>
            </div>
          </div>
        </div>
        <div className='flex items-center justify-between'>
            <p>Order Type</p>
            <p>Market Order</p>
        </div>
        <div className='flex items-center justify-between'>
            <p>{orderType=='BUY'?"Available Cash":"Available Quantity"}</p>
             <p>{orderType=='BUY'? '$' + wallet.userWallet?.balance:asset.assetDetails.quantity||0}</p>
        </div>
        <div><Button 
        onClick={handleBuyCrypto}
        className={`w-full py-6 ${orderType=='SELL'?"bg-red-600 text-white"
            :''}`}>{orderType}</Button>
        <Button 
        variant='link'
        className='w-full mt-5 text-xl'
        onClick={()=>setOrderType(orderType=='BUY'?'SELL':'BUY')}>
            {orderType=="BUY"?"or Sell":"or Buy"}</Button>
        </div>
        </div>
    )
}

export default TradingForm
