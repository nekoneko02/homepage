import { getAllContent } from "@/content";
import { profile } from "@/data/profile";
import Header from "./components/Header";
import Hero from "./components/Hero";
import NewsSection from "./components/NewsSection";
import ContentSection from "./components/ContentSection";
import Footer from "./components/Footer";

export default async function Home() {
  const contentItems = await getAllContent();

  return (
    <>
      <Header links={profile.links} />
      <main>
        <Hero profile={profile} />
        <NewsSection items={contentItems} />
        <ContentSection items={contentItems} />
      </main>
      <Footer links={profile.links} />
    </>
  );
}
