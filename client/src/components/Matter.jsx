const Matter = ({ matter }) => {
  return (
    <div className=" shadow-lg mb-3 p-5 rounded-md bg-white w-full">
      <div className="first flex justify-start gap-2 whitespace-nowrap text-xs sm:text-sm w-full">
        <div className=" w-[10%] rounded-full overflow-hidden">
          <img
            src="https://th.bing.com/th/id/OIP.iFW8SCze8S0rADU4kyUUrgAAAA?w=360&h=360&rs=1&pid=ImgDetMain"
            className=" w-full rounded-full"
            alt="user profile"
          />
        </div>
        <p className=" text-xs truncate">{matter && matter.userId}</p>
        <p className=" text-xs truncate">System Name</p>
        <p className=" text-xs truncate">Time of post</p>
      </div>
      <div className="second max-w-3xl w-full flex flex-col items-end">
        <div className=" w-[90%] rounded-md">
          <p className=" text-gray-900 font-semibold text-sm my-3">
            {matter && matter.content}
          </p>
          {matter && matter.image && (
            <img
              src={matter && matter.image}
              className=" w-full rounded-md my-2"
              alt="post image"
            />
          )}
          <div className="reactions flex justify-start gap-3 py-2 mt-3 text-xs border-t-2">
            <span>Confirm</span>
            <span>Confused</span>
            <span>Comment</span>
            {/* <span>Important</span> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Matter;
