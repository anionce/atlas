import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-border mt-auto border-t px-6 py-8">
      <div className="text-muted-foreground mx-auto flex w-full max-w-[900px] flex-col items-center gap-3 text-sm sm:flex-row sm:justify-between">
        <span>© {new Date().getFullYear()} Mi Rumbo Financiero</span>
        <nav className="flex gap-4">
          <Link href="/aviso-legal" className="hover:text-foreground hover:underline">
            Aviso legal
          </Link>
          <Link href="/privacidad" className="hover:text-foreground hover:underline">
            Privacidad
          </Link>
          <Link href="/cookies" className="hover:text-foreground hover:underline">
            Cookies
          </Link>
        </nav>
      </div>
    </footer>
  );
}
