import React, { useEffect, useState } from 'react';
import { FaFacebookF, FaLinkedin, FaGoogle, FaRegEnvelope } from 'react-icons/fa'
import { MdLockOutline } from 'react-icons/md';
import { toast } from "react-toastify";
import { useRouter } from "next/router";

const API_URL="http://localhost:8000";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const loginFormSubmit = async () => {

        if(password=="" || email=="" ){
            return toast.error(`😣 Please fill all feilds!`, {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                theme: "colored",
            });
        }

        const response = await fetch(`${API_URL}/signin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email,password:password }), // Replace with your payload
        });

        const data = await response.json();
        if(data){
            
            setEmail("");
            setPassword("");
            if(data.success){
                localStorage.setItem("auth", JSON.stringify(data.user));
                router.push('/');
                toast.success(`😃 ${data.message}!`, {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                  });
            }else{
                toast.error(`😣 ${data.message}!`, {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: false,
                    progress: undefined,
                    theme: "colored",
                  });
            }
            
        }
    }
    return (
        <div className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center height-100">
            <div className='bg-white rounded-2xl shadow-2xl flex w-2/3 max-w-4xl'>
                <div className='w-3/5 p-5'>
                    <div className='text-left font-bold'>
                        <span className='text-orange-500'>Pokego</span>
                    </div>
                    <div className='py-10'>
                        <h2 className='text-3xl font-bold text-green-500 mb-2'>
                            Sign In
                        </h2>
                        <div className='border-2 w-10 border-green-500 inline-block mb-2'></div>
                        <div className='flex justify-center my-2'>
                            <a href="#" className='border-2 border-gray-200 rounded-full p-3 mx-1'>
                                <FaFacebookF className='text-sm' />
                            </a>
                            <a href="#" className='border-2 border-gray-200 rounded-full p-3 mx-1'>
                                <FaLinkedin className='text-sm' />
                            </a>
                            <a href="#" className='border-2 border-gray-200 rounded-full p-3 mx-1'>
                                <FaGoogle className='text-sm' />
                            </a>
                        </div>
                        <p className='text-gray-400 my-3'>or use your email account</p>
                        <div className="flex flex-col items-center">
                            <div className="bg-gray-100 w-64 p-2 flex items-center mb-3">
                                <FaRegEnvelope className="text-gray-400 m-2" />
                                <input type="email" name="email" placeholder="Email" className="bg-gray-100 outline-none text-sm flex-1" value={email} onChange={(e)=>setEmail(e.target.value)} />
                            </div>
                            <div className="bg-gray-100 w-64 p-2 flex items-center mb-3">
                                <MdLockOutline className="text-gray-400 m-2" />
                                <input type="password" name="password" placeholder="Password" className="bg-gray-100 outline-none text-sm flex-1" value={password} onChange={(e)=>setPassword(e.target.value)} />
                            </div>
                            <div className="flex justify-between w-64 mb-5">
                                <label className="flex items-center text-xs"><input type="checkbox" name="remember"
                                    className="mr-1" /> Remember me</label>
                                <a href="#" className="text-xs">Forgot Password?</a>
                            </div>
                            <button className='border-2 border-green-500 text-green-500 rounded-full px-12 py-2 inline-block font-semibold hover:bg-green-500 hover:text-white' onClick={()=>loginFormSubmit()}>Sign In</button>
                        </div>
                    </div>


                </div>


                <div className='w-2/5 p-5 bg-green-500 text-white rounded-tr-2xl rounded-br-2xl py-36 px-12'>
                    <h2 className='text-3xl font-bold mb-2'>Hey Gamers</h2>
                    <div className='border-2 w-10 border-white inline-block mb-2'></div>
                    <p className='mb-10'>Fill up some information about you and let's get started</p>
                    <a href="/register" className='border-2 border-white rounded-full px-12 py-2 inline-block font-semibold hover:bg-white hover:text-green-500'>Sign Up</a>

                </div>
            </div>
        </div>
    )
}

export default Login;