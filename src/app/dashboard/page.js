// src/app/dashboard/page.js
"use client";

import { useState, useEffect } from "react";
import ActivitiesCard from "./components/ActivitiesCard";
import ResumeBuilder from "./components/ResumeBuilder";
import styles from "./dashboard.module.css";

const PHRASES = {
  morning: [
    "Let's make today count.",
    "Fresh start, fresh candidates.",
    "Ready when you are.",
  ],
  afternoon: [
    "Halfway there, keep the momentum.",
    "Still time to make an impact today.",
    "On track and picking up speed.",
  ],
  evening: [
    "Wrapping up strong.",
    "A good day's work in progress.",
    "Almost there, finish strong.",
  ],
  late: [
    "Dedication never sleeps.",
    "The quiet hours, get it done.",
    "Burning the midnight oil?",
  ],
};

export default function DashboardPage() {
  const [greeting, setGreeting] = useState("Hello");
  const [userName, setUserName] = useState("Bryan");
  const [subtitle, setSubtitle] = useState("");
  const [isManager] = useState(true);

  useEffect(() => {
    const storedName = localStorage.getItem("user_full_name");

    if (storedName) {
      setUserName(storedName.split(" ")[0]);
    } else {
      setUserName("Bryan");
    }

    const currentHour = new Date().getHours();
    let period;

    if (currentHour >= 6 && currentHour < 12) {
      period = "morning";
      setGreeting("Morning");
    } else if (currentHour >= 12 && currentHour < 18) {
      period = "afternoon";
      setGreeting("Afternoon");
    } else if (currentHour >= 18 && currentHour < 24) {
      period = "evening";
      setGreeting("Evening");
    } else {
      period = "late";
      setGreeting("Up Late");
    }

    // Muda 1x por dia (dia do ano % 3), não a cada carregamento de página
    const startOfYear = new Date(new Date().getFullYear(), 0, 0);
    const dayOfYear = Math.floor(
      (Date.now() - startOfYear) / 86400000
    );
    const phraseIndex = dayOfYear % 3;

    setSubtitle(PHRASES[period][phraseIndex]);
  }, []);

  return (
    <div className={`${styles.container} ${styles.containerFullHeight}`}>
            <header className={styles.header}>
        <h1>
          {greeting}, {userName}
        </h1>
        <p className={styles.greetingSubtitle}>{subtitle}</p>
        <div className={styles.accentLine}></div>
      </header>

      <div className={styles.dashboardGridV2}>
        <ActivitiesCard isManager={isManager} />
        <ResumeBuilder />
      </div>
    </div>
  );
}