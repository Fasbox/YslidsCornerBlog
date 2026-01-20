import type { User } from "@supabase/supabase-js";
import type { Env } from "../config/supabase";

export type AppBindings = Env;

export type AppVariables = {
  user: User;
};

export type AppContext = {
  Bindings: Env;
  Variables: {
    user: User; // si prefieres opcional: user?: User
  };
};