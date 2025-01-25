// components/Navbar.tsx
"use client";
import Link from 'next/link';
import { useState } from 'react';
import { Dialog } from '@headlessui/react'; // Assuming you're using Headless UI for the modal
import { Input } from '@/components/ui/input'; // Import ShadCN Input
import styles from './Navbar.module.css'; // Import the CSS module

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const closeModal = () => {
        setIsOpen(false);
    };

    const openModal = () => {
        setIsOpen(true);
    };

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
                                <li className={styles.dropdownItem}>< Link href="/reporting/forum">Forum</Link></li>
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
                    </ul>
                    <div>
                        <button onClick={openModal} className={styles.loginButton}>Login</button>
                    </div>
                </div>
            </nav>

            {/* Login Modal */}
            <Dialog open={isOpen} onClose={closeModal}>
                <div className="fixed inset-0 bg-black opacity-30" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center">
                    <Dialog.Panel className="bg-white rounded-lg p-6 max-w-md mx-auto">
                        <Dialog.Title className="text-lg font-bold">Login</Dialog.Title>
                        <form className="mt-4">
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                <Input type="email" id="email" className="mt-1 block w-full border border-gray-300 rounded-md p-2" required />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                                <Input type="password" id="password" className="mt-1 block w-full border border-gray-300 rounded-md p-2" required />
                            </div>
                            <div className="flex justify-end">
                                <button type="submit" className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600 focus:outline-none">Submit</button>
                            </div>
                        </form>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </>
    );
};

export default Navbar;