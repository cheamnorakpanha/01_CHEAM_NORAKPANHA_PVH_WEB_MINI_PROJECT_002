export default function SectionHeaderComponent({ title, desc, children }) {
  return (
    <div className="flex items-center justify-between mb-12">
      <div>
        <h1 className="text-3xl font-semibold">{title}</h1>
        <p className="text-gray-500 text-sm mt-1">{desc}</p>
      </div>

      {children}
    </div>
  );
}
