import { Input } from '@/components/ui/input'
import React from 'react'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { DotFilledIcon } from '@radix-ui/react-icons';
import { Label } from "@/components/ui/label"
import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/dialog';
import { useDispatch } from 'react-redux';
import { paymentHandler } from '@/State/Wallet/Action';
function TopupForm() {
    const [amount, setAmount] = React.useState('');
    const handleChange = (e) => {
        setAmount(e.target.value);
    }
    const dispatch=useDispatch();
    const [paymentMethod, setPaymentMethod] = React.useState('RAZORPAY');
    const handlePaymentMethodChange = (value) => {
        setPaymentMethod(value);
    }
    const handleSubmit = () => {
        console.log("TopUp Amount:", amount);
        console.log("Payment Method:", paymentMethod);
        dispatch(paymentHandler({
            jwt:localStorage.getItem("jwt"),
            paymentMethod,
            amount,
            
        }))
    }
    return (
        <div>
           <div>
             <h1 className='pb-1 '>Enter Amount</h1>
            <Input 
            onChange={handleChange}
            value={amount}
            className='py-7 text-lg'
            placeholder='Enter Amount'/>
           </div>
           <div>
            <h1 className='pb-1 pt-3'>Select Payment Method</h1>
            <RadioGroup
             className='flex pt-3' 
             defaultValue="RAZORPAY"
             onValueChange={(value) => handlePaymentMethodChange(value)}>
                 <div className='flex items-center space-x-2 border
                p-3 px-5 rounded-md ml-5'>
                    <RadioGroupItem 
                    icon={DotFilledIcon}
                    className='h-4 w-4'
                    value="RAZORPAY"
                    id="r1"/>
                    <Label htmlFor="r1" className='cursor-pointer'>Razorpay</Label>
                </div>
                <div className='flex items-center space-x-2 border
                p-3 px-5 rounded-md ml-5'>
                    <RadioGroupItem 
                    icon={DotFilledIcon}
                    className='h-4 w-4'
                    value="STRIPE"
                    id="r2"/>
                    <Label htmlFor="r2" className='cursor-pointer'>Stripe</Label>
                </div>
            </RadioGroup>
           </div>
          <div className='pt-4 w-full'>
            <DialogClose className="w-full">
                 <Button variant="outline" onClick={handleSubmit}
              className='w-full py-7'>Top Up Wallet</Button>
            </DialogClose>
          </div>
        </div>
    )
}

export default TopupForm
