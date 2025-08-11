export default function Footer(){
    return (
      <footer className="bg-white border-t mt-8">
        <div className="container p-4 text-center text-sm text-gray-600">© {new Date().getFullYear()} My Travel Blog</div>
      </footer>
    );
  }