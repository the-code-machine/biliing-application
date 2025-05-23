import { z } from 'zod'

export const FindUserControllerValidator = z.object({
    email: z.string({
        message: "Email is required"
    }).email({
        message: "Invalid Email"
    }),
    password: z.string({
        message: "Password is required"
    }).min(8, {
        message: "Invalid Password"
    })
})
