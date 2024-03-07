"use client";
import React, { useState } from "react";
import { SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import { useConvexAuth } from "convex/react";
import Todo from "@/components/Todo";

export default function Home() {
  const  { isAuthenticated, isLoading } = useConvexAuth()
  if(isLoading){
    return (
      <div>
        is loading lol..
      </div>
    )
  }
  return (
    <div>
      <nav className="flex w-full justify-end px-4">
        {
          isAuthenticated ? (
            <UserButton />
          ) : (
            <SignInButton mode="modal">Sing in</SignInButton>
          )
        }
        
      </nav>
      {
        isAuthenticated ? (
          <Todo />
        ) :(
          <div>
            <SignInButton mode="modal">
              Please Sing in first
            </SignInButton>
          </div>
        )
      }
    </div>
  );
}

// Return the TodoApp component to be rendered
