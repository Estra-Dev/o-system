import { Button, FileInput, Label, Select, TextInput } from "flowbite-react";
import { useRef } from "react";

const CreateSystem = () => {
  const filePicker = useRef();

  const handleLogoChange = (ev) => {
    console.log(ev.target.files[0]);
  };

  return (
    <div className=" max-w-3xl mx-auto min-h-screen p-3">
      <h1 className=" text-center text-3xl font-semibold my-7 text-gray-900">
        Create Your System
      </h1>
      <form className=" flex flex-col gap-4">
        <div className=" flex flex-col gap-4 sm:flex-row sm:justify-between">
          <div className=" flex flex-col gap-2 flex-1">
            <Label htmlFor="name">System Name</Label>
            <TextInput
              type="text"
              name="name"
              placeholder="E.g: O'system"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="category">Category</Label>
            <Select>
              <option value={"uncategorize"}>Select a category</option>
              <option value={"politics"}>Politics</option>
              <option value={"economy"}>Economy</option>
              <option value={"public"}>Public</option>
              <option value={"private"}>Private</option>
              <option value={"religious"}>Religious</option>
              <option value={"governmental"}>Governmental</option>
              <option value={"ideological"}>Ideological</option>
              <option value={"societal"}>Societal</option>
              <option value={"Relationship"}>Relationship</option>
            </Select>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="description">System Description</Label>
          <TextInput
            type="text"
            name="description"
            placeholder="E.g: This is a system for all..."
            required
          />
        </div>
        <div className=" flex items-center justify-between gap-4">
          <p
            className=" font-bold text-lg text-white rounded-lg p-2 bg-gray-700 cursor-pointer"
            onClick={() => filePicker.current.click()}
          >
            CHOOSE LOGO HERE
          </p>
          <FileInput
            className=" hidden"
            type="file"
            accept="image/*"
            ref={filePicker}
            onChange={handleLogoChange}
          />
          <Button type="button" outline>
            Upload
          </Button>
        </div>
        <div className=" w-[50%] mt-7 mx-auto overflow-hidden rounded-full border border-teal-500 p-2">
          <img
            src="http://ts1.mm.bing.net/th?id=OIP.z1qiTo8DMqQhhAtW7NfLsQHaHa&pid=15.1"
            alt="logo"
          />
        </div>
        <Button
          type="submit"
          className=" w-[300px] mt-4 mx-auto"
          gradientDuoTone={"purpleToBlue"}
        >
          Create System
        </Button>
      </form>
    </div>
  );
};

export default CreateSystem;
