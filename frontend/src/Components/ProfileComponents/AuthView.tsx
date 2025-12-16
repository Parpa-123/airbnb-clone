import { useEffect, useState } from "react";
import axiosInstance from "../../../public/connect";
import { toast } from "react-toastify";
import { useForm } from "@mantine/form";
import { Dropzone } from "@mantine/dropzone";

interface AuthDetails {
  username: string;
  email: string;
  phone?: string;
  avatar?: string;
}

const AuthView = () => {
  const [dets, setDets] = useState<AuthDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const form = useForm<{
    email: string;
    phone: string;
    avatar: File | null;
  }>({
    initialValues: {
      email: "",
      phone: "",
      avatar: null,
    },
  });

  /* ================= FETCH PROFILE ================= */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get("/me/");

        setDets(res.data);
        form.setValues({
          email: res.data.email,
          phone: res.data.phone ?? "",
          avatar: null,
        });
      } catch {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);


  /* ================= AVATAR PREVIEW ================= */
  useEffect(() => {
    if (!form.values.avatar) {
      setPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(form.values.avatar);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [form.values.avatar]);

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    const data = new FormData();

    if (form.values.email) data.append("email", form.values.email);
    if (form.values.phone) data.append("phone", form.values.phone);
    if (form.values.avatar) data.append("avatar", form.values.avatar);

    try {
      setLoading(true);
      await axiosInstance.patch("/me/", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Profile updated!");
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message ||
        error?.response?.data?.detail ||
        JSON.stringify(error?.response?.data) ||
        "Failed to update profile!";
      toast.error(errorMsg);
      console.error("Profile update error:", error?.response?.data);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !dets) {
    return <p className="text-center py-20">Loading...</p>;
  }

  if (!dets) return null;

  return (
    <div className="flex justify-center py-12 px-4 min-h-screen">
      <div className="w-full max-w-xl rounded-2xl shadow-xl p-8 bg-white">
        {/* ================= HEADER ================= */}
        <div className="flex flex-col items-center space-y-3">
          <img
            src={preview || dets.avatar || "https://via.placeholder.com/150"}
            className="w-32 h-32 rounded-full object-cover border"
            alt="profile"
          />
          <h1 className="text-3xl font-bold">{dets.username}</h1>
          <p className="text-gray-500">{dets.email}</p>
        </div>

        <div className="border-t my-8" />

        {/* ================= FORM ================= */}
        <form onSubmit={form.onSubmit(handleSubmit)} className="space-y-6">
          <h2 className="text-xl font-semibold">Update Profile</h2>

          {/* Email */}
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-red-600 outline-none"
              {...form.getInputProps("email")}
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm mb-1">Phone Number</label>
            <input
              type="text"
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-red-600 outline-none"
              {...form.getInputProps("phone")}
            />
          </div>

          {/* Avatar */}
          <div>
            <label className="block text-sm mb-2">Profile Picture</label>

            <Dropzone
              accept={{
                "image/png": [],
                "image/jpeg": [],
              }}
              onDrop={(files) =>
                form.setFieldValue("avatar", files[0] ?? null)
              }
              className="border-2 border-dashed p-10 rounded-xl text-center cursor-pointer"
            >
              {form.values.avatar
                ? `Selected: ${form.values.avatar.name}`
                : "Click or drop image to upload"}
            </Dropzone>

            {/* ================= PROFILE PREVIEW ================= */}
            {(preview || dets.avatar) && (
              <div className="mt-6 p-4 border rounded-xl flex items-center gap-4 bg-gray-50">
                <img
                  src={preview || dets.avatar}
                  alt="preview"
                  className="w-20 h-20 rounded-full object-cover border"
                />

              </div>
            )}
          </div>


          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 transition text-white p-3 rounded-lg font-semibold"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthView;
