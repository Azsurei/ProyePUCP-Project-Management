import LandingFooter from "@/components/LandingFooter";
import LandingMain from "@/components/LandingMain";
import LandingNav from "@/components/LandingNav";
import styles from "@/styles/landing.module.css";

export default function Home() {
    return (
        <div className={styles.landingContainer}>
            <LandingNav />
            <LandingMain />
            <LandingFooter />
        </div>
    );
}
