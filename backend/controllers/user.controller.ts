import { User } from "../models/user.model";
import { ApiError, ApiResponse, asynchandler } from "../utils/apihandler";
import { FindUserControllerValidator } from "../validators/user.validator";


export const loginController = asynchandler({
    fn: async (event, data) => {
        const dataValidation = FindUserControllerValidator.safeParse(data);
        if (!dataValidation.success)
            return event.returnValue = new ApiError(400, "Invalid Data");
        const user = await User.findOne({
            where: {
                email: data.email,
            },
            raw:true
        });   
        if (!user || user.password != data.password)
            return event.returnValue= new ApiError(400, "Invalid Email or Password");
        return event.returnValue = new ApiResponse(200, {}, "Login Sucess")
    }
});

