export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-12 justify-center items-center">{children}</div>
  );
}
