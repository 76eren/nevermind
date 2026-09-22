import { PostInput } from "@/components/home/post-input";
import { requireSession } from "@/lib/route-guard";

export default async function Home() {
  const user = await requireSession();

  return (
    <section className="mx-auto w-full max-w-6xl border-x border-[#eceef0] bg-white xl:w-[calc(100vw-36rem-4rem)] xl:-translate-x-36">
      <h1 className="border-b border-[#eceef0] px-5 py-5 text-xl font-bold text-[#15171a] sm:px-7">
        Home
      </h1>
      <PostInput userId={user.id} name={user.name} image={user.image} />
    </section>
  );
}
