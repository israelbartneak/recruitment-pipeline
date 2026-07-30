// src/app/dashboard/page.js
"use client";
import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Plus,
  Users,
  Filter,
  CalendarDays,
  GripVertical,
  CheckCircle2,
} from "lucide-react";
import styles from "./dashboard.module.css";

const MONTH_NAMES = [
  "JANEIRO", "FEVEREIRO", "MARÇO", "ABRIL", "MAIO", "JUNHO",
  "JULHO", "AGOSTO", "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO",
];

const MONTH_NAMES_SHORT = [
  "JAN", "FEV", "MAR", "ABR", "MAI", "JUN",
  "JUL", "AGO", "SET", "OUT", "NOV", "DEZ",
];

export default function DashboardPage() {
  const [greeting, setGreeting] = useState("Hello");
  const [userName, setUserName] = useState("Bryan");
  const [isManager] = useState(true);

  // Estados do Calendário & Day Tasks
  const [currentDate, setCurrentDate] = useState(new Date(2026, 6, 23));
  const [selectedDate, setSelectedDate] = useState(23);
  const [isDayScheduleOpen, setIsDayScheduleOpen] = useState(true);
  const [isYearView, setIsYearView] = useState(false);

  // Estados de Atividades & Filtro do Time
  const [activeTab, setActiveTab] = useState("my");
  const [selectedTeamMember, setSelectedTeamMember] = useState("All");

  const teamMembers = [
    { id: "all", name: "All" },
    { id: "lewis", name: "Lewis Adams" },
    { id: "rafael", name: "Rafael Sousa" },
    { id: "bianca", name: "Bianca Melo" },
  ];

  const [activities, setActivities] = useState([
    {
      id: 1,
      text: "Lewis Adams - Quality Assurance Manager",
      date: "2026-07-23",
      time: "10:00",
      assignee: "Lewis Adams",
      completed: false,
    },
    {
      id: 2,
      text: "Year End Celebration - Frontall USA",
      date: "2026-07-23",
      time: "14:30",
      assignee: "Bryan Santana",
      completed: false,
    },
    {
      id: 3,
      text: "Confirming Interview Appointment - Tech Lead",
      date: "2026-07-23",
      time: "16:00",
      assignee: "Rafael Sousa",
      completed: false,
    },
    {
      id: 4,
      text: "Candidate Screening: Senior Full Stack Developer",
      date: "2026-07-24",
      time: "17:00",
      assignee: "Bianca Melo",
      completed: false,
    },
  ]);

  useEffect(() => {
    const storedName = localStorage.getItem("user_full_name");
    if (storedName) {
      setUserName(storedName.split(" ")[0]);
    } else {
      setUserName("Bryan");
    }

    const currentHour = new Date().getHours();
    if (currentHour >= 6 && currentHour < 12) {
      setGreeting("Good morning");
    } else if (currentHour >= 12 && currentHour < 18) {
      setGreeting("Good afternoon");
    } else {
      setGreeting("Good evening");
    }
  }, []);

  const dayLabels = ["D", "S", "T", "Q", "Q", "S", "S"];
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);
  const startOffset = 3;

  const handlePrevYear = () => {
    setCurrentDate(new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), 1));
  };

  const handleNextYear = () => {
    setCurrentDate(new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), 1));
  };

  const handleSelectMonth = (monthIndex) => {
    setCurrentDate(new Date(currentDate.getFullYear(), monthIndex, 1));
    setIsYearView(false);
  };

  // Drag-and-drop para reordenar atividades
  const handleDragStart = (e, id) => {
    e.dataTransfer.setData("activityId", String(id));
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleDropReorder = (e, targetId) => {
    e.preventDefault();
    const draggedId = Number(e.dataTransfer.getData("activityId"));
    if (draggedId === targetId) return;

    setActivities((prev) => {
      const list = [...prev];
      const draggedIndex = list.findIndex((a) => a.id === draggedId);
      const targetIndex = list.findIndex((a) => a.id === targetId);
      if (draggedIndex === -1 || targetIndex === -1) return prev;
      const [draggedItem] = list.splice(draggedIndex, 1);
      list.splice(targetIndex, 0, draggedItem);
      return list;
    });
  };

  const toggleCompleted = (id) => {
    setActivities((prev) =>
      prev.map((a) => (a.id === id ? { ...a, completed: !a.completed } : a)),
    );
  };

  const filteredActivities = activities.filter((act) => {
    if (activeTab === "completed") return act.completed;
    if (act.completed) return false;
    if (activeTab === "my") {
      return act.assignee === "Bryan Santana" || act.assignee === "Lewis Adams";
    }
    if (selectedTeamMember === "All") return true;
    return act.assignee === selectedTeamMember;
  });

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>
          {greeting}, {userName}
        </h1>
      </header>

      <div className={styles.dashboardGrid}>
        {/* LADO ESQUERDO: METRICS */}
        <div className={styles.leftColumn}>
          <div className={styles.metricsCard}>
            <div>
              <div className={styles.cardHeader}>
                <h2>MY PERFORMANCE</h2>
              </div>

              <div className={styles.chartSection}>
                <span className={styles.subTitle}>MY CANDIDATES</span>
                <div className={styles.barChartContainer}>
                  <div className={styles.chartYAxis}>
                    <span>8000</span>
                    <span>6000</span>
                    <span>4000</span>
                    <span>2000</span>
                    <span>0</span>
                  </div>
                  <div className={styles.barChart}>
                    <div className={styles.barWrapper}>
                      <div className={styles.bar} style={{ height: "50%" }}></div>
                      <span className={styles.barLabel}>Created</span>
                    </div>
                    <div className={styles.barWrapper}>
                      <div className={styles.bar} style={{ height: "78%" }}></div>
                      <span className={styles.barLabel}>Owned</span>
                    </div>
                    <div className={styles.barWrapper}>
                      <div className={styles.bar} style={{ height: "35%" }}></div>
                      <span className={styles.barLabel}>Added</span>
                    </div>
                    <div className={styles.barWrapper}>
                      <div className={styles.bar} style={{ height: "12%" }}></div>
                      <span className={styles.barLabel}>Dropped</span>
                    </div>
                    <div className={styles.barWrapper}>
                      <div className={styles.bar} style={{ height: "2%" }}></div>
                      <span className={styles.barLabel}>Placed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <hr className={styles.divider} />

              <div className={styles.chartSection}>
                <span className={styles.subTitle}>MY JOBS</span>
                <div className={styles.pieChartContainer}>
                  <div className={styles.pieChart}>
                    <div className={styles.pieCenter}></div>
                  </div>
                  <div className={styles.pieLegend}>
                    <span className={styles.legendItem}>
                      <span
                        className={styles.legendDot}
                        style={{ background: "#1e3a8a" }}
                      ></span>{" "}
                      Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* LADO DIREITO: CALENDAR + DAY TASKS & MY ACTIVITIES */}
        <div className={styles.rightColumn}>
          {/* DIREITO SUPERIOR: CALENDAR + DAY TASKS */}
          <div className={styles.calendarWidgetCard}>
            {/* MINI CALENDÁRIO / VISÃO DE ANO */}
            <div className={styles.miniCalendarBox}>
              <div className={styles.calendarHeader}>
                <span className={styles.monthTitle}>
                  {MONTH_NAMES[currentDate.getMonth()]} DE {currentDate.getFullYear()}
                </span>
                <div className={styles.headerRightActions}>
                  <button
                    className={styles.navBtn}
                    onClick={() => setIsYearView(!isYearView)}
                    title={isYearView ? "Close year view" : "View full year"}
                  >
                    <CalendarDays size={14} />
                  </button>
                  <button
                    className={styles.toggleTimelineBtn}
                    onClick={() => setIsDayScheduleOpen(!isDayScheduleOpen)}
                    title={
                      isDayScheduleOpen
                        ? "Recolher tarefas do dia"
                        : "Expandir tarefas do dia"
                    }
                  >
                    {isDayScheduleOpen ? (
                      <ChevronUp size={14} />
                    ) : (
                      <ChevronDown size={14} />
                    )}
                  </button>
                </div>
              </div>

              {isYearView ? (
                <div className={styles.yearView}>
                  <div className={styles.yearNav}>
                    <button className={styles.navBtn} onClick={handlePrevYear}>
                      <ChevronLeft size={14} />
                    </button>
                    <span className={styles.yearLabel}>{currentDate.getFullYear()}</span>
                    <button className={styles.navBtn} onClick={handleNextYear}>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                  <div className={styles.monthsGrid}>
                    {MONTH_NAMES_SHORT.map((m, idx) => (
                      <button
                        key={m}
                        className={`${styles.monthCell} ${idx === currentDate.getMonth() ? styles.selectedMonth : ""}`}
                        onClick={() => handleSelectMonth(idx)}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className={styles.calendarGrid}>
                  {dayLabels.map((day, idx) => (
                    <span key={idx} className={styles.dayLabel}>
                      {day}
                    </span>
                  ))}

                  {Array.from({ length: startOffset }).map((_, idx) => (
                    <div key={`empty-${idx}`} className={styles.emptyCell} />
                  ))}

                  {daysInMonth.map((day) => (
                    <button
                      key={day}
                      className={`${styles.dayCell} ${selectedDate === day ? styles.selectedDay : ""}`}
                      onClick={() => setSelectedDate(day)}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* DAY TASKS (TIMELINE DO DIA RETRÁTIL GRUDADA) */}
            {isDayScheduleOpen && (
              <div className={styles.dayScheduleBox}>
                <div className={styles.scheduleHeader}>
                  <span>
                    QUI. {selectedDate.toString().padStart(2, "0")}/07
                  </span>
                </div>

                <div className={styles.timelineScroll}>
                  <div className={styles.timeSlot}>
                    <span className={styles.timeLabel}>08:00</span>
                  </div>
                  <div className={styles.timeSlot}>
                    <span className={styles.timeLabel}>09:00</span>
                  </div>

                  <div className={styles.timeSlot}>
                    <span className={styles.timeLabel}>10:00</span>
                    <div className={styles.eventBlock}>
                      <strong>Lewis Adams Interview</strong>
                      <p>QA Manager Role</p>
                    </div>
                  </div>

                  <div className={styles.timeSlot}>
                    <span className={styles.timeLabel}>11:00</span>
                  </div>
                  <div className={styles.timeSlot}>
                    <span className={styles.timeLabel}>12:00</span>
                  </div>
                  <div className={styles.timeSlot}>
                    <span className={styles.timeLabel}>13:00</span>
                  </div>

                  <div className={styles.currentTimeIndicator}>
                    <div className={styles.orangeLine} />
                  </div>

                  <div className={styles.timeSlot}>
                    <span className={styles.timeLabel}>14:00</span>
                    <div className={styles.eventBlock}>
                      <strong>Frontall USA Sync</strong>
                      <p>Operations Review</p>
                    </div>
                  </div>

                  <div className={styles.timeSlot}>
                    <span className={styles.timeLabel}>15:00</span>
                  </div>
                  <div className={styles.timeSlot}>
                    <span className={styles.timeLabel}>16:00</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* DIREITO INFERIOR: MY ACTIVITIES / MY TEAM / COMPLETED */}
          <div className={styles.activitiesCard}>
            <div className={styles.cardHeaderWithActions}>
              <div className={styles.leftTabZone}>
                <button
                  className={`${styles.tabBtn} ${activeTab === "my" ? styles.activeTab : ""}`}
                  onClick={() => setActiveTab("my")}
                >
                  My Activities
                </button>

                {isManager && (
                  <button
                    className={`${styles.tabBtn} ${activeTab === "team" ? styles.activeTab : ""}`}
                    onClick={() => setActiveTab("team")}
                  >
                    <Users size={14} /> My Team
                  </button>
                )}

                <button
                  className={`${styles.tabBtn} ${activeTab === "completed" ? styles.activeTab : ""}`}
                  onClick={() => setActiveTab("completed")}
                >
                  <CheckCircle2 size={14} /> Completed
                </button>
              </div>

              <div className={styles.rightActionZone}>
                {activeTab === "team" && (
                  <div className={styles.teamFilterInline}>
                    <Filter size={12} color="#64748B" />
                    <select
                      value={selectedTeamMember}
                      onChange={(e) => setSelectedTeamMember(e.target.value)}
                      className={styles.memberSelect}
                    >
                      {teamMembers.map((m) => (
                        <option key={m.id} value={m.name}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <button className={styles.addBtn} title="Add New Activity">
                  <Plus size={14} />
                </button>
              </div>
            </div>

            <div className={styles.activitiesList}>
              {filteredActivities.length > 0 ? (
                filteredActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className={styles.activityItem}
                    draggable={activeTab !== "completed"}
                    onDragStart={(e) => handleDragStart(e, activity.id)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDropReorder(e, activity.id)}
                  >
                    <div className={styles.activityContent}>
                      {activeTab !== "completed" && (
                        <GripVertical size={14} className={styles.dragHandle} />
                      )}
                      <span>📞</span>
                      <div>
                        <p
                          className={styles.activityText}
                          style={
                            activity.completed
                              ? { textDecoration: "line-through", color: "var(--text-muted)" }
                              : undefined
                          }
                        >
                          {activity.text}
                        </p>
                        {activeTab === "team" && (
                          <span className={styles.assigneeSub}>
                            Assigned to: {activity.assignee}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className={styles.activityMeta}>
                      <button
                        className={styles.completeBtn}
                        onClick={() => toggleCompleted(activity.id)}
                        title={activity.completed ? "Mark as not completed" : "Mark as completed"}
                      >
                        <CheckCircle2
                          size={16}
                          color={activity.completed ? "#15803d" : "#cbd5e1"}
                          fill={activity.completed ? "#dcfce7" : "none"}
                        />
                      </button>
                      <span>{activity.time}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.emptyActivities}>
                  No activities found.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}