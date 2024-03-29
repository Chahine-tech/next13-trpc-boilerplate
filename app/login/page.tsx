"use client";
import { signIn } from "next-auth/react";
import { FormEvent } from "react";

export default function Page() {
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const form = new FormData(e.target as HTMLFormElement);

    await signIn("credentials", {
      username: form.get("username"),
      password: form.get("password"),
      callbackUrl: "/",
    });
  }
  return (
    <>
      <div className="container">
        <form onSubmit={handleSubmit}>
          <h2>Login</h2>
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" name="username" required />
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" required />
          <button type="submit">Submit</button>
        </form>
      </div>
    </>
  );
}
