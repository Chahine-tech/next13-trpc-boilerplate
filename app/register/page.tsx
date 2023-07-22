"use client";
import { signIn } from "next-auth/react";
import { FormEvent } from "react";

export default function Page() {
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const form = new FormData(e.target as HTMLFormElement);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: form.get("username"),
        email: form.get("email"),
        password: form.get("password"),
      }),
    });
    const data = await res.json();
    if (!data.user) return null;
    await signIn("credentials", {
      username: data.user.username,
      password: form.get("password"),
      callbackUrl: "/",
    });
  }

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <h2>Register</h2>
        <label htmlFor="username">Username:</label>
        <input type="text" id="username" name="username" required />
        <label htmlFor="password">Password:</label>
        <input type="password" id="password" name="password" required />
        <label htmlFor="password">Email:</label>
        <input type="text" id="email" name="email" required />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
