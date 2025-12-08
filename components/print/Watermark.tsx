import Image from "next/image";

export default function Watermark({ type }: { type: string }) {
  const styleBase = "absolute inset-0 flex items-center justify-center pointer-events-none opacity-10";

  if (type === "text") {
    return (
      <div className={`${styleBase} text-6xl font-bold`}>
        AFUED
      </div>
    );
  }

  if (type === "diagonal") {
    return (
      <div
        className={`${styleBase} text-7xl font-bold rotate-[-30deg]`}
      >
        AFUED
      </div>
    );
  }

  if (type === "logo") {
    return (
      <div className={`${styleBase}`}>
        <Image
          src="/afued-logo.png"
          alt="logo"
          width={300}
          height={300}
          className="opacity-20"
        />
      </div>
    );
  }

  if (type === "repeat") {
    return (
      <div className="absolute inset-0 pointer-events-none opacity-10 grid grid-cols-3 gap-10 p-10">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="flex items-center justify-center text-lg font-bold">
            AFUED
          </div>
        ))}
      </div>
    );
  }

  return null;
}
