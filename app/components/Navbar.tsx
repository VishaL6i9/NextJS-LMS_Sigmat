// components/Navbar.tsx
"use client";
import Link from 'next/link';
import React from 'react';
import styles from './Navbar.module.css';

const Navbar: React.FC = () => {
    return (
        <>
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
                        <Link href="/auth">
                            <button className={styles.loginButton}>Login</button>
                        </Link>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Navbar;