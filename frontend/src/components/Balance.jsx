export const Balance = ({ value }) => {
    // Convert the balance to a float number
    const balance = parseFloat(value);
    
    // Extract the integer part using Math.floor()
    const integerPart = Math.floor(balance);

    return (
        <div className="flex">
            <div className="font-bold text-lg">
                Your balance
            </div>
            <div className="font-semibold ml-4 text-lg">
                Rs {integerPart}
            </div>
        </div>
    );
}
