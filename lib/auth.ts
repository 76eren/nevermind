import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { db } from "@/db";
import * as authSchema from "@/db/auth-schema";
import { nextCookies } from "better-auth/next-js";
import { username } from "better-auth/plugins/username";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: authSchema,
  }),

  emailAndPassword: {
    enabled: true,
  },

  user: {
    additionalFields: {
      firstName: {
        type: "string",
        required: true,
        input: true,
      },

      lastName: {
        type: "string",
        required: true,
        input: true,
      },
      bio: {
        type: "string",
        required: false,
        input: true,
      },
    },
  },

  disabledPaths: ["/sign-in/username"],

  plugins: [
    nextCookies(),

    username({
      displayUsername: false,
      minUsernameLength: 3,
      maxUsernameLength: 30,

      usernameValidator: (username) => {
        return /^[a-zA-Z0-9_.]+$/.test(username);
      },
    }),
  ],
});
