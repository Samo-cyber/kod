import styles from "./Footer.module.scss";

export default function FooterServer() {
    return (
        <footer className={styles.footer}>
            <div className="container mx-auto px-4 py-8 text-center">
                <p className="font-changa text-secondary-3 opacity-60">
                    مملكة الظلام — عالم لا يعود منه أحد.
                </p>
                <p className="font-inter text-sm text-secondary-2 mt-2">
                    &copy; {new Date().getFullYear()} Kingdom of Darkness. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
