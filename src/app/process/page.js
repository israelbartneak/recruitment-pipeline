// src/app/process/page.js
"use client";

import { useState, useRef, useLayoutEffect } from "react";
import styles from "./process.module.css";

const TABS = ["Direct Hire", "Temp", "EOR", "BPO", "Bid", "Internal"];

const ROW_GAP = 60;
const ROW_GAP_WIDE = 100;
const ROW3_BOX_WIDTH = 190;
const ROW3_BOX_HEIGHT = 92;
const ROW4_BOX_HEIGHT = 92;

const ROW5_ITEMS = [
  {
    type: "box",
    width: 190,
    text: "Forward the material to the EVP e DOper",
  },
  {
    type: "box",
    width: 190,
    text: "Submit Candidate to the Client after approval",
  },
  {
    type: "diamond",
    width: 130,
    text: "Review Client Feedback",
  },
  {
    type: "box",
    width: 190,
    text: "Schedule Client Interview",
  },
  {
    type: "diamond",
    width: 130,
    text: "Client Decision",
  },
  {
    type: "box",
    width: 190,
    text: "Confirm additional information about the position with the client",
  },
  {
    type: "box",
    width: 190,
    text: "Send this information to Commercial department to prepare the OS",
  },
  {
    type: "box",
    width: 190,
    text: "With the OS signed, Prepare the Job Offer to present to the candidate",
  },
  {
    type: "diamond",
    width: 130,
    text: "Job Offer to the candidate (People and Culture)",
  },
];

const ROW5_YES_AFTER_INDEX = [2, 4];

const ROW6_ITEMS = [
  {
    type: "box",
    width: 190,
    text: "Prepare Contract",
  },
  {
    type: "box",
    width: 190,
    text: "Contract Signing (Recruitment)",
  },
  {
    type: "box",
    width: 190,
    text: "Forward contract and information to the PayRoll",
  },
  {
    type: "box",
    width: 190,
    text: "People & Culture for the onboarding process",
  },
  {
    type: "circle",
    width: 26,
  },
];

export default function ProcessPage() {
  const [activeTab, setActiveTab] = useState("BPO");
  const [layout, setLayout] = useState(null);

  const wrapperRef = useRef(null);
  const teamBriefingRef = useRef(null);
  const registerPositionRef = useRef(null);
  const candidateReturnRef = useRef(null);
  const qualifyBoxRef = useRef(null);
  const checkDailyRef = useRef(null);
  const evaluateInterviewRef = useRef(null);
  const scheduleInterviewRef = useRef(null);
  const contactQualifiedRef = useRef(null);
  const conductInternalRef = useRef(null);
  const notifyDropRef = useRef(null);
  const moreCandidatesRef = useRef(null);
  const jobOfferRef = useRef(null);

  // REF - Review Client Feedback
  const reviewClientFeedbackRef = useRef(null);

  // REF - Client Decision
  const clientDecisionRef = useRef(null);

  const measureBox = (wrapperRect, ref) => {
    const r = ref.current.getBoundingClientRect();

    return {
      left: r.left - wrapperRect.left,
      right: r.right - wrapperRect.left,
      top: r.top - wrapperRect.top,
      bottom: r.bottom - wrapperRect.top,
      centerX: r.left - wrapperRect.left + r.width / 2,
      centerY: r.top - wrapperRect.top + r.height / 2,
      width: r.width,
    };
  };

  // ===== PASSO 1:
  // mede as âncoras da Linha 1/2,
  // calcula Linhas 3, 4 e 5 por aritmética
  // =====
  useLayoutEffect(() => {
    function measure() {
      if (
        !wrapperRef.current ||
        !teamBriefingRef.current ||
        !registerPositionRef.current ||
        !candidateReturnRef.current ||
        !qualifyBoxRef.current ||
        !checkDailyRef.current ||
        !evaluateInterviewRef.current ||
        !scheduleInterviewRef.current ||
        !contactQualifiedRef.current ||
        !conductInternalRef.current
      ) {
        return;
      }

      const wrapperRect =
        wrapperRef.current.getBoundingClientRect();

      const mb = (ref) =>
        measureBox(wrapperRect, ref);

      const teamBriefing =
        mb(teamBriefingRef);

      const registerPosition =
        mb(registerPositionRef);

      const candidateReturn =
        mb(candidateReturnRef);

      const qualifyBox =
        mb(qualifyBoxRef);

      const checkDaily =
        mb(checkDailyRef);

      const evaluateInterview =
        mb(evaluateInterviewRef);

      const scheduleInterview =
        mb(scheduleInterviewRef);

      const contactQualified =
        mb(contactQualifiedRef);

      const conductInternal =
        mb(conductInternalRef);

      // ===== LINHA 1 =====

      const ROW1_WIDTHS = [
        26,
        190,
        190,
        190,
      ];

      const startCircleX =
        wrapperRect.width * 0.01 + 13;

      const row1Span =
        teamBriefing.centerX -
        startCircleX;

      const row1Centers = [
        0,
        1,
        2,
        3,
      ].map(
        (i) =>
          startCircleX +
          (row1Span * i) / 4
      );

      const row1Lefts =
        ROW1_WIDTHS.map(
          (w, i) =>
            row1Centers[i] -
            w / 2
        );

      const teamBriefingLeft =
        teamBriefing.centerX - 95;

      // Linha 1 -> Linha 2

      const r1r2Mid =
        teamBriefing.bottom +
        ROW_GAP / 2;

      const r1r2Path =
        `M${teamBriefing.centerX},${teamBriefing.bottom} ` +
        `L${teamBriefing.centerX},${r1r2Mid} ` +
        `L${registerPosition.centerX},${r1r2Mid} ` +
        `L${registerPosition.centerX},${registerPosition.top}`;

      // ===== LINHA 3 =====

      const dropY =
        candidateReturn.bottom +
        ROW_GAP;

      const row3Left =
        qualifyBox.centerX -
        ROW3_BOX_WIDTH / 2;

      const row3Top =
        dropY -
        ROW3_BOX_HEIGHT / 2;

      const dropPath =
        `M${candidateReturn.centerX},${candidateReturn.bottom} ` +
        `L${candidateReturn.centerX},${dropY} ` +
        `L${row3Left},${dropY}`;

      const moveRepliedRight =
        row3Left +
        ROW3_BOX_WIDTH;

      const checkDailyEntry1X =
        checkDaily.centerX - 20;

      const loopBackPath =
        `M${moveRepliedRight},${dropY} ` +
        `L${checkDailyEntry1X},${dropY} ` +
        `L${checkDailyEntry1X},${checkDaily.bottom}`;

      // ===== LINHA 4 =====

      const row4Top =
        row3Top +
        ROW3_BOX_HEIGHT +
        ROW_GAP_WIDE;

      const prepareResumeCenterX =
        evaluateInterview.centerX;

      const notifyDropCenterX =
        scheduleInterview.centerX;

      const moreCandidatesCenterX =
        contactQualified.centerX;

      const evalToPrepareePath =
        `M${evaluateInterview.centerX},${evaluateInterview.bottom} ` +
        `L${evaluateInterview.centerX},${row4Top}`;

      // Escada do NO da avaliação

      const EVAL_NO_STEP1_X =
        conductInternal.centerX;

      const EVAL_NO_STEP_Y =
        evaluateInterview.bottom +
        130;

      const evalToNotifyPath =
        `M${evaluateInterview.centerX},${evaluateInterview.bottom} ` +
        `L${EVAL_NO_STEP1_X},${evaluateInterview.bottom} ` +
        `L${EVAL_NO_STEP1_X},${EVAL_NO_STEP_Y} ` +
        `L${notifyDropCenterX},${EVAL_NO_STEP_Y} ` +
        `L${notifyDropCenterX},${row4Top}`;

      // ===== LINHA 5 =====

      const row5Top =
        row4Top +
        ROW4_BOX_HEIGHT +
        ROW_GAP_WIDE +
        180;

      const row5Span =
        registerPosition.centerX -
        evaluateInterview.centerX;

      const row5Centers =
        ROW5_ITEMS.map(
          (_, i) =>
            evaluateInterview.centerX +
            (row5Span * i) /
              (ROW5_ITEMS.length - 1)
        );

      const row5Lefts =
        ROW5_ITEMS.map(
          (item, i) =>
            row5Centers[i] -
            item.width / 2
        );

      const row5Tops =
        ROW5_ITEMS.map(
          (item) =>
            item.type === "diamond"
              ? row5Top - 15
              : row5Top
        );

      const row4ToRow5Path =
        `M${prepareResumeCenterX},${
          row4Top +
          ROW4_BOX_HEIGHT
        } ` +
        `L${prepareResumeCenterX},${row5Top}`;

      setLayout((prev) => ({
        ...prev,

        r1r2Path,
        dropPath,
        loopBackPath,
        evalToPrepareePath,
        evalToNotifyPath,
        row4ToRow5Path,

        row1Lefts,
        teamBriefingLeft,
        startCircleX,

        row3Left,
        row3Top,

        row4Top,

        row5Top,
        row5Lefts,
        row5Centers,
        row5Tops,

        prepareResumeCenterX,
        notifyDropCenterX,
        moreCandidatesCenterX,

        scheduleInterviewBottom:
          scheduleInterview.bottom,

        checkDailyCenterX:
          checkDaily.centerX,

        checkDailyBottom:
          checkDaily.bottom,

        dropLabelX:
          (
            candidateReturn.centerX +
            row3Left
          ) / 2,

        dropLabelY:
          dropY - 14,

        evalYesLabelX:
          evaluateInterview.centerX,

        evalYesLabelY:
          (
            evaluateInterview.bottom +
            row4Top
          ) / 2,

        evalNoLabelX:
          (
            EVAL_NO_STEP1_X +
            notifyDropCenterX
          ) / 2,

        evalNoLabelY:
          EVAL_NO_STEP_Y - 14,

        totalHeight:
          row5Top + 300,
      }));
    }

    measure();

    window.addEventListener(
      "resize",
      measure
    );

    return () =>
      window.removeEventListener(
        "resize",
        measure
      );
  }, [activeTab]);

  // ===== PASSO 2 =====
  // mede caixas que existem depois do Passo 1
  // e calcula conectores extras + Linha 6
  useLayoutEffect(() => {
    if (
      !layout?.row4Top ||
      !wrapperRef.current ||
      !notifyDropRef.current ||
      !moreCandidatesRef.current ||
      !jobOfferRef.current ||
      !reviewClientFeedbackRef.current ||
      !clientDecisionRef.current
    ) {
      return;
    }

    const wrapperRect =
      wrapperRef.current.getBoundingClientRect();

    const mb = (ref) =>
      measureBox(
        wrapperRect,
        ref
      );

    const notifyDrop =
      mb(notifyDropRef);

    const moreCandidates =
      mb(moreCandidatesRef);

    const jobOffer =
      mb(jobOfferRef);

    // ==========================================
    // REVIEW CLIENT FEEDBACK -> NO -> NOTIFY
    // ==========================================

    const reviewClientFeedback =
      mb(reviewClientFeedbackRef);

    const REVIEW_BEND_Y =
      reviewClientFeedback.top -
      60;

    const notifyBottomLeftX =
      notifyDrop.left + 58;

    const reviewFeedbackToNotifyPath =
      `M${reviewClientFeedback.centerX},${reviewClientFeedback.top} ` +
      `L${reviewClientFeedback.centerX},${REVIEW_BEND_Y} ` +
      `L${notifyBottomLeftX},${REVIEW_BEND_Y} ` +
      `L${notifyBottomLeftX},${notifyDrop.bottom}`;

    // ==========================================
    // CLIENT DECISION -> NO -> NOTIFY
    // ==========================================

    const clientDecision =
      mb(clientDecisionRef);

    const CLIENT_DECISION_BEND_Y =
      clientDecision.top - 110;

    const notifyBottomCenterX =
      notifyDrop.centerX;

    const clientDecisionToNotifyPath =
      `M${clientDecision.centerX},${clientDecision.top} ` +
      `L${clientDecision.centerX},${CLIENT_DECISION_BEND_Y} ` +
      `L${notifyBottomCenterX},${CLIENT_DECISION_BEND_Y} ` +
      `L${notifyBottomCenterX},${notifyDrop.bottom}`;

    // ==========================================
    // JOB OFFER -> NO -> NOTIFY
    // ==========================================

    // Job Offer to the candidate -> NO
    // -> entra no canto mais à direita
    // da borda de baixo do Notify Drop
    const JOB_OFFER_NO_BEND_Y =
      jobOffer.top - 170;

    const notifyBottomRightX =
      notifyDrop.right - 58;

    const jobOfferToNotifyPath =
      `M${jobOffer.centerX},${jobOffer.top} ` +
      `L${jobOffer.centerX},${JOB_OFFER_NO_BEND_Y} ` +
      `L${notifyBottomRightX},${JOB_OFFER_NO_BEND_Y} ` +
      `L${notifyBottomRightX},${notifyDrop.bottom}`;

    // ==========================================
    // NOTIFY -> MORE CANDIDATES
    // ==========================================

    const notifyToMorePath =
      `M${notifyDrop.right},${notifyDrop.centerY} ` +
      `L${moreCandidates.left},${notifyDrop.centerY}`;

    // ==========================================
    // MORE CANDIDATES -> CHECK DAILY
    // ==========================================

    const checkDailyEntry2X =
      layout.checkDailyCenterX +
      20;

    const moreRightX =
      moreCandidates.left +
      moreCandidates.width;

    const moreToCheckPath =
      `M${moreRightX},${moreCandidates.centerY} ` +
      `L${checkDailyEntry2X},${moreCandidates.centerY} ` +
      `L${checkDailyEntry2X},${layout.checkDailyBottom}`;

    // ==========================================
    // LINHA 6
    // ==========================================

    const row6Top =
      jobOffer.bottom +
      ROW_GAP;

    const jobOfferToRow6Path =
      `M${jobOffer.centerX},${jobOffer.bottom} ` +
      `L${jobOffer.centerX},${row6Top}`;

    const startCircleX =
      layout.startCircleX;

    const row6Span =
      startCircleX -
      jobOffer.centerX;

    const row6Centers =
      ROW6_ITEMS.map(
        (_, i) =>
          jobOffer.centerX +
          (row6Span * i) /
            (
              ROW6_ITEMS.length -
              1
            )
      );

    const row6Lefts =
      ROW6_ITEMS.map(
        (item, i) =>
          row6Centers[i] -
          item.width / 2
      );

    setLayout((prev) => {
      if (
        prev.notifyToMorePath ===
          notifyToMorePath &&
        prev.moreToCheckPath ===
          moreToCheckPath &&
        prev.jobOfferToRow6Path ===
          jobOfferToRow6Path &&
        prev.reviewFeedbackToNotifyPath ===
          reviewFeedbackToNotifyPath &&
        prev.clientDecisionToNotifyPath ===
          clientDecisionToNotifyPath &&
        prev.jobOfferToNotifyPath ===
          jobOfferToNotifyPath
      ) {
        return prev;
      }

      return {
        ...prev,

        notifyToMorePath,
        moreToCheckPath,
        jobOfferToRow6Path,

        // Review Client Feedback -> NO
        reviewFeedbackToNotifyPath,

        reviewFeedbackNoLabelX:
          (
            reviewClientFeedback.centerX +
            notifyBottomLeftX
          ) / 2,

        reviewFeedbackNoLabelY:
          REVIEW_BEND_Y - 14,

        // Client Decision -> NO
        clientDecisionToNotifyPath,

        clientDecisionNoLabelX:
          (
            clientDecision.centerX +
            notifyBottomCenterX
          ) / 2,

        clientDecisionNoLabelY:
          CLIENT_DECISION_BEND_Y -
          14,

        // Job Offer -> NO
        jobOfferToNotifyPath,

        jobOfferNoLabelX:
          (
            jobOffer.centerX +
            notifyBottomRightX
          ) / 2,

        jobOfferNoLabelY:
          JOB_OFFER_NO_BEND_Y -
          14,

        row6Top,
        row6Centers,
        row6Lefts,
      };
    });
  }, [
    layout?.row4Top,
    layout?.notifyDropCenterX,
    layout?.moreCandidatesCenterX,
    layout?.row5Tops,
    layout?.startCircleX,
  ]);

  return (
    <div
      className={
        styles.container
      }
    >
      <div>
        <h1 className={styles.pageTitle}>Process</h1>
        <div className={styles.accentLine}></div>
      </div>

      <div
        className={
          styles.tabsRow
        }
      >
        {TABS.map(
          (tab) => (
            <button
              key={tab}
              className={`${
                styles.tabBtn
              } ${
                activeTab ===
                tab
                  ? styles.activeTab
                  : ""
              }`}
              onClick={() =>
                setActiveTab(
                  tab
                )
              }
            >
              {tab}
            </button>
          )
        )}
      </div>

      {activeTab ===
      "BPO" ? (
        <div
          className={
            styles.flowCard
          }
        >
          <h2
            className={
              styles.flowTitle
            }
          >
            BPO Process
          </h2>

          <div
            className={
              styles.flowWrapper
            }
            ref={wrapperRef}
            style={{
              minHeight:
                layout
                  ? layout.totalHeight
                  : 900,
            }}
          >
            {/* ================================= */}
            {/* SVG DE CONECTORES */}
            {/* ================================= */}

            {layout && (
              <svg
                className={
                  styles.connectorSvg
                }
              >
                <defs>
                  <marker
                    id="grayArrow"
                    markerWidth="8"
                    markerHeight="8"
                    refX="6"
                    refY="3"
                    orient="auto"
                  >
                    <path
                      d="M0,0 L0,6 L7,3 z"
                      fill="#94a3b8"
                    />
                  </marker>

                  <marker
                    id="redArrowHead"
                    markerWidth="8"
                    markerHeight="8"
                    refX="6"
                    refY="3"
                    orient="auto"
                  >
                    <path
                      d="M0,0 L0,6 L7,3 z"
                      fill="#dc2626"
                    />
                  </marker>

                  <marker
                    id="greenArrowHead"
                    markerWidth="8"
                    markerHeight="8"
                    refX="6"
                    refY="3"
                    orient="auto"
                  >
                    <path
                      d="M0,0 L0,6 L7,3 z"
                      fill="#22c55e"
                    />
                  </marker>
                </defs>

                {/* LINHA 1 -> LINHA 2 */}

                <path
                  d={
                    layout.r1r2Path
                  }
                  fill="none"
                  stroke="#94a3b8"
                  strokeWidth="2"
                  markerEnd="url(#grayArrow)"
                />

                {/* DROP */}

                <path
                  d={
                    layout.dropPath
                  }
                  fill="none"
                  stroke="#dc2626"
                  strokeWidth="2.5"
                  markerEnd="url(#redArrowHead)"
                />

                <foreignObject
                  x={
                    layout.dropLabelX -
                    16
                  }
                  y={
                    layout.dropLabelY -
                    10
                  }
                  width="32"
                  height="20"
                >
                  <div
                    className={
                      styles.noLabel
                    }
                  >
                    NO
                  </div>
                </foreignObject>

                {/* LOOP BACK */}

                <path
                  d={
                    layout.loopBackPath
                  }
                  fill="none"
                  stroke="#dc2626"
                  strokeWidth="2.5"
                  strokeDasharray="6,3"
                  markerEnd="url(#redArrowHead)"
                />

                {/* EVALUATE YES */}

                <path
                  d={
                    layout.evalToPrepareePath
                  }
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="2.5"
                  markerEnd="url(#greenArrowHead)"
                />

                <foreignObject
                  x={
                    layout.evalYesLabelX -
                    18
                  }
                  y={
                    layout.evalYesLabelY -
                    10
                  }
                  width="36"
                  height="20"
                >
                  <div
                    className={
                      styles.yesLabelSvg
                    }
                  >
                    YES
                  </div>
                </foreignObject>

                {/* EVALUATE NO */}

                <path
                  d={
                    layout.evalToNotifyPath
                  }
                  fill="none"
                  stroke="#dc2626"
                  strokeWidth="2.5"
                  markerEnd="url(#redArrowHead)"
                />

                <foreignObject
                  x={
                    layout.evalNoLabelX -
                    16
                  }
                  y={
                    layout.evalNoLabelY -
                    10
                  }
                  width="32"
                  height="20"
                >
                  <div
                    className={
                      styles.noLabel
                    }
                  >
                    NO
                  </div>
                </foreignObject>

                {/* NOTIFY -> MORE CANDIDATES */}

                {layout.notifyToMorePath && (
                  <path
                    d={
                      layout.notifyToMorePath
                    }
                    fill="none"
                    stroke="#94a3b8"
                    strokeWidth="2"
                    markerEnd="url(#grayArrow)"
                  />
                )}

                {/* MORE CANDIDATES -> CHECK DAILY */}

                {layout.moreToCheckPath && (
                  <path
                    d={
                      layout.moreToCheckPath
                    }
                    fill="none"
                    stroke="#dc2626"
                    strokeWidth="2.5"
                    strokeDasharray="6,3"
                    markerEnd="url(#redArrowHead)"
                  />
                )}

                {/* ================================= */}
                {/* REVIEW CLIENT FEEDBACK -> NO */}
                {/* ================================= */}

                {layout.reviewFeedbackToNotifyPath && (
                  <>
                    <path
                      d={
                        layout.reviewFeedbackToNotifyPath
                      }
                      fill="none"
                      stroke="#dc2626"
                      strokeWidth="2"
                      markerEnd="url(#redArrowHead)"
                    />

                    <foreignObject
                      x={
                        layout.reviewFeedbackNoLabelX -
                        16
                      }
                      y={
                        layout.reviewFeedbackNoLabelY -
                        10
                      }
                      width="32"
                      height="20"
                    >
                      <div
                        className={
                          styles.noLabel
                        }
                      >
                        NO
                      </div>
                    </foreignObject>
                  </>
                )}

                {/* ================================= */}
                {/* CLIENT DECISION -> NO */}
                {/* ================================= */}

                {layout.clientDecisionToNotifyPath && (
                  <>
                    <path
                      d={
                        layout.clientDecisionToNotifyPath
                      }
                      fill="none"
                      stroke="#dc2626"
                      strokeWidth="2"
                      markerEnd="url(#redArrowHead)"
                    />

                    <foreignObject
                      x={
                        layout.clientDecisionNoLabelX -
                        16
                      }
                      y={
                        layout.clientDecisionNoLabelY -
                        10
                      }
                      width="32"
                      height="20"
                    >
                      <div
                        className={
                          styles.noLabel
                        }
                      >
                        NO
                      </div>
                    </foreignObject>
                  </>
                )}

                {/* ================================= */}
                {/* JOB OFFER -> NO -> NOTIFY DROP */}
                {/* ================================= */}

                {layout.jobOfferToNotifyPath && (
                  <>
                    <path
                      d={
                        layout.jobOfferToNotifyPath
                      }
                      fill="none"
                      stroke="#dc2626"
                      strokeWidth="2"
                      markerEnd="url(#redArrowHead)"
                    />

                    <foreignObject
                      x={
                        layout.jobOfferNoLabelX -
                        16
                      }
                      y={
                        layout.jobOfferNoLabelY -
                        10
                      }
                      width="32"
                      height="20"
                    >
                      <div
                        className={
                          styles.noLabel
                        }
                      >
                        NO
                      </div>
                    </foreignObject>
                  </>
                )}

                {/* LINHA 4 -> LINHA 5 */}

                <path
                  d={
                    layout.row4ToRow5Path
                  }
                  fill="none"
                  stroke="#94a3b8"
                  strokeWidth="2"
                  markerEnd="url(#grayArrow)"
                />

                {/* JOB OFFER -> LINHA 6 */}

                {layout.jobOfferToRow6Path && (
                  <path
                    d={
                      layout.jobOfferToRow6Path
                    }
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="2.5"
                    markerEnd="url(#greenArrowHead)"
                  />
                )}
              </svg>
            )}

            {/* ================================= */}
            {/* LINHA 1 */}
            {/* ================================= */}

            <div
              className={
                styles.row1
              }
            >
              <div
                className={
                  styles.flowBox
                }
                style={{
                  right: "0%",
                }}
                ref={
                  teamBriefingRef
                }
              >
                <span
                  className={
                    styles.flowBoxTitle
                  }
                >
                  Team Briefing
                </span>

                <span
                  className={
                    styles.flowBoxDesc
                  }
                >
                  Present Client &
                  Role Details,
                  Explain Strategy
                  and Delegate Tasks
                </span>
              </div>

              {layout &&
                layout.row1Lefts && (
                  <>
                    <div
                      className={
                        styles.startCircle
                      }
                      style={{
                        position:
                          "absolute",
                        left:
                          layout
                            .row1Lefts[
                            0
                          ],
                        top: 37,
                      }}
                    ></div>

                    <div
                      className={
                        styles.flowBox
                      }
                      style={{
                        position:
                          "absolute",
                        left:
                          layout
                            .row1Lefts[
                            1
                          ],
                        top: 4,
                      }}
                    >
                      <span
                        className={
                          styles.flowBoxTitle
                        }
                      >
                        Receive
                        Hiring
                        Request
                      </span>

                      <span
                        className={
                          styles.flowBoxDesc
                        }
                      >
                        (Director of
                        Operations)
                      </span>
                    </div>

                    <div
                      className={
                        styles.flowBox
                      }
                      style={{
                        position:
                          "absolute",
                        left:
                          layout
                            .row1Lefts[
                            2
                          ],
                        top: 4,
                      }}
                    >
                      <span
                        className={
                          styles.flowBoxTitle
                        }
                      >
                        Analyze
                        Client &
                        Role
                      </span>

                      <span
                        className={
                          styles.flowBoxDesc
                        }
                      >
                        sector,
                        Services,
                        Level,
                        Responsibilities
                        and
                        Requirements
                      </span>
                    </div>

                    <div
                      className={
                        styles.flowBox
                      }
                      style={{
                        position:
                          "absolute",
                        left:
                          layout
                            .row1Lefts[
                            3
                          ],
                        top: 4,
                      }}
                    >
                      <span
                        className={
                          styles.flowBoxTitle
                        }
                      >
                        Define
                        Strategy
                      </span>

                      <span
                        className={
                          styles.flowBoxDesc
                        }
                      >
                        Keywords,
                        Interview
                        Script,
                        deadline and
                        Task
                        Distribution
                      </span>
                    </div>

                    {[
                      {
                        from:
                          layout
                            .row1Lefts[
                            0
                          ] +
                          26,
                        to:
                          layout
                            .row1Lefts[
                            1
                          ],
                      },
                      {
                        from:
                          layout
                            .row1Lefts[
                            1
                          ] +
                          190,
                        to:
                          layout
                            .row1Lefts[
                            2
                          ],
                      },
                      {
                        from:
                          layout
                            .row1Lefts[
                            2
                          ] +
                          190,
                        to:
                          layout
                            .row1Lefts[
                            3
                          ],
                      },
                      {
                        from:
                          layout
                            .row1Lefts[
                            3
                          ] +
                          190,
                        to:
                          layout
                            .teamBriefingLeft,
                      },
                    ].map(
                      (
                        seg,
                        i
                      ) => (
                        <div
                          key={
                            i
                          }
                          style={{
                            position:
                              "absolute",
                            left:
                              seg.from,
                            top: 49,
                            width:
                              seg.to -
                              seg.from,
                            height:
                              2,
                            backgroundColor:
                              "#94a3b8",
                          }}
                        >
                          <div
                            style={{
                              position:
                                "absolute",
                              right:
                                0,
                              top:
                                -4,
                              width:
                                0,
                              height:
                                0,
                              borderLeft:
                                "8px solid #94a3b8",
                              borderTop:
                                "5px solid transparent",
                              borderBottom:
                                "5px solid transparent",
                            }}
                          ></div>
                        </div>
                      )
                    )}
                  </>
                )}
            </div>

            {/* ================================= */}
            {/* LINHA 2 */}
            {/* ================================= */}

            <div
              className={
                styles.row2
              }
            >
              <div
                style={{
                  width: 60,
                  flexShrink: 0,
                }}
              ></div>

              <div
                className={
                  styles.diamondWrapper
                }
              >
                <div
                  className={
                    styles.diamondShape
                  }
                  ref={
                    evaluateInterviewRef
                  }
                ></div>

                <span
                  className={
                    styles.diamondText
                  }
                >
                  Evaluate
                  <br />
                  Interview
                </span>
              </div>

              <div
                className={
                  styles.rowArrow
                }
                style={{
                  width: 35,
                }}
              ></div>

              <div
                className={
                  styles.flowBoxBlue
                }
                ref={
                  conductInternalRef
                }
              >
                <span>
                  Conduct
                  Internal
                  Interview, and
                  move to
                  'Screened' on
                  Manatal
                </span>
              </div>

              <div
                className={
                  styles.rowArrow
                }
                style={{
                  width: 35,
                }}
              ></div>

              <div
                className={
                  styles.flowBoxBlue
                }
                ref={
                  scheduleInterviewRef
                }
              >
                <span>
                  Schedule for
                  Internal
                  Interview, and
                  move to
                  'Scheduled' on
                  Manatal
                </span>
              </div>

              <div
                className={
                  styles.yesArrowCol
                }
              >
                <span
                  className={
                    styles.yesLabel
                  }
                >
                  YES
                </span>

                <div
                  className={
                    styles.greenArrow
                  }
                ></div>
              </div>

              <div
                className={
                  styles.diamondWrapper
                }
              >
                <div
                  className={
                    styles.diamondShape
                  }
                  ref={
                    candidateReturnRef
                  }
                ></div>

                <span
                  className={
                    styles.diamondText
                  }
                >
                  Candidate
                  <br />
                  Return
                </span>
              </div>

              <div
                className={
                  styles.rowArrow
                }
                style={{
                  width: 35,
                }}
              ></div>

              <div
                className={
                  styles.flowBoxBlue
                }
                ref={
                  contactQualifiedRef
                }
              >
                <span>
                  Contact
                  Qualified
                  Candidates (via
                  email, SMS,
                  InMail, etc.)
                  and Move them
                  to 'Outreached'
                  in Manatal
                </span>
              </div>

              <div
                className={
                  styles.rowArrow
                }
                style={{
                  width: 35,
                }}
              ></div>

              <div
                className={
                  styles.flowBoxBlue
                }
                ref={
                  qualifyBoxRef
                }
              >
                <span>
                  Qualify
                  Candidates with
                  ChatGPT Prompt:
                  If candidate IS
                  A FIT →
                  'Qualified'. If
                  NOT A FIT →
                  'Drop'
                </span>
              </div>

              <div
                className={
                  styles.rowArrow
                }
                style={{
                  width: 35,
                }}
              ></div>

              <div
                className={
                  styles.flowBoxBlue
                }
              >
                <span>
                  Add
                  Applications +
                  Active Search
                  candidates to
                  "New
                  Candidates" in
                  Manatal
                </span>
              </div>

              <div
                className={
                  styles.rowArrow
                }
                style={{
                  width: 35,
                }}
              ></div>

              <div
                className={
                  styles.flowBoxBlue
                }
                ref={
                  checkDailyRef
                }
              >
                <span>
                  Check Daily for
                  New Applicants
                  in
                  Linkedin/ZipRecruiter
                  & Carrerplug
                </span>
              </div>

              <div
                className={
                  styles.rowArrow
                }
                style={{
                  width: 35,
                }}
              ></div>

              <div
                className={
                  styles.flowBoxBlue
                }
              >
                <span>
                  Active Sourcing
                  Candidates
                  (Linkedin &
                  ZipRecruiter)
                </span>
              </div>

              <div
                className={
                  styles.rowArrow
                }
                style={{
                  width: 35,
                }}
              ></div>

              <div
                className={
                  styles.flowBoxBlue
                }
              >
                <span>
                  Publish Job on
                  Linkedin
                  Recruiter
                </span>
              </div>

              <div
                className={
                  styles.rowArrow
                }
                style={{
                  width: 35,
                }}
              ></div>

              <div
                className={
                  styles.flowBoxBlue
                }
                ref={
                  registerPositionRef
                }
              >
                <span>
                  Register
                  Position in the
                  system
                  (automatic in
                  the Frontall
                  website)
                </span>
              </div>
            </div>

            {/* ================================= */}
            {/* LINHA 3 */}
            {/* ================================= */}

            {layout && (
              <div
                className={
                  styles.flowBoxRed
                }
                style={{
                  position:
                    "absolute",
                  left:
                    layout.row3Left,
                  top:
                    layout.row3Top,
                }}
              >
                <span>
                  Move to
                  'Replied' and
                  Drop on Manatal
                </span>
              </div>
            )}

            {/* ================================= */}
            {/* LINHA 4 */}
            {/* ================================= */}

            {layout && (
              <>
                <div
                  className={
                    styles.flowBoxBlue
                  }
                  style={{
                    position:
                      "absolute",
                    left:
                      layout.prepareResumeCenterX -
                      95,
                    top:
                      layout.row4Top,
                  }}
                >
                  <span>
                    Prepare
                    Candidate
                    Internal Resume
                    Template and
                    Overview to
                    the client
                    (Material)
                  </span>
                </div>

                <div
                  className={
                    styles.flowBoxRed
                  }
                  ref={
                    notifyDropRef
                  }
                  style={{
                    position:
                      "absolute",
                    left:
                      layout.notifyDropCenterX -
                      95,
                    top:
                      layout.row4Top,
                  }}
                >
                  <span>
                    Notify the
                    candidate and
                    Drop in
                    Manatal
                  </span>
                </div>

                <div
                  className={
                    styles.diamondWrapper
                  }
                  style={{
                    position:
                      "absolute",
                    left:
                      layout.moreCandidatesCenterX -
                      65,
                    top:
                      layout.row4Top -
                      19,
                  }}
                >
                  <div
                    className={
                      styles.diamondShape
                    }
                    ref={
                      moreCandidatesRef
                    }
                  ></div>

                  <span
                    className={
                      styles.diamondText
                    }
                  >
                    Are There More
                    <br />
                    Candidates to
                    <br />
                    Proceed With?
                  </span>
                </div>
              </>
            )}

            {/* ================================= */}
            {/* LINHA 5 */}
            {/* ================================= */}

            {layout &&
              layout.row5Lefts &&
              ROW5_ITEMS.map(
                (
                  item,
                  i
                ) => {
                  const left =
                    layout
                      .row5Lefts[
                      i
                    ];

                  const top =
                    layout
                      .row5Tops[
                      i
                    ];

                  const isLast =
                    i ===
                    ROW5_ITEMS.length -
                      1;

                  const nextLeft =
                    !isLast
                      ? layout
                          .row5Lefts[
                          i + 1
                        ]
                      : null;

                  const isYesConnector =
                    ROW5_YES_AFTER_INDEX.includes(
                      i
                    );

                  const boxRight =
                    left +
                    item.width;

                  const gapWidth =
                    !isLast
                      ? nextLeft -
                        boxRight
                      : 0;

                  const boxCenterY =
                    top +
                    (item.type ===
                    "diamond"
                      ? 65
                      : 46);

                  return (
                    <div
                      key={`row5-${i}`}
                    >
                      {item.type ===
                      "diamond" ? (
                        <div
                          className={
                            styles.diamondWrapper
                          }
                          style={{
                            position:
                              "absolute",
                            left,
                            top,
                          }}
                        >
                          <div
                            className={
                              styles.diamondShape
                            }
                            ref={
                              i === 2
                                ? reviewClientFeedbackRef
                                : i ===
                                    4
                                  ? clientDecisionRef
                                  : i ===
                                      ROW5_ITEMS.length -
                                        1
                                    ? jobOfferRef
                                    : null
                            }
                          ></div>

                          <span
                            className={
                              styles.diamondText
                            }
                          >
                            {
                              item.text
                            }
                          </span>
                        </div>
                      ) : (
                        <div
                          className={
                            styles.flowBoxBlue
                          }
                          style={{
                            position:
                              "absolute",
                            left,
                            top,
                          }}
                        >
                          <span>
                            {
                              item.text
                            }
                          </span>
                        </div>
                      )}

                      {!isLast && (
                        <div
                          style={{
                            position:
                              "absolute",
                            left:
                              boxRight,
                            top:
                              boxCenterY -
                              1,
                            width:
                              gapWidth,
                            height:
                              2,
                            backgroundColor:
                              isYesConnector
                                ? "#22c55e"
                                : "#94a3b8",
                          }}
                        >
                          <div
                            style={{
                              position:
                                "absolute",
                              right:
                                0,
                              top:
                                -4,
                              width:
                                0,
                              height:
                                0,
                              borderLeft: `8px solid ${
                                isYesConnector
                                  ? "#22c55e"
                                  : "#94a3b8"
                              }`,
                              borderTop:
                                "5px solid transparent",
                              borderBottom:
                                "5px solid transparent",
                            }}
                          ></div>

                          {isYesConnector && (
                            <span
                              className={
                                styles.yesLabel
                              }
                              style={{
                                position:
                                  "absolute",
                                left:
                                  "50%",
                                top:
                                  -22,
                                transform:
                                  "translateX(-50%)",
                              }}
                            >
                              YES
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                }
              )}

            {/* ================================= */}
            {/* LINHA 6 */}
            {/* ================================= */}

            {layout &&
              layout.row6Lefts &&
              ROW6_ITEMS.map(
                (
                  item,
                  i
                ) => {
                  const left =
                    layout
                      .row6Lefts[
                      i
                    ];

                  const isLast =
                    i ===
                    ROW6_ITEMS.length -
                      1;

                  const nextLeft =
                    !isLast
                      ? layout
                          .row6Lefts[
                          i + 1
                        ]
                      : null;

                  const nextWidth =
                    !isLast
                      ? ROW6_ITEMS[
                          i + 1
                        ].width
                      : null;

                  const boxCenterY =
                    layout.row6Top +
                    (item.type ===
                    "circle"
                      ? 13
                      : 46);

                  if (
                    item.type ===
                    "circle"
                  ) {
                    return (
                      <div
                        key={`row6-${i}`}
                        className={
                          styles.endCircle
                        }
                        style={{
                          position:
                            "absolute",
                          left,
                          top:
                            layout.row6Top +
                            33,
                        }}
                      ></div>
                    );
                  }

                  const boxRight =
                    left +
                    item.width;

                  const gapWidth =
                    !isLast
                      ? left -
                        (
                          nextLeft +
                          nextWidth
                        )
                      : 0;

                  return (
                    <div
                      key={`row6-${i}`}
                    >
                      <div
                        className={
                          styles.flowBoxBlue
                        }
                        style={{
                          position:
                            "absolute",
                          left,
                          top:
                            layout.row6Top,
                        }}
                      >
                        <span>
                          {
                            item.text
                          }
                        </span>
                      </div>

                      {!isLast && (
                        <div
                          style={{
                            position:
                              "absolute",
                            left:
                              nextLeft +
                              nextWidth,
                            top:
                              boxCenterY -
                              1,
                            width:
                              gapWidth,
                            height:
                              2,
                            backgroundColor:
                              "#94a3b8",
                          }}
                        >
                          <div
                            style={{
                              position:
                                "absolute",
                              left:
                                0,
                              top:
                                -4,
                              width:
                                0,
                              height:
                                0,
                              borderRight:
                                "8px solid #94a3b8",
                              borderTop:
                                "5px solid transparent",
                              borderBottom:
                                "5px solid transparent",
                            }}
                          ></div>
                        </div>
                      )}
                    </div>
                  );
                }
              )}
          </div>
        </div>
      ) : (
        <div
          className={
            styles.placeholderTab
          }
        >
          <p>
            {activeTab} flow
            coming soon.
          </p>
        </div>
      )}
    </div>
  );
}