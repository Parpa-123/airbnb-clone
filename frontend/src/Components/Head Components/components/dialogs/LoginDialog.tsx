import React from "react";
import ReusableDialog from "../ui/ReusableDialog";
import Input from "../ui/Input";
import { FaSpinner } from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";

type Props = {
  open: boolean;
  setOpen: (v: boolean) => void;
};

const LoginDialog: React.FC<Props> = ({ open, setOpen }) => {
  const { doLogin, loading } = useAuth(); // note: we'll wrap provider or use hook directly in Header

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      username: String(fd.get("login_username")),
      password: String(fd.get("login_password")),
    };

    await doLogin(data).then(() => setOpen(false)).catch(() => { });
  };

  return (
    <ReusableDialog open={open} onOpenChange={setOpen}>
      <div>
        <h3 className="text-lg font-semibold mb-3">Log In</h3>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <Input name="login_username" placeholder="Username" required />
          <Input name="login_password" type="password" placeholder="Password" required />

          <button className="bg-black text-white py-2 rounded-md flex justify-center hover:bg-gray-800 cursor-pointer">
            {loading ? <FaSpinner className="animate-spin" /> : "Log In"}
          </button>
        </form>
      </div>
    </ReusableDialog>
  );
};

export default LoginDialog;
