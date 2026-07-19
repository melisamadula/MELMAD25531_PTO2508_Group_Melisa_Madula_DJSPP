import { useContext } from "react";
import { PodcastContext } from "../../context/PodcastContext";
import styles from "./Pagination.module.css";

/**
 * A numeric pagination control bar that interacts with global context parameters.
 * Automatically conditionalizes rendering to return empty layout space if total volume constraints fall below two pages.
 *
 * @component
 * @returns {JSX.Element|null} A row of interactive page number selectors, or null if single-page distribution.
 */
export default function Pagination() {
  const { page, setPage, totalPages } = useContext(PodcastContext);

  if (totalPages <= 1) return null;

  /**
   * Evaluated numeric collection sequence containing values from 1 up to the total pages boundary.
   * @type {number[]}
   */
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className={styles.paginationWrapper}>
      {pages.map((p) => (
        <button
          key={p}
          className={`${styles.pageButton} ${p === page ? styles.active : ""}`}
          onClick={() => setPage(p)}
        >
          {p}
        </button>
      ))}
    </div>
  );
}
