import { githubLogin } from "../api/client";

export default function Login() {
  return (
    <main className="login-page">
      <section className="login-card">
        <h1>Insighta Labs+</h1>
        <p>Secure demographic intelligence portal.</p>

        <button onClick={githubLogin}>
          Continue with GitHub
        </button>
      </section>
    </main>
  );
}