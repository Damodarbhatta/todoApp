"use client";

import React, { ChangeEvent, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useMutation, useQuery } from "convex/react";
import { useUser } from "@clerk/clerk-react";
import { api } from "@/convex/_generated/api";
import { todo } from "node:test";
import { Id } from "@/convex/_generated/dataModel";

const Todo = () => {
  const [task, setTask] = useState<string>("");
  const [newText, setNewText] = useState<string>("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const { user } = useUser();
  
  const createTodo = useMutation(api.document.addNewTask);
  let allTodos;
  if (user) {
    allTodos = useQuery(api.document.getTaskList, { userId: user.id });
  }

  const deleteTodo = useMutation(api.document.deleteTaskList);

  const handleDelete = (itemId: Id<"messages">) => {
    deleteTodo({ id: itemId });
  };

  const updateTodo = useMutation(api.document.updateTask);

  const handleUpdate = async (id: any) => {
    await updateTodo({
      id,
      text: newText,
    });
    setEditingId(null);
  };

  const handleClick = () => {
    if (user) {
      createTodo({
        text: task,
        title: "untitled",
        userId: user.id,
      });
      setTask("");
    }
  };
  return (
    <div className="flex flex-col h-full items-center">
      <div className="flex justify-center items-center mt-16">
        <div className=" border-spacing-5 border-black">
          <h1 className="">Todo App:</h1>
          <div className="flex my-3">
            <Input
              type="text"
              placeholder="Enter any text..."
              className="mr-4"
              required
              value={task}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setTask(e.target.value)
              }
            />
            <Button type="submit" onClick={handleClick}>
              Add
            </Button>
          </div>
        </div>
      </div>
      <div>
        {allTodos?.map((item: any) => (
          <div key={item._id}>
            {/* <input
              type="text"
              value={editingId === item._id ? newText : item.text}
              disabled={editingId !== item._id}
              onChange={(e) => setNewText(e.target.value)}
            />
            <Button onClick={() => handleDelete(item._id)}>Delete</Button>
           {
            editingId ? (
              <Button onClick={() => handleUpdate(item._id)}>Save</Button>
              ) : (
                <Button onClick={() => setEditingId(item._id)}>Update</Button>
                
              )  
            } */}
            {editingId === item._id ? (
              <>
                <input
                  type="text"
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                />
                <Button onClick={() => handleUpdate(item._id)}>Save</Button>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <div>{item.text}</div>
                <Button onClick={() => handleDelete(item._id)}>Delete</Button>
                <Button onClick={() => setEditingId(item._id)}>Update</Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Todo;
