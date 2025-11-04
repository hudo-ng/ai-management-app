"use client";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
};

export default function Button({ loading, children, ...rest }: Props) {
  return (
    <button
      {...rest}
      className="rounded-xl px-4 py-2 font-medium shadow-sm border border-gray-200 bg-gray-900 text-white disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {loading ? "..." : children}
    </button>
  );
}
