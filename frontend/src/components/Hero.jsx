import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative h-[100svh] md:h-screen w-full overflow-hidden">
      {/* Background image */}
      <img
        src="https://res.cloudinary.com/dhtv5scfv/image/upload/v1755015541/IMG_7989_nz2jgd.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center"
        />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
        <div className="relative z-10 h-full flex items-center">
        <div className="mx-auto max-w-5xl px-4 text-center">

            <div className="mt-8 flex justify-center flex-wrap gap-4">
            <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
            <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
            <div className="flex flex-col sm:flex-row justify-center gap-6 w-full max-w-5xl animate-fadeUp">
                <Link
                to="/past-trips"
                className="flex-1 flex items-center justify-center px-6 py-5 border border-white text-white text-2xl sm:text-3xl font-semibold rounded-lg hover:bg-white/10 transition"
                >
                Past Trips
                </Link>
                <Link
                to="/future-trips"
                className="flex-1 flex items-center justify-center px-6 py-5 border border-white text-white text-2xl sm:text-3xl font-semibold rounded-lg hover:bg-white/10 transition"
                >
                Future Trips
                </Link>
                <Link
                to="/gallery"
                className="flex-1 flex items-center justify-center px-6 py-5 border border-white text-white text-2xl sm:text-3xl font-semibold rounded-lg hover:bg-white/10 transition"
                >
                Gallery
                </Link>
                <Link
                to="/about"
                className="flex-1 flex items-center justify-center px-6 py-5 border border-white text-white text-2xl sm:text-3xl font-semibold rounded-lg hover:bg-white/10 transition"
                >
                About
                </Link>
            </div>
            </div>
            </div>



            </div>
        </div>
        </div>


    </section>
  );
}
