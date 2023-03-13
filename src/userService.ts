import { Role } from './generated/graphql';

export const getUser = (token: string) => {
  const roles = ['USER', 'ADMIN'];
  return {
    hasRole: (role: Role): Promise<boolean> => {
      const tokenIndex = roles.indexOf(token);
      const roleIndex = roles.indexOf(role);
      return new Promise((res) => {
        setTimeout(() => {
          if (tokenIndex) {
            return res(roles[tokenIndex] === role);
          }
          return res(roleIndex >= 0 && tokenIndex >= roleIndex);
        }, 1000);
      });
    },
  };
};
