import { Request, Response } from 'express';
import bcrypt from "bcrypt"
import { createUserService,deleteUserService,updateUserService,getUserByIdService, getUserService,userLoginService, getUserByEmailService,verifyUserService , updateVerificationCodeService, getUserWithAppointmentsService,getUserWithAppointmentsAndPaymentsService,getUserWithAppointmentsAndDoctorsService,getUserWithPrescriptionsService,getUserWithComplaintsService  } from './user.service';
import { sendEmail } from '../mailer/mailer';
import jwt from "jsonwebtoken";

export const createUserController = async(req: Request, res: Response) => {
    try {
        const user = req.body;
        const password = user.password;
        if(!password || password.length<6){
            return res.status(400).json({message: "password must be atleast 6 characters long"});

        }
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;

        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expirationTime = new Date (Date.now() +3 * 60 * 1000);
        user.verificationCode = verificationCode;
        user.verificationCodeExpiresAt = expirationTime;
        user.isVerified = false;
        const createUser = await createUserService(user);
        if(!createUser) return res. json({message : "User not created"})
            try {
                 await sendEmail(
                    user.email,
                    "Verify your account",
                    `Hello ${user.firstName}, your verification code is: ${verificationCode}. Please use this code to verify your account`,
                    `<div>
                        <h2>Hello ${user.firstName},</h2>
                        <p>Your verification code is <strong>${verificationCode}</strong>.</p>
                        <p>Please use this code to verify your account.</p>
                        <p>Thank you!</p>
                    </div>`
                 );
                
            } catch (emailError) {
                console.error("Failed to send verification email:", emailError);
                
            }
        
    } catch (error: any) {
        return res.status(500).json({
            message: error.message
        });
    }
};
export const verifyUserController = async (req: Request, res: Response) => {
    const { email, code } = req.body;
    try {
        const user = await getUserByEmailService(email);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
          // Insert expiration check 
        if (!user.verificationCodeExpiresAt || new Date() > new Date(user.verificationCodeExpiresAt)) {
            return res.status(400).json({ message: "Verification code has expired. Please request a new one." });
        }

        if (user.verificationCode === code) {
            await verifyUserService(email);

            // Send verification success email
            try {
                await sendEmail(
                    user.email,
                    "Account Verified Successfully",
                    `Hello ${user.lastName}, your account has been verified. You can now log in and use all features.`,
                    `<div>
                    <h2>Hello ${user.lastName},</h2>
                    <p>Your account has been <strong>successfully verified</strong>!</p>
                     <p>You can now log in and enjoy our services.</p>
                     </div>`
                )

            } catch (error: any) {
                console.error("Failed to send verification success email:", error);

            }
            return res.status(200).json({ message: "User verified successfully" });
        } else {
            return res.status(400).json({ message: "Invalid verification code" });
        }
    } catch (error: any) {
        return res.status(500).json({ error: error.message });

    }
}

export const resendVerificationCodeController = async (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    try {
        const user = await getUserByEmailService(email);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: "User is already verified" });
        }

        // Generate new verification code
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expirationTime = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

        // Update code and expiration
        await updateVerificationCodeService(email, verificationCode, expirationTime);

        // Send new verification email
        await sendEmail(
            email,
            "New Verification Code",
            `Hello ${user.firstName}, here is your new verification code: ${verificationCode}`,
            `<div>
                <h2>Hello ${user.firstName},</h2>
                <p>Your new verification code is <strong>${verificationCode}</strong>.</p>
                <p>Please use this code to verify your account.</p>
            </div>`
        );

        return res.status(200).json({ message: "New verification code sent successfully" });

    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};
export const userLoginController = async (req: Request, res: Response) => {
    try {
        const user = req.body;
//check if user exists
        const userExist = await userLoginService(user);
        if (!userExist) {
            return res.status(404).json({ message: "user not found" });
        }
        //verify password
        const userMatch = await bcrypt.compare(user.password, userExist.password);
        if (!userMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        //create a payload for JWT
        const payload = {
            sub : userExist.userID,
            userID: userExist.userID,
            firstName: userExist.firstName,
            lastName: userExist.lastName,
            email: userExist.email,
            contactPhone: userExist.contactPhone,
            address: userExist.address,
            role: userExist.role,
            // exp : Math.floor(Date.now() / 1000) + 60  // 1 minute expiration
        };
        //generate JWT token
        const secret = process.env.JWT_SECRET_KEY as string;
        if (!secret) {
            throw new Error("JWT secret is not defined in the environment variables");
        }
        // const token = jwt.sign(payload, secret);
        const token = jwt.sign(payload, secret, { expiresIn: '3600s' });
        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                userID: userExist.userID,
                firstName: userExist.firstName,
                lastName: userExist.lastName,
                email: userExist.email,
                contactPhone: userExist.contactPhone,
                address: userExist.address,
                role: userExist.role
            }
        });
    } catch (error: any) {
        return res.status(500).json({message:error.message});
    }
};
export const getUserController = async (req: Request, res: Response) => {
      try {
        const users = await getUserService();
        if (!users || users.length === 0) {
            return res.status(404).json({ message: "No users found" });
        }
        return res.status(200).json({ message: "Users retrieved successfully", users });
    } catch (error: any) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}
//get user by id controller
export const getUserByIdController = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }
        const user = await getUserByIdService(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ message: "User retrieved successfully", user });
    } catch (error: any) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}
//update user controller
export const updateUserController = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(404).json({ message: "Invalid user ID" });
        }
        const user = req.body;
        const existingUser = await getUserByIdService(id);
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });

        }
        const updatedUser = await updateUserService(id, user);
        if (!updatedUser) {
            return res.status(404).json({ message: "User not updated" });
        }
        return res.status(200).json({ message: "User updated successfully" });

        
    } catch (error:any) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
        
    }
}

//delete user controller
export const deleteUserController = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(404).json({ message: "Invalid user ID" });
        }
        const existingUser = await getUserByIdService(id);
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }
        const deletedUser = await deleteUserService(id);
        if (!deletedUser) {
            return res.status(404).json({ message: "User not deleted" });
        }
        return res.status(200).json({ message: "User deleted successfully" });
        
    } catch (error:any) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
        
    }
}

// Get User with Appointments
export const getUserWithAppointmentsController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    const user = await getUserWithAppointmentsService(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "User with appointments retrieved successfully", user });
  } catch (error: any) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


// Get User with Appointments AND Payments
export const getUserWithAppointmentsAndPaymentsController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    const user = await getUserWithAppointmentsAndPaymentsService(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "User with appointments and payments retrieved successfully", user });
  } catch (error: any) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


// Get User with Appointments AND Doctors
export const getUserWithAppointmentsAndDoctorsController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    const user = await getUserWithAppointmentsAndDoctorsService(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "User with appointments and doctors retrieved successfully", user });
  } catch (error: any) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


// Get User with Prescriptions
export const getUserWithPrescriptionsController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    const user = await getUserWithPrescriptionsService(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "User with prescriptions retrieved successfully", user });
  } catch (error: any) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


// Get User with Complaints
export const getUserWithComplaintsController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    const user = await getUserWithComplaintsService(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "User with complaints retrieved successfully", user });
  } catch (error: any) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};




