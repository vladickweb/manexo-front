import { Avatar } from "@mantine/core";

import { IUser } from "@/types/user";

export const UserAvatar = ({
  user,
  size = "sm",
}: {
  user: IUser;
  size?: "sm" | "md" | "lg";
}) => {
  if (user.profileImageUrl) {
    return <Avatar src={user.profileImageUrl} size={size} />;
  }

  return (
    <Avatar size={size}>
      {user.firstName[0].toUpperCase()}
      {user.lastName[0].toUpperCase()}
    </Avatar>
  );
};
