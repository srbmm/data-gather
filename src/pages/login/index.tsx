import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Alert, Button, TextInput, Label } from "flowbite-react";

type LoginFormInputs = {
    username: string;
    password: string;
};

const LoginPage: React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormInputs>();

    const [loginError, setLoginError] = React.useState<string | null>(null);

    const onSubmit: SubmitHandler<LoginFormInputs> = (data) => {
        console.log("Form Data:", data);
        if (data.username === "admin" && data.password === "admin123") {
            setLoginError(null);
        } else {
            setLoginError("Invalid username or password.");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
                <h1 className="mb-6 text-2xl font-bold text-gray-900 text-center">Admin</h1>
                {loginError && (
                    <Alert color="failure" className="mb-4">
                        {loginError}
                    </Alert>
                )}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <Label htmlFor="username" value="Username" />
                        <TextInput
                            id="username"
                            type="text"
                            placeholder="Enter your username"
                            {...register("username", {
                                required: "Username is required",
                                minLength: {
                                    value: 3,
                                    message: "Username must be at least 3 characters",
                                },
                            })}
                            color={errors.username ? "failure" : "gray"}
                            helperText={errors.username?.message}
                        />
                    </div>
                    <div>
                        <Label htmlFor="password" value="Password" />
                        <TextInput
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            {...register("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 6,
                                    message: "Password must be at least 6 characters",
                                },
                            })}
                            color={errors.password ? "failure" : "gray"}
                            helperText={errors.password?.message}
                        />
                    </div>
                    <Button type="submit" className="w-full">
                        Login
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;