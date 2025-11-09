import type { Request } from "express";
import type jwt from "jsonwebtoken";
import passport from "passport";
import { UserRepository } from "@/api/user/userRepository";
import type { User } from "../api/user/userModel";
import { env } from "../common/utils/envConfig";

const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const LocalStrategy = require("passport-local").Strategy;

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    UserRepository.authenticate()
  )
);

type Param = Parameters<typeof passport.serializeUser>;

// passport.use(UserRepository.createStrategy());
passport.serializeUser(UserRepository.serializeUser() as (user: Param[0] | User, fn: Param[1]) => void);
passport.deserializeUser(UserRepository.deserializeUser());

// Setup JWT options
const opts = {
  secretOrKey: env.JWT_SECRET,
  jwtFromRequest: ExtractJwt.fromExtractors([
    ExtractJwt.fromUrlQueryParameter("authorization"),
    ExtractJwt.fromUrlQueryParameter("Authorization"),
    ExtractJwt.fromAuthHeaderAsBearerToken(),
  ]),
  passReqToCallback: true,
};

type callback = (err: Error | null, user: boolean | User) => void;

passport.use(
  new JwtStrategy(opts, async (_req: Request, jwtPayload: jwt.JwtPayload, done: callback) => {
    //If the token has expiration, raise unauthorized
    const expirationDate = new Date((jwtPayload.exp as number) * 1000);

    if (expirationDate < new Date()) {
      return done(null, false);
    }

    try {
      const user = await UserRepository.findOne({ username: jwtPayload.user }).lean();
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
        // or you could create a new account
      }
    } catch (err) {
      return done(err as Error, false);
    }
  })
);
