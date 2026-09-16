// src/app/dashboard/components/ActivitiesCard.js
"use client";

import { useState } from "react";
import { Plus, Filter, CheckCircle2, GripVertical } from "lucide-react";
import styles from "../dashboard.module.css";

export default function ActivitiesCard({ isManager = true }) {
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

      if (draggedIndex === -1 || targetIndex === -1) {
        return prev;
      }

      const [draggedItem] = list.splice(draggedIndex, 1);

      list.splice(targetIndex, 0, draggedItem);

      return list;
    });
  };

  const toggleCompleted = (id) => {
    setActivities((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              completed: !a.completed,
            }
          : a,
      ),
    );
  };

  const filteredActivities = activities.filter((act) => {
    if (activeTab === "completed") {
      return act.completed;
    }

    if (act.completed) {
      return false;
    }

    if (activeTab === "my") {
      return (
        act.assignee === "Bryan Santana" ||
        act.assignee === "Lewis Adams"
      );
    }

    if (selectedTeamMember === "All") {
      return true;
    }

    return act.assignee === selectedTeamMember;
  });

  // Calcula a posição da aba ativa para movimentar o indicador
  const visibleTabs = [
    "my",
    ...(isManager ? ["team"] : []),
    "completed",
  ];

  const activeIndex = visibleTabs.indexOf(activeTab);
  const tabCount = visibleTabs.length;

  return (
    <div className={styles.activitiesCard}>
            <div className={styles.cardTitleRow}>
        <span className={styles.cardTitle}>Today</span>
      </div>

      <div className={styles.tabsRow}>
        <div className={styles.segmentedControl}>
          <button
            className={`${styles.segmentBtn} ${
              activeTab === "my"
                ? styles.segmentActive
                : ""
            }`}
            onClick={() => setActiveTab("my")}
          >
            My Activities
          </button>

          {isManager && (
            <button
              className={`${styles.segmentBtn} ${
                activeTab === "team"
                  ? styles.segmentActive
                  : ""
              }`}
              onClick={() => setActiveTab("team")}
            >
              My Team
            </button>
          )}

          <button
            className={`${styles.segmentBtn} ${
              activeTab === "completed"
                ? styles.segmentActive
                : ""
            }`}
            onClick={() => setActiveTab("completed")}
          >
            Completed
          </button>
        </div>

        <div className={styles.tabsRowRight}>
          {activeTab === "team" && (
            <div className={styles.teamFilterInline}>
              <Filter size={12} color="#8a8f9a" />

              <select
                value={selectedTeamMember}
                onChange={(e) =>
                  setSelectedTeamMember(e.target.value)
                }
                className={styles.memberSelect}
              >
                {teamMembers.map((m) => (
                  <option
                    key={m.id}
                    value={m.name}
                  >
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            className={styles.addBtn}
            title="Add New Activity"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      <div className={styles.listFrame}>
                <div
          className={styles.listTopIndicator}
          style={{
            left: `${activeIndex * (270 / tabCount)}px`,
            width: `${270 / tabCount}px`,
          }}
        ></div>
        <div className={styles.activitiesList}>
          {filteredActivities.length > 0 ? (
            filteredActivities.map((activity) => (
              <div
                key={activity.id}
                className={styles.activityItem}
                draggable={activeTab !== "completed"}
                onDragStart={(e) =>
                  handleDragStart(e, activity.id)
                }
                onDragOver={handleDragOver}
                onDrop={(e) =>
                  handleDropReorder(e, activity.id)
                }
              >
                <div className={styles.activityContent}>
                  {activeTab !== "completed" && (
                    <GripVertical
                      size={14}
                      className={styles.dragHandle}
                    />
                  )}

                  <span>📞</span>

                  <div>
                    <p
                      className={styles.activityText}
                      style={
                        activity.completed
                          ? {
                              textDecoration: "line-through",
                              color: "var(--text-muted)",
                            }
                          : undefined
                      }
                    >
                      {activity.text}
                    </p>

                    {activeTab === "team" && (
                      <span
                        className={styles.assigneeSub}
                      >
                        Assigned to:{" "}
                        {activity.assignee}
                      </span>
                    )}
                  </div>
                </div>

                <div className={styles.activityMeta}>
                  <button
                    className={styles.completeBtn}
                    onClick={() =>
                      toggleCompleted(activity.id)
                    }
                    title={
                      activity.completed
                        ? "Mark as not completed"
                        : "Mark as completed"
                    }
                  >
                    <CheckCircle2
                      size={16}
                      color={
                        activity.completed
                          ? "#15803d"
                          : "#cbd5e1"
                      }
                      fill={
                        activity.completed
                          ? "#dcfce7"
                          : "none"
                      }
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
  );
}