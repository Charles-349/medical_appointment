import { eq, sql } from "drizzle-orm";
import db from "../Drizzle/db";
import { TIUser, UsersTable, AppointmentsTable,DoctorsTable } from "../Drizzle/schema";

export const createUserService = async(user:TIUser) =>{
    await db.insert(UsersTable).values(user);
    return "User created successfully";
}
export const getUserByEmailService = async (email: string) => {
    return await db.query.UsersTable.findFirst({
        where: sql`${UsersTable.email} = ${email}`

    });
};
export const verifyUserService = async(email : string) => {
    await db.update (UsersTable)
    .set({isVerified: true, verificationCode: null})
    .where(sql`${UsersTable.email} = ${email}`)
}
export const updateVerificationCodeService = async (
    email: string,
    verificationCode: string,
    expirationTime: Date
) => {
    await db.update(UsersTable)
        .set({
            verificationCode,
            verificationCodeExpiresAt: expirationTime
        })
        .where(sql`${UsersTable.email} = ${email}`);
};
export const userLoginService = async(user:TIUser) => {
    const { email } = user;
    return await db.query.UsersTable.findFirst({
        columns: {
            userID: true,
            firstName: true,
            lastName: true,
            email: true,
            password: true,
            contactPhone: true,
            address: true,
            role: true
        },
        where: sql`${UsersTable.email} = ${email}`
    });
};
//get user
export const getUserService = async()=> {
    const user = await db.query.UsersTable.findMany();
    return user;
};
//get user by id
export const getUserByIdService = async (id: number) => {
    const user = await db.query.UsersTable.findFirst({
        where : eq(UsersTable.userID, id)        
    })
    return user;
};
//update user
export const updateUserService = async (id: number, user: TIUser) => {
    const updatedUser = await db.update(UsersTable)
        .set(user)
        .where(eq(UsersTable.userID, id))
        .returning();
    
    if (updatedUser.length === 0) {
        return null;
    }
    return "User updated successfully";
}

//delete user
export const deleteUserService = async (id: number) => {
    const deletedUser = await db.delete(UsersTable)
        .where(eq(UsersTable.userID, id))
        .returning();
    
    if (deletedUser.length === 0) {
        return null;
    }
    return "User deleted successfully";
};

export const getUserWithAppointmentsService = async (id: number) => {
  return await db.query.UsersTable.findFirst({
    where: eq(UsersTable.userID, id),
    with: {
      appointments: {
        columns: {
          appointmentID: true,
          appointmentDate: true,
          timeSlot: true,
          totalAmount: true,
          appointmentStatus: true
        }
      }
    }
  });
};

export const getUserWithAppointmentsAndPaymentsService = async (id: number) => {
  return await db.query.UsersTable.findFirst({
    where: eq(UsersTable.userID, id),
    with: {
      appointments: {
        columns: {
          appointmentID: true,
          appointmentDate: true,
          timeSlot: true,
          totalAmount: true,
          appointmentStatus: true
        },
        with: {
          payment: {
            columns: {
              paymentID: true,
              amount: true,
              paymentStatus: true,
              paymentDate: true
            }
          }
        }
      }
    }
  });
};


export const getUserWithPrescriptionsService = async (id: number) => {
  return await db.query.UsersTable.findFirst({
    where: eq(UsersTable.userID, id),
    with: {
      prescriptions: {
        columns: {
          prescriptionID: true,
          notes: true
        }
      }
    }
  });
};

export const getUserWithComplaintsService = async (id: number) => {
  return await db.query.UsersTable.findFirst({
    where: eq(UsersTable.userID, id),
    with: {
      complaints: {
        columns: {
          complaintID: true,
          subject: true,
          description: true,
          status: true
        }
      }
    }
  });
};


export const getUserWithAppointmentsAndDoctorsService = async (id: number) => {
  return await db.query.UsersTable.findFirst({
    where: eq(UsersTable.userID, id),
    with: {
      appointments: {
        columns: {
          appointmentID: true,
          appointmentDate: true,
          timeSlot: true
        },
        with: {
          doctor: {
            columns: {
              doctorID: true,
              firstName: true,
              lastName: true,
              specialization: true
            }
          }
        }
      }
    }
  });
};



