import {
  type FormEvent,
  type FormEventHandler,
  useRef,
  type JSX,
  useState,
  useId,
} from "react";
import { setAuth } from "./util.ts";

function handleSubmit(
  close: () => void,
  setError: (error: string) => void,
): FormEventHandler<HTMLFormElement> {
  return async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const body = new FormData(form);

    const method: string = form.method;
    const action: string = form.action;
    const bearer: string | null = localStorage.getItem("bearer");
    const headers: HeadersInit | undefined = setAuth(bearer);
    if (!headers) {
      setError("Log in to create a blog");
      return;
    }

    const response = await fetch(action, {
      method,
      headers,
      body,
    });
    if (!response.ok) {
      const text = JSON.stringify(await response.json(), undefined, 2);
      setError(`${response.status} ${response.statusText}\n${text}`);
      return;
    }
    close();
  };
}

export default function Create(): JSX.Element {
  const dialog = useRef<HTMLDialogElement>(null);

  const [error, setError] = useState("");

  const open = () => dialog.current?.showModal();
  const close = () => dialog.current?.close();

  const submit = handleSubmit(close, setError);

  const contentsId = useId();
  const mediaId = useId();

  return (
    <>
      <button type="button" onClick={open}>
        Create blog
      </button>
      <dialog ref={dialog}>
        <form method="POST" action="/api/blogs" onSubmit={submit}>
          <label htmlFor={contentsId}>Contents</label>
          <input id={contentsId} minLength={1} type="text" name="contents" />
          <label htmlFor={mediaId}>Image or video</label>
          <input
            id={mediaId}
            type="file"
            accept="image/*,video/*"
            name="media"
          />

          <button type="button" onClick={close}>
            Cancel
          </button>
          <button type="submit">Submit</button>

          {error && (
            <pre>
              <output>{error}</output>
            </pre>
          )}
        </form>
      </dialog>
    </>
  );
}
