import Link from "next/link";

export default function Home() {
  return (
    <main className="tui-page">
      <div className="tui-page-content">
        <h1 className="tui-heading-xl mb-4">
          Welcome To TuiTUI - Developer Auxiliary Tasks
        </h1>
        <p className="tui-text-subtitle mb-8">
          Make sure TUITUI.md is up to date before continuing!
        </p>

        <div className="flex flex-col gap-4 items-center">
          <Link href="/tuitui" className="tui-button-primary">
            Continue to TuiTui Chat 🌴
          </Link>
        </div>
      </div>
    </main>
  );
}
