import { z } from "zod";


import { ActionState } from "@/lib/create-safe-action";
import { StripeRedirected } from "./schema";

export type InputType = z.infer<typeof StripeRedirected>;
export type ReturnType = ActionState<InputType, string>;

