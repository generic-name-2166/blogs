import { type MouseEventHandler, useEffect, useState, type JSX } from "react";
import Header from "./Header.tsx";
import { Blog } from "./App.tsx";
import { setAuth } from "./util.ts";
import "./Blogs.css";
import Create from "./Create.tsx";

function Image({ filename }: { filename: string }): JSX.Element {
  const src = `/media/${filename}`;
  return <img src={src} alt={filename} />;
}

function Video({ filename }: { filename: string }): JSX.Element {
  const src = `/media/${filename}`;
  return (
    <video controls>
      <source src={src} />
      Download the <a href={src}>video</a>
    </video>
  );
}

function handleRemove(id: number): MouseEventHandler {
  return async (event): Promise<void> => {
    // Otherwise the link unloads the page and the delete request
    event.preventDefault();
    const headers = setAuth(localStorage.getItem("bearer"));
    if (!headers) {
      return;
    }
    await fetch(`/api/blogs/${id}`, { method: "DELETE", headers });
    location.href = (event.target as HTMLAnchorElement).href;
  };
}

export default function Blogs(): JSX.Element {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const id: number = parseInt(urlParams.get("id")!);

  const [blog, setBlog] = useState<Blog | null>(null);

  const action = `/api/blogs/${id}`;

  useEffect(() => {
    fetch(action, {
      method: "GET",
    })
      .then((res) => res.json())
      .then(setBlog);
  }, [id, action]);

  const remove = handleRemove(id);

  return (
    <div>
      <Header />
      <main>
        {blog && (
          <>
            <p>{blog.createdAt}</p>
            {blog.contents && <p>{blog.contents}</p>}
            {blog.filename &&
              (blog.isImage ? (
                <Image filename={blog.filename} />
              ) : (
                <Video filename={blog.filename} />
              ))}
          </>
        )}

        <div>
          <Create method="PUT" action={action}>
            Edit
          </Create>
          <a href="/" onClick={remove}>
            Delete
          </a>
        </div>
      </main>
    </div>
  );
}
