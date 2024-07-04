export const Appbar = ({ user }) => {
    const userName = user.name || '';
    const firstLetter = userName.charAt(0).toUpperCase();

    return (
        <div className="shadow h-14 flex justify-between">
            <div className="flex flex-col justify-center h-full ml-4">
                PayTM App
            </div>
            <div className="flex">
                <div className="flex flex-col justify-center h-full mr-4">
                    {userName}
                </div>
                <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
                    <div className="flex flex-col justify-center h-full text-xl">
                        {firstLetter}
                    </div>
                </div>
            </div>
        </div>
    );
};
