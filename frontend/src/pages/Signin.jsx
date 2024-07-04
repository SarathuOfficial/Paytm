

import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button'; // Adjust the path as necessary
import { Heading } from '../components/Heading'; // Adjust the path as necessary
import { InputBox } from '../components/InputBox'; // Adjust the path as necessary
import { SubHeading } from '../components/SubHeading'; // Adjust the path as necessary
import { BottomWarning } from '../components/BottomWarning'; // Adjust the path as necessary

export const Signin = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSignIn = async () => {
          try {
            const response = await axios.post("http://localhost:3000/api/v1/user/signin", {
              username,
              password
            });
            localStorage.setItem("token", response.data.token);
            navigate("/dashboard");
          } catch (error) {
            console.error("Error logging in:", error);
          }
        }

    return (
        <div className="bg-slate-300 h-screen flex justify-center">
            <div className="flex flex-col justify-center">
                <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
                    <Heading label={"Sign in"} />
                    <SubHeading label={"Enter your credentials to access your account"} />
                    <InputBox 
                        onChange={e => setUsername(e.target.value)} 
                        placeholder="sarath@gmail.com" 
                        label={"Email"} type = "text"
                    />
                    <InputBox 
                        onChange={e => setPassword(e.target.value)} 
                        placeholder="123456" 
                        label={"Password"} 
                        type="password" // To make the input a password field
                    />
                    <div className="pt-4">
                        <Button 
                            onClick={handleSignIn}
                            label={"Sign in"} 
                        />
                    </div>
                    <BottomWarning label={"Don't have an account?"} buttonText={"Sign up"} to={"/signup"} />
                </div>
            </div>
        </div>
    );
};

