import { Request, Response } from "express";
import * as Yup from "yup";
import UserModel from "../models/user.model";
import { encrypt } from "../utils/encryption";
import { generateToken } from "../utils/jwt";
import { IReqUser } from "../middlewares/auth.middleware";
// initialize the data types
type TRegister = {
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type TLoogin = {
  identifier: string;
  password: string;
};
// buat validasi schema
const registerValidateSchema = Yup.object({
  fullName: Yup.string().required(),
  username: Yup.string().required(),
  email: Yup.string().email().required(),
  password: Yup.string().required(),
  confirmPassword: Yup.string()
    .required()
    .oneOf([Yup.ref("password"), ""], "Password Not Match"),
});
// buat controller Register
export default {
  async register(req: Request, res: Response) {
    // ambil data user dari request body
    const { fullName, username, email, password, confirmPassword } =
      req.body as unknown as TRegister;

    // Simpan data user ke database
    try {
      // pertama gunakan registerValidateschema untuk validasi data
      await registerValidateSchema.validate({
        fullName,
        username,
        email,
        password,
        confirmPassword,
      });
      // jika validasi sukses maka lanjut untuk membuat data user
      const result = await UserModel.create({
        fullName,
        username,
        email,
        password,
      });
      // mengembalikan response status 200 / berhasil dengan message dan data user yang berhasil dibuat
      res.status(200).json({
        message: "Success Registration",
        data: result,
      });
    } catch (error) {
      const err = error as unknown as Error;
      // jika validasi gagal maka kirim response status 400 / bad request dengan message error
      res.status(400).json({
        message: err.message,
        data: null,
      });
    }
  },

  async login(req: Request, res: Response) {
    /**
     #swagger.requestBody ={
     required: true,
     schema: {$ref: "#/components/schemas/LoginRequest"}
     }
     */
    try {
      // Ambil data user berdasarkan indentifier -> email dan username

      const { identifier, password } = req.body as unknown as TLoogin;
      const userByIdentifier = await UserModel.findOne({
        $or: [
          {
            email: identifier,
          },
          {
            username: identifier,
          },
        ],
      });

      if (!userByIdentifier) {
        return res.status(404).json({
          message: "User not found",
          data: null,
        });
      }
      // validasi password
      const validatePassword: boolean =
        encrypt(password) === userByIdentifier.password;

      if (!validatePassword) {
        return res.status(404).json({
          message: "User Not Found",
          data: null,
        });
      }

      const token = generateToken({
        id: userByIdentifier._id,
        role: userByIdentifier.role,
      });

      res.status(200).json({
        message: "Login Success",
        data: token,
      });
    } catch (error) {
      const err = error as unknown as Error;
      // jika validasi gagal maka kirim response status 400 / bad request dengan message error
      res.status(400).json({
        message: err.message,
        data: null,
      });
    }
  },

  async me(req: IReqUser, res: Response) {
    /**
     #swagger.security =[{
      "bearerAuth": []
     }]
     */
    try {
      const user = req.user;

      const result = await UserModel.findById(user?.id);

      res.status(200).json({
        message: "Success Get User Profile",
        data: result,
      });
    } catch (error) {
      const err = error as unknown as Error;
      // jika validasi gagal maka kirim response status 400 / bad request dengan message error
      res.status(400).json({
        message: err.message,
        data: null,
      });
    }
  },
};
