import {
  type FormEventHandler,
  useRef,
  type JSX,
  type FormEvent,
  useState,
  useId,
} from "react";
import { setAuth } from "./util.ts";

function handleSubmit(
  close: () => void,
  setError: (error: string) => void,
): FormEventHandler<HTMLFormElement> {
  return async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const data = new FormData(form);
    const maybetoken = data.get("token") as string | null;
    data.delete("token");
    const body: string = JSON.stringify(Object.fromEntries(data.entries()));

    const bearer: string | null = localStorage.getItem("bearer");
    const action: string =
      bearer || maybetoken ? `${form.action}/renew` : form.action;
    const method: string = form.method;
    const auth: HeadersInit | undefined =
      setAuth(maybetoken) ?? setAuth(bearer);
    const headers: HeadersInit = Object.assign(
      {
        "Content-Type": "application/json",
      },
      auth,
    );

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
    const text = await response.text();

    localStorage.setItem("bearer", text);
    prompt("Token was saved to localStorage", text);
    close();
  };
}

function LogIn(): JSX.Element {
  const dialog = useRef<HTMLDialogElement>(null);
  const [error, setError] = useState("");

  const open = () => dialog.current?.showModal();
  const close = () => dialog.current?.close();

  const submit = handleSubmit(close, setError);

  const nameId = useId();
  const passId = useId();
  const tokenId = useId();

  return (
    <>
      <button type="button" onClick={open}>
        Log in
      </button>
      <dialog ref={dialog}>
        <form method="POST" action="/api/register" onSubmit={submit}>
          <label htmlFor={nameId}>Username</label>
          <input
            id={nameId}
            type="text"
            required
            minLength={1}
            name="username"
          />
          <label htmlFor={passId}>Password</label>
          <input
            id={passId}
            type="password"
            required
            minLength={1}
            name="password"
          />
          <label htmlFor={tokenId}>Auth token (optional)</label>
          <input id={tokenId} type="password" minLength={1} name="token" />

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

export default function Header(): JSX.Element {
  return (
    <header>
      <h1>Blogs</h1>

      <div>
        <LogIn />
      </div>
    </header>
  );
}
