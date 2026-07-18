import styles from "./Header.module.css";
import { Link } from "react-router-dom";
import { ThemeToggle } from "../../settings/ThemeToggle";

export default function Header() {
  return (
    <header className={styles.appHeader}>
      <h1>
        <Link to="/">🎙️ Podcast App</Link>
      </h1>
      
      {/* Container to group right-aligned navigation items nicely */}
      <div className={styles.navActions}>
        <Link to="/favorites" className={styles.favoritesLink}>
          ❤️ My Favourites
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
