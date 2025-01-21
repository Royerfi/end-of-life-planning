'use client';

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

type User = {
  name: string | null;
  avatar: string | null;
};

export default function Header({ user }: { user: User }) {
  return (
    <header className="flex items-center space-x-4 p-4 bg-gray-100 shadow">
      <Avatar>
        <AvatarImage
          src={user.avatar ?? '/default-avatar.png'}
          alt={user.name ?? 'User'}
        />
        <AvatarFallback>
          {user.name?.charAt(0).toUpperCase() ?? 'U'}
        </AvatarFallback>
      </Avatar>
      <div>
        <p className="text-lg font-semibold">{user.name ?? 'Guest'}</p>
        <p className="text-sm text-gray-500">Welcome back!</p>
      </div>
    </header>
  );
}