import { z } from "zod";
import * as Dotenv from "dotenv";

Dotenv.config();

const Env = z.object({
  VIEWS_DIR: z.string().min(1),
  CMS_ADD_USER_PATH: z.string().min(1), // comma-separated
  CMS_ADD_PARTICIPATION_PATH: z.string().min(1), // comma-separated
  CONTEST_ID: z.coerce.number().safe(),
  PORT: z.coerce.number().safe(),
});

export const ENV = Env.parse(process.env);
