import axios from "axios";
import { Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const SingleMatter = () => {
  const { matterId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [matter, setMatter] = useState(null);

  console.log("params", matter);
  useEffect(() => {
    const getPost = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `/api/matter/getmatters?matterId=${matterId}`
        );
        const data = res.data;
        console.log(data);
        if (res.status === 200) {
          setError(false);
          setLoading(false);
          setMatter(data.matters[0]);
        }
      } catch (error) {
        setError(true);
        setLoading(false);
        return;
      }
    };
    getPost();
  }, [matterId]);

  if (loading)
    return (
      <div className=" min-h-screen flex justify-center items-center w-full">
        <Spinner size={"xl"} />
      </div>
    );
  return (
    <main className=" flex flex-col max-w-6xl mx-auto min-h-screen">
      {matter && matter.image && (
        <img
          src={matter.image}
          alt={matter.image}
          className=" mt-5 p-3 max-h-[600px] w-full object-cover"
        />
      )}
      <div className="flex justify-between items-center border-b border-slate-300 text-xs px-3 mx-auto w-full max-w-2xl">
        <span className=" text-xs p-3">
          {matter && new Date(matter.updatedAt).toLocaleDateString()}
        </span>
        <span>
          {matter && matter.content.length / (1000).toFixed(0)} mins Read
        </span>
      </div>
      <p
        dangerouslySetInnerHTML={{ __html: matter.content }}
        className=" mt-5 px-3 max-w-2xl mx-auto w-full matter-content"
      ></p>
    </main>
  );
};

export default SingleMatter;
