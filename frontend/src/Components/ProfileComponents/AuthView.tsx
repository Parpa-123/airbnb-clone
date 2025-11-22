import React, { useEffect, useState } from 'react'
import axiosInstance from '../../../public/connect';
import { toast } from 'react-toastify';

interface AuthDetails
{
    username: string,
    email : string,
}
const AuthView = () => {
    const [dets, setDets] = useState<AuthDetails | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(()=>{
        ;( async()=>{
            try {
                setLoading(true);
                const res = await axiosInstance.get('/me/');
                setDets({username:res.data.username, email:res.data.email});
            } catch (error) {
                toast.error('A Problem has Occured');
            } finally {
                setLoading(false);
            }
        }
            
        )()
    },[]);
  return (
    <div>
        {dets?.username}
        {dets?.email}
    </div>
  )
}

export default AuthView
