import { type JSX, useEffect, useState } from "react";
import "./App.css";
import Header from "./Header.tsx";
import Create from "./Create.tsx";

export interface Blog {
  id: number;
  createdAt: string;
  contents?: string;
  filename?: string;
  isImage?: boolean;
}

export default function App(): JSX.Element {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    fetch("/api/blogs", { method: "GET" })
      .then((res) => res.json())
      .then((res) => setBlogs(res));
  }, []);

  return (
    <div>
      <Header />
      {blogs.length === 0 ? (
        <p>No blogs available.</p>
      ) : (
        <ul>
          {blogs.map((blog) => (
            <li key={blog.id}>
              <h2>
                <a href={`/blog?id=${blog.id}`}>{`Blog #${blog.id}`}</a>
              </h2>
              <p>{blog.contents?.slice(0, 100)}...</p>
            </li>
          ))}
        </ul>
      )}
      <Create />
    </div>
  );
}
