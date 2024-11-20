const users = [
  { 
    userID: "w0000001", 
    password: "123", 
    userName: "田中 太郎", 
    prefecture: "岡山県" 
  },
  { 
    userID: "w0000002", 
    password: "456", 
    userName: "佐藤 洋子", 
    prefecture: "広島県" 
  },
  { 
    userID: "w0000003", 
    password: "789", 
    userName: "鈴木 実", 
    prefecture: "山口県" 
  }
];

export const findOne = (userID) => {
  return structuredClone(users.filter(user => user.userID === userID[0]));
};
