import { AppBar, Toolbar, Button } from "@mui/material";
import Link from "next/link";
import styles from "@/styles/Header.module.css";
import { useUserStore } from "@/store/store";
import { useEffect } from "react";
import { useRouter } from "next/router";

const Header = () => {
  const router = useRouter();
  const { user, setUser, loadUser  } = useUserStore();

  useEffect(() => {
    loadUser(); // Load user when the component mounts
    // console.log(user, "user");
  }, []);

  const handleLogout = () => {
    setUser(null); // Clear user data
    router.push('/login'); // Redirect to login page
  };
  return (
    <AppBar position="static" className={styles.header}>
      <Toolbar className={styles.toolbar}>
        <div className={styles.logo}>MyApp</div>
        <div className={styles.links}>
          <Link href="/register" passHref>
            <Button color="inherit">Register</Button>
          </Link>
          {
            user ? (
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>

            ) : (
              <Link href="/login" passHref>
                <Button color="inherit">Login</Button>
              </Link>
            )
          }
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
