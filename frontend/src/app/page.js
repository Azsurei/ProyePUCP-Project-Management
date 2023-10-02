import LandingFooter from "@/components/landingComps/LandingFooter";
import LandingMain from "@/components/landingComps/LandingMain";
import LandingNav from "@/components/landingComps/LandingNav";
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
