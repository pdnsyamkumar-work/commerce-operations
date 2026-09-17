"use client";

import { useMemo, useRef, useState } from "react";
import {
  testCasesData,
  type FeatureArea,
  type TestCase,
  type TestCasePriority,
  type TestCaseType,
  type TestScope,
  type AutomationEligibility,
} from "./test-cases-data";
import { MetricCard, useClickOutside } from "./shared";

const allFeatures: FeatureArea[] = [
  "Authentication",
  "Products",
  "Inventory",
  "Cart",
  "Reports",
  "Support",
  "Profile",
];

const featureDescriptions: Record<FeatureArea, string> = {
  Authentication:
    "Session management, credentials verification, sign-in/sign-up validations, password visibility, and sign-out.",
  Products:
    "Product catalog CRUD, unique code rules, media uploads, 7 multi-view layouts, search, sorting, pagination, and CSV export.",
  Inventory:
    "Stock health monitoring, low-stock threshold alerts, CSV inventory import with schema validation, and template downloads.",
  Cart: "Product addition via custom selectors, quantity adjustment, price calculation, removal confirmation, and empty states.",
  Reports:
    "Metric snapshot cards, operations audit checklist, dispatch scheduling, notification switches, and drag-and-drop task migration.",
  Support:
    "Customer support ticket submission, custom priority selection dropdowns, and help topic validations.",
  Profile:
    "Administrator settings, avatar file uploads, telephone/country-code dropdowns, and header synchronization.",
};

/**
 * Reusable CopyButton with a floating "Copied!" tooltip for consistent UX.
 */
function CopyButton({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  function handleCopy(e: React.MouseEvent) {
    e.stopPropagation();
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        onClick={handleCopy}
        className={`cursor-pointer inline-flex h-7 w-[76px] items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 shadow-2xs transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-1 focus:ring-slate-400 ${className}`}
        aria-label="Copy"
      >
        {copied ? (
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-emerald-600 shrink-0"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-slate-500 shrink-0"
          >
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
          </svg>
        )}
        <span className={copied ? "font-semibold text-emerald-700" : ""}>
          {copied ? "Copied!" : "Copy"}
        </span>
      </button>

      {/* Floating Copied Tooltip */}
      {copied && (
        <div className="pointer-events-none absolute -top-8 left-1/2 z-30 -translate-x-1/2 whitespace-nowrap rounded bg-slate-900 px-2 py-0.5 text-[10px] font-semibold text-white shadow-md animate-in fade-in">
          Copied!
          <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
        </div>
      )}
    </div>
  );
}

export function TestCasesPage() {
  const [selectedEligibility, setSelectedEligibility] = useState<
    "All" | AutomationEligibility
  >("All");
  const [selectedScope, setSelectedScope] = useState<"All" | TestScope>("All");
  const [selectedType, setSelectedType] = useState<"All" | TestCaseType>("All");
  const [selectedFeature, setSelectedFeature] = useState<"All" | FeatureArea>(
    "All",
  );
  const [selectedPriority, setSelectedPriority] = useState<
    "All" | TestCasePriority
  >("All");
  const [onlyMocks, setOnlyMocks] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [collapsedFeatures, setCollapsedFeatures] = useState<Set<FeatureArea>>(
    new Set(allFeatures),
  );

  // Per-test single-select tab switcher: "regular" | "bdd" | "dataDriven"
  const [cardTabs, setCardTabs] = useState<
    Record<string, "regular" | "bdd" | "dataDriven">
  >({});

  // Export dropdown open state
  const [isExportOpen, setIsExportOpen] = useState(false);
  const exportDropdownRef = useRef<HTMLDivElement>(null);
  useClickOutside(exportDropdownRef, () => setIsExportOpen(false));

  // Expand / Collapse dropdown open state
  const [isExpandCollapseOpen, setIsExpandCollapseOpen] = useState(false);
  const expandCollapseDropdownRef = useRef<HTMLDivElement>(null);
  useClickOutside(expandCollapseDropdownRef, () =>
    setIsExpandCollapseOpen(false),
  );

  // Filtered tests based on active filters
  const filteredTests = useMemo(() => {
    return testCasesData.filter((tc) => {
      if (
        selectedEligibility !== "All" &&
        tc.automationEligibility !== selectedEligibility
      ) {
        return false;
      }
      if (selectedScope !== "All" && tc.scope !== selectedScope) {
        return false;
      }
      if (selectedType !== "All" && tc.type !== selectedType) {
        return false;
      }
      if (onlyMocks && !tc.isNetworkMockOrIntercept) {
        return false;
      }
      if (selectedFeature !== "All" && tc.feature !== selectedFeature) {
        return false;
      }
      if (selectedPriority !== "All" && tc.priority !== selectedPriority) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          tc.id.toLowerCase().includes(q) ||
          tc.title.toLowerCase().includes(q) ||
          tc.description.toLowerCase().includes(q) ||
          tc.endpointOrRoute.toLowerCase().includes(q) ||
          tc.automationTool.toLowerCase().includes(q) ||
          tc.scope.toLowerCase().includes(q) ||
          tc.automationEligibility.toLowerCase().includes(q) ||
          (tc.coveredFeatures &&
            tc.coveredFeatures.some((f) => f.toLowerCase().includes(q))) ||
          tc.steps.some(
            (s) =>
              s.action.toLowerCase().includes(q) ||
              s.expectedResult.toLowerCase().includes(q),
          ) ||
          (tc.uiTestData &&
            (tc.uiTestData.title.toLowerCase().includes(q) ||
              tc.uiTestData.items.some(
                (i) =>
                  i.label.toLowerCase().includes(q) ||
                  i.value.toLowerCase().includes(q),
              ))) ||
          (tc.apiTestData &&
            JSON.stringify(tc.apiTestData).toLowerCase().includes(q));
        if (!matches) return false;
      }
      return true;
    });
  }, [
    selectedEligibility,
    selectedScope,
    selectedType,
    onlyMocks,
    selectedFeature,
    selectedPriority,
    searchQuery,
  ]);

  // Group filtered tests by feature
  const groupedByFeature = useMemo(() => {
    const map = new Map<FeatureArea, TestCase[]>();
    for (const test of filteredTests) {
      const list = map.get(test.feature) ?? [];
      list.push(test);
      map.set(test.feature, list);
    }
    return map;
  }, [filteredTests]);

  // Global counts
  const totalCount = testCasesData.length;
  const automatableCount = testCasesData.filter(
    (t) => t.automationEligibility === "Automatable",
  ).length;
  const ignoredCount = testCasesData.filter(
    (t) => t.automationEligibility === "Ignored / Covered by E2E",
  ).length;
  const functionalCount = testCasesData.filter(
    (t) => t.scope === "Functional",
  ).length;
  const e2eCount = testCasesData.filter((t) => t.scope === "E2E").length;
  const mockCount = testCasesData.filter(
    (t) => t.isNetworkMockOrIntercept,
  ).length;
  const uiCount = testCasesData.filter((t) => t.type === "UI").length;
  const apiCount = testCasesData.filter((t) => t.type === "API").length;
  const p0Count = testCasesData.filter((t) => t.priority === "P0").length;

  const hasActiveFilters =
    selectedEligibility !== "All" ||
    selectedScope !== "All" ||
    selectedType !== "All" ||
    onlyMocks ||
    selectedFeature !== "All" ||
    selectedPriority !== "All" ||
    searchQuery.trim() !== "";

  function clearAllFilters() {
    setSelectedEligibility("All");
    setSelectedScope("All");
    setSelectedType("All");
    setOnlyMocks(false);
    setSelectedFeature("All");
    setSelectedPriority("All");
    setSearchQuery("");
    setCollapsedFeatures(new Set(allFeatures));
    setExpandedIds(new Set());
  }

  function handleFeatureTypeFilter(
    feature: FeatureArea,
    type: "All" | TestCaseType = "All",
  ) {
    if (selectedFeature === feature && selectedType === type) {
      setSelectedFeature("All");
      setSelectedType("All");
    } else {
      setSelectedFeature(feature);
      setSelectedType(type);
      setCollapsedFeatures((prev) => {
        const next = new Set(prev);
        next.delete(feature);
        return next;
      });
    }
  }

  function toggleExpand(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function toggleFeature(feature: FeatureArea) {
    setCollapsedFeatures((prev) => {
      const next = new Set(prev);
      if (next.has(feature)) {
        next.delete(feature);
      } else {
        next.add(feature);
      }
      return next;
    });
  }

  function expandAllFeatures() {
    setCollapsedFeatures(new Set());
  }

  function collapseAllFeatures() {
    setCollapsedFeatures(new Set(allFeatures));
  }

  function expandAll() {
    setExpandedIds(new Set(filteredTests.map((t) => t.id)));
    setCollapsedFeatures(new Set());
  }

  function collapseAll() {
    setExpandedIds(new Set());
  }

  function exportCsv() {
    const headers = [
      "Test ID",
      "Title",
      "Scope",
      "Automation Status",
      "Ignored Reason",
      "Network Mock",
      "Primary Feature",
      "Covered Features",
      "Type",
      "Priority",
      "Endpoint/Route",
      "Description",
      "Steps and Expected Results",
      "BDD Gherkin",
      "Data-Driven Matrix",
      "Test Data",
      "Automation Tool",
    ];

    const escape = (val: string) => `"${(val || "").replace(/"/g, '""')}"`;

    const rows = filteredTests.map((t) => [
      escape(t.id),
      escape(t.title),
      escape(t.scope),
      escape(t.automationEligibility),
      escape(t.ignoredReason || ""),
      escape(t.isNetworkMockOrIntercept ? "Yes" : "No"),
      escape(t.feature),
      escape(t.coveredFeatures ? t.coveredFeatures.join(" -> ") : t.feature),
      escape(t.type),
      escape(t.priority),
      escape(t.endpointOrRoute),
      escape(t.description),
      escape(
        t.steps
          .map(
            (s) =>
              `Step ${s.step}: [Action] ${s.action} => [Expected] ${s.expectedResult}`,
          )
          .join(" | "),
      ),
      escape(
        `GIVEN: ${t.bddScenario.given.join(", ")} | WHEN: ${t.bddScenario.when.join(", ")} | THEN: ${t.bddScenario.then.join(", ")}`,
      ),
      escape(
        t.dataDrivenDataset
          .map(
            (d) =>
              `[${d.scenario}] Inputs: ${JSON.stringify(d.inputs)} => Expected: ${d.expected}`,
          )
          .join(" | "),
      ),
      escape(
        t.uiTestData
          ? `${t.uiTestData.title}\n${t.uiTestData.items.map((i) => `${i.label} : ${i.value}`).join("\n")}`
          : JSON.stringify(t.apiTestData || {}, null, 2),
      ),
      escape(t.automationTool),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((r) => r.join(",")),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `commerce-ops-test-cases-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function exportExcel() {
    const headers = [
      "Test ID",
      "Title",
      "Scope",
      "Automation Status",
      "Ignored Reason",
      "Network Mock",
      "Primary Feature",
      "Covered Features",
      "Type",
      "Priority",
      "Endpoint/Route",
      "Description",
      "Steps and Expected Results",
      "BDD Gherkin",
      "Data-Driven Matrix",
      "Test Data",
      "Automation Tool",
    ];

    const xmlEscape = (val: string) =>
      (val || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");

    const headerXml = headers
      .map(
        (h) =>
          `<Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">${xmlEscape(h)}</Data></Cell>`,
      )
      .join("");

    const rowsXml = filteredTests
      .map((t) => {
        const cells = [
          t.id,
          t.title,
          t.scope,
          t.automationEligibility,
          t.ignoredReason || "",
          t.isNetworkMockOrIntercept ? "Yes" : "No",
          t.feature,
          t.coveredFeatures ? t.coveredFeatures.join(" -> ") : t.feature,
          t.type,
          t.priority,
          t.endpointOrRoute,
          t.description,
          t.steps
            .map(
              (s) =>
                `Step ${s.step}: [Action] ${s.action} => [Expected] ${s.expectedResult}`,
            )
            .join(" | "),
          `GIVEN: ${t.bddScenario.given.join(", ")} | WHEN: ${t.bddScenario.when.join(", ")} | THEN: ${t.bddScenario.then.join(", ")}`,
          t.dataDrivenDataset
            .map(
              (d) =>
                `[${d.scenario}] Inputs: ${JSON.stringify(d.inputs)} => Expected: ${d.expected}`,
            )
            .join(" | "),
          t.uiTestData
            ? `${t.uiTestData.title}\n${t.uiTestData.items.map((i) => `${i.label} : ${i.value}`).join("\n")}`
            : JSON.stringify(t.apiTestData || {}, null, 2),
          t.automationTool,
        ];

        return `<Row ss:AutoFitHeight="1">${cells.map((c) => `<Cell ss:StyleID="DefaultStyle"><Data ss:Type="String">${xmlEscape(c)}</Data></Cell>`).join("")}</Row>`;
      })
      .join("\n");

    const excelXml = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <Styles>
  <Style ss:ID="Default" ss:Name="Normal">
   <Alignment ss:Vertical="Top" ss:WrapText="1"/>
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#1E293B"/>
  </Style>
  <Style ss:ID="DefaultStyle">
   <Alignment ss:Vertical="Top" ss:WrapText="1"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
   </Borders>
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#1E293B"/>
  </Style>
  <Style ss:ID="HeaderStyle">
   <Alignment ss:Vertical="Center" ss:WrapText="1"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
   </Borders>
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Bold="1" ss:Color="#0F172A"/>
   <Interior ss:Color="#F1F5F9" ss:Pattern="Solid"/>
  </Style>
 </Styles>
 <Worksheet ss:Name="Test Cases">
  <Table ss:DefaultColumnWidth="120" ss:DefaultRowHeight="20">
   <Column ss:Width="110"/>
   <Column ss:Width="200"/>
   <Column ss:Width="80"/>
   <Column ss:Width="110"/>
   <Column ss:Width="150"/>
   <Column ss:Width="90"/>
   <Column ss:Width="110"/>
   <Column ss:Width="160"/>
   <Column ss:Width="70"/>
   <Column ss:Width="70"/>
   <Column ss:Width="150"/>
   <Column ss:Width="240"/>
   <Column ss:Width="300"/>
   <Column ss:Width="280"/>
   <Column ss:Width="280"/>
   <Column ss:Width="220"/>
   <Column ss:Width="140"/>
   <Row ss:Height="24">
    ${headerXml}
   </Row>
   ${rowsXml}
  </Table>
 </Worksheet>
</Workbook>`;

    const blob = new Blob([excelXml], {
      type: "application/vnd.ms-excel;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `commerce-ops-test-cases-${Date.now()}.xls`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="grid gap-6">
      {/* Metric Cards Row */}
      <section className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6 w-full max-w-full min-w-0">
        <MetricCard label="100% Total Coverage" value={totalCount.toString()} />
        <MetricCard
          label="Automatable (CI/CD)"
          value={`${automatableCount} (${Math.round((automatableCount / totalCount) * 100)}%)`}
        />
        <MetricCard
          label="Ignored (Covered in E2E)"
          value={`${ignoredCount} (${Math.round((ignoredCount / totalCount) * 100)}%)`}
        />
        <MetricCard label="P0 Critical Scenarios" value={p0Count.toString()} />
        <MetricCard label="E2E Flows (All Feat)" value={e2eCount.toString()} />
        <MetricCard label="Network Mocks" value={mockCount.toString()} />
      </section>

      {/* Streamlined Control & Filter Panel */}
      <article className="w-full max-w-full min-w-0 rounded-[1.5rem] border border-[color:var(--border)] bg-[color:var(--surface)] p-3.5 sm:rounded-[1.75rem] sm:p-6 shadow-sm relative">
        {/* Header and Actions */}
        <div className="relative z-20 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
              100% Coverage QA Automation Scenarios
            </h2>
            <p className="mt-1 text-sm text-[color:var(--muted)]">
              Showing {filteredTests.length} of {totalCount} test cases. Every
              test includes Regular Steps, BDD (Gherkin), and Data-Driven
              specifications.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Single Expand / Collapse Dropdown */}
            <div
              ref={expandCollapseDropdownRef}
              className="relative inline-block text-left"
            >
              <button
                type="button"
                onClick={() => setIsExpandCollapseOpen((prev) => !prev)}
                aria-expanded={isExpandCollapseOpen}
                aria-haspopup="true"
                className="cursor-pointer inline-flex items-center gap-1.5 rounded-full border border-[color:var(--border)] bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-300"
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-slate-500"
                >
                  <polyline points="7 8 12 3 17 8" />
                  <polyline points="7 16 12 21 17 16" />
                  <line x1="12" y1="3" x2="12" y2="21" />
                </svg>
                <span>Expand / Collapse</span>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`transition-transform duration-150 ${isExpandCollapseOpen ? "rotate-180" : ""}`}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {isExpandCollapseOpen && (
                <div className="absolute right-0 z-50 mt-2 w-52 origin-top-right rounded-2xl border border-slate-200 bg-white p-2 shadow-xl ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Test Cases
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      expandAll();
                      setIsExpandCollapseOpen(false);
                    }}
                    className="cursor-pointer flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-xs font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                  >
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-slate-400 shrink-0"
                    >
                      <polyline points="15 3 21 3 21 9" />
                      <polyline points="9 21 3 21 3 15" />
                      <line x1="21" y1="3" x2="14" y2="10" />
                      <line x1="3" y1="21" x2="10" y2="14" />
                    </svg>
                    <span className="whitespace-nowrap">Expand All Tests</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      collapseAll();
                      setIsExpandCollapseOpen(false);
                    }}
                    className="cursor-pointer flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-xs font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                  >
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-slate-400 shrink-0"
                    >
                      <polyline points="4 14 10 14 10 20" />
                      <polyline points="20 10 14 10 14 4" />
                      <line x1="14" y1="10" x2="21" y2="3" />
                      <line x1="3" y1="21" x2="10" y2="14" />
                    </svg>
                    <span className="whitespace-nowrap">
                      Collapse All Tests
                    </span>
                  </button>

                  <div className="my-1.5 border-t border-slate-100" />

                  <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Feature Suites
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      expandAllFeatures();
                      setIsExpandCollapseOpen(false);
                    }}
                    className="cursor-pointer flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-xs font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                  >
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-slate-400 shrink-0"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                    <span className="whitespace-nowrap">
                      Expand All Features
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      collapseAllFeatures();
                      setIsExpandCollapseOpen(false);
                    }}
                    className="cursor-pointer flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-xs font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                  >
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-slate-400 shrink-0"
                    >
                      <polyline points="18 15 12 9 6 15" />
                    </svg>
                    <span className="whitespace-nowrap">
                      Collapse All Features
                    </span>
                  </button>
                </div>
              )}
            </div>
            {/* Single Export Dropdown with CSV and Excel options */}
            <div
              ref={exportDropdownRef}
              className="relative inline-block text-left"
            >
              <button
                type="button"
                onClick={() => setIsExportOpen((prev) => !prev)}
                aria-expanded={isExportOpen}
                aria-haspopup="true"
                className="cursor-pointer inline-flex items-center gap-1.5 rounded-full bg-slate-950 px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400"
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                <span>Export</span>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`transition-transform duration-150 ${isExportOpen ? "rotate-180" : ""}`}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {isExportOpen && (
                <div className="absolute right-0 z-50 mt-2 w-40 origin-top-right rounded-2xl border border-slate-200 bg-white p-2 shadow-xl ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-100">
                  <button
                    type="button"
                    onClick={() => {
                      exportCsv();
                      setIsExportOpen(false);
                    }}
                    className="cursor-pointer flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded bg-slate-100 font-mono text-[10px] font-bold text-slate-700">
                      CSV
                    </span>
                    <span>CSV</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      exportExcel();
                      setIsExportOpen(false);
                    }}
                    className="cursor-pointer flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-semibold text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-900"
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded bg-emerald-600 font-mono text-[10px] font-bold text-white">
                      XLS
                    </span>
                    <span>Excel</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Compact Filters Toolbar */}
        <div className="mt-5 border-t border-[color:var(--border)] pt-4">
          <div className="grid gap-3 sm:grid-cols-12 sm:items-center">
            {/* Search Input */}
            <div className="relative sm:col-span-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by test ID, title, route, assertion, feature..."
                className="w-full rounded-xl border border-[color:var(--border)] bg-white px-4 py-2 pl-9 text-xs text-slate-800 shadow-2xs outline-none transition focus:border-[color:var(--accent)] focus:ring-1 focus:ring-[color:var(--accent)]"
              />
              <svg
                className="absolute left-3 top-2.5 text-slate-400"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="cursor-pointer absolute right-2.5 top-2 text-xs font-bold text-slate-400 hover:text-slate-600"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Automation Eligibility Dropdown */}
            <div className="sm:col-span-2">
              <select
                value={selectedEligibility}
                onChange={(e) =>
                  setSelectedEligibility(
                    e.target.value as "All" | AutomationEligibility,
                  )
                }
                className="cursor-pointer w-full rounded-xl border border-[color:var(--border)] bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs outline-none transition focus:border-[color:var(--accent)]"
              >
                <option value="All">All Statuses ({totalCount})</option>
                <option value="Automatable">
                  Automatable ({automatableCount})
                </option>
                <option value="Ignored / Covered by E2E">
                  Covered in E2E ({ignoredCount})
                </option>
              </select>
            </div>

            {/* Scope Dropdown */}
            <div className="sm:col-span-2">
              <select
                value={selectedScope}
                onChange={(e) =>
                  setSelectedScope(e.target.value as "All" | TestScope)
                }
                className="cursor-pointer w-full rounded-xl border border-[color:var(--border)] bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs outline-none transition focus:border-[color:var(--accent)]"
              >
                <option value="All">All Scopes</option>
                <option value="Functional">
                  Functional ({functionalCount})
                </option>
                <option value="E2E">E2E Flows ({e2eCount})</option>
              </select>
            </div>

            {/* Type Dropdown */}
            <div className="sm:col-span-2">
              <select
                value={selectedType}
                onChange={(e) =>
                  setSelectedType(e.target.value as "All" | TestCaseType)
                }
                className="cursor-pointer w-full rounded-xl border border-[color:var(--border)] bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs outline-none transition focus:border-[color:var(--accent)]"
              >
                <option value="All">All Types</option>
                <option value="UI">UI Tests ({uiCount})</option>
                <option value="API">API Tests ({apiCount})</option>
              </select>
            </div>

            {/* Priority & Mock Controls */}
            <div className="flex items-center gap-2 sm:col-span-2">
              <select
                value={selectedPriority}
                onChange={(e) =>
                  setSelectedPriority(
                    e.target.value as "All" | TestCasePriority,
                  )
                }
                className="cursor-pointer w-full rounded-xl border border-[color:var(--border)] bg-white px-2.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs outline-none transition focus:border-[color:var(--accent)]"
              >
                <option value="All">All Priorities</option>
                <option value="P0">P0 - Critical</option>
                <option value="P1">P1 - High</option>
                <option value="P2">P2 - Medium</option>
              </select>

              <button
                type="button"
                onClick={() => setOnlyMocks(!onlyMocks)}
                title="Toggle network mock tests only"
                className={`cursor-pointer shrink-0 rounded-xl px-2.5 py-2 text-xs font-semibold transition ${
                  onlyMocks
                    ? "bg-cyan-600 text-white shadow-sm"
                    : "border border-[color:var(--border)] bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                Network Mocks ({mockCount})
              </button>
            </div>
          </div>

          {/* Feature Domain Chips Bar */}
          <div className="mt-3 flex flex-wrap items-center gap-1.5 pt-3 border-t border-[color:var(--border)]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1">
              Feature:
            </span>
            <button
              type="button"
              onClick={() => setSelectedFeature("All")}
              className={`cursor-pointer rounded-full px-3 py-1 text-xs font-medium transition ${
                selectedFeature === "All"
                  ? "bg-slate-900 text-white shadow-2xs font-semibold"
                  : "bg-white border border-[color:var(--border)] text-slate-700 hover:bg-slate-50"
              }`}
            >
              All Features ({totalCount})
            </button>
            {allFeatures.map((feat) => {
              const countInFeat = testCasesData.filter(
                (t) =>
                  t.feature === feat &&
                  (selectedEligibility === "All" ||
                    t.automationEligibility === selectedEligibility) &&
                  (selectedScope === "All" || t.scope === selectedScope) &&
                  (selectedType === "All" || t.type === selectedType),
              ).length;
              const isActive = selectedFeature === feat;

              return (
                <button
                  key={feat}
                  type="button"
                  onClick={() => {
                    setSelectedFeature(feat);
                    setCollapsedFeatures((prev) => {
                      const next = new Set(prev);
                      next.delete(feat);
                      return next;
                    });
                  }}
                  className={`cursor-pointer inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition ${
                    isActive
                      ? "bg-[color:var(--accent)] text-white shadow-2xs font-semibold"
                      : "bg-white border border-[color:var(--border)] text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span>{feat}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                      isActive
                        ? "bg-white/30 text-white"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {countInFeat}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl bg-slate-100/80 p-2 text-xs">
              <span className="font-semibold text-slate-600">
                Active Filters:
              </span>
              {selectedEligibility !== "All" && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 font-semibold text-emerald-900">
                  Status: {selectedEligibility}
                  <button
                    type="button"
                    onClick={() => setSelectedEligibility("All")}
                    className="cursor-pointer font-bold hover:text-emerald-950"
                  >
                    ✕
                  </button>
                </span>
              )}
              {onlyMocks && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-100 px-2.5 py-0.5 font-semibold text-cyan-900">
                  Network Mocks Only
                  <button
                    type="button"
                    onClick={() => setOnlyMocks(false)}
                    className="cursor-pointer font-bold hover:text-cyan-950"
                  >
                    ✕
                  </button>
                </span>
              )}
              {selectedScope !== "All" && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-100 px-2.5 py-0.5 font-semibold text-indigo-900">
                  Scope: {selectedScope}
                  <button
                    type="button"
                    onClick={() => setSelectedScope("All")}
                    className="cursor-pointer font-bold hover:text-indigo-950"
                  >
                    ✕
                  </button>
                </span>
              )}
              {selectedType !== "All" && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-100 px-2.5 py-0.5 font-semibold text-sky-800">
                  Type: {selectedType}
                  <button
                    type="button"
                    onClick={() => setSelectedType("All")}
                    className="cursor-pointer font-bold hover:text-sky-950"
                  >
                    ✕
                  </button>
                </span>
              )}
              {selectedFeature !== "All" && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-200 px-2.5 py-0.5 font-semibold text-slate-800">
                  Feature: {selectedFeature}
                  <button
                    type="button"
                    onClick={() => setSelectedFeature("All")}
                    className="cursor-pointer font-bold hover:text-slate-950"
                  >
                    ✕
                  </button>
                </span>
              )}
              {selectedPriority !== "All" && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-0.5 font-semibold text-amber-800">
                  Priority: {selectedPriority}
                  <button
                    type="button"
                    onClick={() => setSelectedPriority("All")}
                    className="cursor-pointer font-bold hover:text-amber-950"
                  >
                    ✕
                  </button>
                </span>
              )}
              {searchQuery.trim() && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-200 px-2.5 py-0.5 font-semibold text-slate-800">
                  &quot;{searchQuery}&quot;
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="cursor-pointer font-bold hover:text-slate-950"
                  >
                    ✕
                  </button>
                </span>
              )}
              <button
                type="button"
                onClick={clearAllFilters}
                className="cursor-pointer text-xs font-semibold text-rose-700 underline underline-offset-2 hover:text-rose-900"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </article>

      {/* Feature-Level Grouped Test Cases */}
      {filteredTests.length === 0 ? (
        <article className="rounded-[1.5rem] border border-dashed border-[color:var(--border)] bg-[color:var(--surface)] p-8 text-center sm:p-12">
          <p className="text-lg font-semibold text-slate-700">
            No test cases found matching your criteria.
          </p>
          <p className="mt-2 text-sm text-[color:var(--muted)]">
            Try adjusting your search terms or clearing one of the active
            filters.
          </p>
          <button
            type="button"
            onClick={clearAllFilters}
            className="cursor-pointer mt-4 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Reset Filters
          </button>
        </article>
      ) : (
        allFeatures.map((featureName) => {
          const featureTests = groupedByFeature.get(featureName);
          if (!featureTests || featureTests.length === 0) return null;

          const rawFeatTests = testCasesData.filter(
            (t) => t.feature === featureName,
          );

          const isFeatureCollapsed = collapsedFeatures.has(featureName);

          return (
            <article
              key={featureName}
              className="w-full max-w-full min-w-0 overflow-hidden rounded-[1.5rem] border border-[color:var(--border)] bg-[color:var(--surface)] p-3.5 sm:rounded-[1.75rem] sm:p-6 shadow-sm"
            >
              {/* Feature Header (Clickable Anywhere to Toggle + Pure Chevron) */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => toggleFeature(featureName)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleFeature(featureName);
                  }
                }}
                className={`group cursor-pointer flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between w-full max-w-full min-w-0 select-none ${
                  !isFeatureCollapsed
                    ? "border-b border-[color:var(--border)] pb-4"
                    : ""
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-[color:var(--accent)] transition">
                      {featureName}
                    </h3>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                      {featureTests.length === rawFeatTests.length
                        ? `${featureTests.length} tests`
                        : `${featureTests.length} of ${rawFeatTests.length} tests`}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-[color:var(--muted)] sm:text-sm">
                    {featureDescriptions[featureName]}
                  </p>
                </div>
                {/* Feature-Level Chevron */}
                <div className="flex items-center shrink-0">
                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[color:var(--surface-strong)] text-slate-600 border border-[color:var(--border)] transition duration-200 group-hover:bg-slate-200/80"
                    title={
                      isFeatureCollapsed
                        ? `Expand ${featureName} test cases`
                        : `Collapse ${featureName} test cases`
                    }
                    aria-label={
                      isFeatureCollapsed
                        ? `Expand ${featureName}`
                        : `Collapse ${featureName}`
                    }
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`transition-transform duration-200 ${
                        !isFeatureCollapsed ? "rotate-180" : ""
                      }`}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </span>
                </div>
              </div>

              {/* Test Case Cards */}
              {!isFeatureCollapsed && (
                <div className="mt-4 grid gap-3">
                  {featureTests.map((tc) => {
                    const isExpanded = expandedIds.has(tc.id);
                    const activeTab = cardTabs[tc.id] ?? "regular";

                    // Prepare BDD Gherkin text for clipboard
                    const gherkinText = [
                      ...tc.bddScenario.given.map((g) => `GIVEN ${g}`),
                      ...tc.bddScenario.when.map((w) => `WHEN ${w}`),
                      ...tc.bddScenario.then.map((t) => `THEN ${t}`),
                      ...(tc.bddScenario.and
                        ? tc.bddScenario.and.map((a) => `AND ${a}`)
                        : []),
                    ].join("\n");

                    // Prepare UI text data string for clipboard
                    const uiDataText = tc.uiTestData
                      ? `${tc.uiTestData.title}\n${tc.uiTestData.items.map((it) => `${it.label} : ${it.value}`).join("\n")}`
                      : "";

                    return (
                      <div
                        key={tc.id}
                        className="w-full max-w-full min-w-0 overflow-hidden rounded-2xl border border-[color:var(--border)] bg-white transition hover:border-slate-300 shadow-2xs"
                      >
                        {/* Card Header (Responsive Inline Badges + Unbolded Title) */}
                        <button
                          type="button"
                          onClick={() => toggleExpand(tc.id)}
                          className="cursor-pointer flex w-full min-w-0 items-start justify-between gap-2.5 p-3.5 sm:p-4 text-left"
                        >
                          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                            {/* Badges Row - wraps gracefully on mobile without stacking 1-by-1 */}
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="font-mono text-xs font-bold text-slate-700">
                                {tc.id}
                              </span>

                              {/* Status Badge */}
                              <span
                                className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[11px] sm:text-xs font-semibold ${
                                  tc.automationEligibility === "Automatable"
                                    ? "bg-emerald-100 text-emerald-900 border border-emerald-200"
                                    : "bg-amber-100 text-amber-900 border border-amber-200"
                                }`}
                              >
                                {tc.automationEligibility === "Automatable"
                                  ? "✓ Automatable"
                                  : "Covered in E2E"}
                              </span>

                              {/* Scope Badge */}
                              <span
                                className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[11px] sm:text-xs font-semibold ${
                                  tc.scope === "E2E"
                                    ? "border border-indigo-200 bg-indigo-100 text-indigo-900"
                                    : "bg-slate-100 text-slate-700"
                                }`}
                              >
                                {tc.scope === "E2E" ? "E2E Flow" : "Functional"}
                              </span>

                              {/* Type Badge */}
                              <span
                                className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[11px] sm:text-xs font-semibold ${
                                  tc.type === "UI"
                                    ? "bg-sky-100 text-sky-800"
                                    : "bg-purple-100 text-purple-800"
                                }`}
                              >
                                {tc.type}
                              </span>

                              {/* Network Mock Badge */}
                              {tc.isNetworkMockOrIntercept && (
                                <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-cyan-200 bg-cyan-100 px-2 py-0.5 text-[11px] sm:text-xs font-semibold text-cyan-900">
                                  Network Mock
                                </span>
                              )}

                              {/* Priority Badge */}
                              <span
                                className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] sm:text-xs font-semibold ${
                                  tc.priority === "P0"
                                    ? "bg-rose-100 text-rose-800"
                                    : tc.priority === "P1"
                                      ? "bg-amber-100 text-amber-800"
                                      : "bg-slate-100 text-slate-700"
                                }`}
                              >
                                {tc.priority}
                              </span>
                            </div>

                            {/* UNBOLD TEST TITLE: Clean wrap, break-words, never forces container width */}
                            <span className="break-words text-sm font-normal text-slate-800 sm:text-base leading-snug">
                              {tc.title}
                            </span>
                          </div>

                          {/* Chevron */}
                          <span className="mt-0.5 ml-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[color:var(--surface-strong)] text-slate-600 transition">
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className={`transition-transform duration-200 ${
                                isExpanded ? "rotate-180" : ""
                              }`}
                            >
                              <polyline points="6 9 12 15 18 9" />
                            </svg>
                          </span>
                        </button>

                        {/* Expanded Details */}
                        {isExpanded && (
                          <div className="border-t border-[color:var(--border)] bg-[color:var(--surface-strong)] p-4 sm:p-5">
                            {/* Unbolded Title in Body */}
                            <h4 className="text-base font-medium text-slate-800">
                              {tc.title}
                            </h4>
                            <p className="mt-1 text-sm text-slate-600">
                              {tc.description}
                            </p>

                            {/* Ignored Reason Callout */}
                            {tc.automationEligibility ===
                              "Ignored / Covered by E2E" &&
                              tc.ignoredReason && (
                                <div className="mt-3.5 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50/90 p-3 text-xs text-amber-950">
                                  <span className="font-bold text-amber-700">
                                    ℹ️ CI / Automation Rationale:
                                  </span>
                                  <span className="flex-1 leading-relaxed">
                                    {tc.ignoredReason}
                                  </span>
                                </div>
                              )}

                            {/* E2E Covered Features Flow Banner */}
                            {tc.coveredFeatures &&
                              tc.coveredFeatures.length > 0 && (
                                <div className="mt-4 rounded-xl border border-indigo-100 bg-indigo-50/80 p-3">
                                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-950">
                                      Cross-Feature User Journey:
                                    </span>
                                    <span className="text-[11px] text-indigo-700">
                                      Spans {tc.coveredFeatures.length} feature
                                      domains
                                    </span>
                                  </div>
                                  <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs">
                                    {tc.coveredFeatures.map((feat, idx) => (
                                      <span
                                        key={feat}
                                        className="inline-flex items-center gap-1.5"
                                      >
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleFeatureTypeFilter(
                                              feat,
                                              "All",
                                            );
                                          }}
                                          title={`Click to filter by ${feat}`}
                                          className="cursor-pointer rounded-lg border border-indigo-200 bg-white px-2.5 py-1 text-xs font-semibold text-indigo-900 shadow-2xs transition hover:bg-indigo-100"
                                        >
                                          {feat}
                                        </button>
                                        {idx <
                                          tc.coveredFeatures!.length - 1 && (
                                          <span className="font-bold text-indigo-400">
                                            →
                                          </span>
                                        )}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                            {/* Route and Automation Tool */}
                            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                              <div>
                                <span className="text-xs font-semibold uppercase tracking-wider text-[color:var(--muted)]">
                                  Target Route / Endpoint:
                                </span>
                                <div className="mt-1 flex items-center gap-2">
                                  <code className="max-w-full break-all rounded-lg bg-slate-900 px-2.5 py-1 text-xs font-medium text-emerald-400 font-mono">
                                    {tc.endpointOrRoute}
                                  </code>
                                  <CopyButton text={tc.endpointOrRoute} />
                                </div>
                              </div>

                              <div>
                                <span className="text-xs font-semibold uppercase tracking-wider text-[color:var(--muted)]">
                                  Recommended Automation Tool:
                                </span>
                                <p className="mt-1 text-xs font-semibold text-slate-800">
                                  {tc.automationTool}
                                </p>
                              </div>
                            </div>

                            {/* Network Interception & Mocking Details (Plain explanation, NO code snippets) */}
                            {tc.mockDetails && (
                              <div className="mt-4 rounded-xl border border-cyan-200 bg-cyan-50/70 p-3.5 text-xs text-cyan-950">
                                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-cyan-200/80 pb-2">
                                  <div className="flex items-center gap-2">
                                    <span className="flex h-2 w-2 rounded-full bg-cyan-600" />
                                    <span className="font-bold uppercase tracking-wider text-cyan-950">
                                      Network Interception & Mocking Strategy:
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="rounded bg-cyan-100 px-2 py-0.5 font-mono text-[11px] font-semibold text-cyan-900 border border-cyan-300">
                                      Status: {tc.mockDetails.mockStatus}
                                    </span>
                                    <span className="break-all rounded bg-white px-2 py-0.5 font-mono text-[11px] text-cyan-800 border border-cyan-200">
                                      {tc.mockDetails.routePattern}
                                    </span>
                                  </div>
                                </div>
                                <p className="mt-2 text-xs leading-relaxed text-cyan-900">
                                  {tc.mockDetails.behavior}
                                </p>
                              </div>
                            )}

                            {/* Preconditions */}
                            {tc.preconditions &&
                              tc.preconditions.length > 0 && (
                                <div className="mt-4">
                                  <span className="text-xs font-semibold uppercase tracking-wider text-[color:var(--muted)]">
                                    Preconditions:
                                  </span>
                                  <ul className="mt-1 list-disc pl-5 text-xs text-slate-600">
                                    {tc.preconditions.map((pre, idx) => (
                                      <li key={idx}>{pre}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                            {/* CARD-LEVEL TEST SPECIFICATION STYLE SELECTOR (Single-Select Tabs) */}
                            <div className="mt-5 sm:mt-6 rounded-2xl border border-[color:var(--border)] bg-white p-3 sm:p-4 shadow-xs w-full max-w-full min-w-0 overflow-hidden">
                              <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-3">
                                <div>
                                  <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                                    Test Specification Format:
                                  </span>
                                </div>

                                {/* Single-Select Tabs with max-w-full overflow-x-auto so it never causes horizontal blowout */}
                                <div className="flex max-w-full overflow-x-auto items-center rounded-xl bg-slate-100 p-1 no-scrollbar">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setCardTabs((prev) => ({
                                        ...prev,
                                        [tc.id]: "regular",
                                      }))
                                    }
                                    className={`cursor-pointer shrink-0 whitespace-nowrap rounded-lg px-2.5 sm:px-3 py-1.5 text-xs font-semibold transition ${
                                      activeTab === "regular"
                                        ? "bg-white text-slate-900 shadow-2xs"
                                        : "text-slate-600 hover:text-slate-900"
                                    }`}
                                  >
                                    Regular Test Case
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setCardTabs((prev) => ({
                                        ...prev,
                                        [tc.id]: "bdd",
                                      }))
                                    }
                                    className={`cursor-pointer shrink-0 whitespace-nowrap rounded-lg px-2.5 sm:px-3 py-1.5 text-xs font-semibold transition ${
                                      activeTab === "bdd"
                                        ? "bg-white text-violet-900 shadow-2xs"
                                        : "text-slate-600 hover:text-slate-900"
                                    }`}
                                  >
                                    BDD (Gherkin)
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setCardTabs((prev) => ({
                                        ...prev,
                                        [tc.id]: "dataDriven",
                                      }))
                                    }
                                    className={`cursor-pointer shrink-0 whitespace-nowrap rounded-lg px-2.5 sm:px-3 py-1.5 text-xs font-semibold transition ${
                                      activeTab === "dataDriven"
                                        ? "bg-white text-orange-900 shadow-2xs"
                                        : "text-slate-600 hover:text-slate-900"
                                    }`}
                                  >
                                    Data Driven
                                  </button>
                                </div>
                              </div>

                              {/* 1. REGULAR TEST CASE VIEW (Only shown when activeTab === 'regular') */}
                              {activeTab === "regular" && (
                                <div className="mt-3">
                                  <div className="mb-2.5 flex items-center justify-between">
                                    <span className="text-xs font-semibold text-slate-700">
                                      Step-by-Step Actions & Paired Expected
                                      Results:
                                    </span>
                                    <span className="text-[11px] text-[color:var(--muted)]">
                                      {tc.steps.length}{" "}
                                      {tc.steps.length === 1 ? "step" : "steps"}
                                    </span>
                                  </div>

                                  <div className="overflow-hidden rounded-xl border border-[color:var(--border)] bg-white shadow-2xs">
                                    <div className="hidden grid-cols-12 border-b border-[color:var(--border)] bg-slate-50 px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-500 md:grid">
                                      <div className="col-span-1">#</div>
                                      <div className="col-span-6">
                                        Action / Test Step
                                      </div>
                                      <div className="col-span-5">
                                        Expected Result / Assertion
                                      </div>
                                    </div>

                                    <div className="divide-y divide-[color:var(--border)]">
                                      {tc.steps.map((s) => (
                                        <div
                                          key={s.step}
                                          className="grid grid-cols-1 gap-2.5 p-3 text-xs transition hover:bg-slate-50/70 md:grid-cols-12 md:gap-4 md:p-3"
                                        >
                                          <div className="flex items-start gap-2.5 md:col-span-7">
                                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-900 font-mono text-[10px] font-bold text-white shadow-2xs">
                                              {s.step}
                                            </span>
                                            <div className="min-w-0 flex-1 pt-0.5 leading-relaxed font-medium text-slate-800">
                                              <span className="mr-1.5 font-bold text-slate-500 md:hidden">
                                                Action:
                                              </span>
                                              {s.action}
                                            </div>
                                          </div>

                                          <div className="rounded-lg border border-emerald-200/80 bg-emerald-50/90 p-2.5 md:col-span-5 md:border-0 md:bg-transparent md:p-0">
                                            <div className="flex items-start gap-1.5 text-emerald-950">
                                              <span className="shrink-0 font-bold text-emerald-600">
                                                ✓
                                              </span>
                                              <div className="min-w-0 flex-1 leading-relaxed">
                                                <span className="mr-1.5 font-bold text-emerald-800 md:hidden">
                                                  Expected:
                                                </span>
                                                <span className="font-normal text-slate-700 md:text-emerald-950">
                                                  {s.expectedResult}
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* 2. BDD GHERKIN VIEW (Only shown when activeTab === 'bdd') */}
                              {activeTab === "bdd" && (
                                <div className="mt-3 rounded-xl border border-violet-200 bg-violet-50/70 p-3.5 text-xs">
                                  <div className="flex items-center justify-between border-b border-violet-200/80 pb-2">
                                    <span className="font-bold uppercase tracking-wider text-violet-950">
                                      BDD Gherkin Scenario Specification:
                                    </span>
                                    <CopyButton text={gherkinText} />
                                  </div>
                                  <div className="mt-2.5 space-y-1 font-mono text-xs">
                                    {tc.bddScenario.given.map((g, i) => (
                                      <div key={i} className="text-slate-800">
                                        <span className="font-bold text-violet-700">
                                          GIVEN
                                        </span>{" "}
                                        {g}
                                      </div>
                                    ))}
                                    {tc.bddScenario.when.map((w, i) => (
                                      <div key={i} className="text-slate-800">
                                        <span className="font-bold text-sky-700">
                                          WHEN
                                        </span>{" "}
                                        {w}
                                      </div>
                                    ))}
                                    {tc.bddScenario.then.map((t, i) => (
                                      <div key={i} className="text-slate-800">
                                        <span className="font-bold text-emerald-700">
                                          THEN
                                        </span>{" "}
                                        {t}
                                      </div>
                                    ))}
                                    {tc.bddScenario.and &&
                                      tc.bddScenario.and.map((a, i) => (
                                        <div key={i} className="text-slate-800">
                                          <span className="font-bold text-purple-700">
                                            AND
                                          </span>{" "}
                                          {a}
                                        </div>
                                      ))}
                                  </div>
                                </div>
                              )}

                              {/* 3. DATA DRIVEN VIEW (Only shown when activeTab === 'dataDriven') */}
                              {activeTab === "dataDriven" && (
                                <div className="mt-3 overflow-hidden rounded-xl border border-orange-200 bg-white">
                                  <div className="flex items-center justify-between border-b border-orange-200 bg-orange-50/80 px-3.5 py-2">
                                    <span className="text-xs font-bold uppercase tracking-wider text-orange-950">
                                      Data-Driven Parameter Matrix (
                                      {tc.dataDrivenDataset.length} Scenarios):
                                    </span>
                                    <CopyButton
                                      text={JSON.stringify(
                                        tc.dataDrivenDataset,
                                        null,
                                        2,
                                      )}
                                    />
                                  </div>
                                  <div className="overflow-x-auto">
                                    <table className="min-w-[480px] w-full text-left text-xs">
                                      <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                        <tr>
                                          <th className="p-2.5">Scenario</th>
                                          <th className="p-2.5">
                                            Input Parameters
                                          </th>
                                          <th className="p-2.5">
                                            Expected Outcome
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-slate-100 text-slate-700">
                                        {tc.dataDrivenDataset.map((row, i) => (
                                          <tr
                                            key={i}
                                            className="hover:bg-orange-50/30"
                                          >
                                            <td className="p-2.5 font-semibold text-slate-900">
                                              {row.scenario}
                                            </td>
                                            <td className="p-2.5 font-mono text-[11px]">
                                              <div className="space-y-0.5">
                                                {Object.entries(row.inputs).map(
                                                  ([key, val]) => (
                                                    <div key={key}>
                                                      <span className="text-slate-500">
                                                        {key}:
                                                      </span>{" "}
                                                      <span className="font-medium text-slate-900">
                                                        {String(val)}
                                                      </span>
                                                    </div>
                                                  ),
                                                )}
                                              </div>
                                            </td>
                                            <td className="p-2.5 font-mono text-[11px] text-emerald-800">
                                              {row.expected}
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* TEST DATA SECTION (UI vs API) */}
                            {tc.type === "UI" && tc.uiTestData && (
                              /* Plain-Text Labeled UI Test Data (NOT JSON) */
                              <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                                  <div className="flex items-center gap-2">
                                    <svg
                                      width="14"
                                      height="14"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="text-slate-600"
                                    >
                                      <rect
                                        width="14"
                                        height="14"
                                        x="8"
                                        y="8"
                                        rx="2"
                                        ry="2"
                                      />
                                      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                    </svg>
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                                      UI Test Data:
                                    </span>
                                  </div>
                                  <CopyButton text={uiDataText} />
                                </div>

                                <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50/80 p-3.5">
                                  <div className="text-xs font-bold text-slate-900">
                                    {tc.uiTestData.title}
                                  </div>
                                  <div className="mt-2 space-y-1 font-mono text-xs text-slate-800">
                                    {tc.uiTestData.items.map((item, idx) => (
                                      <div
                                        key={idx}
                                        className="flex items-baseline gap-1.5"
                                      >
                                        <span className="text-slate-600">
                                          {item.label} :
                                        </span>
                                        <span className="font-semibold text-slate-950">
                                          {item.value}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}

                            {tc.type === "API" && tc.apiTestData && (
                              /* Beautified JSON API Test Data with Query/Path/Headers/Body Copy */
                              <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                                  <div className="flex items-center gap-2">
                                    <svg
                                      width="14"
                                      height="14"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="text-slate-600"
                                    >
                                      <rect
                                        width="14"
                                        height="14"
                                        x="8"
                                        y="8"
                                        rx="2"
                                        ry="2"
                                      />
                                      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                    </svg>
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                                      API Request Parameters & Test Data (JSON):
                                    </span>
                                  </div>
                                  <CopyButton
                                    text={JSON.stringify(
                                      tc.apiTestData,
                                      null,
                                      2,
                                    )}
                                  />
                                </div>

                                <div className="mt-3 grid gap-3 text-xs sm:grid-cols-2">
                                  {tc.apiTestData.pathParams && (
                                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-2.5">
                                      <div className="flex items-center justify-between pb-1 font-bold text-slate-700">
                                        <span>Path Parameters:</span>
                                        <CopyButton
                                          text={JSON.stringify(
                                            tc.apiTestData.pathParams,
                                            null,
                                            2,
                                          )}
                                        />
                                      </div>
                                      <pre className="overflow-x-auto rounded-md bg-slate-900 p-2.5 font-mono text-[11px] text-emerald-400">
                                        {JSON.stringify(
                                          tc.apiTestData.pathParams,
                                          null,
                                          2,
                                        )}
                                      </pre>
                                    </div>
                                  )}

                                  {tc.apiTestData.queryParams && (
                                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-2.5">
                                      <div className="flex items-center justify-between pb-1 font-bold text-slate-700">
                                        <span>Query Parameters:</span>
                                        <CopyButton
                                          text={JSON.stringify(
                                            tc.apiTestData.queryParams,
                                            null,
                                            2,
                                          )}
                                        />
                                      </div>
                                      <pre className="overflow-x-auto rounded-md bg-slate-900 p-2.5 font-mono text-[11px] text-emerald-400">
                                        {JSON.stringify(
                                          tc.apiTestData.queryParams,
                                          null,
                                          2,
                                        )}
                                      </pre>
                                    </div>
                                  )}

                                  {tc.apiTestData.headers && (
                                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-2.5">
                                      <div className="flex items-center justify-between pb-1 font-bold text-slate-700">
                                        <span>Headers:</span>
                                        <CopyButton
                                          text={JSON.stringify(
                                            tc.apiTestData.headers,
                                            null,
                                            2,
                                          )}
                                        />
                                      </div>
                                      <pre className="overflow-x-auto rounded-md bg-slate-900 p-2.5 font-mono text-[11px] text-emerald-400">
                                        {JSON.stringify(
                                          tc.apiTestData.headers,
                                          null,
                                          2,
                                        )}
                                      </pre>
                                    </div>
                                  )}

                                  {tc.apiTestData.requestBody && (
                                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-2.5">
                                      <div className="flex items-center justify-between pb-1 font-bold text-slate-700">
                                        <span>Request Body:</span>
                                        <CopyButton
                                          text={JSON.stringify(
                                            tc.apiTestData.requestBody,
                                            null,
                                            2,
                                          )}
                                        />
                                      </div>
                                      <pre className="overflow-x-auto rounded-md bg-slate-900 p-2.5 font-mono text-[11px] text-emerald-400">
                                        {JSON.stringify(
                                          tc.apiTestData.requestBody,
                                          null,
                                          2,
                                        )}
                                      </pre>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Selectors / Payload Elements */}
                            {tc.targetElements &&
                              tc.targetElements.length > 0 && (
                                <div className="mt-4">
                                  <span className="text-xs font-semibold uppercase tracking-wider text-[color:var(--muted)]">
                                    Relevant DOM Selectors / API References:
                                  </span>
                                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                                    {tc.targetElements.map((elem, idx) => (
                                      <span
                                        key={idx}
                                        className="rounded-md border border-[color:var(--border)] bg-white px-2 py-0.5 font-mono text-[11px] text-slate-600"
                                      >
                                        {elem}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </article>
          );
        })
      )}
    </div>
  );
}
