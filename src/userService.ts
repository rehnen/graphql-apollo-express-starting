import { selectUserQuery } from './db/db';
import { Role } from './generated/graphql';
import jwt from 'jsonwebtoken';

export type User = {
  firstName: string;
  lastName: string;
  email: string;
  roles: Role[];
};

const users: User[] = [
  {
    firstName: 'Marcus',
    lastName: 'Rehn',
    email: 'marcus.rehn@hotmail.com',
    roles: ['USER', 'ADMIN'],
  },
  {
    firstName: 'Not',
    lastName: 'Marcus',
    email: 'not.marcus@hotmail.com',
    roles: ['USER'],
  },
];

const isUser = (user: any): user is User => {
  console.log(JSON.stringify(user));
  return user?.email;
};

export const loginUser = async (
  email: string,
  password: string
): Promise<string> => {
  const user = await selectUserQuery(email, password);
  if (!isUser(user)) {
    return 'didnt find anything';
  }
  return jwt.sign(user, 'super secret');

};

// this is just a placeholder until we get jwts in place
export const getUser = (token: string) => {
  return new Promise<User | undefined>((res) => {
    setTimeout(() => res(users.find(({ email }) => email === token)), 500);
  });
};
