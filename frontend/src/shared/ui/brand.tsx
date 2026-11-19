import Link from "next/link";

export function Brand() {
  return (
    <Link
      href="/"
      className="flex items-center gap-3 rounded-lg focus-visible:outline-offset-4"
    >
      <span className="grid size-9 place-items-center rounded-full bg-brand text-sm font-semibold text-white">
        P
      </span>
      <span>
        <span className="block font-display text-lg font-semibold leading-none text-ink">
          PriceWise
        </span>
        <span className="mt-1 block text-[10px] font-medium uppercase text-ink-faint">
          Smart price intelligence
        </span>
      </span>
    </Link>
  );
}
