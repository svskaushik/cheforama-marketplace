export default function Spinner() {

    return (
        <div className="min-h-screen flex justify-center items-center">
            <div className="bg-white bg-opacity-40 flex space-x-2 p-5 rounded-full justify-center items-center animate-pulse">
                <div
                  className="bg-blue-600 p-2  w-4 h-4 rounded-full animate-bounce "
                ></div>
                <div
                  className="bg-blue-600 p-2 w-4 h-4 rounded-full animate-bounce "
                ></div>
                <div
                  className="bg-blue-600 p-2  w-4 h-4 rounded-full animate-bounce "
                ></div>
            </div>
        </div>
    )   
}



