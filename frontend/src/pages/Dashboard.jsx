import React, { useEffect, useState } from 'react';
import { Appbar } from "../components/Appbar";
import { Balance } from "../components/Balance";
import { Users } from "../components/Users";

import axios from 'axios';

export const Dashboard = () => {
    const [user, setUser] = useState({ name: '' });
    const [balance, setBalance] = useState('0');

    useEffect(() => {
        const fetchUserDetails = async() => {
            try {
                const token = localStorage.getItem('token');

                const userResponse = await axios.get('http://localhost:3000/api/v1/user/me', {
                    headers: { 'authorization': `${token}` }
                });
                const userData = userResponse.data;
                setUser({ name: `${userData.firstName} ${userData.lastName}` });
 
                const balanceResponse = await axios.get('http://localhost:3000/api/v1/account/balance', {
                    headers: { 'authorization': `${token}` }
                });
                setBalance(balanceResponse.data.balance);
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };

    fetchUserDetails();
}, []);
    

    return (
        <div>
            <Appbar user={user} />
            <div className="m-8">
            <Balance value={balance} />
                <Users />
            </div>
        </div>
    );
};
