import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button } from "./Button";

// Debounce custom hook
const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => clearTimeout(timerId);
    }, [value, delay]);

    return debouncedValue;
};

export const Users = () => {
    const [users, setUsers] = useState([]);
    const [filter, setFilter] = useState("");
    const debouncedFilter = useDebounce(filter, 5000);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/v1/user/bulk?filter=${debouncedFilter}`);
                setUsers(response.data.user);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        // Fetch users if the debounced filter is not empty, else fetch all users
        if (debouncedFilter !== "") {
            fetchUsers();
        } else {
            // Fetch all users without filter
            axios.get("http://localhost:3000/api/v1/user/bulk")
                .then(response => {
                    setUsers(response.data.user);
                })
                .catch(error => {
                    console.error("Error fetching users:", error);
                });
        }
    }, [debouncedFilter]);

    return (
        <>
            <div className="font-bold mt-6 text-lg">
                Users
            </div>
            <div className="my-2">
                <input
                    onChange={(e) => setFilter(e.target.value)}
                    type="text"
                    placeholder="Search users..."
                    className="w-full px-2 py-1 border rounded border-slate-200"
                />
            </div>
            <div>
                {users.map(user => <User key={user._id} user={user} />)}
            </div>
        </>
    );
};

function User({ user }) {
    const navigate = useNavigate();

    return (
        <div className="flex justify-between mb-2">
            <div className="flex">
                <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
                    <div className="flex flex-col justify-center h-full text-xl">
                        {user.firstName[0].toUpperCase()}
                    </div>
                </div>
                <div className="flex flex-col justify-center h-full">
                    <div>
                        {user.firstName} {user.lastName}
                    </div>
                </div>
            </div>

            <div className="flex flex-col justify-center h-full">
                <Button onClick={() => navigate(`/send?id=${user._id}&name=${user.firstName}`)} label="Send Money" />
            </div>
        </div>
    );
}
