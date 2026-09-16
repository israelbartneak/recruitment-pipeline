// src/app/reports/page.js
"use client";

import { useState } from "react";
import {
  SlidersHorizontal,
  RotateCcw,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import { mockJobs } from "../jobs-board/mockJobs";
import {
  mockCandidateJobs,
  PIPELINE_STAGES,
} from "../jobs-board/mockCandidateJobs";
import { mockClients } from "../clients/mockClients";
import {
  mockProcessCosts,
  getAnnualCost,
} from "./mockProcessCosts";

import styles from "./reports.module.css";

const TABS = ["Filter", "Dashboard", "Analyst"];

const CONTRACT_TYPES = [
  { key: "BPO", label: "BPO" },
  { key: "DIRECT_HIRE", label: "Direct Hire" },
  { key: "EOR", label: "EOR" },
  { key: "TEMP", label: "Temp" },
  { key: "BID", label: "Bid" },
  { key: "INTERNAL", label: "Internal" },
];

const SERVICE_LINE_ORDER = [
  { key: "BPO", label: "BPO" },
  { key: "EOR", label: "EOR" },
  { key: "DIRECT_HIRE", label: "Direct Hiring" },
  { key: "INTERNAL", label: "Internal" },
  { key: "TEMP", label: "Temporary" },
  { key: "BID", label: "Bid" },
];

// Placeholder até termos um campo real de "responsável pela vaga"
const DEFAULT_JOB_CONTACT = "John Smith";

const AGING_THRESHOLD_DAYS = 45;

const CONTRACT_TYPE_BADGE = {
  BPO: { color: "#0369a1", bg: "#e0f2fe" },
  DIRECT_HIRE: { color: "#15803d", bg: "#dcfce7" },
  EOR: { color: "#c2410c", bg: "#ffedd5" },
  TEMP: { color: "#b45309", bg: "#fef3c7" },
  BID: { color: "#6d28d9", bg: "#ede9fe" },
  INTERNAL: { color: "#0f766e", bg: "#ccfbf1" },
};

const STAGE_META = {
  new: { label: "New", color: "#64748b" },
  process: { label: "Recruiting", color: "#1d4ed8" },
  submitted: { label: "Submitted", color: "#b45309" },

  client_interview: {
    label: "Client Interview",
    color: "#c2410c",
  },

  onboarding: {
    label: "Offer & Onboarding",
    color: "#7c3aed",
  },

  concluded: {
    label: "Concluded",
    color: "#15803d",
  },
};

const PRIORITY_BADGE = {
  High: {
    color: "#dc2626",
    bg: "#fee2e2",
  },

  Standard: {
    color: "#475569",
    bg: "#f1f5f9",
  },
};

const STATUS_LABELS = {
  ACTIVE: "Active",
  ON_HOLD: "On Hold",
  INACTIVE: "Inactive",
};

const STATUS_BADGE = {
  ACTIVE: {
    color: "#15803d",
    bg: "#dcfce7",
  },

  ON_HOLD: {
    color: "#b45309",
    bg: "#fef3c7",
  },

  INACTIVE: {
    color: "#64748b",
    bg: "#f1f5f9",
  },
};

const CLIENT_ACCOUNT_LABELS = {
  ACTIVES: "Under Contract",
  PROSPECTION: "Prospects",
  BID: "Bids",
  INACTIVES: "Inactive",
};

const CLIENT_ACCOUNT_BADGE = {
  ACTIVES: {
    color: "#15803d",
    bg: "#dcfce7",
  },

  PROSPECTION: {
    color: "#c2410c",
    bg: "#ffedd5",
  },

  BID: {
    color: "#6d28d9",
    bg: "#ede9fe",
  },

  INACTIVES: {
    color: "#64748b",
    bg: "#f1f5f9",
  },
};

const PERIOD_OPTIONS = [
  {
    key: "all",
    label: "All Time",
  },

  {
    key: "30",
    label: "Last 30 Days",
  },

  {
    key: "90",
    label: "Last 90 Days",
  },

  {
    key: "365",
    label: "Last 12 Months",
  },
];

// Range padrão de teste, enquanto o volume real de dados ainda é pequeno
const DEFAULT_RANGE_START = new Date(2025, 3, 15);
const DEFAULT_RANGE_END = new Date(2026, 7, 15);

const MOVING_AVERAGE_WINDOW = 3;

// Parseia datas no formato DD/MM/AAAA usadas nos mocks
function parseDate(str) {
  if (!str) {
    return null;
  }

  const [day, month, year] = str
    .split("/")
    .map(Number);

  return new Date(
    year,
    month - 1,
    day,
  );
}

function daysSince(dateStr) {
  const date = parseDate(dateStr);

  if (!date) {
    return null;
  }

  const diffMs =
    Date.now() -
    date.getTime();

  return Math.max(
    0,
    Math.floor(
      diffMs /
        (1000 * 60 * 60 * 24),
    ),
  );
}

// Placeholder até termos autenticação real implementada
const CURRENT_USER = "Bryan Santana";

function formatRelativeTime(isoString) {
  const diffMs =
    Date.now() -
    new Date(
      isoString,
    ).getTime();

  const diffMin = Math.floor(
    diffMs / 60000,
  );

  if (diffMin < 1) {
    return "just now";
  }

  if (diffMin < 60) {
    return `${diffMin}m ago`;
  }

  const diffH = Math.floor(
    diffMin / 60,
  );

  if (diffH < 24) {
    return `${diffH}h ago`;
  }

  const diffD = Math.floor(
    diffH / 24,
  );

  return `${diffD}d ago`;
}

function daysBetween(
  startDate,
  endDate,
) {
  return Math.max(
    0,
    Math.round(
      (endDate.getTime() -
        startDate.getTime()) /
        (1000 *
          60 *
          60 *
          24),
    ),
  );
}

function formatDateLabel(date) {
  return date.toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    },
  );
}

// Gera os buckets de tempo de acordo com o tamanho do range
function buildTimeBuckets(
  start,
  end,
) {
  const totalDays =
    daysBetween(
      start,
      end,
    );

  let unit = "month";

  if (totalDays <= 31) {
    unit = "day";
  } else if (
    totalDays <= 180
  ) {
    unit = "week";
  }

  const buckets = [];

  let cursor =
    new Date(start);

  while (cursor <= end) {
    let bucketEnd;
    let label;

    if (unit === "day") {
      bucketEnd =
        new Date(cursor);

      label =
        cursor.toLocaleDateString(
          "en-US",
          {
            month: "short",
            day: "numeric",
          },
        );

      cursor = new Date(
        cursor.getFullYear(),
        cursor.getMonth(),
        cursor.getDate() + 1,
      );
    } else if (
      unit === "week"
    ) {
      bucketEnd = new Date(
        cursor.getFullYear(),
        cursor.getMonth(),
        cursor.getDate() + 6,
      );

      label =
        cursor.toLocaleDateString(
          "en-US",
          {
            month: "short",
            day: "numeric",
          },
        );

      cursor = new Date(
        cursor.getFullYear(),
        cursor.getMonth(),
        cursor.getDate() + 7,
      );
    } else {
      bucketEnd = new Date(
        cursor.getFullYear(),
        cursor.getMonth() + 1,
        0,
      );

      label =
        cursor.toLocaleDateString(
          "en-US",
          {
            month: "short",
            year: "2-digit",
          },
        );

      cursor = new Date(
        cursor.getFullYear(),
        cursor.getMonth() + 1,
        1,
      );
    }

    buckets.push({
      start: new Date(
        bucketEnd.getFullYear(),
        bucketEnd.getMonth(),
        bucketEnd.getDate() -
          (unit === "day"
            ? 0
            : unit === "week"
              ? 6
              : bucketEnd.getDate() -
                1),
      ),

      end: bucketEnd,
      label,
    });
  }

  return {
    buckets,
    unit,
  };
}

function movingAverage(
  values,
  window,
) {
  return values.map(
    (_, idx) => {
      const start =
        Math.max(
          0,
          idx -
            window +
            1,
        );

      const slice =
        values.slice(
          start,
          idx + 1,
        );

      const sum =
        slice.reduce(
          (a, b) =>
            a + b,
          0,
        );

      return (
        sum /
        slice.length
      );
    },
  );
}

function TrendBarChart({
  title,
  buckets,
  values,
  color,
  higherIsBetter = true,
}) {
  const max = Math.max(
    ...values,
    1,
  );

  const avg =
    movingAverage(
      values,
      MOVING_AVERAGE_WINDOW,
    );

  const avgMax = Math.max(
    ...avg,
    1,
  );

  const scaleMax =
    Math.max(
      max,
      avgMax,
    );

  const yAxisSteps = 4;

  const yLabels =
    Array.from(
      {
        length:
          yAxisSteps +
          1,
      },
      (_, i) =>
        Math.round(
          (scaleMax /
            yAxisSteps) *
            (yAxisSteps -
              i),
        ),
    );

  const points = avg
    .map(
      (v, i) => {
        const x =
          ((i + 0.5) /
            buckets.length) *
          100;

        const y =
          90 -
          (v /
            scaleMax) *
            90;

        return `${x},${y}`;
      },
    )
    .join(" ");

  const labelStep =
    Math.max(
      1,
      Math.ceil(
        buckets.length /
          5,
      ),
    );

  const lastValue =
    values[
      values.length -
        1
    ] || 0;

  const prevValue =
    values[
      values.length -
        2
    ] || 0;

  const percentChange =
    prevValue === 0
      ? lastValue === 0
        ? 0
        : 100
      : ((lastValue -
            prevValue) /
          prevValue) *
        100;

  const isUp =
    percentChange >= 0;

  const isPositiveOutcome =
    higherIsBetter
      ? isUp
      : !isUp;

  return (
    <div
      className={
        styles.card
      }
    >
      <div
        className={
          styles.trendCardHeader
        }
      >
        <span
          className={
            styles.trendCardTitle
          }
        >
          {title}
        </span>

        <span
          className={
            styles.trendCardSummary
          }
        >
          <span
            className={
              styles.trendCardValue
            }
          >
            {lastValue}
          </span>

          <span
            className={
              styles.trendChangePill
            }
            style={
              isPositiveOutcome
                ? {
                    color:
                      "#15803d",
                    backgroundColor:
                      "#dcfce7",
                  }
                : {
                    color:
                      "#dc2626",
                    backgroundColor:
                      "#fee2e2",
                  }
            }
          >
            {isUp
              ? "▲"
              : "▼"}{" "}
            {Math.abs(
              percentChange,
            ).toFixed(
              0,
            )}
            %
          </span>
        </span>
      </div>

      <div
        className={
          styles.trendChartRow
        }
      >
        <div
          className={
            styles.trendYAxis
          }
        >
          {yLabels.map(
            (v, i) => (
              <span
                key={
                  i
                }
              >
                {
                  v
                }
              </span>
            ),
          )}
        </div>

        <div
          className={
            styles.trendChartArea
          }
        >
          <svg
            viewBox="0 0 100 90"
            preserveAspectRatio="none"
            className={
              styles.trendSvgOverlay
            }
          >
            <polyline
              points={
                points
              }
              fill="none"
              stroke="#FE5102"
              strokeWidth="1.2"
            />
          </svg>

          <div
            className={
              styles.trendBars
            }
          >
            {values.map(
              (
                v,
                i,
              ) => (
                <div
                  key={
                    i
                  }
                  className={
                    styles.trendBarWrapper
                  }
                >
                  <span
                    className={
                      styles.trendBarValue
                    }
                  >
                    {
                      v
                    }
                  </span>

                  <div
                    className={
                      styles.trendBar
                    }
                    style={{
                      height: `${(v / scaleMax) * 100}%`,
                      backgroundColor:
                        color,
                    }}
                  ></div>
                </div>
              ),
            )}
          </div>
        </div>
      </div>

      <div
        className={
          styles.trendXAxis
        }
      >
        {buckets.map(
          (
            b,
            i,
          ) => (
            <span
              key={
                i
              }
              className={
                styles.trendXLabel
              }
            >
              {i %
                labelStep ===
              0
                ? b.label
                : ""}
            </span>
          ),
        )}
      </div>

      <div
        className={
          styles.movingAvgLegend
        }
      >
        —{" "}
        {
          MOVING_AVERAGE_WINDOW
        }
        -period moving
        average

        {!higherIsBetter && (
          <span
            className={
              styles.trendHint
            }
          >
            {" "}
            (lower is better
            here)
          </span>
        )}
      </div>
    </div>
  );
}

function buildConicGradient(
  data,
) {
  const total =
    data.reduce(
      (
        sum,
        d,
      ) =>
        sum +
        d.value,
      0,
    ) || 1;

  let acc = 0;

  const stops =
    data.map((d) => {
      const start =
        (acc /
          total) *
        100;

      acc +=
        d.value;

      const end =
        (acc /
          total) *
        100;

      return `${d.color} ${start}% ${end}%`;
    });

  return `conic-gradient(${stops.join(", ")})`;
}

const PLATFORM_DATA = [
  {
    label: "LinkedIn",
    value: 7,
    color: "#1d4ed8",
  },

  {
    label: "Other",
    value: 8,
    color: "#94a3b8",
  },
];

const METHOD_DATA = [
  {
    label: "Active",
    value: 4,
    color: "#c2410c",
  },

  {
    label: "Applicants",
    value: 11,
    color: "#94a3b8",
  },
];

const DROP_REASON_DATA = [
  {
    label:
      "Salary mismatch",
    value: 1,
    color: "#dc2626",
  },

  {
    label:
      "No response",
    value: 1,
    color: "#eab308",
  },

  {
    label: "Other",
    value: 0,
    color: "#64748b",
  },
];

const CANCEL_REASON_COLORS = {
  "No client response":
    "#dc2626",

  "Hired internally":
    "#7c3aed",

  "Budget cut":
    "#eab308",

  Other: "#64748b",
};

const TIME_DISTRIBUTION = {
  operational: 40,
  waitingClient: 60,
};

const TIME_DISTRIBUTION_DONUT_DATA =
  [
    {
      label:
        "Operational",

      value:
        TIME_DISTRIBUTION.operational,

      color:
        "#1d4ed8",
    },

    {
      label:
        "Waiting Client",

      value:
        TIME_DISTRIBUTION.waitingClient,

      color:
        "#c2410c",
    },
  ];

export default function ReportsPage() {
  const [
    activeTab,
    setActiveTab,
  ] = useState(
    "Filter",
  );

  const [
    jobsDashboard,
    setJobsDashboard,
  ] = useState(
    () =>
      mockJobs,
  );

  const [
    editingJobId,
    setEditingJobId,
  ] = useState(
    null,
  );

  const [
    editForm,
    setEditForm,
  ] = useState({
    priority:
      "Standard",

    notes: "",
  });

  const [
    openHistoryJobId,
    setOpenHistoryJobId,
  ] = useState(
    null,
  );

  // ---- Filtros da aba Filter ----

  const [
    isReportFilterOpen,
    setIsReportFilterOpen,
  ] = useState(
    false,
  );

  const [
    rContractType,
    setRContractType,
  ] = useState(
    "all",
  );

  const [
    rClient,
    setRClient,
  ] = useState(
    "all",
  );

  const [
    rStatus,
    setRStatus,
  ] = useState(
    "all",
  );

  const [
    rStage,
    setRStage,
  ] = useState(
    "all",
  );

  const [
    rWorkload,
    setRWorkload,
  ] = useState(
    "all",
  );

  const [
    rPriority,
    setRPriority,
  ] = useState(
    "all",
  );

  const [
    rAccountType,
    setRAccountType,
  ] = useState(
    "all",
  );

  const [
    rKeywords,
    setRKeywords,
  ] = useState(
    "",
  );

  // ---- Filtros da aba Dashboard ----

  const [
    dPeriodStart,
    setDPeriodStart,
  ] = useState(
    "",
  );

  const [
    dPeriodEnd,
    setDPeriodEnd,
  ] = useState(
    "",
  );

  // ---- Filtros da aba Graphs ----

  const [
    period,
    setPeriod,
  ] = useState(
    "all",
  );

  const [
    contractType,
    setContractType,
  ] = useState(
    "all",
  );

  const [
    clientFilter,
    setClientFilter,
  ] = useState(
    "all",
  );

  const [
    positionFilter,
    setPositionFilter,
  ] = useState(
    "all",
  );

  // ---- Filtros da aba Analyst ----

  const [
    aPeriod,
    setAPeriod,
  ] = useState(
    "all",
  );

  const [
    aStatus,
    setAStatus,
  ] = useState(
    "all",
  );

  const [
    aContractType,
    setAContractType,
  ] = useState(
    "all",
  );

  const [
    aClient,
    setAClient,
  ] = useState(
    "all",
  );

  const [
    aPosition,
    setAPosition,
  ] = useState(
    "all",
  );

  const [
    aFormat,
    setAFormat,
  ] = useState(
    "all",
  );

  const [
    aWorkType,
    setAWorkType,
  ] = useState(
    "all",
  );

  const [
    aLocation,
    setALocation,
  ] = useState(
    "all",
  );

  const openJobs =
    jobsDashboard.filter(
      (j) =>
        j.status !==
        "INACTIVE",
    );

  const contractTypeCounts =
    CONTRACT_TYPES.map(
      (type) => ({
        ...type,

        count:
          openJobs.filter(
            (j) =>
              j.clientStatus ===
              type.key,
          ).length,
      }),
    );

  const getClientAccount = (
    clientId,
  ) => {
    const client =
      mockClients.find(
        (c) =>
          c.id ===
          clientId,
      );

    return client
      ? client.status
      : null;
  };

  const reportClientOptions =
    [
      ...new Set(
        openJobs.map(
          (j) =>
            j.company,
        ),
      ),
    ];

  const reportWorkloadOptions =
    [
      ...new Set(
        openJobs.map(
          (j) =>
            j.employmentType,
        ),
      ),
    ];

  const filteredOpenJobs =
    openJobs.filter(
      (job) => {
        if (
          rContractType !==
            "all" &&
          job.clientStatus !==
            rContractType
        ) {
          return false;
        }

        if (
          rClient !==
            "all" &&
          job.company !==
            rClient
        ) {
          return false;
        }

        if (
          rStatus !==
            "all" &&
          job.status !==
            rStatus
        ) {
          return false;
        }

        if (
          rStage !==
            "all" &&
          job.stage !==
            rStage
        ) {
          return false;
        }

        if (
          rWorkload !==
            "all" &&
          job.employmentType !==
            rWorkload
        ) {
          return false;
        }

        if (
          rPriority !==
            "all" &&
          job.priority !==
            rPriority
        ) {
          return false;
        }

        if (
          rAccountType !==
          "all"
        ) {
          const accountKey =
            getClientAccount(
              job.clientId,
            );

          if (
            accountKey !==
            rAccountType
          ) {
            return false;
          }
        }

        if (
          rKeywords
        ) {
          const kw =
            rKeywords.toLowerCase();

          if (
            !job.title
              .toLowerCase()
              .includes(
                kw,
              ) &&
            !job.company
              .toLowerCase()
              .includes(
                kw,
              )
          ) {
            return false;
          }
        }

        return true;
      },
    );

  const handleClearReportFilters =
    () => {
      setRContractType(
        "all",
      );

      setRClient(
        "all",
      );

      setRStatus(
        "all",
      );

      setRStage(
        "all",
      );

      setRWorkload(
        "all",
      );

      setRPriority(
        "all",
      );

      setRAccountType(
        "all",
      );

      setRKeywords(
        "",
      );
    };

  // ---- Cálculos da aba Dashboard ----

  const dashboardFilteredJobs =
    mockJobs.filter(
      (job) => {
        const opened =
          parseDate(
            job.openDate,
          );

        if (!opened) {
          return false;
        }

        if (
          dPeriodStart
        ) {
          const startDate =
            new Date(
              dPeriodStart,
            );

          if (
            opened <
            startDate
          ) {
            return false;
          }
        }

        if (
          dPeriodEnd
        ) {
          const endDate =
            new Date(
              dPeriodEnd,
            );

          if (
            opened >
            endDate
          ) {
            return false;
          }
        }

        return true;
      },
    );

  const dTotalPosition =
    dashboardFilteredJobs.length;

  const dOpenCount =
    dashboardFilteredJobs.filter(
      (j) =>
        j.status ===
          "ACTIVE" &&
        j.stage !==
          "concluded",
    ).length;

  const dOnHoldCount =
    dashboardFilteredJobs.filter(
      (j) =>
        j.status ===
        "ON_HOLD",
    ).length;

  const dFilledJobs =
    dashboardFilteredJobs.filter(
      (j) =>
        j.stage ===
        "concluded",
    );

  const dFilledCount =
    dFilledJobs.length;

  const dCancelledCount =
    dashboardFilteredJobs.filter(
      (j) =>
        j.status ===
          "INACTIVE" &&
        j.stage !==
          "concluded",
    ).length;

  const dConversionRate =
    dTotalPosition > 0
      ? Math.round(
          (dFilledCount /
            dTotalPosition) *
            100,
        )
      : 0;

  const dAvgTimeJobs =
    dFilledJobs.filter(
      (j) =>
        j.clientStatus !==
          "BID" &&
        j.closeDate,
    );

  const dAvgTimeToHire =
    dAvgTimeJobs.length > 0
      ? Math.round(
          dAvgTimeJobs.reduce(
            (
              sum,
              j,
            ) => {
              const opened =
                parseDate(
                  j.openDate,
                );

              const closed =
                parseDate(
                  j.closeDate,
                );

              return (
                sum +
                (opened &&
                closed
                  ? daysBetween(
                      opened,
                      closed,
                    )
                  : 0)
              );
            },
            0,
          ) /
            dAvgTimeJobs.length,
        )
      : 0;

  // ---- Tabela "Portfolio by Service Line" ----

  const servicePortfolioRows =
    SERVICE_LINE_ORDER.map(
      (line) => {
        const lineJobs =
          dashboardFilteredJobs.filter(
            (j) =>
              j.clientStatus ===
              line.key,
          );

        const positions =
          lineJobs.length;

        const fullTime =
          lineJobs.filter(
            (j) =>
              j.employmentType ===
              "Full Time",
          ).length;

        const partTime =
          lineJobs.filter(
            (j) =>
              j.employmentType ===
              "Part Time",
          ).length;

        const open =
          lineJobs.filter(
            (j) =>
              j.status ===
                "ACTIVE" &&
              j.stage !==
                "concluded",
          ).length;

        const onHold =
          lineJobs.filter(
            (j) =>
              j.status ===
              "ON_HOLD",
          ).length;

        const cancelled =
          lineJobs.filter(
            (j) =>
              j.status ===
                "INACTIVE" &&
              j.stage !==
                "concluded",
          ).length;

        const filledJobs =
          lineJobs.filter(
            (j) =>
              j.stage ===
              "concluded",
          );

        const filled =
          filledJobs.length;

        const fillRate =
          positions > 0
            ? Math.round(
                (filled /
                  positions) *
                  100,
              )
            : 0;

        const timeJobs =
          filledJobs.filter(
            (j) =>
              j.closeDate,
          );

        const avgTimeToHire =
          timeJobs.length > 0
            ? Math.round(
                timeJobs.reduce(
                  (
                    sum,
                    j,
                  ) => {
                    const opened =
                      parseDate(
                        j.openDate,
                      );

                    const closed =
                      parseDate(
                        j.closeDate,
                      );

                    return (
                      sum +
                      (opened &&
                      closed
                        ? daysBetween(
                            opened,
                            closed,
                          )
                        : 0)
                    );
                  },
                  0,
                ) /
                  timeJobs.length,
              )
            : null;

        const highPrioOpen =
          lineJobs.filter(
            (j) =>
              j.status ===
                "ACTIVE" &&
              j.stage !==
                "concluded" &&
              j.priority ===
                "High",
          ).length;

        return {
          label:
            line.label,

          positions,
          fullTime,
          partTime,
          open,
          onHold,
          cancelled,
          filled,
          fillRate,
          avgTimeToHire,
          highPrioOpen,
        };
      },
    );

  const servicePortfolioTotal =
    servicePortfolioRows.reduce(
      (
        acc,
        row,
      ) => ({
        positions:
          acc.positions +
          row.positions,

        fullTime:
          acc.fullTime +
          row.fullTime,

        partTime:
          acc.partTime +
          row.partTime,

        open:
          acc.open +
          row.open,

        onHold:
          acc.onHold +
          row.onHold,

        cancelled:
          acc.cancelled +
          row.cancelled,

        filled:
          acc.filled +
          row.filled,

        highPrioOpen:
          acc.highPrioOpen +
          row.highPrioOpen,

        timeSum:
          acc.timeSum +
          (row.avgTimeToHire !==
          null
            ? row.avgTimeToHire
            : 0),

        timeCount:
          acc.timeCount +
          (row.avgTimeToHire !==
          null
            ? 1
            : 0),
      }),

      {
        positions: 0,
        fullTime: 0,
        partTime: 0,
        open: 0,
        onHold: 0,
        cancelled: 0,
        filled: 0,
        highPrioOpen: 0,
        timeSum: 0,
        timeCount: 0,
      },
    );

  const servicePortfolioTotalFillRate =
    servicePortfolioTotal.positions >
    0
      ? Math.round(
          (servicePortfolioTotal.filled /
            servicePortfolioTotal.positions) *
            100,
        )
      : 0;

  const servicePortfolioTotalAvgTime =
    servicePortfolioTotal.timeCount >
    0
      ? Math.round(
          servicePortfolioTotal.timeSum /
            servicePortfolioTotal.timeCount,
        )
      : null;

  // ---- "Pipeline by Status" — aproximação das 10 etapas a partir dos
  // campos reais (stage/status/clientStatus) que já existem hoje ----

  const PIPELINE_ROWS_CONFIG = [
    {
      status:
        "Open",

      stage:
        "Sourcing Candidates",

      match:
        (j) =>
          j.clientStatus !==
            "BID" &&
          j.status ===
            "ACTIVE" &&
          j.stage ===
            "new",
    },

    {
      status:
        "Open",

      stage:
        "Interview Scheduling",

      match:
        (j) =>
          j.clientStatus !==
            "BID" &&
          j.status ===
            "ACTIVE" &&
          j.stage ===
            "process",
    },

    {
      status:
        "Open",

      stage:
        "Client Interview",

      match:
        (j) =>
          j.clientStatus !==
            "BID" &&
          j.status ===
            "ACTIVE" &&
          j.stage ===
            "client_interview",
    },

    {
      status:
        "Open",

      stage:
        "Awaiting Client Feedback",

      match:
        (j) =>
          j.clientStatus !==
            "BID" &&
          j.status ===
            "ACTIVE" &&
          j.stage ===
            "submitted",
    },

    {
      status:
        "Open",

      stage:
        "Onboarding",

      match:
        (j) =>
          j.clientStatus !==
            "BID" &&
          j.status ===
            "ACTIVE" &&
          j.stage ===
            "onboarding",
    },

    {
      status:
        "Open",

      stage:
        "Bid Response Pending",

      match:
        (j) =>
          j.clientStatus ===
            "BID" &&
          j.status ===
            "ACTIVE" &&
          j.stage !==
            "concluded",
    },

    {
      status:
        "Open",

      stage:
        "Commercial Follow-up",

      // Sem campo correspondente nos dados hoje — fica sempre zerado até
      // criarmos uma etapa própria pra isso no fluxo de dados
      match:
        () =>
          false,
    },

    {
      status:
        "On Hold",

      stage:
        "On Hold",

      match:
        (j) =>
          j.status ===
          "ON_HOLD",
    },

    {
      status:
        "Cancelled",

      stage:
        "Cancelled",

      match:
        (j) =>
          j.status ===
            "INACTIVE" &&
          j.stage !==
            "concluded",
    },

    {
      status:
        "Concluded",

      stage:
        "Concluded",

      match:
        (j) =>
          j.stage ===
          "concluded",
    },
  ];

  const pipelineTotalPositions =
    dashboardFilteredJobs.length;

  const pipelineRows =
    PIPELINE_ROWS_CONFIG.map(
      (row) => {
        const rowJobs =
          dashboardFilteredJobs.filter(
            row.match,
          );

        const positions =
          rowJobs.length;

        const share =
          pipelineTotalPositions >
          0
            ? Math.round(
                (positions /
                  pipelineTotalPositions) *
                  100,
              )
            : 0;

        const isClosed =
          row.stage ===
            "Concluded" ||
          row.stage ===
            "Cancelled";

        const timedJobs =
          isClosed
            ? rowJobs.filter(
                (j) =>
                  j.closeDate,
              )
            : rowJobs.filter(
                (j) =>
                  j.openDate,
              );

        const avgDays =
          timedJobs.length > 0
            ? Math.round(
                timedJobs.reduce(
                  (
                    sum,
                    j,
                  ) => {
                    if (
                      isClosed
                    ) {
                      const opened =
                        parseDate(
                          j.openDate,
                        );

                      const closed =
                        parseDate(
                          j.closeDate,
                        );

                      return (
                        sum +
                        (opened &&
                        closed
                          ? daysBetween(
                              opened,
                              closed,
                            )
                          : 0)
                      );
                    }

                    return (
                      sum +
                      (daysSince(
                        j.openDate,
                      ) || 0)
                    );
                  },
                  0,
                ) /
                  timedJobs.length,
              )
            : null;

        return {
          ...row,
          positions,
          share,
          avgDays,
        };
      },
    );

  const pipelineTotalTime =
    pipelineRows.reduce(
      (
        acc,
        row,
      ) => {
        if (
          row.avgDays !==
          null
        ) {
          acc.sum +=
            row.avgDays *
            row.positions;

          acc.count +=
            row.positions;
        }

        return acc;
      },

      {
        sum: 0,
        count: 0,
      },
    );

  const pipelineTotalAvgDays =
    pipelineTotalTime.count >
    0
      ? Math.round(
          pipelineTotalTime.sum /
            pipelineTotalTime.count,
        )
      : null;

  // ---- "Attention Required" — vagas em aberto há mais de 45 dias ----

  const agingRoles =
    openJobs
      .filter(
        (j) =>
          (daysSince(
            j.openDate,
          ) || 0) >
          AGING_THRESHOLD_DAYS,
      )
      .sort(
        (
          a,
          b,
        ) =>
          (daysSince(
            b.openDate,
          ) || 0) -
          (daysSince(
            a.openDate,
          ) || 0),
      );

  const handleOpenEditRow = (
    job,
  ) => {
    setEditingJobId(
      job.id,
    );

    setEditForm({
      priority:
        job.priority ||
        "Standard",

      notes:
        job.dashboardNote ||
        "",
    });
  };

  const handleSaveRowEdit = (
    e,
  ) => {
    e.preventDefault();

    setJobsDashboard(
      jobsDashboard.map(
        (j) => {
          if (
            j.id !==
            editingJobId
          ) {
            return j;
          }

          const notesChanged =
            editForm.notes !==
            (j.dashboardNote ||
              "");

          const history =
            j.notesHistory ||
            [];

          const newHistory =
            notesChanged
              ? [
                  {
                    text:
                      editForm.notes,

                    author:
                      CURRENT_USER,

                    date:
                      new Date().toISOString(),
                  },

                  ...history,
                ].slice(
                  0,
                  5,
                )
              : history;

          return {
            ...j,

            priority:
              editForm.priority,

            dashboardNote:
              editForm.notes,

            notesHistory:
              newHistory,
          };
        },
      ),
    );

    setEditingJobId(
      null,
    );
  };

  // ---- Filtragem real pra aba Graphs ----

  const periodDays =
    period ===
    "all"
      ? null
      : Number(
          period,
        );

  const periodStart =
    periodDays
      ? new Date(
          Date.now() -
            periodDays *
              24 *
              60 *
              60 *
              1000,
        )
      : null;

  const filteredJobs =
    mockJobs.filter(
      (job) => {
        if (
          contractType !==
            "all" &&
          job.clientStatus !==
            contractType
        ) {
          return false;
        }

        if (
          clientFilter !==
            "all" &&
          job.clientId !==
            clientFilter
        ) {
          return false;
        }

        if (
          positionFilter !==
            "all" &&
          job.id !==
            positionFilter
        ) {
          return false;
        }

        if (
          periodStart
        ) {
          const opened =
            parseDate(
              job.openDate,
            );

          if (
            !opened ||
            opened <
              periodStart
          ) {
            return false;
          }
        }

        return true;
      },
    );

  const filteredJobIds =
    new Set(
      filteredJobs.map(
        (j) =>
          j.id,
      ),
    );

  const relevantCandidateJobs =
    mockCandidateJobs.filter(
      (entry) => {
        if (
          !filteredJobIds.has(
            entry.jobId,
          )
        ) {
          return false;
        }

        if (
          entry.dropped
        ) {
          return false;
        }

        if (
          periodStart
        ) {
          const matched =
            parseDate(
              entry.matchCreatedDate,
            );

          if (
            !matched ||
            matched <
              periodStart
          ) {
            return false;
          }
        }

        return true;
      },
    );

  const funnelData =
    PIPELINE_STAGES.map(
      (
        stage,
        idx,
      ) => {
        const count =
          relevantCandidateJobs.filter(
            (
              entry,
            ) => {
              const entryIdx =
                PIPELINE_STAGES.findIndex(
                  (
                    s,
                  ) =>
                    s.key ===
                    entry.stage,
                );

              return (
                entryIdx >=
                idx
              );
            },
          ).length;

        return {
          ...stage,
          count,
        };
      },
    );

  const funnelMax =
    Math.max(
      ...funnelData.map(
        (s) =>
          s.count,
      ),

      1,
    );

  const clientOptions =
    mockClients.filter(
      (c) =>
        mockJobs.some(
          (j) =>
            j.clientId ===
            c.id,
        ),
    );

  const positionOptions =
    clientFilter ===
    "all"
      ? mockJobs
      : mockJobs.filter(
          (j) =>
            j.clientId ===
            clientFilter,
        );

  // ---- Filtragem + cálculos reais pra aba Analyst ----

  const aClientOptions =
    mockClients.filter(
      (c) =>
        mockJobs.some(
          (j) =>
            j.clientId ===
            c.id,
        ),
    );

  const aPositionOptions =
    aClient ===
    "all"
      ? mockJobs
      : mockJobs.filter(
          (j) =>
            j.clientId ===
            aClient,
        );

  const aLocationOptions =
    [
      ...new Set(
        mockJobs.map(
          (j) =>
            j.state,
        ),
      ),
    ];

  const aJobs =
    mockJobs.filter(
      (job) => {
        if (
          aStatus !==
            "all" &&
          job.status !==
            aStatus
        ) {
          return false;
        }

        if (
          aContractType !==
            "all" &&
          job.clientStatus !==
            aContractType
        ) {
          return false;
        }

        if (
          aClient !==
            "all" &&
          job.clientId !==
            aClient
        ) {
          return false;
        }

        if (
          aPosition !==
            "all" &&
          job.id !==
            aPosition
        ) {
          return false;
        }

        if (
          aFormat !==
            "all" &&
          job.employmentType !==
            aFormat
        ) {
          return false;
        }

        if (
          aWorkType !==
            "all" &&
          job.workType !==
            aWorkType
        ) {
          return false;
        }

        if (
          aLocation !==
            "all" &&
          job.state !==
            aLocation
        ) {
          return false;
        }

        return true;
      },
    );

  const concludedJobs =
    aJobs.filter(
      (j) =>
        j.stage ===
        "concluded",
    );

  const realConcludedJobs =
    concludedJobs.filter(
      (j) =>
        !j.isReplacement,
    );

  const totalResultsByType =
    CONTRACT_TYPES.map(
      (type) => ({
        ...type,

        count:
          concludedJobs.filter(
            (j) =>
              j.clientStatus ===
              type.key,
          ).length,
      }),
    );

  const realResultsByType =
    CONTRACT_TYPES.map(
      (type) => ({
        ...type,

        count:
          realConcludedJobs.filter(
            (j) =>
              j.clientStatus ===
              type.key,
          ).length,
      }),
    );

  const aPeriodDays =
    aPeriod ===
    "all"
      ? null
      : Number(
          aPeriod,
        );

  const rangeEnd =
    aPeriodDays
      ? new Date()
      : DEFAULT_RANGE_END;

  const rangeStart =
    aPeriodDays
      ? new Date(
          Date.now() -
            aPeriodDays *
              24 *
              60 *
              60 *
              1000,
        )
      : DEFAULT_RANGE_START;

  const {
    buckets,
  } =
    buildTimeBuckets(
      rangeStart,
      rangeEnd,
    );

  const openedPerBucket =
    buckets.map(
      (bucket) => {
        return aJobs.filter(
          (job) => {
            const opened =
              parseDate(
                job.openDate,
              );

            return (
              opened &&
              opened >=
                bucket.start &&
              opened <=
                bucket.end
            );
          },
        ).length;
      },
    );

  const avgCloseTimePerBucket =
    buckets.map(
      (bucket) => {
        const closedInBucket =
          aJobs.filter(
            (job) => {
              const closed =
                parseDate(
                  job.closeDate,
                );

              return (
                closed &&
                closed >=
                  bucket.start &&
                closed <=
                  bucket.end
              );
            },
          );

        if (
          closedInBucket.length ===
          0
        ) {
          return 0;
        }

        const totalDays =
          closedInBucket.reduce(
            (
              sum,
              job,
            ) => {
              const opened =
                parseDate(
                  job.openDate,
                );

              const closed =
                parseDate(
                  job.closeDate,
                );

              return (
                sum +
                (opened &&
                closed
                  ? daysBetween(
                      opened,
                      closed,
                    )
                  : 0)
              );
            },

            0,
          );

        return Math.round(
          totalDays /
            closedInBucket.length,
        );
      },
    );

  const jobsOpenedInRange =
    aJobs.filter(
      (job) => {
        const opened =
          parseDate(
            job.openDate,
          );

        return (
          opened &&
          opened >=
            rangeStart &&
          opened <=
            rangeEnd
        );
      },
    ).length;

  const jobsConvertedInRange =
    aJobs.filter(
      (job) => {
        const opened =
          parseDate(
            job.openDate,
          );

        return (
          job.stage ===
            "concluded" &&
          opened &&
          opened >=
            rangeStart &&
          opened <=
            rangeEnd
        );
      },
    ).length;

  const conversionRate =
    jobsOpenedInRange >
    0
      ? (
          (jobsConvertedInRange /
            jobsOpenedInRange) *
          100
        ).toFixed(
          1,
        )
      : "0.0";

  const totalAnnualCost =
    mockProcessCosts.reduce(
      (
        sum,
        cost,
      ) =>
        sum +
        getAnnualCost(
          cost,
        ),

      0,
    );

  const cancelledJobs =
    aJobs.filter(
      (j) =>
        j.status ===
          "INACTIVE" &&
        j.stage !==
          "concluded",
    );

  const cancelReasonData =
    Object.entries(
      CANCEL_REASON_COLORS,
    ).map(
      ([
        label,
        color,
      ]) => ({
        label,
        color,

        value:
          cancelledJobs.filter(
            (j) =>
              j.cancelReason ===
              label,
          ).length,
      }),
    );

  const timeDistributionDonutData =
    TIME_DISTRIBUTION_DONUT_DATA;

  return (
    <div
      className={
        styles.container
      }
    >
      <div>
        <h1
          className={
            styles.pageTitle
          }
        >
          Reports
        </h1>

        <div
          className={
            styles.accentLine
          }
        ></div>
      </div>

      <div
        className={
          styles.tabsRow
        }
      >
        {TABS.map(
          (tab) => (
            <button
              key={
                tab
              }

              className={`${styles.tabBtn} ${
                activeTab ===
                tab
                  ? styles.activeTab
                  : ""
              }`}

              onClick={() =>
                setActiveTab(
                  tab,
                )
              }
            >
              {
                tab
              }
            </button>
          ),
        )}
      </div>

      {activeTab ===
      "Filter" ? (
        <>
          <section
            className={
              styles.filterPanelCard
            }
          >
            <div
              className={
                styles.filterPanelHeader
              }
            >
              <div
                className={
                  styles.filterPanelTitle
                }
              >
                <SlidersHorizontal
                  size={
                    16
                  }

                  color="#ff5a1f"
                />

                <h2>
                  Advanced
                  Filters
                </h2>
              </div>

              <div
                className={
                  styles.filterPanelActions
                }
              >
                <button
                  className={
                    styles.filterClearBtn
                  }

                  onClick={
                    handleClearReportFilters
                  }
                >
                  <RotateCcw
                    size={
                      14
                    }
                  />

                  Clear
                  Filters
                </button>

                <button
                  className={
                    styles.filterToggleBtn
                  }

                  onClick={() =>
                    setIsReportFilterOpen(
                      !isReportFilterOpen,
                    )
                  }

                  title={
                    isReportFilterOpen
                      ? "Collapse filters"
                      : "Expand filters"
                  }
                >
                  {isReportFilterOpen ? (
                    <ChevronUp
                      size={
                        18
                      }
                    />
                  ) : (
                    <ChevronDown
                      size={
                        18
                      }
                    />
                  )}
                </button>
              </div>
            </div>

            {isReportFilterOpen && (
              <div
                className={
                  styles.filterPanelGrid
                }
              >
                <div
                  className={
                    styles.filterFieldGroup
                  }
                >
                  <label>
                    Contract
                    Type
                  </label>

                  <select
                    className={
                      styles.filterFieldControl
                    }

                    value={
                      rContractType
                    }

                    onChange={(
                      e,
                    ) =>
                      setRContractType(
                        e
                          .target
                          .value,
                      )
                    }
                  >
                    <option value="all">
                      All
                    </option>

                    {CONTRACT_TYPES.map(
                      (
                        t,
                      ) => (
                        <option
                          key={
                            t.key
                          }

                          value={
                            t.key
                          }
                        >
                          {
                            t.label
                          }
                        </option>
                      ),
                    )}
                  </select>
                </div>

                <div
                  className={
                    styles.filterFieldGroup
                  }
                >
                  <label>
                    Client
                  </label>

                  <select
                    className={
                      styles.filterFieldControl
                    }

                    value={
                      rClient
                    }

                    onChange={(
                      e,
                    ) =>
                      setRClient(
                        e
                          .target
                          .value,
                      )
                    }
                  >
                    <option value="all">
                      All
                    </option>

                    {reportClientOptions.map(
                      (
                        c,
                      ) => (
                        <option
                          key={
                            c
                          }

                          value={
                            c
                          }
                        >
                          {
                            c
                          }
                        </option>
                      ),
                    )}
                  </select>
                </div>

                <div
                  className={
                    styles.filterFieldGroup
                  }
                >
                  <label>
                    Status
                  </label>

                  <select
                    className={
                      styles.filterFieldControl
                    }

                    value={
                      rStatus
                    }

                    onChange={(
                      e,
                    ) =>
                      setRStatus(
                        e
                          .target
                          .value,
                      )
                    }
                  >
                    <option value="all">
                      All
                    </option>

                    {Object.entries(
                      STATUS_LABELS,
                    ).map(
                      ([
                        key,
                        label,
                      ]) => (
                        <option
                          key={
                            key
                          }

                          value={
                            key
                          }
                        >
                          {
                            label
                          }
                        </option>
                      ),
                    )}
                  </select>
                </div>

                <div
                  className={
                    styles.filterFieldGroup
                  }
                >
                  <label>
                    Stage
                  </label>

                  <select
                    className={
                      styles.filterFieldControl
                    }

                    value={
                      rStage
                    }

                    onChange={(
                      e,
                    ) =>
                      setRStage(
                        e
                          .target
                          .value,
                      )
                    }
                  >
                    <option value="all">
                      All
                    </option>

                    {Object.entries(
                      STAGE_META,
                    ).map(
                      ([
                        key,
                        meta,
                      ]) => (
                        <option
                          key={
                            key
                          }

                          value={
                            key
                          }
                        >
                          {
                            meta.label
                          }
                        </option>
                      ),
                    )}
                  </select>
                </div>

                <div
                  className={
                    styles.filterFieldGroup
                  }
                >
                  <label>
                    Workload
                  </label>

                  <select
                    className={
                      styles.filterFieldControl
                    }

                    value={
                      rWorkload
                    }

                    onChange={(
                      e,
                    ) =>
                      setRWorkload(
                        e
                          .target
                          .value,
                      )
                    }
                  >
                    <option value="all">
                      All
                    </option>

                    {reportWorkloadOptions.map(
                      (
                        w,
                      ) => (
                        <option
                          key={
                            w
                          }

                          value={
                            w
                          }
                        >
                          {
                            w
                          }
                        </option>
                      ),
                    )}
                  </select>
                </div>

                <div
                  className={
                    styles.filterFieldGroup
                  }
                >
                  <label>
                    Priority
                  </label>

                  <select
                    className={
                      styles.filterFieldControl
                    }

                    value={
                      rPriority
                    }

                    onChange={(
                      e,
                    ) =>
                      setRPriority(
                        e
                          .target
                          .value,
                      )
                    }
                  >
                    <option value="all">
                      All
                    </option>

                    <option value="High">
                      High
                    </option>

                    <option value="Standard">
                      Standard
                    </option>
                  </select>
                </div>

                <div
                  className={
                    styles.filterFieldGroup
                  }
                >
                  <label>
                    Account
                    Type
                  </label>

                  <select
                    className={
                      styles.filterFieldControl
                    }

                    value={
                      rAccountType
                    }

                    onChange={(
                      e,
                    ) =>
                      setRAccountType(
                        e
                          .target
                          .value,
                      )
                    }
                  >
                    <option value="all">
                      All
                    </option>

                    {Object.entries(
                      CLIENT_ACCOUNT_LABELS,
                    ).map(
                      ([
                        key,
                        label,
                      ]) => (
                        <option
                          key={
                            key
                          }

                          value={
                            key
                          }
                        >
                          {
                            label
                          }
                        </option>
                      ),
                    )}
                  </select>
                </div>

                <div
                  className={
                    styles.filterFieldGroup
                  }
                >
                  <label>
                    Keywords
                  </label>

                  <input
                    type="text"

                    className={
                      styles.filterFieldControl
                    }

                    placeholder="Search title or client..."

                    value={
                      rKeywords
                    }

                    onChange={(
                      e,
                    ) =>
                      setRKeywords(
                        e
                          .target
                          .value,
                      )
                    }
                  />
                </div>
              </div>
            )}
          </section>

          <p
            className={
              styles.reportsResultsCount
            }
          >
            Showing{" "}
            {
              filteredOpenJobs.length
            }{" "}
            of{" "}
            {
              openJobs.length
            }{" "}
            jobs
          </p>

          <div
            className={
              styles.jobsTableWrapper
            }
          >
            <table
              className={
                styles.jobsTable
              }
            >
              <colgroup>
                <col
                  style={{
                    width:
                      "100px",
                  }}
                />

                <col
                  style={{
                    width:
                      "140px",
                  }}
                />

                <col
                  style={{
                    width:
                      "150px",
                  }}
                />

                <col
                  style={{
                    width:
                      "55px",
                  }}
                />

                <col
                  style={{
                    width:
                      "80px",
                  }}
                />

                <col
                  style={{
                    width:
                      "110px",
                  }}
                />

                <col
                  style={{
                    width:
                      "90px",
                  }}
                />

                <col
                  style={{
                    width:
                      "90px",
                  }}
                />

                <col
                  style={{
                    width:
                      "85px",
                  }}
                />

                <col
                  style={{
                    width:
                      "85px",
                  }}
                />

                <col
                  style={{
                    width:
                      "75px",
                  }}
                />

                <col
                  style={{
                    width:
                      "110px",
                  }}
                />

                <col
                  style={{
                    width:
                      "90px",
                  }}
                />

                <col />

                <col
                  style={{
                    width:
                      "65px",
                  }}
                />
              </colgroup>

              <thead>
                <tr>
                  <th>
                    Contract
                    Type
                  </th>

                  <th>
                    Client
                  </th>

                  <th>
                    Role
                  </th>

                  <th>
                    Qty
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Stage
                  </th>

                  <th>
                    Start
                    Date
                  </th>

                  <th>
                    End
                    Date
                  </th>

                  <th>
                    Days
                    Open
                  </th>

                  <th>
                    Workload
                  </th>

                  <th>
                    Priority
                  </th>

                  <th>
                    Account
                    Type
                  </th>

                  <th>
                    Last
                    Update
                  </th>

                  <th>
                    Notes
                  </th>

                  <th></th>
                </tr>
              </thead>

              <tbody>
                {filteredOpenJobs.length >
                0 ? (
                  filteredOpenJobs.map(
                    (
                      job,
                    ) => {
                      const contractBadge =
                        CONTRACT_TYPE_BADGE[
                          job
                            .clientStatus
                        ] || {
                          color:
                            "#475569",

                          bg:
                            "#f1f5f9",
                        };

                      const contractLabel =
                        CONTRACT_TYPES.find(
                          (
                            t,
                          ) =>
                            t.key ===
                            job.clientStatus,
                        )
                          ?.label ||
                        job.clientStatus;

                      const stage =
                        STAGE_META[
                          job
                            .stage
                        ] || {
                          label:
                            job.stage,

                          color:
                            "#64748b",
                        };

                      const priorityBadge =
                        PRIORITY_BADGE[
                          job
                            .priority
                        ] ||
                        PRIORITY_BADGE.Standard;

                      const statusBadge =
                        STATUS_BADGE[
                          job
                            .status
                        ] ||
                        STATUS_BADGE.ACTIVE;

                      const statusLabel =
                        STATUS_LABELS[
                          job
                            .status
                        ] ||
                        job.status;

                      const accountKey =
                        getClientAccount(
                          job.clientId,
                        );

                      const accountBadge =
                        CLIENT_ACCOUNT_BADGE[
                          accountKey
                        ] || {
                          color:
                            "#475569",

                          bg:
                            "#f1f5f9",
                        };

                      const accountLabel =
                        CLIENT_ACCOUNT_LABELS[
                          accountKey
                        ] ||
                        "-";

                      return (
                        <tr
                          key={
                            job.id
                          }
                        >
                          <td>
                            <span
                              className={
                                styles.pillBadge
                              }

                              style={{
                                color:
                                  contractBadge.color,

                                backgroundColor:
                                  contractBadge.bg,
                              }}
                            >
                              {
                                contractLabel
                              }
                            </span>
                          </td>

                          <td
                            className={
                              styles.cellTruncate
                            }
                          >
                            {
                              job.company
                            }
                          </td>

                          <td
                            className={`${styles.cellTruncate} ${styles.positionCell}`}
                          >
                            {
                              job.title
                            }
                          </td>

                          <td>
                            {
                              job.openings
                            }
                          </td>

                          <td>
                            <span
                              className={
                                styles.pillBadge
                              }

                              style={{
                                color:
                                  statusBadge.color,

                                backgroundColor:
                                  statusBadge.bg,
                              }}
                            >
                              {
                                statusLabel
                              }
                            </span>
                          </td>

                          <td>
                            <span
                              className={
                                styles.pillBadge
                              }

                              style={{
                                color:
                                  stage.color,

                                backgroundColor: `${stage.color}1A`,
                              }}
                            >
                              {
                                stage.label
                              }
                            </span>
                          </td>

                          <td
                            className={
                              styles.cellTruncate
                            }
                          >
                            {
                              job.openDate
                            }
                          </td>

                          <td
                            className={
                              styles.cellTruncate
                            }
                          >
                            {job.closeDate ||
                              "-"}
                          </td>

                          <td>
                            {daysSince(
                              job.openDate,
                            )}
                            d
                          </td>

                          <td
                            className={
                              styles.cellTruncate
                            }
                          >
                            {
                              job.employmentType
                            }
                          </td>

                          <td>
                            <span
                              className={
                                styles.pillBadge
                              }

                              style={{
                                color:
                                  priorityBadge.color,

                                backgroundColor:
                                  priorityBadge.bg,
                              }}
                            >
                              {
                                job.priority
                              }
                            </span>
                          </td>

                          <td>
                            <span
                              className={
                                styles.pillBadge
                              }

                              style={{
                                color:
                                  accountBadge.color,

                                backgroundColor:
                                  accountBadge.bg,
                              }}
                            >
                              {
                                accountLabel
                              }
                            </span>
                          </td>

                          <td
                            className={
                              styles.cellTruncate
                            }
                          >
                            {
                              job.openDate
                            }
                          </td>

                          <td
                            className={`${styles.cellTruncate} ${styles.notesCell}`}

                            title={
                              job.dashboardNote ||
                              ""
                            }
                          >
                            {job.dashboardNote ||
                              "—"}
                          </td>

                          <td
                            className={
                              styles.actionsCellReports
                            }
                          >
                            {job.notesHistory &&
                              job
                                .notesHistory
                                .length >
                                0 && (
                                <div
                                  className={
                                    styles.historyWrapper
                                  }
                                >
                                  <button
                                    className={`${styles.historyBtn} ${styles.historyBtnActive}`}

                                    onClick={() =>
                                      setOpenHistoryJobId(
                                        openHistoryJobId ===
                                          job.id
                                          ? null
                                          : job.id,
                                      )
                                    }

                                    title="View edit history"
                                  >
                                    🕐
                                  </button>

                                  {openHistoryJobId ===
                                    job.id && (
                                    <div
                                      className={
                                        styles.historyPopover
                                      }
                                    >
                                      <div
                                        className={
                                          styles.historyPopoverTitle
                                        }
                                      >
                                        Edit
                                        history
                                      </div>

                                      {job.notesHistory.map(
                                        (
                                          entry,
                                          idx,
                                        ) => (
                                          <div
                                            key={
                                              idx
                                            }

                                            className={
                                              styles.historyEntry
                                            }
                                          >
                                            <div
                                              className={
                                                styles.historyEntryText
                                              }
                                            >
                                              {entry.text
                                                ? `"${entry.text}"`
                                                : "—"}
                                            </div>

                                            <div
                                              className={
                                                styles.historyEntryMeta
                                              }
                                            >
                                              {
                                                entry.author
                                              }{" "}
                                              ·{" "}
                                              {new Date(
                                                entry.date,
                                              ).toLocaleDateString(
                                                "en-US",
                                                {
                                                  month:
                                                    "short",

                                                  day:
                                                    "numeric",
                                                },
                                              )}
                                              ,{" "}
                                              {new Date(
                                                entry.date,
                                              ).toLocaleTimeString(
                                                "en-US",
                                                {
                                                  hour:
                                                    "2-digit",

                                                  minute:
                                                    "2-digit",
                                                },
                                              )}
                                            </div>
                                          </div>
                                        ),
                                      )}
                                    </div>
                                  )}
                                </div>
                              )}

                            <button
                              className={
                                styles.editRowBtn
                              }

                              onClick={() =>
                                handleOpenEditRow(
                                  job,
                                )
                              }

                              title="Edit priority & notes"
                            >
                              ✎
                            </button>
                          </td>
                        </tr>
                      );
                    },
                  )
                ) : (
                  <tr>
                    <td
                      colSpan={
                        15
                      }

                      className={
                        styles.emptyState
                      }
                    >
                      No
                      jobs
                      match
                      the
                      selected
                      filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div
            className={`${styles.editDrawer} ${
              editingJobId
                ? styles.editDrawerOpen
                : ""
            }`}
          >
            <div
              className={
                styles.editDrawerHeader
              }
            >
              <h2>
                Edit
                Priority
                &
                Notes
              </h2>

              <button
                onClick={() =>
                  setEditingJobId(
                    null,
                  )
                }
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={
                handleSaveRowEdit
              }

              className={
                styles.editDrawerForm
              }
            >
              <div
                className={
                  styles.editDrawerField
                }
              >
                <label>
                  Priority
                </label>

                <select
                  value={
                    editForm.priority
                  }

                  onChange={(
                    e,
                  ) =>
                    setEditForm(
                      {
                        ...editForm,

                        priority:
                          e
                            .target
                            .value,
                      },
                    )
                  }
                >
                  <option value="High">
                    High
                  </option>

                  <option value="Standard">
                    Standard
                  </option>
                </select>
              </div>

              <div
                className={
                  styles.editDrawerField
                }
              >
                <label>
                  Notes
                </label>

                <textarea
                  rows={
                    5
                  }

                  value={
                    editForm.notes
                  }

                  onChange={(
                    e,
                  ) =>
                    setEditForm(
                      {
                        ...editForm,

                        notes:
                          e
                            .target
                            .value,
                      },
                    )
                  }
                />
              </div>

              <button
                type="submit"

                className={
                  styles.editDrawerSaveBtn
                }
              >
                Save
                Changes
              </button>
            </form>
          </div>
        </>
      ) : activeTab ===
        "Dashboard" ? (
        <>
          <div
            className={
              styles.dashboardSearchBar
            }
          >
            <div
              className={
                styles.dashboardDateField
              }
            >
              <label>
                Period Start
              </label>

              <input
                type="date"

                value={
                  dPeriodStart
                }

                onChange={(
                  e,
                ) =>
                  setDPeriodStart(
                    e
                      .target
                      .value,
                  )
                }
              />
            </div>

            <div
              className={
                styles.dashboardDateField
              }
            >
              <label>
                Period End
              </label>

              <input
                type="date"

                value={
                  dPeriodEnd
                }

                onChange={(
                  e,
                ) =>
                  setDPeriodEnd(
                    e
                      .target
                      .value,
                  )
                }
              />
            </div>

            <button
              className={
                styles.dashboardSearchBtn
              }

              onClick={() => {
                setDPeriodStart(
                  dPeriodStart,
                );

                setDPeriodEnd(
                  dPeriodEnd,
                );
              }}
            >
              Search
            </button>
          </div>

          <div
            className={
              styles.dashboardCardsRow
            }
          >
            <div
              className={
                styles.dashboardCard
              }
            >
              <span
                className={
                  styles.dashboardCardLabel
                }
              >
                Total Position
              </span>

              <span
                className={
                  styles.dashboardCardValue
                }
              >
                {
                  dTotalPosition
                }
              </span>

              <span
                className={
                  styles.dashboardCardCaption
                }
              >
                Total opening slots
              </span>
            </div>

            <div
              className={
                styles.dashboardCard
              }
            >
              <span
                className={
                  styles.dashboardCardLabel
                }
              >
                Open
              </span>

              <span
                className={
                  styles.dashboardCardValue
                }
              >
                {
                  dOpenCount
                }
              </span>

              <span
                className={
                  styles.dashboardCardCaption
                }
              >
                In process
              </span>
            </div>

            <div
              className={
                styles.dashboardCard
              }
            >
              <span
                className={
                  styles.dashboardCardLabel
                }
              >
                On Hold
              </span>

              <span
                className={
                  styles.dashboardCardValue
                }
              >
                {
                  dOnHoldCount
                }
              </span>

              <span
                className={
                  styles.dashboardCardCaption
                }
              >
                Paused by the client
              </span>
            </div>

            <div
              className={
                styles.dashboardCardWrapper
              }
            >
              <span
                className={
                  styles.conversionBadge
                }
              >
                Conv. Rate{" "}
                {
                  dConversionRate
                }
                %
              </span>

              <div
                className={
                  styles.dashboardCard
                }
              >
                <span
                  className={
                    styles.dashboardCardLabel
                  }
                >
                  Filled
                </span>

                <span
                  className={
                    styles.dashboardCardValue
                  }
                >
                  {
                    dFilledCount
                  }
                </span>

                <span
                  className={
                    styles.dashboardCardCaption
                  }
                >
                  Placements closed
                </span>
              </div>
            </div>

            <div
              className={
                styles.dashboardCard
              }
            >
              <span
                className={
                  styles.dashboardCardLabel
                }
              >
                Cancelled
              </span>

              <span
                className={
                  styles.dashboardCardValue
                }
              >
                {
                  dCancelledCount
                }
              </span>

              <span
                className={
                  styles.dashboardCardCaption
                }
              >
                Closed without placement
              </span>
            </div>

            <div
              className={
                styles.dashboardCard
              }
            >
              <span
                className={
                  styles.dashboardCardLabel
                }
              >
                Avg Time to Hire
              </span>

              <span
                className={
                  styles.dashboardCardValue
                }
              >
                {
                  dAvgTimeToHire
                }
                d
              </span>

              <span
                className={
                  styles.dashboardCardCaption
                }
              >
                Concluded, exclu. Bid
              </span>
            </div>
          </div>

          <div
            className={
              styles.portfolioTableWrapper
            }
          >
            <div
              className={
                styles.portfolioTableTitle
              }
            >
              Portfolio by Service Line
            </div>

            <table
              className={
                styles.portfolioTable
              }
            >
              <thead>
                <tr>
                  <th>
                    Service Line
                  </th>

                  <th>
                    Positions
                  </th>

                  <th>
                    Full Time
                  </th>

                  <th>
                    Part Time
                  </th>

                  <th>
                    Open
                  </th>

                  <th>
                    On Hold
                  </th>

                  <th>
                    Cancelled
                  </th>

                  <th>
                    Filled
                  </th>

                  <th>
                    Fill Rate
                  </th>

                  <th>
                    Avg Time to Hire
                  </th>

                  <th>
                    High Prio. (Open)
                  </th>
                </tr>
              </thead>

              <tbody>
                {servicePortfolioRows.map(
                  (
                    row,
                  ) => (
                    <tr
                      key={
                        row.label
                      }
                    >
                      <td
                        className={
                          styles.portfolioServiceLine
                        }
                      >
                        {
                          row.label
                        }
                      </td>

                      <td>
                        {
                          row.positions
                        }
                      </td>

                      <td>
                        {
                          row.fullTime
                        }
                      </td>

                      <td>
                        {
                          row.partTime
                        }
                      </td>

                      <td>
                        {
                          row.open
                        }
                      </td>

                      <td>
                        {
                          row.onHold
                        }
                      </td>

                      <td>
                        {
                          row.cancelled
                        }
                      </td>

                      <td>
                        {
                          row.filled
                        }
                      </td>

                      <td>
                        {
                          row.fillRate
                        }
                        %
                      </td>

                      <td>
                        {row.avgTimeToHire !==
                        null
                          ? `${row.avgTimeToHire}d`
                          : "—"}
                      </td>

                      <td>
                        {
                          row.highPrioOpen
                        }
                      </td>
                    </tr>
                  ),
                )}

                <tr
                  className={
                    styles.portfolioTotalRow
                  }
                >
                  <td>
                    Total
                  </td>

                  <td>
                    {
                      servicePortfolioTotal.positions
                    }
                  </td>

                  <td>
                    {
                      servicePortfolioTotal.fullTime
                    }
                  </td>

                  <td>
                    {
                      servicePortfolioTotal.partTime
                    }
                  </td>

                  <td>
                    {
                      servicePortfolioTotal.open
                    }
                  </td>

                  <td>
                    {
                      servicePortfolioTotal.onHold
                    }
                  </td>

                  <td>
                    {
                      servicePortfolioTotal.cancelled
                    }
                  </td>

                  <td>
                    {
                      servicePortfolioTotal.filled
                    }
                  </td>

                  <td>
                    {
                      servicePortfolioTotalFillRate
                    }
                    %
                  </td>

                  <td>
                    {servicePortfolioTotalAvgTime !==
                    null
                      ? `${servicePortfolioTotalAvgTime}d`
                      : "—"}
                  </td>

                  <td>
                    {
                      servicePortfolioTotal.highPrioOpen
                    }
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div
            className={
              styles.portfolioTableWrapper
            }
          >
            <div
              className={
                styles.portfolioTableTitle
              }
            >
              Pipeline by Status
            </div>

            <table
              className={
                styles.portfolioTable
              }
            >
              <thead>
                <tr>
                  <th>
                    Status
                  </th>

                  <th>
                    Stage
                  </th>

                  <th>
                    Positions
                  </th>

                  <th>
                    Share
                  </th>

                  <th>
                    Avg. Days
                  </th>
                </tr>
              </thead>

              <tbody>
                {pipelineRows.map(
                  (
                    row,
                  ) => (
                    <tr
                      key={
                        row.stage
                      }
                    >
                      <td
                        className={
                          styles.pipelineStatusCell
                        }
                      >
                        {
                          row.status
                        }
                      </td>

                      <td
                        className={
                          styles.portfolioServiceLine
                        }
                      >
                        {
                          row.stage
                        }
                      </td>

                      <td>
                        {
                          row.positions
                        }
                      </td>

                      <td>
                        {
                          row.share
                        }
                        %
                      </td>

                      <td>
                        {row.avgDays !==
                        null
                          ? `${row.avgDays}d`
                          : "—"}
                      </td>
                    </tr>
                  ),
                )}

                <tr
                  className={
                    styles.portfolioTotalRow
                  }
                >
                  <td>
                    Total
                  </td>

                  <td></td>

                  <td>
                    {
                      pipelineTotalPositions
                    }
                  </td>

                  <td>
                    100%
                  </td>

                  <td>
                    {pipelineTotalAvgDays !==
                    null
                      ? `${pipelineTotalAvgDays}d`
                      : "—"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div
            className={
              styles.portfolioTableWrapper
            }
          >
            <div
              className={
                styles.portfolioTableTitle
              }
            >
              Attention Required — Open Roles Aging Over{" "}
              {
                AGING_THRESHOLD_DAYS
              }{" "}
              Days
            </div>

            <table
              className={
                styles.portfolioTable
              }
            >
              <thead>
                <tr>
                  <th>
                    Service Line
                  </th>

                  <th>
                    Client
                  </th>

                  <th>
                    Role
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Contact
                  </th>

                  <th>
                    Days Open
                  </th>

                  <th>
                    Priority
                  </th>

                  <th>
                    Start Date
                  </th>
                </tr>
              </thead>

              <tbody>
                {agingRoles.length >
                0 ? (
                  agingRoles.map(
                    (
                      job,
                    ) => {
                      const contractLabel =
                        CONTRACT_TYPES.find(
                          (
                            t,
                          ) =>
                            t.key ===
                            job.clientStatus,
                        )
                          ?.label ||
                        job.clientStatus;

                      const statusBadge =
                        STATUS_BADGE[
                          job
                            .status
                        ] ||
                        STATUS_BADGE.ACTIVE;

                      const statusLabel =
                        STATUS_LABELS[
                          job
                            .status
                        ] ||
                        job.status;

                      const priorityBadge =
                        PRIORITY_BADGE[
                          job
                            .priority
                        ] ||
                        PRIORITY_BADGE.Standard;

                      return (
                        <tr
                          key={
                            job.id
                          }
                        >
                          <td
                            className={
                              styles.portfolioServiceLine
                            }
                          >
                            {
                              contractLabel
                            }
                          </td>

                          <td>
                            {
                              job.company
                            }
                          </td>

                          <td>
                            {
                              job.title
                            }
                          </td>

                          <td>
                            <span
                              className={
                                styles.pillBadge
                              }

                              style={{
                                color:
                                  statusBadge.color,

                                backgroundColor:
                                  statusBadge.bg,
                              }}
                            >
                              {
                                statusLabel
                              }
                            </span>
                          </td>

                          <td>
                            {job.contact ||
                              DEFAULT_JOB_CONTACT}
                          </td>

                          <td
                            className={
                              styles.agingDaysCell
                            }
                          >
                            {daysSince(
                              job.openDate,
                            )}
                            d
                          </td>

                          <td>
                            <span
                              className={
                                styles.pillBadge
                              }

                              style={{
                                color:
                                  priorityBadge.color,

                                backgroundColor:
                                  priorityBadge.bg,
                              }}
                            >
                              {
                                job.priority
                              }
                            </span>
                          </td>

                          <td>
                            {
                              job.openDate
                            }
                          </td>
                        </tr>
                      );
                    },
                  )
                ) : (
                  <tr>
                    <td
                      colSpan={
                        8
                      }

                      className={
                        styles.emptyState
                      }
                    >
                      No open roles aging over{" "}
                      {
                        AGING_THRESHOLD_DAYS
                      }{" "}
                      days.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : activeTab ===
        "Analyst" ? (
        <>
          <div
            className={
              styles.filtersRow
            }
          >
            <select
              className={
                styles.filterSelect
              }

              value={
                aPeriod
              }

              onChange={(
                e,
              ) =>
                setAPeriod(
                  e
                    .target
                    .value,
                )
              }
            >
              {PERIOD_OPTIONS.map(
                (
                  p,
                ) => (
                  <option
                    key={
                      p.key
                    }

                    value={
                      p.key
                    }
                  >
                    {
                      p.label
                    }
                  </option>
                ),
              )}
            </select>

            <select
              className={
                styles.filterSelect
              }

              value={
                aStatus
              }

              onChange={(
                e,
              ) =>
                setAStatus(
                  e
                    .target
                    .value,
                )
              }
            >
              <option value="all">
                All
                Status
              </option>

              <option value="ACTIVE">
                Active
              </option>

              <option value="ON_HOLD">
                On
                Hold
              </option>

              <option value="INACTIVE">
                Inactive
              </option>
            </select>

            <select
              className={
                styles.filterSelect
              }

              value={
                aContractType
              }

              onChange={(
                e,
              ) =>
                setAContractType(
                  e
                    .target
                    .value,
                )
              }
            >
              <option value="all">
                All
                Contract
                Types
              </option>

              {CONTRACT_TYPES.map(
                (
                  t,
                ) => (
                  <option
                    key={
                      t.key
                    }

                    value={
                      t.key
                    }
                  >
                    {
                      t.label
                    }
                  </option>
                ),
              )}
            </select>

            <select
              className={
                styles.filterSelect
              }

              value={
                aClient
              }

              onChange={(
                e,
              ) => {
                setAClient(
                  e
                    .target
                    .value,
                );

                setAPosition(
                  "all",
                );
              }}
            >
              <option value="all">
                All
                Clients
              </option>

              {aClientOptions.map(
                (
                  c,
                ) => (
                  <option
                    key={
                      c.id
                    }

                    value={
                      c.id
                    }
                  >
                    {
                      c.name
                    }
                  </option>
                ),
              )}
            </select>

            <select
              className={
                styles.filterSelect
              }

              value={
                aPosition
              }

              onChange={(
                e,
              ) =>
                setAPosition(
                  e
                    .target
                    .value,
                )
              }
            >
              <option value="all">
                All
                Positions
              </option>

              {aPositionOptions.map(
                (
                  j,
                ) => (
                  <option
                    key={
                      j.id
                    }

                    value={
                      j.id
                    }
                  >
                    {
                      j.title
                    }
                  </option>
                ),
              )}
            </select>

            <select
              className={
                styles.filterSelect
              }

              value={
                aFormat
              }

              onChange={(
                e,
              ) =>
                setAFormat(
                  e
                    .target
                    .value,
                )
              }
            >
              <option value="all">
                All
                Formats
              </option>

              <option value="Full Time">
                Full
                Time
              </option>

              <option value="Part Time">
                Part
                Time
              </option>
            </select>

            <select
              className={
                styles.filterSelect
              }

              value={
                aWorkType
              }

              onChange={(
                e,
              ) =>
                setAWorkType(
                  e
                    .target
                    .value,
                )
              }
            >
              <option value="all">
                All
                Work
                Types
              </option>

              <option value="Remote">
                Remote
              </option>

              <option value="Hybrid">
                Hybrid
              </option>

              <option value="In Person">
                In
                Person
              </option>
            </select>

            <select
              className={
                styles.filterSelect
              }

              value={
                aLocation
              }

              onChange={(
                e,
              ) =>
                setALocation(
                  e
                    .target
                    .value,
                )
              }
            >
              <option value="all">
                All
                Locations
              </option>

              {aLocationOptions.map(
                (
                  state,
                ) => (
                  <option
                    key={
                      state
                    }

                    value={
                      state
                    }
                  >
                    {
                      state
                    }
                  </option>
                ),
              )}
            </select>

            <button
              className={
                styles.clearFiltersBtn
              }

              onClick={() => {
                setAPeriod(
                  "all",
                );

                setAStatus(
                  "all",
                );

                setAContractType(
                  "all",
                );

                setAClient(
                  "all",
                );

                setAPosition(
                  "all",
                );

                setAFormat(
                  "all",
                );

                setAWorkType(
                  "all",
                );

                setALocation(
                  "all",
                );
              }}
            >
              Clear
            </button>
          </div>

          <div
            className={
              styles.card
            }

            style={{
              marginBottom:
                "1rem",
            }}
          >
            <div
              className={
                styles.resultsBlockTitle
              }
            >
              TOTAL
              RESULTS{" "}

              <span
                className={
                  styles.resultsBlockSub
                }
              >
                (jobs
                concluded,
                by
                contract
                type)
              </span>
            </div>

            <div
              className={
                styles.resultsGrid
              }
            >
              {totalResultsByType.map(
                (
                  t,
                ) => (
                  <div
                    key={
                      t.key
                    }

                    className={
                      styles.resultsCard
                    }
                  >
                    <span
                      className={
                        styles.resultsCardLabel
                      }
                    >
                      {
                        t.label
                      }
                    </span>

                    <span
                      className={
                        styles.resultsCardValue
                      }
                    >
                      {
                        t.count
                      }
                    </span>
                  </div>
                ),
              )}

              <div
                className={`${styles.resultsCard} ${styles.resultsCardTotal}`}
              >
                <span
                  className={
                    styles.resultsCardLabel
                  }
                >
                  Total
                </span>

                <span
                  className={
                    styles.resultsCardValue
                  }
                >
                  {
                    concludedJobs.length
                  }
                </span>
              </div>
            </div>

            <div
              className={
                styles.resultsBlockTitle
              }

              style={{
                marginTop:
                  "1.25rem",
              }}
            >
              REAL
              RESULTS{" "}

              <span
                className={
                  styles.resultsBlockSub
                }
              >
                (excluding
                replacements)
              </span>
            </div>

            <div
              className={
                styles.resultsGrid
              }
            >
              {realResultsByType.map(
                (
                  t,
                ) => (
                  <div
                    key={
                      t.key
                    }

                    className={`${styles.resultsCard} ${styles.resultsCardReal}`}
                  >
                    <span
                      className={
                        styles.resultsCardLabelReal
                      }
                    >
                      {
                        t.label
                      }
                    </span>

                    <span
                      className={
                        styles.resultsCardValue
                      }
                    >
                      {
                        t.count
                      }
                    </span>
                  </div>
                ),
              )}

              <div
                className={`${styles.resultsCard} ${styles.resultsCardTotalReal}`}
              >
                <span
                  className={
                    styles.resultsCardLabel
                  }
                >
                  Total
                </span>

                <span
                  className={
                    styles.resultsCardValue
                  }
                >
                  {
                    realConcludedJobs.length
                  }
                </span>
              </div>
            </div>
          </div>

          <div
            className={
              styles.analystChartsRow
            }
          >
            <TrendBarChart
              title="JOBS OPENED OVER TIME"

              buckets={
                buckets
              }

              values={
                openedPerBucket
              }

              color="#1e3a8a"

              higherIsBetter={
                true
              }
            />

            <TrendBarChart
              title="AVG TIME TO CLOSE (DAYS)"

              buckets={
                buckets
              }

              values={
                avgCloseTimePerBucket
              }

              color="#7c3aed"

              higherIsBetter={
                false
              }
            />
          </div>

          <div
            className={
              styles.analystBottomRow
            }
          >
            <div
              className={
                styles.card
              }
            >
              <div
                className={
                  styles.cardHeader
                }
              >
                <h2>
                  JOB
                  OUTCOMES
                </h2>
              </div>

              <div
                className={
                  styles.conversionBlock
                }
              >
                <div
                  className={
                    styles.conversionValue
                  }
                >
                  {
                    conversionRate
                  }
                  %
                </div>

                <div
                  className={
                    styles.conversionSub
                  }
                >
                  {
                    jobsConvertedInRange
                  }{" "}
                  converted
                  of{" "}
                  {
                    jobsOpenedInRange
                  }{" "}
                  opened
                </div>
              </div>

              <div
                className={
                  styles.outcomesDivider
                }
              ></div>

              <div
                className={
                  styles.outcomesSubTitle
                }
              >
                CANCEL
                REASONS
              </div>

              <div
                className={
                  styles.dropReasonsBlock
                }
              >
                <div
                  className={
                    styles.donut
                  }

                  style={{
                    background:
                      buildConicGradient(
                        cancelReasonData,
                      ),
                  }}
                ></div>

                <div
                  className={
                    styles.donutLegend
                  }
                >
                  {cancelReasonData.map(
                    (
                      d,
                    ) => (
                      <span
                        key={
                          d.label
                        }
                      >
                        <span
                          style={{
                            color:
                              d.color,
                          }}
                        >
                          ●
                        </span>{" "}
                        {
                          d.label
                        }{" "}
                        (
                        {
                          d.value
                        }
                        )
                      </span>
                    ),
                  )}
                </div>
              </div>
            </div>

            <div
              className={
                styles.card
              }
            >
              <div
                className={
                  styles.cardHeader
                }
              >
                <h2>
                  TIME
                  DISTRIBUTION{" "}

                  <span
                    className={
                      styles.estimatedTag
                    }
                  >
                    ●est.
                  </span>
                </h2>
              </div>

              <div
                className={
                  styles.distributionBar
                }
              >
                <div
                  className={
                    styles.distributionSegment
                  }

                  style={{
                    width: `${TIME_DISTRIBUTION.operational}%`,

                    backgroundColor:
                      "#1d4ed8",
                  }}
                ></div>

                <div
                  className={
                    styles.distributionSegment
                  }

                  style={{
                    width: `${TIME_DISTRIBUTION.waitingClient}%`,

                    backgroundColor:
                      "#c2410c",
                  }}
                ></div>
              </div>

              <div
                className={
                  styles.distributionLegend
                }
              >
                <span>
                  <span
                    style={{
                      color:
                        "#1d4ed8",
                    }}
                  >
                    ●
                  </span>{" "}
                  In
                  Operational
                  —{" "}
                  {
                    TIME_DISTRIBUTION.operational
                  }
                  %
                </span>

                <span>
                  <span
                    style={{
                      color:
                        "#c2410c",
                    }}
                  >
                    ●
                  </span>{" "}
                  Waiting
                  Client
                  —{" "}
                  {
                    TIME_DISTRIBUTION.waitingClient
                  }
                  %
                </span>
              </div>
            </div>

            <div
              className={
                styles.card
              }
            >
              <div
                className={
                  styles.cardHeader
                }
              >
                <h2>
                  PROCESS
                  COSTS
                </h2>
              </div>

              <div
                className={
                  styles.costsList
                }
              >
                {mockProcessCosts.map(
                  (
                    cost,
                  ) => (
                    <div
                      key={
                        cost.id
                      }

                      className={
                        styles.costsRow
                      }
                    >
                      <span>
                        {
                          cost.name
                        }
                      </span>

                      <span
                        className={
                          styles.costsValue
                        }
                      >
                        $
                        {cost.amount.toLocaleString()}
                        /
                        {cost.frequency ===
                        "monthly"
                          ? "mo"
                          : "yr"}
                      </span>
                    </div>
                  ),
                )}

                <div
                  className={
                    styles.costsDivider
                  }
                ></div>

                <div
                  className={`${styles.costsRow} ${styles.costsTotalRow}`}
                >
                  <span>
                    Est.
                    Annual
                  </span>

                  <span
                    className={
                      styles.costsTotalValue
                    }
                  >
                    $
                    {totalAnnualCost.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}