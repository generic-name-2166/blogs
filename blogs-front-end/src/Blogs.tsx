import { useEffect, useState, type JSX } from "react";
import Header from "./Header.tsx";
import { Blog } from "./App.tsx";

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

export default function Blogs(): JSX.Element {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const id: number = parseInt(urlParams.get("id")!);

  const [blog, setBlog] = useState<Blog | null>(null);

  useEffect(() => {
    fetch(`/api/blogs/${id}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then(setBlog);
  }, [id]);

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
          <button type="button">Edit</button>
          <button type="button">Delete</button>
        </div>
      </main>
    </div>
  );
}
