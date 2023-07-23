import { Role } from './generated/graphql';

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

export const getUser = (token: string) => {
  return new Promise<User | undefined>((res) => {
    setTimeout(() => res(users.find(({ email }) => email === token)), 500);
  });
};
