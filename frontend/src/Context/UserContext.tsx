import React, { createContext, useContext, useState, useEffect } from 'react';

type User = {
  id: string;
  username: string;
  password: string;
  role: string;
};

interface UserContextValue {
  userList: User[];
  updateUserList: (newUser: User) => void;
  updateUser: (updatedUser: User) => void;
  deleteUser: (userId: string) => void;
  setUsersList: (newUserList: User[]) => void;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userList, setUserList] = useState<User[]>([]);

    const token = sessionStorage.getItem('token') || '';
  const updateUserList = (newUser: User) => {
    setUserList([...userList, newUser]);
  };

  const updateUser = (updatedUser: User) => {
    const userIndex = userList.findIndex((user) => user.id === updatedUser.id);

    if (userIndex !== -1) {
      const updatedUsers = [...userList];
      updatedUsers[userIndex] = updatedUser;
      setUserList(updatedUsers);
    }
  };

  const deleteUser = (userId: string) => {
    const updatedUsers = userList.filter((user) => user.id !== userId);
    setUserList(updatedUsers);
  };

  const setUsersList = (newUserList: User[]) => {
    setUserList(newUserList);
  }



  return (
    <UserContext.Provider value={{ userList, updateUserList, updateUser, deleteUser , setUsersList}}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw Error('useUser must be used within a UserProvider');
  }
  return context;
}
