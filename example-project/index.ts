import User from "./user";

export function createUser (name: string): User {
    if(!name) throw { code: "NAME_IS_REQUIRED" };
    return new User(name);
}