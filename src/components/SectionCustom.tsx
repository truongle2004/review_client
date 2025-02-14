const SectionComponent = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mt-3 p-4">
    <h4 className="text-lg font-semibold mb-5 text-white">{title}</h4>
    <div className="flex flex-col gap-2">{children}</div>
  </section>
);

export default SectionComponent;
