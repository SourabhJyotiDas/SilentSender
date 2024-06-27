"use client";
import axios from "axios";
import { useSession, signIn, signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState } from "react";

export default function Component() {
  
  const { data: session } = useSession();

  console.log("session data is here--- ", session);

  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState("");

  const registerHandler = async (e: any) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        "http://localhost:3000/api/signup",
        { username, email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(data);
      setUser(data);
      // if (data.success) return redirect("/");
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  // if (user.success) return redirect("/kela");

  return (
    <>
      {/* email, username, password */}
      <div className="flex flex-col  w-[30vw] mx-auto">
        <h2 className="text-white text-lg mb-1 font-medium title-font">
          Feedback
        </h2>
        <p className="leading-relaxed mb-5">
          Post-ironic portland shabby chic echo park, banjo fashion axe
        </p>
        <div className="relative mb-4">
          <label htmlFor="name" className="leading-7 text-sm text-gray-400">
            Username
          </label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            id="name"
            name="name"
            className="w-full bg-gray-800 rounded border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-900 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
          />
        </div>
        <div className="relative mb-4">
          <label htmlFor="email" className="leading-7 text-sm text-gray-400">
            Email
          </label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            id="email"
            name="email"
            className="w-full bg-gray-800 rounded border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-900 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
          />
        </div>
        <div className="relative mb-4">
          <label htmlFor="email" className="leading-7 text-sm text-gray-400">
            Password
          </label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            id="password"
            name="password"
            className="w-full bg-gray-800 rounded border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-900 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
          />
        </div>

        <button
          onClick={registerHandler}
          className="text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg">
          Button
        </button>
        <p className="text-xs text-gray-400 text-opacity-90 mt-3">
          Chicharrones blog helvetica normcore iceland tousled brook viral
          artisan.
        </p>
      </div>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  );
}
