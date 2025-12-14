import React from "react";
import ReusableDialog from "../ui/ReusableDialog";
import Input from "../ui/Input";
import { FaSpinner } from "react-icons/fa";

type Props = {
  open: boolean;
  setOpen: (v: boolean) => void;
  onSubmit: (formData: FormData) => Promise<void>;
  loading: boolean;
};

const SignupDialog: React.FC<Props> = ({ open, setOpen, onSubmit, loading }) => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await onSubmit(fd).then(() => setOpen(false)).catch(() => {});
  };

  return (
    <ReusableDialog open={open} setOpen={setOpen}>
      <div>
        <h3 className="text-lg font-semibold mb-3">Create Account</h3>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <Input name="username" placeholder="Username" required />
          <Input name="email" type="email" placeholder="Email" required />
          <Input name="password" type="password" placeholder="Password" required />
          <Input name="conf_password" type="password" placeholder="Confirm Password" required />

          <button className="bg-black text-white py-2 rounded-md hover:bg-gray-800 flex justify-center">
            {loading ? <FaSpinner className="animate-spin" /> : "Sign Up"}
          </button>
        </form>
      </div>
    </ReusableDialog>
  );
};

export default SignupDialog;
