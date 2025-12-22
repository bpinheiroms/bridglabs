export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-xl px-6 py-20">
        <p className="text-lg text-gray-800 leading-relaxed">
          Olá, somos a{" "}
          <span className="font-semibold">Bridg Labs</span> 🚀
        </p>

        <p className="text-lg text-gray-800 leading-relaxed mt-8">
          Criamos{" "}
          <span className="text-blue-600">aplicativos</span> e{" "}
          <span className="text-blue-600">soluções SaaS</span>{" "}
          para resolver problemas do dia a dia.
        </p>

        <p className="text-lg text-gray-800 leading-relaxed mt-8">
          Nossos produtos estão{" "}
          <span className="font-semibold">em desenvolvimento</span> 🛠️
          <br />
          Em breve você poderá conferir nossas soluções.
        </p>

        <p className="text-lg text-gray-800 leading-relaxed mt-8">
          Quer entrar em contato?{" "}
          <a
            href="mailto:contato@bridglabs.com"
            className="text-blue-600 hover:underline"
          >
            Clique aqui.
          </a>
        </p>

        <footer className="mt-16 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Bridg Labs LTDA · Brasil 🇧🇷
          </p>
        </footer>
      </main>
    </div>
  );
}
