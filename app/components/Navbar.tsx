"use client";
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Navbar.module.css';

const Navbar: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();

    const logAuthState = () => {
        const token = localStorage.getItem("authToken");
        console.log("Auth token:", token);
        console.log("isLoggedIn state:", isLoggedIn);
    };

    useEffect(() => {
        const checkAuthToken = () => {
            const token = localStorage.getItem("authToken");
            console.log("Checking auth token:", token);
            setIsLoggedIn(!!token);
        };

        checkAuthToken();

        const handleStorageChange = (e) => {
            console.log("Storage change detected:", e);
            if (e.key === "authToken") {
                checkAuthToken();
            }
        };

        window.addEventListener('storage', handleStorageChange);

        const intervalId = setInterval(checkAuthToken, 1000);

        window.addEventListener('authChange', checkAuthToken);

        return () => {
            clearInterval(intervalId);
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('authChange', checkAuthToken);
        };
    }, []);

    useEffect(() => {
        logAuthState();
    });

    const handleLogout = async () => {
        console.log("Logout initiated");
        const token = localStorage.getItem("authToken");
        if (!token) {
            console.log("No token found for logout");
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/logout`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token,
                },
            });

            if (response.ok) {
                console.log("Logout successful, removing token");
                localStorage.removeItem("authToken");
                setIsLoggedIn(false);
                window.dispatchEvent(new Event('authChange'));
                router.push("/");
            } else {
                console.error("Logout failed with status:", response.status);
            }
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    const handleLoginButtonClick = () => {
        console.log("Login/Logout button clicked. Current state:", isLoggedIn);
        if (isLoggedIn) {
            handleLogout();
        } else {
            console.log("Redirecting to auth page");
            router.push("/auth");
        }
    };

    return (
        <nav className={styles.navbar}>
            <div className={styles.navbarContainer}>
                <div className={styles.navbarBrand}>
                    <Link href="/">
                        <span className="text-white text-2xl font-bold">eLearning</span>
                    </Link>
                </div>
                <ul className={styles.navItems}>
                    <li className="relative group">
                        <button className="text-white hover:text-yellow-300 focus:outline-none">Courses</button>
                        <ul className={`${styles.dropdown} group-hover:block`}>
                            <li className={styles.dropdownItem}><Link href="/courses">Courses</Link></li>
                            <li className={styles.dropdownItem}><Link href="/contents">Contents</Link></li>
                            <li className={styles.dropdownItem}><Link href="/reviews">Reviews</Link></li>
                            <li className={styles.dropdownItem}><Link href="/certificates">Certificates</Link></li>
                        </ul>
                    </li>
                    <li>
                        <Link href="/forum">
                            <button className="text-white hover:text-yellow-300 focus:outline-none">Forum</button>
                        </Link>
                    </li>
                    <li className="relative group">
                        <button className="text-white hover:text-yellow-300 focus:outline-none">Reporting</button>
                        <ul className={`${styles.dropdown} group-hover:block`}>
                            <li className={styles.dropdownItem}><Link href="/reporting/courses">Courses</Link></li>
                            <li className={styles.dropdownItem}><Link href="/reporting/contents">Contents</Link></li>
                            <li className={styles.dropdownItem}><Link href="/reporting/attendees">Attendees</Link></li>
                            <li className={styles.dropdownItem}><Link href="/reporting/reviews">Reviews</Link></li>
                            <li className={styles.dropdownItem}><Link href="/reporting/quizzes">Quizzes</Link></li>
                            <li className={styles.dropdownItem}><Link href="/reporting/forum">Forum</Link></li>
                            <li className={styles.dropdownItem}><Link href="/reporting/certifications">Certifications</Link></li>
                        </ul>
                    </li>
                    <li className="relative group">
                        <button className="text-white hover:text-yellow-300 focus:outline-none">Configuration</button>
                        <ul className={`${styles.dropdown} group-hover:block`}>
                            <li className={styles.dropdownItem}><Link href="/configuration/settings">Settings</Link></li>
                            <li className={styles.dropdownItem}><Link href="/configuration/course-groups">Course Groups</Link></li>
                            <li className={styles.dropdownItem}><Link href="/configuration/content-tags">Content Tags</Link></li>
                        </ul>
                    </li>
                    <li>
                        <Link href="/dashboard/profile">
                            <button className="text-white hover:text-yellow-300 focus:outline-none">Profile</button>
                        </Link>
                    </li>
                </ul>
                <div>
                    <button
                        className={styles.loginButton}
                        onClick={handleLoginButtonClick}
                    >
                        {isLoggedIn ? "LOGOUT" : "LOGIN"}
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;