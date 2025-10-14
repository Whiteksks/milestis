import { z } from "zod";

export const signUpSchema = z.object({
  firstname: z.string().min(1, "Введите имя"),
  lastname: z.string().min(1, "Введите фамилию"),
  useremail: z.string().email("Неверный email"),
  userpassword: z.string().min(8, "Пароль должен быть минимум 8 символов"),
});

export type SignUpFormData = z.infer<typeof signUpSchema>;
