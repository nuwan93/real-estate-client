import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import {
  signOut,
  updateFail,
  updateStart,
  updateSuccess,
} from "../state/user/userSlice";
import { app } from "../../firebase";

export default function Profile() {
  const { currentUser, loading } = useSelector((state) => state.user);

  const filePickerRef = useRef();

  const dispatch = useDispatch();

  const [formData, setFormData] = useState({});
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (file) {
      handleUpload();
    }
  }, [file]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    dispatch(updateStart());
    try {
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...currentUser, ...formData }),
      });

      const data = await res.json();

      if (data.success === false) {
        toast.error(data.message);
        dispatch(updateFail());
        return;
      }

      dispatch(updateSuccess(data));
      toast.success("Updated user successfully!");
    } catch (error) {
      toast.error(error.message);
      dispatch(updateFail());
    }
  };

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.id]: event.target.value,
    });
  };

  const onSignOutClick = () => {
    dispatch(signOut());
    toast.success("Successfully signed out! ");
  };

  const handleUpload = () => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, `${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(Math.round(progress));
      },
      (error) => {
        toast.error(error.message);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setFormData({ ...formData, photo: downloadUrl });
        });
      }
    );
  };

  return (
    <div className="max-w-lg p-3 mx-auto gap-3">
      <h1 className="text-3xl my-7 text-center font-semibold">Profile</h1>

      <form className="flex flex-col mt-7 gap-4" onSubmit={handleSubmit}>
        <input
          type="file"
          ref={filePickerRef}
          accept="image/*"
          hidden
          onChange={(e) => setFile(e.target.files[0])}
        />
        <img
          className="rounded-full self-center w-40 object-cover cursor-pointer"
          src={formData.photo || currentUser.photo}
          alt="Profile Image"
          onClick={() => filePickerRef.current.click()}
        />
        <p className="text-center">
          <span className=" text-green-600">
            {progress > 0 ? `Uploaded ${progress}% suceessfully!` : ""}
          </span>
        </p>
        <input
          type="text"
          placeholder="User Name"
          defaultValue={currentUser.username}
          id="username"
          onChange={handleChange}
          className="p-3 rounded-lg border"
        />
        <input
          type="email"
          placeholder="Email"
          defaultValue={currentUser.email}
          id="email"
          onChange={handleChange}
          className="p-3 rounded-lg border"
        />
        <input
          type="password"
          placeholder="Password"
          id="password"
          onChange={handleChange}
          className="p-3 rounded-lg border"
        />
        <button
          disabled={loading}
          className="p-3 bg-green-600 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-85"
        >
          Update My Details
        </button>
      </form>
      <div className="flex justify-between mt-7">
        <span className="font-semibold text-red-600 cursor-pointer">
          Delete account
        </span>
        <span
          className="font-semibold text-red-600 cursor-pointer"
          onClick={onSignOutClick}
        >
          Sign out
        </span>
      </div>
    </div>
  );
}
