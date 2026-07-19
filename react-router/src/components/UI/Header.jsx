import styles from "./Header.module.css";
import { Link } from "react-router-dom";
import { ThemeToggle } from "../../settings/ThemeToggle";

/**
 * Global navigation header component for the application.
 * Displays the primary app branding link, structural routing links to the favorites page,
 * and mounts the application theme configuration selector.
 *
 * @component
 * @returns {JSX.Element} A semantic header bar containing brand identity and navigation links.
 */
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
