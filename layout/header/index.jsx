import { AppBar, Toolbar, Button } from "@mui/material";
import Link from "next/link";
import styles from "@/styles/Header.module.css";

const Header = () => {
  return (
    <AppBar position="static" className={styles.header}>
      <Toolbar className={styles.toolbar}>
        <div className={styles.logo}>MyApp</div>
        <div className={styles.links}>
          <Link href="/register" passHref>
            <Button color="inherit">Register</Button>
          </Link>
          <Link href="/login" passHref>
            <Button color="inherit">Login</Button>
          </Link>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
