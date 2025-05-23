import { LoginForm } from "@/components/login-form/login-form";
import path from "path";

export default function LoginPage() {
    const isElectron = typeof window !== "undefined" && window.process?.type;
    const imagePath = isElectron
        ? `file://${path.join(__dirname, "login-bg.png")}`
        : "/login-bg.png";

    return (
        <div className="flex h-screen z-50 bg-white absolute inset-0 items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-lg flex-1 mx-auto p-8 space-y-6">
                <h1 className="text-2xl font-semibold font-sans">Login</h1>
                <h3 className="text-xl font-semibold font-sans">
                    See your growth and get support!
                </h3>
                <LoginForm />
            </div>
            <div className="relative hidden md:block flex-1">
                <img
                    src={imagePath}
                    alt="Image"
                    height={400}
                    width={800}
                    className="h-full w-full max-h-[30rem] object-contain"
                />
            </div>
        </div>
    );
}
