import { randomBytes } from "node:crypto";
import * as Encrypt from "./encryptPassword";
import { readFileData, updateDataList } from "./fileService";
import { TUser } from "../../types/models";

const userFileName = "users.json";

const withoutPassword = (user: TUser): TUser => {
  const { password, ...publicUser } = user;
  return publicUser as TUser;
};

export const login = async (email: string, password: string) => {
  const foundUser = (await readFileData<TUser>(userFileName)).find(
    (item) => item.email.toLowerCase() === email.toLowerCase(),
  );
  if (
    !foundUser ||
    !(await Encrypt.comparePassword(password, foundUser.password))
  ) {
    return null;
  }
  return withoutPassword(foundUser);
};

export const addNewUser = async (data: Partial<TUser>) => {
  const email = typeof data.email === "string" ? data.email.trim() : "";
  const password = data.password;

  if (!email || !password) {
    throw new Error("Email and password are required.");
  }

  const normalizedEmail = email.toLowerCase();
  const hashedPassword = await Encrypt.hashPassword(password);
  const now = new Date().toISOString();

  return updateDataList(userFileName, (users: TUser[]) => {
    if (users.some((user) => user.email.toLowerCase() === normalizedEmail)) {
      throw new Error("EMAIL_EXISTS");
    }

    const newUser = {
      _id: randomBytes(12).toString("hex"),
      ...data,
      password: hashedPassword,
      createdAt: now,
      updatedAt: now,
      allowToShareSettings: false,
      watchlist: [],
    } as TUser;
    users.push(newUser);

    return withoutPassword(newUser);
  });
};

export const setAllowToShare = async (userId: string, allowed: boolean) => {
  return updateDataList(userFileName, (users: TUser[]) => {
    const user = users.find((item) => item._id === userId);
    if (!user) return null;

    user.allowToShareSettings = allowed;
    user.updatedAt = new Date().toISOString();
    return withoutPassword(user);
  });
};

export const getShareableUsers = async () => {
  return (await readFileData<TUser>(userFileName))
    .filter((user) => user.allowToShareSettings)
    .map(withoutPassword);
};
