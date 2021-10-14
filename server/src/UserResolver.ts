import { compare, hash } from "bcrypt";
import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
  Int,
} from "type-graphql";
import { createAccessToken, createRefreshToken } from "./auth";
import { User } from "./entity/User";
import { MyContext } from "./MyContext";
import { sendRefreshToken } from "./sendRefreshToken";
import { isAuth } from "./isAuth";
import { verify } from "jsonwebtoken";
import { getConnection } from "typeorm";

@ObjectType()
class LoginResonpse {
  @Field()
  accessToken: string;

  @Field(() => User)
  user: User;
}

@Resolver()
export class UserResolver {
  @Query(() => String)
  hello() {
    return "hi";
  }

  @Query(() => String)
  @UseMiddleware(isAuth)
  bye(@Ctx() { payload }: MyContext) {
    console.log(payload);
    return `Your user id is: ${payload!.userId}`;
  }

  @Query(() => [User])
  users() {
    return User.find();
  }

  @Query(() => User, { nullable: true })
  async me(@Ctx() context: MyContext) {
    const authorization = context.req.headers["authorization"];

    if (!authorization) {
      return null;
    }

    try {
      const token = authorization.split(" ")[1];
      const payload: any = verify(token, process.env.ACCESS_TOKEN_SECRET!);
      return User.findOne(payload.userId);
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  @Mutation(() => Boolean)
  async revokeRefreshTokensForUser(@Arg("userId", () => Int) userId: number) {
    await getConnection()
      .getRepository(User)
      .increment({ id: userId }, "tokenVersion", 1);
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { res }: MyContext) {
    sendRefreshToken(res, "");

    return true;
  }

  @Mutation(() => LoginResonpse)
  async login(
    @Arg("email", () => String) email: string,
    @Arg("password", () => String) password: string,
    @Ctx() { res }: MyContext
  ): Promise<LoginResonpse> {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error("could not find user");
    }

    const valid = await compare(password, user.password);

    if (!valid) {
      throw new Error("bad password");
    }

    // login successful

    sendRefreshToken(res, createRefreshToken(user));

    return {
      accessToken: createAccessToken(user),
      user,
    };
  }
  @Mutation(() => Boolean)
  async register(
    @Arg("email", () => String) email: string,
    @Arg("password", () => String) password: string
  ) {
    const hashedPassword = await hash(password, 12);

    try {
      await User.insert({ email, password: hashedPassword });
    } catch (error) {
      console.log(error);
      return false;
    }
    return true;
  }
}
