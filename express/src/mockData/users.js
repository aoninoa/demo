const users = [
  { userid: "w0000001", passwd: "123", username: "山田" },
  { userid: "w0000002", passwd: "456", username: "田中" },
  { userid: "w0000003", passwd: "789", username: "佐藤" },
];

export const findOne = (userid) => {
  return structuredClone(users.filter((user) => user.userid === userid)[0]);
};
