import Image from "next/image";
import styles from "./page.module.css";
import LocationMap from "./components/LocationMap";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className="header">Location Explorer</h1>
        <LocationMap />
      </main>
      <footer className={styles.footer}>
        <a
          href="https://joint-portfolio.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to my portfolio →
        </a>
      </footer>
    </div>
  );
}
