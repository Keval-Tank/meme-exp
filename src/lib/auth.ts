import { betterAuth } from "better-auth";
import { prisma } from "./prisma";
import {emailOTP} from 'better-auth/plugins'

export const auth = betterAuth({
    database: prisma
});