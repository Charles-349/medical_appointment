import { createUserController,updateUserController,deleteUserController ,getUserController,getUserByIdController, verifyUserController,userLoginController, resendVerificationCodeController } from "./user.controller";
import {Express} from "express";

const user = (app:Express) => {
    app.route("/user").post(async (req, res, next) =>{
        try {
            await createUserController(req, res);
            
        } catch (error) {
            next(error);
            
        }
    })
      //verify user route
    app.route("/user/verify").post(async (req, res, next) => {
        try {
            await verifyUserController(req, res);
        } catch (error) {
            next(error);
        }
    }
    )

    //resend verification code route
    app.route("/user/resend-verification").post(async (req, res, next) => {
        try {
            await resendVerificationCodeController(req, res);
        } catch (error) {
            next(error);
        }
    }
    )
     app.route("/user/login").post(async (req, res, next) => {
        try {
            await userLoginController(req, res);
        } catch (error) {
            next(error);
        }
    }
    )
    app.route("/user").get(async (req, res, next) => {
        try {
            await getUserController(req, res);
        } catch (error) {
            next(error);
        }
    })
    app.route("/user/:id").get(async (req, res, next) => {
        try {
            await getUserByIdController(req, res);
        } catch (error) {
            next(error);
        }
        
    });
    app.route("/user/:id").put(async (req, res, next) => {
        try {
            await updateUserController(req, res);
        } catch (error) {
            next(error);
        }
    }
    )

    //delete user by id
    app.route("/user/:id").delete(async (req, res, next) => {
        try {
            await deleteUserController(req, res);
        } catch (error) {
            next(error);
        }
    }
    )
};
export default user;