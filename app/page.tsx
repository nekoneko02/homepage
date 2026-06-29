import { getAllContent } from "@/content";
import { profile } from "@/data/profile";
import Header from "./components/Header";
import Hero from "./components/Hero";
import ContentSection from "./components/ContentSection";
import TwitterEmbed from "./components/TwitterEmbed";
import Footer from "./components/Footer";

export default async function Home() {
  const contentItems = await getAllContent();

  return (
    <>
      <Header links={profile.links} />
      <main>
        <Hero profile={profile} />
        <ContentSection items={contentItems} />
        <TwitterEmbed handle={profile.twitterHandle} />
      </main>
      <Footer links={profile.links} />
    </>
  );
}
