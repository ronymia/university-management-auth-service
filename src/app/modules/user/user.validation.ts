import { z } from "zod";
const createUserZoSchema = z.object({
  body: z.object({
    role: z.string({
      required_error: "role is required",
    }),
    password: z.string().optional(),
  }),
});

export const UserValidation = {
  createUserZoSchema,
};
