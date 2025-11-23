import { useEffect, useState } from 'react';
import axiosInstance from '../../../public/connect';
import { toast } from 'react-toastify';
import { useForm } from '@mantine/form';
import { Dropzone } from '@mantine/dropzone';

interface AuthDetails {
  username: string;
  email: string;
  phone?: string;
  avatar?: string;
}

const AuthView = () => {
  const [dets, setDets] = useState<AuthDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm({
    initialValues: {
      email: '',
      avatar: null as File | null,
      phone: ''
    }
  });

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get('/me/');
        setDets(res.data);

        form.setValues({
          email: res.data.email,
          phone: res.data.phone ?? '',
          avatar: null,
        });

      } catch (error) {
        toast.error('A Problem has Occured');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSubmit = async () => {
    const data = new FormData();

    Object.entries(form.values).forEach(([key, value]) => {
      if (value !== null && value !== '') {
        data.append(key, value as any);
      }
    });

    try {
      await axiosInstance.patch('/me/', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to update profile!');
    }
  };

  if (!dets || loading) return <p className="text-center py-20">Loading...</p>;

  return (
    <div className="flex justify-center py-12 px-4 min-h-screen">

      <div className="w-full max-w-xl  border border-red-600 rounded-2xl shadow-xl p-8">

        {/* Header */}
        <div className="flex flex-col items-center space-y-3">
          <img
            src={dets.avatar || "https://via.placeholder.com/150"}
            className="w-32 h-32 rounded-full object-cover border-2 border-red-600"
            alt="profile"
          />
          <h1 className="text-3xl font-bold">{dets.username}</h1>
          <p className="text-gray-400">{dets.email}</p>
        </div>

        <div className="border-t border-red-700/40 my-8"></div>

        {/* FORM */}
        <form onSubmit={form.onSubmit(handleSubmit)} className="space-y-6">

          <h2 className="text-xl font-semibold">Update Profile</h2>

          {/* EMAIL */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Email</label>
            <input
              type="email"
              className="w-full border border-red-600  p-3 rounded-lg focus:ring-2 focus:ring-red-600 outline-none"
              {...form.getInputProps('email')}
            />
          </div>

          {/* PHONE */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Phone Number</label>
            <input
              type="text"
              className="w-full border border-red-600 p-3 rounded-lg focus:ring-2 focus:ring-red-600 outline-none"
              {...form.getInputProps('phone')}
            />
          </div>

          {/* AVATAR UPLOAD */}
          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">
              Profile Picture
            </label>

            <Dropzone
              accept={['image/png', 'image/jpeg']}
              onDrop={(files) => form.setFieldValue('avatar', files[0])}
              className="border-2 border-red-600 border-dashed p-10 rounded-xl  text-center text-gray-400 cursor-pointer"
            >
              {form.values.avatar
                ? `Selected: ${form.values.avatar.name}`
                : "Click or drop image to upload"}
            </Dropzone>

            {/* Preview */}
            {form.values.avatar && (
              <img
                src={URL.createObjectURL(form.values.avatar)}
                alt="Preview"
                className="w-24 h-24 rounded-full mx-auto mt-4 border border-red-600"
              />
            )}
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 transition text-white p-3 rounded-lg font-semibold cursor-pointer"
          >
            Save Changes
          </button>

        </form>

      </div>
    </div>
  );
};

export default AuthView;
