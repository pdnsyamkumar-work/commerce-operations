import { useRef, useState } from "react";
import type { Product } from "@/lib/store";
import type { TaskLane } from "./types";
import { MetricCard, SelectWrap, useClickOutside } from "./shared";

type ReportsPageProps = {
  products: Product[];
  cartItemsCount: number;
  activeProducts: Product[];
  draftProducts: Product[];
  lowStockProducts: Product[];
  cartTotal: number;
  productCategories: string[];
  filteredProducts: Product[];
  selectedCategory: string;
  selectedProductId: string;
  selectedProduct?: Product;
  selectedAuditChecks: string[];
  fulfillmentChannels: string[];
  shippingPriority: string;
  deliveryDate: string;
  riskScore: string;
  notificationsEnabled: boolean;
  taskBoard: Record<TaskLane, string[]>;
  draggedTask: string | null;
  onToggleAuditCheck: (id: string) => void;
  onFulfillmentChannelsChange: (channels: string[]) => void;
  onCategoryChange: (category: string) => void;
  onSelectedProductChange: (id: string) => void;
  onShippingPriorityChange: (value: string) => void;
  onDeliveryDateChange: (value: string) => void;
  onRiskScoreChange: (value: string) => void;
  onNotificationsEnabledChange: (value: boolean) => void;
  onOpenReviewDialog: () => void;
  onTaskDragStart: (task: string) => void;
  onMoveTask: (task: string, lane: TaskLane) => void;
};

const auditOptions = [
  { id: "pricing", label: "Pricing verified" },
  { id: "inventory", label: "Inventory reviewed" },
  { id: "media", label: "Product media attached" },
];

const channelOptions = [
  "Online Store",
  "Retail Counter",
  "Marketplace",
  "Partner Portal",
];

export function ReportsPage(props: ReportsPageProps) {
  return (
    <>
      <section className="grid gap-6 xl:grid-cols-4">
        <MetricCard
          label="Total Products"
          value={props.products.length.toString()}
        />
        <MetricCard
          label="Active Products"
          value={props.activeProducts.length.toString()}
        />
        <MetricCard
          label="Draft Products"
          value={props.draftProducts.length.toString()}
        />
        <MetricCard label="Cart Total" value={`$${props.cartTotal}`} />
        <article className="rounded-[1.75rem] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm xl:col-span-4">
          <h2 className="text-2xl font-semibold">Report details</h2>
          <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">
            Current cart contains {props.cartItemsCount} item records. Inventory
            has {props.lowStockProducts.length} low-stock products.
          </p>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <article className="rounded-[1.75rem] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm">
          <h2 className="text-2xl font-semibold">Operations review controls</h2>
          <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
            Capture product audit decisions, fulfillment channels, dispatch
            dates, and stock notification settings.
          </p>

          <fieldset className="mt-6 grid gap-3">
            <legend className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--muted)]">
              Product audit checklist
            </legend>
            {auditOptions.map((option) => (
              <label
                key={option.id}
                className="flex cursor-pointer items-center gap-3 rounded-2xl bg-white p-4"
              >
                <input
                  className="h-5 w-5 accent-slate-950"
                  type="checkbox"
                  checked={props.selectedAuditChecks.includes(option.id)}
                  onChange={() => props.onToggleAuditCheck(option.id)}
                />
                <span className="text-sm font-medium">{option.label}</span>
              </label>
            ))}
          </fieldset>

          <fieldset className="mt-6 grid gap-3">
            <legend className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--muted)]">
              Shipping priority
            </legend>
            {["standard", "express", "overnight"].map((priority) => (
              <label
                key={priority}
                className="flex cursor-pointer items-center gap-3 rounded-2xl bg-white p-4"
              >
                <input
                  className="h-5 w-5 accent-slate-950"
                  type="radio"
                  name="shipping-priority"
                  value={priority}
                  checked={props.shippingPriority === priority}
                  onChange={(event) =>
                    props.onShippingPriorityChange(event.target.value)
                  }
                />
                <span className="text-sm font-medium capitalize">
                  {priority}
                </span>
              </label>
            ))}
          </fieldset>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold">
              Fulfillment channels
              <MultiChannelDropdown
                selectedChannels={props.fulfillmentChannels}
                onChange={props.onFulfillmentChannelsChange}
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              Planned dispatch date
              <input
                className="rounded-2xl border border-[color:var(--border)] bg-white px-4 py-3"
                type="date"
                value={props.deliveryDate}
                onChange={(event) =>
                  props.onDeliveryDateChange(event.target.value)
                }
              />
            </label>
          </div>

          <div className="mt-6 grid gap-4 rounded-[1.4rem] bg-white p-4">
            <label className="flex items-center justify-between gap-4 text-sm font-semibold">
              Enable stock notifications
              <input
                className="h-5 w-10 accent-slate-950"
                type="checkbox"
                role="switch"
                checked={props.notificationsEnabled}
                onChange={(event) =>
                  props.onNotificationsEnabledChange(event.target.checked)
                }
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              Risk score: {props.riskScore}
              <input
                className="accent-slate-950"
                type="range"
                min="0"
                max="100"
                value={props.riskScore}
                onChange={(event) =>
                  props.onRiskScoreChange(event.target.value)
                }
              />
            </label>
          </div>
        </article>

        <article className="rounded-[1.75rem] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm">
          <h2 className="text-2xl font-semibold">Report product drilldown</h2>
          <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
            Filter by category to preview the product details used in the
            operations report.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold">
              Category
              <SelectWrap>
                <select
                  className="w-full appearance-none rounded-2xl border border-[color:var(--border)] bg-white px-4 py-3 pr-11"
                  value={props.selectedCategory}
                  onChange={(event) =>
                    props.onCategoryChange(event.target.value)
                  }
                >
                  <option value="">All categories</option>
                  {props.productCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </SelectWrap>
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              Product
              <SelectWrap>
                <select
                  className="w-full appearance-none rounded-2xl border border-[color:var(--border)] bg-white px-4 py-3 pr-11"
                  value={props.selectedProductId}
                  onChange={(event) =>
                    props.onSelectedProductChange(event.target.value)
                  }
                >
                  <option value="">Choose product</option>
                  {props.filteredProducts.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} ({product.productCode})
                    </option>
                  ))}
                </select>
              </SelectWrap>
            </label>
          </div>
          <div
            role="alert"
            className="mt-6 rounded-[1.4rem] border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"
          >
            Selected {props.selectedAuditChecks.length} checklist items,{" "}
            {props.fulfillmentChannels.length} channels, and{" "}
            {props.shippingPriority} shipping.
          </div>
          <button
            className="mt-5 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-lg"
            type="button"
            onClick={props.onOpenReviewDialog}
          >
            Submit Review Approval
          </button>
          <div className="mt-6 overflow-hidden rounded-[1.4rem] border border-[color:var(--border)] bg-white">
            <iframe
              className="h-64 w-full"
              title="Order preview"
              srcDoc={`<html><body style="font-family:Arial;padding:24px;background:#fff7ed;color:#111827"><h2>Order Preview</h2><p>Product: ${props.selectedProduct?.name ?? "No product selected"}</p><p>Priority: ${props.shippingPriority}</p><p>Risk score: ${props.riskScore}</p></body></html>`}
            />
          </div>
        </article>

        <article className="rounded-[1.75rem] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm xl:col-span-2">
          <h2 className="text-2xl font-semibold">Review task board</h2>
          <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
            Move operational review tasks between columns as work is completed.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {(["todo", "done"] as TaskLane[]).map((lane) => (
              <div
                key={lane}
                className="min-h-48 rounded-[1.4rem] border border-dashed border-[color:var(--border)] bg-white p-4"
                onDragOver={(event) => event.preventDefault()}
                onDrop={() =>
                  props.draggedTask && props.onMoveTask(props.draggedTask, lane)
                }
              >
                <h3 className="font-semibold capitalize">
                  {lane === "todo" ? "To do" : "Done"}
                </h3>
                <div className="mt-4 grid gap-3">
                  {props.taskBoard[lane].map((task) => (
                    <div
                      key={task}
                      className="cursor-grab rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-4 text-sm font-medium"
                      draggable
                      onDragStart={() => props.onTaskDragStart(task)}
                    >
                      {task}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>
    </>
  );
}

function MultiChannelDropdown({
  selectedChannels,
  onChange,
}: {
  selectedChannels: string[];
  onChange: (channels: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useClickOutside(dropdownRef, () => setOpen(false));
  const label = selectedChannels.length
    ? `${selectedChannels.length} channels selected`
    : "Choose channels";
  function toggleChannel(channel: string) {
    onChange(
      selectedChannels.includes(channel)
        ? selectedChannels.filter((item) => item !== channel)
        : [...selectedChannels, channel],
    );
  }

  return (
    <div ref={dropdownRef} className="relative">
      <button
        className="flex w-full items-center justify-between rounded-2xl border border-[color:var(--border)] bg-white px-4 py-3 text-left font-normal transition duration-200 hover:bg-slate-50"
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <span>{label}</span>
        <span>v</span>
      </button>
      {open && (
        <div className="absolute left-0 z-40 mt-2 w-full rounded-2xl border border-[color:var(--border)] bg-white p-2 shadow-xl">
          {channelOptions.map((channel) => (
            <label
              key={channel}
              className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-sm hover:bg-slate-100"
            >
              <input
                className="h-4 w-4 accent-slate-950"
                type="checkbox"
                checked={selectedChannels.includes(channel)}
                onChange={() => toggleChannel(channel)}
              />
              <span>{channel}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
