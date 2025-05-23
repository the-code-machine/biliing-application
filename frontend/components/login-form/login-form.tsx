import { loginMutationHandler } from "@/action-handlers/mutation.handlers"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { LoginFormSchema, LoginFormType } from "@/utils/form-types.utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
    const loginForm = useForm<LoginFormType>({
        resolver: zodResolver(LoginFormSchema)
    });
    const router=useRouter();
    const handleSubmitMutation=useMutation({
        mutationFn:loginMutationHandler,
        onSuccess:(data)=>{
            if(data.error)
            return toast.error("Invalid Email or Password");
           toast.success("Login Sucess");
          router.push(`/?auth=true`)
        }
    })
    return (
        <div className={cn("h-full", className)} {...props}>
            <Form {...loginForm} >
                <form onSubmit={loginForm.handleSubmit((data)=>handleSubmitMutation.mutate(data))} className="space-y-4">
                    <FormField
                        control={loginForm.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                <Input id="email" placeholder="Enter Email"  {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                <Input id="password" placeholder="Enter Password"  {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full">
                        Login
                    </Button>
                </form>
            </Form>
        </div>
    )
}

