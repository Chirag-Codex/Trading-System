import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input'
import { transferMoney } from '@/State/Wallet/Action';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';

function TransferForm() {
    const dispatch=useDispatch()
    const {wallet}=useSelector(store=>store)
    const [formData, setFormData] = React.useState({
        amount: '',
        walletId: '',
        purpose: ''
    });
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    const handleSubmit =()=>{
        dispatch(transferMoney({jwt:localStorage.getItem('jwt'),walletId:formData.walletId,
            reqData:{
                amount:formData.amount,
                purpose:formData.purpose
            }
        }))
        console.log(formData);
    }
    return (
        <div className='pt-10 space-y-5'>
            <div>
                <h1 className='pb-1'>Enter Amount</h1>
                <Input 
                name='amount'
                type='number'
                placeholder='0.00'
                className='py-7'
                onChange={handleChange}
                value={formData.amount}/>
            </div>
            <div>
                <h1 className='pb-1'>Wallet Id</h1>
                <Input 
                name='walletId'
                placeholder='#ADERF345'
                className='py-7'
                onChange={handleChange}
                value={formData.walletId}/>
            </div>
            <div>
                <h1 className='pb-1'>Enter Purpose</h1>
                <Input 
                name='purpose'
                type='text'
                placeholder='Purpose of transfer'
                className='py-7'
                onChange={handleChange}
                value={formData.purpose}/>
            </div>
            <DialogClose className='w-full'>
                <Button onClick={handleSubmit} variant='outline' className='w-full py-7'>Transfer</Button>
            </DialogClose>
        </div>
    )
}

export default TransferForm
