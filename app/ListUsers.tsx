"use client";

import { trpc } from "@/utils/trpc";
import Image from "next/image";
import React from "react";

export default function ListUsers() {
  let { data: users, isLoading, isFetching } = trpc.getUsers.useQuery();

  if (isLoading || isFetching) {
    return <p>Loading...</p>;
  }

  return (
    <div
    className="grid grid-cols-4 gap-20"
    >
      {users?.map((user) => (
        <div
          key={user.id}
          className="border border-gray-300 text-center"
        >
          <Image
            src={`https://robohash.org/${user.id}?set=set2&size=180x180`}
            alt={user.name}
            width={180}
            height={180}
           
          />
          <h3>{user.name}</h3>
        </div>
      ))}
    </div>
  );
}